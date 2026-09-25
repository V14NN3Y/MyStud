import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, sessionFor } from "./helpers.ts";
test("POST /api/notifications/send", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  const token = await sessionFor(server.baseUrl, "scolarite");
  await t.test("requires authentication", async () => {
    const res = await fetch(`${server.baseUrl}/api/notifications/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to: "x@example.com", message: "test", channel: "email" }),
    });
    assert.equal(res.status, 401);
  });
  await t.test("rejects an unknown channel", async () => {
    const res = await fetch(`${server.baseUrl}/api/notifications/send`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ to: "x@example.com", message: "test", channel: "carrier-pigeon" }),
    });
    assert.equal(res.status, 400);
  });
  await t.test("sends through the console fallback when no Resend key is configured", async () => {
    // No RESEND_API_KEY in the test env, so emailChannel is a ConsoleChannel:
    // this exercises the route end-to-end without ever touching the network.
    const res = await fetch(`${server.baseUrl}/api/notifications/send`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ to: "x@example.com", message: "test", channel: "email" }),
    });
    assert.equal(res.status, 202);
    const body = (await res.json()) as { sent: boolean; channel: string };
    assert.equal(body.sent, true);
    assert.equal(body.channel, "email");
  });
});
