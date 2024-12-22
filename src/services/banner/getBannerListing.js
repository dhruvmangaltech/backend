import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import config from '../../configs/app.config'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    pageNo: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    pageBannerId: {
      type: 'string'
    },
    visibility: { type: ['string', 'null'], enum: ['1', '0'] },
    status: { type: 'string', enum: ['true', 'false', 'all'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { status, pageBannerId, visibility } = this.args
      // const { page, size } = pageValidation(pageNo, limit)
      let query = { }

      if (status && status !== 'all') query = { ...query, isActive: status }
      if (pageBannerId && +pageBannerId) query = { ...query, pageBannerId }
      if (visibility) query = { ...query, visibility }

      const banners = await db.PageBanner.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: query,
        order: [['order', 'ASC']]
      })

      const bannersArray = []
      for (const bannersImages of banners.rows) {
        bannersImages.desktopImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${bannersImages.desktopImageUrl}`
        bannersImages.mobileImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${bannersImages.mobileImageUrl}`

        bannersArray.push(bannersImages)
      }
      banners.rows = bannersArray

      return { banners, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
