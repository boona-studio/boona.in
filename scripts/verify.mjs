#!/usr/bin/env node
// Visual verification: serves the built site and screenshots every route, light at desktop and dark at phone,
// plus the component gallery in all four combinations. Fails on console errors, horizontal overflow, or a page
// without exactly one h1. Output: verify/<route>-<theme>-<width>.png. Look at them. Run after `npm run build`.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { preview } from "vite";

const require = createRequire(import.meta.url);
// PLAYWRIGHT_MODULE lets a CI image point at a preinstalled Playwright instead of node_modules.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const outDir = resolve("verify");
mkdirSync(outDir, { recursive: true });

const server = await preview({ preview: { port: 4173, strictPort: true }, logLevel: "silent" });
const url = server.resolvedUrls?.local?.[0] ?? "http://localhost:4173/";
const browser = await chromium.launch();

const routes = ["/", "/work", "/work/cases", "/work/cases/invoice-matching", "/products", "/products/azhagi", "/products/cue", "/writing", "/about", "/contact"];
const shots = [
  ...routes.flatMap((r) => [{ route: r, theme: "light", width: 1280 }, { route: r, theme: "dark", width: 390 }]),
  { route: "/gallery", theme: "light", width: 1280 }, { route: "/gallery", theme: "dark", width: 1280 }, { route: "/gallery", theme: "light", width: 390 }, { route: "/gallery", theme: "dark", width: 390 },
];
const isFontFetch = (t) => /fonts\.g(oogleapis|static)\.com|ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED/.test(t);
let failures = 0;
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.width, height: 900 }, colorScheme: s.theme, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !isFontFetch(m.text())) errors.push(m.text()); });
  page.on("requestfailed", (r) => { if (!isFontFetch(r.url() + r.failure()?.errorText)) errors.push(`request failed: ${r.url()}`); });
  await page.goto(url + "#" + s.route, { waitUntil: "networkidle" });
  await page.evaluate((t) => { localStorage.setItem("boona-theme", t); document.documentElement.setAttribute("data-theme", t); }, s.theme);
  await page.waitForTimeout(150);
  const name = s.route === "/" ? "home" : s.route.replace(/^\//, "").replace(/\//g, "-");
  const file = resolve(outDir, `${name}-${s.theme}-${s.width}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const h1s = await page.evaluate(() => document.querySelectorAll("h1").length);
  const bad = errors.length || overflow || h1s !== 1;
  if (bad) failures++;
  console.log(`${bad ? "FAIL" : "ok  "} ${s.route} ${s.theme} @ ${s.width}px  h1=${h1s} overflow=${overflow} errors=${errors.length} → ${file}`);
  if (errors.length) console.error("  " + errors.join("\n  "));
  await ctx.close();
}
await browser.close();
await server.close();
if (failures) { console.error(`${failures} render(s) failed`); process.exitCode = 1; }
