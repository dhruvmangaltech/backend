import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ROLE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    kycLevel: { type: 'string' }
  },
  required: ['userId', 'kycLevel']
}

const constraints = ajv.compile(schema)

export class UpdateUserKyc extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, userId, kycLevel } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const userExist = await getOne({ model: db.User, data: { userId }, attributes: ['userId', 'uniqueId', 'kycStatus'] })
      if (!userExist) return this.addError('UserNotExistsErrorType')
      await updateEntity({
        model: db.User,
        data: { kycStatus: kycLevel },
        values: { uniqueId: userExist.uniqueId, userId: userExist.userId },
        transaction
      })

      await createNewEntity({
        model: db.ActivityLog,
        data: {
          actioneeId: user?.userId || user?.adminUserId,
          actioneeType: (user?.userId) ? ROLE.USER : ROLE.ADMIN,
          fieldChanged: 'kycStatus',
          originalValue: userExist.kycStatus,
          changedValue: kycLevel,
          userId,
          moreDetails: { favorite: false }
        },
        transaction
      })
      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
