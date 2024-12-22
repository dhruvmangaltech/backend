import models from '../db/models'
import { v4 as uuid } from 'uuid'
import moment from 'moment/moment'
import { createNewEntity, getOne } from '../utils/crud'
import { plus, times, divide } from 'number-precision'
import { ACTION_TYPE, BONUS_TYPE, STATUS_VALUE, TRANSACTION_STATUS, USER_ACTIVITIES_TYPE, PAYMENT_PROVIDER_TYPE, AMOUNT_TYPE } from '../utils/constants/constant'
import Logger from '../libs/logger'

export const awardPspBonus = async ({ userId, purchasedSc, purchasedGc, sequelizeTransaction, userWallet }) => {
  const {
    Bonus: BonusModel,
    UserBonus: UserBonusModel,
    CasinoTransaction: CasinoTransactionModel,
    UserActivities: UserActivitiesModel
  } = models

  try {
    const bonusData = await getOne({
      model: BonusModel,
      data: {
        isActive: true,
        bonusType: BONUS_TYPE.PSP_BONUS,
        providerId: PAYMENT_PROVIDER_TYPE.TRIPLE_A
      },
      attributes: ['validFrom', 'bonusId', 'percentage', 'gcAmount', 'scAmount']
    })

    console.log(bonusData)

    if (bonusData?.validFrom <= moment(new Date()).format('YYYY-MM-DD')) {
      return 'PSPBonusNotFound'
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
        bonusType: BONUS_TYPE.PSP_BONUS,
        status: STATUS_VALUE.SUCCESS,
        scAmount: bonusSc,
        gcAmount: bonusGc,
        claimedAt: new Date()
      },
      transaction: sequelizeTransaction
    })

    await CasinoTransactionModel.create({
      userId: userId,
      actionType: BONUS_TYPE.PSP_BONUS,
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
      data: { activityType: USER_ACTIVITIES_TYPE.PSP_BONUS, userId, uniqueId: uuid() },
      transaction: sequelizeTransaction
    })
  } catch (error) {
    Logger.info(`Error in Award PSP Bonus - ${JSON.stringify(error)}`)
    return 'InternalServerErrorType'
  }
}
