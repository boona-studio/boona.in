# Boona design system · Grid (v2)

The system behind www.boona.in, as it went live on 6 November 2026 and was tokenised on 8–9 November. It replaces direction B · Readout (v1, 2–3 November), which stays in the repository history.

One sentence: a white drafting sheet with a faint 12-column grid, Geist set large and tight, 10 px mono labels, one black rule under every section title, and one colour per product.

| | |
|---|---|
| Source of truth | `tokens.json` at the site root, W3C Design Tokens, also served at https://www.boona.in/tokens.json |
| Build | `npm run tokens` → `css/tokens.css` (the page loads it), `design/build/figma-variables.json`, `design/build/tokens.flat.json`, `design/build/contrast-report.md` |
| Check | `npm run verify` renders the page at 390 / 820 / 1440 px; with a baseline folder it diffs every element's computed style |
| Figma | [Boona — Design system (Grid v2)](https://www.figma.com/design/9ALjyFp3bldjj3Pvh9SW5S) in the Boona folder: pages Cover · Foundations · Components. `design/scripts/figma-sync.js` creates or updates its variable collections and text styles from `figma-variables.json`; ids are in `design/build/figma-ledger.json`. The older "Boona — Content templates" file is built on v1 · Readout and is superseded until re-skinned |
| Claude Design | the Design System artifact [Boona Grid](https://claude.ai/artifact/34rooSgXffj6itFp4VAk9B) is built from the same `tokens.json` by `design/scripts/build-claude-ds.mjs`; the Visual Directions canvas has it installed |

## Foundations

### Colour

| Token | Hex | Where |
|---|---|---|
| `color.ground` | `#FFFFFF` | Page |
| `color.ink` | `#000000` | Text, section rule, top bar, main button, writing-row hover fill |
| `color.quiet` | `#5A5A5A` | Secondary text, mono labels |
| `color.line` | `#DEDEDE` | Hairlines, grid overlay |
| `color.bar` / `on-bar` | ink / ground | Dark footer and dark band |
| `color.teal` | `#3FC9B0` | Brand accent: key-phrase underline, status dot, quote mark, open quarter, current timeline dot. Also Thali |
| `color.coral` | `#E06A5F` | Azhagi |
| `color.violet` | `#A98BDC` | Boona Cue |
| `color.product.fit` | white | Boona Fit has no colour of its own; it sits on the dark band with the other three on its rings |
| `color.lost` | `#FF8A80` | Ending or negative states; dashed outline on unfilled placeholders |
| `color.signal` | `#2F5BFF` | Motion and tool overlays only: grid draw, selection boxes, crosshair, focus ring. Never a static accent |
| `color.dark.band` / `surface` / `hover` | `#0B0B0B` / `#111111` / `#222222` | Dark band, phone frame, button hover |
| `color.on-dark.*` | white at 86 / 72 / 55 / 25 / 12 % | Text and hairlines on dark |

Rules: colour never carries meaning alone — every dot, swatch and underline sits beside the words that say the same. Teal as **text** (index numerals, "Rule", "Current") is 2.06:1 on white and is flagged advisory in the contrast report; the fix on the table is a type-only teal (`#0F766E`). No gradients as decoration (the key-phrase underline and the dot-grid backdrops are the two drawn exceptions), no shadows except under the product screens.

### Type

| Role | Family | Size (desktop → phone) | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Landing name | Geist | 121 → 49 (fluid, up to 200) | 700 | −0.04em | 0.95 |
| Section title | Geist | 96 → 43 | 600 | −0.045em | 0.95 |
| Section title, mid | Geist | 70 → 33 | 600 | −0.045em | 0.95 |
| Big number | Geist | 120 → 72, tabular | 600 | −0.06em | 0.90 |
| Lede | Geist | 40 → 26 | 500 | −0.03em | 1.15 |
| Quote | Geist | 38 → 24 | 500 | −0.03em | 1.18 |
| Result number | Geist | 36 → 28, tabular; unit at 45 % in quiet | 600 | −0.04em | 1.0 |
| h2 | Geist | 31 → 24 | 600 | −0.03em | 1.12 |
| h3 / table title | Geist | 25 → 20 / 18 | 500 | −0.025em | 1.2 |
| Email | Geist | 26 → 20 | 600 | −0.03em | 1.5 |
| Intro | Geist | 16 | 400 | −0.01em | 1.45 |
| Body | Geist | 15 | 400 | 0 | 1.5 |
| Button | Geist | 15 | 600 | −0.01em | 1.5 |
| Pill | Geist | 13 | 500 | −0.01em | 1.0 |
| Label `.m` | Geist Mono | 10, uppercase | 400 (bold parts 600 in ink) | +0.08em | 1.4 |

Two families, clearly different jobs: Geist for everything you read, Geist Mono only for the small uppercase labels, the clock and the numbers in the top bar. Geist Mono stops at 600. Loaded from Google Fonts; the device's own type stands in offline.

### Grid and space

| Token | Desktop | Tablet (640–1023) | Phone (≤639) |
|---|---|---|---|
| Columns | 12 | 8 | 4 |
| Container | 1280 px, centred | | |
| Gutter (page edge) | 24 px | 24 px | 16 px |
| Column gap | 24 px (12 px inset each side) | | 16 px (8 px) |
| Top bar | 48 px | | |
| Pinned column rests at | 80 px | pinning off | pinning off |
| Section | 128 px above, 64 below, 86 from rule to content | fluid | 72 / 40 / 40 |
| Steps | 6 8 10 12 14 16 18 20 22 24 36 48 | | |

The grid is visible: faint `line` columns behind the whole page, drawn in signal blue on load, toggled with **G**. Every block aligns to columns (`.wrap` + `.row` + `padding-inline: var(--inset)`).

### Shape, border, motion

| | |
|---|---|
| Radius | 0 on buttons, cards, screens, fields. 999 on the pill, chips, tags, the copy button. 50 % on dots. 2–10 px only inside the product screens |
| Borders | 1 px `line` hairlines; 1 px `ink` rule under each section title; 2 px `signal` focus ring 3 px outside; 1 px dashed `lost` around placeholders |
| Durations | 120 press · 200 hover colour · 250 hover fill · 300 small moves · 450 snap · 500 fades · 700 reveal · 800 drift · 900 glide · 1800 landing field |
| Easing | snap `(.2,.9,.1,1)` for screens, bars, chips · ease `(.16,1,.3,1)` for reveals · scroll `(.65,0,.35,1)` for menu links |
| Reduced motion | still page: no gliding, no grid draw, no snapping, no landing field, screens shown finished |

## Components

Everything on the page, as it is built in `css/site.css`. Class names are the component names.

| Component | Class | Anatomy | Variants / states |
|---|---|---|---|
| Top bar | `.nav` | 48 px, white at 86 % + blur, hairline below; brand mark + name · numbered links (`<i>01</i>Work`) · grid toggle · pill | links hide their numbers under 1024 |
| Grid toggle | `.toggle` | 30 px, hairline pill, 4 bars icon, mono label, `kbd` G | on / off (`html[data-grid]`) |
| Status pill | `.pill` + `.dot` | 30 px, ink fill, white 13 px text, pulsing teal 7 px dot | |
| Section head | `.shead` | `.m` label ("§ 01 Work · 2026") · title spanning 9 columns · note in columns 10–12 · 1 px ink rule under all | `--mid` smaller title · `--tight` no bottom margin |
| Key phrase | `.key` | teal underline drawn as a background, 0.12em thick at 94 % | 0.07em under section titles |
| Product tile | `.thumb` | 4:3 art box (hairline, dot-grid, `.mini` screen inside) · mono row (number, name, "Beta") · 14 px h3 · 12 px quiet line | hover: border turns ink; `--accent` per product |
| Case meta row | `.case__meta` | hairline above; number (cols 1–2) · swatch + name (3–5) · tag (6–9) · year, right-aligned (10–12) | |
| Case layouts | `.case--split / --flip / --full / --dark` | text pins under the bar while the screen scrolls | split (text 1–5, screen 7–12) · flip · full-width screen with text row · dark band |
| Results list | `.results` | hairline rows; 36 px tabular number left, `.m` label right | `data-count` counts up on reveal |
| Screen backdrop | `.backdrop` | hairline box, 5 % padding, dot-grid; `.sel` selection box with 4 handles and a signal dimension tag while landing | `--phone` 4:3 and centred; square beside pinned text |
| Product screen | `.screen` | 16:10, 6 px radius, hairline, soft shadow; type scales with container (`cqw`) | `--dark` |
| Index rows | `.index li` | hairline rows; teal `.idx` numeral (col 1) · h3 (2–5) · body (7–11) · teal "Rule" mark (12) | hover: ink rule draws across, title shifts 8 px |
| Plan chart | `.plan` | 12-column ruler, ink bars with white mono captions, dashed tail = the range | `.teal` bar for instrumentation |
| Big number + stats | `.bignum` `.stats` | 120 px tabular number + "years" in quiet, ink rule; hairline stat rows with bold right values | pins beside the timeline |
| Timeline | `.timeline` | 1 px line that draws as you scroll; 11 px dots (teal for now); years in mono; h3; where; body; `.tags` | `.is-now`, `.is-past` |
| Tag | `.tags span` | hairline box, 5 × 8 px, mono | `.rule` teal border |
| Big quote | `.quote--big` | 38 px, columns 2–11, teal opening mark hanging in the margin; caption 13 px | small `.quote` cards with ink rule above |
| Writing table | `.table` | hidden thead; 22 px rows; mono date · 25 px title · channel · "Read →" | hover: whole row fills ink, title shifts 8 px |
| Email + copy | `.email` `.copy` | 26 px semibold address; 28 px hairline-pill mono button | copied: teal fill |
| Facts | `.facts` | 7em label column, hairline rows | |
| Availability | `.avail li` | 3 cards, 1 px ink border, 92 px min, quarter label + state | `.is-open`: teal fill, black dot |
| Form field | `.field` | mono label above; borderless input with 1 px ink bottom line | focus: teal line + 1 px teal shadow |
| Main button | `.btn-main` | ink fill, white 15 px semibold, 16 × 22 px, arrow that shifts 4 px on hover | hover `#222` |
| Footer | `.foot` | dark band with local grid lines; 4 columns of 3; mono headings; hairline bottom row | |
| Placeholder | `.ph` | dashed `lost` outline + tiny FILL tag while `data-placeholders="show"` | |
| Grid overlay | `.gridlines` | fixed, 13 lines at column edges; `--local` version inside dark bands | draws in signal on load |
| Crosshair | `.xhair` | two 1 px signal lines following the pointer in the landing section, mono label with position and column | mouse only |

## Proof slots

Every product and client surface still carries a number with its window: the `.results` rows under each case, the `.stats` beside the timeline, the `data-count` numbers. The window lives in the label text ("Reply latency", "Store onboarding, 2018"). When a number is not known it is a `[placeholder]`, never invented.

## How to change something

1. Edit the value in `tokens.json`.
2. `npm run check` — rebuilds `css/tokens.css` and the Figma file, runs the contrast gate, renders the page.
3. Commit `tokens.json`, `css/tokens.css` and `design/build/` together; push. Vercel deploys.
4. Open the Figma design-system file and run `design/scripts/figma-sync.js` through the Figma MCP (or paste it into a plugin console) with `design/build/figma-variables.json`. The script matches by name and updates in place.
5. `node design/scripts/build-claude-ds.mjs <dir>` and publish `<dir>/project/*` to the Boona Grid artifact.

Never change a colour or size directly in `css/site.css`, Figma or a canvas: it will be overwritten on the next build.
