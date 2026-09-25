import { test } from "node:test";
import assert from "node:assert/strict";
import { ConsoleChannel, ResendEmailChannel } from "../src/notifications/channel.ts";
test("ConsoleChannel logs instead of sending", async () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (msg: string) => logs.push(msg);
  try {
    await new ConsoleChannel("email").send("etudiant@example.com", "Bonjour");
  } finally {
    console.log = originalLog;
  }
  assert.equal(logs.length, 1);
  assert.match(logs[0], /etudiant@example\.com/);
});
test("ResendEmailChannel: sends a well-formed request and never leaks the API key", async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = "";
  let capturedInit: RequestInit | undefined;
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    capturedUrl = url;
    capturedInit = init;
    return new Response(JSON.stringify({ id: "fake-id" }), { status: 200 });
  }) as typeof fetch;
  try {
    const channel = new ResendEmailChannel("test-api-key", "MyStud <onboarding@resend.dev>");
    await channel.send("etudiant@example.com", "Votre dossier a été mis à jour.", "Mise à jour");
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(capturedUrl, "https://api.resend.com/emails");
  const headers = capturedInit?.headers as Record<string, string>;
  assert.equal(headers.authorization, "Bearer test-api-key");
  const body = JSON.parse(capturedInit?.body as string);
  assert.equal(body.to, "etudiant@example.com");
  assert.equal(body.subject, "Mise à jour");
  assert.equal(body.text, "Votre dossier a été mis à jour.");
  assert.equal(body.from, "MyStud <onboarding@resend.dev>");
});
test("ResendEmailChannel: surfaces Resend's error without the API key in it", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response("domain not verified", { status: 403 })) as typeof fetch;
  try {
    const channel = new ResendEmailChannel("super-secret-key", "MyStud <onboarding@resend.dev>");
    await assert.rejects(
      () => channel.send("etudiant@example.com", "test"),
      (error: Error) => {
        assert.match(error.message, /403/);
        assert.doesNotMatch(error.message, /super-secret-key/);
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
