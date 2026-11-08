
import Redis from "ioredis";
import { config } from "../config/env";

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: true
});

redis.on("connect", () => {
  console.log("HEXA Redis connection established.");
});

redis.on("ready", () => {
  console.log("HEXA Redis is ready.");
});

redis.on("error", (error: Error) => {
  console.error("HEXA Redis error:", error.message);
});

redis.on("close", () => {
  console.log("HEXA Redis connection closed.");
});

export default redis;
