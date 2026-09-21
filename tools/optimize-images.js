#!/usr/bin/env node
/**
 * Rebuilds assets/ at web-appropriate sizes.
 *
 * The heroes ship as CSS background-image, so they are the LCP resource on
 * every page and cannot be lazy-loaded. Originals were 8000px / 7MB.
 *
 * Idempotent: an image already at or under its target width and byte budget
 * is left alone, so repeated runs do not re-encode (and degrade) the output.
 *
 * Usage: node tools/optimize-images.js [--force]
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ASSETS = path.join(__dirname, "..", "assets");
const FORCE = process.argv.includes("--force");

// Heroes render full-bleed with background-size: cover. 2560px covers a 2x
// 1280 viewport, which is the widest that meaningfully renders.
const HEROES = [
  { src: "earth-about.jpg", width: 2048, budget: 400, quality: 72 },
  { src: "earth-plan.png", width: 2560, budget: 400, to: "jpg" },
  { src: "earth-why.jpg", width: 2560, budget: 400 },
  { src: "earth-join.jpg", width: 1800, budget: 300, quality: 72 }
];

const kb = bytes => Math.round(bytes / 1024);

function report(label, before, after) {
  const pct = Math.round((1 - after / before) * 100);
  console.log(`  ${label.padEnd(26)} ${String(kb(before)).padStart(6)} KB -> ${String(kb(after)).padStart(5)} KB  (-${pct}%)`);
}

async function optimizeHero(hero) {
  const base = hero.src.replace(/\.(jpe?g|png)$/i, "");
  // After the first run a PNG source is gone, replaced by its JPEG. Fall back
  // to that so re-runs still have something to work from.
  const srcPath = [hero.src, `${base}.jpg`]
    .map(name => path.join(ASSETS, name))
    .find(fs.existsSync);
  if (!srcPath) {
    console.log(`  ${hero.src}: missing, skipped`);
    return;
  }

  const before = fs.statSync(srcPath).size;
  const meta = await sharp(srcPath).metadata();
  const jpgPath = path.join(ASSETS, `${base}.jpg`);
  const webpPath = path.join(ASSETS, `${base}.webp`);

  // Skip once the source is already at target size and both outputs exist.
  // Re-encoding an earlier run's output loses quality every generation, so
  // this is checked on dimensions, not bytes -- a file sitting exactly on the
  // byte budget would otherwise be rebuilt on every run.
  const done = meta.width <= hero.width && fs.existsSync(jpgPath) && fs.existsSync(webpPath);
  if (done && !FORCE) {
    console.log(`  ${path.basename(srcPath).padEnd(26)} already optimized, skipped`);
    return;
  }

  const pipeline = () =>
    sharp(srcPath).resize({
      width: hero.width,
      withoutEnlargement: true,
      fit: "inside"
    });

  // mozjpeg gets these photographic skies materially smaller than baseline.
  await pipeline().jpeg({ quality: hero.quality || 78, mozjpeg: true, progressive: true }).toFile(jpgPath + ".tmp");
  await pipeline().webp({ quality: (hero.quality || 78) - 4, effort: 5 }).toFile(webpPath);

  fs.renameSync(jpgPath + ".tmp", jpgPath);

  // earth-plan started life as a PNG of a photograph; drop the PNG once the
  // JPEG replacement exists so the old 6.6MB file stops being deployed.
  if (hero.to === "jpg" && path.extname(srcPath).toLowerCase() === ".png") {
    fs.unlinkSync(srcPath);
    console.log(`  ${path.basename(srcPath)} -> ${base}.jpg (png removed)`);
  }

  report(`${base}.jpg`, before, fs.statSync(jpgPath).size);
  report(`${base}.webp`, before, fs.statSync(webpPath).size);
}

async function optimizeLogos() {
  // Same story as the heroes: main-logo.png is replaced by logo-512.png.
  const src = ["main-logo.png", "logo-512.png"]
    .map(name => path.join(ASSETS, name))
    .find(fs.existsSync);
  if (!src) {
    console.log("  no logo source found, skipped");
    return;
  }
  const outputs = ["logo-120.png", "logo-512.png", "logo-maskable-512.png"].map(n => path.join(ASSETS, n));
  if (path.basename(src) !== "main-logo.png" && outputs.every(fs.existsSync) && !FORCE) {
    console.log("  logos already optimized, skipped");
    return;
  }

  const before = fs.statSync(src).size;
  const buffer = fs.readFileSync(src);

  // Header renders at 60 CSS px; 120 covers 2x without shipping 1024.
  await sharp(buffer).resize(120, 120).png({ compressionLevel: 9, palette: true }).toFile(path.join(ASSETS, "logo-120.png"));

  // Manifest + apple-touch want 512.
  await sharp(buffer).resize(512, 512).png({ compressionLevel: 9, palette: true }).toFile(path.join(ASSETS, "logo-512.png"));

  // Maskable needs ~80% safe zone inside the square.
  await sharp(buffer)
    .resize(410, 410)
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#071018" })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(ASSETS, "logo-maskable-512.png"));

  report("logo-120.png", before, fs.statSync(path.join(ASSETS, "logo-120.png")).size);
  report("logo-512.png", before, fs.statSync(path.join(ASSETS, "logo-512.png")).size);
  report("logo-maskable-512.png", before, fs.statSync(path.join(ASSETS, "logo-maskable-512.png")).size);

  if (path.basename(src) === "main-logo.png") {
    fs.unlinkSync(src);
    console.log("  main-logo.png removed (replaced by logo-120/512)");
  }
}

async function main() {
  console.log("Heroes:");
  for (const hero of HEROES) await optimizeHero(hero);
  console.log("Logos:");
  await optimizeLogos();

  const total = fs
    .readdirSync(ASSETS)
    .reduce((sum, f) => sum + fs.statSync(path.join(ASSETS, f)).size, 0);
  console.log(`\nassets/ total: ${kb(total)} KB`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
