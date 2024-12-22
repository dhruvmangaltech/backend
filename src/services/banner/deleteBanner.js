import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    pageBannerId: { type: 'number' }
  },
  required: ['pageBannerId']
}

const constraints = ajv.compile(schema)

export class DeleteBannerPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageBannerId } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const isBannerExist = await db.PageBanner.findOne({
        where: { pageBannerId },
        attributes: ['pageBannerId']
      })
      if (!isBannerExist) return this.addError('BannerNotFoundErrorType')

      await deleteEntity({
        model: db.PageBanner,
        values: { pageBannerId },
        transaction
      })

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
