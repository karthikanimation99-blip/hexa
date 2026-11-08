
import { timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export function apiAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const secret = config.API_TOKEN_SECRET;

  if (!secret) {
    res.status(503).json({
      success: false,
      message: "API authentication is not configured."
    });
    return;
  }

  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required."
    });
    return;
  }

  const suppliedToken = authorization.slice(7);

  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(suppliedToken);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    res.status(401).json({
      success: false,
      message: "Invalid API token."
    });
    return;
  }

  next();
}
