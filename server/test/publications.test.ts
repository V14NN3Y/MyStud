import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, sessionFor } from "./helpers.ts";
test("publications", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  const token = await sessionFor(server.baseUrl, "universite");
  await t.test("lists the seeded publications", async () => {
    const res = await fetch(`${server.baseUrl}/api/publications`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const rows = (await res.json()) as { id: string }[];
    assert.equal(rows.length, 4);
  });
  await t.test("toggling a draft publishes it, and persists", async () => {
    const patch = await fetch(`${server.baseUrl}/api/publications/pub-edt/toggle`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}` },
    });
    const row = (await patch.json()) as { statut: string };
    assert.equal(row.statut, "Publié");
    const list = (await (
      await fetch(`${server.baseUrl}/api/publications`, { headers: { authorization: `Bearer ${token}` } })
    ).json()) as { id: string; statut: string }[];
    assert.equal(list.find((r) => r.id === "pub-edt")?.statut, "Publié");
  });
  await t.test("toggling again reverts it to draft", async () => {
    const patch = await fetch(`${server.baseUrl}/api/publications/pub-edt/toggle`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}` },
    });
    const row = (await patch.json()) as { statut: string };
    assert.equal(row.statut, "Brouillon");
  });
  await t.test("404s on an unknown publication", async () => {
    const res = await fetch(`${server.baseUrl}/api/publications/does-not-exist/toggle`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 404);
  });
});
