import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import { ERROR_MSG } from '../../../utils/constants/errors'
import { TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { getOne, updateEntity } from '../../../utils/crud'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'

const schema = {
  type: 'object',
  required: ['env', 'partner_user_id', 'giftcard_value', 'giftcard_data']
}

const constraints = ajv.compile(schema)

export class PrizeoutRejectService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { partner_user_id: partnerUserId, giftcard_cost: giftCardCost, request_id: requestId } = this.args

    const {
      WithdrawRequest: WithdrawRequestModel,
      User: UserModel,
      Wallet: WalletModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    const updateStatus = { status: TRANSACTION_STATUS.CANCELED }

    try {
      let userWallet = {}
      const query = { userId: +partnerUserId }
      const userDetails = await getOne({
        model: UserModel,
        data: query,
        attributes: ['userId', 'firstName', 'email', 'lastName', 'countryCode', 'moreDetails', 'referredBy', 'referralCode', 'isBan', 'isRestrict'],
        transaction
      })
      const withdrawRequestExists = await WithdrawRequestModel.findOne({
        attributes: ['withdrawRequestId', 'transactionId', 'status', 'paymentProvider', 'moreDetails', 'amount'],
        where: {
          userId: +partnerUserId,
          transactionId: requestId,
          status: TRANSACTION_STATUS.PENDING
        },
        lock: { level: transaction.LOCK.UPDATE, of: WithdrawRequestModel },
        skipLocked: true,
        transaction
      })
      if (!withdrawRequestExists || withdrawRequestExists?.status !== TRANSACTION_STATUS.PENDING) return this.addError('WithdrawRequestNotFoundErrorType')
      withdrawRequestExists.reload({ lock: { level: transaction.LOCK.UPDATE, of: WithdrawRequestModel }, transaction })

      await updateEntity({
        model: WithdrawRequestModel,
        data: {
          ...updateStatus
        },
        values: { withdrawRequestId: withdrawRequestExists.withdrawRequestId },
        transaction
      })

      userWallet = await WalletModel.findOne({
        where: { ownerId: +partnerUserId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: WalletModel }, transaction })

      userWallet.scCoin = { ...userWallet.scCoin, wsc: +(Math.round((+userWallet.scCoin?.wsc + +giftCardCost) * 100) / 100).toFixed(2) }

      await userWallet.save({ transaction })

      WalletEmitter.emitUserWalletBalance({
        scCoin: +(Math.round((+userWallet.scCoin?.psc + +userWallet.scCoin?.bsc + +userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
        gcCoin: userWallet.gcCoin
      }, userDetails.userId)

      await transaction.commit()
      return {
        success: true,
        statusCode: 200
      }
    } catch (error) {
      console.log(error)
      return { success: false, message: ERROR_MSG.SERVER_ERROR }
    }
  }
}
