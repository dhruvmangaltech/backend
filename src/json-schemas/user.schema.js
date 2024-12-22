import ajv from '../libs/ajv'
const userListSchemas = {
  type: 'object',
  properties: {
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    kycStatus: { type: 'string' },
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    idSearch: { type: 'string' },
    emailSearch: { type: 'string' },
    firstNameSearch: { type: 'string' },
    lastNameSearch: { type: 'string' },
    userNameSearch: { type: 'string' },
    phoneSearch: { type: 'string' },
    affiliateIdSearch: { type: 'string' },
    regIpSearch: { type: 'string' },
    lastIp: { type: ['string', 'null'] }
  },
  required: []
}
ajv.addSchema(userListSchemas, '/user-list.json')

const userDetailSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
}
ajv.addSchema(userDetailSchemas, '/user-details.json')

const userDocumentsSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
}
ajv.addSchema(userDocumentsSchemas, '/user-document.json')

const userWithdrawRequestsSchemas = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    status: { type: 'string' },
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    adminId: { type: 'string' },
    paymentProvider: { type: 'string' }
  },
  required: []
}
ajv.addSchema(userWithdrawRequestsSchemas, '/user-withdraw-request.json')

const userDailyLimitSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    dailyLimit: { type: 'number' },
    timePeriod: { type: 'string' },
    reset: { type: 'boolean' }
  },
  required: ['userId', 'dailyLimit', 'timePeriod', 'reset']
}
ajv.addSchema(userDailyLimitSchemas, '/user-daily-limit.json')

const userDepositLimitSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    depositLimit: { type: 'number' },
    timePeriod: { type: 'string' },
    reset: { type: 'boolean' }
  },
  required: ['userId', 'depositLimit', 'timePeriod', 'reset']
}
ajv.addSchema(userDepositLimitSchemas, '/user-deposit-limit.json')

const userLossLimitSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    lossLimit: { type: 'number' },
    timePeriod: { type: 'string' },
    reset: { type: 'boolean' }
  },
  required: ['userId', 'lossLimit', 'timePeriod', 'reset']
}
ajv.addSchema(userLossLimitSchemas, '/user-loss-limit.json')

const userSetSessionTimeLimitSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    timeLimit: { type: 'number' },
    timePeriod: { type: 'string' },
    reset: { type: 'boolean' }
  },
  required: ['userId', 'timeLimit', 'timePeriod', 'reset']
}
ajv.addSchema(userSetSessionTimeLimitSchemas, '/user-set-session-time.json')

const userDisableUntilSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    days: { type: 'number' },
    type: { type: 'string' },
    reset: { type: 'boolean' }
  },
  required: ['userId', 'days', 'type', 'reset']
}
ajv.addSchema(userDisableUntilSchemas, '/user-disable-until.json')

const userVerifyDocumentSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    userDocumentId: { type: 'number' },
    status: { type: 'string' },
    reason: { type: 'string' },
    documentExpiry: { type: ['string', 'null'] }
  },
  required: ['userId', 'userDocumentId', 'status', 'reason']
}
ajv.addSchema(userVerifyDocumentSchemas, '/user-verify-document.json')

const updateUserPasswordSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    password: { type: 'string' },
    reason: { type: 'string' }
  },
  required: ['userId', 'password', 'reason']
}
ajv.addSchema(updateUserPasswordSchemas, '/update-user-password-request.json')

const updateUserStatusSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    action: { type: 'boolean' },
    reason: { type: 'string' },
    type: { type: 'number' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['userId', 'action', 'reason', 'type']
}
ajv.addSchema(updateUserStatusSchemas, '/update-user-status-request.json')

const updateUserBankDetailsSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    bankName: { type: 'string' },
    holderName: { type: 'string' },
    accountNumber: { type: 'string' },
    routingNumber: { type: 'string', pattern: '^[0-9]{9}$' },
    remark: { type: 'string' }
  },
  required: ['userId', 'routingNumber', 'remark', 'bankName', 'holderName', 'accountNumber']
}
ajv.addSchema(updateUserBankDetailsSchemas, '/update-user-bank-details.json')

const userCasinoDetailSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' }
  },
  required: ['userId']
}
ajv.addSchema(userCasinoDetailSchemas, '/user-casino-details.json')

const removeUserPwLockSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['userId', 'reason']
}
ajv.addSchema(removeUserPwLockSchemas, '/remove-user-pw-lock.json')

const updateSsnSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    ssn: { type: 'string' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['userId', 'reason']
}
ajv.addSchema(updateSsnSchemas, '/update-ssn.json')

const updateProfileSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'number'
    },
    firstName: {
      type: 'string'
    },
    middleName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    dateOfBirth: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    addressLine_1: {
      type: 'string'
    },
    addressLine_2: {
      type: ['string', 'null']
    },
    city: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    zipCode: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    userName: {
      type: 'string'
    },
    phoneCode: {
      type: 'string'
    },
    phone: {
      type: 'string'
    }
  },
  required: [
    'userId',
    'firstName',
    'lastName',
    'dateOfBirth',
    'gender',
    'addressLine_1',
    'city',
    'state',
    'country',
    'zipCode',
    'email',
    'userName',
    'phoneCode',
    'phone'
  ]
}

ajv.addSchema(updateProfileSchema, '/update-user-profile.json')

const addCommentSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    reason: { type: 'string' },
    favorite: { type: 'boolean' }
  },
  required: ['userId', 'reason', 'favorite']
}
ajv.addSchema(addCommentSchema, '/add-comment.json')

const activityLogSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    limit: { type: 'string', pattern: '^[0-9]+$' },
    pageNo: { type: 'string', pattern: '^[0-9]+$' },
    actioneeType: { type: 'string', enum: ['all', 'admin', 'user'] }
  },
  required: ['userId', 'actioneeType']
}

ajv.addSchema(activityLogSchema, '/activity-log.json')
const uploadUserDocumentSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    reason: { type: ['string', 'null'] },
    documentType: { type: 'string', enum: ['address', 'bank_checking', 'id', 'ssn', 'other'] }
  },
  required: ['userId', 'documentType']
}
ajv.addSchema(uploadUserDocumentSchema, '/upload-document.json')

const userActivitySchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    status: { type: 'string' },
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    coinType: { type: 'string' },
    transaction: { type: 'string' },
    gameProvider: { type: 'string' },
    activityType: { type: 'string' },
    action: { type: 'string' },
    providerName: { type: 'string' },
    csvDownload: { type: ['string', 'null'], enum: ['true', 'false', ''] }
  },
  required: [
    'userId',
    'startDate',
    'endDate',
    'pageNo',
    'limit'
  ]
}

ajv.addSchema(userActivitySchema, '/user-activity.json')
