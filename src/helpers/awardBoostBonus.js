import models from '../db/models'
import { createNewEntity, getOne } from '../utils/crud'
import { plus, times, divide } from 'number-precision'
import { ACTION_TYPE, BONUS_TYPE, TRANSACTION_STATUS, AMOUNT_TYPE, USER_ACTIVITIES_TYPE } from '../utils/constants/constant'
import Logger from '../libs/logger'
import { v4 as uuid } from 'uuid'

export const awardBoostBonus = async ({ userId, purchasedSc, purchasedGc, sequelizeTransaction, userWallet }) => {
  const {
    CasinoTransaction: CasinoTransactionModel,
    VipTier: VipTierModel,
    UserVipTier: UserVipTierModel,
    UserActivities: UserActivitiesModel
  } = models

  try {
    const currentVipTier = await getOne({
      model: UserVipTierModel,
      data: {
        userId,
        active: true
      },
      include: [{ model: VipTierModel }]
    })

    if (!currentVipTier) {
      return 'currentVipTierNotFound'
    }

    let balanceObj = {
      beforeScBalance: +(Math.round((+userWallet.scCoin.bsc + +userWallet.scCoin.psc + +userWallet.scCoin.wsc) * 100) / 100).toFixed(2),
      beforeGcBalance: userWallet.gcCoin
    }

    const bonusGc = +divide(times(+purchasedGc, +currentVipTier.VipTier.boost), 100).toFixed(2)
    const bonusSc = +divide(times(+purchasedSc, +currentVipTier.VipTier.boost), 100).toFixed(2)

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

    await CasinoTransactionModel.create({
      userId: userId,
      actionType: BONUS_TYPE.BOOST_BONUS,
      actionId: ACTION_TYPE.CREDIT,
      status: TRANSACTION_STATUS.SUCCESS,
      walletId: userWallet.walletId,
      currencyCode: userWallet.currencyCode,
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
      data: { activityType: USER_ACTIVITIES_TYPE.BOOST_BONUS, userId: userId, uniqueId: uuid() },
      transaction: sequelizeTransaction
    })
  } catch (error) {
    Logger.info(`Error in Award Boost Bonus - ${JSON.stringify(error)}`)
    return 'InternalServerErrorType'
  }
}
