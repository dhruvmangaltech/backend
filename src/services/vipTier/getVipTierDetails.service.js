import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    vipTierId: { type: 'string', pattern: '^[0-9]+$' }
  },
  required: ['vipTierId']
}

const constraints = ajv.compile(schema)

export class GetVipTierDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { vipTierId } = this.args

    const {
      dbModels: { VipTier: VipTierModel }
    } = this.context

    const getVipTierDetails = await getOne({
      model: VipTierModel,
      data: { vipTierId }
    })
    if (!getVipTierDetails) return this.addError('VipTierNotFoundErrorType')

    getVipTierDetails.icon = getVipTierDetails.icon ? `${s3Config.S3_DOMAIN_KEY_PREFIX}${getVipTierDetails.icon}` : null

    return {
      getVipTierDetails,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
