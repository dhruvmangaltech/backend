import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'

import { RESPONSIBLE_GAMBLING_STATUS } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limitType: {
      type: 'string'
    },
    responsibleGamblingType: {
      type: 'string'
    }
  }
}

const constraints = ajv.compile(schema)

export class RemoveResponsibleGaming extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req:
      {
        body: {
          limitType,
          responsibleGamblingType,
          userId
        }
      },
      dbModels: {
        ResponsibleGambling: ResponsibleGamblingModel
      },
      sequelizeTransaction: t
    } = this.context

    let response

    if (responsibleGamblingType === '4') {
      response = await getOne({
        model: ResponsibleGamblingModel,
        data: { responsibleGamblingType, userId: userId, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE, isRemoved: false }
      })
    } else {
      response = await getOne({
        model: ResponsibleGamblingModel,
        data: { responsibleGamblingType, limitType, userId: userId, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE, isRemoved: false }
      })
    }
    if (!response) {
      return this.addError('ResponsibleSettingNotFondType')
    }

    response.isRemoved = true
    response.status = RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE
    await response.save({ transaction: t })
    return { success: true, message: 'Record Removed Successfully' }
  }
}
