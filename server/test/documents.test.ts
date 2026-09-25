import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, sessionFor } from "./helpers.ts";
async function upload(baseUrl: string, token: string, ownerMatricule: string, content: string) {
  const form = new FormData();
  form.set("ownerMatricule", ownerMatricule);
  form.set("file", new Blob([content], { type: "text/plain" }), "bulletin.txt");
  const res = await fetch(`${baseUrl}/api/documents`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: form,
  });
  return res;
}
test("private documents with signed, temporary links", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  const uploaderToken = await sessionFor(server.baseUrl, "scolarite");
  const uploadRes = await upload(server.baseUrl, uploaderToken, "MS-2026-000001", "Relevé de notes — démonstration");
  assert.equal(uploadRes.status, 201);
  const { id } = (await uploadRes.json()) as { id: string };
  await t.test("the owner can obtain a working download link", async () => {
    const linkRes = await fetch(`${server.baseUrl}/api/documents/${id}/link?matricule=MS-2026-000001`, {
      headers: { authorization: `Bearer ${uploaderToken}` },
    });
    assert.equal(linkRes.status, 200);
    const { url } = (await linkRes.json()) as { url: string };
    const download = await fetch(`${server.baseUrl}${url}`);
    assert.equal(download.status, 200);
    assert.equal(await download.text(), "Relevé de notes — démonstration");
  });
  await t.test("an institutional role can also obtain a link without matching the matricule", async () => {
    const ministereToken = await sessionFor(server.baseUrl, "ministere");
    const linkRes = await fetch(`${server.baseUrl}/api/documents/${id}/link?matricule=someone-else`, {
      headers: { authorization: `Bearer ${ministereToken}` },
    });
    assert.equal(linkRes.status, 200);
  });
  await t.test("an unrelated role with the wrong matricule is refused a link", async () => {
    const recruteurToken = await sessionFor(server.baseUrl, "recruteur");
    const linkRes = await fetch(`${server.baseUrl}/api/documents/${id}/link?matricule=someone-else`, {
      headers: { authorization: `Bearer ${recruteurToken}` },
    });
    assert.equal(linkRes.status, 403);
  });
  await t.test("the document is never reachable at a plain, un-signed URL", async () => {
    const res = await fetch(`${server.baseUrl}/api/documents/${id}`);
    assert.equal(res.status, 404);
  });
  await t.test("a tampered or unknown download token is rejected", async () => {
    const res = await fetch(`${server.baseUrl}/api/documents/download/not-a-real-token`);
    assert.equal(res.status, 403);
  });
});
