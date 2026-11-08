
import { Router } from "express";
import buildQueue from "../services/buildQueue";
import { apiAuth } from "../security/apiAuth";

const router = Router();

router.get("/:id", apiAuth, async (req, res) => {
  const jobId = req.params.id;

  if (!jobId || jobId.length > 128) {
    res.status(400).json({
      success: false,
      message: "Invalid build job ID."
    });
    return;
  }

  try {
    const job = await buildQueue.getJob(jobId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Build job not found."
      });
      return;
    }

    const state = await job.getState();

    res.status(200).json({
      success: true,
      build: {
        id: job.id,
        appName: job.data.appName,
        platform: job.data.platform,
        format: job.data.format,
        status: state,
        progress: job.progress,
        failedReason: job.failedReason || null,
        createdAt: job.timestamp
      }
    });
  } catch (error) {
    console.error("Build status error:", error);

    res.status(503).json({
      success: false,
      message: "Unable to retrieve build status."
    });
  }
});

export default router;
