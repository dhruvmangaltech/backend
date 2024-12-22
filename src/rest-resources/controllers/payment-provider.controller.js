import { sendResponse } from '../../utils/response.helpers'
import { GetPaymentProviderListService } from '../../services/payment-provider'

export default class PackageController {
  static async getPaymentProviders (req, res, next) {
    try {
      const { result, successful, errors } = await GetPaymentProviderListService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
