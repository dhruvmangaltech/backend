import { sendResponse } from '../../utils/response.helpers'
import { DashBoardReport } from '../../services/report/dashboardReports'
import { AuditSessionLogsService } from '../../services/report'
import { AllReportService } from '../../services/report/allReport'

export default class ReportController {
  static async dashboardController (req, res, next) {
    try {
      const { result, successful, errors } = await DashBoardReport.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async auditSessionLogs (req, res, next) {
    try {
      const { result, successful, errors } = await AuditSessionLogsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async allReport (req, res, next) {
    try {
      const { result, successful, errors } = await AllReportService.execute({ ...req.query, ...req?.body?.user }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
