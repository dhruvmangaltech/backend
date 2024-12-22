import config from '../../configs/app.config'
import { PermissionDeniedErrorType, UnAuthorizeUserErrorType } from '../../utils/constants/errors'

export const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return next(UnAuthorizeUserErrorType)
    const key = req.headers.authorization

    if (key !== config.get('payment.paynote.secretKey')) return next(UnAuthorizeUserErrorType)

    next()
  } catch (error) {
    return next(PermissionDeniedErrorType)
  }
}
