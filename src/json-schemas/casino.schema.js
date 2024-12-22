
import ajv from '../libs/ajv'

const providerCreateSchemas = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    isActive: { type: 'string', enum: ['true', 'false', 'all'] },
    thumbnail: { type: ['object', 'null'] }
  },
  required: ['name', 'isActive']
}
ajv.addSchema(providerCreateSchemas, '/casino-provider-create.json')

const providerUpdateSchemas = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    isActive: { type: 'string', enum: ['true', 'false', 'all'] },
    masterCasinoProviderId: { type: 'string' },
    thumbnail: { type: ['object', 'null'] }
  },
  required: ['name', 'masterCasinoProviderId', 'isActive']
}
ajv.addSchema(providerUpdateSchemas, '/casino-provider-update.json')

const providerDeleteSchemas = {
  type: 'object',
  properties: {
    masterCasinoProviderId: { type: 'number' }
  },
  required: ['masterCasinoProviderId']
}
ajv.addSchema(providerDeleteSchemas, '/casino-provider-delete.json')

const providerGetSchemas = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] }
  },
  required: []
}
ajv.addSchema(providerGetSchemas, '/casino-provider-get.json')

const categoryCreateSchemas = {
  type: 'object',
  properties: {
    name: { type: 'object' },
    isActive: { type: 'boolean', enum: [true, false] }
  },
  required: ['name', 'isActive']
}
ajv.addSchema(categoryCreateSchemas, '/casino-category-create.json')

const categoryUpdateSchemas = {
  type: 'object',
  properties: {
    name: { type: 'object' },
    casinoCategoryId: { type: 'number' },
    isActive: { type: 'boolean', enum: [true, false] }
  },
  required: ['name', 'isActive', 'casinoCategoryId']
}
ajv.addSchema(categoryUpdateSchemas, '/casino-category-update.json')

const categoryGetSchemas = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] }
  },
  required: []
}
ajv.addSchema(categoryGetSchemas, '/casino-category-get.json')

const categoryOrderUpdateSchemas = {
  type: 'object',
  properties: {
    order: { type: 'array' }
  },
  required: ['order']
}
ajv.addSchema(categoryOrderUpdateSchemas, '/casino-category-order-update.json')

const categoryDeleteUpdateSchemas = {
  type: 'object',
  properties: {
    masterGameCategoryId: { type: 'number' }
  },
  required: ['masterGameCategoryId']
}
ajv.addSchema(categoryDeleteUpdateSchemas, '/casino-category-delete.json')

const gameCreateSchemas = {
  type: 'object',
  properties: {
    games: { type: 'array' },
    masterGameSubCategoryId: { type: 'number' }
  },
  required: ['masterGameSubCategoryId', 'games']
}
ajv.addSchema(gameCreateSchemas, '/casino-game-create.json')

const gameUpdateSchemas = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    masterCasinoGameId: { type: 'string' },
    masterGameSubCategoryId: { type: 'string' },
    isActive: { type: 'string', enum: ['true', 'false'] },
    fullScreen: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['name', 'isActive', 'masterCasinoGameId']
}
ajv.addSchema(gameUpdateSchemas, '/casino-game-update.json')

const gameDeleteSchemas = {
  type: 'object',
  properties: {
    masterCasinoGameId: { type: 'number' },
    masterGameSubCategoryId: { type: 'number' },
    masterCasinoGameIds: { type: 'array' }
  },
  required: []
}
ajv.addSchema(gameDeleteSchemas, '/casino-game-delete.json')

const gameOrderUpdateSchemas = {
  type: 'object',
  properties: {
    order: { type: 'array' },
    masterGameSubCategoryId: { type: 'number' }
  },
  required: ['order', 'masterGameSubCategoryId']
}
ajv.addSchema(gameOrderUpdateSchemas, '/casino-game-order-update.json')

const transactionsGetSchemas = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    currencyCode: { type: ['string', 'null'] },
    transactionType: {
      type: ['string', 'null'],
      enum: ['bet', 'win', 'rollback', 'rollbackbeforebetwin', 'freespins', '', 'null', 'all', 'lost', 'bonus']
    },
    status: { type: ['string', 'null'], enum: ['pending', 'completed', 'failed', 'rollback', 'all', 'null', ''] },
    email: { type: ['string', 'null'] },
    csvDownload: { type: ['string', 'null'], enum: ['true', 'false', ''] },
    userId: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    amountType: { type: ['string', 'null'], enum: ['0', '1', 'all'] }
  },
  required: []
}
ajv.addSchema(transactionsGetSchemas, '/get-casino-transactions.json')
