import express from 'express'
import BonusController from '../../../controllers/bonus.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  getBonusSchemas,
  createBonusSchemas,
  updateBonusSchemas,
  deleteBonusSchemas
} from '../../../../rest-resources/middlewares/validation/bonus-validation.schema'
import multer from 'multer'
const args = { mergeParams: true }
const bonusRouter = express.Router(args)
const upload = multer()

bonusRouter
  .route('/')
  .get(
    requestValidationMiddleware(getBonusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.getBonus,
    responseValidationMiddleware(getBonusSchemas)
  )

  .post(
    upload.any(),
    requestValidationMiddleware(createBonusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.createBonus,
    responseValidationMiddleware(createBonusSchemas)
  )

  .put(
    requestValidationMiddleware(updateBonusSchemas),
    upload.any(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.editBonus,
    responseValidationMiddleware(updateBonusSchemas)
  )

  .delete(
    requestValidationMiddleware(deleteBonusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.deleteBonus,
    responseValidationMiddleware(deleteBonusSchemas)
  )

export default bonusRouter
