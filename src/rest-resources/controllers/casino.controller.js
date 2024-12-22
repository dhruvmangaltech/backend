import { sendResponse } from '../../utils/response.helpers'
import {
  CreateCasinoProvider,
  UpdateCasinoProviderService,
  GetMasterCasinoProvidersService,
  DeleteCasinoProviderService
} from '../../services/casinoProvider'

import {
  CreateGameCategoryService,
  UpdateGameCategoryService,
  GetAllGameCategoryService,
  OrderGameCategoryService,
  DeleteGameCategoryService
} from '../../services/casinoCategory'

import {
  GetSubCategoryList,
  CreateSubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
  OrderSubCategory
} from '../../services/subCategory'

import {
  CreateGameService,
  UpdateCasinoGameService,
  GetCasinoGamesService,
  GetAllCasinoGamesService,
  OrderCategoryGamesService,
  DeleteCategoryGameService
} from '../../services/casinoGame'

import {
  GetCasinoTransactionsService
} from '../../services/casinoTransaction'

export default class CasinoController {
  static async createCasinoProvider (req, res, next) {
    try {
      const { result, successful, errors } = await CreateCasinoProvider.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateCasinoProvider (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCasinoProviderService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCasinoProvider (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteCasinoProviderService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllProviders (req, res, next) {
    try {
      const { result, successful, errors } = await GetMasterCasinoProvidersService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createCasinoCategory (req, res, next) {
    try {
      const { result, successful, errors } = await CreateGameCategoryService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateCasinoCategory (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateGameCategoryService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGameCategory (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllGameCategoryService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateOrderCasinoCategory (req, res, next) {
    try {
      const { result, successful, errors } = await OrderGameCategoryService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCasinoCategory (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteGameCategoryService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await GetSubCategoryList.execute({ ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await CreateSubCategory.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateSubCategory.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteSubCategory.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async orderSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await OrderSubCategory.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await CreateGameService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await GetCasinoGamesService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllCasinoGamesService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCasinoGameService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateOrderGame (req, res, next) {
    try {
      const { result, successful, errors } = await OrderCategoryGamesService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteCategoryGameService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCasinoTransactions (req, res, next) {
    try {
      const { result, successful, errors } = await GetCasinoTransactionsService.execute({ ...req.body, ...req.query })

      if (result.csv) {
        res.header('Content-Type', 'text/csv')
        res.attachment(result.fileName)
        return res.send(result.csvData)
      }
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
