#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ORIGIN = process.env.SITE_ORIGIN || "https://onetomorrow.today";
const ROOT = path.join(__dirname, "..");
const pages = {
  "/": /Start here/i,
  "/today": /Global economic shift in the age of AGI/i,
  "/tomorrow": /Entity consideration/i,
  "/future": /Ark creation/i,
  "/topics": /Search all topics/i,
  "/status": /Program status/i,
  "/governance": /Public contribution paths/i,
  "/why": /transparent by design/i,
  "/plan": /90-day/i,
  "/learn": /cognitive sovereignty/i,
  "/join": /Where the form goes/i,
  "/news": /editorial/i,
  "/privacy": /privacy/i,
  "/terms": /terms/i,
  "/accessibility": /accessibility/i
};

async function check(path) {
  const response = await fetch(`${ORIGIN}${path}`, { redirect: "follow" });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  if (!response.headers.get("content-security-policy")) throw new Error(`${path}: missing Content-Security-Policy`);
  const html = await response.text();
  if (!/<main\b[^>]*id="main"/.test(html)) throw new Error(`${path}: main landmark missing`);
  if (!/<link rel="canonical"/.test(html)) throw new Error(`${path}: canonical URL missing`);
  if (!pages[path].test(html)) throw new Error(`${path}: expected page content missing`);
}

async function checkRevision() {
  if (process.env.VERIFY_CONTENT !== "1") return;
  // Cloudflare may rewrite HTML to inject challenge and email-protection code,
  // so compare an unmodified static asset to confirm the new revision landed.
  const response = await fetch(`${ORIGIN}/script.js`);
  if (!response.ok) throw new Error(`/script.js: HTTP ${response.status}`);
  const expected = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
  if (await response.text() !== expected) throw new Error("production does not match the checked-out revision yet");
}

const paths = Object.keys(pages);

Promise.all([...paths.map(check), checkRevision()])
  .then(() => console.log(`Live smoke test passed for ${paths.length} pages at ${ORIGIN}.`))
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
