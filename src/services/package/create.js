import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import config from '../../configs/app.config'
import { uploadFile } from '../../utils/common'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    userType: { type: 'string' },
    amount: {
      type: 'string',
      maxLength: 10,
      minLength: 1
    },
    gcCoin: {
      type: 'string'
    },
    startDate: {
      type: ['string', 'null'],
      pattern:
        '^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\\d\\d$$'
    },
    scCoin: {
      type: 'string'
    },
    vipPoints: {
      type: 'string'
    },
    previousAmount: { type: ['string', 'null'] },
    currency: { type: 'string' },
    isActive: { type: 'string' },
    packageType: { type: 'string' },
    isVisibleInStore: { type: 'string' },
    image: { type: 'object' },
    validTill: { type: 'string' },
    showPackageType: { type: 'string', enum: ['true', 'false'] },
    newPackageType: { type: 'string', enum: ['true', 'false'] },
    bonusId: {
      type: 'string'
    },
    firstPurchaseApplicable: { type: 'string', enum: ['true', 'false'] }
  },
  required: [
    'amount',
    'gcCoin',
    'scCoin',
    'isActive',
    'packageType',
    'isVisibleInStore',
    'newPackageType',
    'validTill',
    'showPackageType'
  ]
}

const constraints = ajv.compile(schema)

export class CreatePackage extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      amount,
      gcCoin,
      scCoin,
      currency = 'USD',
      isActive,
      packageType,
      isVisibleInStore,
      image,
      newPackageType,
      validTill,
      showPackageType,
      previousAmount,
      bonusId,
      vipPoints,
      firstPurchaseApplicable
    } = this.args
    let fileName, gCoin, sCoin
    const transaction = this.context.sequelizeTransaction

    try {
      const floatValues = /[+-]?([0-9]*[.])?[0-9]+/
      if (amount.match(floatValues) && isNaN(amount)) {
        return this.addError('AmountInvalidErrorType')
      }

      if (!(+amount >= 0)) {
        return this.addError('InvalidAmountErrorType')
      }

      gCoin = +gcCoin
      sCoin = +scCoin
      if (
        !(+gCoin >= 0) ||
        !(+sCoin >= 0) ||
        !Number.isInteger(gCoin) ||
        !Number.isInteger(sCoin)
      ) {
        return this.addError('InvalidCoinAmountErrorType')
      }

      const checkPackageExist = await getOne({
        model: db.package,
        data: { amount },
        transaction
      })
      if (
        checkPackageExist &&
        parseFloat(checkPackageExist.amount) === parseFloat(amount) &&
        parseFloat(checkPackageExist.scCoin) === parseFloat(scCoin) &&
        parseFloat(checkPackageExist.gcCoin) === parseFloat(gcCoin)
      ) {
        return this.addError('PackageAlreadyExistErrorType')
      }

      let newPackage = {
        amount,
        gcCoin,
        scCoin,
        currency,
        isActive,
        validTill,
        isVisibleInStore,
        showPackageType,
        packageType,
        bonusId,
        vipPoints,
        firstPurchaseApplicable
      }

      if (previousAmount) {
        if (parseFloat(previousAmount) < parseFloat(amount)) { return this.addError('PreviousAmountErrorType') }

        newPackage = { ...newPackage, previousAmount }
      }

      const createPackage = await createNewEntity({
        model: db.package,
        data: newPackage,
        transaction
      })

      if (image && typeof image === 'object') {
        fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.PACKAGE}/${
          createPackage.packageId
        }-${Date.now()}.${image.mimetype.split('/')[1]}`
        await uploadFile(image, fileName)
      }

      await updateEntity({
        model: db.package,
        values: { packageId: createPackage.packageId },
        data: { imageUrl: fileName },
        transaction
      })

      createPackage.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${fileName}`

      if (JSON.parse(newPackageType)) {
        const packageTypes = await getOne({
          model: db.GlobalSetting,
          data: { key: 'PACKAGE_TYPES' },
          transaction
        })
        const packageList = JSON.parse(packageTypes.value)
        packageList.push(packageType)

        packageTypes.value = JSON.stringify(packageList)
        await packageTypes.save({ transaction })
      }

      return { createPackage, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
