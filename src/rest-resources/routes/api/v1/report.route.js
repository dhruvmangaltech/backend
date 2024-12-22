import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import ReportController from '../../../controllers/report.controller'

const args = { mergeParams: true }
const reportRoute = express.Router(args)

reportRoute.route('/')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    // checkPermission,
    ReportController.dashboardController,
    responseValidationMiddleware()
  )

reportRoute.route('/session-logs')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ReportController.auditSessionLogs,
    responseValidationMiddleware()
  )

reportRoute.route('/all')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ReportController.allReport,
    responseValidationMiddleware()
  )

export default reportRoute
