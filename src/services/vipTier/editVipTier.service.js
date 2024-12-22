import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, updateEntity } from '../../utils/crud'
import { uploadFile, getKey, validateFile } from '../../utils/common'
import { OK, LOGICAL_ENTITY } from '../../utils/constants/constant'
import config from '../../configs/app.config'

const schema = {
  type: 'object',
  properties: {
    vipTierId: { type: 'string' },
    name: { type: 'string' },
    boost: { type: 'string' },
    rakeback: { type: 'string' },
    bonusSc: { type: 'string' },
    bonusGc: { type: 'string' },
    level: { type: 'string' },
    scRequiredPlay: { type: 'string' },
    scRequiredMonth: { type: 'string' },
    gcRequiredPurchase: { type: 'string' },
    gcRequiredMonth: { type: 'string' },
    icon: { type: ['object', 'null'] },
    gradualLoss: { type: 'string' },
    liveSupport: { type: 'string' }
    // isActive: {
    //   type: 'string',
    //   enum: ['true', 'false']
    // }
  }
  // required: [
  //   'vipTierId',
  //   'name',
  //   'boost',
  //   'rakeback',
  //   'bonusSc',
  //   'bonusGc',
  //   'scRequiredPlay',
  //   'scRequiredMonth',
  //   'gcRequiredPurchase',
  //   'gcRequiredMonth',
  //   'gradualLoss',
  //   'liveSupport'
  // ]
}

const constraints = ajv.compile(schema)

export class EditVipTierService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req: { file: image },
      dbModels: { VipTier: VipTierModel },
      sequelizeTransaction
    } = this.context

    const { vipTierId } = this.args

    const checkVipTierExists = await getOne({
      model: VipTierModel,
      data: { vipTierId: vipTierId }
    })

    if (!checkVipTierExists) return this.addError('VipTierNotFoundErrorType')

    if (image) {
      try {
        let key
        const isImageValidated = validateFile(null, image)
        if (!(isImageValidated === OK)) return this.addError(isImageValidated)

        const fileName = `${config.get('env')}/assets/${
          LOGICAL_ENTITY.PROVIDER
        }/${checkVipTierExists.level}-${Date.now()}.${
          image.mimetype.split('/')[1]
        }`

        if (checkVipTierExists.icon) key = getKey(checkVipTierExists.icon)

        await uploadFile(image, fileName, key)
        this.args.icon = fileName
      } catch (error) {
        return this.addError('UploadErrorErrorType')
      }
    }

    await updateEntity({
      model: VipTierModel,
      values: { vipTierId },
      data: this.args,
      sequelizeTransaction
    })

    return { vipTierId: vipTierId, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
