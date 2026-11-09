#!/usr/bin/env node
/**
 * Compares the rendered page against a baseline copy of the site, so a token change
 * is seen before it ships.
 *
 *   node design/scripts/verify-tokens.mjs [baselineDir]
 *
 * With a baselineDir (a checkout of the last published commit), every element's computed
 * colour, type, spacing and border is compared at phone, tablet and desktop widths and each
 * difference is listed. Without one, it only checks that css/tokens.css defines every
 * variable css/site.css reads, and that the page renders with no console errors.
 *
 * Needs the preinstalled Playwright: set PLAYWRIGHT_MODULE to its folder if it is not resolvable.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");

// 1. every var(--x) the stylesheet reads must exist in tokens.css, or be a per-element variable
const site = readFileSync(resolve(root, "css/site.css"), "utf8");
const tokensCss = readFileSync(resolve(root, "css/tokens.css"), "utf8");
const defined = new Set([...tokensCss.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]));
const local = new Set(["k", "d", "i", "x", "y", "w", "s", "n", "r", "p", "v", "c", "off", "pf", "dx", "dy", "rot", "accent", "tlp", "cols", "gutter", "inset"]);
const used = new Set([...site.matchAll(/var\(--([a-z0-9-]+)/g)].map((m) => m[1]));
const missing = [...used].filter((v) => !defined.has(v) && !local.has(v));
if (missing.length) { console.error("site.css reads variables tokens.css does not define:", missing.join(", ")); process.exit(1); }
console.log(`variables: ${used.size} read by site.css, all defined (${defined.size} in tokens.css)`);

// 2. render and compare
const PROPS = ["color", "background-color", "border-top-color", "border-bottom-color", "border-left-color", "border-right-color",
  "border-top-width", "border-bottom-width", "font-family", "font-size", "font-weight", "letter-spacing", "line-height",
  "padding-top", "padding-bottom", "padding-left", "padding-right", "margin-top", "margin-bottom", "width", "height", "border-radius", "outline-color"];
const WIDTHS = [390, 820, 1440];

async function snapshot(browser, dir, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g|ERR_TUNNEL|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(pathToFileURL(resolve(dir, "index.html")).href, { waitUntil: "load" });
  await page.waitForTimeout(400);
  const data = await page.evaluate((props) => {
    const out = [];
    const els = document.querySelectorAll("body *");
    let i = 0;
    for (const el of els) {
      if (el.closest("canvas, svg, script")) continue;
      const cs = getComputedStyle(el);
      const key = el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "") + "#" + i++;
      out.push([key, props.map((p) => cs.getPropertyValue(p))]);
    }
    return out;
  }, PROPS);
  await page.close();
  return { data, errors };
}

const baseline = process.argv[2] ? resolve(process.argv[2]) : null;
const summary = new Map(); // "prop: old → new" -> count
const browser = await chromium.launch();
let diffs = 0;
for (const w of WIDTHS) {
  const now = await snapshot(browser, root, w);
  if (now.errors.length) { console.error(`errors at ${w}px:`, now.errors); process.exit(1); }
  if (!baseline) { console.log(`${w}px: rendered, ${now.data.length} elements, no errors`); continue; }
  const was = await snapshot(browser, baseline, w);
  const wasMap = new Map(was.data);
  let n = 0;
  for (const [key, vals] of now.data) {
    const prev = wasMap.get(key);
    if (!prev) continue;
    vals.forEach((v, i) => {
      if (v !== prev[i]) { n++; const k = `${PROPS[i]}: ${prev[i]} → ${v}`; summary.set(k, (summary.get(k) ?? 0) + 1); }
    });
  }
  diffs += n;
  console.log(`${w}px: ${now.data.length} elements compared, ${n} differences`);
}
await browser.close();
if (baseline && diffs) {
  console.log("what changed (all widths):");
  for (const [k, n] of [...summary].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${k}`);
  console.error(`verify: ${diffs} computed differences against the baseline`); process.exit(1);
}
console.log(baseline ? "verify: identical to the baseline" : "verify: ok");
