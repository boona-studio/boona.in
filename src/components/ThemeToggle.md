# ThemeToggle

Three-way control that sets the site theme: System (follow the device), Light, Dark. Lives in the nav on every page and in the footer.

## Anatomy
```
┌─────────┬─────────┬─────────┐
│ ▢ System│ ☼ Light │ ☾ Dark  │   ← radiogroup, ink outline (border.rule), radius.none
└─────────┴─────────┴─────────┘
  selected option: bg ink, text on-ink
  others: bg ground, text ink, hover bg surface
```
Each option: icon (20px, 1.5px stroke, inline SVG) + label. Height `size.touch` (44px), min width 44px, padding `space.3`.

## Variants
| Variant | When | Difference |
|---|---|---|
| `full` (default) | Desktop nav, footer | Icon + label |
| `compact` | Nav under 640px | Icon only; label becomes `aria-label` |

## States
| State | Treatment |
|---|---|
| Selected | `bg-ink text-on-ink`, `aria-checked="true"` |
| Unselected | `bg-ground text-ink` |
| Hover (unselected) | `bg-surface` |
| Focus-visible | 2px `color.focus` outline, inset by 2px so the ring stays inside the group outline |
| Disabled | not provided; the control is never disabled |

## Behaviour
- The choice is stored in `localStorage["boona-theme"]` as `light` or `dark`; System removes the key.
- `theme-init.ts` is inlined in `<head>` so the first paint already has the stored theme (no flash).
- System follows `prefers-color-scheme` live: if the device switches at sunset, the site follows.
- Two open tabs stay in step through the `storage` event.
- In private mode where storage throws, the choice still applies to the current page.

## Accessibility
- `role="radiogroup"` with a visually hidden "Theme" label; options are `role="radio"` with `aria-checked`. Announced as "Theme, Dark, radio button, checked, 3 of 3".
- Real `<button>` elements: Tab reaches the group, Enter/Space selects. (Arrow-key roving focus can be added later; three Tab stops is acceptable at this size.)
- Icons are `aria-hidden`; the label or `aria-label` carries meaning.
- Contrast: ink on ground 21:1, on-ink on ink 21:1 (light) / 14.5:1 (dark).
- Honors `prefers-reduced-motion` through the global rule in `tokens.css` (the 120ms colour transition collapses).

## Usage
```tsx
// app entry (once)
import { THEME_INIT } from "./theme/theme-init";
<script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />   // in <head>, before stylesheets

// nav
import { ThemeToggle } from "./components/ThemeToggle";
<ThemeToggle />                      // desktop
<ThemeToggle variant="compact" />    // phone
```
Anywhere else that needs the theme: `const { resolved } = useTheme();` — for example to pick the dark variant of a product render.

## Tokens consumed
`color.ink`, `color.on-ink`, `color.ground`, `color.surface`, `color.focus`, `border.rule`, `border.heavy`, `radius.none`, `size.touch`, `space.3`, `text.small`, `font.weight.medium`, `motion.duration.fast`, `motion.easing.standard`.

## Tailwind notes
Class names map to generated tokens: `border-rule` (1.5px), `h-touch`/`min-w-touch` (44px), `text-small`, `duration-fast`, `ease-standard`, `outline-heavy` (2px), `outline-focus`. Add `.sr-only` from Tailwind's defaults.
