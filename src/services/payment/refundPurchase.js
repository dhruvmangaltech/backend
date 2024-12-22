import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { activityLog } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { refundActionPaynote } from '../../helpers/paynote'
import { getAccessTokenTripleA, refundActionTripleA } from '../../helpers/tripleA'
import { PAYMENT_PROVIDER, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    reason: { type: 'string' },
    userId: { type: 'number' },
    paymentTransactionId: { type: 'string' },
    transactionBankingId: { type: ['number', 'null'] }
  },
  required: ['user', 'userId', 'paymentTransactionId', 'reason']
}

const constraints = ajv.compile(schema)

export class RefundPurchaseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, userId, transactionBankingId, paymentTransactionId, reason } = this.args
    const { TransactionBanking: TransactionBankingModel, User: UserModel, Wallet: WalletModel } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    let query, statusData

    try {
      const userDetails = await UserModel.findOne({
        where: { userId },
        include: [{
          model: WalletModel,
          as: 'userWallet'
        }],
        attributes: ['userId', 'firstName', 'email', 'lastName', 'uniqueId'],
        transaction
      })
      if (!userDetails) return this.addError('UserNotExistsErrorType')

      query = { paymentTransactionId, actioneeId: userId, status: { [Op.in]: [TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.SHORT] }, transactionType: TRANSACTION_TYPE.DEPOSIT }
      if (transactionBankingId) query = { ...query, transactionBankingId }

      const transactionExists = await getOne({
        model: TransactionBankingModel,
        data: query,
        attributes: ['transactionBankingId', 'paymentTransactionId', 'moreDetails', 'transactionDateTime', 'scCoin', 'gcCoin', 'paymentMethod', 'amount', 'transactionId', 'status'],
        transaction
      })
      if (!transactionExists) return this.addError('TransactionsNotFoundErrorType')

      if (((+userDetails.userWallet.gcCoin - +transactionExists.gcCoin) < 0) || ((+userDetails.userWallet.scCoin.psc - +transactionExists.scCoin) < 0)) return this.addError('CoinsUsedErrorType')

      if (transactionExists.paymentMethod === PAYMENT_PROVIDER.TRIPLE_A) {
        const accessToken = await getAccessTokenTripleA(({ transactionType: TRANSACTION_TYPE.DEPOSIT }))
        statusData = await refundActionTripleA({ userDetails, transactionDetails: transactionExists, accessToken, reason })
      } else if (transactionExists.paymentMethod === PAYMENT_PROVIDER.PAYNOTE) {
        statusData = await refundActionPaynote({ transactionDetails: transactionExists })
      }

      if (statusData) {
        await transactionExists.set({ status: TRANSACTION_STATUS.INPROGRESS, moreDetails: { ...transactionExists.moreDetails, refundBy: `${user.email} (${user.adminUserId})` } }).save({ transaction })
        await activityLog({ user, userId, fieldChanged: 'Purchase Refund', originalValue: 'success', changedValue: 'refund', remark: reason })
      } else return this.addError('InternalServerErrorType')

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
