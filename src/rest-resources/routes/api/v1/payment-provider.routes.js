import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import { isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import paymentProviderController from '../../../controllers/payment-provider.controller'

const args = { mergeParams: true }
const paymentProviderRoute = express.Router(args)

paymentProviderRoute.route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    paymentProviderController.getPaymentProviders,
    responseValidationMiddleware({})
  )

export default paymentProviderRoute
