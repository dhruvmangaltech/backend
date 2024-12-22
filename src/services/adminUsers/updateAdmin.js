import { Op } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    adminId: { type: 'number' },
    firstName: {
      type: 'string',
      maxLength: 50,
      minLength: 3,
      pattern: '^[a-zA-Z0-9]*$'
    },
    lastName: {
      type: 'string',
      maxLength: 50,
      pattern: '^[a-zA-Z0-9 ]*$'
    },
    email: {
      type: 'string',
      maxLength: 150,
      format: 'email'
    },
    adminUsername: {
      type: 'string',
      pattern: '^[A-Za-z][A-Za-z0-9_]{3,50}$'
    },
    group: { type: 'string' },
    permission: { type: 'object' }
  },
  required: ['adminId', 'firstName', 'lastName', 'email', 'adminUsername']
}

const constraints = ajv.compile(schema)

export class UpdateAdminUser extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let {
      adminId, firstName, lastName, email, adminUsername, permission, group
    } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const query = { adminUserId: adminId }

      const checkAdminUserExist = await getOne({ model: db.AdminUser, data: query, transaction })

      if (!checkAdminUserExist) return this.addError('AdminNotFoundErrorType')
      // if (checkAdminUserExist.adminUserId !== id && checkAdminUserExist.roleId === ROLE_ID.ADMIN) {
      //   return this.addError('PermissionDeniedErrorType')
      // }
      if ((checkAdminUserExist.email !== email) || (checkAdminUserExist.adminUsername !== adminUsername)) {
        email = email.toLowerCase()

        const emailOrUsernameExist = await getOne({
          model: db.AdminUser,
          data: { [Op.or]: { email, adminUsername }, [Op.not]: { adminUserId: adminId } },
          attributes: ['email', 'adminUsername']
        })

        if (emailOrUsernameExist) {
          if (emailOrUsernameExist.email === email) {
            return this.addError('AdminEmailAlreadyExistsErrorType')
          }
          return this.addError('UserNameExistsErrorType')
        }
      }

      const updatedAdminUser = await updateEntity({
        model: db.AdminUser,
        values: { adminUserId: adminId },
        data: { firstName, lastName, email, adminUsername, group },
        transaction: transaction
      })
      let updatedPermissions
      if (permission) {
        updatedPermissions = await updateEntity({
          model: db.AdminUserPermission,
          values: { adminUserId: adminId },
          data: { permission },
          transaction: transaction
        })
      }

      return { adminDetail: { updatedAdminUser, updatedPermissions }, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
