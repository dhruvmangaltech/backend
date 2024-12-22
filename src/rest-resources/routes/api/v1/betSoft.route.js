import express from 'express'

import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import BetSoftController from '../../../controllers/betsoft.controller'
const args = { mergeParams: true }
const betsoftRouter = express.Router(args)
betsoftRouter
  .route('/')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    BetSoftController.addGames,
    responseValidationMiddleware({})
  )

export default betsoftRouter
