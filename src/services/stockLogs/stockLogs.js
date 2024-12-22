import ServiceBase from "../../libs/serviceBase";

export default class StockLogs extends ServiceBase {
	async run() {
		const {
			dbModels: {
				Product: ProductModel,
				Stock: StockModel,
				StockLogs: StockLogModel
			}
		} = this.context

		



	}
}