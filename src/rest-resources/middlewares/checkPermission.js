import db from '../../db/models'
import { getOne } from '../../utils/crud'
import { PERMISSION_TYPE, REQUEST_TYPE, ROLE, CASINO_TOGGLE_CASE, RESPONSIBLE_GAMING_ENDPOINTS, TEST_EMAIL, BONUS_ACTIONS, MANAGE_MONEY, REPORT_ENDPOINTS } from '../../utils/constants/constant'
import { PermissionDeniedErrorType, CaseInvalidErrorType, StatusInvalidErrorType } from '../../utils/constants/errors'

export const checkPermission = async (req, res, next) => {
  try {
    const url = req.originalUrl.split('?').slice(0, 1).toString()
    // let endPoint = url.split('/').slice(-1).toString()
    let endPoint
    let action = REQUEST_TYPE[req.method]
    let userPermission, permission
    let noPermissionCase = false
    let hasPermission = false

    // fetching permission from db
    if (req.body.userType === ROLE.ADMIN) {
      userPermission = await getOne({
        model: db.AdminUserPermission,
        data: { adminUserId: req.body.id },
        attributes: ['permission']
      })

      endPoint = url.split('/api/v1/').slice(0).join('/').toString()
      endPoint = endPoint.split('/')[1]
      if (endPoint === '') endPoint = '/'
    }

    if (endPoint === 'status' || endPoint === '/admin/status') {
      if (!req.body.code) return next(CaseInvalidErrorType)
      if (typeof req.body.status === 'undefined') return next(StatusInvalidErrorType)
      if (CASINO_TOGGLE_CASE.includes(req.body.code)) noPermissionCase = true
      endPoint = req.body.code
      action = REQUEST_TYPE.TOGGLE
    }

    if (url.split('/api/v1/').slice(0).join('/').toString() === '/admin/detail') {
      if (!req.query.adminUserId || req.query.adminUserId === '') noPermissionCase = true
    }
    if (RESPONSIBLE_GAMING_ENDPOINTS.includes(endPoint)) action = REQUEST_TYPE.SET_RESET
    if (REPORT_ENDPOINTS.includes(endPoint)) action = REQUEST_TYPE.DASHBOARD_REPORT
    if (MANAGE_MONEY === endPoint) action = REQUEST_TYPE.ADD_BALANCE
    if (TEST_EMAIL === endPoint) action = REQUEST_TYPE.TEST_EMAIL
    if (BONUS_ACTIONS.includes(endPoint)) action = REQUEST_TYPE.BONUS

    permission = PERMISSION_TYPE.aliases[endPoint]

    if (url.split('/').slice(-1).toString() === 'status' && req.body.userType === ROLE.ADMIN && req.body.code === 'ADMIN') permission = 'Admins'
    if (!noPermissionCase) hasPermission = userPermission.permission[permission].includes(action)
    if (hasPermission || noPermissionCase) next()
    else return next(PermissionDeniedErrorType)
  } catch {
    next(PermissionDeniedErrorType)
  }
}
