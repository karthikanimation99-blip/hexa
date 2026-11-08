
import { Queue } from "bullmq";
import { config } from "../config/env";

export interface BuildJobData {
  appName: string;
  packageId: string;
  platform: "android" | "ios";
  format: "apk" | "aab" | "ipa";
}

const buildQueue = new Queue<BuildJobData>("hexa-builds", {
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000
    },
    removeOnComplete: 100,
    removeOnFail: 500
  }
});

export default buildQueue;
