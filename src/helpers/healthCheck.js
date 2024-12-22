import { sequelize } from '../db/models'
import Logger from '../libs/logger'
import RedisClient from '../libs/redisClient'
import { elasticClient } from '../libs/elasticClient'
import { ERRORS } from '../utils/constants/errors'
import { SUCCESS_MSG } from '../utils/constants/success'

export default async () => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: ERRORS.SERVICE_FAILED,
    cache: ERRORS.SERVICE_FAILED,
    search: ERRORS.SERVICE_FAILED,
    server: SUCCESS_MSG.HEALTHCHECK_SUCCESS
  }

  try {
    await sequelize.authenticate()

    healthCheck.database = SUCCESS_MSG.HEALTHCHECK_SUCCESS
  } catch (error) {
    Logger.error(SUCCESS_MSG.METHOD, { message: error.message })
  }

  try {
    const { client } = RedisClient
    const redisResponse = await client.ping()
    if (redisResponse !== SUCCESS_MSG.REDIS_SUCCESS) {
      throw new Error(ERRORS.CACHE_FAILED)
    }

    healthCheck.cache = SUCCESS_MSG.HEALTHCHECK_SUCCESS
  } catch (error) {
    Logger.error(SUCCESS_MSG.METHOD, { message: error.message })
  }

  try {
    await elasticClient.cluster.health()

    healthCheck.search = SUCCESS_MSG.HEALTHCHECK_SUCCESS
  } catch (error) {
    Logger.error(SUCCESS_MSG.METHOD, { message: error.message })
  }

  return healthCheck
}
