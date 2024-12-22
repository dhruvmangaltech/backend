import { sendResponse } from '../../utils/response.helpers'
import { AleaGetPagesService } from '../../services/alea/getPages.service'

export default class AleaCasinoController {
  static async addGames (req, res, next) {
    try {
      const { result, successful, errors } = await AleaGetPagesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
