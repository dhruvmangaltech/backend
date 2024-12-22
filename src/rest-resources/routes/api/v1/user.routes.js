import multer from 'multer'
import express from 'express'
import UserController from '../../../controllers/user.controller'
import { isAdminAuthenticated, checkPermission } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
// import multer from 'multer'
import {
  userListSchemas, userDetailsSchemas, userDocumentSchemas, userDailyLimitSchemas, userDepositLimitSchemas, userLossLimitSchemas,
  userSetSessionTimeLimitSchemas, userVerifyDocumentSchemas, responsibleGamblingSchema, updateUserPasswordSchema,
  updateUserStatusSchema, userCasinoDetailsSchemas, removeUserPwLockSchema, updateSsnSchema, updateProfileSchemas,
  updateUserBankDetailsSchema, addCommentSchema, activityLogSchema, uploadUserDocumentSchema, userActivitySchemas, userVipTierUpdateSchema
} from '../../../middlewares/validation/user-validation.schemas'

const args = { mergeParams: true }
const userRouter = express.Router(args)
const upload = multer()

userRouter.route('/')
  .get(
    requestValidationMiddleware(userListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUsers,
    responseValidationMiddleware(userListSchemas))

userRouter.route('/detail')
  .get(
    requestValidationMiddleware(userDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUser,
    responseValidationMiddleware(userDetailsSchemas))

userRouter.route('/casino-detail')
  .get(
    requestValidationMiddleware(userCasinoDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUserCasinoDetail,
    responseValidationMiddleware(userCasinoDetailsSchemas))

userRouter.route('/document')
  .get(
    requestValidationMiddleware(userDocumentSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUserDocument,
    responseValidationMiddleware(userDocumentSchemas))
  .put(
    upload.single('document'),
    requestValidationMiddleware(uploadUserDocumentSchema),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.uploadDocument,
    responseValidationMiddleware(uploadUserDocumentSchema)
  )

userRouter.route('/daily-limit')
  .post(
    requestValidationMiddleware(userDailyLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setDailyLimit,
    responseValidationMiddleware(userDailyLimitSchemas))

userRouter.route('/deposit-limit')
  .post(
    requestValidationMiddleware(userDepositLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setDepositLimit,
    responseValidationMiddleware(userDepositLimitSchemas))

userRouter.route('/loss-limit')
  .post(
    requestValidationMiddleware(userLossLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setLossLimit,
    responseValidationMiddleware(userLossLimitSchemas))

userRouter.route('/session-time')
  .post(
    requestValidationMiddleware(userSetSessionTimeLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setTimeLimit,
    responseValidationMiddleware(userSetSessionTimeLimitSchemas))

userRouter.route('/verify-document')
  .put(
    requestValidationMiddleware(userVerifyDocumentSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.verifyUserDocument,
    responseValidationMiddleware(userVerifyDocumentSchemas))

userRouter.route('/dashboard')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.dashboardUser,
    responseValidationMiddleware({}))

userRouter.route('/kyc-status')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    UserController.kycStatusUpdate,
    responseValidationMiddleware({}))

userRouter.route('/kyc-status')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    UserController.kycStatusUpdate,
    responseValidationMiddleware({}))

userRouter.route('/user-responsible-setting').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  isAdminAuthenticated,
  checkPermission,
  UserController.getUserResponsibleSetting,
  responseValidationMiddleware({}))

userRouter.route('/update-user-responsible-setting')
  .post(
    requestValidationMiddleware(responsibleGamblingSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUserResponsibleSetting,
    responseValidationMiddleware({}))

userRouter.route('/update-password')
  .put(
    requestValidationMiddleware(updateUserPasswordSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUserPassword,
    responseValidationMiddleware(updateUserPasswordSchema))

userRouter.route('/update-user-status')
  .put(
    requestValidationMiddleware(updateUserStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUserStatus,
    responseValidationMiddleware(updateUserStatusSchema))

userRouter.route('/remove-pw-lock')
  .put(
    requestValidationMiddleware(removeUserPwLockSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.removeUserPwLock,
    responseValidationMiddleware(removeUserPwLockSchema))

userRouter.route('/update-ssn')
  .put(
    requestValidationMiddleware(updateSsnSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateSsn,
    responseValidationMiddleware(updateSsnSchema))

userRouter
  .route('/bank-details')
  .get(
    requestValidationMiddleware(userDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.getBankDetails,
    responseValidationMiddleware({}))
  .put(
    requestValidationMiddleware(updateUserBankDetailsSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateBankDetails,
    responseValidationMiddleware(updateUserBankDetailsSchema))

userRouter
  .route('/vip-tier-details')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.getVipTierDetails,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware(userVipTierUpdateSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUsersVipTier,
    responseValidationMiddleware(userVipTierUpdateSchema)
  )

userRouter.route('/activity-logs')
  .get(
    requestValidationMiddleware(activityLogSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.getActivityLogs,
    responseValidationMiddleware(activityLogSchema))

userRouter.route('/favorite-log')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.markLogFavorite,
    responseValidationMiddleware({}))

userRouter.route('/email-comms-details')
  .get(
    requestValidationMiddleware({}),
    isAdminAuthenticated,
    UserController.getEmailCommsDetails,
    responseValidationMiddleware({})
  )

userRouter.route('/update-user')
  .put(
    requestValidationMiddleware(updateProfileSchemas),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.updateProfile,
    responseValidationMiddleware(updateProfileSchemas)
  )

userRouter.route('/force-logout')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.forceLogout,
    responseValidationMiddleware({})
  )

userRouter.route('/comment')
  .post(
    requestValidationMiddleware(addCommentSchema),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.addComment,
    responseValidationMiddleware(addCommentSchema)
  )

userRouter.route('/user-activity')
  .get(
    requestValidationMiddleware(userActivitySchemas),
    contextMiddleware(true),
    UserController.userActivity,
    responseValidationMiddleware(userActivitySchemas)
  )

userRouter.route('/force-logout')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.forceLogout,
    responseValidationMiddleware({})
  )

userRouter.route('/comment')
  .post(
    requestValidationMiddleware(addCommentSchema),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.addComment,
    responseValidationMiddleware(addCommentSchema)
  )

userRouter.route('/user-activity')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    UserController.userActivity,
    responseValidationMiddleware({})
  )

userRouter.route('/user-kyc')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.getUserKycHistory,
    responseValidationMiddleware({}))
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.updateUserKyc,
    responseValidationMiddleware({}))

userRouter.route('/remove-responsible-gambling').put(
  requestValidationMiddleware({}),
  contextMiddleware(true),
  isAdminAuthenticated,
  checkPermission,
  UserController.removeResponsibleGambling,
  responseValidationMiddleware({}))

export default userRouter
