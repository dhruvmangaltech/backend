export const paymentTransactionSchema = {
  bodySchema: {
    $ref: '/payment-transaction.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        sumOfAmount: { type: 'object' },
        transactionDetail: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const redeemRequestsSchema = {
  bodySchema: {
    $ref: '/redeem-transaction.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        requestDetails: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const redeemRequestsActionSchema = {
  bodySchema: {
    $ref: '/redeem-request-action.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}

export const refundPurchaseSchema = {
  bodySchema: {
    $ref: '/refund-purchase.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}
