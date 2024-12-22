import { sendResponse } from '../../utils/response.helpers'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import {
  UploadBannerService,
  UpdateBannerPageService,
  GetBannerService,
  GetBannerKeys,
  DeleteBannerPageService,
  OrderBannerService
} from '../../services/banner'

export default class BannerController {
  static async uploadBanner (req, res, next) {
    try {
      const desktopFileCheckResponse = validateFile(res, req.files?.desktopImage[0])
      if (desktopFileCheckResponse !== OK) return next(InvalidFileErrorType)

      const mobileFileCheckResponse = validateFile(res, req.files?.mobileImage[0])
      if (mobileFileCheckResponse !== OK) return next(InvalidFileErrorType)

      const { result, successful, errors } = await UploadBannerService.execute(
        { ...req.body, desktopImage: req.files?.desktopImage[0], mobileImage: req.files?.mobileImage[0] }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBanner (req, res, next) {
    try {
      if (req.files?.desktopImage) {
        const desktopFileCheckResponse = validateFile(res, req.files?.desktopImage[0])
        if (desktopFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }

      if (req.files?.mobileImage) {
        const mobileFileCheckResponse = validateFile(res, req.files?.mobileImage[0])
        if (mobileFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }

      const { result, successful, errors } = await UpdateBannerPageService.execute(
        { ...req.body, desktopImage: req.files?.desktopImage, mobileImage: req.files?.mobileImage }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBanner (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBannerPageService.execute(
        { ...req.body, image: req.file },
        req.context
      )
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllBanner (req, res, next) {
    try {
      const { result, successful, errors } = await GetBannerService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBannerKeys (req, res, next) {
    try {
      const { result, successful, errors } = await GetBannerKeys.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async orderBanner (req, res, next) {
    try {
      const { result, successful, errors } = await OrderBannerService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
