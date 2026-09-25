import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers.ts";
import { npiMatchesToken } from "../src/routes/identity.ts";
test("NPI tokenization", async (t) => {
  const server = await startTestServer();
  t.after(() => server.close());
  await t.test("rejects a malformed NPI", async () => {
    const res = await fetch(`${server.baseUrl}/api/identity/tokenize`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ npi: "abc" }),
    });
    assert.equal(res.status, 400);
  });
  await t.test("is deterministic: the same NPI always yields the same token", async () => {
    const tokenize = () =>
      fetch(`${server.baseUrl}/api/identity/tokenize`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ npi: "1234567890" }),
      }).then((r) => r.json() as Promise<{ npiToken: string }>);
    const first = await tokenize();
    const second = await tokenize();
    assert.equal(first.npiToken, second.npiToken);
  });
  await t.test("does not just echo the raw NPI back as the token", async () => {
    const res = await fetch(`${server.baseUrl}/api/identity/tokenize`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ npi: "1234567890" }),
    });
    const body = (await res.json()) as { npiToken: string };
    assert.notEqual(body.npiToken, "1234567890");
  });
  await t.test("npiMatchesToken recognizes the right NPI and rejects a wrong one", async () => {
    const res = await fetch(`${server.baseUrl}/api/identity/tokenize`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ npi: "1234567890" }),
    });
    const { npiToken } = (await res.json()) as { npiToken: string };
    assert.equal(npiMatchesToken("1234567890", npiToken), true);
    assert.equal(npiMatchesToken("0000000000", npiToken), false);
  });
  await t.test("sends a confirmation message when an e-mail is supplied", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);
    try {
      const res = await fetch(`${server.baseUrl}/api/identity/tokenize`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ npi: "1234567890", email: "candidat@example.com" }),
      });
      assert.equal(res.status, 200);
      // No RESEND_API_KEY in the test env, so this goes through ConsoleChannel
      // — proves the side effect fires without ever touching the real network.
      await new Promise((resolve) => setTimeout(resolve, 10));
    } finally {
      console.log = originalLog;
    }
    assert.ok(logs.some((line) => line.includes("candidat@example.com")));
  });
  await t.test("does not attempt to send anything when the e-mail is missing or invalid", async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => logs.push(msg);
    try {
      await fetch(`${server.baseUrl}/api/identity/tokenize`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ npi: "1234567890", email: "not-an-email" }),
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
    } finally {
      console.log = originalLog;
    }
    assert.equal(logs.length, 0);
  });
});
