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
    popupId: {
      type: 'string'
    },
    visibility: { type: ['string', 'null'], enum: ['1', '0', '2'] },
    status: { type: 'string', enum: ['true', 'false', 'all'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetPopupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { pageNo, limit, status, popupId, visibility } = this.args
      const { page, size } = pageValidation(pageNo, limit)
      let query = { }

      if (status && status !== 'all') query = { ...query, isActive: status }
      if (popupId && +popupId) query = { ...query, popupId }
      if (visibility) query = { ...query, visibility }

      const popups = await db.Popup.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: query,
        order: [['order', 'ASC']],
        limit: size,
        offset: ((page - 1) * size)
      })

      const popupsArray = []
      for (const popupsImages of popups.rows) {
        popupsImages.desktopImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${popupsImages.desktopImageUrl}`
        popupsImages.mobileImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${popupsImages.mobileImageUrl}`

        popupsArray.push(popupsImages)
      }
      popups.rows = popupsArray

      return { popups, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
