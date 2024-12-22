import { sendResponse } from '../../utils/response.helpers'
import { GetPackageList, CreatePackage, UpdatePackage, OrderPackageService, GetPackageTypeService, UpdatePackageStatusService } from '../../services/package'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import CreateProductService from '../../services/products/createProduct'
import { GetProductList } from '../../services/products/getProductList'
import UpdateProduct from '../../services/products/updateProduct'
import GetStockList from '../../services/stocks/getStockList'
import UpdateStocks from '../../services/stocks/updateStocks'

export default class StockController {
    static async getList (req, res, next) {
      try {
        const { result, successful, errors } = await GetStockList.execute({ ...req.body, ...req.query }, req.context)
        sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      } catch (error) {
        next(error)
      }
    }
  
    static async create (req, res, next) {
      try {
        const { result, successful, errors } = await CreateProductService.execute({ ...req.body },
          req.context)
        sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      } catch (error) {
        next(error)
      }
    }
  
    static async update (req, res, next) {
      try {
        const { result, successful, errors } = await UpdateStocks.execute({ ...req.body, image: req.file }, req.context)
        sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      } catch (error) {
        next(error)
      }
    }
  
    static async packageTypes (req, res, next) {
      try {
        const { result, successful, errors } = await GetPackageTypeService.execute()
        sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      } catch (error) {
        next(error)
      }
    }
  
    static async updatePackageStatus (req, res, next) {
      try {
        const { result, successful, errors } = await UpdatePackageStatusService.execute({ ...req.body, ...req.query }, req.context)
        sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      } catch (error) {
        next(error)
      }
    }
  }
  