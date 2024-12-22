import express from 'express'
import packageController from '../../../controllers/package.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  packagelistSchemas,
  packageCreateSchemas,
  packageUpdateSchemas,
  packageOrderSchemas
} from '../../../middlewares/validation/package-validation.schemas'

import multer from 'multer'
const args = { mergeParams: true }
const adminRouter = express.Router(args)
const upload = multer()

adminRouter.route('/')
  .get(
    requestValidationMiddleware(packagelistSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    packageController.getList,
    responseValidationMiddleware(packagelistSchemas)
  )
  .post(
    upload.single('image'),
    requestValidationMiddleware(packageCreateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.create,
    responseValidationMiddleware(packageCreateSchemas)
  )
  .put(
    upload.single('image'),
    requestValidationMiddleware(packageUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.update,
    responseValidationMiddleware({})
  )

adminRouter.route('/order')
  .put(
    requestValidationMiddleware(packageOrderSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.order,
    responseValidationMiddleware(packageOrderSchemas)
  )

adminRouter.route('/types')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    packageController.packageTypes,
    responseValidationMiddleware({})
  )

adminRouter.route('/status')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    packageController.updatePackageStatus,
    responseValidationMiddleware({})
  )

export default adminRouter
