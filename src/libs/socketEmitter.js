import { Emitter } from '@socket.io/redis-emitter'
import RedisClient from './redisClient'

const redisDetail = RedisClient
const socketEmitter = new Emitter(redisDetail.publisherClient)

export default socketEmitter
