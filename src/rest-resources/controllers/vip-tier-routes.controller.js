import { sendResponse } from '../../utils/response.helpers'
import { AddNewVipTierService, EditVipTierService, DeleteVipTierService, GetVipTierDetailsService, GetVipTiersService, UpdateVipTierStatusService } from '../../services/vipTier'

export default class VipTierController {
  static async addVipTier (req, res, next) {
    try {
      const { result, successful, errors } = await AddNewVipTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async editVipTier (req, res, next) {
    try {
      const { result, successful, errors } = await EditVipTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteVipTier (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteVipTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipTierDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipTierDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipTiers (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipTiersService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateVipTierStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateVipTierStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

}
