import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    order: {
      type: 'array'
    },
    masterGameCategoryId: {
      type: 'number'
    }
  },
  required: ['masterGameCategoryId', 'order']
}

const constraints = ajv.compile(schema)

export class OrderSubCategory extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterGameCategory: MasterGameCategoryModel,
        MasterGameSubCategory: MasterGameSubCategoryModel
      }
    } = this.context
    let { order, masterGameCategoryId } = this.args
    const promises = []
    order = [...(new Set(order))]

    const isCategoryExist = await getOne({
      model: MasterGameCategoryModel,
      data: { masterGameCategoryId },
      include: [
        { model: MasterGameSubCategoryModel, as: 'masterGameSubCategory' }
      ],
      attributes: ['isActive']
    })
    if (!isCategoryExist) {
      return (this.addError('GameCategoryNotExistsErrorType'))
    }

    const subCategory = isCategoryExist.masterGameSubCategory
    if (subCategory.length !== order.length) return this.addError('OrderInvalidErrorType')

    subCategory.forEach(async (category) => {
      if (order.indexOf(category.masterGameSubCategoryId) !== -1) {
        promises.push(category.set({ orderId: order.indexOf(category.masterGameSubCategoryId) + 1 }).save())
      }
    })

    await Promise.all(promises)

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
