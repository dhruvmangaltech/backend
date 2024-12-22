import { Op } from 'sequelize'
import ajv from '../../../libs/ajv'
import { getOne } from '../../../utils/crud'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { ERRORS, ERROR_MSG } from '../../../utils/constants/errors'
import { EVENT_TYPE, STATUS } from '../../../utils/constants/payment'
import { TRANSACTION_STATUS } from '../../../utils/constants/constant'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'

const schema = {
  type: 'object',
  required: ['event', 'type', 'status']
}

const constraints = ajv.compile(schema)

export class RefundNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { event, order_id: orderId, type, payout_reference: paymentReference, status, txId } = this.args
    if (!orderId) orderId = txId

    const { User: UserModel, Wallet: WalletModel, TransactionBanking: TransactionBankingModel } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    let txStatus, walletUpdate

    try {
      if (event === EVENT_TYPE.PAYOUT && type === 'refund' && status !== STATUS.NEW) {
        const transactionDetails = await getOne({
          model: TransactionBankingModel,
          data: { [Op.or]: { paymentTransactionId: paymentReference, transactionId: orderId } },
          attributes: ['transactionBankingId', 'moreDetails', 'status', 'actioneeId', 'gcCoin', 'scCoin', 'isSuccess'],
          transaction
        })
        if (!transactionDetails || ![TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.SHORT, TRANSACTION_STATUS.INPROGRESS].includes(transactionDetails.status)) {
          await transaction.rollback()
          return { success: false, status: 400, message: ERRORS.BAD_REQUEST }
        }

        const userDetails = await UserModel.findOne({
          where: { userId: transactionDetails.actioneeId },
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

        userDetails.userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: WalletModel }, transaction })

        if (status === STATUS.CONFIRM || status === STATUS.DONE) {
          txStatus = TRANSACTION_STATUS.REFUND

          if (!transactionDetails?.moreDetails?.shortAmount && transactionDetails.isSuccess) {
            if (((+userDetails.userWallet.gcCoin - +transactionDetails.gcCoin) < 0) || ((+userDetails.userWallet.scCoin.psc - +transactionDetails.scCoin) < 0)) {
              await transaction.rollback()
              return { success: false, message: 'Coins used by player, cannot void/refund the transaction amount' }
            }

            walletUpdate = { gcCoin: +userDetails.userWallet.gcCoin - +transactionDetails.gcCoin, scCoin: { ...userDetails.userWallet.scCoin, psc: +(Math.round((+userDetails.userWallet.scCoin?.psc - +transactionDetails.scCoin) * 100) / 100).toFixed(2) } }
          }
        } else if ([STATUS.CANCEL, STATUS.INVALID, STATUS.FAILED].includes(status)) {
          if (transactionDetails.isSuccess && !transactionDetails?.moreDetails?.shortAmount) {
            txStatus = TRANSACTION_STATUS.SUCCESS

            walletUpdate = { gcCoin: +userDetails.userWallet.gcCoin + +transactionDetails.gcCoin, scCoin: { ...userDetails.userWallet.scCoin, psc: +(Math.round((+userDetails.userWallet.scCoin?.psc + +transactionDetails.scCoin) * 100) / 100).toFixed(2) } }
          } else txStatus = TRANSACTION_STATUS.SHORT
        }

        if (txStatus) {
          await transactionDetails.set({ status: txStatus, moreDetails: { ...transactionDetails.moreDetails, refundId: paymentReference } }).save({ transaction })

          if (walletUpdate) {
            await userDetails.userWallet.set({ ...walletUpdate }).save({ transaction })

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
