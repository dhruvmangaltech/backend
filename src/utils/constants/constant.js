export const RESPONSIBLE_GAMING_ENDPOINTS = ['set-daily-limit', 'set-loss-limit', 'set-deposit-limit', 'set-disable-until', 'set-session-time']
export const REPORT_ENDPOINTS = ['report']

export const ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPPORT: 'support',
  USER: 'user'
}

export const TICKET_TYPE = {
  REDEMPTION: '1',
  EXPIRY: '2',
  FRAUD: '3',
  VERIFICATION: '4'
}

export const TICKET_STATUS = {
  UNASSIGNED: '0',
  PENDING: '1',
  SUCCESS: '2'
}

export const ROLE_ID = {
  ADMIN: 1,
  MANAGER: 2,
  SUPPORT: 3,
  USER: 4
}

export const EmailTemplateJobStatus = {
  complete: 3,
  inprogress: 2,
  initiate: 1,
  fail: 4
}

export const BREAK_TYPE = {
  TAKE_A_BREAK: 'TAKE_A_BREAK',
  SELF_EXCLUSION: 'SELF_EXCLUSION'
}

export const SELF_EXCLUSION_TYPE = {
  CURRENT: 'current',
  ALL: 'all'
}

export const REQUEST_TYPE = {
  GET: 'R',
  POST: 'C',
  PUT: 'U',
  DELETE: 'D',
  TOGGLE: 'T',
  APPLY_THEME: 'A',
  CREATE_CUSTOM: 'CC',
  ADD_BALANCE: 'AB',
  SET_RESET: 'SR',
  TEST_EMAIL: 'TE',
  BONUS: 'Issue',
  DASHBOARD_REPORT: 'DR'
}

export const PERMISSION_TYPE = {
  Package: 'Package',
  SpinWheelConfiguration: 'SpinWheelConfiguration',
  Dashboard: 'Dashboard',
  Currencies: 'Currencies',
  Admins: 'Admins',
  CMS: 'CMS',
  Credentials: 'Credentials',
  Configurations: 'Configurations',
  Users: 'Users',
  Transactions: 'Transactions',
  Bonus: 'Bonus',
  WageringTemplate: 'WageringTemplate',
  RestrictedCountry: 'RestrictedCountry',
  CasinoManagement: 'CasinoManagement',
  RegistrationField: 'RegistrationField',
  LivePlayerReport: 'LivePlayerReport',
  PlayerStatisticsReport: 'PlayerManagementReport',
  PlayerLiabilityReport: 'PlayerLiabilityReport',
  KpiSummaryReport: 'KpiSummaryReport',
  KpiReport: 'KpiReport',
  GameReport: 'GameReport',
  Settings: 'Settings',
  ImageGallery: 'ImageGallery',
  aliases: {
    // Currencies
    'get-currencies': 'Currencies',
    'get-currency-details': 'Currencies',
    'create-currency': 'Currencies',
    'update-currency': 'Currencies',
    'products': 'Products',
    'stocks': 'Stocks',
    // Admins
    admin: 'Admins',
    bonus: 'Bonus',
    create: 'Admins',
    update: 'Admins',
    lists: 'Admins',
    gallery: 'ImageGallery',
    cms: 'CMS',
    user: 'Users',
    SITE: 'Site',
    ADMIN: 'Admins',
    USER: 'Users',
    CMS: 'CMS',
    email: 'EmailTemplate',
    BONUS: 'Bonus',
    package: 'Package',
    spinWheelConfiguration: 'SpinWheelConfiguration',
    country: 'RestrictedCountry',
    CASINOMANAGEMENT: 'CasinoManagement',
    banner: 'Banner',
    popup: 'Popup',
    casino: 'CasinoManagement',
    payment: 'Transactions',
    report: 'Report',
    alert: 'Alert',
    'postal-code': 'Amoe'
  }
}

export const TEST_EMAIL = 'test-email-template'
export const MANAGE_MONEY = 'add-balance'

// T here is Toggle Status, SR here is set reset Responsible gaming limits, AB: add balance
export const ADMIN_PERMISSION = {
  // Package: ['C', 'R', 'U', 'D'],
  Admins: ['C', 'R', 'U', 'T', 'D'],
  // CMS: ['C', 'R', 'U', 'T', 'D'],
  // Users: ['C', 'R', 'U', 'T', 'D'],
  // Transactions: ['C', 'R', 'U', 'T', 'D'],
  // CasinoManagement: ['C', 'R', 'U', 'T', 'D'],
  Report: ['R', 'DR'],
  // Configurations: ['C', 'R', 'U', 'T', 'D'],
  // GeoBlocking: ['C', 'R', 'U', 'T', 'D'],
  // Bonus: ['C', 'R', 'U', 'T', 'D', 'Issue'],
  Stocks: ['C', 'R', 'U', 'T', 'D'],
  Products: ['C', 'R', 'U', 'T', 'D']
}

export const TOGGLE_CASE = {
  ADMIN: 'ADMIN',
  SITE: 'SITE',
  AFFILIATE: 'AFFILIATE',
  USER: 'USER',
  USER_EMAIL: 'USER-EMAIL',
  CMS: 'CMS',
  CASINO_CATEGORY: 'CASINO_CATEGORY',
  CASINO_SUB_CATEGORY: 'CASINO_SUB_CATEGORY',
  CATEGORY_GAME: 'CATEGORY_GAME',
  CASINO_GAME: 'CASINO_GAME',
  CASINO_PROVIDER: 'CASINO_PROVIDER',
  AGGREGATOR: 'AGGREGATOR',
  BONUS: 'BONUS',
  LANGUAGE: 'LANGUAGE',
  BANNER: 'BANNER'
}

export const CASINO_TOGGLE_CASE = [
  'CMS',
  'Package',
  'CATEGORY_GAME',
  'CASINO_CATEGORY',
  'CASINO_SUB_CATEGORY',
  'CASINO_GAME',
  'CASINO_PROVIDER',
  'AGGREGATOR',
  'BANNER'
]

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  REREQUESTED: 4,
  ON_HOLD: 5
}

export const STATUS_VALUE = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REQUESTED: 'REQUESTED',
  RE_REQUESTED: 'RE-REQUESTED',
  DECLINE: 'DECLINED',
  FAILED: 'FAIL',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELED'
}

export const UPLOAD_FILE_SIZE = 5000000
export const OK = 'ok'

export const TYPE = {
  CRYPTO: 'CRYPTO',
  FIAT: 'FIAT',
  CRYPTO_ID: 0,
  FIAT_ID: 1
}

export const THUMBNAIL_TYPE = {
  MOBILE: 'mobile',
  SHORT: 'short',
  LONG: 'long'
}
export const TRANSACTION_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  CANCELED: 2,
  FAILED: 3,
  ROLLBACK: 4,
  APPROVED: 5,
  DECLINED: 6,
  INPROGRESS: 7,
  POSTPONE: 8,
  VOID: 9,
  REFUND: 10,
  SHORT: 11
}

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'redeem',
  BONUS: 'bonus',
  ADD_BALANCE: 'addMoney',
  REMOVE_BALANCE: 'removeMoney',
  ADD_SC: 'addSc',
  ADD_GC: 'addGc',
  REMOVE_SC: 'removeSc',
  REMOVE_GC: 'removeGc',
  ADD_TO_STOCK: 'addStock',
  TOOK_FROM_STOCK: 'tookStock'
}

export const GAME_CATEGORY = {
  TABLE_GAME: 'table',
  CASINO_GAME: 'casino'
}

export const RESTRICTED_TYPE = {
  PROVIDERS: 'PROVIDERS',
  GAMES: 'GAMES'
}

export const EMAIL_SUBJECTS = {
  verification: 'Successful Identity Verification',
  withdrawApproved: 'Redemption Request Approved',
  verificationRequested: 'Identity Verification Requested'
}

export const ACTION = {
  WIN: 'win',
  BET: 'bet',
  ROLLBACK: 'rollback',
  ROLLBACKBEFOREBETWIN: 'prerollback',
  FREESPINS: 'freespins',
  LOST: 'lost',
  BONUS: 'bonus'
}

export const CASINO_TRANSACTION_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3
}

export const AMOUNT_TYPE = {
  GC_COIN: 0,
  SC_COIN: 1,
  CASH_NON_CASH: 2
}

export const COIN_TYPE = {
  SC: 0,
  GC: 1,
  SC_GC: 2
}

export const BONUS_TYPE = {
  DAILY_BONUS: 'daily bonus',
  WELCOME_BONUS: 'welcome bonus',
  MONTHLY_BONUS: 'monthly bonus',
  POSTAL_CODE_BONUS: 'AMOE Deposit',
  NORMAL_DAILY_BONUS: 'daily-bonus',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  PSP_BONUS: 'psp-bonus',
  REFERRAL_BONUS: 'referral-bonus',
  WEEKLY_RAKEBACK_BONUS: 'weekly_rakeback_bonus',
  DEFAULT_BONUS: 'default-bonus',
  BOOST_BONUS: 'boost-bonus',
  SPIN_WHEEL: 'spin-wheel-bonus'
}

export const WAGERING_TYPE = {
  BONUS: 'bonus',
  BONUSDEPOSIT: 'bonusdeposit'
}

export const BONUS_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  FORFEIT: 'FORFEITED',
  EXPIRED: 'EXPIRED',
  CLAIMING: 'CLAIMING',
  IN_PROCESS: 'IN-PROCESS',
  LAPSED: 'LAPSED',
  CLAIMED: 'CLAIMED'
}

export const WAGER_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const KEYS = {
  MAX_BONUS_THRESHOLD: 'maxBonusThreshold',
  MIN_DEPOSIT: 'minDeposit',
  MAX_WIN_AMOUNT: 'maxWinAmount',
  ZERO_OUT_THRESHOLD: 'zeroOutThreshold',
  MIN_BALANCE: 'minBalance'
}

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30
}

export const STRICTLY_REQUIRED_REGISTRATION_FIELDS = [
  'email',
  'password',
  'firstName',
  'username',
  'lastName',
  'dateOfBirth',
  'address',
  'gender',
  'countryCode',
  'currencyCode'
]

export const REPORTING_CURRENCY = 'EUR'
export const MAX_QUANTITY = 100
export const ACCOUNT_TYPE = 'REAL'

export const COUNTRY_CURRENCY_MAPPER = { BD: 'BDT', BE: 'EUR', BF: 'XOF', BG: 'BGN', BA: 'BAM', BB: 'BBD', WF: 'XPF', BL: 'EUR', BM: 'BMD', BN: 'BND', BO: 'BOB', BH: 'BHD', BI: 'BIF', BJ: 'XOF', BT: 'BTN', JM: 'JMD', BV: 'NOK', BW: 'BWP', WS: 'WST', BQ: 'USD', BR: 'BRL', BS: 'BSD', JE: 'GBP', BY: 'BYR', BZ: 'BZD', RU: 'RUB', RW: 'RWF', RS: 'RSD', TL: 'USD', RE: 'EUR', TM: 'TMT', TJ: 'TJS', RO: 'RON', TK: 'NZD', GW: 'XOF', GU: 'USD', GT: 'GTQ', GS: 'GBP', GR: 'EUR', GQ: 'XAF', GP: 'EUR', JP: 'JPY', GY: 'GYD', GG: 'GBP', GF: 'EUR', GE: 'GEL', GD: 'XCD', GB: 'GBP', GA: 'XAF', SV: 'USD', GN: 'GNF', GM: 'GMD', GL: 'DKK', GI: 'GIP', GH: 'GHS', OM: 'OMR', TN: 'TND', JO: 'JOD', HR: 'HRK', HT: 'HTG', HU: 'HUF', HK: 'HKD', HN: 'HNL', HM: 'AUD', VE: 'VEF', PR: 'USD', PS: 'ILS', PW: 'USD', PT: 'EUR', SJ: 'NOK', PY: 'PYG', IQ: 'IQD', PA: 'PAB', PF: 'XPF', PG: 'PGK', PE: 'PEN', PK: 'PKR', PH: 'PHP', PN: 'NZD', PL: 'PLN', PM: 'EUR', ZM: 'ZMK', EH: 'MAD', EE: 'EUR', EG: 'EGP', ZA: 'ZAR', EC: 'USD', IT: 'EUR', VN: 'VND', SB: 'SBD', ET: 'ETB', SO: 'SOS', ZW: 'ZWL', SA: 'SAR', ES: 'EUR', ER: 'ERN', ME: 'EUR', MD: 'MDL', MG: 'MGA', MF: 'EUR', MA: 'MAD', MC: 'EUR', UZ: 'UZS', MM: 'MMK', ML: 'XOF', MO: 'MOP', MN: 'MNT', MH: 'USD', MK: 'MKD', MU: 'MUR', MT: 'EUR', MW: 'MWK', MV: 'MVR', MQ: 'EUR', MP: 'USD', MS: 'XCD', MR: 'MRO', IM: 'GBP', UG: 'UGX', TZ: 'TZS', MY: 'MYR', MX: 'MXN', IL: 'ILS', FR: 'EUR', IO: 'USD', SH: 'SHP', FI: 'EUR', FJ: 'FJD', FK: 'FKP', FM: 'USD', FO: 'DKK', NI: 'NIO', NL: 'EUR', NO: 'NOK', NA: 'NAD', VU: 'VUV', NC: 'XPF', NE: 'XOF', NF: 'AUD', NG: 'NGN', NZ: 'NZD', NP: 'NPR', NR: 'AUD', NU: 'NZD', CK: 'NZD', XK: 'EUR', CI: 'XOF', CH: 'CHF', CO: 'COP', CN: 'CNY', CM: 'XAF', CL: 'CLP', CC: 'AUD', CA: 'CAD', CG: 'XAF', CF: 'XAF', CD: 'CDF', CZ: 'CZK', CY: 'EUR', CX: 'AUD', CR: 'CRC', CW: 'ANG', CV: 'CVE', CU: 'CUP', SZ: 'SZL', SY: 'SYP', SX: 'ANG', KG: 'KGS', KE: 'KES', SS: 'SSP', SR: 'SRD', KI: 'AUD', KH: 'KHR', KN: 'XCD', KM: 'KMF', ST: 'STD', SK: 'EUR', KR: 'KRW', SI: 'EUR', KP: 'KPW', KW: 'KWD', SN: 'XOF', SM: 'EUR', SL: 'SLL', SC: 'SCR', KZ: 'KZT', KY: 'KYD', SG: 'SGD', SE: 'SEK', SD: 'SDG', DO: 'DOP', DM: 'XCD', DJ: 'DJF', DK: 'DKK', VG: 'USD', DE: 'EUR', YE: 'YER', DZ: 'DZD', US: 'USD', UY: 'UYU', YT: 'EUR', UM: 'USD', LB: 'LBP', LC: 'XCD', LA: 'LAK', TV: 'AUD', TW: 'TWD', TT: 'TTD', TR: 'TRY', LK: 'LKR', LI: 'CHF', LV: 'EUR', TO: 'TOP', LT: 'LTL', LU: 'EUR', LR: 'LRD', LS: 'LSL', TH: 'THB', TF: 'EUR', TG: 'XOF', TD: 'XAF', TC: 'USD', LY: 'LYD', VA: 'EUR', VC: 'XCD', AE: 'AED', AD: 'EUR', AG: 'XCD', AF: 'AFN', AI: 'XCD', VI: 'USD', IS: 'ISK', IR: 'IRR', AM: 'AMD', AL: 'ALL', AO: 'AOA', AQ: '', AS: 'USD', AR: 'ARS', AU: 'AUD', AT: 'EUR', AW: 'AWG', IN: 'INR', AX: 'EUR', AZ: 'AZN', IE: 'EUR', ID: 'IDR', UA: 'UAH', QA: 'QAR', MZ: 'MZN' }

export const LIMIT_TIME_PERIOD = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

export const EMAIL_TEMPLATE_PRIMARY_STATUS = {
  PRIMARY: 1,
  DISABLE: 0,
  alias: {
    0: 'disable',
    1: 'primary'
  }
}

export const EMAIL_TEMPLATE_TYPES = {
  ACTIVE_USER: 'Active User',
  IN_ACTIVE_USER: 'In-Active User',
  EMAIL_VERIFICATION: 'Email Verification',
  RESET_PASSWORD: 'Reset Password',
  KYC_REJECTED: 'KYC Rejected',
  KYC_VERIFIED: 'KYC Verified',
  KYC_REQUESTED: 'KYC Requested',
  KYC_REMINDER: 'KYC Reminder',
  KYC_RECEIVED: 'KYC Received',
  KYC_APPROVED: 'KYC Approved',
  WITHDRAW_REQUEST_RECEIVED: 'Redeem Request Received',
  WITHDRAW_APPROVED: 'Redeem Approved',
  DEPOSIT_SUCCESS: 'Purchase Success',
  REGISTRATION_WELCOME: 'Registration Welcome',
  PHONE_VERIFICATION: 'Phone Verification',
  PASSWORD_RESET_CONFIRMED: 'Password Reset Confirmed',
  IDENTITY_VERIFICATION: 'Identity Verification',
  SUCCESSFUL_IDENTITY_VERIFICATION: 'Successful Identity Verification',
  RESPONSIBLE_GAMBLING_PURCHASE_LIMIT: 'Responsible Gaming Purchase Limit',
  RESPONSIBLE_GAMBLING_TAKE_A_BREAK: 'Responsible Gaming Take a Break',
  RESPONSIBLE_GAMBLING_SESSION_REMINDER: 'Responsible Gaming Session Redminder',
  RESPONSIBLE_GAMBLING_TIME_LIMIT: 'Responsible Gaming Time Limit',
  RESPONSIBLE_GAMBLING_SELF_EXCLUSION: 'Responsible Gaming Self Exclusion',
  RESPONSIBLE_GAMBLING_SETTING_CHANGE: 'Responsible Gaming Setting Change',
  VALUE_T0_INT: {
    'Active User': 0,
    'In-Active User': 1,
    'Email Verification': 2,
    'Reset Password': 3,
    'KYC Rejected': 4,
    'KYC Verified': 5,
    'KYC Requested': 6,
    'KYC Reminder': 7,
    'KYC Received': 8,
    'KYC Approved': 9,
    'Redeem Request Received': 10,
    'Redeem Approved': 11,
    'Purchase Success': 12,
    'Registration Welcome': 13,
    'Phone Verification': 14,
    'Password Reset Confirmed': 15,
    'Identity Verification': 16,
    'Successful Identity Verification': 17,
    'Responsible Gaming Purchase Limit': 18,
    'Responsible Gaming Take a Break': 19,
    'Responsible Gaming Session Redminder': 20,
    'Responsible Gaming Time Limit': 21,
    'Responsible Gaming Self Exclusion': 22,
    'Responsible Gaming Setting Change': 23
  },
  INT_TO_VALUE: {
    0: 'Active User',
    1: 'In-Active User',
    2: 'Email Verification',
    3: 'Reset Password',
    4: 'KYC Rejected',
    5: 'KYC Verified',
    6: 'KYC Requested',
    7: 'KYC Reminder',
    8: 'KYC Received',
    9: 'KYC Approved',
    10: 'Redeem Request Received',
    11: 'Redeem Approved',
    12: 'Purchase Success',
    13: 'Registration Welcome',
    14: 'Phone Verification',
    15: 'Password Reset Confirmed',
    16: 'Identity Verification',
    17: 'Successful Identity Verification',
    18: 'Responsible Gaming Purchase Limit',
    19: 'Responsible Gaming Take a Break',
    20: 'Responsible Gaming Session Redminder',
    21: 'Responsible Gaming Time Limit',
    22: 'Responsible Gaming Self Exclusion',
    23: 'Responsible Gaming Setting Change'
  }
}

export const EMAIL_TEMPLATE_ORDER = [
  'Manual',
  'Email Verification',
  'Phone Verification',
  'Registration Welcome',
  'Reset Password',
  'Password Reset Confirmed',
  'Identity Verification',
  'Successful Identity Verification',
  'Responsible Gaming Purchase Limit',
  'Responsible Gaming Take a Break',
  'Responsible Gaming Session Redminder',
  'Responsible Gaming Time Limit',
  'Responsible Gaming Self Exclusion',
  'Responsible Gaming Setting Change',
  'Active User',
  'In-Active User',
  'KYC Verified',
  'KYC Rejected',
  'KYC Requested',
  'KYC Reminder',
  'KYC Received',
  'KYC Approved',
  'Redeem Request Received',
  'Redeem Approved',
  'Purchase Success'
]

export const EMAIL_ALLOWED_KEYS = [
  'SiteName',
  'siteLogo',
  'subject',
  'userName',
  'walletAmountTotal',
  'walletAmountBonus',
  'walletAmountReal',
  'siteUrl',
  'reason',
  'link',
  'redeemAmount',
  'depositAmount',
  'transactionId',
  'playerEmail',
  'playerFullName',
  'playerFirstName',
  'playerLastName',
  'supportEmailAddress',
  'kycLabels',
  'siteLoginUrl',
  'playerCurrencySymbol',
  'sendSupportRequestRoute',
  'redeemRequestedDate',
  'scCoin',
  'gcCoin',
  'currentDate',
  'paymentType',
  'value',
  'identifier'
]

export const TEMPLATE_KEY = ['userName', 'playerEmail', 'siteLogo', 'siteName', 'playerFirstName', 'playerLastName']
export const EMAIL_TEMPLATES = [
  {
    name: 'Upcoming Event Notification',
    templateCategoryId: 1,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Promotional Notification',
    templateCategoryId: 2,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Site Maintenance Notification',
    templateCategoryId: 3,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Active User Notification',
    templateCategoryId: 4,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Inactive User Notification',
    templateCategoryId: 5,
    required: TEMPLATE_KEY,
    optional: []
  }
]
export const EMAIL_TEMPLATES_KEYS = {
  0: {
    required: ['siteName', 'siteUrl', 'siteLogo'],
    optional: ['userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal']
  },
  1: {
    required: ['siteName', 'siteUrl', 'siteLogo', 'reason'],
    optional: ['userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal']
  },
  2: {
    required: ['link', 'userName'],
    optional: ['playerEmail', 'siteName', 'siteUrl', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress']
  },
  3: {
    required: ['link'],
    optional: ['siteName', 'siteLogo', 'userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol']
  },
  4: {
    required: ['kycLabels', 'reason'],
    optional: ['siteName', 'siteLogo', 'userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  5: {
    required: [],
    optional: ['siteName', 'siteLogo', 'userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  6: {
    required: ['kycLabels'],
    optional: ['siteName', 'siteLogo', 'userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  7: {
    required: [],
    optional: ['siteName', 'siteLogo', 'userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  8: {
    required: [],
    optional: ['siteName', 'siteLogo', 'userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  9: {
    required: ['kycLabels'],
    optional: ['siteName', 'siteLogo', 'userName', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  10: {
    required: ['redeemRequestedDate', 'redeemAmount', 'transactionId', 'userName'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  11: {
    required: ['redeemRequestedDate', 'redeemAmount', 'transactionId', 'userName'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  12: {
    required: ['transactionId', 'depositAmount', 'scCoin', 'gcCoin', 'currentDate', 'paymentType', 'userName'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'sendSupportRequestRoute', 'playerCurrencySymbol']
  },
  13: {
    required: ['siteUrl', 'userName'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  14: {
    required: ['siteUrl', 'userName'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  15: {
    required: ['userName'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  16: {
    required: ['userName'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  17: {
    required: ['userName', 'siteUrl'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  18: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  19: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  20: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  21: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  22: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  },
  23: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: ['siteName', 'siteLogo', 'walletAmountTotal', 'walletAmountBonus', 'walletAmountReal', 'siteUrl', 'playerEmail', 'playerFullName', 'playerFirstName', 'playerLastName', 'supportEmailAddress', 'siteLoginUrl', 'playerCurrencySymbol', 'sendSupportRequestRoute']
  }
}

export const EMAIL_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: 'This will be replaced by site\'s Logo URL'
  },
  {
    key: 'subject',
    description: 'If not given, default subject line will be used'
  },
  {
    key: 'userName',
    description: 'This will be replaced by User\'s unique username'
  },
  {
    key: 'walletAmountTotal',
    description: 'This will be replaced by User\'s total wallet amount'
  },
  {
    key: 'walletAmountBonus',
    description: 'This will be replaced by User\'s non-cash wallet amount'
  },
  {
    key: 'walletAmountReal',
    description: 'This will be replaced by User\'s cash wallet amount'
  },
  {
    key: 'siteUrl',
    description: 'This will be replaced by site\'s URL'
  },
  {
    key: 'reason',
    description: 'This will be replaced by valid reason for triggering email'
  },
  {
    key: 'link',
    description: 'Dynamically generated link from backend (Reset Password, Email Confirmation)'
  },
  {
    key: 'redeemAmount',
    description: 'This will be replaced by redeem request amount'
  },
  {
    key: 'depositAmount',
    description: 'This will be replaced by deposit amount'
  },
  {
    key: 'transactionId',
    description: 'This will be replaced by transaction Id for (Deposit / Redeem)'
  },
  {
    key: 'playerEmail',
    description: 'This will be replaced by player\'s email address'
  },
  {
    key: 'playerFullName',
    description: 'This will be replaced by player\'s full name (first name + last name)'
  },
  {
    key: 'playerFirstName',
    description: 'This will be replaced by player\'s first name'
  },
  {
    key: 'playerLastName',
    description: 'This will be replaced by player\'s last name'
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  },
  {
    key: 'kycLabels',
    description: 'This will be replaced by kyc label for pending, approved, rejected'
  },
  {
    key: 'siteLoginUrl',
    description: 'This will be replaced by user login route'
  },
  {
    key: 'playerCurrencySymbol',
    description: 'This will be replaced by user\'s currency symbol'
  },
  {
    key: 'sendSupportRequestRoute',
    description: 'This will be replaced by route for compose support email page.'
  },
  {
    key: 'redeemRequestedDate',
    description: 'This will be replaced by requested redeem date.'
  },
  {
    key: 'scCoin',
    description: 'This will be replaced by SC coin value.'
  },
  {
    key: 'gcCoin',
    description: 'This will be replaced by GC coin value.'
  },
  {
    key: 'currentDate',
    description: 'This will be replaced by Current date'
  },
  {
    key: 'paymentType',
    description: 'This will be replaced by payment type used.'
  },
  {
    key: 'value',
    description: 'This will be replaced by deposit value used.'
  },
  {
    key: 'identifier',
    description: 'This will be replaced by identifier used.'
  }
]

export const BONUS_ACTIONS = ['cancel-bonus', 'issue-bonus']

export const CMS_ALLOWED_KEYS = ['siteName', 'siteLogo', 'supportEmailAddress']

export const CMS_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: 'This will be replaced by site\'s Logo URL'
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  }
]

export const MAP_AGGREGATOR = {
  softswiss: 'swissSoft',
  amantic: 'amantic'
}

export const MAP_GENDER = {
  Female: 'f',
  Male: 'm',
  F: 'f',
  M: 'm',
  'Not to say': 'm',
  Other: 'm'
}

export const LEVEL = 1

export const defaultLanguage = 'EN'
export const defaultBase64 = 'BASE64'
export const defaultUtf8 = 'utf8'
export const BANNER_KEYS = ['homeBanner', 'homeBackground', 'loyaltyBanner', 'loyaltyBackground', 'promotionsBanner', 'promotionsBackground', 'casinoBanner', 'casinoBackground']

export const USER_ACTIVITIES_TYPE = {
  SIGNUP: 'sign-up',
  LOGIN: 'login',
  DAILYBONUSCLAIMED: 'daily-bonus-claimed',
  DAILYBONUSCANCELLED: 'daily-bonus-cancelled',
  WELCOMEBONUSCLAIMED: 'welcome-bonus-claimed',
  POSTAL_CODE_CLAIMED: 'AMOE-deposit-claimed',
  LOGOUT: 'logout',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  PSP_BONUS: 'psp-bonus',
  REFERRED_BONUS_CLAIMED: 'referred-bonus-claimed',
  DEFAULT_BONUS: 'default-bonus',
  BOOST_BONUS: 'boost-bonus'
}

export const BANK_ACCOUNT_TYPE = {
  CHECKING: '0',
  SAVINGS: '1'
}

export const SUMSUB_APPLICANT_TYPES = ['applicantCreated', 'applicantPending', 'applicantOnHold', 'videoIdentStatusChanged', 'applicantDeleted', 'applicantPrechecked', 'applicantActionOnHold']

export const SUMSUB_APPLICANT_REVIEW_TYPES = ['applicantReviewed', 'applicantActionReviewed', 'applicantReset']
export const SUMSUB_REVIEW_TYPE = 'GREEN'
export const LOGICAL_ENTITY = {
  PROVIDER: 'provider',
  SUB_CATEGORY: 'sub-category',
  BANNER: 'banner',
  PACKAGE: 'package',
  BONUS: 'bonus',
  POSTAL_CSV: 'postal-csv',
  DIGITAL_ASSET: 'digital',
  POPUP: 'popup'
}

export const RESPONSIBLE_GAMBLING_STATUS = {
  ACTIVE: '1',
  IN_ACTIVE: '0',
  COOLING_PERIOD: '2'
}

export const RESPONSIBLE_GAMBLING_LIMIT = {
  DAILY: '1',
  WEEKLY: '2',
  MONTHLY: '3'
}

export const RESPONSIBLE_GAMBLING_TYPE = {
  TIME: '1',
  PURCHASE: '2',
  // TIME: '3',
  TIME_BREAK: '4',
  SELF_EXCLUSION: '5'
}

export const SIGN_IN_METHOD = {
  NORMAL: '0',
  GOOGLE: '1',
  FACEBOOK: '2'
}

export const ACTION_TYPE = {
  ALL: 'all',
  BONUS: '4',
  LOST: '3',
  CANCEL: '2',
  CREDIT: '1',
  DEBIT: '0',
  PENDING_OR_LOST: null
}

export const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{10,}$/
}

export const UPDATE_USER_STATUS = {
  PHONE_VERIFICATION: 1,
  RESTRICT_USER: 2,
  BAN_UNBAN_USER: 3,
  MARK_TEST: 4,
  REDEMPTION_SUBSCRIPTION: 5,
  SUBSCRIPTION: 6,
  VERIFF_VERIFICATION: 7,
  LN_VERIFICATION: 8,
  PERSONAL_DETAILS: 9,
  BANK_DETAILS: 10,
  VERIFIED: 11,
  EMAIL_VERIFICATION: 12,
  PAYNOTE_PAYMENT: 13,
  TRIPLE_A_PAYMENT: 14,
  PRIZEOUT_PAYMENT: 15
}

export const WALLET_OPERATION_TYPE = {
  ADD: 1,
  DEDUCT: 2
}

export const DOCUMENTS = {
  ID: 'ID_PROOF',
  ADDRESS: 'ADDRESS_PROOF',
  BANK_CHECKING: 'BANK_CHECKING',
  BANK_SAVINGS: 'BANK_SAVINGS',
  SSN: 'SSN',
  OTHER: 'OTHER'
}

export const EMAIL_LOGS_SOURCE = {
  SMS: 'SMS',
  PUSH: 'push',
  TRANSACTIONAL: 'transactional',
  VERIFICATION: 'verification',
  CRM: 'CRM'
}

export const POSTAL_CODE_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2
}
export const KYC_STATUS = {
  ACCOUNT_CREATED: 'K0',
  ACCOUNT_EMAIL_VERIFIED_ACCEPTED_TC: 'K1',
  ACCOUNT_VERIFIED_PHONE: 'K2',
  ACCOUNT_PASSED_LEXIS_NEXIS: 'K3',
  ACCOUNT_FAILED_LEXIS_NEXIS: 'K4'
}

export const RULE_ACTIVITIES = {
  REDEMPTIONS: 1,
  LOGIN: 2,
  REGISTRATION: 3,
  PURCHASE: 4,
  WIN: 5
}

export const TWO_FACTOR_AUTH = {
  issuer: 'sweeperCasino',
  label: 'sweeperCasino',
  algorithm: 'SHA1',
  digits: 6,
  period: 30
}

export const PAGE_ASSET_TYPE = {
  TEXT: '1',
  DIGITAL: '2',
  MESSAGE: '3'
}

export const FILE_NAME = {
  RECONCILIATION: 'Reconciliation_Report',
  REDEMPTION: 'Redemption_Report',
  EXCEEDING: 'Exceeding_Redemption_Report',
  PURCHASE: 'Purchase_Report',
  FAILED: 'Failed_Purchase_Report',
  NEW: 'New_Registered_Player',
  LEXIS: 'Lexis_Nexis_Failed',
  GAME: 'Game_Report',
  TOP_200_PURCHASERS: 'Top_200_Purchasers_Report',
  TOP_200_REDEEMERS: 'Top_200_Redeemers_Report',
  INACTIVE_PLAYERS: 'Inactive_Players_Report',
  BUSINESS_ECONOMY: 'Business_Economy_Report',
  USER_JOURNEY: 'User_Journey_Report',
  ACQUISITION_TOTAL: 'Acquisition_Total_Report',
  PENDING_VERIFICATION: 'Pending_Verification',
  PLAYER_WITHOUT_PURCHASE: 'Without_Purchase',
  ACQUISITION_DETAIL: 'Acquisition_Detail_Report',
  COIN_STORE_PACKAGES: 'Coin_Store_Packages_Report',
  COIN_DISTRIBUTION_OVERVIEW: 'Coin_Distribution_Overview_Report',
  DORMANT_PLAYERS_WITH_BALANCE_REPORT: 'Dormant_Players_With_Balance_Report'
}

export const CUSTOMER_IO_TRANSACTION_ID = {
  VERIFY_MESSAGE_ID: 11,
  FORGET_PASSWORD_MESSAGE_ID: 12,
  PASSWORD_CONFIRMED_MESSAGE_ID: 13,
  DEPOSIT_SUCCESS: 14
}

export const PAYMENT_PROVIDER = {
  TRIPLE_A: 'Triple A',
  PAYNOTE: 'Paynote'
}

export const PAYMENT_PROVIDER_TYPE = {
  TRIPLE_A: 1,
  PAYNOTE: 2
}

export const DASHBOARD_REPORT = {
  LOGIN_DATA: 'loginData',
  CUSTOMER_DATA: 'customerData',
  TRANSACTION_DATA: 'transactionData',
  ECONOMY_DATA: 'economyData',
  DASHBOARD_REPORT: 'dashboardData'
}

export const USER_TYPE = {
  USER: 1,
  ADMIN_USER: 2
}

export const STOCK_TRANSACTION_TYPE = {
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
  CANCEL: 'CANCEL'
}