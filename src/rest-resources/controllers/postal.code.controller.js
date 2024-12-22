import { sendResponse } from '../../utils/response.helpers'
import { UploadPostalCodeService, SearchPostalCodeService, PostalCodeHistoryService } from '../../services/postalCode'

export default class PostalCodeController {
  static async uploadPostalCode (req, res, next) {
    try {
      const { result, successful, errors } = await UploadPostalCodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPostalCode (req, res, next) {
    try {
      const { result, successful, errors } = await SearchPostalCodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPostalCodeHistory (req, res, next) {
    try {
      const { result, successful, errors } = await PostalCodeHistoryService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
