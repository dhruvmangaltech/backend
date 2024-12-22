import ajv from '../libs/ajv'

const paymentTransactionSchema = {
  type: 'object',
  properties: {
    email: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    userId: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    csvDownload: { type: ['string', 'null'] },
    status: {
      type: ['string', 'null'],
      enum: ['pending', 'success', 'failed', 'all', 'void', 'refund', 'inprogress']
    },
    transactionType: {
      type: ['string', 'null'],
      enum: ['deposit', 'withdraw', 'all']
    }
  }
}
ajv.addSchema(paymentTransactionSchema, '/payment-transaction.json')

const redeemRequestsSchema = {
  type: 'object',
  properties: {
    email: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    userId: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    status: {
      type: ['string', 'null'],
      enum: ['pending', 'success', 'inprogress', 'canceled', 'all']
    }
  }
}

ajv.addSchema(redeemRequestsSchema, '/redeem-transaction.json')

const redeemRequestsActionSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['approved', 'rejected']
    },
    withdrawRequestId: { type: ['string', 'null'] },
    transactionId: { type: ['string', 'null'] },
    userId: { type: 'number' },
    reason: { type: ['string', 'null'] }
  },
  required: ['status', 'userId']
}

ajv.addSchema(redeemRequestsActionSchema, '/redeem-request-action.json')

const refundPurchaseSchema = {
  type: 'object',
  properties: {
    reason: { type: 'string' },
    userId: { type: 'number' },
    transactionBankingId: { type: ['number', 'null'] },
    paymentTransactionId: { type: 'string' }
  },
  required: ['userId', 'paymentTransactionId', 'reason']
}

ajv.addSchema(refundPurchaseSchema, '/refund-purchase.json')
