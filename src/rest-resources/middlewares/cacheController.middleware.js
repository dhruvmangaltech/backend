import RedisClient from "../../libs/redisClient"
export default async function cacheController(req, res, next) {
    const keys = await RedisClient.client.keys("casino-subcategory*")
    keys.forEach(element => {
        RedisClient.client.del(element)
    })

    next()
}