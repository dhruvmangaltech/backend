export const productlistSchemas = {
    querySchema: {
      $ref: '/product-list.json'
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          productList: { type: 'object' }
        },
        required: ['message']
      }
    }
  }

  export const productCreateSchemas = {
    bodySchema: {
      $ref: '/product-create.json'
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          createProduct: { type: 'object' }
        },
        required: ['message']
      }
    }
  }
  export const productUpdateSchemas = {
    bodySchema: {
      $ref: '/product-update.json'
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          updatedProduct: { type: 'object' }
        },
        required: ['message']
      }
    }
  }
  