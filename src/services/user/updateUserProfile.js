import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { getOne, updateEntity } from '../../utils/crud'
import { DOCUMENTS } from '../../utils/constants/constant'
import { Op } from 'sequelize'
import db from '../../db/models'
import { activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    firstName: { type: 'string' },
    middleName: { type: 'string' },
    lastName: { type: 'string' },
    dateOfBirth: { type: 'string' },
    gender: { type: 'string' },
    addressLine_1: { type: 'string' },
    addressLine_2: { type: ['string', 'null'] },
    city: { type: 'string' },
    state: { type: 'string' },
    country: { type: 'string' },
    zipCode: { type: 'string' },
    email: { type: 'string' },
    userName: { type: 'string' },
    phoneCode: { type: 'string' },
    phone: { type: 'string' }
  },
  required: [
    'userId', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'addressLine_1', 'city', 'state', 'country', 'zipCode',
    'email', 'userName', 'phoneCode', 'phone', 'user']
}

const constraints = ajv.compile(schema)

export class UpdateUserProfileService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, userId, firstName, lastName, middleName, dateOfBirth, gender, addressLine_1: addressLine1, addressLine_2: addressLine2, city, state, country, zipCode, email, userName, phoneCode, phone } = this.args
    const {
      dbModels: {
        UserDocument: UserDocumentModel,
        Wallet: WalletModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const userExist = await getOne({ model: db.User, data: { userId } })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      const userUpdate = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender: gender.trim(),
        addressLine_1: addressLine1.trim(),
        addressLine_2: (addressLine2) ? addressLine2.trim() : null,
        city: city.trim(),
        state: state.trim(),
        countryCode: country.trim(),
        zipCode: zipCode.trim(),
        email: email.trim(),
        username: userName.trim(),
        phoneCode: phoneCode,
        phone: phone
      }

      if (phone === '') {
        if (userExist.kycStatus === 'K3' || userExist.kycStatus === 'K4') {
          userUpdate.phoneVerified = false
        } else {
          userUpdate.phoneVerified = false
          userUpdate.kycStatus = 'K1'
        }
      }

      if (middleName) userUpdate.middleName = middleName.trim()
      if (dateOfBirth && new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() - 18)) < new Date(dateOfBirth)) {
        return this.addError('UserBelow18ErrorType')
      }
      if (dateOfBirth) userUpdate.dateOfBirth = dateOfBirth

      await updateEntity({
        model: db.User,
        values: { userId: userId },
        data: { ...userUpdate },
        transaction
      })

      const userProfile = await getOne({
        model: db.User,
        data: { userId },
        include: [
          { model: WalletModel, as: 'userWallet', attributes: ['totalScCoin', 'walletId', 'amount', 'currencyCode', 'ownerType', 'ownerId', 'non_cash_amount', 'gcCoin', 'scCoin'] },
          { model: UserDocumentModel, as: 'userDocuments', attributes: ['userDocumentId', 'documentName', 'documentUrl'], where: { documentName: { [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.ID] } }, required: false }
        ],
        transaction
      })

      if (firstName && firstName !== '' && userExist.firstName !== firstName) await activityLog({ user, userId, fieldChanged: 'first name', originalValue: userExist.firstName, changedValue: firstName, transaction })
      if (middleName && middleName !== '' && userExist.middleName !== middleName) await activityLog({ user, userId, fieldChanged: 'middle name', originalValue: userExist.middleName, changedValue: middleName, transaction })
      if (lastName && lastName !== '' && userExist.lastName !== lastName) await activityLog({ user, userId, fieldChanged: 'last name', originalValue: userExist.lastName, changedValue: lastName, transaction })
      if (gender && gender !== '' && userExist.gender !== gender) await activityLog({ user, userId, fieldChanged: 'gender', originalValue: userExist.gender, changedValue: gender, transaction })
      if (addressLine1 && addressLine1 !== '' && userExist.addressLine_1 !== addressLine1) await activityLog({ user, userId, fieldChanged: 'address line 1', originalValue: userExist.addressLine_1, changedValue: addressLine1, transaction })
      if (addressLine2 && addressLine2 !== '' && userExist.addressLine_2 !== addressLine2) await activityLog({ user, userId, fieldChanged: 'address line 2', originalValue: userExist.addressLine_2, changedValue: addressLine2, transaction })
      if (city && city !== '' && userExist.city !== city) await activityLog({ user, userId, fieldChanged: 'city', originalValue: userExist.city, changedValue: city, transaction })
      if (state && state !== '' && userExist.state !== state.toString()) {
        const originalValue = await getOne({ model: db.State, data: { stateId: userExist.state }, attributes: ['name'] })
        const changedValue = await getOne({ model: db.State, data: { stateId: +state }, attributes: ['name'] })
        await activityLog({ user, userId, fieldChanged: 'state', originalValue: originalValue?.name, changedValue: changedValue?.name, transaction })
      }
      if (country && country !== '' && userExist.countryCode !== +country) {
        const originalValue = await getOne({ model: db.Country, data: { countryId: userExist.countryCode }, attributes: ['name'] })
        const changedValue = await getOne({ model: db.Country, data: { countryId: country }, attributes: ['name'] })
        await activityLog({ user, userId, fieldChanged: 'country code', originalValue: originalValue?.name, changedValue: changedValue?.name, transaction })
      }
      if (zipCode & zipCode !== '' && userExist.zipCode !== zipCode) await activityLog({ user, userId, fieldChanged: 'zip code', originalValue: userExist.zipCode, changedValue: zipCode, transaction })
      if (email && email !== '' && userExist.email !== email) await activityLog({ user, userId, fieldChanged: 'email', originalValue: userExist.email, changedValue: email, transaction })
      if (phoneCode && phoneCode !== '' && userExist.phoneCode !== phoneCode) await activityLog({ user, userId, fieldChanged: 'phone code', originalValue: userExist.phoneCode, changedValue: phoneCode, transaction })
      if (phone && phone !== '' && userExist.phone !== phone) await activityLog({ user, userId, fieldChanged: 'phone', originalValue: userExist.phone, changedValue: phone, transaction })
      if (dateOfBirth && ((new Date(userExist.dateOfBirth).getUTCDate() !== new Date(dateOfBirth).getUTCDate()) ||
        (new Date(userExist.dateOfBirth).getUTCMonth() !== new Date(dateOfBirth).getUTCMonth()) ||
        (new Date(userExist.dateOfBirth).getUTCFullYear() !== new Date(dateOfBirth).getUTCFullYear()))) {
        await activityLog({ user, userId, fieldChanged: 'date of birth', originalValue: userExist.dateOfBirth, changedValue: dateOfBirth, transaction })
      }

      return { success: true, data: userProfile, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
