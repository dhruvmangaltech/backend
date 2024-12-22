import { Op, Sequelize } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { filterBySearchGroup, pageValidation } from '../../utils/common'
import config from '../../configs/app.config'
const s3Config = config.getProperties().s3

const schema = {
    type: 'object',
    properties: {
      pageNo: { type: 'string' },
      limit: { type: 'string' },
      isActive: {
        type: 'string',
        enum: ['true', 'false', 'all']
      },
      idSearch: { type: 'string' },
      nameSearch: { type: 'string' },
      colourSearch: { type: 'string' },
      ScaleSearch: { type: 'string' },
      SizeSearch: { type: 'string' }
    },
    required: []
  }

const constraints = ajv.compile(schema)

export class GetProductList extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { 
        pageNo, 
        limit, 
        sort, 
        search = '', 
        idSearch = '', 
        isActive = '',
        nameSearch,
        colourSearch,
        ScaleSearch,
        SizeSearch
    } = this.args

    let query, productList
    try {
        const orderBy = 'createdAt', sort = 'productId'
        if (pageNo && limit) {
        const { page, size } = pageValidation(pageNo, limit)

        productList = await db.Product.findAndCountAll({
          where: { ...query },
          limit: size,
          offset: ((page - 1) * size),
        //   order: [[orderBy, sort]],
          include: [{ model: db.Stock, as: 'stocks'}]
        })
      } else {
        productList = await db.package.findAndCountAll({
          where: query,
          order: [[orderBy, sort]],
          include: [{ model: db.PackageUsers, attributes: ['userId'] }]
        })
      }

      if (!productList) return this.addError('NotFound')

    //   const detailsList = []
    //   if (productList.count) {
    //     await Promise.all(productList.rows.map(async (list) => {
    //       const users = []
    //       await Promise.all(list.PackageUsers.map(async (listUserId) => {
    //         const useCount = await db.User.findOne({ where: { userId: listUserId.userId }, attributes: ['userId', 'firstName', 'lastName', 'email'] })
    //         users.push({ ...useCount.dataValues })
    //       }))
    //       if (list.dataValues.imageUrl && list.dataValues.imageUrl !== '') {
    //         list.dataValues.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${list.dataValues.imageUrl}`
    //       }
    //       detailsList[list.dataValues.packageId] = { ...list.dataValues, users }
    //     }))
    //   }
    //   // productList.rows = [...detailsList]

    //   productList.rows.map(async (list, index) => {
    //     if (list.PackageUsers !== null && list.PackageUsers.length) {
    //       productList.rows[index] = detailsList[list.packageId]
    //     }
    //   })
      return { productList, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}