# Contrast report

Generated from tokens.json (updated 2026-11-09). WCAG 2.2: text 4.5:1, large text and UI parts 3:1. Alpha colours are composited on their background before measuring.

| Foreground | Background | Used for | Ratio | Needs | Result |
|---|---|---|---|---|---|
| color.ink #000000 | color.ground #FFFFFF | Body, headings, the big name | 21.00:1 | 4.5:1 text | pass |
| color.quiet #5A5A5A | color.ground #FFFFFF | Secondary text, 10 px mono labels | 6.90:1 | 4.5:1 text | pass |
| color.on-bar #FFFFFF | color.bar #000000 | Top bar, footer links, the main button | 21.00:1 | 4.5:1 text | pass |
| color.on-dark.strong #FFFFFFDB | color.dark.band #0B0B0B | Footer colophon paragraph | 14.43:1 | 4.5:1 text | pass |
| color.on-dark.text #FFFFFFB8 | color.dark.band #0B0B0B | Case text on the dark band | 10.26:1 | 4.5:1 text | pass |
| color.on-dark.muted #FFFFFF8C | color.dark.band #0B0B0B | Mono labels and unit text on the dark band | 6.24:1 | 4.5:1 text | pass |
| color.ink #000000 | color.teal #3FC9B0 | 'Open to projects' on the open availability card | 10.19:1 | 4.5:1 text | pass |
| color.ink #000000 | color.surface.bubble #F1F1F1 | Incoming chat bubble in the Azhagi screen | 18.59:1 | 4.5:1 text | pass |
| color.signal #2F5BFF | color.ground #FFFFFF | Focus ring, crosshair, selection box | 5.17:1 | 3:1 ui | pass |
| color.on-bar #FFFFFF | color.signal #2F5BFF | Crosshair and dimension labels | 5.17:1 | 4.5:1 text | pass |
| color.quiet #5A5A5A | color.dark.band #0B0B0B | If the quiet grey is ever used on the band (it is not) | 2.85:1 | 4.5:1 text | fails, advisory |
| color.teal #3FC9B0 | color.ground #FFFFFF | Index numerals, 'Rule' marks, 'Current' on the timeline, replay arrow: 10 px teal mono text | 2.06:1 | 4.5:1 text | fails, advisory |
| color.on-bar #FFFFFF | color.lost #FF8A80 | 'End' button in the Azhagi screen, white on coral-red | 2.28:1 | 4.5:1 text | fails, advisory |
| color.teal #3FC9B0 | color.ground #FFFFFF | Status dot, key-phrase underline, open card fill: always beside words that say the same | 2.06:1 | 3:1 ui | fails, advisory |
| color.coral #E06A5F | color.ground #FFFFFF | Azhagi swatch and screen accents: beside the product name | 3.28:1 | 3:1 ui | pass |
| color.violet #A98BDC | color.ground #FFFFFF | Boona Cue swatch and keyframes: beside the product name | 2.83:1 | 3:1 ui | fails, advisory |
| color.lost #FF8A80 | color.ground #FFFFFF | Placeholder outline (with a FILL tag), live dot (with the word Live) | 2.28:1 | 3:1 ui | fails, advisory |
| color.line #DEDEDE | color.ground #FFFFFF | Hairlines and the grid overlay (decorative, no bar) | 1.35:1 | 0:1 decor | no bar |

Advisory rows do not stop the build. The product colours and the status dot are identity marks that always sit beside the words that carry the meaning, so colour alone never carries it (WCAG 1.4.11 asks 3:1 only of parts needed to identify a control or state). The three advisory text rows are inherited from the live site as published on 2026-11-09; the fix for teal text is a darker teal for type only (for example #0F766E, 5.0:1 on white) while the bright teal stays for dots, underlines and fills. Decide, then add the token and rebuild.
