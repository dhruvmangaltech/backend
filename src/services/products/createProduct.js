import ServiceBase from "../../libs/serviceBase";
import { ACTION_TYPE, STOCK_TRANSACTION_TYPE, TRANSACTION_STATUS } from "../../utils/constants/constant";
import { SUCCESS_MSG } from "../../utils/constants/success";
import { getOne } from "../../utils/crud";

export default class CreateProductService extends ServiceBase {
	async run() {
		const {
			dbModels: {
				Product: ProductModel,
				Stock: StockModel,
				StockLogs: StockLogModel
			}
		} = this.context

		const {
			id,
			name,
			colour,
			size,
			scale,
			description,
			isActive
		} = this.args

		const transaction = this.context.sequelizeTransaction

		try {
			const productData = await getOne({
				model: ProductModel,
				data: {
					name,
					colour,
					size,
					sclae: scale,
					description,
					ownerId: id,
				},
				transaction
			})

			if(productData){
				return this.addError('DuplicateProductErrorType')
			}

			const product = await ProductModel.create({
				name,
				colour,
				size,
				sclae: scale,
				description,
				ownerId: id,
				isActive
			}, { transaction })

			const stock = await StockModel.create({
				amount: 0,
				ownerId: id,
				productId: product.productId
			}, {transaction})

			await StockLogModel.create({
				actioneeId: id,
				actionType: STOCK_TRANSACTION_TYPE.CREDIT,
				actionId: ACTION_TYPE.CREDIT,
				stockId: stock.stockId,
				status: TRANSACTION_STATUS.SUCCESS,
				beforeBalance: 0,
				afterBalance: 0
			}, {transaction})

			transaction.commit()

			return {
				createProduct: {
					product: {
						...product.dataValues,
						stock
					}
				},
				message: SUCCESS_MSG.CREATE_SUCCESS
			}
		} catch (e) {
			transaction.rollback()
			throw e
		}

	}
}