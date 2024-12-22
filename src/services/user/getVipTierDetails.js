import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getAll } from '../../utils/crud'

export class GetVipTierDetails extends ServiceBase {
  async run () {
    try {
      const vipTierDetail = await getAll({
        model: db.VipTier,
        data: { isActive: true },
        attributes: ['vipTierId', 'name', 'level'],
        order: [['level', 'ASC']]
      })

      if (!vipTierDetail) {
        return this.addError('VipTierDetailsNotFoundErrorType')
      }

      return { vipTierDetail, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
