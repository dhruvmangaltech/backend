import { sendResponse } from '../../utils/response.helpers'
import {
  AddGamesService
} from '../../services/rubyPlay'

export default class RubyPlayController {
  static async addGames (req, res, next) {
    try {
      const { result, successful, errors } = await AddGamesService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
