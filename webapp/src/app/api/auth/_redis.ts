"server-only";
import Redis from "ioredis";
import { logger } from "@/logger/logger";
const log = logger("_redis.ts");

let redisClient: Redis | null = null;

function getRedisClient() {
  if (process.env.metadata_management_active !== "1") {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis({
    host: process.env.redis_host,
    port: parseInt(process.env.redis_port || "6379"),
    db: parseInt(process.env.redis_db || "0"),
    username: process.env.redis_username,
    password: process.env.redis_password,
    retryStrategy: (times) => {
      // max try 10, interval 10secs
      return times >= 10 ? null : 10000;
    },
  });

  redisClient.on("reconnecting", () => {
    log.info(`Trying to reconnect`);
  });

  redisClient.on("connect", () => {
    log.info("Redis connection established");
  });

  redisClient.on("error", (error: any) => {
    log.error(error, "Redis connection error");
  });

  return redisClient;
}

export { getRedisClient };
