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
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] }
  }
}

const constraints = ajv.compile(schema)

export class GetMasterCasinoProvidersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, orderBy, sort } = this.args
    let casinoProvider

    try {
      const { page, size } = pageValidation(pageNo, limit)
      if (pageNo && limit) {
        casinoProvider = await db.MasterCasinoProvider.findAndCountAll({
          order: [[orderBy || 'masterCasinoProviderId', sort || 'ASC']],
          limit: size,
          offset: ((page - 1) * size)
        })
      } else {
        casinoProvider = await db.MasterCasinoProvider.findAndCountAll({
          order: [[orderBy || 'masterCasinoProviderId', sort || 'ASC']],
          attributes: ['masterCasinoProviderId', 'name']
        })
      }
      if (!casinoProvider) return this.addError('CasinoProviderNotFoundErrorType')
      const casinoProviderArray = []
      for (const casinoProviderImages of casinoProvider.rows) {
        if (casinoProviderImages.thumbnailUrl) {
          casinoProviderImages.thumbnailUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${casinoProviderImages.thumbnailUrl}`
        }
        casinoProviderArray.push(casinoProviderImages)
      }
      casinoProvider.rows = casinoProviderArray
      return { casinoProvider, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
