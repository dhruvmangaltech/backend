import ServiceBase from "../../libs/serviceBase";
import { ACTION_TYPE, STOCK_TRANSACTION_TYPE, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../utils/constants/constant";
import { SUCCESS_MSG } from "../../utils/constants/success";

export default class UpdateStocks extends ServiceBase {
	async run() {
		const {
			dbModels: {
				Product: ProductModel,
				Stock: StockModel,
				StockLogs: StockLogModel
			}
		} = this.context

		const transaction = this.context.sequelizeTransaction

		const {
			stockId,
			id,
			actionType,
			amount
		} = this.args

		const stockDetail = await StockModel.findOne({
			where: { stockId },
			lock: { level: transaction.LOCK.UPDATE, of: StockModel },
			include: {
				model: ProductModel,
				as: 'product',
				attributes: ['isActive'],
				where: { isActive: true },
				required: true
			},
			transaction
		})

		if(!stockDetail){
			return this.addError('StockNotFoundErrorType')
		}

		const beforeBalance = stockDetail.amount

		if(actionType === ACTION_TYPE.CREDIT) stockDetail.amount += amount
		if(actionType === ACTION_TYPE.DEBIT) stockDetail.amount -= amount

		const log = {
			actioneeId: +id,
			actionType: actionType === ACTION_TYPE.CREDIT ? STOCK_TRANSACTION_TYPE.CREDIT : STOCK_TRANSACTION_TYPE.DEBIT ,
			actionId: actionType,
			stockId,
			status: TRANSACTION_STATUS.SUCCESS,
			beforeBalance,
			afterBalance: stockDetail.amount
		}

		await StockLogModel.create(log, {transaction})

		await stockDetail.save({transaction})

		return {
			updatedStock: stockDetail,
			message: SUCCESS_MSG.UPDATE_SUCCESS
		}

	}
}