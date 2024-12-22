import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'
import { Op } from 'sequelize'
// import moment from 'moment'
import { uploadFilesBonus } from '../../utils/uploadFilesBonus'
import { BONUS_TYPE, LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    bonusName: { type: 'string' },
    bonusType: { enum: Object.values(BONUS_TYPE) },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    isActive: { type: 'string' },
    gcAmount: { type: 'string' },
    scAmount: { type: 'string' },
    fsAmount: { type: 'string' },
    minimumPurchase: { type: 'string' },
    percentage: { type: 'string' },
    description: { type: 'string' },
    providerId: { type: 'string' }
  },
  required: ['bonusId']
}

const constraints = ajv.compile(schema)

export class EditBonus extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      bonusId,
      bonusName,
      bonusType,
      startDate,
      endDate,
      gcAmount = 0,
      scAmount = 0,
      fsAmount = 0,
      description,
      numberOfUser,
      isActive,
      minimumPurchase,
      percentage,
      providerId
    } = this.args
    const {
      req: { files }
    } = this.context
    const { Bonus: BonusModel } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    const bonusNameId = []

    const isBonusExist = await getOne({
      model: BonusModel,
      data: { bonusId: bonusId },
      transaction
    })
    const bonusObj = {}
    if (!isBonusExist) return this.addError('BonusNotExistErrorType')

    // if (!moment(endDate).isValid() || (moment(endDate).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD'))) return this.addError('TodayDateErrorType')
    if (!(gcAmount >= 0) || !(scAmount >= 0) || !(fsAmount >= 0)) { return this.addError('AmountErrorType') }
    // if (moment(startDate).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')) {
    //   return this.addError('TodayDateErrorType')
    // }
    if (numberOfUser && !(numberOfUser >= 0)) { return this.addError('InvalidNumberOfUserErrorType') }

    if (bonusName) {
      const isNameExist = await getOne({
        model: BonusModel,
        data: { bonusName: { [Op.iLike]: bonusName } }
      })
      if (isNameExist && isNameExist.bonusId === bonusId) { return this.addError('BonusNameExistErrorType') }
      bonusObj.bonusName = bonusName
    }
    if (+gcAmount < 0 && +scAmount < 0) {
      return this.addError('BonusValidationFailErrorType')
    }
    if (bonusType) {
      bonusObj.bonusType = bonusType
    }
    if (startDate) {
      bonusObj.validFrom = startDate
    }
    if (endDate) {
      bonusObj.validTo = endDate
    }
    if (gcAmount !== '') {
      bonusObj.gcAmount = Math.floor(gcAmount * 100) / 100
    }
    if (scAmount !== '') {
      bonusObj.scAmount = Math.floor(scAmount * 100) / 100
    }
    if (fsAmount !== '') {
      bonusObj.fsAmount = Math.floor(fsAmount * 100) / 100
    }
    if (description) {
      bonusObj.description = description
    }
    if (minimumPurchase !== '') {
      bonusObj.minimumPurchase = minimumPurchase
    }
    if (percentage !== '') {
      bonusObj.percentage = percentage
    }
    if (providerId !== '') {
      bonusObj.providerId = providerId
    }
    bonusObj.isActive = isActive
    if (BONUS_TYPE.DAILY_BONUS === bonusType && (isActive || startDate)) {
      await updateEntity({
        model: BonusModel,
        values: { bonusType: BONUS_TYPE.DAILY_BONUS },
        data: { isActive, validFrom: startDate },
        transaction
      })
    }
    await updateEntity({
      model: BonusModel,
      values: { bonusId: bonusId },
      data: { ...bonusObj },
      transaction
    })
    if (files && typeof files === 'object') {
      bonusNameId[isBonusExist?.day] = {
        bonusId: bonusId,
        name: isBonusExist?.bonusName,
        day: isBonusExist?.day
      }
      const uploadFilesArray = await uploadFilesBonus(
        files,
        bonusNameId,
        LOGICAL_ENTITY.BONUS
      )
      const dayExclude = []
      for (const files of uploadFilesArray) {
        if (files?.entity?.day === 7) {
          const keyFile = {}
          keyFile[`${files?.documentName ?? files.entity.day}`] =
            files.documentKey
          dayExclude.push(keyFile)
        } else {
          const keyFile = {}
          keyFile[`${files?.documentName ?? files?.entity?.day}`] =
            files.documentKey
          await updateEntity({
            model: BonusModel,
            values: { bonusId: bonusId },
            data: { imageUrl: [keyFile] },
            transaction
          })
        }
      }
      for (const files of uploadFilesArray) {
        if (files?.entity?.day === 7) {
          await updateEntity({
            model: BonusModel,
            values: { bonusId: files.entity.bonusId },
            data: { imageUrl: dayExclude },
            transaction
          })
          break
        }
      }
    }
    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
