
import "dotenv/config";
import express from "express";
import helmet from "helmet";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

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

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "hexa-build-server",
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`HEXA server running on port ${PORT}`);
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

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
