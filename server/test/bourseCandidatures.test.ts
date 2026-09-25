import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers.ts";
test("bourse candidatures", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  await t.test("lists the seeded candidatures with no auth required", async () => {
    const res = await fetch(`${server.baseUrl}/api/bourse-candidatures`);
    assert.equal(res.status, 200);
    const rows = (await res.json()) as { id: string }[];
    assert.equal(rows.length, 3);
  });
  await t.test("rejects an incomplete submission", async () => {
    const res = await fetch(`${server.baseUrl}/api/bourse-candidatures`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ programmeId: "bourse-bac", programme: "Bourse nationale" }),
    });
    assert.equal(res.status, 400);
  });
  let createdId: string;
  await t.test("submitting a candidature mints a server-side reference and persists", async () => {
    const res = await fetch(`${server.baseUrl}/api/bourse-candidatures`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        programmeId: "aide-transport",
        programme: "Aide au transport et à la restauration",
        organisme: "Conseil national de la vie étudiante",
        montant: "Carte de transport + repas subventionnés",
      }),
    });
    assert.equal(res.status, 201);
    const row = (await res.json()) as { id: string; statut: string; reference: string };
    assert.equal(row.statut, "soumise");
    assert.match(row.reference, /^MYSTUD-BRS-2026-\d{6}$/);
    createdId = row.id;
    const list = (await (await fetch(`${server.baseUrl}/api/bourse-candidatures`)).json()) as { id: string }[];
    assert.equal(list.length, 4);
    assert.ok(list.some((r) => r.id === createdId));
  });
  await t.test("withdrawing a candidature removes it for good", async () => {
    const del = await fetch(`${server.baseUrl}/api/bourse-candidatures/${createdId}`, { method: "DELETE" });
    assert.equal(del.status, 204);
    const list = (await (await fetch(`${server.baseUrl}/api/bourse-candidatures`)).json()) as { id: string }[];
    assert.equal(list.length, 3);
  });
  await t.test("404s withdrawing an unknown candidature", async () => {
    const res = await fetch(`${server.baseUrl}/api/bourse-candidatures/does-not-exist`, { method: "DELETE" });
    assert.equal(res.status, 404);
  });
  await t.test("deposer-pieces moves a 'complement' candidature back to 'etude'", async () => {
    const patch = await fetch(`${server.baseUrl}/api/bourse-candidatures/cb-2/deposer-pieces`, { method: "PATCH" });
    assert.equal(patch.status, 200);
    const row = (await patch.json()) as { statut: string };
    assert.equal(row.statut, "etude");
  });
  await t.test("deposer-pieces refuses a candidature not awaiting documents", async () => {
    const res = await fetch(`${server.baseUrl}/api/bourse-candidatures/cb-1/deposer-pieces`, { method: "PATCH" });
    assert.equal(res.status, 409);
  });
  await t.test("404s deposer-pieces on an unknown candidature", async () => {
    const res = await fetch(`${server.baseUrl}/api/bourse-candidatures/does-not-exist/deposer-pieces`, {
      method: "PATCH",
    });
    assert.equal(res.status, 404);
  });
});
