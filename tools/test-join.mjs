#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JOIN_OPTIONS, validateJoinFields } from "../functions/api/join-validation.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  region: "London",
  branch: JOIN_OPTIONS.branch[0],
  contribution: JOIN_OPTIONS.contribution[0],
  availability: JOIN_OPTIONS.availability[0],
  role: "Review the evidence and explain it in plain language.",
  contactConsent: "yes"
};

const { contactConsent: _consent, ...expectedClean } = valid;
assert.deepEqual(validateJoinFields(valid).clean, expectedClean);
assert.match(validateJoinFields({ ...valid, email: "not-an-email" }).error, /valid email/);
assert.match(validateJoinFields({ ...valid, branch: "Invented branch" }).error, /valid branch/);
assert.match(validateJoinFields({ ...valid, contribution: "Anything" }).error, /valid contribution/);
assert.match(validateJoinFields({ ...valid, availability: "Always" }).error, /valid availability/);
assert.match(validateJoinFields({ ...valid, contactConsent: "" }).error, /confirm/);
assert.match(validateJoinFields({ ...valid, role: "x".repeat(901) }).error, /too long/);

const cleaned = validateJoinFields({
  ...valid,
  name: "Ada\r\nBcc: someone@example.org",
  role: "Line one\r\nLine two\u0000"
}).clean;
assert.equal(cleaned.name, "Ada Bcc: someone@example.org");
assert.equal(cleaned.role, "Line one\nLine two");

const joinPage = fs.readFileSync(path.join(ROOT, "join.html"), "utf8");
for (const [field, options] of Object.entries(JOIN_OPTIONS)) {
  for (const option of options) {
    assert.ok(joinPage.includes(`name="${field}"`) && joinPage.includes(`value="${option}"`), `${field} option is missing from join.html: ${option}`);
  }
}

console.log("Join validation tests passed.");
