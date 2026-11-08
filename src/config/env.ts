
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  REDIS_HOST: z.string().default("127.0.0.1"),

  REDIS_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(6379),

  REDIS_PASSWORD: z.string().optional(),

  DATABASE_URL: z.string().optional(),

  BUILD_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(600000),

  MAX_CONCURRENT_BUILDS: z.coerce
    .number()
    .int()
    .positive()
    .default(2),

  API_TOKEN_SECRET: z.string().optional()
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("HEXA environment configuration is invalid:");
  console.error(result.error.flatten().fieldErrors);
  throw new Error("Invalid HEXA environment configuration");
}

export const config = Object.freeze(result.data);

export type AppConfig = typeof config;
