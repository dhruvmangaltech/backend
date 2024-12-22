import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import Logger from '../../../libs/logger'

const schema = {
  type: 'object',
  required: ['env', 'security_token', 'partner_user_id', 'request_id', 'partner_id', 'partner_session_id', 'giftcard_cost', 'giftcard_value']
}

const constraints = ajv.compile(schema)

export class PrizeoutBalanceService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { partner_user_id: partnerUserId, giftcard_cost: giftCardCost } = this.args

    const {
      Wallet: WalletModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    try {
      const userWallet = await WalletModel.findOne({
        where: { ownerId: +partnerUserId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      if (!(userWallet && userWallet.scCoin.wsc > 0)) {
        await transaction.rollback()
        return {
          message: 'insufficient funds',
          success: false,
          statusCode: 500
        }
      }

      const totalWscBalance = +(+userWallet.scCoin.wsc * 100).toFixed(2)

      if (giftCardCost > totalWscBalance) {
        await transaction.rollback()
        return {
          success: false,
          statusCode: 480
        }
      }

      await transaction.commit()
      return {
        data: { balance: totalWscBalance },
        success: true,
        statusCode: 200
      }
    } catch (error) {
      Logger.info(`Error in prizeout balance - ${JSON.stringify(error)}`)
      return {
        success: false,
        statusCode: 500
      }
    }
  }
}
