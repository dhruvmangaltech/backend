import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ACTION_TYPE, BONUS_STATUS, BONUS_TYPE, LOGICAL_ENTITY, POSTAL_CODE_STATUS, USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'
import { readCsvFile, uploadFile } from '../../utils/common'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import config from '../../configs/app.config'
import { Op } from 'sequelize'
import WalletEmitter from '../../socket-resources/emmitter/wallet.emmitter'
import Logger from '../../libs/logger'

export class UploadPostalCodeService extends ServiceBase {
  async run () {
    const {
      req: {
        file: csvFile
      },
      dbModels: {
        User: UserModel,
        PostalCode: PostalCodeModel,
        PostalCodeCsv: PostalCodeCsvModel,
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel,
        UserBonus: UserBonusModel,
        Bonus: BonusModel,
        UserActivities: UserActivitiesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const usersObj = {}

    if (!csvFile) {
      return this.addError('FileNotFoundErrorType')
    }
    // if (csvFile && csvFile.size > UPLOAD_FILE_SIZE) {
    //   return this.addError('FileSizeTooLargeErrorType')
    // }

    if (csvFile && csvFile.mimetype) {
      const fileType = csvFile.mimetype.split('/')[1]
      if (fileType !== 'csv') {
        return 'FileTypeNotSupportedErrorType'
      }
    }

    const { csvData, isSuccess } = await readCsvFile(csvFile)

    if (!isSuccess || !csvData) {
      return this.addError('CsvFileErrorType')
    }

    const headers = csvData[0]
    const values = csvData.slice(1)
    let successCount = 0
    let failedCount = 0

    const mappedData = values.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })

    const bonusData = await getOne({
      model: BonusModel,
      data: {
        isActive: true,
        bonusType: BONUS_TYPE.POSTAL_CODE_BONUS
      },
      transaction
    })

    if (!bonusData) {
      return this.addError('PostalBonusErrorType')
    }

    const createdCsv = await createNewEntity({ model: PostalCodeCsvModel, data: { name: csvFile.mimetype.split('/')[1], successCount, failedCount, userName: this.context?.req?.user?.detail?.dataValues?.adminUsername }, transaction })

    const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.POSTAL_CSV}/${createdCsv.csvId}-${Date.now()}.${csvFile.mimetype.split('/')[1]}`
    await uploadFile(csvFile, fileName)

    for (const mapData of mappedData) {
      try {
        if (mapData?.userName) {
          let userData = {}
          if (usersObj[mapData?.userName]) {
            userData = usersObj[mapData?.userName]
          } else {
            userData = await getOne({
              model: UserModel,
              data: {
                username: mapData?.userName
              },
              attributes: ['userId', 'email', 'username'],
              raw: true,
              transaction
            })
            usersObj[userData?.username] = userData || {}
          }

          const isCodeValid = await getOne({
            model: PostalCodeModel,
            data: {
              userId: userData?.userId,
              postalCode: mapData?.code,
              isClaimed: false,
              validTo: { [Op.gte]: new Date() }
            },
            attributes: ['postalCodeId', 'createdAt'],
            raw: true,
            transaction
          })

          if (isCodeValid) {
            const userWallet = await WalletModel.findOne({
              where: { ownerId: userData.userId },
              lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
              transaction
            })
            userWallet.reload({
              lock: {
                level: transaction.LOCK.UPDATE,
                of: WalletModel
              },
              transaction
            })

            userWallet.gcCoin = +((+userWallet.gcCoin + (+bonusData?.gcAmount || 0)).toFixed(2))
            userWallet.scCoin = { ...userWallet.scCoin, bsc: +((+userWallet.scCoin.bsc + (+bonusData?.scAmount || 0)).toFixed(2)) }
            await userWallet.save({ transaction })

            const userBonusObj = {
              bonusId: bonusData.bonusId,
              userId: userData.userId,
              bonusType: BONUS_TYPE.POSTAL_CODE_BONUS,
              scAmount: bonusData.scAmount,
              gcAmount: bonusData.gcAmount,
              status: BONUS_STATUS.CLAIMED,
              claimedAt: new Date()
            }

            const isCreated = await createNewEntity({
              model: UserBonusModel,
              data: userBonusObj,
              transaction
            })

            const transactionObj = {
              userId: userData.userId,
              actionType: BONUS_TYPE.POSTAL_CODE_BONUS,
              actionId: ACTION_TYPE.CREDIT,
              status: ACTION_TYPE.CREDIT,
              walletId: userWallet.walletId,
              currencyCode: userWallet.currencyCode,
              userBonusId: isCreated.userBonusId,
              sc: bonusData.scAmount,
              gc: bonusData.gcAmount,
              amountType: null,
              roundId: 'NULL',
              transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`
            }

            await createNewEntity({
              model: CasinoTransactionModel,
              data: transactionObj,
              transaction
            })

            await createNewEntity({
              model: UserActivitiesModel,
              data: { activityType: USER_ACTIVITIES_TYPE.POSTAL_CODE_CLAIMED, userId: userData.userId },
              transaction
            })

            await updateEntity({
              model: PostalCodeModel,
              data: { isClaimed: true, status: POSTAL_CODE_STATUS.SUCCESS },
              values: {
                userId: userData?.userId,
                postalCode: mapData?.code
              },
              transaction
            })

            WalletEmitter.emitUserWalletBalance({
              scCoin: (Math.round((+userWallet.scCoin?.psc + +userWallet.scCoin?.bsc + +userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
              gcCoin: userWallet.gcCoin
            }, userData.userId)
            successCount = successCount + 1
          } else {
            failedCount = failedCount + 1
          }
        }
      } catch (error) {
        failedCount = failedCount + 1
        Logger.error('Error in CSV upload api', error)
      }
    }

    await updateEntity({
      model: PostalCodeCsvModel,
      values: { csvId: createdCsv.csvId },
      data: { successCount, failedCount, csvUrl: fileName },
      transaction
    })

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
