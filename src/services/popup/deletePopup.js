import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    popupId: { type: 'number' }
  },
  required: ['popupId']
}

const constraints = ajv.compile(schema)

export class DeletePopupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { popupId } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const isPopupExist = await db.Popup.findOne({
        where: { popupId },
        attributes: ['popupId']
      })
      if (!isPopupExist) return this.addError('PopupNotFoundErrorType')

      await deleteEntity({
        model: db.Popup,
        values: { popupId },
        transaction
      })

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
