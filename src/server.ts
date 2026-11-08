
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { config } from "./config/env";
import healthRouter from "./routes/health";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    name: "HEXA",
    message: "HEXA Build Server is running.",
    version: "1.0.0"
  });
});

app.use("/health", healthRouter);

const server = app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`HEXA server running on port ${config.PORT}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Shutting down HEXA...`);

  server.close((error) => {
    if (error) {
      console.error("Server shutdown failed:", error);
      process.exitCode = 1;
      return;
    }

    console.log("HEXA server stopped.");
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
