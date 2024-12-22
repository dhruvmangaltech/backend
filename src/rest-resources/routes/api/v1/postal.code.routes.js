import express from 'express'
import PostalCodeController from '../../../controllers/postal.code.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import multer from 'multer'

const upload = multer()
const postalCodeRoutes = express.Router()

postalCodeRoutes
  .route('/')
  .post(
    upload.single('csvFile'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PostalCodeController.uploadPostalCode,
    responseValidationMiddleware({})
  )
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PostalCodeController.getPostalCode,
    responseValidationMiddleware({})
  )

postalCodeRoutes
  .route('/history')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PostalCodeController.getPostalCodeHistory,
    responseValidationMiddleware({})
  )
export default postalCodeRoutes
