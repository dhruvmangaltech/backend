import ajv from '../libs/ajv'

const listSchema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    search: { type: 'string' },
    isActive: { type: 'string', enum: ['true', 'false', 'all'] },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    hot: { type: 'string' },
    isVisibleInStore: { type: 'string' },
    packageId: { type: 'string' },
    bonusId: { type: 'integer', pattern: '^[0-9]+$' },
    vipPoints: { type: 'integer', pattern: '^[0-9]+$' }
  },
  required: ['sort', 'orderBy']
}

ajv.addSchema(listSchema, '/package-list.json')

const createSchemas = {
  type: 'object',
  properties: {
    amount: { type: 'string' },
    previousAmount: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    isVisibleInStore: { type: 'string', enum: ['true', 'false'] },
    packageType: { type: 'string' },
    gcCoin: { type: 'string', pattern: '^[0-9]+(\.[0-9]{1,2})?$' },
    scCoin: { type: 'string', pattern: '^[0-9]+(\.[0-9]{1,2})?$' },
    image: { type: ['object', 'null'] },
    newPackageType: { type: 'string', enum: ['true', 'false'] },
    validTill: { type: 'string' },
    showPackageType: { type: 'string', enum: ['true', 'false'] },
    bonusId: { type: 'string', pattern: '^[0-9]+$' },
    vipPoints: { type: 'string', pattern: '^[0-9]+$' },
    firstPurchaseApplicable: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['amount', 'gcCoin', 'scCoin', 'isActive', 'isVisibleInStore', 'packageType', 'newPackageType', 'validTill', 'showPackageType']
}
ajv.addSchema(createSchemas, '/package-create.json')

const updateSchemas = {
  type: 'object',
  properties: {
    amount: { type: 'string' },
    previousAmount: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    isVisibleInStore: { type: 'string', enum: ['true', 'false'] },
    packageType: { type: 'string' },
    gcCoin: { type: 'string', pattern: '^[0-9]+$' },
    scCoin: { type: 'string', pattern: '^[0-9]+$' },
    packageId: { type: 'string', pattern: '^[0-9]+$' },
    image: { type: ['object', 'null'] },
    newPackageType: { type: 'string', enum: ['true', 'false'] },
    validTill: { type: 'string' },
    showPackageType: { type: 'string', enum: ['true', 'false'] },
    bonusId: { type: 'string', pattern: '^[0-9]+$' },
    vipPoints: { type: 'string', pattern: '^[0-9]+$' },
    firstPurchaseApplicable: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['amount', 'gcCoin', 'scCoin', 'isActive', 'isVisibleInStore', 'packageType', 'packageId', 'newPackageType', 'validTill', 'showPackageType']
}
ajv.addSchema(updateSchemas, '/package-update.json')

const updateOrderSchemas = {
  type: 'object',
  properties: {
    order: { type: 'array' }
  },
  required: ['order']
}
ajv.addSchema(updateOrderSchemas, '/package-order.json')
