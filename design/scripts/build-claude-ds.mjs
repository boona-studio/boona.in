#!/usr/bin/env node
/**
 * Writes the Claude Design "Design System" artifact's data files from tokens.json.
 *
 *   node design/scripts/build-claude-ds.mjs <outDir>
 *
 * Produces <outDir>/project/tokens.json (the list shape that page reads), README.md,
 * components/<Name>/{README.md,preview.html} and components/Cover/preview.html.
 * design-system.json (the index) is written by the publisher, since it records uploads.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(process.argv[2] ?? resolve(root, "design/build/claude-ds"));
const flat = JSON.parse(readFileSync(resolve(root, "design/build/tokens.flat.json"), "utf8"));
const src = JSON.parse(readFileSync(resolve(root, "tokens.json"), "utf8"));
const updated = src.$extensions["in.boona"].updated;

const desc = (path) => {
  // walk the source for $description
  let n = src;
  for (const k of path.split(".")) n = n?.[k];
  return n?.$description ?? "";
};
const w = (p, s) => { mkdirSync(dirname(resolve(out, p)), { recursive: true }); writeFileSync(resolve(out, p), s); };

/* ---------------- tokens.json, list shape */
const colorAlias = { "product.azhagi": "coral", "product.cue": "violet", "product.thali": "teal", "product.fit": "ground", bar: "ink", "on-bar": "ground" };
const colors = [];
for (const [k, v] of Object.entries(flat)) {
  if (!k.startsWith("color.")) continue;
  const short = k.slice(6);
  const name = short.replace(/\./g, "-");
  const value = colorAlias[short] ? `{${colorAlias[short]}}` : String(v).toLowerCase();
  colors.push({ name, value, usage: desc(k) || name });
}
const styles = { display: [], heading: [], text: [] };
const samples = { "display.name": "Boopathi Thangamani", "display.section-title": "Four products, all in beta.", "display.section-title-mid": "Tell me what the business does.", "display.big-number": "10", "display.big-number-unit": "years", "heading.lede": "Working AI, measured from day one.", "heading.quote": "He told us on day two which half of the plan would not ship.", "heading.h2": "Words in. The exact performance out.", "heading.h3": "Instrument before shipping", "heading.table-title": "Notes from the work", "heading.email": "studio.boona@gmail.com", "heading.result-number": "1.7 s", "text.body": "Thali is a React Native app. You set the rules of your meal planner.", "text.intro": "I design and integrate AI into any business.", "text.label": "§ 01 Work · 2026", "text.pill": "Open to projects", "text.button": "Send the brief" };
for (const [k, v] of Object.entries(flat)) {
  if (!k.startsWith("typography.")) continue;
  const [, group, ...rest] = k.split(".");
  const name = rest.join("-");
  styles[group].push({ name, fontSize: v.fontSize, lineHeight: v.lineHeight, fontWeight: v.fontWeight, letterSpacing: v.letterSpacing === "0" ? "0" : v.letterSpacing, ...(name === "label" ? { family: "mono" } : {}), sample: samples[`${group}.${name}`] ?? name, usage: desc(k) });
}
const list = (prefix, nameFn, filter = () => true) => Object.entries(flat).filter(([k]) => k.startsWith(prefix) && filter(k)).map(([k, v]) => ({ name: nameFn(k), value: typeof v === "number" ? v : String(v), usage: desc(k) || k }));
const dsTokens = {
  name: "Boona Grid", version: 2,
  meta: { source: "tokens.json at https://www.boona.in/tokens.json", updated, built: "design/scripts/build-claude-ds.mjs" },
  color: { themes: [{ id: "light", name: "Light" }], tokens: colors },
  type: {
    fonts: [],
    families: { sans: flat["font.family.sans"].map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", "), mono: flat["font.family.mono"].map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ") },
    groups: [
      { name: "Display", family: "sans", styles: styles.display },
      { name: "Heading", family: "sans", styles: styles.heading },
      { name: "Text", family: "sans", styles: styles.text },
    ],
  },
  spacing: { note: "The spacing steps the page uses, plus the vertical rhythm of a section (desktop values; the page scales section spacing with clamp()).", tokens: list("space.", (k) => "space-" + k.slice(6).replace(/\./g, "-")) },
  radius: { note: "Corners are mostly square. Rounded where something is a chip, a tag or a dot.", tokens: list("radius.", (k) => "radius-" + k.slice(7)).map((t) => (t.value === "50%" ? { ...t, value: "50%" } : t)) },
  grid: { note: "A 12-column grid in a 1280 px container, 24 px gutters and column gaps (16 px on phones).", tokens: list("grid.", (k) => "grid-" + k.slice(5).replace(/\./g, "-")).concat(list("breakpoint.", (k) => "breakpoint-" + k.slice(11))) },
  duration: { note: "Motion timings. Reduced motion turns every one of them off.", tokens: list("motion.duration.", (k) => "duration-" + k.split(".").pop()) },
  shadow: { note: "The only shadows on the site: under the depicted devices.", tokens: Object.entries(flat).filter(([k]) => k.startsWith("shadow.")).map(([k, v]) => ({ name: "shadow-" + k.slice(7), value: v.map((sh) => (sh.spread === "0px" ? `${sh.offsetX} ${sh.offsetY} ${sh.blur} ${sh.color.toLowerCase()}` : `${sh.offsetX} ${sh.offsetY} ${sh.blur} ${sh.spread} ${sh.color.toLowerCase()}`)).join(", "), usage: desc(k) })) },
  easing: { note: "snap for screens, bars and chips; ease for reveals; scroll for menu links.", tokens: list("motion.easing.", (k) => "ease-" + k.split(".").pop()).map((t) => ({ ...t, value: `cubic-bezier(${flat["motion.easing." + t.name.slice(5)].join(", ")})` })) },
};
w("project/tokens.json", JSON.stringify(dsTokens, null, 2) + "\n");

/* ---------------- README.md (brand book) */
const readme = readFileSync(resolve(root, "design/README.md"), "utf8")
  .replace("# Boona design system · Grid (v2)", "# Boona Grid")
  .replace(/\| Source of truth \|[^\n]*\n/, "| Source of truth | `tokens.json` in the boona-studio/boona.in repository, served at https://www.boona.in/tokens.json. This system is built from it by `design/scripts/build-claude-ds.mjs`; do not edit values here. |\n");
w("project/README.md", readme + `
## Using this system in a canvas or page

- Colours: \`var(--ink)\`, \`var(--ground)\`, \`var(--quiet)\`, \`var(--line)\`, \`var(--teal)\`, \`var(--coral)\`, \`var(--violet)\`, \`var(--lost)\`, \`var(--signal)\`; dark surfaces \`var(--dark-band)\` with \`var(--on-dark-text)\`.
- Type: \`var(--font-sans)\` for everything, \`var(--font-mono)\` for the 10 px uppercase label only. Text-style classes: \`.name\`, \`.section-title\`, \`.lede\`, \`.quote\`, \`.h2\`, \`.h3\`, \`.result-number\`, \`.body\`, \`.intro\`, \`.label\`, \`.pill\`, \`.button\`.
- Layout: a \`.wrap\` of \`var(--grid-max-width)\` with \`var(--grid-gutter-desktop)\` at the edges, columns 24 px apart; everything aligns to a column.
- Proof: every product or client surface carries a number and the window it was measured in. Unknown numbers are \`[placeholders]\`.
- Clients are never named. Products are.
`);

/* ---------------- components */
const frame = (group, height, body, css = "") => `<!-- @dsCard group="${group}" height=${height} -->
<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"><style>
body{margin:0;padding:24px;background:var(--ground);color:var(--ink);font-family:var(--font-sans);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
.m{font-family:var(--font-mono);font-size:10px;line-height:1.4;letter-spacing:.08em;text-transform:uppercase;color:var(--quiet)}
.m b{color:var(--ink);font-weight:600}
.row{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
${css}
</style></head><body>${body}</body></html>
`;

const comps = {
  Pill: ["Navigation", 88, `<div class="row">
<a class="pill" href="#contact"><i class="dot"></i>Open to projects</a>
<a class="pill" href="#contact"><i class="dot still"></i>Booked until Q2</a></div>`,
    `.pill{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 12px 0 10px;border-radius:var(--radius-pill);background:var(--ink);color:#fff;font-size:13px;font-weight:500;letter-spacing:-.01em;text-decoration:none}
.dot{width:7px;height:7px;border-radius:50%;background:var(--teal);animation:pulse 2.2s infinite}.dot.still{animation:none;background:var(--quiet)}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(63,201,176,.55)}70%{box-shadow:0 0 0 7px rgba(63,201,176,0)}100%{box-shadow:0 0 0 0 rgba(63,201,176,0)}}
@media (prefers-reduced-motion:reduce){.dot{animation:none}}`,
    "The status pill in the top bar: 30 px, ink fill, 13 px medium text, a 7 px teal dot that pulses while the status is open. The words are the status; the dot only repeats them. Use one per page, linking to Contact. Never put a number in it."],
  Button: ["Actions", 120, `<div class="row">
<button class="btn-main" type="button">Send the brief <i aria-hidden="true">→</i></button>
<button class="copy" type="button">Copy</button>
<button class="copy is-done" type="button">Copied</button>
<button class="toggle" type="button" aria-pressed="true"><span class="ico"><i></i><i></i><i></i><i></i></span>Grid<kbd>G</kbd></button></div>`,
    `.btn-main{display:inline-flex;align-items:center;gap:18px;background:var(--ink);color:#fff;border:0;font:600 15px/1.5 var(--font-sans);letter-spacing:-.01em;padding:16px 22px;cursor:pointer;transition:background .2s}.btn-main:hover{background:var(--dark-hover)}.btn-main i{font-style:normal}
.copy{display:inline-flex;align-items:center;height:28px;padding:0 12px;border:1px solid var(--ink);border-radius:var(--radius-pill);background:none;color:var(--ink);font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.copy:hover{background:var(--ink);color:#fff}.copy.is-done{background:var(--teal);border-color:var(--teal);color:#000}
.toggle{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px;border:1px solid rgba(0,0,0,.18);border-radius:var(--radius-pill);background:none;font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);cursor:pointer}.toggle .ico{display:inline-flex;gap:2px}.toggle .ico i{display:block;width:2px;height:10px;background:var(--ink)}.toggle kbd{font:inherit;color:var(--quiet)}
:focus-visible{outline:2px solid var(--signal);outline-offset:3px}`,
    "Three buttons, three jobs. The main button (`.btn-main`) is the one call to action on the page: ink fill, square corners, 16 × 22 px padding, an arrow that moves 4 px on hover; there is one per page. The copy button (`.copy`) is a 28 px mono pill beside something copyable; it turns teal and says Copied. The grid toggle (`.toggle`) is a mono pill with a four-bar icon and its shortcut key. Focus is the 2 px signal ring, 3 px outside."],
  SectionHead: ["Structure", 260, `<div class="shead">
<span class="m lbl">§ 02 Approach</span>
<h2 class="t">How a project runs.</h2>
<p class="d">Listen first, prototype on real data, instrument before shipping, hand over properly. Every date comes as a range.</p></div>`,
    `.shead{display:grid;grid-template-columns:repeat(12,1fr);align-items:end;border-bottom:1px solid var(--ink);padding-bottom:16px;max-width:1232px}
.lbl{grid-column:1/-1;margin-bottom:22px}
.t{grid-column:1/span 9;margin:0;font-size:clamp(44px,7.4vw,96px);font-weight:600;letter-spacing:-.045em;line-height:.95;text-wrap:balance}
.d{grid-column:10/-1;margin:0;color:var(--quiet);max-width:34ch;padding-bottom:6px}`,
    "Every section opens the same way: a 10 px mono label with the section number (`§ 02 Approach`), the title at 96 px semibold spanning nine columns, a short note in the last three columns, and one 1 px ink rule under all of it. The rule is the only horizontal line in ink on the page; everything else is a hairline. Use `.shead__t--mid` (70 px) when the words are long. The label carries the facts (section number, year, place), never a slogan."],
  Results: ["Proof", 220, `<ul class="results">
<li><b class="num">4</b><span class="lbl m">Live senses: sees, hears, speaks, moves</span></li>
<li><b class="num">1.7<small> s</small></b><span class="lbl m">Reply latency</span></li>
<li><b class="num">48 h → 24 h</b><span class="lbl m">Store onboarding, 2018</span></li>
<li><b class="num">[n]</b><span class="lbl m">A number not yet measured stays a placeholder</span></li></ul>`,
    `.results{list-style:none;margin:0;padding:0;border-top:1px solid var(--line);max-width:420px}
.results li{display:grid;grid-template-columns:auto 1fr;align-items:baseline;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
.num{font-weight:600;font-size:36px;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums;white-space:nowrap}
.num small{font-size:.45em;letter-spacing:0;color:var(--quiet);font-weight:500}
.lbl{text-align:right}`,
    "The proof slot. Each row is a number at 36 px tabular (unit at 45 % in quiet) with its label in 10 px mono on the right; the label carries the window or the year. Three rows under every case study and product. A number that has not been measured is written as a bracketed placeholder, never guessed. The numbers count up from 0 when they enter the viewport; reduced motion shows them finished."],
  CaseMeta: ["Structure", 96, `<div class="meta m">
<span class="n"><b>01 / 04</b></span>
<span class="name"><i class="sw" style="background:var(--coral)"></i>Azhagi</span>
<span class="tag">MetaHuman · vision · voice</span>
<span class="yr">2026 · Beta, in development</span></div>`,
    `.meta{display:grid;grid-template-columns:repeat(12,1fr);align-items:baseline;border-top:1px solid var(--line);padding-top:12px;max-width:1232px}
.n{grid-column:1/span 2}.name{grid-column:3/span 3;font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:-.01em;text-transform:none;color:var(--ink)}
.tag{grid-column:6/span 4}.yr{grid-column:10/span 3;text-align:right}
.sw{display:inline-block;width:9px;height:9px;vertical-align:0;margin-right:8px}`,
    "The row above every case study: its number of the set, a 9 px square in the product's colour beside the product name, a mono tag line, and the year and status right-aligned, all on a hairline. The square is the only place a product colour appears as a flat mark at this size; the name beside it carries the meaning."],
  Tag: ["Proof", 80, `<div class="tags m">
<span>Azhagi</span><span>Boona Cue</span><span>Thali</span><span>Boona Fit</span>
<span class="rule">Rule since · Telemetry first</span></div>`,
    `.tags{display:flex;flex-wrap:wrap;gap:6px}.tags span{border:1px solid var(--line);padding:5px 8px;color:var(--ink)}.tags .rule{border-color:var(--teal)}`,
    "Hairline boxes with 10 px mono text, 5 × 8 px padding, square corners. A `.rule` tag has a teal border and names a rule learned from a failure (\"Rule since · …\"). Tags list facts (products, stacks, rules), never adjectives."],
  Availability: ["Contact", 140, `<ul class="avail">
<li class="is-open"><span class="m">Q4 2026</span><b><i class="dot"></i>Open to projects</b></li>
<li><span class="m">Q1 2027</span><b>Limited</b></li>
<li><span class="m">Q2 2027</span><b>Booked</b></li></ul>`,
    `.avail{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:520px}
.avail li{border:1px solid var(--ink);min-height:92px;padding:10px 12px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;font-size:13px}
.avail li b{font-weight:500;display:flex;align-items:center;gap:8px;letter-spacing:-.01em}
.avail li.is-open{background:var(--teal);border-color:var(--teal)}.avail li.is-open .m{color:rgba(0,0,0,.65)}
.dot{width:7px;height:7px;border-radius:50%;background:#000}`,
    "Three quarters, three cards with a 1 px ink border. The open quarter fills teal with black text and a black dot; the others say Limited or Booked in plain words. The quarter names update from the date. Only one card is ever teal."],
  FormField: ["Contact", 180, `<form class="form" onsubmit="return false">
<div class="field"><label class="m" for="n">Your name</label><input id="n" type="text"></div>
<div class="field"><label class="m" for="c">Company</label><input id="c" type="text" value="Acme Steel"></div>
<div class="field full"><label class="m" for="w">What should AI do for you?</label><textarea id="w" placeholder="The job it should take off your plate, in a sentence or two."></textarea></div></form>`,
    `.form{display:grid;grid-template-columns:1fr 1fr;gap:26px 24px;max-width:600px}.field{display:flex;flex-direction:column;gap:8px}.field.full{grid-column:1/-1}
input,textarea{font:inherit;color:inherit;background:transparent;border:0;border-bottom:1px solid var(--ink);padding:8px 0;border-radius:0;font-size:15px;width:100%}
textarea{min-height:64px;resize:vertical}::placeholder{color:var(--quiet)}
input:focus,textarea:focus{outline:none;border-bottom-color:var(--teal);box-shadow:0 1px 0 var(--teal)}`,
    "A mono label above a borderless field with a single 1 px ink line under it. Focus turns the line teal and doubles it. No boxes, no radius, no inner padding at the sides, so the field sits on the grid like a line of text. Placeholders are examples of what to write, in quiet."],
  WritingRow: ["Content", 170, `<table class="table"><tbody>
<tr><td class="m">2026-11-02</td><td class="title">Build the telemetry before you need it</td><td class="m">LinkedIn</td><td class="m rd"><a class="read" href="#">Read</a></td></tr>
<tr class="hover"><td class="m">2026-10-28</td><td class="title">Every date is a range</td><td class="m">X</td><td class="m rd"><a class="read" href="#">Read</a></td></tr></tbody></table>`,
    `.table{width:100%;max-width:1000px;border-collapse:collapse;table-layout:fixed;border-top:1px solid var(--line)}
.table tr{border-bottom:1px solid var(--line);transition:background .25s,color .25s}.table td{padding:22px 12px;vertical-align:middle}
.title{font-size:25px;font-weight:500;letter-spacing:-.025em;line-height:1.2}.rd{text-align:right;white-space:nowrap}.read{color:inherit;text-decoration:none}.read::after{content:" \\2192"}
.table tr:hover,.table tr.hover{background:var(--ink);color:#fff}.table tr:hover .m,.table tr.hover .m{color:rgba(255,255,255,.72)}
.table td:first-child{width:12%}.table td:nth-child(3),.table td:nth-child(4){width:18%}`,
    "Posts as a table: mono date, 25 px title, channel, Read →. Pointing at a row fills it ink with white text and nudges the title 8 px right; the second row shows that state. One row per post; copy a row to add one."],
  Label: ["Type", 72, `<div class="row" style="gap:32px">
<span class="m">§ 01 Work · 2026</span>
<span class="m"><b>01 / 04</b></span>
<span class="m">Local time <b>14:32:08</b> IST</span>
<span class="m">Reply latency</span></div>`, ``,
    "The 10 px uppercase Geist Mono label, +0.08em, in quiet. It names, numbers and dates things: section numbers, case numbers, fact labels, meta bars, the footer. Bold parts switch to ink at 600. It is the only place Geist Mono appears outside the product screens."],
};
for (const [name, [group, height, body, css, guide]] of Object.entries(comps)) {
  w(`project/components/${name}/preview.html`, frame(group, height, body, css));
  w(`project/components/${name}/README.md`, `# ${name}\n\n${guide}\n`);
}

/* ---------------- cover */
w("project/components/Cover/preview.html", `<!-- @dsCard height=300 -->
<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"><style>
body{margin:0;width:960px;height:300px;position:relative;background:var(--ground);color:var(--ink);font-family:var(--font-sans);overflow:hidden}
svg{position:absolute;inset:0}
.ink{fill:var(--ink)}.teal{fill:var(--teal)}.coral{fill:var(--coral)}.violet{fill:var(--violet)}.quiet{fill:var(--quiet)}.line{stroke:var(--line)}.rule{stroke:var(--ink)}
.name{position:absolute;left:48px;bottom:56px;font-size:96px;font-weight:700;letter-spacing:-.04em;line-height:.95;margin:0}
.tag{position:absolute;left:48px;bottom:28px;font-size:13px;color:var(--quiet);margin:0;max-width:440px}
</style></head><body>
<!-- blocks: ink 240×144 (space-48 ×5 × space-48 ×3), teal 120×72, coral 72×72, violet 48×72, quiet 24×144 — all multiples of space-24, radius-none
     arrangement: a flush modular stack right of x=480, bleeding off the top, like the page's 12-column blocks
     pattern: the drafting grid — 1 px hairlines at column pitch (960/12=80) crossing the blocks, and one ink rule: "a white drafting sheet with a faint 12-column grid, one black rule under every section title"
     scales: space-24, space-48, radius-none, border hairline 1px -->
<svg width="960" height="300" viewBox="0 0 960 300" aria-hidden="true">
  <g class="line" stroke-width="1">
    <line x1="560" y1="0" x2="560" y2="300"/><line x1="640" y1="0" x2="640" y2="300"/><line x1="720" y1="0" x2="720" y2="300"/><line x1="800" y1="0" x2="800" y2="300"/><line x1="880" y1="0" x2="880" y2="300"/>
  </g>
  <rect class="ink" x="560" y="0" width="240" height="144"/>
  <rect class="teal" x="800" y="72" width="120" height="72"/>
  <rect class="coral" x="560" y="168" width="72" height="72"/>
  <rect class="violet" x="656" y="168" width="48" height="72"/>
  <rect class="quiet" x="920" y="0" width="24" height="144"/>
  <line class="rule" x1="560" y1="264" x2="944" y2="264" stroke-width="1"/>
</svg>
<p class="name">Boona Grid</p>
<p class="tag">A white drafting sheet, Geist set tight, one colour per product.</p>
</body></html>
`);

console.log(`claude-ds: wrote ${out}/project (tokens.json, README.md, ${Object.keys(comps).length} components, Cover)`);
