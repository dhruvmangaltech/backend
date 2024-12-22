import { sendResponse } from '../../utils/response.helpers'
import { PaynoteNotificationService } from '../../services/payment/paynote'
import { PaymentNotificationService, PayoutNotificationService, RefundNotificationService } from '../../services/payment/tripleA'
import { GetRedeemRequestsService, GetTransactionsService, RedeemRequestActionService, RefundPurchaseService } from '../../services/payment'
import { PrizeoutBalanceService, PrizeoutSessionService } from '../../services/payment/prizeout'
import { PrizeoutReviewService } from '../../services/payment/prizeout/prizeoutReview'
import { PrizeoutSuccessService } from '../../services/payment/prizeout/prizeoutSuccess'
import { PrizeoutFailService } from '../../services/payment/prizeout/prizeoutFail'
import { PrizeoutRejectService } from '../../services/payment/prizeout/prizeoutReject'

export default class PaymentController {
  static async transactions (req, res, next) {
    try {
      const { result, successful, errors } = await GetTransactionsService.execute({ ...req.body, ...req.query }, req.context)
      if (result && result.stream) {
        // Streaming logic
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=your_streaming_data.csv') // Set filename for download

        // Pipe the stream to the response
        result.stream.pipe(res)

        // Handle stream errors
        result.stream.on('error', (error) => {
          console.error('Error streaming data:', error)
          res.status(500).end()
        })

        // Handle stream end
        result.stream.on('end', () => {
          console.log('Stream completed successfully.')
        })
        result.stream.on('finish', () => {
          console.log('Stream finished successfully.')
        })
      } else { sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }) }
    } catch (error) {
      next(error)
    }
  }

  static async redeemRequest (req, res, next) {
    try {
      const { result, successful, errors } = await RedeemRequestActionService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRedeemRequest (req, res, next) {
    try {
      const { result, successful, errors } = await GetRedeemRequestsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async refundPurchase (req, res, next) {
    try {
      const { result, successful, errors } = await RefundPurchaseService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async tripleADeposit (req, res, next) {
    try {
      const { result, successful, errors } = await PaymentNotificationService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.success) {
        res.status(200).json({ ...result })
      } else {
        res.status(result?.status || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async tripleAPayout (req, res, next) {
    try {
      const { result, successful, errors } = await PayoutNotificationService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.success) {
        res.status(200).json({ ...result })
      } else {
        res.status(result?.status || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async tripleARefund (req, res, next) {
    try {
      const { result, successful, errors } = await RefundNotificationService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.success) {
        res.status(200).json({ ...result })
      } else {
        res.status(result?.status || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async paynoteDeposit (req, res, next) {
    try {
      const { result, successful, errors } = await PaynoteNotificationService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.success) {
        res.status(200).json({ ...result })
      } else {
        res.status(result?.status || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async prizeoutSession (req, res, next) {
    try {
      const { result, successful, errors } = await PrizeoutSessionService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.statusCode === 200) {
        res.status(200).json({ ...result })
      } else {
        res.status(result?.statusCode || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async prizeoutBalance (req, res, next) {
    try {
      const { result, successful, errors } = await PrizeoutBalanceService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.statusCode === 200) {
        res.status(200).json({ ...result.data })
      } else {
        res.status(result?.statusCode || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async prizeoutReview (req, res, next) {
    try {
      const { result, successful, errors } = await PrizeoutReviewService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.statusCode === 200) {
        res.status(200).json({ ...result.data })
      } else {
        res.status(result?.statusCode || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async prizeoutSuccess (req, res, next) {
    try {
      const { result, successful, errors } = await PrizeoutSuccessService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.statusCode === 200) {
        res.status(200).json({ ...result.data })
      } else {
        res.status(result?.statusCode || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async prizeoutFail (req, res, next) {
    try {
      const { result, successful, errors } = await PrizeoutFailService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.statusCode === 200) {
        res.status(200).json({ ...result.data })
      } else {
        res.status(result?.statusCode || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }

  static async prizeoutReject (req, res, next) {
    try {
      const { result, successful, errors } = await PrizeoutRejectService.execute({ ...req.body, ...req.query }, req.context)
      if (successful && result.statusCode === 200) {
        res.status(200).json({ ...result.data })
      } else {
        res.status(result?.statusCode || 400).json({ ...result, ...errors })
      }
    } catch (error) {
      next(error)
    }
  }
}
