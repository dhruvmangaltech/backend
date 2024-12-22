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
    pageBannerId: { type: 'string', pattern: '^[0-9]+$' },
    btnText: { type: ['string', 'null'] },
    btnRedirection: { type: ['string', 'null'], enum: ['registration', 'search', 'purchase', 'kyc', 'null', 'store', 'reward', 'promotionsPage', 'sweeperCasinoScratchers', ''] },
    textOne: { type: ['string', 'null'] },
    textTwo: { type: ['string', 'null'] },
    name: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    pageName: { type: ['string', 'null'], enum: ['lobbyPage', 'promotionPage', 'rewardPage', 'sweeperCasinoScratchersPage', 'storePage', '', 'lobbySlider'] }
  },
  required: ['pageBannerId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdateBannerPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageBannerId, isActive, btnText, btnRedirection, textOne, textTwo, textThree, pageName, name } = this.args
    const desktopImage = this.context.req.files?.desktopImage
    const mobileImage = this.context.req.files?.mobileImage
    let updateObj
    const transaction = this.context.sequelizeTransaction
    try {
      const isBannerExist = await db.PageBanner.findOne({
        where: { pageBannerId },
        attributes: ['pageBannerId']
      })
      if (!isBannerExist) return this.addError('BannerNotFoundErrorType')

      updateObj = { isActive, btnText, btnRedirection, textOne, textTwo, textThree, pageName, name }

      if (desktopImage && typeof (desktopImage) === 'object') {
        const fileName = `${config.get('env')}/assets/desktop/${LOGICAL_ENTITY.BANNER}/${pageBannerId}-${Date.now()}.${desktopImage[0].mimetype.split('/')[1]}`

        await uploadFile(desktopImage[0], fileName)
        updateObj = { ...updateObj, desktopImageUrl: fileName }
      }

      if (mobileImage && typeof (mobileImage) === 'object') {
        const fileName = `${config.get('env')}/assets/mobile/${LOGICAL_ENTITY.BANNER}/${pageBannerId}-${Date.now()}.${mobileImage[0].mimetype.split('/')[1]}`

        await uploadFile(mobileImage[0], fileName)
        updateObj = { ...updateObj, mobileImageUrl: fileName }
      }

      const updateBanner = await updateEntity({ model: db.PageBanner, values: { pageBannerId }, data: { ...updateObj }, transaction })

      return { updateBanner, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
