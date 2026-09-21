#!/usr/bin/env node
/**
 * Static checks for the site. `npm test` used to be `echo "Static site"`,
 * which always passed and asserted nothing.
 *
 * Deliberately dependency-free so it runs anywhere with plain node.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const failures = [];
const notes = [];

const fail = (file, message) => failures.push(`${file}: ${message}`);

const pages = fs.readdirSync(ROOT).filter(f => f.endsWith(".html"));
if (!pages.length) fail(".", "no HTML pages found");

// Asset budgets, in KB. The heroes are CSS backgrounds and therefore LCP.
const ASSET_BUDGET_KB = 450;
const TOTAL_ASSET_BUDGET_KB = 3000;

function checkPage(file) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");

  // --- structure -------------------------------------------------------
  const h1 = html.match(/<h1[\s>]/g) || [];
  if (h1.length !== 1) fail(file, `expected exactly 1 <h1>, found ${h1.length}`);

  if (!/id="main"/.test(html)) fail(file, 'missing id="main" (skip-link target)');
  if (/href="#main"/.test(html) && !/id="main"/.test(html)) {
    fail(file, "skip link points at a missing target");
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(file, `duplicate id(s): ${[...new Set(dupes)].join(", ")}`);

  // --- headings in order ----------------------------------------------
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map(m => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      fail(file, `heading level jumps from h${levels[i - 1]} to h${levels[i]}`);
      break;
    }
  }

  // --- links ------------------------------------------------------------
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#|data:)/.test(href)) continue;

    // Internal links must be root-relative and extensionless, so they do not
    // bounce through a redirect on every click.
    if (/\.html(#|$)/.test(href)) fail(file, `internal link still uses .html: ${href}`);
    if (!href.startsWith("/")) fail(file, `internal link is not root-relative: ${href}`);

    const target = href.split("#")[0].replace(/^\//, "");
    if (!target) continue;
    const candidates = [target, `${target}.html`];
    if (!candidates.some(c => fs.existsSync(path.join(ROOT, c)))) {
      fail(file, `link target does not exist: ${href}`);
    }
  }

  // --- images -----------------------------------------------------------
  for (const tag of html.match(/<img[^>]*>/g) || []) {
    if (!/\salt=/.test(tag)) fail(file, `<img> without alt: ${tag.slice(0, 60)}`);
    if (!/\swidth=/.test(tag) || !/\sheight=/.test(tag)) {
      fail(file, `<img> without width/height (layout shift): ${tag.slice(0, 60)}`);
    }
    const src = (tag.match(/src="([^"]+)"/) || [])[1];
    if (src && !/^https?:/.test(src)) {
      const rel = src.replace(/^\//, "");
      if (!fs.existsSync(path.join(ROOT, rel))) fail(file, `image not found: ${src}`);
    }
  }

  // --- metadata ---------------------------------------------------------
  if (file === "404.html") {
    // A 404 is not a canonical URL; it should stay out of the index instead.
    if (!/<meta name="robots"[^>]*noindex/.test(html)) fail(file, "404 page is not noindex");
  } else {
    if (!/<link rel="canonical"/.test(html)) fail(file, "missing canonical link");
    if (!/<meta name="description"/.test(html)) fail(file, "missing meta description");
  }
  if (!/<html lang="/.test(html)) fail(file, "missing lang on <html>");

  // JSON-LD must parse.
  for (const [, block] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(block);
    } catch (error) {
      fail(file, `invalid JSON-LD: ${error.message}`);
    }
  }

  // --- regressions the audit found --------------------------------------
  if (/http-equiv="refresh"/.test(html)) {
    fail(file, "meta refresh redirect (use _redirects instead)");
  }
  if (/action="mailto:/.test(html)) {
    fail(file, "form posts to mailto: (unsupported in most browsers)");
  }
  if (/target="_blank"/.test(html)) {
    for (const tag of html.match(/<a[^>]*target="_blank"[^>]*>/g) || []) {
      if (!/rel="[^"]*noopener/.test(tag)) fail(file, `target="_blank" without rel=noopener: ${tag.slice(0, 60)}`);
    }
  }
}

function checkAssets() {
  const dir = path.join(ROOT, "assets");
  if (!fs.existsSync(dir)) return;
  let total = 0;
  const walk = prefix => {
    for (const entry of fs.readdirSync(path.join(dir, prefix), { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(rel);
        continue;
      }
      const size = fs.statSync(path.join(dir, rel)).size;
      total += size;
      const kb = Math.round(size / 1024);
      if (kb > ASSET_BUDGET_KB) fail(`assets/${rel}`, `${kb} KB exceeds the ${ASSET_BUDGET_KB} KB budget`);
    }
  };
  walk("");
  const totalKb = Math.round(total / 1024);
  if (totalKb > TOTAL_ASSET_BUDGET_KB) {
    fail("assets/", `${totalKb} KB total exceeds the ${TOTAL_ASSET_BUDGET_KB} KB budget`);
  }
  notes.push(`assets/ total ${totalKb} KB`);
}

function checkConfig() {
  for (const f of ["_redirects", "_headers", "robots.txt", "sitemap.xml", "site.webmanifest"]) {
    if (!fs.existsSync(path.join(ROOT, f))) fail(f, "missing");
  }

  const manifest = path.join(ROOT, "site.webmanifest");
  if (fs.existsSync(manifest)) {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(manifest, "utf8"));
    } catch (error) {
      fail("site.webmanifest", `invalid JSON: ${error.message}`);
    }
    for (const icon of (parsed && parsed.icons) || []) {
      const rel = icon.src.replace(/^\//, "");
      if (!fs.existsSync(path.join(ROOT, rel))) fail("site.webmanifest", `icon not found: ${icon.src}`);
    }
  }

  // Every sitemap URL should resolve to a real page.
  const sitemap = path.join(ROOT, "sitemap.xml");
  if (fs.existsSync(sitemap)) {
    const xml = fs.readFileSync(sitemap, "utf8");
    for (const [, loc] of xml.matchAll(/<loc>https:\/\/onetomorrow\.today\/([^<]*)<\/loc>/g)) {
      const file = loc === "" ? "index.html" : `${loc}.html`;
      if (!fs.existsSync(path.join(ROOT, file))) fail("sitemap.xml", `lists a missing page: /${loc}`);
    }
  }

  const headers = path.join(ROOT, "_headers");
  if (fs.existsSync(headers)) {
    const text = fs.readFileSync(headers, "utf8");
    for (const required of ["Content-Security-Policy", "X-Content-Type-Options", "frame-ancestors"]) {
      if (!text.includes(required)) fail("_headers", `missing ${required}`);
    }
  }
}

pages.forEach(checkPage);
checkAssets();
checkConfig();

notes.forEach(n => console.log(`  ${n}`));
console.log(`  ${pages.length} pages checked`);

if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("\nAll checks passed.");
