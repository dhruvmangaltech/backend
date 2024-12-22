import express from 'express'
import RubyPlayController from '../../../controllers/ruby-play.controller'
import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import multer from 'multer'
import {
  addRubyPlayGamesSchemas
} from '../../../middlewares/validation/admin-validation.schemas'
const args = { mergeParams: true }
const rubyPlayRouter = express.Router(args)
const upload = multer()
rubyPlayRouter
  .route('/')
  .post(
    upload.single('gameFile'),
    requestValidationMiddleware(addRubyPlayGamesSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    RubyPlayController.addGames,
    responseValidationMiddleware(addRubyPlayGamesSchemas)
  )

export default rubyPlayRouter
