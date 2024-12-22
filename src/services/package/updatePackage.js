import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'
import config from '../../configs/app.config'
import { uploadFile } from '../../utils/common'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'
const schema = {
  type: 'object',
  properties: {
    userType: { type: 'string' },
    packageId: { type: 'string' },
    amount: {
      type: 'string',
      maxLength: 10,
      minLength: 1
    },
    gcCoin: {
      type: 'string'
    },
    scCoin: {
      type: 'string'
    },
    image: { type: 'object' },
    isActive: { type: 'string' },
    validTill: { type: 'string' },
    packageType: { type: 'string' },
    isVisibleInStore: { type: 'string' },
    previousAmount: { type: ['string', 'null'] },
    showPackageType: { type: 'string', enum: ['true', 'false'] },
    newPackageType: { type: 'string', enum: ['true', 'false'] },
    bonusId: { type: 'string' },
    vipPoints: { type: 'string' },
    firstPurchaseApplicable: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['packageId', 'amount', 'gcCoin', 'scCoin', 'isActive', 'packageType', 'isVisibleInStore', 'newPackageType', 'validTill', 'showPackageType']
}
const constraints = ajv.compile(schema)

export class UpdatePackage extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { packageId, amount, gcCoin, scCoin, isActive, packageType, isVisibleInStore, image, newPackageType, validTill, showPackageType, previousAmount, bonusId, vipPoints, firstPurchaseApplicable } = this.args
    let fileName
    const transaction = this.context.sequelizeTransaction

    try {
      const floatValues = '/[+-]?([0-9]*[.])?[0-9]+/'
      if (amount.match(floatValues) && isNaN(amount)) {
        return this.addError('AmountInvalidErrorType')
      }

      const query = { packageId }

      const checkPackageExist = await getOne({
        model: db.package,
        data: query,
        include: [{ model: db.PackageUsers, attributes: ['userId'] }],
        transaction
      })

      if (!checkPackageExist) return this.addError('AdminNotFoundErrorType')

      if (checkPackageExist && ((parseFloat(checkPackageExist.amount) !== parseFloat(amount)) || (parseFloat(checkPackageExist.scCoin) !== parseFloat(scCoin)) || (parseFloat(checkPackageExist.gcCoin) !== parseFloat(gcCoin)))) {
        const checkPackageExist = await getOne({ model: db.package, data: { amount }, transaction })
        if (checkPackageExist && (parseFloat(checkPackageExist.amount) === parseFloat(amount)) && (parseFloat(checkPackageExist.scCoin) === parseFloat(scCoin)) && (parseFloat(checkPackageExist.gcCoin) === parseFloat(gcCoin))) {
          return this.addError('PackageAlreadyExistErrorType')
        }
      }

      let updatedArray
      updatedArray = { amount, gcCoin, scCoin, isActive, isVisibleInStore, validTill, showPackageType, packageType, bonusId, vipPoints, firstPurchaseApplicable }

      if (previousAmount) {
        if (parseFloat(previousAmount) < parseFloat(amount)) return this.addError('PreviousAmountErrorType')

        updatedArray = { ...updatedArray, previousAmount }
      }

      if (checkPackageExist && checkPackageExist.PackageUsers.length) updatedArray = { packageType, isVisibleInStore }

      if (image && typeof (image) === 'object') {
        fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.PACKAGE}/${packageId}-${Date.now()}.${image.mimetype.split('/')[1]}`

        await uploadFile(image, fileName)
        updatedArray.imageUrl = fileName
      }
      const updatedPackage = await updateEntity({
        model: db.package,
        values: { packageId },
        data: updatedArray,
        transaction
      })

      if (JSON.parse(newPackageType)) {
        const packageTypes = await getOne({ model: db.GlobalSetting, data: { key: 'PACKAGE_TYPES' }, transaction })
        const packageList = JSON.parse(packageTypes.value)
        packageList.push(packageType)

        packageTypes.value = JSON.stringify(packageList)
        await packageTypes.save({ transaction })
      }

      return { updatedPackage, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
