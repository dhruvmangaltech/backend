import { sendResponse } from '../../utils/response.helpers'
import { GetSpinWheelListService } from '../../services/wheelDivisionConfig/getSpinWheelList.service'
import { UpdateSpinWheelService } from '../../services/wheelDivisionConfig/updateSpinWheel.service'

export default class SpinWheelController {
  static async getSpinWheelList (req, res, next) {
    try {
      const { result, successful, errors } = await GetSpinWheelListService.execute()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSpinWheel (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateSpinWheelService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
