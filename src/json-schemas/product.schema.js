import ajv from '../libs/ajv'
const productListSchemas = {
  type: 'object',
  properties: {
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    idSearch: { type: 'string' },
    nameSearch: { type: 'string' },
    colourSearch: { type: 'string' },
    ScaleSearch: { type: 'string' },
    SizeSearch: { type: 'string' },
    DescriptionSearch: { type: 'string' }
  },
  required: []
}
ajv.addSchema(productListSchemas, '/product-list.json')

const createSchemas = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      colour: { type: ['string', 'null'] },
      isActive: { type: 'string', enum: ['true', 'false'] },
      scale: { type: 'string' },
      size: { type: 'string' },
      description: { type: 'string' }
    },
    required: ['name', 'colour', 'scale', 'isActive', 'size', 'description']
  }
  ajv.addSchema(createSchemas, '/product-create.json')

  const updateSchemas = {
    type: 'object',
    properties: {
        productId: {type: 'string'},
        name: { type: 'string' },
        colour: { type: ['string', 'null'] },
        isActive: { type: 'string', enum: ['true', 'false'] },
        scale: { type: 'string' },
        size: { type: 'string' },
        description: { type: 'string' }
    },
    required: ['name', 'colour', 'scale', 'isActive', 'size', 'description']
  }
  ajv.addSchema(updateSchemas, '/product-update.json')