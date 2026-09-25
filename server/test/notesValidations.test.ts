import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, sessionFor } from "./helpers.ts";
test("notes validations", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  const token = await sessionFor(server.baseUrl, "enseignant");
  await t.test("lists the seeded rows, one already validated", async () => {
    const res = await fetch(`${server.baseUrl}/api/notes-validations`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const rows = (await res.json()) as { id: string; statut: string }[];
    assert.equal(rows.length, 4);
    assert.equal(rows.filter((r) => r.statut === "Validée").length, 1);
  });
  await t.test("validating persists across requests", async () => {
    const patch = await fetch(`${server.baseUrl}/api/notes-validations/not-inf401/valider`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}` },
    });
    const row = (await patch.json()) as { statut: string; validated_at: string | null };
    assert.equal(row.statut, "Validée");
    assert.ok(row.validated_at);
    const list = (await (
      await fetch(`${server.baseUrl}/api/notes-validations`, { headers: { authorization: `Bearer ${token}` } })
    ).json()) as { id: string; statut: string }[];
    assert.equal(list.find((r) => r.id === "not-inf401")?.statut, "Validée");
  });
  await t.test("validating an already-validated UE is refused", async () => {
    const res = await fetch(`${server.baseUrl}/api/notes-validations/not-inf405/valider`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 409);
  });
  await t.test("404s on an unknown UE", async () => {
    const res = await fetch(`${server.baseUrl}/api/notes-validations/does-not-exist/valider`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 404);
  });
});
