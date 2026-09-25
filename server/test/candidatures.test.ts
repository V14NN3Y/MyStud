import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, sessionFor } from "./helpers.ts";
test("candidatures", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  const token = await sessionFor(server.baseUrl, "universite");
  await t.test("requires an institutional role", async () => {
    const res = await fetch(`${server.baseUrl}/api/candidatures`);
    assert.equal(res.status, 401);
  });
  await t.test("lists the seeded candidatures", async () => {
    const res = await fetch(`${server.baseUrl}/api/candidatures`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const rows = (await res.json()) as { id: string; statut: string }[];
    assert.equal(rows.length, 5);
    assert.ok(rows.every((r) => r.statut === "En attente"));
  });
  await t.test("accepting a candidature persists across requests", async () => {
    const patch = await fetch(`${server.baseUrl}/api/candidatures/cand-2026-0142/decision`, {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ decision: "Acceptée" }),
    });
    assert.equal(patch.status, 200);
    const list = (await (
      await fetch(`${server.baseUrl}/api/candidatures`, { headers: { authorization: `Bearer ${token}` } })
    ).json()) as { id: string; statut: string }[];
    assert.equal(list.find((r) => r.id === "cand-2026-0142")?.statut, "Acceptée");
  });
  await t.test("refusing without a motif is rejected", async () => {
    const res = await fetch(`${server.baseUrl}/api/candidatures/cand-2026-0143/decision`, {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ decision: "Refusée" }),
    });
    assert.equal(res.status, 400);
  });
  await t.test("refusing with a motif persists the reason", async () => {
    const patch = await fetch(`${server.baseUrl}/api/candidatures/cand-2026-0143/decision`, {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ decision: "Refusée", motif: "Dossier incomplet" }),
    });
    const row = (await patch.json()) as { statut: string; motif_refus: string };
    assert.equal(row.statut, "Refusée");
    assert.equal(row.motif_refus, "Dossier incomplet");
  });
  await t.test("404s on an unknown candidature", async () => {
    const res = await fetch(`${server.baseUrl}/api/candidatures/does-not-exist/decision`, {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ decision: "Acceptée" }),
    });
    assert.equal(res.status, 404);
  });
  await t.test("a non-institutional role cannot decide a candidature", async () => {
    const other = await sessionFor(server.baseUrl, "recruteur");
    const res = await fetch(`${server.baseUrl}/api/candidatures/cand-2026-0144/decision`, {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${other}` },
      body: JSON.stringify({ decision: "Acceptée" }),
    });
    assert.equal(res.status, 403);
  });
});
