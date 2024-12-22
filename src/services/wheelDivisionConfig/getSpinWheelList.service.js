import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetSpinWheelListService extends ServiceBase {
  async run () {
    const wheelConfiguration = await db.WheelDivisionConfiguration.findAll({ order: [['wheelDivisionId', 'ASC']] })
    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS, wheelConfiguration }
  }

  catch (error) {
    this.addError('InternalServerErrorType', error)
  }
}
