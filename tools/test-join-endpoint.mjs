import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JOIN_OPTIONS } from "../functions/api/join-validation.mjs";

// Load the Pages ES module without changing the CommonJS build tools' mode.
const source = (await readFile(new URL("../functions/api/join.js", import.meta.url), "utf8"))
  .replace('"./join-validation.mjs"', JSON.stringify(new URL("../functions/api/join-validation.mjs", import.meta.url).href));
const { onRequestPost } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
const env = { RESEND_API_KEY: "test-only", JOIN_FROM: "test@example.org" };
const valid = { name: "Test Person", email: "person@example.org", region: "Test community", branch: JOIN_OPTIONS.branch[0], contribution: JOIN_OPTIONS.contribution[0], availability: JOIN_OPTIONS.availability[0], role: "Review a source.", contactConsent: "yes" };
let calls = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  calls++;
  assert.equal(url, "https://api.resend.com/emails");
  const mail = JSON.parse(options.body);
  assert.deepEqual(mail.to, ["join@onetomorrow.today"]);
  assert.equal(mail.reply_to, valid.email);
  return new Response("{}", { status: 200 });
};
const post = (body, headers = {}) => onRequestPost({ env, request: new Request("https://onetomorrow.today/api/join", { method: "POST", headers: { accept: "application/json", "content-type": "application/json", ...headers }, body }) });
try {
  for (const body of ["null", "[]", "true", "{broken"]) assert.equal((await post(body)).status, 400);
  assert.equal((await post(JSON.stringify(valid), { origin: "https://untrusted.example" })).status, 403);
  assert.equal((await post("x".repeat(13000))).status, 413);
  assert.equal((await post(JSON.stringify({ ...valid, role: "é".repeat(7000) }))).status, 413);
  assert.equal((await post("text", { "content-type": "text/plain" })).status, 415);
  assert.equal((await post(JSON.stringify({ ...valid, website: "spam" }))).status, 200);
  assert.equal(calls, 0, "invalid requests must never send email");
  const response = await post(JSON.stringify(valid));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match((await response.json()).reference, /^OT-\d{8}-[A-F0-9]{8}$/);
  const native = await post(new URLSearchParams(valid), { accept: "text/html", "content-type": "application/x-www-form-urlencoded" });
  assert.equal(native.status, 303);
  assert.match(native.headers.get("location"), /^\/join\?sent=1&ref=OT-/);
  assert.equal(calls, 2);
  const duplicate = new URLSearchParams(valid);
  duplicate.append("name", "Second name");
  assert.equal((await post(duplicate, { "content-type": "application/x-www-form-urlencoded" })).status, 400);
  globalThis.fetch = async () => new Response("{}", { status: 429 });
  assert.equal((await post(JSON.stringify(valid))).status, 502);
  globalThis.fetch = async () => { throw new Error("Mock connection failure"); };
  assert.equal((await post(JSON.stringify(valid))).status, 502);
  console.log("Join endpoint tests passed (no real email sent).");
} finally {
  globalThis.fetch = originalFetch;
}
