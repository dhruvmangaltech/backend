import db from '../../db/models'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { getOne, updateEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    name: { type: 'object' },
    user: { type: 'object' },
    casinoCategoryId: { type: 'number' },
    isActive: { type: 'boolean' }
  },
  required: ['user', 'name', 'casinoCategoryId']
}

const constraints = ajv.compile(schema)

export class UpdateGameCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { name, casinoCategoryId, isActive } = this.args

    const transaction = this.context.sequelizeTransaction

    try {
      const checkCategoryExists = await getOne({
        model: db.MasterGameCategory,
        data: { masterGameCategoryId: casinoCategoryId }
      })
      if (!checkCategoryExists) {
        return this.addError('GameCategoryNotExistsErrorType')
      }
      if (checkCategoryExists.name.EN !== name.EN) {
        const nameExists = await getOne({
          model: db.MasterGameCategory,
          data: { name }
        })
        if (nameExists) {
          return this.addError('GameCategoryExistsErrorType')
        }
      }
      const updateCategory = await updateEntity({
        model: db.MasterGameCategory,
        data: { name: { ...checkCategoryExists.name, ...name }, isActive },
        values: { masterGameCategoryId: casinoCategoryId },
        transaction: transaction
      })
      return { updateCategory, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
