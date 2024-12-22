import { sendResponse } from '../../utils/response.helpers'
import {
  GetUsersService,
  GetUserByIdService,
  GetUserDocumentService,
  VerifyUserDocumentService,
  DashboardUserService,
  UpdateKycStatusService,
  GetUserResponsibleSetting,
  UpdateUserResponsibleSetting,
  UpdateUserPassword,
  GetUserCasinoDetailService,
  RemoveUserPwLock,
  UpdateUserStatus,
  UpdateUserSsnNumber,
  GetBankDetailService,
  GetActivityLogsService,
  FavoriteLogService,
  GetEmailCommsDetails,
  UpdateUserProfileService,
  UpdateBankDetails,
  forceLogoutService,
  AddCommentService,
  UploadDocumentsService,
  GetUserActivityService,
  UpdateUserKyc,
  GetUserKycHistory
} from '../../services/user'
import {
  SetDailyLimitService,
  SetDepositLimitService,
  SetLossLimitService,
  SetTimeLimitService
} from '../../services/userLimit'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { GetVipTierDetails } from '../../services/user/getVipTierDetails'
import { UpdateUsersVipTierService } from '../../services/user/updateUsersVipTierService'
import { RemoveResponsibleGaming } from '../../services/user/removeResponsibleGambling'
// import { streamFile } from '../../libs/straemFile'

export default class UserController {
  static async getUsers (req, res, next) {
    try {
      const { result, successful, errors } = await GetUsersService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUser (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserByIdService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserDocument (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserDocumentService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBankDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetBankDetailService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipTierDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipTierDetails.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBankDetails (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateBankDetails.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUsersVipTier (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUsersVipTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setDailyLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetDailyLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setLossLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetLossLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setDepositLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetDepositLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setTimeLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetTimeLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async verifyUserDocument (req, res, next) {
    try {
      const { result, successful, errors } = await VerifyUserDocumentService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async dashboardUser (req, res, next) {
    try {
      const { result, successful, errors } = await DashboardUserService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async kycStatusUpdate (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateKycStatusService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserResponsibleSetting (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserResponsibleSetting.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserResponsibleSetting (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserResponsibleSetting.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserPassword (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserPassword.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserStatus.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserCasinoDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserCasinoDetailService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async removeUserPwLock (req, res, next) {
    try {
      const { result, successful, errors } = await RemoveUserPwLock.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSsn (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserSsnNumber.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getActivityLogs (req, res, next) {
    try {
      const { result, successful, errors } = await GetActivityLogsService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async markLogFavorite (req, res, next) {
    try {
      const { result, successful, errors } = await FavoriteLogService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getEmailCommsDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetEmailCommsDetails.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async forceLogout (req, res, next) {
    try {
      const { result, successful, errors } = await forceLogoutService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserProfileService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async uploadDocument (req, res, next) {
    try {
      const fileCheckResponse = validateFile(res, req.file)
      if (fileCheckResponse !== OK) return next(InvalidFileErrorType)

      const { result, successful, errors } = await UploadDocumentsService.execute({ ...req.body, document: req.file },
        req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addComment (req, res, next) {
    try {
      const { result, successful, errors } = await AddCommentService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async userActivity (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserActivityService.execute({ ...req.body, ...req.query, response: res }, res)
      if (result && result.stream) {
        // Streaming logic
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=your_streaming_data.csv') // Set filename for download

        // Pipe the stream to the response
        result.stream.pipe(res)

        // Handle stream errors
        result.stream.on('error', (error) => {
          console.error('Error streaming data:', error)
          res.status(500).end()
        })

        // Handle stream end
        result.stream.on('end', () => {
          console.log('Stream completed successfully.')
        })
        result.stream.on('finish', () => {
          console.log('Stream finished successfully.')
        })
      } else {
        sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async getUserKycHistory (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserKycHistory.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserKyc (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserKyc.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async removeResponsibleGambling (req, res, next) {
    try {
      const { result, successful, errors } = await RemoveResponsibleGaming.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
