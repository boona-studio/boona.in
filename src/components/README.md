# Boona components

React 18 + Tailwind 3 + TypeScript. Every component consumes tokens only (`design/tokens.json` → `tailwind.config.ts`); no raw colours or sizes in components. Square by default; inputs 2px, cards 4px.

Workflow for every component: **build → verify → test**.
- `npm run build` — `tsc` strict, then `vite build`.
- `npm run verify` — renders `src/dev/Gallery.tsx` to `verify/gallery-{light,dark}-{1280,390}.png`, fails on console errors or horizontal overflow at 390px. Look at the images.
- `npm test` — Vitest + Testing Library; one file per component in `__tests__/`.
- `npm run check` — tokens → build → test → verify, in that order.

## Index

| Component | Role | Spec |
|---|---|---|
| Readout | The proof block and lower third. The brand's sentence. | below |
| Button, Link | Actions and navigation | below |
| Card | Flat container; surface / outline / ground tones | below |
| CaseStudyCard | Anonymised client result with a readout | below |
| ProductCard | A product with readout, pricing model, what is missing, "I can build this for you" | below |
| Testimonial | A quote on a rule, anonymised, optional readout | below |
| CtaBand | One ask per page, two buttons at most | below |
| CodeBlock | The only place the mono stack appears; copy button | below |
| BeforeAfter | Two bars on one scale; accent only when the after is better | below |
| ContactForm | Contact and newsletter modes; errors explained, honeypot | below |
| Nav, Footer | Page frame; skip link, disclosure menu, theme toggle | below |
| ThemeToggle | System / Light / Dark radiogroup | `ThemeToggle.md` |

## Readout
```
┌─────────────────────────────────────────────────────────────┐
│ ■  label              NUMBER unit   window        trailing │   bg bar (black, both themes)
└─────────────────────────────────────────────────────────────┘
   accent square 12px   on-bar        quiet-on-bar
```
| | |
|---|---|
| Props | `label` (required), `number?`, `unit?`, `window?`, `accent` = azhagi · cue · automation · lost · none, `size` = sm 48px · md 56px · lg 64px, `trailing?`, `href?` |
| Rule | No `number` → only the label renders. Unit and window are never shown without a number. |
| Variants | Broad (label only), Nurture (label = the lesson), Convert (number + unit + window), Scar (`accent="lost"`, label = the rule, trailing = the years) |
| States | Static `role="group"`; link (`href`) with hover `bg-ink` and the focus ring |
| Responsive | Under 640px the label takes the first row and the measurement wraps beneath; above, one row |
| A11y | `aria-label` is the full sentence ("camera to reply: 180 ms, over 200 calls"); square is `aria-hidden`; tabular numerals |
| Tokens | `color.bar`, `on-bar`, `quiet-on-bar`, `product.*.accent`, `warning-outage`, `size.bar-*`, `size.accent-square`, `text.readout-number/label`, `text.caption/small/h3/h4`, `space.*`, `motion.duration.fast` |
| Usage | `<Readout accent="automation" label="hours a week" number="18 → 4" unit="h" window="over 4 weeks" />` |

## Button
| | |
|---|---|
| Variants | `primary` ink fill · `secondary` ink outline · `quiet` underlined text |
| Sizes | `md` 44px (default) · `lg` 48px |
| States | default, hover (primary → quiet; secondary → surface), focus-visible ring, `loading` ("Working…", `aria-busy`, blocks clicks), `disabled` (50% opacity) |
| As link | `href` renders `<a>`, same look, native link semantics |
| Rules | Label says what happens. No arrows, no icons by default. `type="button"` unless set. |
| Tokens | `color.ink`, `on-ink`, `ground`, `surface`, `quiet`, `focus`, `border.rule`, `size.control-md/lg`, `space.5/6`, `text.small/body`, `motion.duration.fast`, `motion.easing.standard` |

## Link
| | |
|---|---|
| Variants | `tone="inline"` in running text · `"standalone"` on its own line (medium weight) |
| States | underline 1px → 2px on hover; focus ring |
| External | `external` adds `target=_blank`, `rel`, and a visually hidden "(opens in a new tab)" |
| Tokens | `color.link`, `color.focus`, `border.heavy` |

## Card
| | |
|---|---|
| Tones | `surface` (one step off ground, 4px radius) · `outline` (ground + hairline) · `ground` (heavy rule on top, no box) |
| Props | `as` div/article/section/li, `padding` none/md/lg |
| Rule | No shadow, ever. |
| Tokens | `color.surface`, `ground`, `line`, `ink`, `radius.sm`, `border.hairline/heavy`, `space.6/8` |

## CaseStudyCard
```
context · when          (small, quiet)
Title                   (h3, link)
Summary                 (body, ≤ measure)
[■ readout ...........] (md, automation accent by default)
Read the case           (standalone link)
```
| | |
|---|---|
| Props | `context` (anonymised, required), `when?`, `title`, `summary`, `readout`, `href` |
| Rule | There is no `client` prop. Context describes the team, never the company. |
| A11y | `<article>`; title is the link; readout announces as a sentence |
| Tokens | Card(surface) + Readout + `text.small/h3/body` |

## ProductCard
```
Name  version
One line
For audience.
[■ readout ...........]
How you get it   SaaS · Self-hosted · Pay as you use
Not yet          what is missing
[Try Name]   I can build this for you
```
| | |
|---|---|
| Props | `name`, `version?`, `oneLine`, `audience?`, `pricing[]`, `missing` (required), `accent`, `readout`, `href`, `buildHref` (default /work) |
| Rule | `missing` is required: a product entry without an honest line is off-brand. |
| A11y | `<article>`, definition list for the two facts, two distinct link names |
| Tokens | Card(outline) + Readout + Button + Link + `text.h3/body/small` |

## Testimonial
| | |
|---|---|
| Props | `quote`, `attribution` (role + anonymised context), `readout?` (sm) |
| Rule | No photo, no logo, no name. |
| A11y | `<figure>` + `<blockquote>` + `<figcaption>` |
| Tokens | `border.heavy`, `color.ink`, `text.lead/small`, `color.quiet`, Readout |

## CtaBand
| | |
|---|---|
| Props | `headline`, `note?`, `primary`, `secondary?`, `tone` = ink (end of page) · surface (mid page) |
| Rule | One per page. Two actions at most. Headline is first person. |
| A11y | `<section aria-labelledby>`, real links styled as buttons |
| Tokens | `color.ink/on-ink/surface/quiet-on-bar`, `size.container`, `size.gutter`, `space.16`, `text.h2/lead`, Button |

## CodeBlock
```
┌ title                                  Copy ┐  figcaption, 44px, caption text
│ 1  code                                      │  <pre><code>, mono stack, scroll-x
└──────────────────────────────────────────────┘
```
| | |
|---|---|
| Props | `code`, `language?`, `title?`, `lineNumbers?`, `tone` = surface · terminal (black, like the bar) |
| States | Copy → "Copied" for 1.5s with a polite live region; clipboard blocked → text stays selectable |
| A11y | Line numbers `aria-hidden`; copy button 44px; `<figure>` |
| Tokens | `font.family.mono`, `text.code/caption`, `color.surface/line/bar/on-bar/quiet-on-bar`, `radius.sm`, `size.control-md`, `size.touch` |

## BeforeAfter
```
Label                              window
before  ████████████████████  18 h
        note
after   ████                   4 h      ← accent only if better
        note
-78%
```
| | |
|---|---|
| Props | `label`, `before{value,note?}`, `after{value,note?}`, `unit`, `window` (required), `better` = lower (default) · higher, `accent` |
| Rule | A regression keeps both bars ink and prints "(worse)" in the outage colour. Never dressed up. |
| A11y | `<figure aria-label>` carries the full comparison in one sentence; bars are `role="presentation"` |
| Tokens | `color.line/ink/warning-outage-ink/product.*.accent`, `border.heavy`, `text.h4/small/caption`, `space.3/4` |

## ContactForm
| | |
|---|---|
| Modes | `contact` (name, email, message) · `newsletter` (email) |
| Props | `onSubmit(values) → Promise`, `successText?` |
| States | idle · sending (button `loading`) · sent (replaces the form with one `role="status"` line) · failed (`role="alert"`, button re-enabled) |
| Validation | On submit, not on every keystroke. Each error is a sentence that says what to do; field gets `aria-invalid` and `aria-describedby` |
| Anti-spam | Hidden honeypot field; a filled honeypot drops the submission silently |
| Rules | Labels above fields, never placeholders as labels. Submit is never disabled; errors explain instead. Hint text says what helps me reply. |
| Tokens | `color.ground/ink/line/quiet/error/focus`, `radius.xs`, `border.rule/heavy`, `size.control-md`, `size.measure`, `text.small/caption/body/lead`, Button |

## Nav
```
[Skip to content]  (visible on focus)
Boona            Work  Products  Writing  About   [▢ ☼ ☾]  [Work with me]        ≥ 768px
Boona                                                            [Menu]           < 768px → disclosure panel
```
| | |
|---|---|
| Props | `links[{label, href, current?}]`, `cta` (default "Work with me" → /contact), `brand`, `brandHref` |
| States | sticky with `elevation.1` hairline; current page underlined with `aria-current="page"`; menu `aria-expanded` + `aria-controls`; Escape closes and returns focus |
| Rules | One CTA. Wordmark is plain type (no logo file needed). |
| Tokens | `color.ground/ink/on-ink/line/focus`, `elevation.1`, `z.sticky`, `z.toast`, `size.container/gutter/touch`, `text.h4/small`, Button, ThemeToggle |

## Footer
| | |
|---|---|
| Props | `groups[]` (≤ 3, each a named `<nav>`), `line` (house line), `brand`, `year` |
| Rules | Text links, no social icons. No newsletter here. Copyright line states that client work is anonymised. |
| Tokens | `border.heavy`, `color.ink/quiet`, `size.container/gutter`, `space.10/12/24`, `text.h3/body/small/caption`, Link, ThemeToggle |
