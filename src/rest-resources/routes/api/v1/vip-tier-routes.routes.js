import express from 'express'
import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import VipTierController from '../../../controllers/vip-tier-routes.controller'
import multer from 'multer'

const upload = multer()
const vipTierRoutes = express.Router()

const getVipTierDetailsSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: 'number' },
      pageNo: { type: 'number' },
      search: { type: 'string' },
      orderBy: { type: ['string', 'null'] },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      isActive: {
        type: 'string',
        enum: ['true', 'false']
      },
      liveSupport: {
        type: 'string',
        enum: ['true', 'false']
      }
    },
    required: []
  }
}

const getVipTierDetailByIdSchema = {
  querySchema: {
    type: 'object',
    properties: {
      vipTierId: { type: 'string', pattern: '^[0-9]+$' }
    },
    required: ['vipTierId']
  }
}

const addVipTierSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      boost: { type: 'string' },
      rakeback: { type: 'string' },
      bonusSc: { type: 'string' },
      bonusGc: { type: 'string' },
      level: { type: 'string' },
      scRequiredPlay: { type: 'string' },
      scRequiredMonth: { type: 'string' },
      gcRequiredPurchase: { type: 'string' },
      gcRequiredMonth: { type: 'string' },
      icon: { type: ['object', 'null'] },
      gradualLoss: { type: 'string' },
      liveSupport: { type: 'string', enum: ['true', 'false'] },
      isActive: { type: 'string', enum: ['true', 'false'] }
    },
    required: [
      'name',
      'boost',
      'rakeback',
      'level',
      'bonusSc',
      'bonusGc',
      'scRequiredPlay',
      'scRequiredMonth',
      'gcRequiredPurchase',
      'gcRequiredMonth'
    ]
  }
}

const deleteVipTierSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      vipTierId: { type: 'integer' }
    },
    required: ['vipTierId']
  }
}

const editVipTierDetailsSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      vipTierId: { type: 'string' },
      name: { type: 'string' },
      boost: { type: 'string' },
      rakeback: { type: 'string' },
      bonusSc: { type: 'string' },
      bonusGc: { type: 'string' },
      level: { type: 'string' },
      scRequiredPlay: { type: 'string' },
      scRequiredMonth: { type: 'string' },
      gcRequiredPurchase: { type: 'string' },
      gcRequiredMonth: { type: 'string' },
      icon: { type: ['object', 'null'] },
      gradualLoss: { type: 'string' },
      liveSupport: { type: 'string' }
      // isActive: {
      //   type: 'string',
      //   enum: ['true', 'false']
      // }
    }
    // required: [
    //   'vipTierId',
    //   'name',
    //   'boost',
    //   'rakeback',
    //   'bonusSc',
    //   'bonusGc',
    //   'scRequiredPlay',
    //   'scRequiredMonth',
    //   'gcRequiredPurchase',
    //   'gcRequiredMonth',
    //   'gradualLoss',
    //   'liveSupport'
    // ]
  }
}

const updateVipTierServiceStatusSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      vipTierId: { type: 'integer' },
      isActive: { enum: [true, false] }
    },
    required: ['vipTierId', 'isActive']
  }
}

vipTierRoutes
  .route('/')
  .post(
    upload.single('icon'),
    requestValidationMiddleware(addVipTierSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    VipTierController.addVipTier,
    responseValidationMiddleware({})
  )
  .get(
    requestValidationMiddleware(getVipTierDetailsSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    VipTierController.getVipTiers,
    responseValidationMiddleware({})
  )
  .put(
    upload.single('icon'),
    requestValidationMiddleware(editVipTierDetailsSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    VipTierController.editVipTier,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware(deleteVipTierSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    VipTierController.deleteVipTier,
    responseValidationMiddleware({})
  )

vipTierRoutes
  .route('/details')
  .get(
    requestValidationMiddleware(getVipTierDetailByIdSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    VipTierController.getVipTierDetails,
    responseValidationMiddleware({})
  )

vipTierRoutes
  .route('/status')
  .put(
    requestValidationMiddleware(updateVipTierServiceStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    VipTierController.updateVipTierStatus,
    responseValidationMiddleware({})
  )

export default vipTierRoutes
