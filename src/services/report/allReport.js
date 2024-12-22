import sequelize, { Op } from 'sequelize'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { BONUS_TYPE, DASHBOARD_REPORT, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_TYPE, WAGERING_TYPE } from '../../utils/constants/constant'
import { getAll } from '../../utils/crud'

export class DashBoardReport extends ServiceBase {
  async run () {
    try {
      let { startDate, endDate, playerType, reportType } = this.args

      const internalUsers = (await getAll({ model: db.User, data: { isInternalUser: true }, attributes: ['userId'] })).map(obj => { return obj.userId })

      if (!startDate || !endDate) {
        startDate = new Date() // Current date and time
        startDate.setUTCHours(0, 0, 0, 0) // Set hours to zero
        startDate.setUTCMonth(startDate.getUTCMonth() - 3) // Subtract three months

        endDate = new Date() // Current date and time
        endDate.setUTCHours(0, 0, 0, 0) // Set hours to zero
      }

      // Define date ranges
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

      // Start of yesterday (00:00:00.000)
      const yesterdayStart = new Date(today)
      yesterdayStart.setDate(today.getDate() - 1)
      yesterdayStart.setHours(0, 0, 0, 0)

      // End of yesterday (23:59:59.999)
      const yesterdayEnd = new Date(today)
      yesterdayEnd.setDate(today.getDate() - 1)
      yesterdayEnd.setHours(23, 59, 59, 999)

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      // Calculate the first day of the last month
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

      // Calculate the last day of the last month
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      endOfLastMonth.setHours(23, 59, 59, 999)

      // Calculate the metrics for each time period

      // login data
      if (reportType === DASHBOARD_REPORT.LOGIN_DATA) {
        const [
          uniqueLoginForToday,
          loginForToday,
          uniqueLoginForYesterday,
          loginForYesterday,
          uniqueLoginForMonthToDate,
          loginForMonthToDate,
          uniqueLoginLastMonth,
          loginLastMonth,
          uniqueLoginForCustom,
          loginForCustom
        ] = await Promise.all(
          [
            this.getLoginCount(today, todayEnd, true, internalUsers, playerType, true),
            this.getLoginCount(today, todayEnd, internalUsers, playerType, false),
            this.getLoginCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType, true),
            this.getLoginCount(yesterdayStart, yesterdayEnd, internalUsers, playerType, false),
            this.getLoginCount(startOfMonth, today, true, internalUsers, playerType, true),
            this.getLoginCount(startOfMonth, today, internalUsers, playerType, false),
            this.getLoginCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType, true),
            this.getLoginCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType, false),
            this.getLoginCount(startDate, endDate, true, internalUsers, playerType, true),
            this.getLoginCount(startDate, endDate, internalUsers, playerType, false)
          ]
        )
        return {
          UNIQ_LOGIN: {
            TODAY: uniqueLoginForToday,
            YESTERDAY: uniqueLoginForYesterday,
            MONTH_TO_DATE: uniqueLoginForMonthToDate,
            LAST_MONTH: uniqueLoginLastMonth,
            CUSTOM: uniqueLoginForCustom
          },
          TOTAL_LOGIN: {
            TODAY: loginForToday,
            YESTERDAY: loginForYesterday,
            MONTH_TO_DATE: loginForMonthToDate,
            LAST_MONTH: loginLastMonth,
            CUSTOM: loginForCustom
          }
        }
      }

      // customers data
      if (reportType === DASHBOARD_REPORT.CUSTOMER_DATA) {
        const [
          newRegistrationForCustom,
          phoneVerifiedForCustom,
          isFirstDepositForCustom,
          isFirstDepositAmountSumForCustom,
          totalPurchaseAmountSumForCustom,
          totalPurchaseAmountCountForCustom,
          approvalRedemptionAmountSumForCustom,
          requestRedemptionAmountSumForCustom,
          requestRedemptioncountForCustom,
          pendingRedemptioncountForCustom,
          newRegistrationForToday,
          phoneVerifiedForToday,
          isFirstDepositForToday,
          isFirstDepositAmountSumForToday,
          totalPurchaseAmountSumForToday,
          totalPurchaseAmountCountForToday,
          approvalRedemptionAmountSumForToday,
          requestRedemptionAmountSumForToday,
          requestRedemptioncountForToday,
          pendingRedemptioncountForToday,
          newRegistrationForYesterday,
          phoneVerifiedForYesterday,
          isFirstDepositForYesterday,
          isFirstDepositAmountSumForYesterday,
          totalPurchaseAmountSumForYesterday,
          totalPurchaseAmountCountForYesterday,
          approvalRedemptionAmountSumForYesterday,
          requestRedemptionAmountSumForYesterday,
          requestRedemptioncountForYesterday,
          pendingRedemptioncountForYesterday,
          newRegistrationForMonthToDate,
          phoneVerifiedForMonthToDate,
          isFirstDepositForMonthToDate,
          isFirstDepositAmountSumForMonthToDate,
          totalPurchaseAmountSumForMonthToDate,
          totalPurchaseAmountCountForMonthToDate,
          approvalRedemptionAmountSumForMonthToDate,
          requestRedemptionAmountSumForMonthToDate,
          requestRedemptioncountForMonthToDate,
          pendingRedemptioncountForMonthToDate,
          newRegistrationForLastMonth,
          phoneVerifiedForLastMonth,
          isFirstDepositForLastMonth,
          isFirstDepositAmountSumForLastMonth,
          totalPurchaseAmountSumForLastMonth,
          totalPurchaseAmountCountForLastMonth,
          approvalRedemptionAmountSumForLastMonth,
          requestRedemptionAmountSumForLastMonth,
          requestRedemptioncountForLastMonth,
          pendingRedemptioncountForLastMonth
        ] = await Promise.all([
          this.getCustomerDataCount(startDate, endDate, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(startDate, endDate, true, internalUsers, playerType),
          this.getIsFirstDepositCount(startDate, endDate, true, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startDate, endDate, true, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startDate, endDate, true, internalUsers, playerType),
          this.getTotalPurchaseCount(startDate, endDate, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startDate, endDate, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startDate, endDate, internalUsers, playerType),
          this.getRequestRedemptionCount(startDate, endDate, internalUsers, playerType),
          this.getPendingRedemptionCount(startDate, endDate, internalUsers, playerType),
          this.getCustomerDataCount(today, todayEnd, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(today, todayEnd, true, internalUsers, playerType),
          this.getIsFirstDepositCount(today, todayEnd, true, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(today, todayEnd, true, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(today, todayEnd, true, internalUsers, playerType),
          this.getTotalPurchaseCount(today, todayEnd, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(today, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(today, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionCount(today, todayEnd, internalUsers, playerType),
          this.getPendingRedemptionCount(today, todayEnd, internalUsers, playerType),
          this.getCustomerDataCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getIsFirstDepositCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getTotalPurchaseCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getRequestRedemptionCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getPendingRedemptionCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getCustomerDataCount(startOfMonth, today, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(startOfMonth, today, true, internalUsers, playerType),
          this.getIsFirstDepositCount(startOfMonth, today, true, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startOfMonth, today, true, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startOfMonth, today, true, internalUsers, playerType),
          this.getTotalPurchaseCount(startOfMonth, today, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startOfMonth, today, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startOfMonth, today, internalUsers, playerType),
          this.getRequestRedemptionCount(startOfMonth, today, internalUsers, playerType),
          this.getPendingRedemptionCount(startOfMonth, today, internalUsers, playerType),
          this.getCustomerDataCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getIsFirstDepositCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getTotalPurchaseCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getRequestRedemptionCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getPendingRedemptionCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType)
        ])
        return {
          NEW_REGISTRATION: {
            TODAY: newRegistrationForToday,
            YESTERDAY: newRegistrationForYesterday,
            MONTH_TO_DATE: newRegistrationForMonthToDate,
            LAST_MONTH: newRegistrationForLastMonth,
            CUSTOM: newRegistrationForCustom
          },
          PHONE_VERIFIED: {
            TODAY: phoneVerifiedForToday,
            YESTERDAY: phoneVerifiedForYesterday,
            MONTH_TO_DATE: phoneVerifiedForMonthToDate,
            LAST_MONTH: phoneVerifiedForLastMonth,
            CUSTOM: phoneVerifiedForCustom
          },
          FIRST_DEPOSIT: {
            TODAY: isFirstDepositForToday,
            YESTERDAY: isFirstDepositForYesterday,
            MONTH_TO_DATE: isFirstDepositForMonthToDate,
            LAST_MONTH: isFirstDepositForLastMonth,
            CUSTOM: isFirstDepositForCustom
          },
          FIRST_DEPOSIT_AMOUNT_SUM: {
            TODAY: isFirstDepositAmountSumForToday,
            YESTERDAY: isFirstDepositAmountSumForYesterday,
            MONTH_TO_DATE: isFirstDepositAmountSumForMonthToDate,
            LAST_MONTH: isFirstDepositAmountSumForLastMonth,
            CUSTOM: isFirstDepositAmountSumForCustom
          },
          PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForToday,
            YESTERDAY: totalPurchaseAmountSumForYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForMonthToDate,
            LAST_MONTH: totalPurchaseAmountSumForLastMonth,
            CUSTOM: totalPurchaseAmountSumForCustom
          },
          PURCHASE_AMOUNT_COUNT: {
            TODAY: totalPurchaseAmountCountForToday,
            YESTERDAY: totalPurchaseAmountCountForYesterday,
            MONTH_TO_DATE: totalPurchaseAmountCountForMonthToDate,
            LAST_MONTH: totalPurchaseAmountCountForLastMonth,
            CUSTOM: totalPurchaseAmountCountForCustom
          },
          APPROVAL_REDEMPTION_AMOUNT_SUM: {
            TODAY: approvalRedemptionAmountSumForToday,
            YESTERDAY: approvalRedemptionAmountSumForYesterday,
            MONTH_TO_DATE: approvalRedemptionAmountSumForMonthToDate,
            LAST_MONTH: approvalRedemptionAmountSumForLastMonth,
            CUSTOM: approvalRedemptionAmountSumForCustom
          },
          REQUEST_REDEMPTION_AMOUNT_SUM: {
            TODAY: requestRedemptionAmountSumForToday,
            YESTERDAY: requestRedemptionAmountSumForYesterday,
            MONTH_TO_DATE: requestRedemptionAmountSumForMonthToDate,
            LAST_MONTH: requestRedemptionAmountSumForLastMonth,
            CUSTOM: requestRedemptionAmountSumForCustom
          },
          REQUEST_REDEMPTION_COUNT_SUM: {
            TODAY: requestRedemptioncountForToday,
            YESTERDAY: requestRedemptioncountForYesterday,
            MONTH_TO_DATE: requestRedemptioncountForMonthToDate,
            LAST_MONTH: requestRedemptioncountForLastMonth,
            CUSTOM: requestRedemptioncountForCustom
          },
          PENDING_REDEMPTION_COUNT_SUM: {
            TODAY: pendingRedemptioncountForToday,
            YESTERDAY: pendingRedemptioncountForYesterday,
            MONTH_TO_DATE: pendingRedemptioncountForMonthToDate,
            LAST_MONTH: pendingRedemptioncountForLastMonth,
            CUSTOM: pendingRedemptioncountForCustom
          }
        }
      }
      // transaction data
      if (reportType === DASHBOARD_REPORT.TRANSACTION_DATA) {
        const [
          activeGcPlayersTodayCount,
          activeGcPlayersYesterdayCount,
          activeGcPlayersMonthToDateCount,
          activeGcPlayersLastMonthCount,
          activeGcPlayersCustomCount,
          activeScPlayersTodayCount,
          activeScPlayersYesterdayCount,
          activeScPlayersMonthToDateCount,
          activeScPlayersLastMonthCount,
          activeScPlayersCustomCount,
          scStakedTodayCount,
          scStakedYesterdayCount,
          scStakedMonthToDateCount,
          scStakedLastMonthCount,
          scStakedCustomCount,
          scWinTodayCount,
          scWinYesterdayCount,
          scWinMonthToDateCount,
          scWinLastMonthCount,
          scWinCustomCount,
          scNewActivePlayerTodayCount,
          scNewActivePlayerYesterdayCount,
          scNewActivePlayerMonthToDateCount,
          scNewActivePlayerLastMonthCount,
          scNewActivePlayerCustomCount
        ] =
       await Promise.all([
         this.getActivePlayersCount(0, today, todayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, yesterdayStart, yesterdayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, startOfMonth, today, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, startOfLastMonth, endOfLastMonth, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, startDate, endDate, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, today, todayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, yesterdayStart, yesterdayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, startOfMonth, today, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, startOfLastMonth, endOfLastMonth, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, startDate, endDate, 'bet', internalUsers, playerType),
         this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(yesterdayStart, yesterdayEnd, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(startOfMonth, today, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(startDate, endDate, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'win'),
         this.getScTransactionSum(yesterdayStart, yesterdayEnd, internalUsers, playerType, 'win'),
         this.getScTransactionSum(startOfMonth, today, internalUsers, playerType, 'win'),
         this.getScTransactionSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType, 'win'),
         this.getScTransactionSum(startDate, endDate, internalUsers, playerType, 'win'),
         this.getNewActiveScPlayersCount(today, todayEnd, internalUsers, playerType),
         this.getNewActiveScPlayersCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
         this.getNewActiveScPlayersCount(startOfMonth, today, internalUsers, playerType),
         this.getNewActiveScPlayersCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
         this.getNewActiveScPlayersCount(startDate, endDate, internalUsers, playerType)
       ])
        return {
          ACTIVE_GC_PLAYER: {
            TODAY: activeGcPlayersTodayCount,
            YESTERDAY: activeGcPlayersYesterdayCount,
            MONTH_TO_DATE: activeGcPlayersMonthToDateCount,
            LAST_MONTH: activeGcPlayersLastMonthCount,
            CUSTOM: activeGcPlayersCustomCount
          },
          ACTIVE_SC_PLAYER: {
            TODAY: activeScPlayersTodayCount,
            YESTERDAY: activeScPlayersYesterdayCount,
            MONTH_TO_DATE: activeScPlayersMonthToDateCount,
            LAST_MONTH: activeScPlayersLastMonthCount,
            CUSTOM: activeScPlayersCustomCount
          },
          SC_STAKED_TOTAL: {
            TODAY: scStakedTodayCount,
            YESTERDAY: scStakedYesterdayCount,
            MONTH_TO_DATE: scStakedMonthToDateCount,
            LAST_MONTH: scStakedLastMonthCount,
            CUSTOM: scStakedCustomCount
          },
          SC_WIN_TOTAL: {
            TODAY: scWinTodayCount,
            YESTERDAY: scWinYesterdayCount,
            MONTH_TO_DATE: scWinMonthToDateCount,
            LAST_MONTH: scWinLastMonthCount,
            CUSTOM: scWinCustomCount
          },
          SC_GGR_TOTAL: {
            TODAY: scStakedTodayCount - scWinTodayCount,
            YESTERDAY: scStakedYesterdayCount - scWinYesterdayCount,
            MONTH_TO_DATE: scStakedMonthToDateCount - scWinMonthToDateCount,
            LAST_MONTH: scStakedLastMonthCount - scWinLastMonthCount,
            CUSTOM: scStakedCustomCount - scWinCustomCount
          },
          SC_NEW_ACTIVE_PLAYER: {
            TODAY: scNewActivePlayerTodayCount,
            YESTERDAY: scNewActivePlayerYesterdayCount,
            MONTH_TO_DATE: scNewActivePlayerMonthToDateCount,
            LAST_MONTH: scNewActivePlayerLastMonthCount,
            CUSTOM: scNewActivePlayerCustomCount
          }
        }
      }
      // Coin Economy Data
      if (reportType === DASHBOARD_REPORT.ECONOMY_DATA) {
        const [gcCreditedPurchaseSumForCustom,
          scCreditedPurchaseSumForCustom,
          gcAwardedTotalSumForCustom,
          scAwardedTotalSumForCustom,
          getScTotalForCustom,
          getRscSumTotalForCustom,
          getUscSumForCustom,
          gcCreditedPurchaseSumForToday,
          scCreditedPurchaseSumForToday,
          gcAwardedTotalSumForToday,
          scAwardedTotalSumForToday,
          getScTotalForToday,
          getRscSumTotalForToday,
          getUscSumForToday,
          gcCreditedPurchaseSumForYesterday,
          scCreditedPurchaseSumForYesterday,
          gcAwardedTotalSumForYesterday,
          scAwardedTotalSumForYesterday,
          getScTotalForYesterDay,
          getRscSumTotalForYesterday,
          getUscSumForYesterday,
          gcCreditedPurchaseSumForMonthToDate,
          scCreditedPurchaseSumForMonthToDate,
          gcAwardedTotalSumForMonthToDate,
          scAwardedTotalSumForMonthToDate,
          getScTotalForMonthToDate,
          getRscSumTotalForMonthToDate,
          getUscSumForMonthToDate,
          gcCreditedPurchaseSumForLastMonth,
          scCreditedPurchaseSumForLastMonth,
          gcAwardedTotalSumForLastMonth,
          scAwardedTotalSumForLastMonth,
          getScTotalForLastMonth,
          getRscSumTotalForLastMonth,
          getUscSumForLastMonth
        ] =
await Promise.all(
  [
    this.getGcCreditedPurchaseSum(startDate, endDate, internalUsers, playerType),
    this.getScCreditedPurchaseSum(startDate, endDate, internalUsers, playerType),
    this.getGcAwardedTotalSum(startDate, endDate, internalUsers, playerType),
    this.getScAwardedTotalSum(startDate, endDate, internalUsers, playerType),
    this.getScTotal(endDate, internalUsers, playerType),
    this.getRscSum(endDate, internalUsers, playerType),
    this.getUscSum(endDate, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(today, todayEnd, internalUsers, playerType),
    this.getScCreditedPurchaseSum(today, todayEnd, internalUsers, playerType),
    this.getGcAwardedTotalSum(today, todayEnd, internalUsers, playerType),
    this.getScAwardedTotalSum(today, todayEnd, internalUsers, playerType),
    this.getScTotal(todayEnd, internalUsers, playerType),
    this.getRscSum(todayEnd, internalUsers, playerType),
    this.getUscSum(todayEnd, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    this.getScCreditedPurchaseSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    this.getGcAwardedTotalSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    this.getScAwardedTotalSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    this.getScTotal(yesterdayEnd, internalUsers, playerType),
    this.getRscSum(yesterdayEnd, internalUsers, playerType),
    this.getUscSum(yesterdayEnd, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(startOfMonth, today, internalUsers, playerType),
    this.getScCreditedPurchaseSum(startOfMonth, today, internalUsers, playerType),
    this.getGcAwardedTotalSum(startOfMonth, today, internalUsers, playerType),
    this.getScAwardedTotalSum(startOfMonth, today, internalUsers, playerType),
    this.getScTotal(today, internalUsers, playerType),
    this.getRscSum(today, internalUsers, playerType),
    this.getUscSum(today, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
    this.getScCreditedPurchaseSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
    this.getGcAwardedTotalSum(startOfMonth, today, internalUsers, playerType),
    this.getScAwardedTotalSum(startOfMonth, today, internalUsers, playerType),
    this.getScTotal(endOfLastMonth, internalUsers, playerType),
    this.getRscSum(endOfLastMonth, internalUsers, playerType),
    this.getUscSum(endOfLastMonth, internalUsers, playerType)
  ]
)
        return {

          GC_CREDITED_PURCHASE: {
            TODAY: gcCreditedPurchaseSumForToday,
            YESTERDAY: gcCreditedPurchaseSumForYesterday,
            MONTH_TO_DATE: gcCreditedPurchaseSumForMonthToDate,
            LAST_MONTH: gcCreditedPurchaseSumForLastMonth,
            CUSTOM: gcCreditedPurchaseSumForCustom
          },
          SC_CREDITED_PURCHASE: {
            TODAY: scCreditedPurchaseSumForToday,
            YESTERDAY: scCreditedPurchaseSumForYesterday,
            MONTH_TO_DATE: scCreditedPurchaseSumForMonthToDate,
            LAST_MONTH: scCreditedPurchaseSumForLastMonth,
            CUSTOM: scCreditedPurchaseSumForCustom
          },
          GC_AWARDED_TOTAL: {
            TODAY: gcAwardedTotalSumForToday,
            YESTERDAY: gcAwardedTotalSumForYesterday,
            MONTH_TO_DATE: gcAwardedTotalSumForMonthToDate,
            LAST_MONTH: gcAwardedTotalSumForLastMonth,
            CUSTOM: gcAwardedTotalSumForCustom
          },
          SC_AWARDED_TOTAL: {
            TODAY: scAwardedTotalSumForToday,
            YESTERDAY: scAwardedTotalSumForYesterday,
            MONTH_TO_DATE: scAwardedTotalSumForMonthToDate,
            LAST_MONTH: scAwardedTotalSumForLastMonth,
            CUSTOM: scAwardedTotalSumForCustom
          },
          SC_TOTAL_BALANCE: {
            TODAY: getScTotalForToday,
            YESTERDAY: getScTotalForYesterDay,
            MONTH_TO_DATE: getScTotalForMonthToDate,
            LAST_MONTH: getScTotalForLastMonth,
            CUSTOM: getScTotalForCustom
          },
          USC_BALANCE: {
            TODAY: getUscSumForToday,
            YESTERDAY: getUscSumForYesterday,
            MONTH_TO_DATE: getUscSumForMonthToDate,
            LAST_MONTH: getUscSumForLastMonth,
            CUSTOM: getUscSumForCustom
          },
          RSC_BALANCE: {
            TODAY: getRscSumTotalForToday,
            YESTERDAY: getRscSumTotalForYesterday,
            MONTH_TO_DATE: getRscSumTotalForMonthToDate,
            LAST_MONTH: getRscSumTotalForLastMonth,
            CUSTOM: getRscSumTotalForCustom
          }
        }
      }
    } catch (error) {
      // Handle errors
      throw new Error('Error calculating metrics: ' + error.message)
    }
  }

  async getLoginCount (startDate, endDate, isDistinct = false, internalUsers, playerType, distinct) {
    // Implement the query to get the Bet Count for the specified time period using Sequelize
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const loginCount = db.UserActivities.count({
      distinct: distinct,
      col: 'userId',
      where: {
        ...query,
        actioneeType: USER_TYPE.USER,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        }
      }
    })

    return loginCount
  }

  async getCustomerDataCount (startDate, endDate, isDistinct = false, internalUsers, playerType) {
    // Implement the query to get the Bet Count for the specified time period using Sequelize
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const customerCount = await db.User.count({
      distinct: isDistinct,
      col: 'userId',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        }
      }
    })

    return customerCount
  }

  async getPhoneVerifiedCount (startDate, endDate, isDistinct = false, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const phoneVerifiedCount = db.User.count({
      distinct: isDistinct,
      col: 'userId',
      where: {
        ...query,
        otpVerifiedDate: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        }
      }
    })

    return phoneVerifiedCount
  }

  async getIsFirstDepositCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const isFirstDepositCount = db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        isFirstDeposit: true,
        transactionType: TRANSACTION_TYPE.DEPOSIT
      }
    })

    return isFirstDepositCount
  }

  async getIsFirstDepositAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const isFirstDepositAmountSum = db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          isFirstDeposit: true,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      }
    )

    return isFirstDepositAmountSum[0].dataValues.amount
  }

  async getTotalPurchaseAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalPurchaseAmountSum = db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      })

    return totalPurchaseAmountSum[0].dataValues.amount
  }

  async getTotalPurchaseCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalPurchaseCount = db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        status: TRANSACTION_STATUS.SUCCESS,
        transactionType: TRANSACTION_TYPE.DEPOSIT
      }
    })
    return totalPurchaseCount
  }

  async getApprovalRedemptionAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const approvalRedemptionAmountSum = db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.WITHDRAW
        }
      })

    return approvalRedemptionAmountSum[0].dataValues.amount
  }

  async getRequestRedemptionAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountSum = db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.PENDING,
          transactionType: TRANSACTION_TYPE.WITHDRAW
        }
      })
    return requestRedemptionAmountSum[0].dataValues.amount
  }

  async getRequestRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountCount = db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        status: TRANSACTION_STATUS.SUCCESS,
        transactionType: TRANSACTION_TYPE.WITHDRAW
      }
    })
    return requestRedemptionAmountCount
  }

  async getPendingRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const PendingRedemptionAmountCount = db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        status: TRANSACTION_STATUS.PENDING,
        transactionType: TRANSACTION_TYPE.WITHDRAW
      }
    })
    return PendingRedemptionAmountCount
  }

  async getGcCreditedPurchaseSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'internal') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const CreditedPurchaseGcSum = db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(gc_coin)::numeric, 2)'), 'gc_coin']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      })
    return CreditedPurchaseGcSum[0].dataValues.gc_coin
  }

  async getScCreditedPurchaseSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const CreditedPurchaseScSum = db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(sc_coin)::numeric, 2)'), 'sc_coin']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      })
    return CreditedPurchaseScSum[0].dataValues.sc_coin
  }

  async getGcAwardedTotalSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const GcAwardedTotalSum = db.CasinoTransaction.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(gc)::numeric, 2)'), 'gc']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          actionType: { [Op.in]: [WAGERING_TYPE.BONUS, BONUS_TYPE.DAILY_BONUS, BONUS_TYPE.MONTHLY_BONUS, BONUS_TYPE.WELCOME_BONUS, BONUS_TYPE.POSTAL_CODE_BONUS] }
        }
      })
    return GcAwardedTotalSum[0].dataValues.gc
  }

  async getScAwardedTotalSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const ScAwardedTotalSum = db.CasinoTransaction.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(sc)::numeric, 2)'), 'sc']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          actionType: { [Op.in]: [WAGERING_TYPE.BONUS, BONUS_TYPE.DAILY_BONUS, BONUS_TYPE.MONTHLY_BONUS, BONUS_TYPE.WELCOME_BONUS, BONUS_TYPE.POSTAL_CODE_BONUS] }
        }
      })
    return ScAwardedTotalSum[0].dataValues.sc
  }

  async getTotalScBalanceSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { ownerId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { ownerId: { [Op.notIn]: internalUsers } }
    const TotalScBalance = db.Wallet.sum(
      [
        Op.cast(Op.json('sc_coin.bsc'), 'NUMERIC'),
        Op.cast(Op.json('sc_coin.psc'), 'NUMERIC')
      ],
      {
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          }
        }
      })
    return TotalScBalance
  }

  async getActivePlayersCount (amountType, startDate, endDate, actionType, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    // Implement the query to count active players for a specific currency code
    const activePlayersCount = db.CasinoTransaction.count({
      distinct: true,
      col: 'userId',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        amountType,
        actionType
      }
    })
    return activePlayersCount
  }

  async getScTotal (endDate, internalUsers, playerType) {
    let totalScBalance
    if (`${new Date(endDate).getFullYear()}-${String(new Date(endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(endDate).getDate()).padStart(2, '0')}` !== `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) {
      let playerCondition
      if (playerType === 'internal') {
        playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
        `
      } else if (playerType === 'real') {
        playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0), 2)
      `
      } else {
        playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
      `
      }

      totalScBalance = db.UserWalletDetails.findOne(
        {
          attributes: [
            [
              sequelize.literal(playerCondition),
              'total_sc_coin'
            ]
          ],
          where: {
            [Op.and]: [
              sequelize.literal(`DATE("created_at") = '${new Date(endDate).toISOString().split('T')[0]}'`)
            ]
          }
        })

      return totalScBalance ? totalScBalance.dataValues.total_sc_coin : 0
    } else {
      const totalSumsInternal = db.Wallet.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount'],
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
        ],
        where: { ownerId: { [Op.in]: internalUsers } }
      })

      const totalSumsReal = db.Wallet.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount'],
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
        ],
        where: { ownerId: { [Op.notIn]: internalUsers } }
      })
      if (playerType === 'real') totalScBalance = +totalSumsReal[0].dataValues.total_bsc_amount + +totalSumsReal[0].dataValues.total_psc_amount + +totalSumsReal[0].dataValues.total_wsc_amount
      else if (playerType === 'internal') totalScBalance = +totalSumsInternal[0].dataValues.total_bsc_amount + +totalSumsInternal[0].dataValues.total_psc_amount + +totalSumsInternal[0].dataValues.total_wsc_amount
      else totalScBalance = +totalSumsInternal[0].dataValues.total_bsc_amount + +totalSumsInternal[0].dataValues.total_psc_amount + +totalSumsInternal[0].dataValues.total_wsc_amount + +totalSumsReal[0].dataValues.total_bsc_amount + +totalSumsReal[0].dataValues.total_psc_amount + +totalSumsReal[0].dataValues.total_wsc_amount

      return totalScBalance
    }
  }

  async getNewActiveScPlayersCount (startDate, endDate, internalUsers, playerType) {
    // Find all CasinoTransactions for the specified time period
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const casinoTransactions = db.CasinoTransaction.findAll({
      where: {
        ...query,
        actionType: 'bet', // Assuming 'bet' represents a player placing a bet
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        }
      },
      attributes: ['userId'],
      group: ['userId'],
      having: sequelize.literal('COUNT(*) = 1') // Only players with one bet
    })

    // Get the count of new active SC players
    const count = casinoTransactions.length

    return count
  }

  async getRscSum (endDate, internalUsers, playerType) {
    let totalRscBalance
    if (`${new Date(endDate).getFullYear()}-${String(new Date(endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(endDate).getDate()).padStart(2, '0')}` !== `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) {
      let playerCondition
      if (playerType === 'internal') {
        playerCondition = `TRUNC(COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
        `
      } else if (playerType === 'real') {
        playerCondition = `TRUNC(COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0), 2)
      `
      } else {
        playerCondition = `TRUNC(COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0) +  COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
      `
      }

      totalRscBalance = db.UserWalletDetails.findOne(
        {
          attributes: [
            [
              sequelize.literal(playerCondition),
              'total_rsc_coin'
            ]
          ],
          where: {
            [Op.and]: [
              sequelize.literal(`DATE("created_at") = '${new Date(endDate).toISOString().split('T')[0]}'`)
            ]
          }
        })

      return totalRscBalance ? totalRscBalance.dataValues.total_rsc_coin : 0
    } else {
      const totalWscSumsInternal = db.Wallet.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
        ],
        where: { ownerId: { [Op.in]: internalUsers } }
      })

      const totalWscSumsReal = db.Wallet.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
        ],
        where: { ownerId: { [Op.notIn]: internalUsers } }
      })
      if (playerType === 'real') totalRscBalance = +totalWscSumsReal[0].dataValues.total_wsc_amount
      else if (playerType === 'internal') totalRscBalance = +totalWscSumsInternal[0].dataValues.total_wsc_amount
      else totalRscBalance = +totalWscSumsInternal[0].dataValues.total_wsc_amount + +totalWscSumsReal[0].dataValues.total_wsc_amount

      return totalRscBalance
    }
  }

  async getUscSum (endDate, internalUsers, playerType) {
    let totalUscBalance
    if (`${new Date(endDate).getFullYear()}-${String(new Date(endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(endDate).getDate()).padStart(2, '0')}` !== `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) {
      let playerCondition
      if (playerType === 'internal') {
        playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0), 2)
        `
      } else if (playerType === 'real') {
        playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0), 2)
      `
      } else {
        playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0), 2)
      `
      }

      totalUscBalance = db.UserWalletDetails.findOne(
        {
          attributes: [
            [
              sequelize.literal(playerCondition),
              'total_usc_coin'
            ]
          ],
          where: {
            [Op.and]: [
              sequelize.literal(`DATE("created_at") = '${new Date(endDate).toISOString().split('T')[0]}'`)
            ]
          }
        })

      return totalUscBalance ? totalUscBalance.dataValues.total_usc_coin : 0
    } else {
      const totalPscSumsInternal = db.Wallet.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount']
        ],
        where: { ownerId: { [Op.in]: internalUsers } }
      })

      const totalUscSumsReal = db.Wallet.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
          [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount']
        ],
        where: { ownerId: { [Op.notIn]: internalUsers } }
      })
      if (playerType === 'real') totalUscBalance = +totalUscSumsReal[0].dataValues.total_bsc_amount + +totalUscSumsReal[0].dataValues.total_psc_amount
      else if (playerType === 'internal') totalUscBalance = +totalPscSumsInternal[0].dataValues.total_bsc_amount + +totalPscSumsInternal[0].dataValues.total_psc_amount
      else totalUscBalance = +totalPscSumsInternal[0].dataValues.total_bsc_amount + +totalPscSumsInternal[0].dataValues.total_psc_amount + +totalUscSumsReal[0].dataValues.total_bsc_amount + +totalUscSumsReal[0].dataValues.total_psc_amount

      return totalUscBalance
    }
  }

  async getScTransactionSum (startDate, endDate, internalUsers, playerType, actionType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const scStakedAmountSum = db.CasinoTransaction.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          actionType
        }
      })

    return scStakedAmountSum[0].dataValues.amount || 0
  }
}
