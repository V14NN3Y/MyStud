import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, sessionFor } from "./helpers.ts";
test("notification feed", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  await t.test("lists the seeded notifications with no auth required", async () => {
    const res = await fetch(`${server.baseUrl}/api/notifications`);
    assert.equal(res.status, 200);
    const rows = (await res.json()) as { id: number; lu: number }[];
    assert.equal(rows.length, 6);
  });
  await t.test("marking one notification read persists across requests", async () => {
    const before = (await (await fetch(`${server.baseUrl}/api/notifications`)).json()) as {
      id: number;
      lu: number;
    }[];
    const unread = before.find((n) => n.lu === 0)!;
    const patch = await fetch(`${server.baseUrl}/api/notifications/${unread.id}/read`, { method: "PATCH" });
    assert.equal(patch.status, 200);
    const after = (await (await fetch(`${server.baseUrl}/api/notifications`)).json()) as {
      id: number;
      lu: number;
    }[];
    assert.equal(after.find((n) => n.id === unread.id)?.lu, 1);
  });
  await t.test("404s on an unknown notification id", async () => {
    const res = await fetch(`${server.baseUrl}/api/notifications/999999/read`, { method: "PATCH" });
    assert.equal(res.status, 404);
  });
  await t.test("read-all clears every unread notification", async () => {
    const patch = await fetch(`${server.baseUrl}/api/notifications/read-all`, { method: "PATCH" });
    assert.equal(patch.status, 200);
    const rows = (await patch.json()) as { lu: number }[];
    assert.ok(rows.every((n) => n.lu === 1));
  });
});
test("notification preferences", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  await t.test("lists the seeded preference matrix", async () => {
    const res = await fetch(`${server.baseUrl}/api/notifications/preferences`);
    const rows = (await res.json()) as { categorie: string }[];
    assert.equal(rows.length, 6);
  });
  await t.test("toggles an unlocked category and persists it", async () => {
    const patch = await fetch(`${server.baseUrl}/api/notifications/preferences/notes`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ canal: "sms", value: true }),
    });
    assert.equal(patch.status, 200);
    const row = (await patch.json()) as { sms: number };
    assert.equal(row.sms, 1);
  });
  await t.test("refuses to toggle a locked category", async () => {
    const res = await fetch(`${server.baseUrl}/api/notifications/preferences/identite`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ canal: "sms", value: false }),
    });
    assert.equal(res.status, 403);
  });
  await t.test("rejects an invalid channel name", async () => {
    const res = await fetch(`${server.baseUrl}/api/notifications/preferences/notes`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ canal: "fax", value: true }),
    });
    assert.equal(res.status, 400);
  });
});
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
