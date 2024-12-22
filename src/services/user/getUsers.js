import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    userType: { type: 'string' },
    adminId: { type: ['string', 'null'] },
    idSearch: { type: ['string', 'null'] },
    emailSearch: { type: ['string', 'null'] },
    firstNameSearch: { type: ['string', 'null'] },
    lastNameSearch: { type: ['string', 'null'] },
    userNameSearch: { type: ['string', 'null'] },
    phoneSearch: { type: ['string', 'null'] },
    affiliateIdSearch: { type: ['string', 'null'] },
    regIpSearch: { type: ['string', 'null'] },
    isActive: { type: ['string', 'null'] },
    lastIp: { type: ['string', 'null'] },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    kycStatus: { type: ['string', 'null'], enum: ['PENDING', '', 'INIT', 'COMPLETED', 'ONHOLD'] }
  }
}
const constraints = ajv.compile(schema)

export class GetUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      limit, pageNo, idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, affiliateIdSearch,
      regIpSearch, isActive, kycStatus, orderBy, sort, lastIp
    } = this.args
    try {
      let query, ipQuery
      const { page, size } = pageValidation(pageNo, limit)

      if (idSearch) query = { userId: +idSearch }
      if (emailSearch) query = { ...query, email: { [Op.iLike]: `%${emailSearch}%` } }
      if (firstNameSearch) query = { ...query, firstName: { [Op.iLike]: `%${firstNameSearch}%` } }
      if (lastNameSearch) query = { ...query, lastName: { [Op.iLike]: `%${lastNameSearch}%` } }
      if (userNameSearch) query = { ...query, username: { [Op.iLike]: `%${userNameSearch}%` } }
      if (phoneSearch) query = { ...query, phone: { [Op.iLike]: `%${phoneSearch}%` } }
      if (affiliateIdSearch) query = { ...query, affiliateId: +affiliateIdSearch }
      if (regIpSearch) query = { ...query, signInIp: { [Op.iLike]: `%${regIpSearch}%` } }
      if (lastIp) ipQuery = { ipAddress: { [Op.iLike]: `%${lastIp}%` } }

      if (kycStatus) query = { ...query, kycStatus }
      if (isActive && isActive !== 'all') {
        if (isActive === 'true') {
          query = { ...query, isActive, [Op.and]: { signInCount: { [Op.gt]: 0 } } }
        } else {
          query = { ...query, isActive, [Op.or]: { signInCount: { [Op.eq]: 0 } } }
        }
      }

      const users = await db.User.findAndCountAll({
        where: query,
        order: [[orderBy || 'createdAt', sort || 'DESC']],
        limit: size,
        offset: ((page - 1) * size),
        include: [{ model: db.UserActivities, as: 'userActivity', attributes: ['ipAddress'], where: { ...ipQuery, activityType: { [Op.in]: [USER_ACTIVITIES_TYPE.LOGIN, USER_ACTIVITIES_TYPE.LOGOUT] } }, order: [['userActivityId', 'DESC']], limit: 1 }],
        attributes: ['userId', 'email', 'firstName', 'isActive', 'kycStatus', 'lastName', 'username', 'kycApplicantId', 'created_at', 'currencyCode', 'countryCode']
      })
      return (users ? { users, message: SUCCESS_MSG.GET_SUCCESS } : this.addError('UserNotExistsErrorType'))
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
