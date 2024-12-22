import { sendResponse } from '../../utils/response.helpers'
import { EditBonus, GetBonus, CreateProgressiveBonus, CreateBonus, DeleteBonus } from '../../services/bonus'
import { BONUS_TYPE } from '../../utils/constants/constant'

const actions = {
  CREATE: 'create',
  EDIT: 'edit',
  GET: 'get',
  REMOVE: 'remove'
}

export default class BonusController {
  static getServicesByBonusType (action, req) {
    let services
    switch (req.body.bonusType) {
      case BONUS_TYPE.DAILY_BONUS: {
        services = {
          [actions.CREATE]: CreateProgressiveBonus
        }
        break
      }
      case BONUS_TYPE.MONTHLY_BONUS: {
        services = {
          [actions.CREATE]: CreateProgressiveBonus
        }
        break
      }
      default: {
        services = {
          [actions.CREATE]: CreateBonus,
          [actions.EDIT]: EditBonus,
          [actions.GET]: GetBonus,
          [actions.REMOVE]: DeleteBonus
        }
      }
    }

    return services[action]
  }

  static async createBonus (req, res, next) {
    try {
      const service = BonusController.getServicesByBonusType(actions.CREATE, req)
      const { result, successful, errors } = await service.execute({ ...req.body, image: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async editBonus (req, res, next) {
    try {
      const { result, successful, errors } = await EditBonus.execute({ ...req.body, image: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBonus (req, res, next) {
    try {
      const { result, successful, errors } = await GetBonus.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBonus (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBonus.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
