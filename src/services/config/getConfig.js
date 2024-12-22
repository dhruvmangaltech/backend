import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { ERRORS } from '../../utils/constants/errors'
import { decodeCredential } from '../../utils/common'
const constraints = {}

export class GetConfigService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const getConfig = await db.GlobalSetting.findAll({
        attributes: ['value', 'key'],
        raw: true,
        where: {
          key: ['SUPPORT_EMAIL_ADDRESS', 'SITE_NAME', 'ORIGIN', 'LOGO_URL', 'SENDGRID_EMAIL', 'SENDGRID_API_KEY', 'MINIMUM_REDEEMABLE_COINS', 'MAXIMUM_REDEEMABLE_COINS']
        }
      })
      const config = []
      getConfig.forEach((credential, index) => {
        if (credential.key === 'SENDGRID_API_KEY') {
          const API_KEY = Buffer.from(decodeCredential(credential.value), 'ascii')
          getConfig[index].value = API_KEY.toString('base64')
        }
        if (credential.key === 'SENDGRID_EMAIL') getConfig[index].value = decodeCredential(credential.value)

        config[index] = credential
      })
      return { config }
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error)
    }
  }
}
