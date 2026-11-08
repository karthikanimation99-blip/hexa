
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode =
    typeof error?.status === "number" &&
    error.status >= 400 &&
    error.status < 600
      ? error.status
      : 500;

  console.error("HEXA API error:", error);

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500
      ? "INTERNAL_SERVER_ERROR"
      : "REQUEST_ERROR",
    message: statusCode === 500
      ? "An internal server error occurred."
      : "The request could not be processed.",
    timestamp: new Date().toISOString()
  });
};
