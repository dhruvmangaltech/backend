import express from 'express'

// import {
//   bannerGetAllSchemas,
//   bannerUploadSchemas,
//   bannerUpdateSchemas,
//   bannerDeleteSchemas,
//   bannerOrderSchemas
// } from '../../../../rest-resources/middlewares/validation/banner-validation.schemas'
import multer from 'multer'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import PopupController from '../../../controllers/popup.controller'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { popupDeleteSchemas, popupGetAllSchemas, popupUpdateSchemas, popupUploadSchemas } from '../../../middlewares/validation/popup.validation.schemas'
const upload = multer()
const args = { mergeParams: true }
const popupRouter = express.Router(args)

popupRouter
  .route('/')
  .get(
    requestValidationMiddleware(popupGetAllSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PopupController.getAllPopup,
    responseValidationMiddleware(popupGetAllSchemas)
  )
  .post(
    upload.fields([{ name: 'desktopImage' }, { name: 'mobileImage' }]),
    requestValidationMiddleware(popupUploadSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PopupController.uploadPopup,
    responseValidationMiddleware(popupUploadSchemas)
  )
  .put(
    upload.fields([{ name: 'desktopImage' }, { name: 'mobileImage' }]),
    requestValidationMiddleware(popupUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PopupController.updatePopup,
    responseValidationMiddleware(popupUpdateSchemas)
  )
  .delete(
    upload.single('image'),
    requestValidationMiddleware(popupDeleteSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PopupController.deletePopup,
    responseValidationMiddleware(popupDeleteSchemas)
  )

// popupRouter
//   .route('/order')
//   .put(
//     requestValidationMiddleware(bannerOrderSchemas),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     checkPermission,
//     BannerController.orderBanner,
//     responseValidationMiddleware(bannerOrderSchemas)
//   )
export default popupRouter
