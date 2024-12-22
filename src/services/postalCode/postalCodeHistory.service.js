import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { filterByDateCreatedAt } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class PostalCodeHistoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        PostalCodeCsv: PostalCodeCsvModel
      }
    } = this.context
    try {
      const { startDate, endDate } = this.args
      let query = {}
      if (startDate || endDate) query = filterByDateCreatedAt(query, startDate, endDate, 'PostalCodeCsv')

      const postalCodeHistory = await PostalCodeCsvModel.findAndCountAll({
        where: { ...query },
        attibutes: ['csvId', 'name', 'successCount', 'failedCount', 'userName', 'createdAt', 'updatedAt'],
        order: [['csvId', 'DESC']]
      })
      return { count: postalCodeHistory?.count, rows: postalCodeHistory?.rows, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
