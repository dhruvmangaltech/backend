export const stockslistSchemas = {
    querySchema: {
      $ref: '/stock-list.json'
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          stockList: { type: 'object' }
        },
        required: ['message']
      }
    }
  }

  export const stocksUpdateSchemas = {
    bodySchema: {
      $ref: '/stock-update.json'
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          updatedStock: { type: 'object' }
        },
        required: ['message']
      }
    }
  }
  