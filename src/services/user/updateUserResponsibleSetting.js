import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import {
  RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE
} from '../../utils/constants/constant'
import db from '../../db/models'
import { activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    responsibleGamblingType: { type: 'string' },
    limitType: { type: 'string' },
    timeBreakDuration: { type: 'string' },
    selfExclusion: { type: 'boolean' },
    amount: { type: 'number' },
    sessionReminderTime: { type: 'number' },
    userId: { type: 'number' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['responsibleGamblingType', 'userId', 'user']
}

const constraints = ajv.compile(schema)

export class UpdateUserResponsibleSetting extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      sessionReminderTime, timeBreakDuration: time, selfExclusion, amount, responsibleGamblingType, userId, limitType, reason, favorite, user
    } = this.args

    if (amount <= 0) { return this.addError('InvalidAmountErrorType') }
    const currentDate = new Date()
    const timeBreakDuration = new Date(time)

    // Set the time of timeBreakDate to match the current time
    timeBreakDuration.setHours(currentDate.getHours())
    timeBreakDuration.setMinutes(currentDate.getMinutes())
    timeBreakDuration.setSeconds(currentDate.getSeconds())

    const { ResponsibleGambling: ResponsibleGamblingModel } = db
    let field, changedValue, limitTypeTime
    let originalValue = ''

    try {
      const whereConditions = {
        responsibleGamblingType,
        userId,
        status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
      }
      if (limitType) whereConditions.limitType = limitType

      const existingSetting = await ResponsibleGamblingModel.findOne({ where: whereConditions })

      if (limitType) {
        if (limitType === '1') limitTypeTime = 'daily'
        else if (limitType === '2') limitTypeTime = 'weekly'
        else if (limitType === '3') limitTypeTime = 'monthly'
      }

      if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME) field = `${limitTypeTime} time changed`
      else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE) field = `${limitTypeTime} purchase amount limit`

      let createOrUpdateSettings = {}
      if (existingSetting) {
        const updateData = {}
        if (
          existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME ||
        existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE
        ) {
          if (!amount) { return this.addError('InvalidAmountErrorType') } else {
            // Find existing active settings for the same responsibleGamblingType
            const existingSettings = await ResponsibleGamblingModel.findAll({
              where: {
                userId,
                responsibleGamblingType,
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
              }
            })

            if (limitType === '1') { // Daily Limit
              const weeklyLimit = existingSettings.find(setting => setting.limitType === '2')
              const monthlyLimit = existingSettings.find(setting => setting.limitType === '3')

              if (weeklyLimit && amount > weeklyLimit.amount) {
                return this.addError('DailyLimitExceedsWeeklyLimitType')
              }

              if (monthlyLimit && amount > monthlyLimit.amount) {
                return this.addError('DailyLimitExceedsMonthlyLimitType')
              }
            }

            if (limitType === '2') { // Weekly Limit
              const dailyLimit = existingSettings.find(setting => setting.limitType === '1')

              if (dailyLimit && amount < dailyLimit.amount) {
                return this.addError('WeeklyLimitLessThanDailyLimitType')
              }

              const monthlyLimit = existingSettings.find(setting => setting.limitType === '3')
              if (monthlyLimit && amount > monthlyLimit.amount) {
                return this.addError('WeeklyLimitExceedsMonthlyLimitType')
              }
            }

            if (limitType === '3') { // Monthly Limit
              const dailyLimit = existingSettings.find(setting => setting.limitType === '1')

              if (dailyLimit && amount < dailyLimit.amount) {
                return this.addError('MonthlyLimitLessThanDailyLimitType')
              }

              const weeklyLimit = existingSettings.find(setting => setting.limitType === '2')
              if (weeklyLimit && amount < weeklyLimit.amount) {
                return this.addError('MonthlyLimitLessThanWeeklyLimitType')
              }
            }
          }
          originalValue = existingSetting.amount
          changedValue = amount
          updateData.amount = amount

          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            sessionReminderTime: null,
            limitType,
            timeBreakDuration: null,
            selfExclusion: null,
            amount
          }
        } else if (existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
          if ((selfExclusion == null || selfExclusion === '')) { return this.addError('SelfExclusionRequireType') }

          field = 'Self Exclusion'
          originalValue = existingSetting.selfExclusion
          changedValue = selfExclusion
          updateData.selfExclusion = selfExclusion
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            sessionReminderTime: null,
            limitType: null,
            timeBreakDuration: null,
            selfExclusion,
            amount: null
          }

          // else if (existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SESSION) {
          //   if (!sessionReminderTime) { this.addError('SessionReminderTimeRequireType') }

        //   field = 'Session time'
        //   originalValue = existingSetting.sessionReminderTime
        //   changedValue = sessionReminderTime
        //   updateData.sessionReminderTime = sessionReminderTime
        //   createOrUpdateSettings = {
        //     userId,
        //     responsibleGamblingType,
        //     sessionReminderTime,
        //     limitType: null,
        //     timeBreakDuration: null,
        //     selfExclusion: null,
        //     amount: null
        //   }
        // }
        } else if (existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK) {
          if (!timeBreakDuration) { return this.addError('TimeBreakDurationRequireType') }

          field = 'Take a break'
          originalValue = existingSetting.timeBreakDuration
          changedValue = timeBreakDuration
          updateData.timeBreakDuration = timeBreakDuration
          updateData.amount = amount
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            sessionReminderTime: null,
            limitType: null,
            timeBreakDuration,
            selfExclusion: null,
            amount
          }
        }

        // await existingSetting.update(updateData)
        await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE })

        await ResponsibleGamblingModel.create({
          ...createOrUpdateSettings,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        })
      } else {
        const commonSettingCheck = {
          userId,
          responsibleGamblingType,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }
        if (
          responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME ||
          responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE
        ) {
          if (!limitType || !amount) { return this.addError('InvalidAmountErrorType') }
          commonSettingCheck.limitType = limitType
          changedValue = amount

          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            sessionReminderTime: null,
            limitType,
            timeBreakDuration: null,
            selfExclusion: null,
            amount
          }
        } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
          if ((selfExclusion == null || selfExclusion === '')) { return this.addError('SelfExclusionRequireType') }

          field = 'Self Exclusion'
          changedValue = selfExclusion
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            sessionReminderTime: null,
            limitType: null,
            timeBreakDuration: null,
            selfExclusion,
            amount: null
          }
        } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SESSION) {
          if (!sessionReminderTime) { return this.addError('SessionReminderTimeRequireType') }

          field = 'Session Limit'
          changedValue = sessionReminderTime
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            sessionReminderTime,
            limitType: null,
            timeBreakDuration: null,
            selfExclusion: null,
            amount: null
          }
        } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK) {
          if (!timeBreakDuration) { return this.addError('TimeBreakDurationRequireType') }

          field = 'Take a break'
          changedValue = timeBreakDuration + ''
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            sessionReminderTime: null,
            limitType: null,
            timeBreakDuration,
            selfExclusion: null,
            amount
          }
        }

        await ResponsibleGamblingModel.create({
          ...createOrUpdateSettings,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        })

        await activityLog({ user, userId, fieldChanged: field, originalValue, changedValue, favorite, remark: reason })
      }

      return { message: SUCCESS_MSG.SELF_EXCLUSION_DONE }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
