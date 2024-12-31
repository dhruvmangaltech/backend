import { StatusCodes } from 'http-status-codes'
export const ERRORS = {
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not found',
  METHOD_NOT_ALLOWED: 'methodNotAllowed',
  BAD_DATA: 'badData',
  BAD_REQUEST: 'badRequest',
  INTERNAL: 'internal',
  SERVER_ERROR: 'serverError',
  SERVER_UNAVAILABLE: 'serverUnavailable',
  SERVICE_FAILED: 'Not ready',
  CACHE_FAILED: 'Redis Connection: Failed to connect',
  Empty: 'Empty errors array passed'
}

export const APP_ERROR_CODES = {
  EMAIL_NOT_REGISTERED: 'This email is not registered',
  INCORRECT_PASSWORD: 'This password is incorrect',
  ADMIN_NOT_FOUND: 'Admin not found',
  AFFILIATE_NOT_FOUND: 'Affiliate not found',
  INVALID_TOKEN: 'Access token is invalid',
  INACTIVE_ADMIN: 'Cannot login, current user is in-active'
}

export const ERROR_MSG = {
  SERVER_ERROR: 'Something went wrong',
  EXISTS: 'already exists',
  NOT_FOUND: 'not found',
  NOT_EXISTS: 'does not exists',
  ID_REQUIRED: 'ID required',
  EMAIL_INVALID: 'Email not valid',
  BANNER_KEY_REQUIRED: 'ID_REQUIRED required',
  SUPPORT_EMAIL_REQUIRED: 'support_email required',
  SITE_NAME_REQUIRED: 'site_name required',
  ORIGIN_REQUIRED: 'origin required',
  KEY_VALUE_REQUIRED: 'value required',
  EMAIL_EXIST: 'Email Address already exist',
  TOGGLE_CASE_ERROR: 'Case value invalid',
  NOT_ALLOWED: 'Action not allowed',
  FAILED: 'failed',
  BALANCE_ERROR: 'Insufficient balance',
  CURRENCY_NOT_SUBSET: 'Currency should be as per allowed configuration',
  WITHDRAW_STATUS_ERR: 'Status already updated',
  WITHDRAW_STATUS_ERR_2: 'Status already pending',
  CURRENCY_REQUIRED: 'Currency code is required',
  CREATE_ERROR: 'Cannot create admin user',
  CREATE_ADMIN_ERROR: 'Cannot create Admin user',
  USERNAME_EXIST: 'Username already exists',
  PERMISSION_DENIED: ' permission denied',
  TRANSACTION_DENIED: 'Receiver not in hierarchy, transaction denied',
  ADMIN_TO_USER: 'Receiver user not in hierarchy, transaction denied',
  ADMIN_TO_ADMIN: 'Receiver admin not in hierarchy, transaction denied',
  DAILY_LIMIT_NOT_FOUND: 'Set daily limit first to create site',
  DAILY_LIMIT_NOT_FOUND_SITE: 'Daily limit not set by admin',
  MAX_DAILY_LIMIT: 'Max daily limit for this currency is ',
  ORDER_ERROR: 'Send order for all sub categories.',
  SENDGRID_ERROR: 'Unable to send email.',
  REASON_REQUIRED: 'Reason is required to mark user in-active.',
  ELASTIC_CONNECTION: 'Unable to fetch data from elastic',
  CUSTOM_DATES_REQUIRED: 'Custom date options required dates',
  WAGERING_TYPE: 'Invalid wagering type selected.',
  LOYALTY_LEVEL_NOT_FOUND: 'Loyalty level settings not found',
  BONUS_ISSUE: 'Bonus cannot be issued.',
  BONUS_DELETE: 'Bonus cannot be deleted, issuer is different.',
  BONUS_PENDING: 'Bonus cannot be deleted, already activated by user.',
  BONUS_AVAIL: 'Bonus cannot be activated, try again later',
  EXTERNAL_API_ERROR: 'External api response error',
  SPINS_QUANTITY: 'Spins quantity must be less than 100',
  SPINS_VALIDITY: 'Days to clear should be less than 30',
  DELETE_PRIMARY_EMAIL: 'Cannot delete primary Email',
  SENDGRID_CREDENTIALS: 'Sendgrid credentials not found',
  PRIMARY_TEMPLATE_ERROR: 'Select other primary template',
  EMPTY_GALLERY: 'Image gallery empty',
  CREDENTIALS_NOT_FOUND: 'Send Grid credentials not found',
  LANGUAGE_NOT_SUBSET: 'Language should be as per allowed configuration',
  REMOVE_MONEY: 'Remove money amount is more than wallet balance',
  ELASTIC_DOWN: 'Elastic cluster is down !!',
  TRANSACTION_NOT_FOUND: 'Transaction details Not Found',
  EMMITTER_ERROR: 'Error in Emitter while emitting on User Wallet Balance'
}

export const RequestInputValidationErrorType = {
  name: 'RequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3001
}

export const ResponseValidationErrorType = {
  name: 'ResponseInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation failed please refer json schema of response',
  errorCode: 3002
}

export const SocketRequestInputValidationErrorType = {
  name: 'SocketRequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3003
}

export const SocketResponseValidationErrorType = {
  name: 'SocketResponseValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation of socket failed please refer json schema of response',
  errorCode: 3004
}

export const InternalServerErrorType = {
  name: 'InternalServerError',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  isOperational: true,
  description: 'Internal Server Error',
  errorCode: 3005
}

export const InvalidSocketArgumentErrorType = {
  name: 'InvalidSocketArgumentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please provide, proper arguments eventName, [payloadObject], and [callback]',
  errorCode: 3006
}

export const LoginErrorType = {
  name: 'AdminInActive',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: '',
  errorCode: 3007
}
export const UnAuthorizeUserErrorType = {
  name: 'UnAuthorize',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Unauthorized ',
  errorCode: 3008
}
export const AdminInActiveErrorType = {
  name: 'AdminInActive',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Admin Inactive',
  errorCode: 3009
}

export const AdminNotFoundErrorType = {
  name: 'AdminNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Admin not found',
  errorCode: 3010
}
export const WithdrawRequestNotFoundErrorType = {
  name: 'WithdrawRequestNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Withdrawal request not found.',
  errorCode: 3011
}
export const UserNotExistsErrorType = {
  name: 'UserNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User does not exists',
  errorCode: 3012
}
export const UserDocumentsNotFoundErrorType = {
  name: 'UserDocumentsNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Documents Not Found',
  errorCode: 3013
}
export const DailyLimitErrorType = {
  name: 'DailyLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Daily limit should be less than weekly and monthly limit',
  errorCode: 3014
}

export const WeeklyLimitErrorType = {
  name: 'WeeklyLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Weekly limit should be greater than daily limit and less than monthly limit',
  errorCode: 3015
}

export const MonthlyLimitErrorType = {
  name: 'MonthlyLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Monthly limit should be greater than daily limit and weekly limit',
  errorCode: 3016
}

export const LimitErrorType = {
  name: 'LimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Limit not found in the user',
  errorCode: 3017
}

export const SessionTimeLimitErrorType = {
  name: 'SessionTimeLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Session Time can be set between 1 to 24',
  errorCode: 3018
}

export const RemoveMoneyErrorType = {
  name: 'RemoveMoneyError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Remove money amount is more than wallet balance',
  errorCode: 3019
}

export const TransactionHandlerErrorType = {
  name: 'TransactionHandlerError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Transaction handler error ',
  errorCode: 3020
}

export const ActionNotAllowedErrorType = {
  name: 'ActionNotAllowed',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Action not allowed',
  errorCode: 3021
}

export const GroupNotFoundErrorType = {
  name: 'GroupNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Group Not found',
  errorCode: 3022
}

export const UserAlreadyExistErrorType = {
  name: 'UserAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User already exists',
  errorCode: 3023
}
export const IdRequiredErrorType = {
  name: 'IdRequired',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Id required',
  errorCode: 3024
}

export const CannotCreateAdminErrorType = {
  name: 'CannotCreateAdmin',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot Create Admin User',
  errorCode: 3025
}
export const PermissionDeniedErrorType = {
  name: 'PermissionDenied',
  statusCode: StatusCodes.NOT_ACCEPTABLE,
  isOperational: true,
  description: 'Permission Denied',
  errorCode: 3026
}

export const RoleNotFoundErrorType = {
  name: 'RoleNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Role Not found',
  errorCode: 3027
}
export const UserNameExistsErrorType = {
  name: 'UserNameExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Username already exists',
  errorCode: 3028
}

export const NotFoundErrorType = {
  name: 'NotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Record Not found',
  errorCode: 3029
}
export const PackageAlreadyExistErrorType = {
  name: 'PackageAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package already exists',
  errorCode: 3030
}
export const AmountInvalidErrorType = {
  name: 'AmountInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Amount require decimal or float ',
  errorCode: 3031
}
export const CmsExistsErrorType = {
  name: 'CmsAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cms with this slug already exists',
  errorCode: 3032
}
export const CmsNotFoundErrorType = {
  name: 'CmsNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cms not found',
  errorCode: 3033
}
export const InvalidIdErrorType = {
  name: 'InvalidId',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Id must be a number',
  errorCode: 3034
}
export const InvalidCoinAmountErrorType = {
  name: 'InvalidCoinAmount',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Coin amount should be valid',
  errorCode: 3035
}
export const InvalidAmountErrorType = {
  name: 'InvalidAmount',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Amount',
  errorCode: 3036
}
export const FileSizeTooLargeErrorType = {
  name: 'FileSizeTooLargeErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File size too large',
  errorCode: 3037
}
export const FileTypeNotSupportedErrorType = {
  name: 'FileTypeNotSupportedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File type not supported',
  errorCode: 3038
}
export const ImageUrlNotFoundErrorType = {
  name: 'ImageUrlNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Image url not found',
  errorCode: 3039
}
export const FileNotFoundErrorType = {
  name: 'FileNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File is required',
  errorCode: 3040
}
export const FailedToDeleteImageErrorType = {
  name: 'FailedToDeleteImage',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Unable to delete image from gallery',
  errorCode: 3041
}
export const BonusNameExistErrorType = {
  name: 'BonusNameExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus Name Exist',
  errorCode: 3042
}
export const DateErrorType = {
  name: 'DateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Date',
  errorCode: 3043
}
export const AmountErrorType = {
  name: 'AmountError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Must be valid amount',
  errorCode: 3044
}
export const InvalidNumberOfUserErrorType = {
  name: 'InvalidNumberOfUser',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Number Of User',
  errorCode: 3045
}
export const BonusNotExistErrorType = {
  name: 'BonusNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus Not Exist',
  errorCode: 3045
}

export const ToggleCaseInvalidErrorType = {
  name: 'ToggleCaseInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Toggle case value is invalid',
  errorCode: 3042
}
export const CaseInvalidErrorType = {
  name: 'CodeInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Code is invalid',
  errorCode: 3043
}
export const StatusInvalidErrorType = {
  name: 'StatusInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Status is invalid',
  errorCode: 3044
}
export const EmailTemplateNotFoundErrorType = {
  name: 'EmailTemplateNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template not found',
  errorCode: 3045
}
export const EmailTemplateCategoryNotFoundErrorType = {
  name: 'EmailTemplateCategoryNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template Category not found',
  errorCode: 3045
}
export const PrimaryEmailErrorType = {
  name: 'PrimaryEmail',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot delete primary email',
  errorCode: 3046
}

export const CredentialsNotFoundErrorType = {
  name: 'CredentialsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Credentials Not found',
  errorCode: 3047
}
export const InvalidPasswordErrorType = {
  name: 'InvalidPasswordErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Invalid old password',
  errorCode: 3048
}
export const InvalidNewPasswordErrorType = {
  name: 'InvalidNewPasswordErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Old and new password are same, Please use other new password',
  errorCode: 3049
}
export const CasinoProviderExistsErrorType = {
  name: 'CasinoProviderAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino provider already exists',
  errorCode: 3050
}
export const AggregatorNotFoundErrorType = {
  name: 'AggregatorNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Aggregator Not found',
  errorCode: 3051
}
export const CasinoProviderNotFoundErrorType = {
  name: 'CasinoProviderNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Casino provider Not found',
  errorCode: 3052
}
export const BannerNotFoundErrorType = {
  name: 'BannerNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Banner not found',
  errorCode: 3053
}
export const InvalidFileErrorType = {
  name: 'InvalidFile',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid File.',
  errorCode: 3154
}
export const GameCategoryNotExistsErrorType = {
  name: 'GameCategoryNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Category not exists',
  errorCode: 3055
}

export const GameSubCategoryNotExistsErrorType = {
  name: 'GameSubCategoryNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Sub Category not exists',
  errorCode: 3056
}

export const OrderInvalidErrorType = {
  name: 'OrderInvalidErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Order array invalid',
  errorCode: 3057
}

export const NameExistsErrorType = {
  name: 'NameExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Name Exist',
  errorCode: 3058
}
export const CasinoGameNotExistsErrorType = {
  name: 'CasinoGameNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Game not Exists',
  errorCode: 3059
}
export const GameSubCategoryNotFoundErrorType = {
  name: 'GameSubCategoryNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Game Sub Category not found',
  errorCode: 3060
}
export const CategoryGameNotFoundErrorType = {
  name: 'CategoryGameNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Category Games not found',
  errorCode: 3061
}
export const GameExistsErrorType = {
  name: 'GameExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game already exists',
  errorCode: 3062
}
export const CountryNotFoundErrorType = {
  name: 'CountryNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Country not found',
  errorCode: 3063
}
export const CountryIdNotFoundErrorType = {
  name: 'CountryIdNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Country Id not found',
  errorCode: 3064
}
export const ItemsNotFoundErrorType = {
  name: 'ItemsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Restricted items not found',
  errorCode: 3065
}
export const ItemsIdNotFoundErrorType = {
  name: 'ItemsIdNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Restricted items Id not found',
  errorCode: 3066
}
export const EmailTemplateExistsErrorType = {
  name: 'EmailTemplateExists',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template exists',
  errorCode: 3067
}
export const GameSubCategoryExistsErrorType = {
  name: 'GameSubCategoryExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Sub Category exists',
  errorCode: 3068
}
export const EmailTemplateNotAllowEditErrorType = {
  name: 'EmailTemplateNotAllowEdit',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template edit action not allow',
  errorCode: 3069
}
export const CasinoTransactionsNotFoundErrorType = {
  name: 'CasinoTransactionsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Casino transactions not found',
  errorCode: 3070
}
export const UserNotExistErrorType = {
  name: 'UserNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Not Exist',
  errorCode: 3071
}
export const CustomDateErrorType = {
  name: 'CustomDateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: ERROR_MSG.CUSTOM_DATES_REQUIRED,
  errorCode: 3072
}
export const FooterExistErrorType = {
  name: 'FooterExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Footer already exist',
  errorCode: 3073
}
export const TargetUrlRequiredErrorType = {
  name: 'TargetUrlRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Target Url Required For External CMS',
  errorCode: 3074
}
export const BonusTypeExistErrorType = {
  name: 'BonusTypeExist',
  statusCode: StatusCodes.CONFLICT,
  isOperational: true,
  description: 'Active daily bonus already exists',
  errorCode: 3075
}
export const SubChildExistErrorType = {
  name: 'SubChildExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Category has child Sub Categories',
  errorCode: 3076
}
export const GameCategoryNotFoundErrorType = {
  name: 'GameCategoryNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game Category not found',
  errorCode: 3077
}
export const BannerExistErrorType = {
  name: 'BannerExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Banner Type Exist',
  errorCode: 3078
}
export const BannerNameExistErrorType = {
  name: 'BannerNameExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Banner Name Exist',
  errorCode: 3079
}
export const TodayDateErrorType = {
  name: 'TodayDateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please select today or after today date',
  errorCode: 3080
}
export const BonusWelComeTypeExistErrorType = {
  name: 'BonusWelComeTypeExist',
  statusCode: StatusCodes.CONFLICT,
  isOperational: true,
  description: 'Welcome bonus already exists',
  errorCode: 3081
}
export const BonusExistErrorType = {
  name: 'BonusExist',
  statusCode: StatusCodes.CONFLICT,
  isOperational: true,
  description: 'Bonus already exists',
  errorCode: 3082
}
export const InvalidAssetURLErrorType = {
  name: 'InvalidAsset',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Asset URL must be valid URI',
  errorCode: 3083
}
export const UploadErrorErrorType = {
  name: 'UploadError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Upload Error',
  errorCode: 3084
}
export const BonusValidationFailErrorType = {
  name: 'BonusValidationFail',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus CC or SC does not equal 0 .',
  errorCode: 3085
}
export const FeaturedSubCategoryExists = {
  name: 'FeaturedSubCategoryExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Maximum featured sub category limit exceeded.',
  errorCode: 3086
}
export const UserResponsibleSettingNotExistType = {
  name: 'UserResponsibleSettingNotExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User responsible setting not available',
  errorCode: 3087
}
export const SelfExclusionRequireType = {
  name: 'SelfExclusionRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'selfExclusion require self exclusion type',
  errorCode: 3088
}
export const SessionReminderTimeRequireType = {
  name: 'SessionReminderTimeRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'sessionReminder require for session type',
  errorCode: 3089
}
export const TimeBreakDurationRequireType = {
  name: 'TimeBreakDurationRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'timeBreakDuration require for session TIME BREAK type',
  errorCode: 3090
}
export const CsvFileErrorType = {
  name: 'CsvFileErrorType',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Invalid csv file',
  errorCode: 3091
}
export const PostalBonusErrorType = {
  name: 'PostalBonusErrorType',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Before uploading csv please configure AMOE deposit bonus',
  errorCode: 3092
}
export const SendEmailError = {
  name: 'SendEmailError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Failed to send mail',
  errorCode: 3093
}
export const PackageTypeAndColorRequiredErrorType = {
  name: 'PackageTypeAndColorRequiredErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package type, and colors are required',
  errorCode: 3094
}
export const HacksawError = {
  name: 'HacksawError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Unable to call one game hub api',
  errorCode: 3095
}
export const PreviousAmountErrorType = {
  name: 'PreviousAmountErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Previous Amount should be greater than current amount',
  errorCode: 3096
}
export const PasswordValidationFailedError = {
  name: 'PasswordValidationFailedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Your password should contain at least 10 characters, one upper case letter, one lower case letter, one number, and one special character.',
  errorCode: 3097
}
export const WrongPhoneVerificationError = {
  name: 'WrongPhoneVerificationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Wrong Phone Verification Type either phone is already Verified/Unverified',
  errorCode: 3098
}
export const UserNotLockedErrorType = {
  name: 'UserNotLockedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Already Unlocked',
  errorCode: 3099
}
export const TransactionsNotFoundErrorType = {
  name: 'TransactionsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Transactions not found',
  errorCode: 3100
}
export const InsufficientScBalanceError = {
  name: 'InsufficientScBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient SC Balance',
  errorCode: 3101
}
export const InsufficientGcBalanceError = {
  name: 'InsufficientGcBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient GC Balance',
  errorCode: 3102
}
export const InvalidSsnLengthError = {
  name: 'InvalidSsnLengthError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'SSN Number length should be 9 ',
  errorCode: 3103
}

export const AlreadyTestUserErrorType = {
  name: 'AlreadyTestUser',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Can not update this User because this is already a Test user',
  errorCode: 3104
}

export const ActivityLogErrorType = {
  name: 'ActivityLogNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Activity log not found',
  errorCode: 3105
}
export const UserAllReadyLogoutType = {
  name: 'UserAllReadyLogout',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User all ready logout',
  errorCode: 3106
}

export const DailyLimitExceedsWeeklyLimitType = {
  name: 'DailyLimitExceedsWeeklyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Daily Limit Exceeds Weekly Limit',
  errorCode: 3187
}

export const DailyLimitExceedsMonthlyLimitType = {
  name: 'DailyLimitExceedsMonthlyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Daily Limit Exceeds Monthly Limit',
  errorCode: 3187
}

export const WeeklyLimitLessThanDailyLimitType = {
  name: 'WeeklyLimitLessThanDailyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Weekly Limit Less Than Daily Limit',
  errorCode: 3187
}

export const WeeklyLimitExceedsMonthlyLimitType = {
  name: 'WeeklyLimitExceedsMonthlyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Weekly LimitExceeds Monthly Limit',
  errorCode: 3187
}

export const MonthlyLimitLessThanDailyLimitType = {
  name: 'MonthlyLimitLessThanDailyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Monthly Limit Less Than Daily Limit',
  errorCode: 3187
}

export const MonthlyLimitLessThanWeeklyLimitType = {
  name: 'MonthlyLimitLessThanWeeklyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Monthly Limit Less Than Weekly Limit',
  errorCode: 3187
}

export const GroupIdCountryIdRequireType = {
  name: 'GroupIdCountryIdRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'groupId or countryId require',
  errorCode: 3188
}

export const IsEmailIsRestrictIsAlertRequireType = {
  name: 'IsEmailIsRestrictIsAlertRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'isEmail isType isRestrict require',
  errorCode: 3189
}

export const ProviderIdRequireType = {
  name: 'ProviderIdRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'providerId require',
  errorCode: 3190
}

export const SingleAmountSumAmountRequireType = {
  name: 'SingleAmountSumAmount',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'singleAmount or sumAmount require',
  errorCode: 3191
}

export const DaysRequireType = {
  name: 'DaysRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'days require',
  errorCode: 3191
}

export const GroupIdNoTExistType = {
  name: 'GroupIdNoTExist',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'group id not exist',
  errorCode: 3192
}

export const WithSameIpWithSameDeviceRequireType = {
  name: 'WithSameIpWithSameDeviceRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'withSameIp or withSameDevice require',
  errorCode: 3193
}

export const IsDuplicateIsSameAddressRequireType = {
  name: 'IsDuplicateIsSameAddressRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'isDuplicate or isSameAddress require',
  errorCode: 3194
}

export const ActivityDoesNotExistType = {
  name: 'ActivityDoesNotExist',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'activity does not exist',
  errorCode: 3195
}

export const OtpVerificationFailedErrorType = {
  name: 'InvalidToken',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid otp',
  errorCode: 3107
}
export const TicketNotFoundType = {
  name: 'TicketNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Player Ticket not found',
  errorCode: 3107
}
export const TicketResolvedType = {
  name: 'TicketResolved',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Player Ticket is Resolved',
  errorCode: 3108
}
export const TicketNotAssignedType = {
  name: 'TicketNotAssigned',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This ticket is not assigned to this admin.',
  errorCode: 3108
}

export const SingleAmountSumAmountCountRequireType = {
  name: 'SingleAmountSumAmountCount',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'singleAmount or sumAmount or count require',
  errorCode: 3191
}

export const PageAlreadyExistErrorType = {
  name: 'PageAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Page already exists',
  errorCode: 3196
}

export const PageNotFoundErrorType = {
  name: 'PageNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Page not found',
  errorCode: 3197
}

export const InvalidAssetValueErrorType = {
  name: 'InvalidAssetValue',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid asset value',
  errorCode: 3198
}

export const AssetKeyAlreadyExistErrorType = {
  name: 'AssetKeyAlreadyExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Asset key already exist',
  errorCode: 3198
}

export const AssetKeyNotFoundErrorType = {
  name: 'AssetKeyNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Asset key not found',
  errorCode: 3199
}

export const CoinsUsedErrorType = {
  name: 'CoinsUsedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Coins used by player, cannot void/refund the transaction amount',
  errorCode: 3200
}

export const VipTierAlreadyExistErrorType = {
  name: 'VipTierAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'VipTier Level already exists',
  errorCode: 3201
}

export const VipTierNotFoundErrorType = {
  name: 'VipTierNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'VipTier not found',
  errorCode: 3202
}

export const PackageNotFoundErrorType = {
  name: 'PackageNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Package not found',
  errorCode: 3202
}

export const CannotRemoveDefaultTierErrorType = {
  name: 'CannotRemoveDefaultTierErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Default VIP Tier cannot be removed!',
  errorCode: 3203
}

export const PopupNotFoundErrorType = {
  name: 'PopupNotFoundErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Popup Not Found',
  errorCode: 3204
}

export const DuplicateProductErrorType = {
  name: 'DuplicateProductErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Duplicate Product Found',
  errorCode: 3205
}

export const StockNotFoundErrorType = {
  name: 'StockNotFoundErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Stock is In active',
  errorCode: 3206
}
