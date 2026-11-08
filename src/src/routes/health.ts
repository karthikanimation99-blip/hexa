
import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "hexa-build-server",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

export default router;
