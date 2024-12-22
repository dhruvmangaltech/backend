import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { updateEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    wheelDivisionId: { type: 'string' },
    sc: { type: 'number' },
    gc: { type: 'number' },
    isAllow: { type: 'boolean' },
    playerLimit: { type: ['number', 'null'] },
    priority: { type: 'number' }
  },
  required: ['wheelDivisionId']
}

const constraints = ajv.compile(schema)

export class UpdateSpinWheelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { WheelDivisionConfiguration: WheelDivisionConfigurationModel },
      sequelizeTransaction
    } = this.context

    let { wheelDivisionId, sc, gc, priority, isAllow, playerLimit } = this.args

    const checkWheelConfigExists = await getOne({
      model: WheelDivisionConfigurationModel,
      data: { wheelDivisionId: wheelDivisionId }
    })

    if (!checkWheelConfigExists) return this.addError('NotFoundErrorType')

    if (Number(wheelDivisionId) === 1) {
      await updateEntity({
        model: WheelDivisionConfigurationModel,
        values: { wheelDivisionId },
        data: { sc, gc, priority },
        sequelizeTransaction
      })
    } else {
      if (playerLimit === '') {
        playerLimit = null
      }
      await updateEntity({
        model: WheelDivisionConfigurationModel,
        values: { wheelDivisionId },
        data: { wheelDivisionId, sc, gc, isAllow, playerLimit, priority },
        sequelizeTransaction
      })
    }

    return { wheelDivisionId: wheelDivisionId, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
