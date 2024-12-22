import db from '../../db/models'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetPackageTypeService extends ServiceBase {
  async run () {
    try {
      const packageTypes = JSON.parse((await getOne({ model: db.GlobalSetting, data: { key: 'PACKAGE_TYPES' } })).value)

      return { packageTypes, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
