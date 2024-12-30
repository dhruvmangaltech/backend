import express from 'express'
// import ProductController from '../../../controllers/package.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import ProductController from '../../../controllers/product.controller'
import { stockslistSchemas, stocksUpdateSchemas } from '../../../middlewares/validation/stocks-validation.schema'
import StockController from '../../../controllers/stock.controller'

const args = { mergeParams: true }
const stockRoutes = express.Router(args)

stockRoutes.route('/')
  .get(
    requestValidationMiddleware(stockslistSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    StockController.getList,
    responseValidationMiddleware(stockslistSchemas)
  )
  .put(
    requestValidationMiddleware(stocksUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    StockController.update,
    responseValidationMiddleware({})
  )

stockRoutes.route('/logs')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    StockController.stockLogs,
    responseValidationMiddleware({})
  )

export default stockRoutes