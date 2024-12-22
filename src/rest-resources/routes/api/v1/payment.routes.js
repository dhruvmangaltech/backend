import express from 'express'
import PaymentController from '../../../controllers/payment.controller'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { paymentTransactionSchema, redeemRequestsActionSchema, redeemRequestsSchema, refundPurchaseSchema } from '../../../middlewares/validation/payment-validation.schema'
import { isAuthenticated } from '../../../middlewares/paynoteAuthentication.middleware'

const args = { mergeParams: true }
const paymentRoutes = express.Router(args)

paymentRoutes.route('/transactions')
  .get(
    requestValidationMiddleware(paymentTransactionSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.transactions,
    responseValidationMiddleware(paymentTransactionSchema)
  )

paymentRoutes.route('/redeem-requests')
  .get(
    requestValidationMiddleware(redeemRequestsSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getRedeemRequest,
    responseValidationMiddleware(redeemRequestsSchema)
  )
  .put(
    requestValidationMiddleware(redeemRequestsActionSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.redeemRequest,
    responseValidationMiddleware(redeemRequestsActionSchema)
  )

paymentRoutes.route('/refund')
  .put(
    requestValidationMiddleware(refundPurchaseSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.refundPurchase,
    responseValidationMiddleware(refundPurchaseSchema)
  )

paymentRoutes.route('/tripleA/deposit')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.tripleADeposit,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/tripleA/payout')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.tripleAPayout,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/tripleA/refund')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.tripleARefund,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/paynote/deposit')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAuthenticated,
    PaymentController.paynoteDeposit,
    responseValidationMiddleware({})
  )
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAuthenticated,
    PaymentController.paynoteDeposit,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/prizeout/onSession')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.prizeoutSession,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/prizeout/balance')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.prizeoutBalance,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/prizeout/review')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.prizeoutReview,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/prizeout/success')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.prizeoutSuccess,
    responseValidationMiddleware({})
  )

paymentRoutes.route('/prizeout/fail')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PaymentController.prizeoutFail,
    responseValidationMiddleware({})
  )

// paymentRoutes.route('/prizeout/reject')
//   .post(
//     requestValidationMiddleware({}),
//     contextMiddleware(true),
//     PaymentController.prizeoutReject,
//     responseValidationMiddleware({})
//   )
export default paymentRoutes
