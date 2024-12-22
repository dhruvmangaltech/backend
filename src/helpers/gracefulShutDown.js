import { sequelize } from '../db/models'
import RedisClient from '../libs/redisClient'

export default async function gracefulShutDown (signal) {
  const client = RedisClient.client
  try {
    await sequelize.close()
    await client.quit()
    console.log(`Received ${signal}`)
    process.exit(0)
  } catch (err) {
    console.log('GraceFull ShutDown Failed', err)
    process.exit(1)
  }
}
