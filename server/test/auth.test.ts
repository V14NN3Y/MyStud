import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers.ts";
test("auth + role gating", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  await t.test("rejects an unknown role", async () => {
    const res = await fetch(`${server.baseUrl}/api/auth/session`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: "pirate" }),
    });
    assert.equal(res.status, 400);
  });
  await t.test("issues a token for a known role", async () => {
    const res = await fetch(`${server.baseUrl}/api/auth/session`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    });
    assert.equal(res.status, 200);
    const body = (await res.json()) as { token: string; role: string };
    assert.equal(body.role, "admin");
    assert.ok(body.token.length > 20);
  });
  await t.test("a protected route rejects requests with no token", async () => {
    const res = await fetch(`${server.baseUrl}/api/audit`);
    assert.equal(res.status, 401);
  });
  await t.test("a protected route rejects a garbage token", async () => {
    const res = await fetch(`${server.baseUrl}/api/audit`, {
      headers: { authorization: "Bearer not-a-real-token" },
    });
    assert.equal(res.status, 401);
  });
});
