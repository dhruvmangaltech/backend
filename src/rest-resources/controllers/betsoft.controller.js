import { sendResponse } from '../../utils/response.helpers'
import { BetSoftAddGameService } from '../../services/betsoft'

export default class BetSoftController {
  static async addGames (req, res, next) {
    try {
      const { result, successful, errors } = await BetSoftAddGameService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
