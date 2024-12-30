import { includes } from "lodash";
import ServiceBase from "../../libs/serviceBase";
import { ACTION_TYPE, STOCK_TRANSACTION_TYPE } from "../../utils/constants/constant";
import { SUCCESS_MSG } from "../../utils/constants/success";

export default class StockLogs extends ServiceBase {
	async run() {
		const {
			dbModels: {
				Product: ProductModel,
				Stock: StockModel,
				StockLogs: StockLogModel,
				AdminUser: AdminUserModel
			}
		} = this.context

		const {
			productId,
			stockId,
			ownerId,
			actionType
		} = this.args

		let query = {}
		// if(productId){
		// 	query = {
		// 		...query,
		// 		productId
		// 	}
		// }

		if(stockId) query = {...query, stockId}
		if(ownerId) query = {...query, ownerId}
		if(actionType) query =  {...query, actionType : (actionType === ACTION_TYPE.CREDIT ? STOCK_TRANSACTION_TYPE.CREDIT : STOCK_TRANSACTION_TYPE.DEBIT)}


		const stockLogsList = await StockLogModel.findAll({
			where: query,
			include: [{
				model: StockModel,
				...(productId ? { where: { productId } } : {}),
				include: {
					model: ProductModel,
					as: 'product'
				}

			}, {
				model: AdminUserModel,
				attributes: ['firstName', 'lastName']
			}],
			order: [['updatedAt', 'DESC']]
		})

		return {
			stockLogsList,
			message: SUCCESS_MSG.GET_SUCCESS
		}


	}
}