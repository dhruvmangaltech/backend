export const packagelistSchemas = {
  querySchema: {
    $ref: '/package-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        packageList: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const packageCreateSchemas = {
  bodySchema: {
    $ref: '/package-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createPackage: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const packageUpdateSchemas = {
  bodySchema: {
    $ref: '/package-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updatedPackage: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const packageOrderSchemas = {
  bodySchema: {
    $ref: '/package-order.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
