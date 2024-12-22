import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { getOne } from '../../utils/crud'
import RedisClient from '../../libs/redisClient'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] },
    userId: { type: 'number' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class forceLogoutService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, userId, reason, favorite } = this.args
    try {
      const User = await getOne({ model: db.User, data: { userId } })
      if (!User) return this.addError('UserNotExistsErrorType')

      const storedToken = await RedisClient.client.get(`user:${User.uniqueId}`)
      if (storedToken) {
        await RedisClient.client.del(`user:${User.uniqueId}`)
        await activityLog({ user, userId, fieldChanged: 'Forcefully logout', remark: reason, favorite })
      } else {
        this.addError('UserAllReadyLogoutType')
      }
      return { success: true, userId, message: SUCCESS_MSG.USER_lOGOUT }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
