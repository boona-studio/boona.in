# Boona — the website

This folder is the whole site. It is plain web files: no software to install, no build step.
To see it, double-click `index.html`. It opens in any browser.

## What each file is

| File | What it does |
| --- | --- |
| `index.html` | Every word on the page. This is the only file you need to edit to change text. |
| `css/site.css` | How it looks: colours, type, the grid, phone and tablet layouts. |
| `js/site.js` | The motion and the small interactions (the gliding scroll, grid toggle, clock, Replay buttons, copy button, the brief form). |
| `media/` | Your photos. The page itself shows none of them; only `founder-share-16x9.jpg` is used, as the picture in link previews. The rest stay here unpublished. |
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

- **Availability.** The words "Open to projects" appear three times: the pill in the top bar, the hero meta line, and the first box under Availability in Contact. Search for `Open to projects`.
- **The next two quarters.** In the Contact section, the rows marked `[Open / Limited / Booked]`. The quarter names themselves update from the date on their own.
- **Email address.** Search for `studio.boona@gmail.com` (it appears in the hero, the contact section, the form and the footer).
- **Photos.** There are no photos on the page (removed on 7 November 2026). The web copies are still in `media/` if you ever want one back; ask and I will place it.
- **Big section titles.** Each section starts with a small label, a large title and a short note at the right. Search for `shead__t` to find the titles.
- **Typeface.** The page is set in Geist and Geist Mono, loaded from Google Fonts by the `<link href="https://fonts.googleapis.com/...">` line in the `<head>` of `index.html`. To use the device's own typeface instead (Segoe UI on Windows, San Francisco on Apple devices), delete that line and, in `css/site.css`, remove `"Geist",` from the `--sans:` line and `"Geist Mono",` from the `--mono:` line near the top.
- **Link previews.** When someone shares www.boona.in on WhatsApp, LinkedIn or X, the preview card uses `media/founder-share-16x9.jpg` and the words in the `og:` lines near the top of `index.html`.
- **Writing.** Each post is one `<tr> ... </tr>` row in the table under `<!-- ▸ WRITING -->`. Copy a row to add one.
- **Case-study numbers.** Each result is `<b class="num" data-count="7">0</b>`. Change `data-count` and the number counts up to it on screen.
- **Grid lines.** They are on by default. The toggle in the top bar (or the G key) remembers each visitor's choice.
- **Page colour.** The background is `--ground` near the top of `css/site.css` (white). The reference design used a light grey, `#F4F4F4`, if you ever want that.

## The contact form

The form does not need a server. When someone presses **Send the brief**, their email app opens with the brief already written to `studio.boona@gmail.com`.
If you would rather have briefs land in your inbox without the email app step, a free form service (for example Formspree or Basin) gives you a web address to paste into the form. Ask me and I will wire it in.

## Fonts and motion

- The typeface (Geist) loads from Google Fonts when the visitor is online. Offline it falls back to the device's own type (see "Typeface" above).
- With a mouse, the page glides: each wheel notch eases the page to its new place, and the menu links ease to their section. Touch screens and keyboards keep the normal scrolling.
- Columns pin: in the case studies the words stay put while the taller screen scrolls past; in Experience the numbers and portrait stay while the timeline draws; in Contact the form stays while the facts and photo scroll.
- Each product screen plays once when you reach it. **Replay** above a screen runs it again.
- People who have "reduce motion" switched on in their phone or computer settings get a still version of the page: no gliding, no grid draw, no snapping, screens shown finished.

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
