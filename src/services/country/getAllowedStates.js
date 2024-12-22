import ServiceBase from "../../libs/serviceBase";
import RedisClient from "../../libs/redisClient";
import { SUCCESS_MSG } from "../../utils/constants/success";
import { GetStateService } from "./getState";

export default class GetAllowedStates extends ServiceBase {
	async run() {
		const cacheKey = 'allowed_states';
		const data = await RedisClient.client.get(cacheKey);
		if (data?.length) {
			return { success: true, data: JSON.parse(data), message: SUCCESS_MSG.GET_SUCCESS }
		}
		else {
			const { result } = await GetStateService.execute({ countryCode: 'US' }, this.context)
			return result
		}
	}
}