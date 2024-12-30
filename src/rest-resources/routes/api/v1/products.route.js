import express from 'express'
// import ProductController from '../../../controllers/package.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { 
    productlistSchemas,
    productCreateSchemas,
    productUpdateSchemas
 } from '../../../middlewares/validation/product-validation.schemas'
 import ProductController from '../../../controllers/product.controller'

const args = { mergeParams: true }
const productRoutes = express.Router(args)

productRoutes.route('/')
  .get(
    requestValidationMiddleware(productlistSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ProductController.getList,
    responseValidationMiddleware(productlistSchemas)
  )
  .post(
    requestValidationMiddleware(productCreateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ProductController.create,
    responseValidationMiddleware(productCreateSchemas)
  )
  .put(
    requestValidationMiddleware(productUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ProductController.update,
    responseValidationMiddleware({})
  )

productRoutes.route('/status')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    ProductController.updatePackageStatus,
    responseValidationMiddleware({})
  )

productRoutes.route('/getSingleProduct')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    ProductController.getSingleProduct,
    responseValidationMiddleware({})
  )

export default productRoutes
