import ajv from '../libs/ajv'
const stocksListSchemas = {
    type: 'object',
    properties: {
        pageNo: { type: 'string' },
        limit: { type: 'string' },
        idSearch: { type: 'string' },
        nameSearch: { type: 'string' },
        colourSearch: { type: 'string' },
        ScaleSearch: { type: 'string' },
        SizeSearch: { type: 'string' },
        DescriptionSearch: { type: 'string' }
    },
    required: []
}
ajv.addSchema(stocksListSchemas, '/stock-list.json')

const updateSchemas = {
    type: 'object',
    properties: {
        stockId: { type: 'string' },
        actionType: {type: 'string'},
        amount: {type: 'number'}
    },
    required: ['stockId', 'actionType', 'amount']
}
ajv.addSchema(updateSchemas, '/stock-update.json')