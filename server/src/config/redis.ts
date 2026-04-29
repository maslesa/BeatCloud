import Redis from "ioredis";
import { logger } from "./logger";

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => logger.info('Connected to Redis.'));
redis.on('error', (error) => logger.info('Redis error: ', error));

export default redis;