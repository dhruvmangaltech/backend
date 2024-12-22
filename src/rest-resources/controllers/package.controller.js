import { sendResponse } from '../../utils/response.helpers'
import { GetPackageList, CreatePackage, UpdatePackage, OrderPackageService, GetPackageTypeService, UpdatePackageStatusService } from '../../services/package'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'

export default class PackageController {
  static async getList (req, res, next) {
    try {
      const { result, successful, errors } = await GetPackageList.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async create (req, res, next) {
    try {
      const fileCheckResponse = validateFile(res, req.file)
      if (fileCheckResponse !== OK) {
        return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await CreatePackage.execute({ ...req.body, image: req.file },
        req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async update (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await UpdatePackage.execute({ ...req.body, image: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async order (req, res, next) {
    try {
      const { result, successful, errors } = await OrderPackageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async packageTypes (req, res, next) {
    try {
      const { result, successful, errors } = await GetPackageTypeService.execute()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePackageStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePackageStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
