import ServiceBase from "../../libs/serviceBase";
import { SUCCESS_MSG } from "../../utils/constants/success";

export default class UpdateProduct extends ServiceBase {
	async run() {
		const {
			dbModels: {
				Product: ProductModel
			}
		} = this.context

		const transaction = this.context.sequelizeTransaction

		try{
		const {
			productId,
			name,
			colour,
			isActive,
			scale,
			size,
			description
		} = this.args

		const product = await ProductModel.update({
			name,
			colour,
			isActive,
			sclae: scale,
			size,
			description
		}, {
			where: {
				productId
			}
		}, {
			transaction
		})

		transaction.commit()
		return {
			updatedProduct: product,
			message: SUCCESS_MSG.UPDATE_SUCCESS
		}
	}catch(e){
		transaction.rollback()
		this.addError('InternalServerErrorType', error)
	}

	}
}