import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.ts";
import { auditRouter } from "./routes/audit.ts";
import { identityRouter } from "./routes/identity.ts";
import { documentsRouter } from "./routes/documents.ts";
import { notificationsRouter } from "./routes/notifications.ts";
import { env } from "./env.ts";
export function createApp() {
  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.use("/api/audit", auditRouter);
  app.use("/api/identity", identityRouter);
  app.use("/api/documents", documentsRouter);
  app.use("/api/notifications", notificationsRouter);
  return app;
}
