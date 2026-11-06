# Boona — the website

This folder is the whole site. It is plain web files: no software to install, no build step.
To see it, double-click `index.html`. It opens in any browser.

## What each file is

| File | What it does |
| --- | --- |
| `index.html` | Every word on the page. This is the only file you need to edit to change text. |
| `css/site.css` | How it looks: colours, type, the grid, phone and tablet layouts. |
| `js/site.js` | The motion and the small interactions (grid toggle, clock, copy button, the brief form). |
| `media/` | Your photos. The page uses the small web copies (`founder-cutout.webp`, `founder-portrait-4x5.webp`, `founder-share-16x9.jpg`); the three originals are kept beside them. |
| `favicon.svg` | The little icon in the browser tab. |
| `PLACEHOLDERS.md` | The list of everything still to fill in. |
| `.vercelignore` | The list of files Vercel must not publish (this README, the placeholders list, the originals of the photos, tooling). |
| `.vercel/`, `.env.local`, `.gitignore` | Created by Vercel when the folder was linked to your project. Leave them alone. `.env.local` holds a private token: do not share it or email it. |
| `.claude/` | Preview tooling for the Claude app. You can ignore it. |

## How to change the words

1. Right-click `index.html` and choose **Open with → Notepad** (or any text editor).
2. Press Ctrl+F and search for the section you want. Every section starts with a comment line like
   `<!-- ▸ HERO ... -->`, `<!-- Case 01 · Azhagi -->`, `<!-- ▸ CONTACT ... -->`.
3. Change the text between the tags. Leave the tags (the parts in `< >`) alone.
4. Save, then refresh the browser.

## Placeholders

Anything I did not have a fact for is wrapped like this:

```html
<span class="ph">[year]</span>
```

On the page it shows with a dashed red outline and a tiny **FILL** tag, so you cannot miss it.
To fill one in, replace the text in brackets and delete `class="ph"` (or delete the whole `<span ...>` and `</span>` around it).
When you have done them all, open the first line of `index.html` and change `data-placeholders="show"` to `data-placeholders="hide"`.
That switches every marker off at once, even if a few spans are still there.

The full list is in `PLACEHOLDERS.md`.

## Common edits

- **Availability.** The words "Open to projects" appear three times: the pill in the top bar, the hero meta line, and the first row of the availability list in Contact. Search for `Open to projects`.
- **The next two quarters.** In the Contact section, the rows marked `[Open / Limited / Booked]`. The quarter names themselves update from the date on their own.
- **Email address.** Search for `studio.boona@gmail.com` (it appears in the hero, the contact section, the form and the footer).
- **Photos.** The page shows the small web copies in `media/` (`founder-cutout.webp`, `founder-portrait-4x5.webp`, `founder-share-16x9.jpg`). To change a photo, give me the new picture and I will make the web copies, or make them yourself at the same names and sizes (600 px wide cutout with a transparent background, 600 × 750 portrait, 1200 × 675 share image). The portrait beside the experience timeline is shown in black and white to match the design; for colour, open `css/site.css`, find `.portrait` and delete `filter: grayscale(1) contrast(1.05);`.
- **Link previews.** When someone shares www.boona.in on WhatsApp, LinkedIn or X, the preview card uses `media/founder-share-16x9.jpg` and the words in the `og:` lines near the top of `index.html`.
- **Writing.** Each post is one `<tr> ... </tr>` row in the table under `<!-- ▸ WRITING -->`. Copy a row to add one.
- **Case-study numbers.** Each result is `<b class="num" data-count="7">0</b>`. Change `data-count` and the number counts up to it on screen.
- **Grid lines.** They are on by default. The toggle in the top bar (or the G key) remembers each visitor's choice.
- **Page colour.** The light grey background is `--ground` near the top of `css/site.css`. Change it to `#FFFFFF` for pure white.

## The contact form

The form does not need a server. When someone presses **Send the brief**, their email app opens with the brief already written to `studio.boona@gmail.com`.
If you would rather have briefs land in your inbox without the email app step, a free form service (for example Formspree or Basin) gives you a web address to paste into the form. Ask me and I will wire it in.

## Fonts and motion

- The typeface (Geist) loads from Google Fonts when the visitor is online. Offline it falls back to the system font.
- People who have "reduce motion" switched on in their phone or computer settings get a still version of the page: no grid draw, no snapping, screens shown finished.

## The site is online

It is live at **https://www.boona.in** (and `boona.in` and `thali.boona.in`, which point at the same place).
It is served by Vercel from the project called `boona-portfolio` in your Vercel account, published on 6 November 2026.

### Publishing a change

1. Edit the files in this folder and check them by double-clicking `index.html`.
2. Open a terminal in this folder (in File Explorer: right-click the folder → **Open in Terminal**).
3. Run this one line and wait about ten seconds:

```
npx vercel deploy --prod --yes
```

The new version is live at www.boona.in as soon as it prints `Aliased`. Every earlier version stays in the Vercel dashboard, so a mistake can be rolled back there.

On a new computer, run `npx vercel login` first (it opens the browser for you to confirm), then
`npx vercel link --yes --project boona-portfolio --scope boopathi-ts-projects` once, then the deploy line above.

### The GitHub copy

This folder is also a git repository connected to `github.com/boona-studio/boona.in`, and the Vercel project builds from it.
The previous site's code is still in the repository's history (the commits before 6 November 2026), so nothing is lost.

A second way to publish, which also keeps a history of every change, is to commit and push:

```
git add -A
```

```
git commit -m "Describe the change"
```

```
git push
```

Vercel notices the push and updates www.boona.in by itself within about a minute.
Either way works; pushing is the tidier habit because the folder and GitHub then always match.
