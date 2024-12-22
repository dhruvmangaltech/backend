import { sendResponse } from '../../utils/response.helpers'
import {
  AddGamesService
} from '../../services/hacksaw'
import { GameXlsUpload } from '../../services/hacksaw/uploadFile'

export default class HacksawController {
  static async addGames (req, res, next) {
    try {
      const { result, successful, errors } = await AddGamesService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async uploadGameXls (req, res, next) {
    try {
      const { result, successful, errors } = await GameXlsUpload.execute({ ...req.body, gamexls: req.file })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
