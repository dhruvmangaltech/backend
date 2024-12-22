import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    isActive: {
      type: ['string'],
      enum: ['true', 'false', 'all']
    },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetAllGameCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, search, isActive, orderBy, sort } = this.args

    try {
      let query
      const model = db.MasterGameCategory
      const order = [[orderBy || 'createdAt', sort || 'DESC']]
      const attributes = ['masterGameCategoryId', 'name', 'isActive']

      const { page, size } = pageValidation(pageNo, limit)
      if (search) query = { ...query, name: { EN: { [Op.iLike]: `%${search}%` } } }
      if (isActive && isActive !== 'all') query = { ...query, isActive }

      let casinoCategories
      if (pageNo && limit) {
        casinoCategories = await model.findAndCountAll({
          where: query,
          order: order,
          limit: size,
          offset: ((page - 1) * size)
        })
      } else {
        casinoCategories = await model.findAndCountAll({
          where: query,
          order: order,
          attributes
        })
      }
      if (!casinoCategories) return this.addError('GameCategoryNotFoundErrorType')

      return { casinoCategories, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
