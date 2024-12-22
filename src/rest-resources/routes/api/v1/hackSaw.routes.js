import express from 'express'
import multer from 'multer'

import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import HacksawController from '../../../controllers/hacksaw.controller'
const upload = multer()
const args = { mergeParams: true }
const hacksawRouter = express.Router(args)
hacksawRouter
  .route('/')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    HacksawController.addGames,
    responseValidationMiddleware({})
  )

hacksawRouter.route('/upload-game-xls')
  .post(upload.single('gamexls'),
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    HacksawController.uploadGameXls,
    responseValidationMiddleware())

export default hacksawRouter
