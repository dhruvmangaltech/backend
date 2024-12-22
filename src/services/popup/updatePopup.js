import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import { uploadFile } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity } from '../../utils/crud'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    popupId: { type: 'string', pattern: '^[0-9]+$' },
    btnText: { type: ['string', 'null'] },
    btnRedirection: { type: ['string', 'null'], enum: ['registration', 'search', 'purchase', 'kyc', 'null', 'store', 'reward', 'promotionsPage', 'sweeperCasinoScratchers', ''] },
    textOne: { type: ['string', 'null'] },
    textTwo: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    popName: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    popupName: { type: ['string', 'null'], enum: ['lobbyPage', 'promotionPage', 'rewardPage', 'sweeperCasinoScratchersPage', 'storePage', ''] }
  },
  required: ['popupId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdatePopupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { popupId, isActive, btnText, btnRedirection, textOne, textTwo, textThree, popupName, popName } = this.args
    const desktopImage = this.context.req.files?.desktopImage
    const mobileImage = this.context.req.files?.mobileImage
    let updateObj
    const transaction = this.context.sequelizeTransaction
    try {
      const isPopupExist = await db.Popup.findOne({
        where: { popupId },
        attributes: ['popupId']
      })
      if (!isPopupExist) return this.addError('PopupNotFoundErrorType')

      updateObj = { isActive, btnText, btnRedirection, textOne, textTwo, textThree, popupName, popName }

      if (desktopImage && typeof (desktopImage) === 'object') {
        const fileName = `${config.get('env')}/assets/desktop/${LOGICAL_ENTITY.POPUP}/${popupId}-${Date.now()}.${desktopImage[0].mimetype.split('/')[1]}`

        await uploadFile(desktopImage[0], fileName)
        updateObj = { ...updateObj, desktopImageUrl: fileName }
      }

      if (mobileImage && typeof (mobileImage) === 'object') {
        const fileName = `${config.get('env')}/assets/mobile/${LOGICAL_ENTITY.POPUP}/${popupId}-${Date.now()}.${mobileImage[0].mimetype.split('/')[1]}`

        await uploadFile(mobileImage[0], fileName)
        updateObj = { ...updateObj, mobileImageUrl: fileName }
      }

      const updatePopup = await updateEntity({ model: db.Popup, values: { popupId }, data: { ...updateObj }, transaction })

      return { updatePopup, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
