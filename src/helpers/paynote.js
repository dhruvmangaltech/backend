import axios from 'axios'
import FormData from 'form-data'
import Logger from '../libs/logger'
import config from '../configs/app.config'
import { TRANSACTION_TYPE } from '../utils/constants/constant'

export const payoutActionPaynote = async ({ userDetails, withdrawRequest }) => {
  let paymentData
  const payload = new FormData()
  payload.append('recipient', userDetails.email)
  payload.append('name', `${userDetails.firstName} ${userDetails.lastName}`)
  payload.append('amount', withdrawRequest.amount)
  payload.append('description', `${TRANSACTION_TYPE.WITHDRAW.toUpperCase()}`)
  payload.append('identifier', withdrawRequest.transactionId)

  try {
    const responseData = await axios.post(`${config.get('payment.paynote.url')}/check/send`, payload, {
      headers: {
        Authorization: config.get('payment.paynote.secretKey'),
        'Content-Type': 'application/json',
        ...payload.getHeaders()
      }
    })

    paymentData = responseData?.data
  } catch (error) {
    Logger.error('Error in Paynote payout request - ', { exception: error })
    return false
  }

  return paymentData
}

export const refundActionPaynote = async ({ transactionDetails }) => {
  let paymentData

  const refundPayload = new FormData()
  refundPayload.append('check_id', `${transactionDetails?.moreDetails?.checkId}`)
  refundPayload.append('amount', transactionDetails.amount)

  try {
    const responseData = await axios.post(`${config.get('payment.paynote.url')}/check/refund`, refundPayload, {
      headers: {
        Authorization: config.get('payment.paynote.secretKey'),
        'Content-Type': 'application/json',
        ...refundPayload.getHeaders()
      }
    })

    paymentData = responseData?.data
  } catch (error) {
    Logger.error(`Error in Paynote refund request - ${JSON.stringify(error)}`)
    return false
  }

  return paymentData
}
