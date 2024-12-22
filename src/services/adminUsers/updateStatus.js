import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'
import { ROLE, TOGGLE_CASE } from '../../utils/constants/constant'
const schema = {
  type: 'object',
  properties: {
    adminId: { type: 'number' },
    cmsPageId: { type: 'number' },
    masterCasinoProviderId: { type: 'number' },
    code: {
      type: 'string'
    },
    status: {
      type: 'boolean'
    },
    userType: { type: 'string' },
    masterGameSubCategoryId: { type: 'number' },
    masterGameCategoryId: { type: 'number' },
    masterCasinoGameId: { type: 'number' },
    bonusId: { type: 'number' },
    userId: { type: 'number' },
    pageBannerId: { type: 'number' }
  },
  required: ['code', 'status', 'userType']
}

const constraints = ajv.compile(schema)

export class UpdateStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async checkExist ({ model, data, include = undefined }) {
    const checkExist = await getOne({ model, data, include })
    if (!checkExist) return false
    return true
  }

  async run () {
    const {
      userType,
      code,
      status,
      cmsPageId,
      masterCasinoProviderId,
      adminId,
      masterGameSubCategoryId,
      masterGameCategoryId,
      masterCasinoGameId,
      bonusId,
      userId,
      pageBannerId
    } = this.args

    let model, values, updatedValue
    let data = { isActive: status }

    try {
      switch (code) {
        case TOGGLE_CASE.ADMIN : {
          if (userType !== ROLE.ADMIN) return this.addError('ActionNotAllowedErrorType')
          if (!adminId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.AdminUser, data: { adminUserId: adminId } })) {
            return this.addError('AdminNotFoundErrorType')
          }
          if (adminId === 1) return this.addError('ActionNotAllowedErrorType')

          model = db.AdminUser
          values = { adminUserId: adminId }
          break
        }
        case TOGGLE_CASE.CMS: {
          if (!cmsPageId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.CmsPage, data: { cmsPageId } })) {
            return this.addError('CmsNotFoundErrorType')
          }
          model = db.CmsPage
          values = { cmsPageId }
          break
        }
        case TOGGLE_CASE.CASINO_PROVIDER: {
          if (!masterCasinoProviderId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterCasinoProvider, data: { masterCasinoProviderId } })) {
            return this.addError('CasinoProviderNotFoundErrorType')
          }
          model = db.MasterCasinoProvider
          values = { masterCasinoProviderId }
          break
        }
        case TOGGLE_CASE.CASINO_SUB_CATEGORY: {
          if (!masterGameSubCategoryId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterGameSubCategory, data: { masterGameSubCategoryId } })) {
            return this.addError('GameSubCategoryNotExistsErrorType')
          }
          model = db.MasterGameSubCategory
          values = { masterGameSubCategoryId }
          break
        }
        case TOGGLE_CASE.CASINO_CATEGORY: {
          if (!masterGameCategoryId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterGameCategory, data: { masterGameCategoryId } })) {
            return this.addError('GameCategoryNotExistsErrorType')
          }
          model = db.MasterGameCategory
          values = { masterGameCategoryId }
          break
        }
        case TOGGLE_CASE.CATEGORY_GAME: {
          if (!masterCasinoGameId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterCasinoGame, data: { masterCasinoGameId } })) {
            return this.addError('CasinoGameNotExistsErrorType')
          }
          model = db.MasterCasinoGame
          values = { masterCasinoGameId }
          break
        }
        case TOGGLE_CASE.BONUS: {
          if (!bonusId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.Bonus, data: { bonusId } })) {
            return this.addError('BonusNotExistErrorType')
          }
          model = db.Bonus
          values = { bonusId }
          break
        }
        case TOGGLE_CASE.USER: {
          if (!userId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.User, data: { userId } })) {
            return this.addError('UserNotExistErrorType')
          }
          model = db.User
          values = { userId }
          break
        }
        case TOGGLE_CASE.USER_EMAIL: {
          if (!userId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.User, data: { userId } })) {
            return this.addError('UserNotExistErrorType')
          }
          model = db.User
          values = { userId }
          data = { isEmailVerified: status }
          break
        }
        case TOGGLE_CASE.BANNER: {
          if (!pageBannerId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.PageBanner, data: { pageBannerId } })) {
            return this.addError('UserNotExistErrorType')
          }
          model = db.PageBanner
          values = { pageBannerId }
          break
        }
        default: {
          return this.addError('ToggleCaseInvalidErrorType')
        }
      }

      if (code === TOGGLE_CASE.BONUS) {
        const checkExist = await getOne({ model, data: { bonusId } })
        if (checkExist.bonusType === 'daily bonus' || checkExist.bonusType === 'monthly bonus') {
          values = { bonusType: checkExist.bonusType }
          updatedValue = await updateEntity({ model, values, data })
        } else {
          updatedValue = await updateEntity({ model, values, data })
        }
      } else {
        updatedValue = await updateEntity({ model, values, data })
      }
      return { success: Boolean(updatedValue), message: SUCCESS_MSG.STATUS_UPDATED }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
