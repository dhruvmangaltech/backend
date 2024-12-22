import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    vipTierId: { type: 'integer' }
  },
  required: ['vipTierId']
}

const constraints = ajv.compile(schema)

export class DeleteVipTierService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { VipTier: VipTierModel },
      sequelizeTransaction
    } = this.context

    const { vipTierId } = this.args

    const checkVipTierExists = await getOne({
      model: VipTierModel,
      data: { vipTierId: vipTierId }
    })

    if (!checkVipTierExists) return this.addError('VipTierNotFoundErrorType')

    if(+checkVipTierExists.level === 0) return this.addError('CannotRemoveDefaultTierErrorType')

    await deleteEntity({
      model: VipTierModel,
      values: { vipTierId },
      sequelizeTransaction
    })

    return { message: SUCCESS_MSG.DELETE_SUCCESS }
  }
}
