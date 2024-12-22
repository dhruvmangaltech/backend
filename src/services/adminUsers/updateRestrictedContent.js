import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteEntity, getAll, updateEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  required: ['model', 'values', 'data', 'type']
}

const constraints = ajv.compile(schema)

export class UpdateRestrictedContentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let result
    const { model, values, data, type, attributes } = this.args

    try {
      if (type === 'update') {
        result = await updateEntity({ model: db[model], values, data })
      } else if (type === 'getAllData') {
        result = await getAll({ model: db[model], data, attributes })
      } else if (type === 'deleteEntity') {
        result = await deleteEntity({ model: db[model], values })
      }

      return { result, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}