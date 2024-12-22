import ajv from '../../libs/ajv'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import { Op } from 'sequelize'
import config from '../../configs/app.config'
import { BONUS_TYPE } from '../../utils/constants/constant'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    isActive: { enum: ['true', 'false', 'null'] },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    bonusId: { type: ['string', 'null'] },
    bonusType: { enum: Object.values(BONUS_TYPE) }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetBonus extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      Bonus: BonusModel,
      UserBonus
    } = this.context.dbModels
    let { orderBy, pageNo, limit, sort, search, isActive, bonusType, bonusId } = this.args
    let query
    let bonusDetails

    try {
      const { page, size } = pageValidation(pageNo, limit)
      if (bonusId) {
        if (isNaN(bonusId)) {
          return this.addError('InvalidIdErrorType')
        } else {
          query = { ...query, bonusId: bonusId }
          bonusDetails = await BonusModel.findAndCountAll({
            where: { ...query },
            include: [{ model: db.BonusVipTiers, attributes: ['bonusId','VipTierId'] }]
          })
          if (bonusDetails) {
            await Promise.all(bonusDetails.rows.map(async (list, index) => {
              if (bonusDetails?.rows[index].imageUrl) {
                bonusDetails?.rows[index].imageUrl.map(async (imageList, imageIndex) => {
                  for (const key in imageList) {
                    imageList[key] = `${s3Config.S3_DOMAIN_KEY_PREFIX}${imageList[key]}`
                  }
                  bonusDetails.rows[index].imageUrl[imageIndex] = imageList
                })
              }
            }))
          }
          return { bonus: bonusDetails, message: SUCCESS_MSG.GET_SUCCESS, success: true }
        }
      }
      if (isActive) {
        isActive = isActive !== 'false'
        query = { ...query, isActive: isActive }
      }
      if (bonusType) {
        query = { ...query, bonusType: bonusType }
      }

      if (search) {
        query = {
          ...query,
          bonusName: { [Op.iLike]: `%${search}%` }
        }
      }
      if (!orderBy) {
        orderBy = 'bonusId'
      }
      if (!sort) {
        sort = 'asc'
      }

      bonusDetails = await BonusModel.findAndCountAll({
        where: { ...query, bonusType: { [Op.notIn]: [BONUS_TYPE.NORMAL_DAILY_BONUS] } },
        limit: size,
        offset: ((page - 1) * size),
        order: [[orderBy, sort]]
      })
      if (bonusDetails.count) {
        await Promise.all(bonusDetails.rows.map(async (list, index) => {
          if (bonusDetails?.rows[index].imageUrl) {
            bonusDetails?.rows[index].imageUrl.map(async (imageList, imageIndex) => {
              for (const key in imageList) {
                imageList[key] = `${s3Config.S3_DOMAIN_KEY_PREFIX}${imageList[key]}`
              }
              bonusDetails.rows[index].imageUrl[imageIndex] = imageList
            })
          }
          const useCount = await UserBonus.count({ where: { bonusId: list.bonusId } })
          bonusDetails.rows[index].claimedCount = useCount
        }))
      }
      return { bonus: bonusDetails, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
