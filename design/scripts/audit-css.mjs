#!/usr/bin/env node
/**
 * Lists every colour literal in css/site.css that bypasses the tokens.
 *
 *   node design/scripts/audit-css.mjs
 *
 * Exit code 0 always; this is a report, not a gate. The gate is the contrast report.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(resolve(root, "css/site.css"), "utf8");
const flat = JSON.parse(readFileSync(resolve(root, "design/build/tokens.flat.json"), "utf8"));
const byHex = {};
for (const [k, v] of Object.entries(flat)) if (typeof v === "string" && v.startsWith("#")) byHex[v.toUpperCase()] = k;

const expand = (h) => (h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h).toUpperCase();
const count = (arr) => arr.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map());

const hexes = count((css.match(/#[0-9A-Fa-f]{3,8}\b/g) ?? []).map(expand));
const rgbas = count(css.match(/rgba?\([^)]*\)/g) ?? []);

console.log("Hex literals in css/site.css");
for (const [h, n] of [...hexes].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${h.padEnd(9)}  ${byHex[h] ? `has token ${byHex[h]} (use var())` : "NO TOKEN"}`);
console.log("\nAlpha literals in css/site.css (tokens: on-dark 86/72/55/25/12 %, overlay 35/4 %)");
for (const [r, n] of [...rgbas].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${r}`);
console.log(`\n${[...hexes.values()].reduce((a, b) => a + b, 0)} hex literals, ${[...rgbas.values()].reduce((a, b) => a + b, 0)} alpha literals.`);
