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
    popName: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    btnRedirection: { type: ['string', 'null'], enum: ['registration', 'search', 'purchase', 'kyc', 'null', 'store', 'reward', 'promotionsPage', 'sweeperCasinoScratchers', ''] },
    popupName: { type: ['string', 'null'], enum: ['lobbyPage', 'promotionPage', 'rewardPage', 'sweeperCasinoScratchersPage', 'storePage', ''] }
  },
  required: ['visibility', 'isActive']
}

const constraints = ajv.compile(schema)

const s3Config = config.getProperties().s3
export class UploadPopupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { isActive, visibility, btnText, btnRedirection, textOne, textTwo, textThree, popupName, popName } = this.args
    const desktopImage = this.context.req.files.desktopImage[0]
    const mobileImage = this.context.req.files.mobileImage[0]
    const transaction = this.context.sequelizeTransaction

    try {
      let lastOrderId = await db.Popup.max('order')
      if (!lastOrderId) lastOrderId = 0

      const createPopup = await createNewEntity({
        model: db.Popup,
        data: {
          visibility,
          btnText,
          btnRedirection,
          popupName,
          popName,
          textOne,
          textTwo,
          textThree,
          isActive,
          order: lastOrderId + 1
        },
        transaction
      })

      const desktopFileName = `${config.get('env')}/assets/desktop/${LOGICAL_ENTITY.POPUP}/${createPopup.popupId}-${Date.now()}.${desktopImage.mimetype.split('/')[1]}`
      await uploadFile(desktopImage, desktopFileName)

      const mobileFileName = `${config.get('env')}/assets/mobile/${LOGICAL_ENTITY.POPUP}/${createPopup.popupId}-${Date.now()}.${mobileImage.mimetype.split('/')[1]}`
      await uploadFile(mobileImage, mobileFileName)

      await updateEntity({
        model: db.Popup,
        values: { popupId: createPopup.popupId },
        data: { desktopImageUrl: desktopFileName, mobileImageUrl: mobileFileName },
        transaction
      })

      createPopup.desktopImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${desktopFileName}`
      createPopup.mobileImageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${mobileFileName}`

      return { createPopup, message: SUCCESS_MSG.CREATE_SUCCESS, success: true }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
