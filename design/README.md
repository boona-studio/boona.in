# Boona design system · Grid v2

**This file is the one source of truth for how Boona looks: the ideology, the rules, the components and the content formats.** The values themselves live in `tokens.json` (one level up); the brand facts, voice and non-negotiables live in `BRAND.md`. Everything else — `css/tokens.css`, the Figma file, the Claude Design system, every post, thumbnail and video frame — is derived from these three files and never edited by hand.

| File | Holds | Who edits it |
|---|---|---|
| `tokens.json` | Every colour, typeface, text style, grid measure, spacing step, radius, border and motion value | Boopathi, or a session he directs; then `npm run check` |
| `BRAND.md` | Who Boona is, the four products, the voice, the rules that are not negotiable, what is still a placeholder | The website session, with Boopathi |
| `design/README.md` (this) | Why the system looks the way it does, how it is applied, what every component is, how every content format is laid out, how the pieces stay in sync | The design-system session |

Grid v2 went live on 6 November 2026 and was tokenised on 8–9 November. It replaces direction B · Readout (v1, 2–3 November), which stays in the repository history only.

---

## 1. Ideology

One sentence: **a white drafting sheet with a faint 12-column grid, Geist set large and tight, 10 px mono labels as the annotations, one black rule under every section title, and one colour per product.**

The page looks like the working drawing of someone who measures things. That is the brand: an architect's sheet, not a marketing page.

| Principle | What it means in practice |
|---|---|
| **The grid is visible** | The 12 columns are drawn on the page in `line` grey and can be toggled with G. Every block aligns to a column edge. On a post or a thumbnail the same grid is the texture behind the words. |
| **Ink on white, colour only where it means something** | Text, rules and buttons are black. Colour appears as a 9 px square beside a product name, a 7 px status dot, a thin underline under one key phrase, a filled card that says "Open". Never as a background wash, never as decoration. Where teal must be letters (an index numeral, "Rule", "Current") it is `teal-ink`, the dark teal that reads. |
| **One colour per product** | Azhagi coral, Boona Cue violet, Thali teal, Boona Fit white on the dark band. A product's colour appears on its own screen, tile and swatch and nowhere else. The brand accent (teal) doubles as Thali's colour; that is accepted. |
| **Labels are annotations** | The 10 px uppercase Geist Mono label (`§ 01 Work · 2026`, `01 / 04`, `Reply latency`) is how the sheet is annotated. It carries numbers, dates, places and names, never slogans. |
| **Proof has a slot** | Every product and client surface carries a number and the window it was measured in (`48 h → 24 h`, `Store onboarding, 2018`). A number not yet measured is a bracketed placeholder with a visible marker, never a guess. |
| **One rule in ink** | Each section has exactly one 1 px black rule, under its title. Every other line is a `line` hairline. Nothing else is black and horizontal. |
| **Big type, tight** | Display sizes are large (96–121 px on desktop) at 600–700 with negative tracking (−0.04 to −0.06 em) and 0.9–0.95 leading. Body is small (15 px) and plain. The contrast between the two is the typographic voice. |
| **Square, not rounded** | Buttons, cards, screens and fields have 0 radius. Only chips, tags and dots are round. Screens inside backdrops have a 6 px radius because they depict devices. |
| **Motion is quiet and once** | Two curves, snap and ease; 200–450 ms for interaction, 700 ms for reveals. Each product screen plays once; a Replay button repeats it. Reduced motion shows everything finished. |
| **Signal blue is a tool, not a colour** | `#2F5BFF` draws the grid on load, the selection boxes, the crosshair and focus rings. It never colours static content or text. In content it appears only when showing the site "under construction" (a selection box around a frame). |
| **Nothing invented** | Years, numbers, quotes, names: from Boopathi or a placeholder. This applies to every format below. |

---

## 2. Tokens

`tokens.json` is W3C Design Tokens with `$value`/`$type`; 130 tokens. Built by `npm run tokens` into `css/tokens.css` (the page loads it), `design/build/figma-variables.json` (Figma sync), `design/build/tokens.flat.json` (any other tool) and `design/build/contrast-report.md` (AA gate; the build fails when a required text pair drops under 4.5:1).

### Colour

| Token | Hex | Where |
|---|---|---|
| `color.ground` | `#FFFFFF` | Page, every light content canvas |
| `color.ink` | `#000000` | Text, the section rule, the top bar, the main button, writing-row hover fill |
| `color.quiet` | `#5A5A5A` | Secondary text, mono labels |
| `color.line` | `#DEDEDE` | Hairlines, the grid overlay, box borders |
| `color.bar` / `on-bar` | ink / ground | Footer and dark band ground and text |
| `color.teal` | `#3FC9B0` | Brand accent, marks only: key-phrase underline, status dot, quote mark, open quarter, current timeline dot, signals in the landing field. Also Thali |
| `color.teal-ink` | `#0F766E` | Teal **letters** (5.5:1 on white): index numerals, Rule marks, "Current", Thali quantities. Never as a fill |
| `color.coral` | `#E06A5F` | Azhagi |
| `color.violet` | `#A98BDC` | Boona Cue |
| `color.product.fit` | white | Boona Fit, on the dark band only |
| `color.lost` | `#FF8A80` | Ending or negative states in product screens; the dashed outline on placeholders |
| `color.signal` | `#2F5BFF` | Motion and tool overlays only |
| `color.dark.band` / `surface` / `hover` | `#0B0B0B` / `#111111` / `#222222` | The dark band, phone frames and dark mini surfaces, the main button on hover |
| `color.on-dark.strong/text/muted/faint/hairline` | white at 86 / 72 / 55 / 25 / 12 % | Text and lines on dark surfaces (see the fidelity note below) |
| `color.surface.bubble/lane/lane-empty` | `#F1F1F1` / `#FAFAFA` / `#FCFCFC` | Inside the Azhagi and Cue screens |
| `color.overlay.shade/tint` | black at 35 / 4 % | The dim behind the landing name; the faintest fill |

### Type

Two families, two jobs. **Geist** for everything you read; **Geist Mono** only for the 10 px uppercase label, the clock and numbers in the top bar. Both from Google Fonts, device fonts stand in offline. Geist Mono stops at 600.

| Style | Size desktop → phone | Weight | Tracking | Leading | Used for |
|---|---|---|---|---|---|
| `display.name` | 121 → 49 (fluid, up to 200) | 700 | −0.04em | 0.95 | The landing name |
| `display.section-title` | 96 → 43 | 600 | −0.045em | 0.95 | Section titles |
| `display.section-title-mid` | 70 → 33 | 600 | −0.045em | 0.95 | Long section titles |
| `display.big-number` | 120 → 72, tabular | 600 | −0.06em | 0.90 | The years number |
| `display.big-number-unit` | 30 → 20 | 600 | −0.02em | 0.90 | "years", in quiet |
| `heading.lede` | 40 → 26 | 500 | −0.03em | 1.15 | Opening sentence of Approach |
| `heading.quote` | 38 → 24 | 500 | −0.03em | 1.18 | The big testimonial |
| `heading.h2` | 31 → 24 | 600 | −0.03em | 1.12 | Case headlines |
| `heading.h3` / `table-title` | 25 → 20 / 18 | 500 | −0.025em | 1.20 | Approach rows, timeline, post titles |
| `heading.email` | 26 → 20 | 600 | −0.03em | 1.50 | The email address |
| `heading.result-number` | 36 → 28, tabular; unit at 45 % in quiet | 600 | −0.04em | 1.00 | Result figures |
| `text.body` | 15 | 400 | 0 | 1.50 | Paragraphs, lists, fields |
| `text.intro` | 16 | 400 | −0.01em | 1.45 | The landing intro |
| `text.label` | 10, uppercase, Geist Mono | 400 (bold parts 600 in ink) | +0.08em | 1.40 | Every label |
| `text.pill` | 13 | 500 | −0.01em | 1.00 | The status pill |
| `text.button` | 15 | 600 | −0.01em | 1.50 | The main button |

### Grid, space, shape, motion

| | Desktop (≥1024) | Tablet (640–1023) | Phone (≤639) |
|---|---|---|---|
| Columns | 12 | 8 | 4 |
| Container | 1280 px centred | | |
| Gutter (page edge) | 24 | 24 | 16 |
| Column gap / cell inset | 24 / 12 | 24 / 12 | 16 / 8 |
| Top bar / pinned columns rest at | 48 / 80 | 48 / off | 48 / off |
| Section: above · below · rule-to-content | 128 · 64 · 86 | fluid | 72 · 40 · 40 |
| Space steps | 6 8 10 12 14 16 18 20 22 24 36 48 | | |
| Radius | 0 everywhere; 999 pill, chips, tags, copy button; 50 % dots; 2–10 only inside product screens | | |
| Borders | 1 px `line` hairline; 1 px `ink` rule under titles; 2 px `signal` focus ring 3 px outside; 1 px dashed `lost` on placeholders | | |
| Durations | 120 press · 200 hover colour · 250 hover fill · 300 small moves · 450 snap · 500 fades · 700 reveal · 800 drift · 900 glide · 1800 landing field | | |
| Easing | snap `(.2,.9,.1,1)` for things landing · ease `(.16,1,.3,1)` for reveals · scroll `(.65,0,.35,1)` for menu links | | |

### Fidelity note (audit and normalisation, 9 November 2026)

`npm run audit` found 47 hex and 43 alpha colour literals in `css/site.css` that bypassed the tokens. Boopathi approved the normalisation the same day and it is applied:

| Change | Count | Visible effect |
|---|---|---|
| Hex literals with an existing token → `var()` (`#fff`, `#000`, `#111`, `#0B0B0B`, `#222`, surface greys) | 44 | none |
| New tokens for the three untokenised greys (`dark.backdrop` `#0A0A0A`, `dark.stage` `#2B2B2B`, `dark.stage-deep` `#0C0C0C`), the top bar glass (`ground-glass`), ink on teal (`ink-muted` 65 %), the toggle border (`overlay.line` 18 %), the chip fill (`teal-tint` 14 %), the pulse ring (`teal-pulse` 55 %), the Cue focus glow (`violet-glow` 35 %), and a `shadow` family (`screen`, `phone`, `cursor`) | 12 tokens | none |
| Fifteen white alphas snapped to the five `on-dark` steps: .62 .6 → .55 · .78 .75 .7 → .72 · .85 .8 → .86 · .35 .3 → .25 · .22 .2 .18 .15 .14 → .12; black .4 → .35, .6 → .65 | 237 computed values per width | secondary text on the dark band and footer is 5–7 % fainter or stronger; all still ≥ 6:1 |

Render diff after the change (`node design/scripts/verify-tokens.mjs <baseline>`): 822 elements, 237 differences per width, every one an alpha listed above; no size, spacing or layout change. Two literals remain on purpose: the `mask-image` gradient behind the landing field (geometry, not colour) and the transparent end of the pulse ring.

---

## 3. Rules

**Do**
- Start every surface with the label, then the title, then the rule. On a post the label is the date or the series; on a thumbnail it is the product and the number.
- Put a product's colour beside its name as a 9 px square (or a 24 px square at thumbnail scale). The name carries the meaning; the colour repeats it.
- Give every number its unit in quiet at 45 % and its window in the label.
- Mark an unknown with square brackets and the `lost` dashed outline while drafting; remove the marker only when the fact is in.
- Use the dark band for Boona Fit and for any surface that depicts a dark product screen. Text on it uses the `on-dark` ladder.
- Keep running text under 44–58 characters a line on the site and under 32 on a reel.

**Don't**
- No photos on the website (removed 7 November 2026). Everywhere else the face is allowed and expected: thumbnails, title cards, posts use the cut-out or the 16:9 / 4:5 crops in `media/` (decided 9 November 2026).
- No gradients as decoration (the two drawn exceptions: the key-phrase underline, which is a flat background, and the dot-grid backdrops behind screens). No shadows except under product screens.
- No colour as text except black, quiet grey, white and `teal-ink`. Bright teal is never letters (2.06:1 on white); the one bright-teal glyph is the 38 px quote mark, which is a mark.
- No second accent, no second display face, no emoji, no icons where a word will do.
- No "we" until the agency is switched on. No hype words. No invented facts.
- Never change a value in `css/site.css`, `css/tokens.css`, Figma or a canvas; change `tokens.json` and rebuild.

---

## 4. Components (the website)

Class names in `css/site.css` are the component names. "Figma" says whether the component exists in the Figma file; "DS" whether the Claude Design system has a live preview of it.

| Component | Class | Anatomy | Variants / states | Figma | DS |
|---|---|---|---|---|---|
| Top bar | `.nav` | 48 px, white at 86 % + blur, hairline below; mark + name · numbered links · grid toggle · pill | link numbers hide under 1024 | ✓ | — |
| Grid toggle | `.toggle` | 30 px hairline pill, 4-bar icon, mono label, `kbd` G | on / off | ✓ | ✓ (in Button) |
| Status pill | `.pill` + `.dot` | 30 px, ink fill, 13 px text, pulsing 7 px teal dot | open / booked | ✓ | ✓ |
| Section head | `.shead` | label · title (9 cols) · note (cols 10–12) · 1 px ink rule | `--mid`, `--tight` | ✓ | ✓ |
| Key phrase | `.key` | teal underline as background, 0.12em at 94 % | 0.07em under titles | — | — |
| Product tile | `.thumb` | 4:3 art box (hairline, dot-grid, mini screen) · mono row · 14 px h3 · 12 px line | hover border ink; `--accent` | — | — |
| Case meta | `.case__meta` | hairline above; number · swatch + name · tag · year right | per product | ✓ | ✓ |
| Case layouts | `.case--split/--flip/--full/--dark` | text pins while the screen scrolls | 4 layouts | — | — |
| Results list | `.results` | hairline rows; 36 px number left, mono label right | counts up on reveal | ✓ | ✓ |
| Screen backdrop | `.backdrop` + `.sel` | hairline box, 5 % padding, dot-grid; selection box with 4 handles and a signal tag while landing | `--phone`; square beside pinned text | — | — |
| Product screen | `.screen` | 16:10, 6 px radius, hairline, soft shadow, `cqw` type | `--dark` | — | — |
| Index rows | `.index li` | hairline rows; teal numeral · h3 · body · "Rule" mark | hover rule draws, title shifts 8 px | — | — |
| Plan chart | `.plan` | 12-col ruler, ink bars with white mono captions, dashed tail = range | `.teal` bar | — | — |
| Big number + stats | `.bignum` `.stats` | 120 px number + unit, ink rule; hairline stat rows | pins beside timeline | — | — |
| Timeline | `.timeline` | 1 px line that draws; 11 px dots (teal = now); years, h3, where, body, tags | `.is-now`, `.is-past` | — | — |
| Tag | `.tags span` | hairline box, 5 × 8, mono | `.rule` teal border | ✓ | ✓ |
| Big quote / quote | `.quote--big` `.quote` | 38 px, cols 2–11, teal mark in the margin; small quotes with ink rule above | | — | — |
| Writing table | `.table` | hidden thead; mono date · 25 px title · channel · Read → | row fills ink on hover | ✓ | ✓ |
| Email + copy | `.email` `.copy` | 26 px address; 28 px mono pill button | copied = teal | ✓ (copy) | ✓ (copy) |
| Facts | `.facts` | 7em label column, hairline rows | | — | — |
| Availability | `.avail li` | 3 cards, 1 px ink border, 92 min; quarter + state | open = teal fill | ✓ | ✓ |
| Form field | `.field` | mono label; borderless input, 1 px ink line | focus = teal line | ✓ | ✓ |
| Main button | `.btn-main` | ink fill, 15 px semibold, 16 × 22, arrow shifts 4 px | hover `#222` | ✓ | ✓ |
| Footer | `.foot` | dark band with local grid; 4 columns; mono headings; hairline bottom row | | — | — |
| Placeholder | `.ph` | dashed `lost` outline + FILL tag while `data-placeholders="show"` | | — | — |
| Grid overlay | `.gridlines` | 13 lines at column edges; `--local` inside dark bands | draws in signal on load | (Cover) | (Cover) |
| Crosshair | `.xhair` | two 1 px signal lines + mono label with position and column | mouse only | — | — |
| Label | `.m` | 10 px mono uppercase quiet; bold parts ink 600 | | ✓ | ✓ |

Gaps to close in Figma (next build): Product tile, Backdrop + Screen frame, Index row, Plan chart, Big number + stats, Timeline item, Quote, Facts row, Footer, Placeholder marker. Every value is already in the variables; these are composition work.

---

## 5. Content formats

Everything Boona publishes is a cut of the same sheet. One anatomy, scaled per canvas:

```
┌──────────────────────────────────────────────┐
│ § LABEL · DATE                      boona.in │  ← mono label, top; right: domain or handle
│                                              │
│ Title, Geist 600/700, tight, ≤ 2 lines       │  ← display style, left, on the grid
│ ─────────────────────────────────────────    │  ← the one ink rule
│                                              │
│ ■ Product · 48 h → 24 h   STORE ONBOARDING   │  ← product square + name; result row(s)
│                                              │
│                             faint 12-col grid│  ← line-grey columns across the whole canvas
└──────────────────────────────────────────────┘
```

Scaling rule: **the site is the 1280 reference**. Gutter, inset and type scale by `canvas width ÷ 1280`, then the title is pushed up one step on small-screen formats (thumbnail, reel, short) because they are read at a glance. Columns stay 12 on every landscape or square canvas and 6 on portrait canvases (a 9:16 frame is half a sheet).

| Format | Canvas | Columns · gutter | Label | Title | Body | Proof | Notes |
|---|---|---|---|---|---|---|---|
| **LinkedIn image post** | 1200 × 1500 (4:5) | 12 · 24 | 14 mono | 72–88 / 600 / −0.045em | 22 / 400 | result row 40 + 14 label | One idea per image. Title ≤ 9 words. Domain bottom-right. |
| **LinkedIn carousel** | 1080 × 1350 per page, PDF | 12 · 20 | 13 mono (page `01 / 08`) | p.1 80 / 600; pages 2+ 48 / 600 | 24 / 400, ≤ 40 ch | result rows | Page 1 = section head; last page = the ask (email, "Open to projects" pill). |
| **YouTube thumbnail** | 1280 × 720 | 12 · 24 | 18 mono | 120–160 / 700 / −0.04em, ≤ 5 words | — | big number 220 / 600 tabular, unit 45 % | White ground reads well on YouTube's dark UI; dark band only for Fit. Product square 24 px. Face: open decision (see below). |
| **YouTube long-form** | 1920 × 1080 | 12 · 36 | 15 mono | Title card 96 / 600; chapter card 64 / 600 | captions 36 / 500 on ground, ink | lower third: 48 px strip, hairline above, 7 px teal dot, name 20 / 600, role 15 mono | 5 % title-safe. Lower third sits on the bottom grid row. End card = Section head + availability card + email. |
| **YouTube short / Instagram reel** | 1080 × 1920 (9:16) | 6 · 24 | 20 mono | 96 / 700 / −0.04em, ≤ 2 lines, upper third | captions 48 / 500, ≤ 32 ch, centred lower third | result row 56 + 20 label | Safe area: 250 px top, 420 px bottom (platform UI). Title at y = 320–620. |
| **Medium post** | cover 1500 × 750 (2:1); figures 1400 wide | 12 · 28 | 16 mono | 88 / 600 | Medium's own body type | result rows inside figures | We control the cover and the figures only. Every figure: label top-left, rule, content, source line bottom in mono. No screenshots without a hairline frame. |
| **X / LinkedIn text-only** | — | — | — | — | — | numbers written as `48 h → 24 h`, window in the same sentence | Voice rules from `BRAND.md`. |

Colour on content: the canvas is `ground`, the words `ink`, labels `quiet`, the grid `line`. The product square and the status dot are the only colour. A dark-band variant exists for Boona Fit and for frames that show a dark product screen. Teal appears as an underline under one key phrase per surface at most.

**The face (decided 9 November 2026).** The website is photo-free (`BRAND.md` rule 2); every other format may carry the founder's face. Thumbnails and title cards use the cut-out (`media/founder-cutout.png`), bottom-right, in front of the grid and the result row, never over the title; posts may use the 4:5 portrait or the cut-out; video uses the camera itself. One face per surface, never cropped at the chin.

---

## 6. Keeping everything in sync

| Step | Command / action |
|---|---|
| 1. Change a value | edit `tokens.json` |
| 2. Rebuild and check | `npm run check` — writes `css/tokens.css`, `design/build/*`, runs the AA gate, renders 390/820/1440. With a baseline folder (`node design/scripts/verify-tokens.mjs <folder>`) it lists every element whose computed style changed |
| 3. Commit together | `tokens.json`, `css/tokens.css`, `design/build/` |
| 4. Push | `git push`; Vercel publishes www.boona.in |
| 5. Figma | run `design/scripts/figma-sync.js` through the Figma MCP (or a plugin console) with `design/build/figma-variables.json` against **Boona — Design system (Grid v2)** (`9ALjyFp3bldjj3Pvh9SW5S`). Matches by name, updates in place. Ids in `design/build/figma-ledger.json` |
| 6. Claude Design | `node design/scripts/build-claude-ds.mjs <dir>` and publish `<dir>/project/*` to the **Boona Grid** artifact (https://claude.ai/artifact/34rooSgXffj6itFp4VAk9B) |
| 7. Content templates | the Figma content file follows the same variables; after a token change, open it and the instances update |

Audit (run any time): `npm run audit` lists every colour literal in `css/site.css` that bypasses the tokens, against `design/build/tokens.flat.json`.

Figma files in the Boona folder (683220504): **Boona — Design system (Grid v2)** `9ALjyFp3bldjj3Pvh9SW5S` (current); **Boona — Content templates** `1YmlpJa6XlOya44PSx9nE8` (v1 · Readout, superseded; rebuild on Grid v2 per §5 before any post is made from it).

---

## 7. Change log

- 2026-11-06 — Grid v2 goes live on www.boona.in (website session).
- 2026-11-08 — `tokens.json` written from `css/site.css`.
- 2026-11-09 — `tokens.json` made the source of truth; `css/tokens.css` generated and loaded by the page (render diff 0); Figma file and Claude Design system built; this document written.
- 2026-11-09 — `color.teal-ink` `#0F766E` added for teal letters (index numerals, Rule marks, Current, Thali quantities); bright teal stays for marks. Render diff: 36 text colours per width, nothing else. Approved by Boopathi.
- 2026-11-09 — Audit of `site.css` literals; normalisation approved by Boopathi and applied (12 new tokens, 237 alpha snaps per width, no layout change). Decision: photos stay off the website but are allowed everywhere else (thumbnails, title cards, posts); the cut-out and the 16:9 and 4:5 crops in `media/` are the approved assets.
