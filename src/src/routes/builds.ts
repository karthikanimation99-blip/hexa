
import { Router } from "express";
import { z } from "zod";

const router = Router();

const buildRequestSchema = z.object({
  appName: z.string().trim().min(1).max(100),
  packageId: z
    .string()
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/
    ),
  platform: z.enum(["android", "ios"]),
  format: z.enum(["apk", "aab", "ipa"])
}).superRefine((data, ctx) => {
  if (
    data.platform === "android" &&
    data.format === "ipa"
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Android builds cannot use IPA format.",
      path: ["format"]
    });
  }

  if (
    data.platform === "ios" &&
    data.format !== "ipa"
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "iOS builds must use IPA format.",
      path: ["format"]
    });
  }
});

router.post("/", (req, res) => {
  const result = buildRequestSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid build request.",
      errors: result.error.flatten()
    });
  }

  return res.status(202).json({
    success: true,
    message: "Build request validated successfully.",
    build: {
      ...result.data,
      status: "pending"
    }
  });
});

export default router;
