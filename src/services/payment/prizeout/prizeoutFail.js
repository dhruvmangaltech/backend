import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import { TRANSACTION_STATUS, ROLE, TRANSACTION_TYPE } from '../../../utils/constants/constant'
import { updateEntity } from '../../../utils/crud'
import { TRANSACTION_PROVIDER } from '../../../utils/constants/payment'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import Logger from '../../../libs/logger'

const schema = {
  type: 'object',
  required: ['env', 'partner_user_id', 'giftcard_cost', 'giftcard_data']
}

const constraints = ajv.compile(schema)

export class PrizeoutFailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { partner_user_id: partnerUserId, giftcard_cost: giftCardCost, request_id: requestId, giftcard_data: giftCardData } = this.args

    const {
      WithdrawRequest: WithdrawRequestModel,
      TransactionBanking: TransactionBankingModel,
      User: UserModel,
      Wallet: WalletModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    const updateStatus = { status: TRANSACTION_STATUS.CANCELED }

    const amount = +(+giftCardCost / 100).toFixed(2)

    try {
      const userDetails = await UserModel.findOne({
        where: { userId: +partnerUserId },
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
        return {
          success: false,
          statusCode: 400
        }
      }

      userDetails.userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: WalletModel }, transaction })

      const withdrawRequestExists = await WithdrawRequestModel.findOne({
        attributes: ['withdrawRequestId', 'transactionId', 'status', 'paymentProvider', 'moreDetails', 'amount'],
        where: {
          userId: +partnerUserId,
          transactionId: requestId
        },
        transaction
      })
      if (!withdrawRequestExists || ![TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS].includes(withdrawRequestExists?.status)) {
        await transaction.rollback()
        return {
          success: false,
          statusCode: 400
        }
      }

      await updateEntity({
        model: WithdrawRequestModel,
        data: {
          ...updateStatus
        },
        values: { withdrawRequestId: withdrawRequestExists.withdrawRequestId },
        transaction
      })

      userDetails.userWallet.scCoin = { ...userDetails.userWallet.scCoin, wsc: +(Math.round((+userDetails.userWallet.scCoin?.wsc + +amount) * 100) / 100).toFixed(2) }

      await userDetails.userWallet.save({ transaction })

      WalletEmitter.emitUserWalletBalance({
        scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
        gcCoin: userDetails.userWallet.gcCoin
      }, userDetails.userId)

      await TransactionBankingModel.create({
        actioneeType: ROLE.USER,
        actioneeId: userDetails.userId,
        actioneeEmail: userDetails.email,
        actioneeName: `${userDetails.firstName} ${userDetails.lastName}`,
        walletId: userDetails.userWallet.walletId,
        amount: +amount,
        gcCoin: 0,
        scCoin: +amount,
        currencyCode: userDetails.userWallet.currencyCode,
        countryCode: 'US',
        status: TRANSACTION_STATUS.CANCELED,
        beforeBalance: { gcCoin: userDetails.userWallet.gcCoin, scCoin: userDetails.userWallet.totalScCoin - +amount },
        afterBalance: { gcCoin: userDetails.userWallet.gcCoin, scCoin: userDetails.userWallet.totalScCoin },
        transactionType: TRANSACTION_TYPE.WITHDRAW,
        paymentMethod: TRANSACTION_PROVIDER.PRIZEOUT,
        paymentTransactionId: requestId,
        transactionDateTime: new Date(),
        moreDetails: {
          ...giftCardData
        }
      }, { transaction })

      await transaction.commit()
      return {
        success: true,
        statusCode: 200
      }
    } catch (error) {
      Logger.info(`Error in prizeout fail - ${JSON.stringify(error)}`)
      return {
        success: false,
        statusCode: 500
      }
    }
  }
}
