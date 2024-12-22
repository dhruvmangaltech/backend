import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    limit: { type: 'number' },
    pageNo: { type: 'number' },
    search: { type: 'string' },
    orderBy: { type: ['string', 'null'] },
    sort: { type: 'string', enum: ['ASC', 'DESC'] },
    isActive: {
      type: 'string',
      enum: ['true', 'false']
    },
    liveSupport: {
      type: 'string',
      enum: ['true', 'false']
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetVipTiersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, search, orderBy, sort, isActive, liveSupport } =
      this.args

    const {
      dbModels: { VipTier: VipTierModel }
    } = this.context
    let query
    if (search) {
      query = { ...query, name: { [Op.iLike]: `%${search.trim()}%` } }
    }

    if (isActive && isActive !== 'all') query = { ...query, isActive }
    if (liveSupport) query = { ...query, liveSupport }
    const { page, size } = pageValidation(pageNo, limit)
    let vipTiers
    const attributes = [
      'vipTierId',
      'name',
      'bonusSc',
      'bonusGc',
      'scRequiredPlay',
      'scRequiredMonth',
      'gcRequiredPurchase',
      'gcRequiredMonth',
      'boost',
      'rakeback',
      'level',
      'icon',
      'gradualLoss',
      'liveSupport',
      'isActive'
    ]
    if (pageNo && limit) {
      vipTiers = await VipTierModel.findAndCountAll({
        attributes: attributes,
        where: query,
        order: [[orderBy || 'level', sort || 'ASC']],
        limit: size,
        offset: (page - 1) * size
      })
    } else {
      vipTiers = await VipTierModel.findAndCountAll({
        attributes: attributes,
        where: query,
        order: [[orderBy || 'level', sort || 'ASC']]
      })
    }

    vipTiers.rows.map(vipTier => {vipTier.icon = vipTier.icon ? `${s3Config.S3_DOMAIN_KEY_PREFIX}${vipTier.icon}` : null})

    return { vipTiers: vipTiers, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
