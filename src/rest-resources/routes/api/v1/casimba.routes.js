import express from 'express'

import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import CasimbaController from '../../../controllers/casimba.controller'
const args = { mergeParams: true }
const casimbaRouter = express.Router(args)
casimbaRouter
  .route('/')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    CasimbaController.addGames,
    responseValidationMiddleware({})
  )

export default casimbaRouter
