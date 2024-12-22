import Logger from './logger'
import config from '../configs/app.config'
import { CUSTOMER_IO_TRANSACTION_ID } from '../utils/constants/constant'
import { TrackClient, RegionUS, APIClient, SendEmailRequest } from 'customerio-node'

const region = RegionUS
const cio = new TrackClient(config.get('customerio.siteId'), config.get('customerio.trackApiKey'), { region })

export const insertUpdate = (id, data) => {
  cio.identify(id, data)
}

export const event = (id, data) => {
  cio.track(id, data)
}

export const sendMail = async (email, customerIoTransactionId, userName, token) => {
  let request
  const frontendHost = config.get('userFrontendUrl') || 'http://127.0.01'
  const client = new APIClient(config.get('customerio.appApiKey'), { region: RegionUS })

  if (customerIoTransactionId === CUSTOMER_IO_TRANSACTION_ID.VERIFY_MESSAGE_ID) {
    const verificationLink = frontendHost + '/user/verifyEmail?token=' + token
    request = new SendEmailRequest({
      transactional_message_id: customerIoTransactionId,
      message_data: {
        link: verificationLink
      },
      identifiers: {
        id: email
      },
      to: email
    })
  } else if (customerIoTransactionId === CUSTOMER_IO_TRANSACTION_ID.FORGET_PASSWORD_MESSAGE_ID) {
    request = new SendEmailRequest({
      transactional_message_id: customerIoTransactionId,
      message_data: {
        link: frontendHost + '/user/forgotPassword?token=' + token
      },
      identifiers: {
        id: email
      },
      to: email
    })
  } else if (customerIoTransactionId === CUSTOMER_IO_TRANSACTION_ID.PASSWORD_CONFIRMED_MESSAGE_ID) {
    request = new SendEmailRequest({
      transactional_message_id: customerIoTransactionId,
      message_data: {
        userName
      },
      identifiers: {
        id: email
      },
      to: email
    })
  } else if (customerIoTransactionId === CUSTOMER_IO_TRANSACTION_ID.DEPOSIT_SUCCESS) {
    request = new SendEmailRequest({
      transactional_message_id: customerIoTransactionId,
      identifiers: {
        id: email
      },
      to: email
    })
  }

  try {
    return await client.sendEmail(request)
  } catch (error) {
    Logger.error(error.statusCode, error.message)
    return false
  }
}
