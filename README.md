# A Quiet Record — a personal site

A minimalist, serif, hybrid landing page. The landing page (`index.html`) holds short previews of six sections; each preview links to its own subpage.

---

## What's here

```
index.html          The landing page
styles.css          Shared styles (type, palette, spacing)
about.html          Who I Am
milestones.html     Milestones
career.html         The Work  — full example of the subpage pattern
travel.html         Places, Walked
thoughts.html       Notes to Myself
hobbies.html        Good Ways to Spend an Afternoon
README.md           This file
```

Every subpage shares the same CSS and font links, so you only style things in one place.

---

## How to edit

**Text.** Open any `.html` file in a plain text editor (VS Code, Sublime, Notepad++) and edit the text between tags. Leave the tags themselves alone.

**The landing page previews.** Each of the six preview blocks in `index.html` is wrapped in `<article class="section">`. The roman numeral, title, paragraph, and "Continue reading" link are the only things you'd normally change.

**A subpage.** The fullest example is `career.html`. It shows every block you'll realistically need:

| What you want | HTML to use |
|---|---|
| Page title | `<h1 class="section-title">` inside `<header class="sub-head">` |
| Body paragraph | `<p>` inside `<div class="prose">` |
| Sub-heading | `<h3>` |
| Pull quote | `<blockquote>` |
| Emphasis | `<em>...</em>` |
| Link | `<a href="...">...</a>` |
| Dated entry (for milestones, travel) | `<div class="entry">` with `<p class="entry-meta">`, `<h2>`, `<p>` |

**Your contact info.** The footer of `index.html` has placeholder `email`, `github`, `linkedin` links. Change the `href="..."` values to your real URLs.

**Your monogram.** The small `H · ND` in the top-left of `index.html` is inside `<span class="mark-text">`. Change it if you like.

---

## How to change the look

Everything visual lives in `styles.css`, at the top, under `:root`. Changing a CSS variable there updates every page at once.

```css
--bg:         #f5f0e6;   /* page background */
--ink:        #1e1b16;   /* main text */
--ink-soft:   #5a5248;   /* secondary text */
--accent:     #8f6641;   /* warm clay accent */
--display:    'Fraunces', ...;   /* headings */
--body:       'Newsreader', ...; /* body text */
```

To try a different font, pick one with Vietnamese diacritic support from [Google Fonts](https://fonts.google.com/?subset=vietnamese), update the `<link>` in every HTML file's `<head>`, and change `--display` / `--body` in `styles.css`.

---

## How to deploy

Any static host works. No build step, no server, no database.

**GitHub Pages** (free, recommended if you already use GitHub)
1. Create a new public repository.
2. Drop all the files in the root of the repo.
3. In Settings → Pages, choose "Deploy from branch" and pick `main` / `(root)`.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

**Netlify** (also free, drag-and-drop)
1. Go to [app.netlify.com](https://app.netlify.com) and sign up.
2. Drag the folder containing these files onto the "Sites" page.
3. You'll get a URL in about ten seconds.

**Vercel** (free, similar)
1. Go to [vercel.com](https://vercel.com), sign up, connect a GitHub repo.
2. Vercel auto-detects static sites and deploys on push.

**Preview locally.** Just double-click `index.html`. It will open in your browser. No server needed for static HTML, though reveal animations and fonts all work either way.

---

## Extending later

A few things you might want to add down the road, in rough order of usefulness:

- **A language toggle.** The structure is clean enough that adding a Vietnamese version is straightforward: duplicate the six HTML files into a `/vi/` folder and translate.
- **Photos.** Drop images into an `/images/` folder and reference with `<img src="images/dolomites.jpg" alt="...">` inside an `.entry` or `.prose` block. No extra CSS needed — images will constrain to the prose width automatically.
- **A dark mode.** Add a `prefers-color-scheme: dark` block in `styles.css` that redefines the `:root` variables. The rest of the stylesheet will adapt.
- **A real favicon.** Create a simple `favicon.ico` (a small mark based on your initials works well with the aesthetic) and link it in each page's `<head>`.

Built to be edited, not admired. Change anything.
