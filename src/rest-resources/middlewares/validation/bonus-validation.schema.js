import { BONUS_TYPE } from '../../../utils/constants/constant'

export const getBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      search: { type: ['string', 'null'] },
      isActive: { enum: ['true', 'false', 'null'] },
      sort: { type: ['string', 'null'] },
      orderBy: { type: ['string', 'null'] },
      bonusId: { type: ['string', 'null'] },
      bonusType: {
        enum: [
          'sc',
          'freespin',
          'gc',
          'both',
          'daily bonus',
          'welcome bonus',
          'AMOE Deposit'
        ]
      }
    }
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        bonus: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'bonus', 'success']
    }
  }
}

/* const createBonusObject = {
  type: 'object',
  properties: {
    bonusName: { type: 'string' },
    day: { type: 'number' },
    startDate: { type: 'string' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    fsAmount: { type: 'number' },
    description: { type: 'string' },
    isActive: {
      type: 'boolean',
      enum: [true, false]
    }
  },
  required: ['bonusName', 'startDate', 'description', 'isActive']
} */

export const createBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusType: { enum: Object.values(BONUS_TYPE) },
      bonuses: { type: ['string', 'object', 'array'] },
      day_1_images: { type: ['object'] },
      day_2_images: { type: ['object'] },
      day_3_images: { type: ['object'] },
      day_4_images: { type: ['object'] },
      day_5_images: { type: ['object'] },
      day_6_images: { type: ['object'] },
      day_7_images_cc: { type: ['object'] },
      day_7_images_gc: { type: ['object'] }
    },
    required: ['bonusType']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        error: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const updateBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusId: { type: 'string' },
      bonusName: { type: 'string' },
      bonusType: { enum: Object.values(BONUS_TYPE) },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      gcAmount: { type: 'number' },
      scAmount: { type: 'number' },
      fsAmount: { type: 'number' },
      isActive: { type: 'boolean' },
      isUnique: { type: 'boolean' },
      minimumPurchase: { type: 'string' },
      percentage: { type: 'string' },
      description: { type: 'string' },
      numberOfUser: { type: 'number' },
      day: { type: 'number' },
      image: { type: 'object' }
    },
    required: []
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}

export const deleteBonusSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      bonusId: { type: 'string' }
    },
    required: ['bonusId']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const statusBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusId: { type: 'number' },
      isActive: { enum: [true, false] }
    },
    required: ['isActive', 'bonusId']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}
