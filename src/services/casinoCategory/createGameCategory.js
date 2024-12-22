import { Op } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    name: { type: 'object' },
    isActive: { type: 'boolean', enum: [true, false] }
  },
  required: ['name', 'isActive']
}

const constraints = ajv.compile(schema)

export class CreateGameCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { name, isActive } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const checkCategoryExists = await getOne({
        model: db.MasterGameCategory,
        data: { name: { [Op.contains]: { EN: name.EN } } }
      })

      if (checkCategoryExists) return this.addError('GameCategoryExistsErrorType')

      let lastOrderId = await db.MasterGameCategory.max('orderId')
      if (!lastOrderId) lastOrderId = 0

      const createCategory = await createNewEntity({
        model: db.MasterGameCategory,
        data: { name, isActive, orderId: lastOrderId + 1 },
        transaction
      })

      return { createCategory, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
