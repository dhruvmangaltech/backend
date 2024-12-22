import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'

export class GetPaymentProviderListService extends ServiceBase {
  async run () {
    try {
      const paymentProviders = await db.PaymentProvider.findAll({ attributes: ['providerId', 'providerName'] })
      return { success: true, paymentProviders }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
