#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ORIGIN = process.env.SITE_ORIGIN || "https://onetomorrow.today";
const ROOT = path.join(__dirname, "..");
const paths = ["/", "/why", "/plan", "/learn", "/join", "/news", "/privacy", "/terms", "/accessibility"];

async function check(path) {
  const response = await fetch(`${ORIGIN}${path}`, { redirect: "follow" });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  if (!response.headers.get("content-security-policy")) throw new Error(`${path}: missing Content-Security-Policy`);
  const html = await response.text();
  if (!/<main\b[^>]*id="main"/.test(html)) throw new Error(`${path}: main landmark missing`);
  if (!/<link rel="canonical"/.test(html)) throw new Error(`${path}: canonical URL missing`);
  if (process.env.VERIFY_CONTENT === "1") {
    const file = path === "/" ? "index.html" : `${path.slice(1)}.html`;
    const expected = fs.readFileSync(require("path").join(ROOT, file), "utf8");
    if (html !== expected) throw new Error(`${path}: production does not match the checked-out revision yet`);
  }
}

Promise.all(paths.map(check))
  .then(() => console.log(`Live smoke test passed for ${paths.length} pages at ${ORIGIN}.`))
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
