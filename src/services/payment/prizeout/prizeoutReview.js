import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import { TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { TRANSACTION_PROVIDER } from '../../../utils/constants/payment'
import { createNewEntity } from '../../../utils/crud'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import Logger from '../../../libs/logger'
const schema = {
  type: 'object',
  required: ['env', 'partner_user_id', 'giftcard_cost', 'giftcard_data']
}

const constraints = ajv.compile(schema)

export class PrizeoutReviewService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { partner_user_id: partnerUserId, giftcard_cost: giftCardCost, giftcard_data: giftCardData, request_id: requestId } = this.args

    const {
      WithdrawRequest: WithdrawRequestModel,
      User: UserModel,
      Wallet: WalletModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
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

      await createNewEntity({
        model: WithdrawRequestModel,
        data: {
          status: TRANSACTION_STATUS.PENDING,
          userId: userDetails.userId,
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails?.email,
          amount: amount,
          paymentProvider: TRANSACTION_PROVIDER.PRIZEOUT,
          transactionId: requestId,
          moreDetails: {
            requestId: requestId,
            beforeBalance: { gcCoin: +userDetails.userWallet.gcCoin, scCoin: +userDetails.userWallet.totalScCoin },
            afterBalance: { gcCoin: +userDetails.userWallet.gcCoin, scCoin: +userDetails.userWallet.totalScCoin - +amount },
            giftCardDataId: giftCardData.id,
            giftCardDataName: giftCardData.name,
            giftCardDataEmail: giftCardData.email,
            giftCardDataProviderId: giftCardData.provider_id,
            giftCardDataCostInCents: giftCardData.cost_in_cents,
            giftCardDataValueInCents: giftCardData.value_in_cents,
            giftCardDataExpirationDate: giftCardData.expiration_date
          }
        },
        transaction
      })

      userDetails.userWallet.scCoin = { ...userDetails.userWallet.scCoin, wsc: +(Math.round((+userDetails.userWallet.scCoin?.wsc - +amount) * 100) / 100).toFixed(2) }

      await userDetails.userWallet.save({ transaction })

      WalletEmitter.emitUserWalletBalance({
        scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
        gcCoin: userDetails.userWallet.gcCoin
      }, userDetails.userId)

      await transaction.commit()
      return {
        success: true,
        statusCode: 200
      }
    } catch (error) {
      Logger.info(`Error in prizeout review - ${JSON.stringify(error)}`)
      return {
        success: true,
        statusCode: 500
      }
    }
  }
}
