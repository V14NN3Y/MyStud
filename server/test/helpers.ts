import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// Each test file gets its own throwaway SQLite file + document storage dir,
// so tests never see another file's data and never touch the real dev
// database. Must run before importing anything that imports ../src/db.ts.
process.env.DATA_DIR = mkdtempSync(join(tmpdir(), "mystud-server-test-"));
process.env.NODE_ENV = "test";
const { createApp } = await import("../src/app.ts");
export async function startTestServer() {
  const server = createApp().listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected the test server to bind to a TCP port.");
  }
  const baseUrl = `http://127.0.0.1:${address.port}`;
  return {
    baseUrl,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
export async function sessionFor(baseUrl: string, role: string): Promise<string> {
  const res = await fetch(`${baseUrl}/api/auth/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ role }),
  });
  const body = (await res.json()) as { token: string };
  return body.token;
}
