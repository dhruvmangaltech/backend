import ServiceBase from "../../libs/serviceBase";
import db from '../../db/models'
import { SUCCESS_MSG } from "../../utils/constants/success";

export default class GetSingleProduct extends ServiceBase {
    async run () {
        const {
            productId
        } = this.args

        const product = await db.Product.findOne({
            where: {
                productId
            },
            include: [{ model: db.Stock, as: 'stocks'}]
        })

        return { product, message: SUCCESS_MSG.GET_SUCCESS }

    }
}