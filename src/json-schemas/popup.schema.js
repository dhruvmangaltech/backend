import ajv from '../libs/ajv'

const popupUploadSchemas = {
  type: 'object',
  properties: {
    visibility: { type: 'string', enum: ['0', '1', '2'] }, // 0 - Before Login, 1 - After Login, 2 - Both
    btnText: { type: ['string', 'null'] },
    btnRedirection: { type: ['string', 'null'], enum: ['registration', 'search', 'purchase', 'kyc', 'null', 'store', 'reward', 'promotionsPage', 'sweeperCasinoScratchers', ''] },
    textOne: { type: ['string', 'null'] },
    textTwo: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    popName: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    popupName: { type: ['string', 'null'], enum: ['lobbyPage', 'promotionPage', 'rewardPage', 'sweeperCasinoScratchersPage', 'storePage', ''] }
  },
  required: ['visibility', 'isActive']
}
ajv.addSchema(popupUploadSchemas, '/popup-upload.json')

const updateSchemas = {
  type: 'object',
  properties: {
    popupId: { type: 'string', pattern: '^[0-9]+$' },
    btnText: { type: ['string', 'null'] },
    btnRedirection: { type: ['string', 'null'], enum: ['registration', 'search', 'purchase', 'kyc', 'null', 'store', 'reward', 'promotionsPage', 'sweeperCasinoScratchers', ''] },
    textOne: { type: ['string', 'null'] },
    textTwo: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    popName: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    popupName: { type: ['string', 'null'], enum: ['lobbyPage', 'promotionPage', 'rewardPage', 'sweeperCasinoScratchersPage', 'storePage', ''] }
  },
  required: ['popupId', 'isActive']
}
ajv.addSchema(updateSchemas, '/popup-update.json')

const deleteSchemas = {
  type: 'object',
  properties: {
    popupId: { type: 'number' }
  },
  required: ['popupId']
}
ajv.addSchema(deleteSchemas, '/popup-delete.json')

const getSchemas = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    visibility: { type: ['string', 'null'], enum: ['0', '1', '2'] },
    status: { type: 'string', enum: ['true', 'false', 'all'] },
    popupId: { type: 'string' }
  },
  required: []
}
ajv.addSchema(getSchemas, '/popup-get.json')

// const getKeysSchemas = {
//   type: 'object',
//   properties: {
//   },
//   required: []
// }
// ajv.addSchema(getKeysSchemas, '/banner-keys.json')

// const orderBannerSchemas = {
//   type: 'object',
//   properties: {
//     order: {
//       type: 'array'
//     }
//   },
//   required: ['order']
// }

// ajv.addSchema(orderBannerSchemas, '/order-banner.json')
