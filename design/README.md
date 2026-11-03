# Boona design tokens

`tokens.json` is the single source of truth for every colour, size, type style and motion value on boona.in, in the UI components, and in the Figma templates. Nothing is hand-copied between code and Figma.

## Files

| Path | What | Edit? |
|---|---|---|
| `design/tokens.json` | The tokens, W3C Design Tokens format. Light values in `$value`, dark in `$extensions.boona.dark`. | Yes, this is the only file you edit |
| `design/scripts/build-tokens.mjs` | Builds everything below. Fails if any colour pair drops below WCAG AA. | Only to change how outputs are generated |
| `design/build/tokens.css` | CSS custom properties for both modes, base rules, text-style classes | Generated |
| `design/build/tailwind.tokens.json` + `tailwind.config.ts` | Tailwind theme, colours as `var(--…)` so dark mode needs no duplicate classes | Generated |
| `design/build/figma-variables.json` | Figma collections, variables per mode, text styles | Generated |
| `design/build/contrast-report.md` | Every checked pair with its ratio in both modes | Generated |
| `design/scripts/figma-sync.js` | Plugin-API script that applies `figma-variables.json` to the Figma file | Only to change how Figma is updated |

## Re-sync after a token change

1. Edit `design/tokens.json`.
2. `node design/scripts/build-tokens.mjs` — regenerates all outputs; stops with a message if a colour pair fails AA.
3. Code: nothing else to do. `tokens.css` is imported once in the app entry; Tailwind reads `tailwind.config.ts`.
4. Figma: open the Boona templates file and run `figma-sync.js` with the contents of `figma-variables.json` (through the Figma MCP `use_figma` tool, or a development plugin's console). Variables and text styles are matched by name and updated in place; templates bound to them update by themselves.
5. Commit `tokens.json` and the `design/build/` outputs together so the repo and Figma never disagree.

Adding a product: add `product.<name>.accent` (bar-safe, ≥3:1 on black) and `product.<name>.ink` (text-safe, ≥4.5:1 on ground), add both pairs to `PAIRS` in the build script, run step 2. The product gets its square on the bar and its text colour everywhere with no other change.

## Theme behaviour

- `tokens.css` sets `color-scheme: light dark` and follows the visitor's system preference.
- A manual override is `data-theme="light"` or `data-theme="dark"` on `<html>`; store the choice in `localStorage` and apply it before first paint to avoid a flash.
- The readout bar is black in both modes on purpose: it is the one constant on every surface.

## UX rules encoded in the tokens

| Rule | Token |
|---|---|
| Nothing tappable under 44 px | `size.touch`, `size.control-md` |
| Body text never wider than ~68 characters | `size.measure` |
| Keyboard focus is a 2 px blue ring, the only blue in the system | `color.focus`, `border.heavy`, `border.focus-offset` |
| Numbers line up | `font.feature.numbers` (tabular) on readouts, tables, metrics |
| Motion only answers an action, and disappears under reduced-motion | `motion.*`, the `prefers-reduced-motion` rule in `tokens.css` |
| Flat surfaces, depth by layering | `elevation.0` default; `elevation.2` only for menus and dialogs |
| Square bar, buttons and chips; 2 px inputs; 4 px cards; round avatars only | `radius.*` |
| Hero type steps down on phones | the `max-width: 639px` rule in `tokens.css` |
| Smallest text is 13 px medium, sentence case | `text.caption` |

## Fonts

Host Grotesk, SIL Open Font Licence, from Google Fonts. Self-host the woff2 files at `/public/fonts/host-grotesk/` (weights 400, 500, 600, 700) with `font-display: swap`; do not load from Google at runtime. Code blocks use the system monospace stack, so the two-typeface limit holds. No paid fonts anywhere.
