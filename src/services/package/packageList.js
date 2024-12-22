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
    id: { type: 'number' },
    user: { type: 'object' },
    sort: { type: 'string' },
    orderBy: { type: 'string' },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    packageId: { type: ['string', 'null'] },
    isActive: { type: ['string', 'null'] },
    hot: { type: ['string', 'null'] },
    isVisibleInStore: { type: ['string', 'null'] },
    bonusId: {type: 'integer'},
    vipPoints: {type: 'integer'}
  },
  required: ['sort', 'orderBy']
}

const constraints = ajv.compile(schema)

export class GetPackageList extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { orderBy = 'packageId', pageNo, limit, sort, search = '', packageId = '', isActive = '', isVisibleInStore = '', hot = '' } = this.args
    let query, packageList
    try {
      if (packageId) query = { ...query, packageId }
      if (isActive && isActive !== 'all') query = { ...query, isActive }
      if (hot !== '') query = { ...query, hot }
      if (isVisibleInStore !== '') query = { ...query, isVisibleInStore }
      if (search) {
        query = {
          ...query,
          [Op.and]: [
            {
              [Op.or]: [
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('amount'), ' ', Sequelize.col('gc_coin'), ' ', Sequelize.col('sc_coin')), {
                  [Op.iLike]: `%${search}%`
                }),
                { currency: { [Op.iLike]: `%${search}%` } }]
            }
          ]
        }
      }

      if (search) query = filterBySearchGroup(query, search)

      if (pageNo && limit) {
        const { page, size } = pageValidation(pageNo, limit)

        packageList = await db.package.findAndCountAll({
          where: { ...query },
          limit: size,
          offset: ((page - 1) * size),
          order: [[orderBy, sort]],
          include: [{ model: db.PackageUsers, attributes: ['userId'] }]
        })
      } else {
        packageList = await db.package.findAndCountAll({
          where: query,
          order: [[orderBy, sort]],
          include: [{ model: db.PackageUsers, attributes: ['userId'] }]
        })
      }

      if (!packageList) return this.addError('NotFound')

      const detailsList = []
      if (packageList.count) {
        await Promise.all(packageList.rows.map(async (list) => {
          const users = []
          await Promise.all(list.PackageUsers.map(async (listUserId) => {
            const useCount = await db.User.findOne({ where: { userId: listUserId.userId }, attributes: ['userId', 'firstName', 'lastName', 'email'] })
            users.push({ ...useCount.dataValues })
          }))
          if (list.dataValues.imageUrl && list.dataValues.imageUrl !== '') {
            list.dataValues.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${list.dataValues.imageUrl}`
          }
          detailsList[list.dataValues.packageId] = { ...list.dataValues, users }
        }))
      }
      // packageList.rows = [...detailsList]

      packageList.rows.map(async (list, index) => {
        if (list.PackageUsers !== null && list.PackageUsers.length) {
          packageList.rows[index] = detailsList[list.packageId]
        }
      })
      return { packageList, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
