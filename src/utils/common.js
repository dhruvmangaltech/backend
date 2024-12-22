import sharp from 'sharp'
import axios from 'axios'
import AWS from 'aws-sdk'
import bcrypt from 'bcrypt'
import db from '../db/models'
import jwt from 'jsonwebtoken'
import { Op, Sequelize } from 'sequelize'
import config from '../configs/app.config'
import { getOne, getAll, createNewEntity } from './crud'
import { internationalNumberFormatter } from './elastic'
import { ADMIN_PERMISSION, OK, REGEX, ROLE, ROLE_ID, STRICTLY_REQUIRED_REGISTRATION_FIELDS, UPLOAD_FILE_SIZE } from './constants/constant'
import CryptoJS from 'crypto-js'
import encode from 'crypto-js/enc-hex'
import crypto from 'crypto'
import { s3 } from '../libs/aws-s3'
import { parse } from 'csv-parse/sync'
import Logger from '../libs/logger'
import { encode as encrypt } from 'hi-base32'
import { Parser } from 'json2csv'

export const comparePassword = async (password, userPassword) => {
  if (!password) {
    return false
  }

  const result = await bcrypt.compare(Buffer.from(password, 'base64').toString('ascii'),
    userPassword)

  return result
}

export const signAccessToken = async ({ name, email, id, role }) => {
  const payload = { email, id, name, role }

  const jwtToken = jwt.sign(payload,
    config.get('jwt.loginTokenSecret'),
    { expiresIn: config.get('jwt.loginTokenExpiry') }
  )

  return jwtToken
}

export const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10)

  return (bcrypt.hashSync(Buffer.from(password, 'base64').toString('ascii'), salt))
}

export const filterByNameEmail = (query, search, model) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      Sequelize.where(Sequelize.fn('concat', Sequelize.col(`${model}.first_name`), ' ', Sequelize.col(`${model}.last_name`)), {
        [Op.iLike]: `%${search}%`
      }),
      { email: { [Op.iLike]: `%${search}%` } }]
  }

  return query
}

export const filterByTitleSlugContent = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } },
      { slug: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } }]
  }

  return query
}

export const filterByName = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }]
  }
  return query
}

export const filterByEmailName = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }]
  }
  return query
}

export const filterByDate = (query, startDate = null, endDate = null, modelName) => {
  endDate = endDate || Date.now()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.updated_at`)), '>=', new Date(startDate)),
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.updated_at`)), '<=', new Date(endDate))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.updated_at`)), '<=', new Date(endDate))
      ]
    }
  }

  return query
}

export const filterByDateCreatedAt = (query, startDate = null, endDate = null, modelName) => {
  endDate = endDate || Date.now()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '>=', new Date(startDate)),
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '<=', new Date(endDate))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '<=', new Date(endDate))
      ]
    }
  }

  return query
}

export const pageValidation = (pageNo, limit, maxSize = 200) => {
  const pageAsNumber = Number.parseInt(pageNo)
  const sizeAsNumber = Number.parseInt(limit)
  let page = 1
  let size = 15

  if ((Number.isNaN(pageAsNumber) || pageAsNumber < 0) ||
    (Number.isNaN(sizeAsNumber) || sizeAsNumber < 0 || sizeAsNumber > maxSize)) {
    return { page, size }
  }

  size = sizeAsNumber
  page = pageAsNumber

  return { page, size }
}

export const keyFilter = (siteRegistration, user) => {
  const keysArray = Object.keys(siteRegistration.dataValues).filter(key => siteRegistration[key] === 2 || siteRegistration[key] === 1)

  Object.keys(user).forEach(function (key) {
    if (!(keysArray.includes(key))) {
      delete user[key]
    }
  })

  return user
}

const s3Client = () => {
  // configuring the AWS environment
  AWS.config.update({
    region: config.get('s3.region')
  })

  return new AWS.S3()
}

function LightenDarkenColor (hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '')
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  lum = lum || 0

  // convert to decimal and change luminosity
  let rgb = '#'
  let c
  let i

  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16)
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
    rgb += ('00' + c).substr(c.length)
  }

  return rgb
}

const lightColor = (color, value) => {
  for (let i = 0; i <= 1; i = i + 0.3) {
    const colorVariation = i.toFixed(1)
    const newColor = LightenDarkenColor(color, colorVariation)
    value[`light_${colorVariation * 100}`] = newColor
  }

  return value
}

const darkColor = (color, value) => {
  for (let i = 0; i <= 1; i = i + 0.3) {
    const colorVariation = i.toFixed(1)
    const newColor = LightenDarkenColor(color, (colorVariation * -1))
    value[`dark_${colorVariation * 100}`] = newColor
  }

  return value
}

export const themeAttributes = (mode, primaryColor, secondaryColor) => {
  mode = mode.toLowerCase()

  let primary = { main: primaryColor }
  primary = { ...primary, ...darkColor(primaryColor, primary) }
  primary = { ...primary, ...lightColor(secondaryColor, primary) }

  let secondary = { main: secondaryColor }
  secondary = { ...secondary, ...darkColor(secondaryColor, secondary) }
  secondary = { ...secondary, ...lightColor(secondaryColor, secondary) }

  return { palette: { mode, primary, secondary } }
}

export const validateFile = (res, file) => {
  if (!file) {
    return 'FileNotFoundErrorType'
  }
  if (file && file.size > UPLOAD_FILE_SIZE) {
    return 'FileSizeTooLargeErrorType'
  }

  if (file && file.mimetype) {
    const fileType = file.mimetype.split('/')[1]
    const supportedFileType = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'pdf', 'webp']

    if (!supportedFileType.includes(fileType)) {
      return 'FileTypeNotSupportedErrorType'
    }
  }

  return OK
}

export const validateIconFile = (res, file) => {
  if (!file) {
    return 'FileNotFoundErrorType'
  }
  if (file && file.size > UPLOAD_FILE_SIZE) {
    return 'FileSizeTooLargeErrorType'
  }

  if (file && file.mimetype) {
    const fileType = file.mimetype.split('/')[1]
    const supportedFileType = ['svg+xml']

    if (!supportedFileType.includes(fileType)) {
      return 'FileTypeNotSupportedErrorType'
    }
  }

  return OK
}


export const uploadFile = (file, filename, key = undefined) => {
  filename = filename.split(' ').join('')

  const bucketParams = {
    Bucket: config.get('s3.bucket'),
    Key: filename,
    Body: file?.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype
  }

  if (key) {
    const deleteParams = {
      Bucket: config.get('s3.bucket'),
      Key: key
    }
    s3Client().deleteObject(deleteParams).promise()
  }

  const s3File = s3.upload(bucketParams).promise()
  return s3File
}

export const getKey = (fileName) => {
  const key = fileName.split('amazonaws.com/')[1]
  return key
}

export const dimensionCheck = async (image, height, width) => {
  const size = await sharp(image.buffer).metadata()
  if (height !== size.height && width !== size.width) {
    return false
  }
  return OK
}

export const removeItems = (array, itemsToRemove) => {
  return array.filter(v => {
    return !itemsToRemove.includes(v)
  })
}

export const encodeCredential = (key, encryptKey) => {
  if (!encryptKey) encryptKey = config.get('credentialEncryptionKey')

  return CryptoJS.AES.encrypt(key, encryptKey).toString()
}

export const decodeCredential = (data, object = false) => {
  if (!object) return CryptoJS.AES.decrypt(data, config.get('credentialEncryptionKey')).toString(CryptoJS.enc.Utf8)

  const credentials = []

  data.forEach((credential) => {
    credential.value = CryptoJS.AES.decrypt(credential.value, config.get('credentialEncryptionKey')).toString(CryptoJS.enc.Utf8)
    credentials.push(credential)
  })

  return credentials
}

export const decodeInformation = (data, object = false) => {
  return CryptoJS.AES.decrypt(data, config.get('jwt.secretKey')).toString(CryptoJS.enc.Utf8)
}

export const filterByNameDomain = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } },
      { domain: { [Op.iLike]: `%${search}%` } }]
  }
  return query
}

export const getGlobalRegistration = async (Registration) => {
  let globalRegistration = await getOne({
    model: db.GlobalSetting,
    data: { key: 'GLOBAL_REGISTRATION' },
    raw: true,
    attributes: ['value']
  })
  globalRegistration = JSON.parse(globalRegistration.value)

  const disable = []
  Object.keys(Registration.dataValues).forEach((key) => {
    if (globalRegistration[key] === 2) {
      Registration.dataValues[key] = 2
      disable.push(key)
    }
  })

  Registration.dataValues.disable = [...new Set(disable.concat(STRICTLY_REQUIRED_REGISTRATION_FIELDS))]

  return Registration
}

export const getPrimaryCurrencyAmount = async ({ currencyCode, amount }) => {
  const primaryCurrency = await getOne({ model: db.Currency, data: { isPrimary: true } })

  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ['exchangeRate']
  })

  const conversionRate = parseFloat(sourceExchangeRate.exchangeRate) / primaryCurrency.exchangeRate
  amount = Math.abs((amount * conversionRate).toFixed(2))
  return { amount, conversionRate }
}

export const topPlayerResponse = (data) => {
  const response = []
  data.forEach(object => {
    const newData = {}
    Object.keys(object).forEach(key => {
      newData[key.split('.')[key.split('.').length - 1]] = object[key]
      if (key.split('.')[key.split('.').length - 1] === 'amount' || key.split('.')[key.split('.').length - 1] === 'depositAmount') {
        newData[key.split('.')[key.split('.').length - 1]] = internationalNumberFormatter(object[key])
      }
    })
    response.push(newData)
  })
  return response
}

export const getOtherCurrenciesAmount = async ({ amount, primary, currencyCode }) => {
  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ['exchangeRate'],
    raw: true
  })

  if (primary) {
    const primaryCurrency = await getOne({ model: db.Currency, data: { isPrimary: true }, raw: true })
    const conversionRate = parseFloat(sourceExchangeRate.exchangeRate) / primaryCurrency.exchangeRate
    amount = Math.abs((amount * conversionRate).toFixed(2))
    return { amount, conversionRate }
  }

  const targetCurrencies = await getAll({
    model: db.Currency,
    raw: true
  })

  const amountInOtherCurrencies = {}

  targetCurrencies.forEach(currency => {
    const conversionRate = parseFloat(sourceExchangeRate.exchangeRate) / currency.exchangeRate
    amountInOtherCurrencies[currency.code] = Math.abs((amount * conversionRate).toFixed(2))
  })

  return amountInOtherCurrencies
}

export const setLoyaltySequence = (levels) => {
  const returnList = []
  levels.forEach(level => {
    returnList.push({
      level: level.level,
      startPoint: level.startPoint,
      endPoint: level.endPoint,
      cashback_multiplier: level.cashback_multiplier
    })
  })
  return returnList
}

export const getGameAggregatorAndProvider = async ({ game }) => {
  const gameData = await db.MasterCasinoGame.findOne({
    where: { identifier: game },
    attributes: [],
    include: [{
      model: db.MasterCasinoProvider,
      attributes: ['name', 'masterCasinoProviderId'],
      include: [{
        model: db.MasterGameAggregator,
        attributes: ['name']
      }]
    }],
    raw: true
  })
  return { aggregator: gameData['MasterCasinoProvider.MasterGameAggregator.name'], provider: gameData['MasterCasinoProvider.name'], providerId: gameData['MasterCasinoProvider.masterCasinoProviderId'] }
}

export const filterByNameEmailGroup = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
      [Op.iLike]: `%${search}%`
    }),
    { email: { [Op.iLike]: `%${search}%` } },
    { group: { [Op.iLike]: `%${search}%` } }]

  }
  return query
}

export const filterBySearchGroup = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [Sequelize.where(Sequelize.fn('concat', Sequelize.col('amount'), ' ', Sequelize.col('gc_coin'), ' ', Sequelize.col('sc_coin')), {
      [Op.iLike]: `%${search}%`
    }),
    { currency: { [Op.iLike]: `%${search}%` } }]

  }
  return query
}

export const getLiabilityQuery = ({ adminId }) => {
  let returnQuery

  const upperQuery = `
  SELECT ROUND(cast(sum(wallet.amount) as numeric),2) as liability, my_user.currency_code as "currencyCode" from public.users as my_user
  JOIN public.wallets as wallet on wallet.owner_id = my_user.user_id AND wallet.owner_type = 'user'
  `

  const lowerQuery = `
  GROUP BY my_user.currency_code
  `

  let middleQuery

  if (adminId) {
    if (!middleQuery) middleQuery = `WHERE my_user.parent_id = ${adminId} AND my_user.parent_type = ${ROLE.ADMIN} `
    if (middleQuery) middleQuery += ` AND my_user.parent_id = ${adminId} AND my_user.parent_type = ${ROLE.ADMIN}  `
    returnQuery = upperQuery + middleQuery + lowerQuery
  } else {
    if (middleQuery) returnQuery = upperQuery + middleQuery + lowerQuery
    else returnQuery = upperQuery + lowerQuery
  }

  return returnQuery
}

export const removeByAttr = (arr, attr, value) => {
  let index = arr.length
  while (index--) {
    if (arr[index] && arr[index][attr] === value) {
      arr.splice(index, 1)
    }
  }
  return arr
}

export const removeLogo = (key) => {
  const deleteParams = {
    Bucket: config.get('s3.bucket'),
    Key: key
  }

  s3.deleteObject(deleteParams).promise()
}

export const getAllPortalUserIds = async (email) => {
  const userIds = []

  const accounts = await getAll({
    model: db.User,
    data: { email },
    attributes: ['userId'],
    raw: true
  })

  for (const user of accounts) {
    userIds.push(user.userId)
  }

  return userIds
}

export const getDetails = async ({ currency, country }) => {
  let currencyId, countryName

  if (currency) {
    const details = await getOne({ model: db.Currency, data: { code: currency }, attributes: ['currencyId'] })
    currencyId = details.currencyId
  }

  if (country) {
    const details = await getOne({ model: db.Country, data: { code: country }, attributes: ['name'] })
    countryName = details.name
  }

  return { currencyId, countryName }
}

export const getUserDetails = async (userId) => {
  const userDetails = await getOne({
    model: db.User,
    data: { userId },
    include: [
      { model: db.Wallet, as: 'userWallet' }
    ]
  })

  return userDetails
}

export const secureData = ({ data, key }) => {
  return CryptoJS.HmacMD5(data, key).toString(encode)
}

export const filterByLanguageName = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ languageName: { [Op.iLike]: `%${search}%` } }]
  }
  return query
}

export const errorResponse = ({ name, message, StatusCodes, errorCode }) => {
  const response = {
    name,
    statusCode: StatusCodes,
    isOperational: true,
    description: message,
    errorCode
  }
  return response
}
export const jobScheduler = async (emailTemplateId) => {
  try {
    const updateURL = `${config.get('jobSchedulerAddress')}api/v1/job`
    const configPara = {
      method: 'post',
      url: updateURL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        emailTemplateId: +(emailTemplateId)
      })
    }

    const response = await axios(configPara)
      .then(function (response) {
        console.log('API Job Schedule response ', response)
      })
      .catch(function (error) {
        console.log('API Job Schedule Error ', error)
        throw new Error('API Job Schedule Error ')
      })
    return !!(response.data.data.success)
  } catch (error) {
    console.log('API Job Schedule Error catch block', error)
    return false
  }
}

export const getElasticURL = () => {
  return process.env.ELASTIC_PROTOCALL + process.env.ELASTIC_USER + ':' + process.env.ELASTIC_PASSWORD + '@' + process.env.ELASTIC_URL
}

export const formatDate = (date) => {
  return (
    [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      (date.getDate()).toString().padStart(2, '0')
    ].join('') +
    '' +
    [
      (date.getUTCHours()).toString().padStart(2, '0'),
      (date.getUTCMinutes()).toString().padStart(2, '0'),
      (date.getUTCSeconds()).toString().padStart(2, '0')
    ].join('')
  )
}

export const userWalletUpdate = async () => {
  await db.Wallet.update({ scCoin: { psc: 0, bsc: 0, wsc: 0 } }, { where: { wallet_id: { [Op.not]: null } } })
}

export const updateSuperAdminPermissions = async () => {
  await db.AdminUserPermission.update({ permission: ADMIN_PERMISSION }, { where: { adminUserId: await getSuperAdminId() } })
}

export const removeState = async () => {
  const stateIds = (await getAll({
    model: db.State,
    data: { stateCode: { [Op.in]: ['AR', 'GU', 'PR', 'MP', 'VI', 'UM-79', 'UM-67', 'UM-71', 'UM-86', 'UM-89', 'UM-81', 'UM-84', 'UM-76', 'UM-95', 'UM', 'DC'] } },
    attributes: ['stateId']
  })).map((obj) => { return obj.stateId })

  await db.City.destroy({ where: { stateId: { [Op.in]: stateIds } } })
}

export const convertStringToLowercaseWithDash = async (str) => {
  return str.toLowerCase().replace(/ /g, '-')
}

export const readCsvFile = async (csvFile) => {
  let csvData
  let isSuccess = false
  try {
    csvData = await parse(csvFile?.buffer)
    isSuccess = true
  } catch (error) {
    console.log('Csv File reader Error   ', error)
  }
  return { csvData, isSuccess }
}

export const validatePassword = (password) => {
  return Buffer.from(password, 'base64').toString('utf-8').match(REGEX.PASSWORD)
}

export const getCurrentISOString = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
  const offsetMinutes = now.getTimezoneOffset()
  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60))
  const offsetMinutesRemainder = Math.abs(offsetMinutes % 60)
  const offsetSign = offsetMinutes > 0 ? '-' : '+'

  const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutesRemainder).padStart(2, '0')}`

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`
}

export const createSignature = ({ payload }) => {
  try {
    Logger.info(`--------------Signature for Veriff------- ${payload}-----`)
    const signature = crypto.createHmac('sha256', `${config.get('kycVerification.veriffSecretKey')}`).update(payload).digest('hex')

    return signature
  } catch (error) {
    Logger.error(`Error while creating signature ${JSON.stringify(error)}`)
    return false
  }
}

export const activityLog = async ({ user, userId, originalValue, changedValue, remark, moreDetails, fieldChanged, favorite, transaction }) => {
  await createNewEntity({
    model: db.ActivityLog,
    data: {
      actioneeId: user?.userId || user?.adminUserId,
      actioneeType: (user?.userId) ? ROLE.USER : ROLE.ADMIN,
      remark,
      fieldChanged,
      originalValue,
      changedValue,
      userId,
      moreDetails: { ...moreDetails, favorite: favorite || false }
    },
    transaction
  })
}

export const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15)
  const base32 = encrypt(buffer).replace(/=/g, '').substring(0, 24)
  return base32
}

export const getSuperAdminId = async () => {
  const admin = await getOne({
    attributes: ['adminUserId'],
    model: db.AdminUser,
    data: { roleId: ROLE_ID.ADMIN }
  })

  return admin.adminUserId
}

export const convertToCsv = ({ fields, data }) => {
  const json2csv = new Parser({ fields })
  const csv = json2csv.parse(data)
  return csv
}

export const getCsvFileName = ({ file, date }) => {
  let fileName = date
    ? `${file}_${new Date(date).toISOString().substring(0, 10)}`
    : `${file}_${new Date().toISOString().substring(0, 10)}`

  fileName = fileName + '.csv'
  return fileName
}
