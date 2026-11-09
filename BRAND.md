# Boona — brand brief for the design system

A one-page handoff from the session that built www.boona.in to whoever works on the design system around it.
The values are in `tokens.json` and the system itself is documented in `design/README.md`; this page holds the decisions and the reasons behind them.
Nothing here is a guess: every fact came from Boopathi, and anything still unknown is marked as a placeholder.

## Who and what

- **Person.** Boopathi Thangamani, who works as **Boona**. Title: **AI Solutions Architect**. Location shown publicly as **TN, India**. Email: studio.boona@gmail.com.
- **What Boona does.** Designs and integrates AI into any business. The one-line promise on the site: *AI that runs every day and tells you when it's working.*
- **Behind it.** Boona AI Agency is forming. Posts go out on LinkedIn, X and YouTube (the links are not filled in yet).
- **Status.** Open to projects for Q4 2026. The next two quarters are placeholders.

## The four products (all in beta, none released)

| Product | Colour | What it is, in Boopathi's words |
| --- | --- | --- |
| **Azhagi** | coral `#E06A5F` | A live MetaHuman on a video call. Sees you, hears you, talks back in real time, performs any move you ask for. An AI influencer an audience can call, not just watch. |
| **Boona Cue** | violet `#A98BDC` | Turns words from any AI into animation for AI characters. "Blink twice, then nod three times" happens exactly, on any engine. The model decides what to say; Cue makes the body keep its word. |
| **Thali** | teal `#3FC9B0` | React Native app. You set your meal rules; it turns them into a weekly South Indian meal plan sized for the people eating. On iPhone through TestFlight, not yet on the App Store. |
| **Boona Fit** | none (white on black) | Personalised fitness app: plans the programme, guides the exercising, tracks what actually happened. One plan per person, not per template. Shown on a black band with the other three colours on its rings. |

Say "Beta, in development" and "not yet released" for all four. No user counts, prices, launch dates or reviews exist yet; do not add any.

## Palette, and why

- **White page, black ink, grey for second-rank text.** The content and the product screens carry the colour; the frame stays neutral.
- **Teal `#3FC9B0` is the brand accent.** Underlined key phrases, the status dot, the quote mark, the current timeline dot, the open quarter, the signals in the landing field. Where a reference design used blue for a small static accent, this site uses teal instead.
- **Signal blue `#2F5BFF` is for motion and tool overlays only.** The grid drawing itself, dashed landing outlines, selection boxes, the crosshair, focus rings. Never a static accent, never text colour.
- **Coral, violet, teal are the product colours**, one each, used on that product's screen and tile. Nowhere else.
- **Red `#FF8A80`** means ending or negative inside product screens, and marks unfilled placeholders.
- The reference design had a light grey page (`#F4F4F4`). Boopathi kept white.

## Type

- **Geist** for everything, **Geist Mono** for small uppercase labels, numbers and the clock. Loaded from Google Fonts; the device font stands in offline. Boopathi chose Geist explicitly on 7 November 2026 after a brief trial of system fonts, so keep it.
- Big things are tight and heavy: the landing name at 700 weight and -0.04 em, section titles at 600 and -0.045 em with 0.95 line-height. Body is 15 px at 1.5. The label style is 10 px mono, uppercase, +0.08 em, grey.
- Every text style, with its desktop and phone size, is in `tokens.json` under `typography`.

## Grid, space, motion

- **12 columns in a 1280 px container, 24 px gutters.** 8 columns on tablet, 4 on phone with 16 px gutters. The grid lines can be shown on the page itself (the G key); the design system should keep that same grid.
- **Corners are square** on buttons, cards, screens and fields. Only chips, tags and dots are round.
- **Rules are 1 px**: black under section titles, light grey everywhere else.
- **Motion is quiet and quick.** Two curves: `snap` (0.2, 0.9, 0.1, 1) for things landing, `ease` (0.16, 1, 0.3, 1) for reveals. Hovers 200 to 250 ms, snaps 450 ms, reveals 700 ms. With a mouse the page glides; on touch and under "reduce motion" everything is still. Each product screen plays once, with a Replay button.

## Voice

The copy is first person, short sentences, plain words, specific over impressive. Examples from the page:
"Listen first." "Dates come as a range." "I am the architect, not the dependency." "One email is enough to start. No deck needed."
Two rules Boopathi states as learned the hard way, and which read as brand values: **telemetry before shipping** and **every date is a range**.

## Rules that are not negotiable

1. **Never invent a fact about the business.** Years, prices, client names, numbers, awards, testimonials: if Boopathi has not said it, it is a placeholder in square brackets, marked visibly.
2. **No photos.** Removed from the page on 7 November 2026 at Boopathi's request. The only picture in use is the link-preview image.
3. **Nothing goes public without Boopathi saying so.** Work in the folder, show it, wait for the word.
4. **Copy structure from references, never their palette or words.** The site's layout came from a reference page Boopathi liked; the colours and copy are Boona's own.
5. **Plain words in anything written for Boopathi.** Say what a file is and how to open it.

## Still placeholder (see `PLACEHOLDERS.md`)

Years of experience, job titles and company types in the timeline, the first start year, the three testimonials, the writing posts and the LinkedIn, X and YouTube links, the Q1 and Q2 2027 availability, and one line about who Boona Fit is for.

## Where things live

- Folder: `D:\Career\Product\boona-website` (the whole site; plain files, nothing to install).
- GitHub: `github.com/boona-studio/boona.in`, branch `main`. Vercel project `boona-portfolio` publishes it to www.boona.in on every push.
- Tokens: `tokens.json` at the root, also at `https://raw.githubusercontent.com/boona-studio/boona.in/main/tokens.json` (pullable by Tokens Studio) and `https://www.boona.in/tokens.json`.
- Design system: the `design/` folder. Its `README.md` describes the system (Grid v2), the components and the rules; `scripts/` builds the CSS variables, the Figma variables and a contrast report from `tokens.json`; `build/` holds the outputs. Not published.
- Figma: "Boona — Design system (Grid v2)", with Cover, Foundations and Components pages, kept in sync from the build outputs. Claude Design: the "Boona Grid" design-system artifact, built from the same tokens. Both links are in `design/README.md`.
- Notes for editing the site: `README.md`. Open items: `PLACEHOLDERS.md`.

## Keeping the site and the design system in step

Since 9 November 2026, `tokens.json` is the single source of truth. `css/tokens.css` is generated from it and the page loads that file just before `css/site.css`, which only reads the variables.
To change a colour, size or timing: edit `tokens.json`, run `npm run check` in the folder (it rebuilds the CSS variables, checks contrast and renders the page), then commit both files. Never edit a value by hand in `css/site.css`, in `css/tokens.css` or in Figma; they all follow the tokens file.
Layout and copy still live in `index.html` and `css/site.css`; the website session changes those.
