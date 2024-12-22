import ajv from '../libs/ajv'

const getSubCategorySchemas = {
  type: 'object',
  properties: {
    masterGameCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    limit: {
      type: 'string'
    },
    pageNo: {
      type: 'string'
    },
    search: {
      type: 'string'
    },
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    sort: {
      type: 'string',
      enum: ['asc', 'desc']
    },
    orderBy: {
      type: 'string'
    }
  },
  required: []
}
ajv.addSchema(getSubCategorySchemas, '/get-sub-category.json')

const createSubCategorySchemas = {
  type: 'object',
  properties: {
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    name: {
      type: 'string'
    },
    masterGameCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    isFeatured: {
      type: 'string',
      enum: ['true', 'false']
    }
  },
  required: ['isActive', 'name', 'masterGameCategoryId', 'isFeatured']
}
ajv.addSchema(createSubCategorySchemas, '/create-sub-category.json')

const updateSubCategorySchemas = {
  type: 'object',
  properties: {
    isActive: {
      type: 'string',
      enum: ['true', 'false']
    },
    name: {
      type: 'string'
    },
    masterGameCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    masterGameSubCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    isFeatured: {
      type: 'string',
      enum: ['true', 'false']
    }
  },
  required: ['isActive', 'name', 'masterGameCategoryId', 'masterGameSubCategoryId', 'isFeatured']
}
ajv.addSchema(updateSubCategorySchemas, '/update-sub-category.json')

const deleteSubCategorySchemas = {
  type: 'object',
  properties: {
    masterGameSubCategoryId: {
      type: 'number'
    }
  },
  required: ['masterGameSubCategoryId']
}
ajv.addSchema(deleteSubCategorySchemas, '/delete-sub-category.json')

const orderSubCategorySchemas = {
  type: 'object',
  properties: {
    order: {
      type: 'array'
    },
    masterGameCategoryId: {
      type: 'number'
    }
  },
  required: ['masterGameCategoryId', 'order']
}

ajv.addSchema(orderSubCategorySchemas, '/order-sub-category.json')
