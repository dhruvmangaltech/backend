import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import {
  AMOUNT_TYPE,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WALLET_OPERATION_TYPE
} from '../../utils/constants/constant'
import { getOne } from '../../utils/crud'
import db from '../../db/models'
import WalletEmitter from '../../socket-resources/emmitter/wallet.emmitter'
import { activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    remarks: { type: 'string' },
    coinType: { type: 'string' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    operationType: { type: 'number' }
  },
  required: ['user', 'userId', 'coinType', 'operationType', 'remarks']
}
const constraints = ajv.compile(schema)

export class AddRemoveBalanceService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { user, userId, coinType, operationType, gcAmount, scAmount, remarks } = this.args
    // const { user, userId, coinType, operationType, gcAmount, scAmount, remarks, rscAmount } = this.args

    try {
      const userDetails = await db.User.findByPk(userId, { attributes: ['userId', 'firstName', 'lastName', 'email', 'countryCode', 'parentId'], transaction })
      if (!userDetails) return this.addError('UserNotExistsErrorType')

      const userWallet = await db.Wallet.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: db.Wallet },
        transaction
      })

      userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: db.Wallet }, transaction })

      const initialAmount = coinType === 'gc' ? userWallet.gcCoin : userWallet.totalScCoin
      const beforeBalance = { gcCoin: userWallet.gcCoin, scCoin: userWallet.scCoin }

      let name = userDetails.firstName
      if (userDetails.lastName) name = name + ' ' + userDetails.lastName

      const userCountry = await getOne({ model: db.Country, data: { countryId: userDetails?.countryCode }, attributes: ['code'], raw: true, transaction })

      let transactionDetails = {
        actioneeType: ROLE.ADMIN,
        actioneeId: userDetails?.userId,
        actioneeEmail: userDetails?.email,
        actioneeName: name,
        walletId: userWallet?.walletId,
        amount: 0,
        currencyCode: userWallet?.currencyCode || 'USD',
        countryCode: userCountry?.code || 'US',
        beforeBalance: beforeBalance,
        primaryCurrencyAmount: 0,
        adminId: userDetails?.parentId,
        isFirstDeposit: false,
        status: TRANSACTION_STATUS.SUCCESS,
        transactionDateTime: new Date().toISOString(),
        isSuccess: true,
        transaction,
        moreDetails: {
          remarks: remarks,
          adminUserId: user?.adminUserId,
          coinType
        }
      }

      if (operationType === WALLET_OPERATION_TYPE.ADD) {
        if (coinType === 'gc') {
          userWallet.gcCoin = parseFloat((userWallet.gcCoin + gcAmount).toFixed(2))

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.GC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_GC,
              gcCoin: gcAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'sc') {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            psc: +parseFloat(+userWallet.scCoin.psc + +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'both') {
          userWallet.gcCoin = parseFloat((userWallet.gcCoin + gcAmount).toFixed(2))
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            psc: +parseFloat(+userWallet.scCoin.psc + +scAmount).toFixed(2),
            // wsc: +parseFloat(+userWallet.scCoin.wsc + +rscAmount).toFixed(2),
            wsc: +userWallet.scCoin.wsc
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.GC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_GC,
              gcCoin: gcAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            },
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'wsc') {
            // Add logic for adding to wsc
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: parseFloat((+userWallet.scCoin.wsc + +scAmount).toFixed(2))
            }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: operationType === WALLET_OPERATION_TYPE.ADD
                ? TRANSACTION_TYPE.ADD_SC
                : TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        }else if (coinType === 'bsc') {
         
            userWallet.scCoin = {
              ...userWallet.scCoin,
              bsc: parseFloat((+userWallet.scCoin.bsc + +scAmount).toFixed(2)) // Add to bsc
            }
        
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: operationType === WALLET_OPERATION_TYPE.ADD
                ? TRANSACTION_TYPE.ADD_SC
                : TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        }    
        else if (coinType === 'psc') {
         
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: parseFloat((+userWallet.scCoin.psc + +scAmount).toFixed(2)) // Add to psc
            }
       
        
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: operationType === WALLET_OPERATION_TYPE.ADD
                ? TRANSACTION_TYPE.ADD_SC
                : TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        }
      } else {
        if (coinType === 'gc') {
          if (+gcAmount > +userWallet.gcCoin) return this.addError('InsufficientGcBalanceError')
          userWallet.gcCoin = parseFloat((+userWallet.gcCoin - +gcAmount).toFixed(2))

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.GC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_GC,
              gcCoin: gcAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'psc') {
          if (+scAmount > +userWallet.scCoin.psc) return this.addError('InsufficientScBalanceError')

          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            psc: +parseFloat(+userWallet.scCoin.psc - +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'bsc') {
          if (+scAmount > +userWallet.scCoin.bsc) return this.addError('InsufficientScBalanceError')

          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +parseFloat(+userWallet.scCoin.bsc - +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'wsc') {
          if (+scAmount > +userWallet.scCoin.wsc) return this.addError('InsufficientScBalanceError')

          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            wsc: +parseFloat(+userWallet.scCoin.wsc - +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
          // if (+gcAmount > +userWallet.gcCoin) return this.addError('InsufficientGcBalanceError')
          // if (+scAmount > +userWallet.scCoin.psc) return this.addError('InsufficientScBalanceError')

          // userWallet.gcCoin = parseFloat((+userWallet.gcCoin - +gcAmount).toFixed(2))
          // userWallet.scCoin = {
          //   ...userWallet.scCoin,
          //   bsc: +userWallet.scCoin.bsc,
          //   psc: +parseFloat(+userWallet.scCoin.psc - +scAmount).toFixed(2),
          //   wsc: +userWallet.scCoin.wsc
          //   // wsc: +parseFloat(+userWallet.scCoin.wsc - +rscAmount).toFixed(2)
          // }

          // transactionDetails = [
          //   {
          //     ...transactionDetails,
          //     amountType: AMOUNT_TYPE.GC_COIN,
          //     transactionType: TRANSACTION_TYPE.REMOVE_GC,
          //     gcCoin: gcAmount,
          //     afterBalance: {
          //       gcCoin: userWallet.gcCoin,
          //       scCoin: userWallet.scCoin
          //     }
          //   },
          //   {
          //     ...transactionDetails,
          //     amountType: AMOUNT_TYPE.SC_COIN,
          //     transactionType: TRANSACTION_TYPE.REMOVE_SC,
          //     scCoin: scAmount,
          //     afterBalance: {
          //       gcCoin: userWallet.gcCoin,
          //       scCoin: userWallet.scCoin
          //     }
          //   }
          //   // {
          //   //   ...transactionDetails,
          //   //   amountType: AMOUNT_TYPE.SC_COIN,
          //   //   transactionType: TRANSACTION_TYPE.REMOVE_WSC,
          //   //   scCoin: rscAmount,
          //   //   afterBalance: {
          //   //     gcCoin: userWallet.gcCoin,
          //   //     scCoin: userWallet.scCoin
          //   //   }
          //   // }
          // ]
        }
        
      }
      
      
      await db.TransactionBanking.bulkCreate(transactionDetails, { transaction })
      await userWallet.save({ transaction })

      const updatedAmount = coinType === 'gc' ? userWallet.gcCoin : userWallet.totalScCoin
      const moreDetails = { tab: 'Players', coinType }

      if (coinType === 'both') {
        await Promise.all([
          activityLog({
            user,
            userId,
            fieldChanged: 'GC Amount',
            originalValue:
              operationType === WALLET_OPERATION_TYPE.ADD
                ? +userWallet.gcCoin - +gcAmount
                : +userWallet.gcCoin + +gcAmount,
            changedValue: userWallet.gcCoin,
            remark: remarks,
            transaction,
            moreDetails
          }),
          activityLog({
            user,
            userId,
            fieldChanged: 'SC Amount',
            originalValue: operationType === WALLET_OPERATION_TYPE.ADD ? +userWallet.totalScCoin - +scAmount : +userWallet.totalScCoin + +scAmount,
            changedValue: userWallet.totalScCoin,
            remark: remarks,
            transaction,
            moreDetails
          })
        ])
      } else {
        await activityLog({
          user,
          userId,
          fieldChanged: `${coinType.toUpperCase()} Amount`,
          originalValue: initialAmount,
          changedValue: updatedAmount,
          remark: remarks,
          moreDetails
        })
      }

      WalletEmitter.emitUserWalletBalance(
        {
          scCoin: (
            Math.round(
              (+userWallet.scCoin?.psc +
                +userWallet.scCoin?.bsc +
                +userWallet.scCoin?.wsc) *
              100
            ) / 100
          ).toFixed(2),
          gcCoin: userWallet.gcCoin
        },
        userDetails.userId
      )

      if (operationType === WALLET_OPERATION_TYPE.ADD) return { success: true, message: SUCCESS_MSG.DEPOSIT_SUCCESS }
      else return { success: true, message: SUCCESS_MSG.WITHDRAW_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
