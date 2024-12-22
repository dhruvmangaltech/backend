import axios from 'axios'
import Logger from '../libs/logger'
import config from '../configs/app.config'

export const payoutActionPrizeout = async ({ withdrawRequest }) => {
  let paymentData
  const requestId = withdrawRequest?.moreDetails?.requestId
  try {
    const responseData = await axios.post(`${config.get('payment.prizeout.requestURL')}/accept?request_id=${requestId}`, {}, {
      headers: {
        Authorization: '',
        'Content-Type': 'application/json',
        secret_key: config.get('payment.prizeout.secretKey'),
        partner_id: config.get('payment.prizeout.partnerId'),
        api_key: config.get('payment.prizeout.apiKey')
      }
    })

    paymentData = responseData?.data
  } catch (error) {
    Logger.error('Error in Prizeout payout accept request - ', { exception: error })
    return false
  }

  return paymentData
}

export const payoutRejectActionPrizeout = async ({ withdrawRequest }) => {
  let paymentData
  const requestId = withdrawRequest?.moreDetails?.requestId

  try {
    const responseData = await axios.post(`${config.get('payment.prizeout.requestURL')}/reject?request_id=${requestId}`, {}, {
      headers: {
        Authorization: '',
        'Content-Type': 'application/json',
        secret_key: config.get('payment.prizeout.secretKey'),
        partner_id: config.get('payment.prizeout.partnerId'),
        api_key: config.get('payment.prizeout.apiKey')
      }
    })

    paymentData = responseData?.data
  } catch (error) {
    Logger.error('Error in Prizeout payout reject request - ', { exception: error })
    return false
  }

  return paymentData
}
