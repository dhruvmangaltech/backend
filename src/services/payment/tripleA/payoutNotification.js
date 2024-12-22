import ajv from '../../../libs/ajv'
import { Op, Sequelize } from 'sequelize'
import { getOne } from '../../../utils/crud'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { ERRORS, ERROR_MSG } from '../../../utils/constants/errors'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import { EVENT_TYPE, STATUS, TRANSACTION_PROVIDER } from '../../../utils/constants/payment'
import { ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../../utils/constants/constant'

const schema = {
  type: 'object',
  required: ['event', 'type', 'status', 'local_amount']
}

const constraints = ajv.compile(schema)

export class PayoutNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { event, order_id: orderId, type, payout_reference: paymentReference, status, local_amount: amount, txId, ...moreDetails } = this.args
    if (!orderId) orderId = txId

    const {
      User: UserModel,
      Wallet: WalletModel,
      Country: CountryModel,
      WithdrawRequest: WithdrawRequestModel,
      TransactionBanking: TransactionBankingModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction

    let txStatus, afterBalance

    try {
      if (event === EVENT_TYPE.PAYOUT && type === 'withdraw' && status !== STATUS.NEW) {
        const requestDetails = await getOne({
          model: WithdrawRequestModel,
          data: {
            [Op.or]: { transactionId: { [Op.in]: [paymentReference, orderId] } },
            moreDetails: { [Op.contains]: Sequelize.literal(`'{ "orderId" : "${orderId}" }'::jsonb`) }
          },
          transaction
        })
        if (!requestDetails || ![TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS].includes(requestDetails.status)) {
          await transaction.rollback()
          return { success: false, status: 400, message: ERRORS.BAD_REQUEST }
        }

        const userDetails = await UserModel.findOne({
          where: { userId: requestDetails.userId },
          include: [{
            model: WalletModel,
            as: 'userWallet',
            lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
            skipLocked: false
          }],
          attributes: ['userId', 'firstName', 'email', 'lastName', 'countryCode'],
          transaction
        })

        if (!userDetails) {
          await transaction.rollback()
          return { success: false, status: 404, message: ERRORS.NOT_FOUND }
        }

        const userCountry = await getOne({ model: CountryModel, data: { countryId: userDetails?.countryCode }, attributes: ['code'], raw: true })
        userDetails.userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: WalletModel }, transaction })

        if (status === STATUS.CONFIRM || status === STATUS.DONE) {
          txStatus = TRANSACTION_STATUS.SUCCESS
          afterBalance = {
            gcCoin: +userDetails.userWallet.gcCoin,
            scCoin: +userDetails.userWallet.totalScCoin
          }
        } else if ([STATUS.CANCEL, STATUS.INVALID, STATUS.FAILED].includes(status)) {
          txStatus = TRANSACTION_STATUS.CANCELED
          afterBalance = {
            gcCoin: +userDetails.userWallet.gcCoin,
            scCoin: +userDetails.userWallet.totalScCoin + parseFloat(amount)
          }
        }

        if (txStatus) {
          await TransactionBankingModel.create({
            actioneeType: ROLE.USER,
            actioneeId: userDetails.userId,
            actioneeEmail: userDetails.email,
            actioneeName: `${userDetails.firstName} ${userDetails.lastName}`,
            walletId: userDetails.userWallet.walletId,
            amount,
            gcCoin: 0,
            scCoin: amount,
            currencyCode: userDetails.userWallet.currencyCode,
            countryCode: userCountry?.code || 'US',
            status: txStatus,
            beforeBalance: { gcCoin: userDetails.userWallet.gcCoin, scCoin: userDetails.userWallet.totalScCoin },
            afterBalance,
            transactionType: TRANSACTION_TYPE.WITHDRAW,
            paymentMethod: TRANSACTION_PROVIDER.TRIPLE_A,
            paymentTransactionId: paymentReference,
            transactionDateTime: new Date(),
            isSuccess: (txStatus === TRANSACTION_STATUS.SUCCESS),
            transactionId: orderId,
            moreDetails: {
              cryptoAmount: moreDetails?.crypto_amount,
              cryptoCurrency: moreDetails?.crypto_currency,
              networkFee: moreDetails?.network_fee_crypto_amount,
              netAmount: moreDetails?.net_crypto_amount,
              exchangeRate: moreDetails?.exchange_rate,
              cryptoAddress: moreDetails?.crypto_address
            }
          }, { transaction })

          await requestDetails.set({ status: txStatus, transactionId: paymentReference, moreDetails: { ...requestDetails.moreDetails, orderId } }).save({ transaction })

          if (txStatus === TRANSACTION_STATUS.CANCELED) {
            userDetails.userWallet.scCoin = { ...userDetails.userWallet.scCoin, wsc: +(Math.round((+userDetails.userWallet.scCoin?.wsc + amount) * 100) / 100).toFixed(2) }
            await userDetails.userWallet.save({ transaction })

            WalletEmitter.emitUserWalletBalance({
              scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
              gcCoin: +userDetails.userWallet.gcCoin
            }, userDetails.userId)
          }
        } else {
          await transaction.rollback()
          return { success: false, status: 404, message: `Status Received: ${status}` }
        }
      } else {
        await transaction.rollback()
        return { success: false, status: 404, message: ERRORS.NOT_FOUND }
      }

      await transaction.commit()
      return { success: true, message: SUCCESS_MSG.TRANSACTION_SUCCESS }
    } catch (error) {
      await transaction.rollback()
      return { success: false, message: ERROR_MSG.SERVER_ERROR }
    }
  }
}
