import axios from 'axios'
import Logger from '../libs/logger'
import config from '../configs/app.config'
import { TRANSACTION_TYPE } from '../utils/constants/constant'

export const getAccessTokenTripleA = async ({ transactionType }) => {
  let accessToken, clientId, clientSecret

  if (transactionType === TRANSACTION_TYPE.WITHDRAW) {
    clientId = config.get('payment.tripleA.clientId')
    clientSecret = config.get('payment.tripleA.clientSecret')
  } else {
    clientId = config.get('payment.tripleA.refundClientId')
    clientSecret = config.get('payment.tripleA.refundClientSecret')
  }

  try {
    const payload = new URLSearchParams()
    payload.append('client_id', clientId)
    payload.append('client_secret', clientSecret)
    payload.append('grant_type', 'client_credentials')

    const responseData = await axios.post(`${config.get('payment.tripleA.url')}/oauth/token`, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    accessToken = responseData?.data?.access_token
  } catch (error) {
    Logger.error('Error in TripleA access token request - ', { exception: error })
    return false
  }

  return accessToken
}

export const payoutActionTripleA = async ({ userDetails, withdrawRequest, accessToken }) => {
  let paymentData

  const payload = {
    merchant_key: config.get('payment.tripleA.merchantKey'),
    email: userDetails.email,
    withdraw_currency: userDetails.currencyCode,
    withdraw_amount: +withdrawRequest.amount.toFixed(2),
    crypto_currency: withdrawRequest.moreDetails.currency,
    address: withdrawRequest.moreDetails.address,
    name: config.get('payment.tripleA.merchantName'),
    country: config.get('payment.tripleA.merchantCountry'),
    notify_url: `${config.get('adminBeUrl')}/api/v1/payment/tripleA/payout?uniqueId=${userDetails.uniqueId}`,
    order_id: withdrawRequest.transactionId
  }

  try {
    const responseData = await axios.post(`${config.get('payment.tripleA.url')}/payout/withdraw/local/crypto/direct`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    paymentData = responseData?.data
  } catch (error) {
    Logger.error('Error in TripleA payout create request - ', { exception: error })
    return false
  }

  if (paymentData?.status && paymentData?.payout_reference) {
    try {
      const responseData = await axios.put(`${config.get('payment.tripleA.url')}/payout/withdraw/${paymentData.payout_reference}/local/crypto/confirm`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      paymentData = responseData?.data
    } catch (error) {
      Logger.error('Error in TripleA payout confirm request - ', { exception: error })
      return false
    }
  }

  return paymentData
}

export const refundActionTripleA = async ({ userDetails, transactionDetails, accessToken, reason }) => {
  let paymentData

  const payload = {
    payment_reference: transactionDetails.paymentTransactionId,
    address: transactionDetails?.moreDetails?.cryptoAddress,
    refund_amount: transactionDetails?.moreDetails?.shortAmount || transactionDetails?.amount,
    refund_reason: 'requested_by_customer',
    remarks: reason,
    notify_url: `${config.get('adminBeUrl')}/api/v1/payment/tripleA/refund?uniqueId=${userDetails.uniqueId}`,
    order_id: transactionDetails?.transactionId
  }

  try {
    const responseData = await axios.post(`${config.get('payment.tripleA.url')}/payout/refund/direct/local`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    paymentData = responseData?.data
  } catch (error) {
    Logger.error('Error in TripleA refund create request - ', { exception: error })
    return false
  }

  if (paymentData?.status && paymentData?.payout_reference) {
    try {
      const responseData = await axios.put(`${config.get('payment.tripleA.url')}/payout/refund/${paymentData.payout_reference}/confirm`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      paymentData = responseData?.data
    } catch (error) {
      Logger.error('Error in TripleA refund confirm request - ', { exception: error })
      return false
    }
  }

  return paymentData
}
