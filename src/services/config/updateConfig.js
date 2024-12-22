import db from '../../db/models'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { updateEntity } from '../../utils/crud'
import { validateFile, uploadFile, encodeCredential } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import config from '../../configs/app.config'

const schema = {
  type: 'object',
  properties: {
    siteName: { type: 'string' },
    origin: { type: 'string' },
    supportEmail: {
      type: 'string',
      maxLength: 150,
      format: 'email'
    },
    minRedeemableCoins: { type: 'string' },
    maxRedeemableCoins: { type: 'string' }
  },
  required: ['siteName', 'origin', 'supportEmail', 'minRedeemableCoins', 'maxRedeemableCoins']
}
const constraints = ajv.compile(schema)
export class UpdateConfigService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { supportEmail, siteName, origin, minRedeemableCoins, maxRedeemableCoins } = this.args
    const {
      req: {
        file: image
      }
    } = this.context
    const transaction = this.context.sequelizeTransaction
    const fileCheckResponse = validateFile(null, image)

    try {
      if (fileCheckResponse === OK) {
        if (image && typeof (image) === 'object') {
          const fileName = `${process.env.NODE_ENV}/admin_logo_image_${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${image.mimetype.split('/')[1]}`
          const s3Object = await uploadFile(image, fileName)
          await updateEntity({
            model: db.GlobalSetting,
            values: { key: 'LOGO_URL' },
            data: {
              value: s3Object.Location
            }
          })
        }
      }

      await db.GlobalSetting.bulkCreate([
        { key: 'ORIGIN', value: origin },
        { key: 'SUPPORT_EMAIL_ADDRESS', value: supportEmail },
        { key: 'SITE_NAME', value: siteName },
        { key: 'MINIMUM_REDEEMABLE_COINS', value: minRedeemableCoins },
        { key: 'MAXIMUM_REDEEMABLE_COINS', value: maxRedeemableCoins }
      ], {
        fields: ['key', 'value'],
        updateOnDuplicate: ['value']
      },
      transaction)

      const updateConfig = await db.GlobalSetting.findAll({
        attributes: ['value', 'key'],
        raw: true,
        where: {
          key: ['SUPPORT_EMAIL_ADDRESS', 'SITE_NAME', 'ORIGIN', 'LOGO_URL', 'MINIMUM_REDEEMABLE_COINS', 'MAXIMUM_REDEEMABLE_COINS']
        }
      })
      return { updateConfig, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
