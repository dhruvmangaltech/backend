import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    masterGameCategoryId: { type: 'number' }
  },
  required: ['masterGameCategoryId']
}

const constraints = ajv.compile(schema)

export class DeleteGameCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { masterGameCategoryId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const checkCategoryGameExists = await getOne({
        model: db.MasterGameCategory,
        data: { masterGameCategoryId },
        include: [{
          model: db.MasterGameSubCategory,
          as: 'masterGameSubCategory'
        }],
        transaction
      })
      if (checkCategoryGameExists == null) {
        return this.addError('GameCategoryNotFoundErrorType')
      }
      if (checkCategoryGameExists?.masterGameSubCategory?.length > 0) {
        return this.addError('SubChildExistErrorType')
      }
      await checkCategoryGameExists.destroy()
      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
