import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, updateEntity } from '../../utils/crud'

export class UpdateUsersVipTierService extends ServiceBase {
  async run () {
    const { vipTierId, userId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const vipTierDetail = await db.VipTier.findOne({
        attributes: ['name', 'vipTierId', 'level'],
        where: {
          vipTierId: vipTierId,
          isActive: true
        },
        raw: true
      })

      if (!vipTierDetail) {
        return this.addError('VipTierNotFoundErrorType')
      }
      await updateEntity({
        model: db.UserVipTier,
        values: { userId: userId, active: true },
        data: { active: false },
        transaction
      })
      await createNewEntity({
        model: db.UserVipTier,
        data: {
          userId: userId,
          vipTierId: vipTierId,
          level: vipTierDetail.level,
          active: true
        },
        transaction
      })

      return {
        userVipTierName: vipTierDetail.name,
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
