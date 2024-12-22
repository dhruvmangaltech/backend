import sequelize, { Op } from 'sequelize'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { BONUS_TYPE, DASHBOARD_REPORT, PAYMENT_PROVIDER, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE, WAGERING_TYPE } from '../../utils/constants/constant'
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
            this.getLoginCount(today, todayEnd, false, internalUsers, playerType, false),
            this.getLoginCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType, true),
            this.getLoginCount(yesterdayStart, yesterdayEnd, false, internalUsers, playerType, false),
            this.getLoginCount(startOfMonth, today, true, internalUsers, playerType, true),
            this.getLoginCount(startOfMonth, today, false, internalUsers, playerType, false),
            this.getLoginCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType, true),
            this.getLoginCount(startOfLastMonth, endOfLastMonth, false, internalUsers, playerType, false),
            this.getLoginCount(startDate, endDate, true, internalUsers, playerType, true),
            this.getLoginCount(startDate, endDate, false, internalUsers, playerType, false)
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
          pendingRedemptioncountForLastMonth,
          totalPurchaseAmountSumForAddSCToday,
          totalPurchaseAmountSumForAddSCYesterday,
          totalPurchaseAmountSumForAddSCMonthTodate,
          totalPurchaseAmountSumForAddSCLastMonth,
          totalPurchaseAmountSumForAddSCLastCustom,
          totalPurchaseAmountSumForAddGCToday,
          totalPurchaseAmountSumForAddGCYesterday,
          totalPurchaseAmountSumForAddGCMonthTodate,
          totalPurchaseAmountSumForAddGCLastMonth,
          totalPurchaseAmountSumForAddGCLastCustom,
          totalPurchaseAmountSumForRemoveSCToday,
          totalPurchaseAmountSumForRemoveSCYesterday,
          totalPurchaseAmountSumForRemoveSCMonthTodate,
          totalPurchaseAmountSumForRemoveSCLastMonth,
          totalPurchaseAmountSumForRemoveSCLastCustom,
          totalPurchaseAmountSumForRemoveGCToday,
          totalPurchaseAmountSumForRemoveGCYesterday,
          totalPurchaseAmountSumForRemoveGCMonthTodate,
          totalPurchaseAmountSumForRemoveGCLastMonth,
          totalPurchaseAmountSumForRemoveGCLastCustom
        ] = await Promise.all([
          this.getCustomerDataCount(startDate, endDate, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(startDate, endDate, true, internalUsers, playerType),
          this.getIsFirstDepositCount(startDate, endDate, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startDate, endDate, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startDate, endDate, internalUsers, playerType),
          this.getTotalPurchaseCount(startDate, endDate, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startDate, endDate, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startDate, endDate, internalUsers, playerType),
          this.getRequestRedemptionCount(startDate, endDate, internalUsers, playerType),
          this.getPendingRedemptionCount(startDate, endDate, internalUsers, playerType),
          this.getCustomerDataCount(today, todayEnd, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(today, todayEnd, internalUsers, playerType),
          this.getIsFirstDepositCount(today, todayEnd, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(today, todayEnd, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(today, todayEnd, internalUsers, playerType),
          this.getTotalPurchaseCount(today, todayEnd, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(today, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(today, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionCount(today, todayEnd, internalUsers, playerType),
          this.getPendingRedemptionCount(today, todayEnd, internalUsers, playerType),
          this.getCustomerDataCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getIsFirstDepositCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getTotalPurchaseCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getRequestRedemptionCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getPendingRedemptionCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getCustomerDataCount(startOfMonth, today, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(startOfMonth, today, true, internalUsers, playerType),
          this.getIsFirstDepositCount(startOfMonth, today, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startOfMonth, today, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startOfMonth, today, internalUsers, playerType),
          this.getTotalPurchaseCount(startOfMonth, today, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startOfMonth, today, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startOfMonth, today, internalUsers, playerType),
          this.getRequestRedemptionCount(startOfMonth, today, internalUsers, playerType),
          this.getPendingRedemptionCount(startOfMonth, today, internalUsers, playerType),
          this.getCustomerDataCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getPhoneVerifiedCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getIsFirstDepositCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalPurchaseCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getRequestRedemptionCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getPendingRedemptionCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddSctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(startOfMonth, today, internalUsers, playerType),
          this.getTotalAddSctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddSctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalAddGctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(startOfMonth, today, internalUsers, playerType),
          this.getTotalAddGctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddGctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalAddGctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(startOfMonth, today, internalUsers, playerType),
          this.getTotalAddGctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddGctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalRemoveSctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(startOfMonth, today, internalUsers, playerType),
          this.getTotalRemoveSctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalRemoveSctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalRemoveGctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(startOfMonth, today, internalUsers, playerType),
          this.getTotalRemoveGctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalRemoveGctSum(startDate, endDate, internalUsers, playerType)

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
          },
          ADD_SC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForAddSCToday,
            YESTERDAY: totalPurchaseAmountSumForAddSCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForAddSCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForAddSCLastMonth,
            CUSTOM: totalPurchaseAmountSumForAddSCLastCustom
          },
          ADD_GC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForAddGCToday,
            YESTERDAY: totalPurchaseAmountSumForAddGCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForAddGCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForAddGCLastMonth,
            CUSTOM: totalPurchaseAmountSumForAddGCLastCustom
          },
          REMOVE_SC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForRemoveSCToday,
            YESTERDAY: totalPurchaseAmountSumForRemoveSCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForRemoveSCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForRemoveSCLastMonth,
            CUSTOM: totalPurchaseAmountSumForRemoveSCLastCustom
          },
          REMOVE_GC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForRemoveGCToday,
            YESTERDAY: totalPurchaseAmountSumForRemoveGCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForRemoveGCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForRemoveGCLastMonth,
            CUSTOM: totalPurchaseAmountSumForRemoveGCLastCustom
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
            TODAY: this.roundToTwoDecimalPlaces(scStakedTodayCount - scWinTodayCount),
            YESTERDAY: this.roundToTwoDecimalPlaces(scStakedYesterdayCount - scWinYesterdayCount),
            MONTH_TO_DATE: this.roundToTwoDecimalPlaces(scStakedMonthToDateCount - scWinMonthToDateCount),
            LAST_MONTH: this.roundToTwoDecimalPlaces(scStakedLastMonthCount - scWinLastMonthCount),
            CUSTOM: this.roundToTwoDecimalPlaces(scStakedCustomCount - scWinCustomCount)
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
      // Dashboard report

      if (reportType === DASHBOARD_REPORT.DASHBOARD_REPORT) {
        const [scStakedTodayCount, scWinTodayCount, scAwardedTotalSumForToday, gcAwardedTotalSumForToday] = await Promise.all([
          this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'bet'),
          this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'win'),
          this.getScAwardedTotalSum(today, todayEnd, internalUsers, playerType),
          this.getGcAwardedTotalSum(yesterdayStart, yesterdayEnd, internalUsers, playerType)
        ])
        return {
          DASHBOARD_REPORT: {
            scStakedTodayCount,
            scWinTodayCount,
            scAwardedTotalSumForToday,
            gcAwardedTotalSumForToday,
            scGgr: this.roundToTwoDecimalPlaces(scStakedTodayCount - scWinTodayCount)
          }
        }
      }

      // Coin Economy Data
      if (reportType === DASHBOARD_REPORT.ECONOMY_DATA) {
        const [gcCreditedPurchaseSumForCustom,
          scCreditedPurchaseSumForCustom,
          gcAwardedTotalSumForCustom,
          scAwardedTotalSumForCustom,
          // getScTotalForCustom,
          // getRscSumTotalForCustom,
          // getUscSumForCustom,
          gcCreditedPurchaseSumForToday,
          scCreditedPurchaseSumForToday,
          gcAwardedTotalSumForToday,
          scAwardedTotalSumForToday,
          // getScTotalForToday,
          // getRscSumTotalForToday,
          // getUscSumForToday,
          gcCreditedPurchaseSumForYesterday,
          scCreditedPurchaseSumForYesterday,
          gcAwardedTotalSumForYesterday,
          scAwardedTotalSumForYesterday,
          // getScTotalForYesterDay,
          // getRscSumTotalForYesterday,
          // getUscSumForYesterday,
          gcCreditedPurchaseSumForMonthToDate,
          scCreditedPurchaseSumForMonthToDate,
          gcAwardedTotalSumForMonthToDate,
          scAwardedTotalSumForMonthToDate,
          // getScTotalForMonthToDate,
          // getRscSumTotalForMonthToDate,
          // getUscSumForMonthToDate,
          gcCreditedPurchaseSumForLastMonth,
          scCreditedPurchaseSumForLastMonth,
          gcAwardedTotalSumForLastMonth,
          scAwardedTotalSumForLastMonth
          // getScTotalForLastMonth,
          // getRscSumTotalForLastMonth,
          // getUscSumForLastMonth
        ] =
await Promise.all(
  [
    this.getGcCreditedPurchaseSum(startDate, endDate, internalUsers, playerType),
    this.getScCreditedPurchaseSum(startDate, endDate, internalUsers, playerType),
    this.getGcAwardedTotalSum(startDate, endDate, internalUsers, playerType),
    this.getScAwardedTotalSum(startDate, endDate, internalUsers, playerType),
    // this.getScTotal(endDate, internalUsers, playerType),
    // this.getRscSum(endDate, internalUsers, playerType),
    // this.getUscSum(endDate, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(today, todayEnd, internalUsers, playerType),
    this.getScCreditedPurchaseSum(today, todayEnd, internalUsers, playerType),
    this.getGcAwardedTotalSum(today, todayEnd, internalUsers, playerType),
    this.getScAwardedTotalSum(today, todayEnd, internalUsers, playerType),
    // this.getScTotal(todayEnd, internalUsers, playerType),
    // this.getRscSum(todayEnd, internalUsers, playerType),
    // this.getUscSum(todayEnd, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    this.getScCreditedPurchaseSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    this.getGcAwardedTotalSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    this.getScAwardedTotalSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
    // this.getScTotal(yesterdayEnd, internalUsers, playerType),
    // this.getRscSum(yesterdayEnd, internalUsers, playerType),
    // this.getUscSum(yesterdayEnd, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(startOfMonth, today, internalUsers, playerType),
    this.getScCreditedPurchaseSum(startOfMonth, today, internalUsers, playerType),
    this.getGcAwardedTotalSum(startOfMonth, today, internalUsers, playerType),
    this.getScAwardedTotalSum(startOfMonth, today, internalUsers, playerType),
    // this.getScTotal(today, internalUsers, playerType),
    // this.getRscSum(today, internalUsers, playerType),
    // this.getUscSum(today, internalUsers, playerType),
    this.getGcCreditedPurchaseSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
    this.getScCreditedPurchaseSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
    this.getGcAwardedTotalSum(startOfMonth, today, internalUsers, playerType),
    this.getScAwardedTotalSum(startOfMonth, today, internalUsers, playerType)
    // this.getScTotal(endOfLastMonth, internalUsers, playerType),
    // this.getRscSum(endOfLastMonth, internalUsers, playerType),
    // this.getUscSum(endOfLastMonth, internalUsers, playerType)
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
          }
          // SC_TOTAL_BALANCE: {
          //   TODAY: getScTotalForToday,
          //   YESTERDAY: getScTotalForYesterDay,
          //   MONTH_TO_DATE: getScTotalForMonthToDate,
          //   LAST_MONTH: getScTotalForLastMonth,
          //   CUSTOM: getScTotalForCustom
          // },
          // USC_BALANCE: {
          //   TODAY: getUscSumForToday,
          //   YESTERDAY: getUscSumForYesterday,
          //   MONTH_TO_DATE: getUscSumForMonthToDate,
          //   LAST_MONTH: getUscSumForLastMonth,
          //   CUSTOM: getUscSumForCustom
          // },
          // RSC_BALANCE: {
          //   TODAY: getRscSumTotalForToday,
          //   YESTERDAY: getRscSumTotalForYesterday,
          //   MONTH_TO_DATE: getRscSumTotalForMonthToDate,
          //   LAST_MONTH: getRscSumTotalForLastMonth,
          //   CUSTOM: getRscSumTotalForCustom
          // }
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
        activityType: USER_ACTIVITIES_TYPE.LOGIN,
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
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      [Op.or]: [
        {
          paymentMethod: PAYMENT_PROVIDER.PAYNOTE,
          status: TRANSACTION_STATUS.SUCCESS,
          created_at: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        {
          [Op.or]: [
            { paymentMethod: null },
            {
              paymentMethod: {
                [Op.ne]: PAYMENT_PROVIDER.PAYNOTE
              }
            }
          ],
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          }
        }
      ]
    }
    const isFirstDepositCount = db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        ...whereClause,
        isFirstDeposit: true
      }
    })

    return isFirstDepositCount
  }

  async getIsFirstDepositAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      [Op.or]: [
        {
          paymentMethod: PAYMENT_PROVIDER.PAYNOTE,
          status: TRANSACTION_STATUS.SUCCESS,
          created_at: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        {
          [Op.or]: [
            { paymentMethod: null },
            {
              paymentMethod: {
                [Op.ne]: PAYMENT_PROVIDER.PAYNOTE
              }
            }
          ],
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          }
        }
      ]
    }
    const isFirstDepositAmountSum = await db.TransactionBanking.sum('amount', {
      where: {
        ...query,
        ...whereClause,
        isFirstDeposit: true
      }
    }
    )

    return +isFirstDepositAmountSum?.toFixed(2)
  }

  async getTotalPurchaseAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      [Op.or]: [
        {
          paymentMethod: PAYMENT_PROVIDER.PAYNOTE,
          status: TRANSACTION_STATUS.SUCCESS,
          created_at: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        {
          [Op.or]: [
            { paymentMethod: null },
            {
              paymentMethod: {
                [Op.ne]: PAYMENT_PROVIDER.PAYNOTE
              }
            }
          ],
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          }
        }
      ]
    }

    const totalPurchaseAmountSum = await db.TransactionBanking.sum('amount',
      {
        where: {
          ...query,
          ...whereClause
        }
      })

    return +totalPurchaseAmountSum?.toFixed(2)
  }

  async getTotalAddSctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalAddScAmountSum = await db.TransactionBanking.sum('scCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.ADD_SC
        }
      })

    return +totalAddScAmountSum?.toFixed(2)
  }

  async getTotalRemoveSctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalRemoveScAmountSum = await db.TransactionBanking.sum('scCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.REMOVE_SC
        }
      })

    return +totalRemoveScAmountSum?.toFixed(2)
  }

  async getTotalAddGctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalAddGcAmountSum = await db.TransactionBanking.sum('gcCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.ADD_GC
        }
      })

    return +totalAddGcAmountSum?.toFixed(2)
  }

  async getTotalRemoveGctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalRemoveGcAmountSum = await db.TransactionBanking.sum('gcCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.REMOVE_GC
        }
      })

    return +totalRemoveGcAmountSum?.toFixed(2)
  }

  async getTotalPurchaseCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      [Op.or]: [
        {
          paymentMethod: PAYMENT_PROVIDER.PAYNOTE,
          status: TRANSACTION_STATUS.SUCCESS,
          created_at: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        {
          [Op.or]: [
            { paymentMethod: null },
            {
              paymentMethod: {
                [Op.ne]: PAYMENT_PROVIDER.PAYNOTE
              }
            }
          ],
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          }
        }
      ]
    }
    const totalPurchaseCount = db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        ...whereClause
      }
    })
    return totalPurchaseCount
  }

  async getTotalPurchaseSumForSuccessPaynote (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalPurchaseAmountSum = await db.TransactionBanking.sum('amount', {
      where: {
        ...query,
        paymentMethod: PAYMENT_PROVIDER.PAYNOTE,
        createdAt: {
          [Op.between]: [
            new Date(startDate),
            new Date(endDate)
          ]
        },
        status: TRANSACTION_STATUS.SUCCESS,
        transactionType: TRANSACTION_TYPE.DEPOSIT
      }
    })
    return +(+totalPurchaseAmountSum)?.toFixed(2)
  }

  async getTotalPurchaseSumForCanceledPaynote (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalPurchaseAmountSum = await db.TransactionBanking.sum('amount', {
      where: {
        ...query,
        paymentMethod: PAYMENT_PROVIDER.PAYNOTE,
        createdAt: {
          [Op.between]: [
            new Date(startDate),
            new Date(endDate)
          ]
        },
        status: TRANSACTION_STATUS.CANCELED,
        transactionType: TRANSACTION_TYPE.DEPOSIT
      }
    })
    return +(+totalPurchaseAmountSum)?.toFixed(2)
  }

  async getTotalPurchaseSumForPendingPaynote (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalPurchaseAmountSum = await db.TransactionBanking.sum('amount', {
      where: {
        ...query,
        paymentMethod: PAYMENT_PROVIDER.PAYNOTE,
        createdAt: {
          [Op.between]: [
            new Date(startDate),
            new Date(endDate)
          ]
        },
        status: TRANSACTION_STATUS.PENDING,
        transactionType: TRANSACTION_TYPE.DEPOSIT
      }
    })
    return +(+totalPurchaseAmountSum)?.toFixed(2)
  }

  async getTotalPurchaseSumForSuccessTripleA (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalPurchaseAmountSum = await db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          paymentMethod: PAYMENT_PROVIDER.TRIPLE_A,
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

  async getApprovalRedemptionAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const approvalRedemptionAmountSum = await db.TransactionBanking.findAll(
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
    const requestRedemptionAmountSum = await db.WithdrawRequest.findAll(
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
          status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] }
        }
      })
    return requestRedemptionAmountSum[0].dataValues.amount
  }

  async getRequestRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountCount = db.WithdrawRequest.count({
      col: 'withdraw_request_id',
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
    return requestRedemptionAmountCount
  }

  async getPendingRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountCount = db.WithdrawRequest.count({
      col: 'withdraw_request_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
            [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
          }
        },
        status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] }
      }
    })
    return requestRedemptionAmountCount
  }

  async getGcCreditedPurchaseSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'internal') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const CreditedPurchaseGcSum = await db.TransactionBanking.findAll(
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
    const CreditedPurchaseScSum = await db.TransactionBanking.findAll(
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
    const GcAwardedTotalSum = await db.CasinoTransaction.findAll(
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
    const ScAwardedTotalSum = await db.CasinoTransaction.findAll(
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
          actionType: { [Op.in]: [WAGERING_TYPE.BONUS, BONUS_TYPE.DAILY_BONUS, BONUS_TYPE.MONTHLY_BONUS, BONUS_TYPE.WELCOME_BONUS, BONUS_TYPE.FIRST_PURCHASE_BONUS, BONUS_TYPE.PSP_BONUS, BONUS_TYPE.WEEKLY_RAKEBACK_BONUS, BONUS_TYPE.REFERRAL_BONUS, BONUS_TYPE.BOOST_BONUS, BONUS_TYPE.SPIN_WHEEL] }
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

  // async getScTotal (endDate, internalUsers, playerType) {
  //   let totalScBalance
  //   if (`${new Date(endDate).getFullYear()}-${String(new Date(endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(endDate).getDate()).padStart(2, '0')}` !== `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) {
  //     let playerCondition
  //     if (playerType === 'internal') {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
  //       `
  //     } else if (playerType === 'real') {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0), 2)
  //     `
  //     } else {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
  //     `
  //     }

  //     totalScBalance = await db.UserWalletDetails.findOne(
  //       {
  //         attributes: [
  //           [
  //             sequelize.literal(playerCondition),
  //             'total_sc_coin'
  //           ]
  //         ],
  //         where: {
  //           [Op.and]: [
  //             sequelize.literal(`DATE("created_at") = '${new Date(endDate).toISOString().split('T')[0]}'`)
  //           ]
  //         }
  //       })

  //     return totalScBalance ? totalScBalance.dataValues.total_sc_coin : 0
  //   } else {
  //     const totalSumsInternal = await db.Wallet.findAll({
  //       attributes: [
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount'],
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
  //       ],
  //       where: { ownerId: { [Op.in]: internalUsers } }
  //     })

  //     const totalSumsReal = await db.Wallet.findAll({
  //       attributes: [
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount'],
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
  //       ],
  //       where: { ownerId: { [Op.notIn]: internalUsers } }
  //     })
  //     if (playerType === 'real') totalScBalance = +totalSumsReal[0].dataValues.total_bsc_amount + +totalSumsReal[0].dataValues.total_psc_amount + +totalSumsReal[0].dataValues.total_wsc_amount
  //     else if (playerType === 'internal') totalScBalance = +totalSumsInternal[0].dataValues.total_bsc_amount + +totalSumsInternal[0].dataValues.total_psc_amount + +totalSumsInternal[0].dataValues.total_wsc_amount
  //     else totalScBalance = +totalSumsInternal[0].dataValues.total_bsc_amount + +totalSumsInternal[0].dataValues.total_psc_amount + +totalSumsInternal[0].dataValues.total_wsc_amount + +totalSumsReal[0].dataValues.total_bsc_amount + +totalSumsReal[0].dataValues.total_psc_amount + +totalSumsReal[0].dataValues.total_wsc_amount

  //     return totalScBalance
  //   }
  // }

  async getNewActiveScPlayersCount (startDate, endDate, internalUsers, playerType) {
    // Find all CasinoTransactions for the specified time period
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const casinoTransactions = await db.CasinoTransaction.findAll({
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

  // async getRscSum (endDate, internalUsers, playerType) {
  //   let totalRscBalance
  //   if (`${new Date(endDate).getFullYear()}-${String(new Date(endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(endDate).getDate()).padStart(2, '0')}` !== `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) {
  //     let playerCondition
  //     if (playerType === 'internal') {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
  //       `
  //     } else if (playerType === 'real') {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0), 2)
  //     `
  //     } else {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_wsc->>'real' AS NUMERIC), 0) +  COALESCE(CAST(total_wsc->>'internal' AS NUMERIC), 0), 2)
  //     `
  //     }

  //     totalRscBalance = await db.UserWalletDetails.findOne(
  //       {
  //         attributes: [
  //           [
  //             sequelize.literal(playerCondition),
  //             'total_rsc_coin'
  //           ]
  //         ],
  //         where: {
  //           [Op.and]: [
  //             sequelize.literal(`DATE("created_at") = '${new Date(endDate).toISOString().split('T')[0]}'`)
  //           ]
  //         }
  //       })

  //     return totalRscBalance ? totalRscBalance.dataValues.total_rsc_coin : 0
  //   } else {
  //     const totalWscSumsInternal = await db.Wallet.findAll({
  //       attributes: [
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
  //       ],
  //       where: { ownerId: { [Op.in]: internalUsers } }
  //     })

  //     const totalWscSumsReal = await db.Wallet.findAll({
  //       attributes: [
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'wsc\' AS DECIMAL(10, 2))')), 'total_wsc_amount']
  //       ],
  //       where: { ownerId: { [Op.notIn]: internalUsers } }
  //     })
  //     if (playerType === 'real') totalRscBalance = +totalWscSumsReal[0].dataValues.total_wsc_amount
  //     else if (playerType === 'internal') totalRscBalance = +totalWscSumsInternal[0].dataValues.total_wsc_amount
  //     else totalRscBalance = +totalWscSumsInternal[0].dataValues.total_wsc_amount + +totalWscSumsReal[0].dataValues.total_wsc_amount

  //     return totalRscBalance
  //   }
  // }

  // async getUscSum (endDate, internalUsers, playerType) {
  //   let totalUscBalance
  //   if (`${new Date(endDate).getFullYear()}-${String(new Date(endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(endDate).getDate()).padStart(2, '0')}` !== `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) {
  //     let playerCondition
  //     if (playerType === 'internal') {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0), 2)
  //       `
  //     } else if (playerType === 'real') {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0), 2)
  //     `
  //     } else {
  //       playerCondition = `TRUNC(COALESCE(CAST(total_bsc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'real' AS NUMERIC), 0) + COALESCE(CAST(total_bsc->>'internal' AS NUMERIC), 0) + COALESCE(CAST(total_psc->>'internal' AS NUMERIC), 0), 2)
  //     `
  //     }

  //     totalUscBalance = await db.UserWalletDetails.findOne(
  //       {
  //         attributes: [
  //           [
  //             sequelize.literal(playerCondition),
  //             'total_usc_coin'
  //           ]
  //         ],
  //         where: {
  //           [Op.and]: [
  //             sequelize.literal(`DATE("created_at") = '${new Date(endDate).toISOString().split('T')[0]}'`)
  //           ]
  //         }
  //       })

  //     return totalUscBalance ? totalUscBalance.dataValues.total_usc_coin : 0
  //   } else {
  //     const totalPscSumsInternal = await db.Wallet.findAll({
  //       attributes: [
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount']
  //       ],
  //       where: { ownerId: { [Op.in]: internalUsers } }
  //     })

  //     const totalUscSumsReal = db.Wallet.findAll({
  //       attributes: [
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'psc\' AS DECIMAL(10, 2))')), 'total_psc_amount'],
  //         [sequelize.fn('sum', sequelize.literal('CAST("sc_coin"->>\'bsc\' AS DECIMAL(10, 2))')), 'total_bsc_amount']
  //       ],
  //       where: { ownerId: { [Op.notIn]: internalUsers } }
  //     })
  //     if (playerType === 'real') totalUscBalance = +totalUscSumsReal[0].dataValues.total_bsc_amount + +totalUscSumsReal[0].dataValues.total_psc_amount
  //     else if (playerType === 'internal') totalUscBalance = +totalPscSumsInternal[0].dataValues.total_bsc_amount + +totalPscSumsInternal[0].dataValues.total_psc_amount
  //     else totalUscBalance = +totalPscSumsInternal[0].dataValues.total_bsc_amount + +totalPscSumsInternal[0].dataValues.total_psc_amount + +totalUscSumsReal[0].dataValues.total_bsc_amount + +totalUscSumsReal[0].dataValues.total_psc_amount

  //     return totalUscBalance
  //   }
  // }

  async getScTransactionSum (startDate, endDate, internalUsers, playerType, actionType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const scStakedAmountSum = await db.CasinoTransaction.findAll(
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
          actionType,
          amountType: 1
        }
      })

    return scStakedAmountSum[0].dataValues.amount || 0
  }

  roundToTwoDecimalPlaces (num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}
