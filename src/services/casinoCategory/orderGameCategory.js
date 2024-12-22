import db from '../../db/models'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { getOne, updateEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    order: { type: 'array' }
  },
  required: ['order']
}

const constraints = ajv.compile(schema)

export class OrderGameCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { order } = this.args
    const promises = []

    try {
      order.forEach(async (id, index) => {
        const checkCategoryExists = await getOne({
          model: db.MasterGameCategory,
          data: { masterGameCategoryId: id }
        })
        if (checkCategoryExists) {
          promises.push(updateEntity({
            model: db.MasterGameCategory,
            data: { orderId: index + 1 },
            values: { masterGameCategoryId: id }
          }))
        }
      })
      await Promise.all(promises)
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
