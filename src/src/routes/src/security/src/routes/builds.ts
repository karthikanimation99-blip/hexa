
import { Router } from "express";
import { z } from "zod";
import buildQueue from "../services/buildQueue";
import { apiAuth } from "../security/apiAuth";

const router = Router();

const buildRequestSchema = z.object({
  appName: z.string().trim().min(1).max(100),
  packageId: z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/),
  platform: z.enum(["android", "ios"]),
  format: z.enum(["apk", "aab", "ipa"])
}).superRefine((data, ctx) => {
  if (data.platform === "android" && data.format === "ipa") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Android builds cannot use IPA format.",
      path: ["format"]
    });
  }

  if (data.platform === "ios" && data.format !== "ipa") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "iOS builds must use IPA format.",
      path: ["format"]
    });
  }
});

router.post("/", apiAuth, async (req, res) => {
  const result = buildRequestSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid build request.",
      errors: result.error.flatten()
    });
    return;
  }

  try {
    const job = await buildQueue.add("build", result.data);

    res.status(202).json({
      success: true,
      message: "Build request added to the queue.",
      build: {
        id: job.id,
        ...result.data,
        status: "pending"
      }
    });
  } catch (error) {
    console.error("HEXA queue error:", error);

    res.status(503).json({
      success: false,
      message: "Build queue is currently unavailable."
    });
  }
});

export default router;
