import "dotenv/config";
import { createApp } from "./app.ts";
import { env } from "./env.ts";
import "./db.ts";
createApp().listen(env.port, () => {
  console.log(`mystud-server listening on http://localhost:${env.port}`);
});
