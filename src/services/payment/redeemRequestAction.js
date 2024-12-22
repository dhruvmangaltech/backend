import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { payoutActionPaynote } from '../../helpers/paynote'
import { TRANSACTION_PROVIDER, PRIZEOUT_ACTION_STATUS } from '../../utils/constants/payment'
import WalletEmitter from '../../socket-resources/emmitter/wallet.emmitter'
import { getAccessTokenTripleA, payoutActionTripleA } from '../../helpers/tripleA'
import { ROLE, STATUS_VALUE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'
import { payoutActionPrizeout, payoutRejectActionPrizeout } from '../../helpers/prizeout'
import { ERROR_MSG } from '../../utils/constants/errors'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    status: {
      type: 'string',
      enum: ['approved', 'rejected']
    },
    withdrawRequestId: { type: ['string', 'null'] },
    transactionId: { type: ['string', 'null'] },
    userId: { type: 'number' },
    reason: { type: ['string', 'null'] }
  },
  required: ['user', 'status', 'userId']
}

const constraints = ajv.compile(schema)

export class RedeemRequestActionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, status, withdrawRequestId, userId, reason, transactionId } = this.args
    const {
      WithdrawRequest: WithdrawRequestModel,
      User: UserModel,
      Wallet: WalletModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    let query, statusData, accessToken, extraData, paymentTransactionId
    let updateStatus = { status: TRANSACTION_STATUS.INPROGRESS }
    let txStatus = TRANSACTION_STATUS.CANCELED

    try {
      const userDetails = await UserModel.findOne({
        where: { userId },
        include: [{
          model: WalletModel,
          as: 'userWallet',
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          skipLocked: false
        }],
        attributes: ['userId', 'firstName', 'email', 'lastName', 'currencyCode', 'uniqueId'],
        transaction
      })
      if (!userDetails) return this.addError('UserNotExistsErrorType')

      if (transactionId && transactionId !== '') query = { transactionId }
      else if (withdrawRequestId && withdrawRequestId !== '') query = { withdrawRequestId }

      const withdrawRequestExists = await WithdrawRequestModel.findOne({
        attributes: ['transactionId', 'status', 'paymentProvider', 'moreDetails', 'amount'],
        where: { ...query, userId, status: TRANSACTION_STATUS.PENDING },
        lock: { level: transaction.LOCK.UPDATE, of: WithdrawRequestModel },
        skipLocked: true,
        transaction
      })
      if (!withdrawRequestExists || withdrawRequestExists?.status !== TRANSACTION_STATUS.PENDING) return this.addError('WithdrawRequestNotFoundErrorType')

      // withdrawRequestExists.reload({ lock: { level: transaction.LOCK.UPDATE, of: WithdrawRequestModel }, transaction })
      paymentTransactionId = withdrawRequestExists.transactionId

      if (status.toUpperCase() === STATUS_VALUE.APPROVED) txStatus = TRANSACTION_STATUS.SUCCESS
      else {
        txStatus = TRANSACTION_STATUS.CANCELED
        updateStatus = { status: TRANSACTION_STATUS.CANCELED }
      }

      if (txStatus === TRANSACTION_STATUS.SUCCESS) {
        if (withdrawRequestExists.paymentProvider === TRANSACTION_PROVIDER.TRIPLE_A) {
          accessToken = await getAccessTokenTripleA({ transactionType: TRANSACTION_TYPE.WITHDRAW })
          statusData = await payoutActionTripleA({ userDetails, withdrawRequest: withdrawRequestExists, accessToken })

          if (statusData) {
            paymentTransactionId = statusData?.payout_reference
            extraData = {
              orderId: statusData?.order_id,
              cryptoAmount: statusData?.crypto_amount,
              cryptoCurrency: statusData?.crypto_currency,
              networkFee: statusData?.network_fee_crypto_amount,
              netAmount: statusData?.net_crypto_amount,
              exchangeRate: statusData?.exchange_rate,
              cryptoAddress: statusData?.crypto_address
            }
          }
        } else if (withdrawRequestExists.paymentProvider === TRANSACTION_PROVIDER.PAYNOTE) {
          statusData = await payoutActionPaynote({ userDetails, withdrawRequest: withdrawRequestExists })
          if (statusData) {
            paymentTransactionId = statusData?.check?.number
            extraData = {
              checkId: statusData?.check?.check_id,
              identifier: statusData?.check?.identifier
            }
          }
        } else if (withdrawRequestExists.paymentProvider === TRANSACTION_PROVIDER.PRIZEOUT) {
          statusData = await payoutActionPrizeout({ withdrawRequest: withdrawRequestExists })
          if (statusData && statusData.status === PRIZEOUT_ACTION_STATUS.ACCEPTED) {
            extraData = { status: statusData?.status }
            const withdrawRequestData = await WithdrawRequestModel.findOne({
              attributes: ['transactionId', 'status'],
              where: {
                transactionId: statusData?.request_id
              }
            })
            if (withdrawRequestData.status === TRANSACTION_STATUS.SUCCESS) {
              delete updateStatus.status
            }
          } else {
            return { success: false, message: ERROR_MSG.FAILED }
          }
        }
      }

      if (txStatus === TRANSACTION_STATUS.CANCELED && withdrawRequestExists.paymentProvider === TRANSACTION_PROVIDER.PRIZEOUT) {
        statusData = await payoutRejectActionPrizeout({ withdrawRequest: withdrawRequestExists })
        if (statusData && statusData.status === PRIZEOUT_ACTION_STATUS.REJECTED) {
          extraData = { status: statusData?.status, cancelledBy: 'admin' }
          const withdrawRequestData = await WithdrawRequestModel.findOne({
            attributes: ['status', 'transactionId'],
            where: {
              transactionId: statusData?.request_id
            }
          })
          if (withdrawRequestData.status === TRANSACTION_STATUS.SUCCESS) {
            delete updateStatus.status
          }
        } else {
          return { success: false, message: ERROR_MSG.FAILED }
        }
      }

      if (!statusData) {
        txStatus = TRANSACTION_STATUS.CANCELED
        updateStatus = { status: TRANSACTION_STATUS.CANCELED }
        extraData = { cancelledBy: 'provider' }
      }

      await updateEntity({
        model: WithdrawRequestModel,
        data: {
          actionableId: user.adminUserId,
          actionableEmail: user.email,
          actionedAt: new Date(),
          transactionId: paymentTransactionId,
          ...updateStatus,
          moreDetails: { ...withdrawRequestExists.moreDetails, role: ROLE.ADMIN, ...extraData, reason }
        },
        values: { withdrawRequestId },
        transaction
      })

      if (txStatus === TRANSACTION_STATUS.CANCELED && withdrawRequestExists.paymentProvider !== TRANSACTION_PROVIDER.PRIZEOUT) {
        userDetails.userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: WalletModel }, transaction })
        await userDetails.userWallet.set({ scCoin: { ...userDetails.userWallet.scCoin, wsc: +(Math.round((+userDetails.userWallet.scCoin?.wsc + withdrawRequestExists?.amount) * 100) / 100).toFixed(2) } }).save({ transaction })

        WalletEmitter.emitUserWalletBalance({
          scCoin: (Math.round((+userDetails?.userWallet.scCoin?.psc + +userDetails?.userWallet.scCoin?.bsc + +userDetails?.userWallet.scCoin?.wsc + +withdrawRequestExists?.amount) * 100) / 100).toFixed(2),
          gcCoin: userDetails?.userWallet.gcCoin
        }, userDetails.userId)
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
