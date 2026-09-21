#!/usr/bin/env node
/**
 * Assembles the deployable site into dist/.
 *
 * Cloudflare Pages serves whatever directory it is pointed at. Pointed at the
 * repository root it also serves README.md, package.json and tools/ -- and
 * neither .assetsignore (a Workers Static Assets feature Pages ignores) nor a
 * _redirects rule can prevent that, because a static file always wins over a
 * redirect rule. Giving Pages a build output directory is the only mechanism
 * that actually keeps non-site files off the origin.
 *
 * Enable it in Pages > Settings > Builds:
 *   Build command:           npm run build
 *   Build output directory:  dist
 *
 * functions/ stays at the repository root; Pages compiles it from there
 * regardless of the output directory.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "dist");

// Everything the site needs, and nothing else.
const FILES = ["robots.txt", "sitemap.xml", "site.webmanifest", "styles.css", "script.js", "_redirects", "_headers"];
const DIRS = ["assets"];

// Anything matching these must never reach the output.
const FORBIDDEN = [/^README/i, /^package(-lock)?\.json$/, /^tools$/, /^node_modules$/, /^\.git/, /^functions$/, /^dist$/];

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = fs.readdirSync(ROOT).filter(f => f.endsWith(".html"));
for (const file of [...pages, ...FILES]) {
  const src = path.join(ROOT, file);
  if (!fs.existsSync(src)) {
    console.error(`missing expected file: ${file}`);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(OUT, file));
}
for (const dir of DIRS) copyDir(path.join(ROOT, dir), path.join(OUT, dir));

// Fail loudly rather than quietly publishing something that should not ship.
const leaked = fs.readdirSync(OUT).filter(name => FORBIDDEN.some(re => re.test(name)));
if (leaked.length) {
  console.error(`build output contains files that must not be served: ${leaked.join(", ")}`);
  process.exit(1);
}

const count = pages.length + FILES.length;
console.log(`dist/: ${count} files + ${DIRS.join(", ")}/`);
