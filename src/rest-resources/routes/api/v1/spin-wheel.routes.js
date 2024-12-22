import express from 'express'

import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import SpinWheelController from '../../../controllers/spin-wheel.controller'
const args = { mergeParams: true }
const spinWheelRouter = express.Router(args)
spinWheelRouter
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    SpinWheelController.getSpinWheelList,
    responseValidationMiddleware({})
  )

  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    SpinWheelController.updateSpinWheel,
    responseValidationMiddleware({})
  )

export default spinWheelRouter
