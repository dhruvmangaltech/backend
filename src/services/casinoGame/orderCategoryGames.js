import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getAll } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    order: { type: 'array' },
    masterGameSubCategoryId: { type: 'number' }
  },
  required: ['order', 'masterGameSubCategoryId']
}

const constraints = ajv.compile(schema)

export class OrderCategoryGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { order, masterGameSubCategoryId } = this.args
    order = [...(new Set(order))]
    const promises = []

    try {
      const masterCasinoGameObj = await getAll({
        model: db.GameSubcategary,
        data: { masterGameSubCategoryId },
        attributes: ['gameSubcategoryId', 'masterGameSubCategoryId', 'masterCasinoGameId', 'orderId']
      })

      if (!masterCasinoGameObj) return this.addError('GameSubCategoryNotFoundErrorType')

      masterCasinoGameObj.forEach(async (game) => {
        if (order.indexOf(game.gameSubcategoryId) !== -1) {
          promises.push(game.set({ orderId: order.indexOf(game.gameSubcategoryId) + 1 }).save())
        }
      })
      await Promise.all(promises)

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
