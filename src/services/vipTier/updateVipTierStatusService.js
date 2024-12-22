import ajv from '../../libs/ajv'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, updateEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    vipTierId: { type: 'integer' },
    isActive: { enum: [true, false] }
  },
  required: ['vipTierId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdateVipTierStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { VipTier: VipTierModel },
      sequelizeTransaction
    } = this.context

    const { vipTierId, isActive } = this.args

    if(!isActive) {
      return {success: false, message: 'You cannot deactivate a tier currently. Sorry!!!'}
    }

    if (vipTierId <= 0) {
      return this.addError('InvalidIdErrorType')
    }

    const checkVipTierExists = await getOne({
      model: VipTierModel,
      data: { vipTierId: vipTierId }
    })

    if (!checkVipTierExists) return this.addError('VipTierNotFoundErrorType')

    await updateEntity({
      model: VipTierModel,
      values: { vipTierId: vipTierId },
      data: { isActive: isActive },
      transaction: sequelizeTransaction
    })

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
