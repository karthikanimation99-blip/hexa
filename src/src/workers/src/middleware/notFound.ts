
import type { Request, Response } from "express";

export function notFoundHandler(
  req: Request,
  res: Response
): void {
  res.status(404).json({
    success: false,
    error: "NOT_FOUND",
    message: "The requested endpoint does not exist.",
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
}
