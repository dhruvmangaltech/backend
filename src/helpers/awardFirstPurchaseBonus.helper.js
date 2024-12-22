import { Op } from 'sequelize'
import {v4 as uuid} from 'uuid'
import models from '../db/models'
import moment from 'moment/moment'
import Logger from '../libs/logger'
import { plus, times, divide } from 'number-precision'
import { createNewEntity, getAll, getOne } from '../utils/crud'
import { TRANSACTION_PROVIDER } from '../utils/constants/payment'
import { ACTION_TYPE, AMOUNT_TYPE, BONUS_TYPE, ROLE, STATUS_VALUE, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../utils/constants/constant'

export const awardFirstPurchaseBonus = async ({ userId, purchasedSc, purchasedGc, sequelizeTransaction, userWallet, provider }) => {
  const {
    Bonus: BonusModel,
    UserBonus: UserBonusModel,
    TransactionBanking: TransactionBankingModel,
    CasinoTransaction: CasinoTransactionModel,
    UserActivities: UserActivitiesModel
  } = models

  let query
  if (provider === TRANSACTION_PROVIDER.TRIPLE_A) query = { status: TRANSACTION_STATUS.SUCCESS }
  else if (provider === TRANSACTION_PROVIDER.PAYNOTE) query = { status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.SUCCESS] } }

  try {
    const isFirstPurchaseBonusClaimed = await getOne({
      model: UserActivitiesModel,
      data: {
        userId: userId,
        activityType: USER_ACTIVITIES_TYPE.FIRST_PURCHASE_BONUS
      },
      transaction: sequelizeTransaction
    })
    if (isFirstPurchaseBonusClaimed) return 'FirstPurchaseBonusClaimed'

    const isFirstDepositCompleted = await getAll({
      model: TransactionBankingModel,
      data: {
        actioneeType: ROLE.USER,
        transactionType: TRANSACTION_TYPE.DEPOSIT,
        actioneeId: userId,
        isFirstDeposit: true,
        ...query
      },
      transaction: sequelizeTransaction
    })

    if(isFirstDepositCompleted.length > 1) {
      return 'FirstPurchaseAlreadyDone'
    }
    const bonusData = await getOne({
      model: BonusModel,
      data: {
        isActive: true,
        bonusType: BONUS_TYPE.FIRST_PURCHASE_BONUS
      },
      attributes: ['validFrom', 'bonusId', 'percentage', 'gcAmount', 'scAmount']
    })

    if (bonusData?.validFrom <= moment(new Date()).format('YYYY-MM-DD')) {
      return 'FirstPurchaseBonusNotFound'
    }

    let balanceObj = {
      beforeScBalance: +(Math.round((+userWallet.scCoin.bsc + +userWallet.scCoin.psc + +userWallet.scCoin.wsc) * 100) / 100).toFixed(2),
      beforeGcBalance: +userWallet.gcCoin
    }

    const bonusGc = +divide(times(+purchasedGc, +bonusData.percentage), 100).toFixed(2)
    const bonusSc = +divide(times(+purchasedSc, +bonusData.percentage), 100).toFixed(2)

    userWallet.gcCoin = +plus(+bonusGc, +userWallet.gcCoin).toFixed(2)
    
    userWallet.scCoin = {
      ...userWallet.scCoin,
      bsc: +plus(+bonusSc, +userWallet.scCoin.bsc).toFixed(2)
    }

    await userWallet.save({ transaction: sequelizeTransaction })

    balanceObj = {
      ...balanceObj,
      afterScBalance:
        (+userWallet.scCoin.bsc || 0) +
        (+userWallet.scCoin.psc || 0) +
        (+userWallet.scCoin.wsc || 0),
      afterGcBalance: +userWallet.gcCoin.toFixed(2)
    }

    const isCreated = await createNewEntity({
      model: UserBonusModel,
      data: {
        bonusId: bonusData.bonusId,
        userId: userId,
        bonusType: BONUS_TYPE.FIRST_PURCHASE_BONUS,
        status: STATUS_VALUE.SUCCESS,
        scAmount: bonusSc,
        gcAmount: bonusGc,
        claimedAt: new Date()
      },
      transaction: sequelizeTransaction
    })

    await CasinoTransactionModel.create({
      userId: userId,
      actionType: BONUS_TYPE.FIRST_PURCHASE_BONUS,
      actionId: ACTION_TYPE.CREDIT,
      status: TRANSACTION_STATUS.SUCCESS,
      walletId: userWallet.walletId,
      currencyCode: userWallet.currencyCode,
      userBonusId: isCreated.userBonusId,
      amountType: AMOUNT_TYPE.CASH_NON_CASH,
      sc: bonusSc,
      gc: bonusGc,
      moreDetails: balanceObj,
      roundId: 'NULL',
      transactionId: `${new Date(
        new Date().toString().split('GMT')[0] + ' UTC'
      ).toISOString()}-TRANSACTION`
    }, { transaction: sequelizeTransaction })

    await createNewEntity({
      model: UserActivitiesModel,
      data: { activityType: USER_ACTIVITIES_TYPE.FIRST_PURCHASE_BONUS, userId, uniqueId: uuid() },
      transaction: sequelizeTransaction
    })
  } catch (error) {
    Logger.info(`Error in first purchase bonus - ${JSON.stringify(error)}`)
    return 'InternalServerErrorType'
  }
}
