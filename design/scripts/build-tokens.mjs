#!/usr/bin/env node
/**
 * Boona token build.
 *
 *   node design/scripts/build-tokens.mjs
 *
 * Reads the public tokens.json at the repository root (W3C Design Tokens) and writes:
 *
 *   css/tokens.css                     the CSS custom properties css/site.css reads
 *   design/build/figma-variables.json  collections, variables and text styles for design/scripts/figma-sync.js
 *   design/build/tokens.flat.json      every token resolved, one line each, for anything else
 *   design/build/contrast-report.md    WCAG contrast of every text and UI colour pair the site uses
 *
 * tokens.json is the single source of truth. Change a value there, run this, commit all of it.
 * The build exits 1 when a required colour pair falls under WCAG AA, so a bad value never ships.
 * No dependencies: Node 18 or newer.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const src = resolve(root, "tokens.json");
const tokens = JSON.parse(readFileSync(src, "utf8"));
const updated = tokens.$extensions?.["in.boona"]?.updated ?? "unknown";

/* ------------------------------------------------------------------ walk + resolve */

const isToken = (n) => n && typeof n === "object" && "$value" in n;
const flat = new Map(); // "color.ink" -> { value, type, description, extensions }

function walk(node, path = [], inheritedType) {
  if (!node || typeof node !== "object") return;
  const type = node.$type ?? inheritedType;
  if (isToken(node)) {
    flat.set(path.join("."), { value: node.$value, type, description: node.$description ?? "", ext: node.$extensions?.["in.boona"] ?? {} });
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    walk(v, [...path, k], type);
  }
}
walk(tokens);

const ALIAS = /^\{([^}]+)\}$/;
function resolveValue(v, depth = 0) {
  if (depth > 10) throw new Error("alias loop");
  if (typeof v === "string") {
    const m = v.match(ALIAS);
    if (m) {
      const t = flat.get(m[1]);
      if (!t) throw new Error(`unknown alias ${v}`);
      return resolveValue(t.value, depth + 1);
    }
    return v;
  }
  if (Array.isArray(v)) return v.map((x) => resolveValue(x, depth + 1));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolveValue(x, depth + 1)]));
  return v;
}
const get = (path) => {
  const t = flat.get(path);
  if (!t) throw new Error(`missing token ${path}`);
  return resolveValue(t.value);
};
const resolved = {};
for (const [k, t] of flat) resolved[k] = { ...t, value: resolveValue(t.value) };

/* ------------------------------------------------------------------ css/tokens.css */

const kebab = (p) => p.replace(/\./g, "-");
const fontStack = (arr) => arr.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ");
const bezier = (a) => `cubic-bezier(${a.join(", ")})`;

const lines = [];
lines.push(`/* Generated from tokens.json (updated ${updated}) by design/scripts/build-tokens.mjs. Do not edit; edit tokens.json and rebuild. */`);
lines.push(":root {");

// Short names: the ones css/site.css already reads.
const shortColor = ["ground", "ink", "quiet", "line", "bar", "on-bar", "teal", "coral", "violet", "lost", "signal"];
lines.push("  /* colour, the short names the stylesheet uses */");
for (const c of shortColor) lines.push(`  --${c}: ${get(`color.${c}`)};`);
lines.push("  /* colour, the rest */");
for (const [k, t] of Object.entries(resolved)) {
  if (!k.startsWith("color.") || shortColor.includes(k.slice(6))) continue;
  lines.push(`  --${kebab(k)}: ${t.value};`);
}
lines.push("  /* type */");
lines.push(`  --sans: ${fontStack(get("font.family.sans"))};`);
lines.push(`  --mono: ${fontStack(get("font.family.mono"))};`);
for (const [k, t] of Object.entries(resolved)) {
  if (k.startsWith("font.weight.") || k.startsWith("font.tracking.") || k.startsWith("font.leading.")) lines.push(`  --${kebab(k)}: ${t.value};`);
}
lines.push("  /* text styles: size (fluid where the page scales it), and the phone size */");
for (const [k, t] of Object.entries(resolved)) {
  if (!k.startsWith("typography.")) continue;
  const name = kebab(k.replace(/^typography\.(display|heading|text)\./, "text."));
  const size = t.ext.fluid ?? t.value.fontSize;
  lines.push(`  --${name}: ${size};`);
  if (t.ext.phone) lines.push(`  --${name}-phone: ${t.ext["phone-fluid"] ?? t.ext.phone};`);
}
lines.push("  /* grid */");
lines.push(`  --cols: ${get("grid.columns.desktop")};`);
lines.push(`  --gutter: ${get("grid.gutter.desktop")};`);
lines.push(`  --inset: ${get("grid.inset.desktop")};`);
lines.push(`  --max: ${get("grid.max-width")};`);
lines.push(`  --nav-h: ${get("grid.nav-height")};`);
lines.push(`  --stick: ${get("grid.sticky-top")};`);
lines.push("  /* space */");
for (const [k, t] of Object.entries(resolved)) {
  if (!k.startsWith("space.")) continue;
  lines.push(`  --${kebab(k)}: ${t.ext.fluid ?? t.value};`);
}
lines.push("  /* radius */");
for (const [k, t] of Object.entries(resolved)) if (k.startsWith("radius.")) lines.push(`  --${kebab(k)}: ${t.value};`);
lines.push("  /* shadow */");
for (const [k, t] of Object.entries(resolved)) {
  if (!k.startsWith("shadow.")) continue;
  const css = t.value.map((sh) => (sh.spread === "0px" ? `${sh.offsetX} ${sh.offsetY} ${sh.blur} ${sh.color}` : `${sh.offsetX} ${sh.offsetY} ${sh.blur} ${sh.spread} ${sh.color}`)).join(", ");
  lines.push(`  --shadow-${k.slice(7)}: ${css};`);
}
lines.push("  /* motion */");
for (const [k, t] of Object.entries(resolved)) if (k.startsWith("motion.duration.")) lines.push(`  --duration-${k.split(".").pop()}: ${t.value};`);
for (const [k, t] of Object.entries(resolved)) if (k.startsWith("motion.easing.")) lines.push(`  --ease-${k.split(".").pop()}: ${bezier(t.value)};`);
lines.push(`  --snap: var(--ease-snap);`);
lines.push(`  --ease: var(--ease-ease);`);
lines.push("}");
lines.push(`@media (max-width: ${get("breakpoint.tablet-max")}) { :root { --cols: ${get("grid.columns.tablet")}; } }`);
lines.push(`@media (max-width: ${get("breakpoint.phone-max")}) { :root { --cols: ${get("grid.columns.phone")}; --gutter: ${get("grid.gutter.phone")}; --inset: ${get("grid.inset.phone")}; } }`);
lines.push("");
writeFileSync(resolve(root, "css/tokens.css"), lines.join("\n"));

/* ------------------------------------------------------------------ contrast */

function hexToRgba(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  const a = n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
  return [r, g, b, a];
}
function over(fg, bg) {
  // composite fg (with alpha) over opaque bg
  const [r1, g1, b1, a] = hexToRgba(fg), [r2, g2, b2] = hexToRgba(bg);
  return [r1 * a + r2 * (1 - a), g1 * a + g2 * (1 - a), b1 * a + b2 * (1 - a)];
}
function lum([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(fgHex, bgHex) {
  const bg = hexToRgba(bgHex).slice(0, 3);
  const fg = over(fgHex, bgHex);
  const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Every pair the page draws. kind: text (4.5), large (3, text 24px+ or 19px bold), ui (3, non-text), decor (no requirement).
// required: the build fails when it falls under its bar. advisory: reported, does not fail (inherited from the live site; decision pending).
const PAIRS = [
  ["color.ink", "color.ground", "text", "Body, headings, the big name", "required"],
  ["color.quiet", "color.ground", "text", "Secondary text, 10 px mono labels", "required"],
  ["color.on-bar", "color.bar", "text", "Top bar, footer links, the main button", "required"],
  ["color.on-dark.strong", "color.dark.band", "text", "Footer colophon paragraph", "required"],
  ["color.on-dark.text", "color.dark.band", "text", "Case text on the dark band", "required"],
  ["color.on-dark.muted", "color.dark.band", "text", "Mono labels and unit text on the dark band", "required"],
  ["color.ink", "color.teal", "text", "'Open to projects' on the open availability card", "required"],
  ["color.ink", "color.surface.bubble", "text", "Incoming chat bubble in the Azhagi screen", "required"],
  ["color.signal", "color.ground", "ui", "Focus ring, crosshair, selection box", "required"],
  ["color.on-bar", "color.signal", "text", "Crosshair and dimension labels", "required"],
  ["color.quiet", "color.dark.band", "text", "If the quiet grey is ever used on the band (it is not)", "advisory"],
  ["color.teal-ink", "color.ground", "text", "Index numerals, 'Rule' marks, 'Current' on the timeline, Thali quantities: teal letters", "required"],
  ["color.teal", "color.ground", "text", "Teal as letters is no longer used anywhere (since 2026-11-09); kept as a reminder", "advisory"],
  ["color.on-bar", "color.lost", "text", "'End' button in the Azhagi screen, white on coral-red", "advisory"],
  ["color.teal", "color.ground", "ui", "Status dot, key-phrase underline, open card fill: always beside words that say the same", "advisory"],
  ["color.coral", "color.ground", "ui", "Azhagi swatch and screen accents: beside the product name", "advisory"],
  ["color.violet", "color.ground", "ui", "Boona Cue swatch and keyframes: beside the product name", "advisory"],
  ["color.lost", "color.ground", "ui", "Placeholder outline (with a FILL tag), live dot (with the word Live)", "advisory"],
  ["color.line", "color.ground", "decor", "Hairlines and the grid overlay (decorative, no bar)", "advisory"],
];
const BAR = { text: 4.5, large: 3, ui: 3, decor: 0 };
const report = [];
let failed = false;
report.push(`# Contrast report\n\nGenerated from tokens.json (updated ${updated}). WCAG 2.2: text 4.5:1, large text and UI parts 3:1. Alpha colours are composited on their background before measuring.\n`);
report.push("| Foreground | Background | Used for | Ratio | Needs | Result |\n|---|---|---|---|---|---|");
for (const [fg, bg, kind, use, level] of PAIRS) {
  const r = ratio(get(fg), get(bg));
  const need = BAR[kind];
  const ok = r >= need;
  const result = kind === "decor" ? "no bar" : ok ? "pass" : level === "required" ? "**FAIL**" : "fails, advisory";
  if (!ok && level === "required" && kind !== "decor") failed = true;
  report.push(`| ${fg} ${get(fg)} | ${bg} ${get(bg)} | ${use} | ${r.toFixed(2)}:1 | ${need}:1 ${kind} | ${result} |`);
}
report.push(`\nAdvisory rows do not stop the build. The product colours and the status dot are identity marks that always sit beside the words that carry the meaning, so colour alone never carries it (WCAG 1.4.11 asks 3:1 only of parts needed to identify a control or state). Teal letters use color.teal-ink (#0F766E) since 2026-11-09; the bright teal stays for dots, underlines and fills. The one remaining advisory text row is white on the coral-red End button inside the Azhagi demo screen.`);
mkdirSync(resolve(root, "design/build"), { recursive: true });
writeFileSync(resolve(root, "design/build/contrast-report.md"), report.join("\n") + "\n");

/* ------------------------------------------------------------------ figma-variables.json */

const px = (s) => (typeof s === "string" && s.endsWith("px") ? parseFloat(s) : typeof s === "number" ? s : null);
const em = (s) => (typeof s === "string" && s.endsWith("em") ? parseFloat(s) : 0);
const hexToFigma = (hex) => { const [r, g, b, a] = hexToRgba(hex); return { r: r / 255, g: g / 255, b: b / 255, a }; };

const collections = [];
const colorVars = [];
for (const [k, t] of Object.entries(resolved)) {
  if (!k.startsWith("color.")) continue;
  const short = k.slice(6);
  colorVars.push({ name: short.replace(/\./g, "/"), type: "COLOR", value: hexToFigma(t.value), description: t.description, cssVar: shortColor.includes(short) ? `--${short}` : `--${kebab(k)}`, scopes: ["ALL_SCOPES"] });
}
collections.push({ name: "Color", modes: ["Light"], variables: colorVars });

const typeVars = [];
for (const [k, t] of Object.entries(resolved)) {
  if (k.startsWith("font.weight.")) typeVars.push({ name: `weight/${k.split(".").pop()}`, type: "FLOAT", value: t.value, description: t.description, scopes: ["FONT_WEIGHT"] });
  if (k.startsWith("font.tracking.")) typeVars.push({ name: `tracking/${k.split(".").pop()}`, type: "FLOAT", value: +(em(t.value) * 100).toFixed(2), description: `${t.description} Percent of the size (${t.value}).`, scopes: ["LETTER_SPACING"] });
  if (k.startsWith("font.leading.")) typeVars.push({ name: `leading/${k.split(".").pop()}`, type: "FLOAT", value: +(t.value * 100).toFixed(1), description: `${t.description} Percent of the size.`, scopes: ["LINE_HEIGHT"] });
  if (k.startsWith("typography.")) {
    const n = k.replace(/^typography\.(display|heading|text)\./, "");
    typeVars.push({ name: `size/${n}`, type: "FLOAT", value: px(t.value.fontSize), description: `${t.description} Desktop size.`, scopes: ["FONT_SIZE"] });
    if (t.ext.phone) typeVars.push({ name: `size-phone/${n}`, type: "FLOAT", value: px(t.ext.phone), description: `${n} on a 390 px phone.`, scopes: ["FONT_SIZE"] });
  }
}
collections.push({ name: "Type", modes: ["Desktop"], variables: typeVars });

const spaceVars = [];
for (const [k, t] of Object.entries(resolved)) {
  if (k.startsWith("space.")) spaceVars.push({ name: k.slice(6).replace(/\./g, "/"), type: "FLOAT", value: px(t.value), description: t.description, scopes: ["GAP", "WIDTH_HEIGHT"] });
  if (k.startsWith("grid.") && t.type === "dimension") spaceVars.push({ name: `grid/${k.slice(5).replace(/\./g, "/")}`, type: "FLOAT", value: px(t.value), description: t.description, scopes: ["GAP", "WIDTH_HEIGHT"] });
  if (k.startsWith("grid.columns.")) spaceVars.push({ name: `grid/columns/${k.split(".").pop()}`, type: "FLOAT", value: t.value, description: t.description, scopes: ["ALL_SCOPES"] });
}
collections.push({ name: "Space", modes: ["Desktop"], variables: spaceVars });

const radiusVars = [];
for (const [k, t] of Object.entries(resolved)) {
  if (!k.startsWith("radius.")) continue;
  const v = t.value === "50%" ? 9999 : px(t.value);
  radiusVars.push({ name: k.slice(7), type: "FLOAT", value: v, description: t.description + (t.value === "50%" ? " (50 % in CSS; 9999 here makes any box a circle)" : ""), scopes: ["CORNER_RADIUS"] });
}
collections.push({ name: "Radius", modes: ["Default"], variables: radiusVars });

const weightName = { 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold" };
const textStyles = [];
for (const [k, t] of Object.entries(resolved)) {
  if (!k.startsWith("typography.")) continue;
  const v = t.value;
  const group = k.split(".")[1];
  const n = k.split(".").slice(2).join("/");
  const fam = Array.isArray(v.fontFamily) ? v.fontFamily[0] : v.fontFamily;
  textStyles.push({
    name: `${group}/${n}`,
    family: fam,
    style: weightName[v.fontWeight] ?? "Regular",
    size: px(v.fontSize),
    letterSpacing: { unit: "PERCENT", value: +(em(v.letterSpacing) * 100).toFixed(2) },
    lineHeight: { unit: "PERCENT", value: +(v.lineHeight * 100).toFixed(1) },
    textCase: k === "typography.text.label" ? "UPPER" : "ORIGINAL",
    description: t.description + (t.ext.phone ? ` Phone: ${t.ext.phone}.` : ""),
    bind: { size: `size/${n.replace(/\//g, ".")}` },
  });
}

writeFileSync(resolve(root, "design/build/figma-variables.json"), JSON.stringify({
  $generated: `tokens.json updated ${updated}`,
  fonts: tokens.$extensions["in.boona"].fonts,
  collections, textStyles,
}, null, 2) + "\n");

writeFileSync(resolve(root, "design/build/tokens.flat.json"), JSON.stringify(
  Object.fromEntries(Object.entries(resolved).map(([k, t]) => [k, t.value])), null, 2) + "\n");

/* ------------------------------------------------------------------ done */

console.log(`tokens: ${flat.size} read from tokens.json (updated ${updated})`);
console.log(`wrote css/tokens.css, design/build/figma-variables.json (${colorVars.length} colours, ${typeVars.length} type, ${spaceVars.length} space, ${radiusVars.length} radius, ${textStyles.length} text styles), design/build/tokens.flat.json, design/build/contrast-report.md`);
if (failed) { console.error("contrast: a required pair is under WCAG AA. See design/build/contrast-report.md"); process.exit(1); }
console.log("contrast: all required pairs pass AA");
