import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { createNewEntity, getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { uploadFile, validateFile } from '../../utils/common'
import { LOGICAL_ENTITY, OK } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
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
    liveSupport: { type: 'string' },
    isActive: {
      type: 'string',
      enum: ['true', 'false']
    }
  },
  required: [
    'name',
    'boost',
    'rakeback',
    'level',
    'bonusSc',
    'bonusGc',
    'scRequiredPlay',
    'scRequiredMonth',
    'gcRequiredPurchase',
    'gcRequiredMonth'
  ]
}

const constraints = ajv.compile(schema)

export class AddNewVipTierService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req: {file: image},
      dbModels: { VipTier: VipTierModel },
      sequelizeTransaction
    } = this.context

    const { level } = this.args

    const checkVipTierExists = await getOne({
      model: VipTierModel,
      data: { level }
    })

    if (checkVipTierExists) return this.addError('VipTierAlreadyExistErrorType')

    const fileName = `${config.get('env')}/assets/${
      LOGICAL_ENTITY.PROVIDER
    }/${level}-${Date.now()}.${image.mimetype.split('/')[1]}`
    
    try {
      const isImageValidated = validateFile(null, image)
      if(!(isImageValidated === OK)){
        return this.addError(isImageValidated)
      }
      await uploadFile(image, fileName)
    } catch (error) {
      return this.addError('UploadErrorErrorType')
    }

    // updating icon field with image route
    this.args.icon = fileName

    const vipTier = await createNewEntity({
      model: VipTierModel,
      data: this.args,
      transaction: sequelizeTransaction
    })

    return {
      vipTierId: vipTier.vipTierId,
      message: SUCCESS_MSG.CREATE_SUCCESS
    }
  }
}
