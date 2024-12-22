import { sendResponse } from '../../utils/response.helpers'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { DeletePopupService, GetPopupService, UpdatePopupService, UploadPopupService } from '../../services/popup'

export default class PopupController {
  static async uploadPopup (req, res, next) {
    try {
      const desktopFileCheckResponse = validateFile(res, req.files?.desktopImage[0])
      if (desktopFileCheckResponse !== OK) return next(InvalidFileErrorType)

      const mobileFileCheckResponse = validateFile(res, req.files?.mobileImage[0])
      if (mobileFileCheckResponse !== OK) return next(InvalidFileErrorType)

      const { result, successful, errors } = await UploadPopupService.execute(
        { ...req.body, desktopImage: req.files?.desktopImage[0], mobileImage: req.files?.mobileImage[0] }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePopup (req, res, next) {
    try {
      if (req.files?.desktopImage) {
        const desktopFileCheckResponse = validateFile(res, req.files?.desktopImage[0])
        if (desktopFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }

      if (req.files?.mobileImage) {
        const mobileFileCheckResponse = validateFile(res, req.files?.mobileImage[0])
        if (mobileFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }

      const { result, successful, errors } = await UpdatePopupService.execute(
        { ...req.body, desktopImage: req.files?.desktopImage, mobileImage: req.files?.mobileImage }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePopup (req, res, next) {
    try {
      const { result, successful, errors } = await DeletePopupService.execute(
        { ...req.body, image: req.file },
        req.context
      )
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllPopup (req, res, next) {
    try {
      const { result, successful, errors } = await GetPopupService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  //   static async getBannerKeys (req, res, next) {
  //     try {
  //       const { result, successful, errors } = await GetBannerKeys.execute(req.body)
  //       sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
  //     } catch (error) {
  //       next(error)
  //     }
  //   }

//   static async orderBanner (req, res, next) {
//     try {
//       const { result, successful, errors } = await OrderBannerService.execute(req.body)
//       sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
//     } catch (error) {
//       next(error)
//     }
//   }
}
