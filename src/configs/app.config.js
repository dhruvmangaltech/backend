import convict from 'convict'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))

  for (const key in envConfig) {
    process.env[key] = envConfig[key]
  }
}

const config = convict({
  app: {
    name: {
      doc: 'Name of the service',
      format: String,
      default: 'ssweeperCasino-admin-backend'
    },
    url: {
      doc: 'URL of the service',
      format: String,
      default: 'user-backend:8003',
      env: 'APP_URL'
    },
    appName: {
      doc: 'Name of the application',
      format: String,
      default: 'BitPlay',
      env: 'APP_NAME'
    }
  },

  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },

  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT'
  },

  origin: {
    doc: 'cors origin',
    format: String,
    default: 'true',
    env: 'ORIGIN'
  },

  db: {
    name: {
      doc: 'Database Name',
      format: String,
      default: 'api',
      env: 'DB_NAME'
    },
    username: {
      doc: 'Database user',
      format: String,
      default: 'postgres',
      env: 'DB_USERNAME'
    },
    password: {
      doc: 'Database password',
      format: '*',
      default: 'postgres',
      env: 'DB_PASSWORD'
    },
    readHost: {
      doc: 'DB read host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_READ_HOST'
    },
    writeHost: {
      doc: 'DB write host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_WRITE_HOST'
    },
    port: {
      doc: 'DB PORT',
      format: 'port',
      default: '5432',
      env: 'DB_PORT'
    }
  },
  logConfig: {
    maxSize: {
      default: '50m',
      env: 'WINSTON_LOG_MAX_SIZE'
    },
    maxFiles: {
      default: '10d',
      env: 'WINSTON_MAX_FILES_DURATION'
    },
    dirname: {
      default: 'logs',
      env: 'WINSTON_LOG_DIR'
    },
    datePattern: {
      default: 'YYYY-MM-DD-HH',
      env: 'WINSTON_FILE_NAME_DATE_PATTERN'
    },
    zippedArchive: {
      default: true,
      env: 'WINSTON_ZIPPED_ARCHIVE'
    }
  },
  redis_db: {
    password: {
      doc: 'Redis Database password',
      format: '*',
      default: '',
      env: 'REDIS_DB_PASSWORD'
    },
    host: {
      doc: 'Redis DB host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_DB_HOST'
    },
    port: {
      doc: 'Redis DB PORT',
      format: 'port',
      default: 6379,
      env: 'REDIS_DB_PORT'
    }
  },

  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },
  jwt: {
    loginTokenSecret: {
      default: '',
      env: 'JWT_LOGIN_SECRET'
    },
    loginTokenExpiry: {
      default: '2d',
      env: 'JWT_LOGIN_TOKEN_EXPIRY'
    },
    verificationTokenSecret: {
      default: '',
      env: 'VERIFICATION_TOKEN_SECRET'
    },
    verificationTokenExpiry: {
      default: '120s',
      env: 'VERIFICATION_TOKEN_EXPIRY'
    },
    secretKey: {
      default: '',
      env: 'SECRET_KEY'
    },
    resetPasswordKey: {
      default: '',
      env: 'RESET_PASSWORD_KEY'
    },
    resetPasswordExpiry: {
      default: '',
      env: 'RESET_PASSWORD_EXPIRY'
    }
  },
  hacksawConfig: {
    hacksawGameUrl: {
      default: '',
      env: 'HACKSAW_GAME_URL'
    },
    hacksawPartnerId: {
      default: '',
      env: 'HACK__PARTNER_ID'
    }
  },
  betsoftConfig: {
    betsoftGameUrl: {
      default: '',
      env: 'BETSOFT_GAME_URL'
    },
    betsoftBankId: {
      default: '',
      env: 'BETSOFT_BANK_ID'
    }
  },
  elastic: {
    url: {
      default: '',
      env: 'ELASTIC_URL'
    },
    id: {
      default: '',
      env: 'ELASTIC_CLOUD_ID'
    },
    user: {
      default: '',
      env: 'ELASTIC_USER'
    },
    password: {
      default: '',
      env: 'ELASTIC_PASSWORD'
    },
    httpCrtPath: {
      default: '',
      env: 'ELASTIC_HTTP_CRT_PATH'
    }
  },
  s3: {
    region: {
      doc: 'Region where s3 located.',
      format: String,
      default: 'us-east-1',
      env: 'S3_REGION'
    },
    bucket: {
      doc: 'Bucket used in S3',
      format: String,
      default: '',
      env: 'S3_BUCKET'
    },
    access_key_id: {
      doc: 'Access key for s3.',
      format: String,
      default: '',
      env: 'S3_ACCESS_KEY_ID'
    },
    secret_access_key: {
      doc: 'Secret key for s3.',
      format: String,
      default: '',
      env: 'S3_SECRET_ACCESS_KEY'
    },
    S3_DOMAIN_KEY_PREFIX: {
      doc: 'S3 domain PREFIX key for s3.',
      format: String,
      default: '',
      env: 'S3_DOMAIN_KEY_PREFIX'
    }
  },
  credentialEncryptionKey: {
    default: '',
    env: 'CREDENTIAL_ENCRYPTION_KEY'
  },
  jobSchedulerAddress: {
    default: '',
    env: 'JOB_SCHEDULER_ADDRESS'
  },

  kycVerification: {
    veriffUrl: {
      default: '',
      env: 'VERIFF_URL'
    },
    veriffSecretKey: {
      default: '',
      env: 'VERIFF_SECRET_KEY'
    },
    veriffApiKey: {
      default: '',
      env: 'VERIFF_API_KEY'
    }
  },

  payment: {
    tripleA: {
      url: {
        default: '',
        env: 'TRIPLE_A_URL'
      },
      clientId: {
        default: '',
        env: 'TRIPLE_A_CLIENT_ID'
      },
      clientSecret: {
        default: '',
        env: 'TRIPLE_A_CLIENT_SECRET'
      },
      refundClientId: {
        default: '',
        env: 'TRIPLE_A_REFUND_CLIENT_ID'
      },
      refundClientSecret: {
        default: '',
        env: 'TRIPLE_A_REFUND_CLIENT_SECRET'
      },
      merchantKey: {
        default: '',
        env: 'TRIPLE_A_MERCHANT_KEY'
      },
      merchantName: {
        default: '',
        env: 'TRIPLE_A_MERCHANT_NAME'
      },
      merchantCountry: {
        default: '',
        env: 'TRIPLE_A_MERCHANT_COUNTRY'
      }
    },
    paynote: {
      url: {
        default: '',
        env: 'PAYNOTE_URL'
      },
      secretKey: {
        default: '',
        env: 'PAYNOTE_SECRET_KEY'
      }
    },
    prizeout: {
      secretKey: {
        default: '',
        env: 'PRIZEOUT_SECRET_KEY'
      },
      partnerId: {
        default: '',
        env: 'PRIZEOUT_PARTNER_ID'
      },
      apiKey: {
        default: '',
        env: 'PRIZEOUT_API_KEY'
      },
      requestURL: {
        default: '',
        env: 'PRIZEOUT_REQUEST_URL'
      }
    }
  },

  adminBeUrl: {
    default: '',
    env: 'ADMIN_BE_URL'
  },

  customerio: {
    siteId: {
      doc: 'site idt',
      format: String,
      default: '',
      env: 'SITE_ID'
    },
    trackApiKey: {
      doc: 'track api key',
      format: String,
      default: '',
      env: 'TRACK_API_KEY'
    },
    appApiKey: {
      doc: 'track api key',
      format: String,
      default: '',
      env: 'APP_API_KEY'
    }
  },

  userFrontendUrl: {
    doc: 'User Frontend Url',
    format: String,
    default: '',
    env: 'USER_FRONTEND_URL'
  },

  casimbaConfig: {
    casimbaGameUrl: {
      default: '',
      env: 'CASIMBA_GAME_URL'
    },
    casimbaAuthKey: {
      default: '',
      env: 'CASIMBA_AUTH_KEY'
    },
    casimbaSkinCode: {
      default: '',
      env: 'CASIMBA_SKIN_CODE'
    }
  },
  alea: {
    casino_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_ID'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_KEY'
    },
    secret_token: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_TOKEN'
    }
  }
})

config.validate({ allowed: 'strict' })

export default config
