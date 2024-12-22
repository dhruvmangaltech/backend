import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import Logger from '../../../libs/logger'

const schema = {
  type: 'object',
  required: ['partner_session_id']
}

const constraints = ajv.compile(schema)

export class PrizeoutSessionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { partner_session_id: partnerSessionId } = this.args

    const {
      User: UserModel,
      Wallet: WalletModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    try {
      const userDetails = await UserModel.findOne({
        where: { uniqueId: partnerSessionId },
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

      if (!(userDetails.userWallet.scCoin.wsc >= 0)) {
        await transaction.rollback()
        return {
          message: 'insufficient funds',
          statusCode: 500,
          success: false
        }
      }

      const data = {
        firstname: userDetails.firstName,
        lastname: userDetails.lastName,
        email: userDetails.email,
        user_id: userDetails.userId,
        country: 'US',
        balance: +(+userDetails.userWallet.scCoin.wsc * 100).toFixed(2)

      }
      await transaction.commit()

      return {
        user: data,
        publisher: {
          name: 'sweeperCasino',
          id: '6c8fde06-7f99-4863-99e6-89df7bdf453d',
          apikey: 'ad8ee61c825d9a7605f8cb57f72f1f63'
        },
        statusCode: 200
      }
    } catch (error) {
      Logger.info(`Error in prizeout session - ${JSON.stringify(error)}`)
      return {
        success: false,
        statusCode: 500
      }
    }
  }
}
