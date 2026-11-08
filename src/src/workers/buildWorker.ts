
import { Worker, Job } from "bullmq";
import { config } from "../config/env";
import type { BuildJobData } from "../services/buildQueue";

async function processBuildJob(
  job: Job<BuildJobData>
): Promise<void> {
  console.log(`HEXA received build job: ${job.id}`);

  await job.updateProgress(10);

  console.log("App name:", job.data.appName);
  console.log("Package ID:", job.data.packageId);
  console.log("Platform:", job.data.platform);
  console.log("Format:", job.data.format);

  throw new Error(
    "Build executor is not configured yet. No compilation was attempted."
  );
}

const buildWorker = new Worker<BuildJobData>(
  "hexa-builds",
  processBuildJob,
  {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null
    },
    concurrency: config.MAX_CONCURRENT_BUILDS
  }
);

buildWorker.on("completed", (job) => {
  console.log(`Build job ${job.id} completed.`);
});

buildWorker.on("failed", (job, error) => {
  console.error(
    `Build job ${job?.id ?? "unknown"} failed:`,
    error.message
  );
});

buildWorker.on("error", (error) => {
  console.error("HEXA worker error:", error.message);
});

export default buildWorker;
