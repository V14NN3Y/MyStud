import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, sessionFor } from "./helpers.ts";
import { db } from "../src/db.ts";
test("audit log", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  await t.test("an institutional role can log and list events", async () => {
    const token = await sessionFor(server.baseUrl, "ministere");
    const post = await fetch(`${server.baseUrl}/api/audit`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "decision.acceptee", cible: "cand-2026-0001" }),
    });
    assert.equal(post.status, 201);
    const list = await fetch(`${server.baseUrl}/api/audit`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const events = (await list.json()) as { action: string; auteur_role: string }[];
    assert.equal(events.length, 1);
    assert.equal(events[0].action, "decision.acceptee");
    assert.equal(events[0].auteur_role, "ministere");
  });
  await t.test("a non-institutional role cannot read the audit log", async () => {
    const token = await sessionFor(server.baseUrl, "recruteur");
    const res = await fetch(`${server.baseUrl}/api/audit`, {
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 403);
  });
  await t.test("rejects a malformed event", async () => {
    const token = await sessionFor(server.baseUrl, "admin");
    const res = await fetch(`${server.baseUrl}/api/audit`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "" }),
    });
    assert.equal(res.status, 400);
  });
  await t.test("the database itself refuses to update or delete a logged event", async () => {
    const token = await sessionFor(server.baseUrl, "admin");
    await fetch(`${server.baseUrl}/api/audit`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "publication", cible: "edt-l1-info" }),
    });
    assert.throws(() => db.exec("UPDATE audit_events SET action = 'hacked' WHERE id = 1"));
    assert.throws(() => db.exec("DELETE FROM audit_events WHERE id = 1"));
  });
});
