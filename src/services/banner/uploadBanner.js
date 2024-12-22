import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import { updateEntity, createNewEntity } from '../../utils/crud'
import { uploadFile } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    visibility: { type: 'string', enum: ['0', '1', '2'] }, // 0 - Before Login, 1 - After Login, 2 - Both
    btnText: { type: ['string', 'null'] },
    textOne: { type: ['string', 'null'] },
    textTwo: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    name: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    btnRedirection: { type: ['string', 'null'], enum: ['registration', 'search', 'purchase', 'kyc', 'null', 'store', 'reward', 'promotionsPage', 'sweeperCasinoScratchers', ''] },
    pageName: { type: ['string', 'null'], enum: ['lobbyPage', 'promotionPage', 'rewardPage', 'sweeperCasinoScratchersPage', 'storePage', '', 'lobbySlider'] }
  },
  required: ['visibility', 'isActive']
}

const constraints = ajv.compile(schema)

const s3Config = config.getProperties().s3
export class UploadBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { isActive, visibility, btnText, btnRedirection, textOne, textTwo, textThree, pageName, name } = this.args
    const desktopImage = this.context.req.files.desktopImage[0]
    const mobileImage = this.context.req.files.mobileImage[0]
    const transaction = this.context.sequelizeTransaction

    try {
      let lastOrderId = await db.PageBanner.max('order')
      if (!lastOrderId) lastOrderId = 0

      const createBanner = await createNewEntity({
        model: db.PageBanner,
        data: {
          visibility,
          btnText,
          btnRedirection,
          pageName,
          name,
          textOne,
          textTwo,
          textThree,
          isActive,
          order: lastOrderId + 1
        },
        transaction
      })

      const desktopFileName = `${config.get('env')}/assets/desktop/${LOGICAL_ENTITY.BANNER}/${createBanner.pageBannerId}-${Date.now()}.${desktopImage.mimetype.split('/')[1]}`
      await uploadFile(desktopImage, desktopFileName)

      const mobileFileName = `${config.get('env')}/assets/mobile/${LOGICAL_ENTITY.BANNER}/${createBanner.pageBannerId}-${Date.now()}.${mobileImage.mimetype.split('/')[1]}`
      await uploadFile(mobileImage, mobileFileName)

      await updateEntity({
        model: db.PageBanner,
        values: { pageBannerId: createBanner.pageBannerId },
        data: { desktopImageUrl: desktopFileName, mobileImageUrl: mobileFileName },
        transaction
      })

      createBanner.desktopImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${desktopFileName}`
      createBanner.mobileImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${mobileFileName}`

      return { createBanner, message: SUCCESS_MSG.CREATE_SUCCESS, success: true }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
