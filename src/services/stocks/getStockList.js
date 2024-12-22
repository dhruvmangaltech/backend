import { includes } from "lodash";
import ServiceBase from "../../libs/serviceBase";
import { SUCCESS_MSG } from "../../utils/constants/success";

export default class GetStockList extends ServiceBase {
	async run() {
		const {
			dbModels: {
				Product: ProductModel,
				Stock: StockModel,
				StockLogs: StockLogModel
			}
		} = this.context

		const {
			stockId
		} = this.args

		let stocks

		if (stockId) {
			stocks = await StockModel.findOne({
				where: {
					stockId
				},
				include: {
					model: ProductModel,
					as: 'product',
					attributes: ['isActive'],
					where: { isActive: true },
					required: true
				}
			})
		} else {
			stocks = await StockModel.findAndCountAll({
				include: {
					model: ProductModel,
					as: 'product',
					attributes: ['isActive'],
					where: { isActive: true },
					required: true
				}
			})
		}

		return {
			stockList: stocks || {},
			message: SUCCESS_MSG.GET_SUCCESS
		}
	}
}