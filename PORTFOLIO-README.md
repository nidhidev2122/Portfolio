# Dev Nidhi — Portfolio (built on Phantom by HTML5 UP)

Plain HTML + CSS + vanilla JS on top of the Phantom template. No build step, no new dependencies.

## Run locally
Any static server works (opening `index.html` directly also works):

    cd <this folder>
    python3 -m http.server 8000      # then open http://localhost:8000
    # or:  npx serve .

## Add your portrait
Save your photo as **`images/portrait.jpg`** (portrait orientation, about 800 x 1000 px, under ~300 KB).
It is used in both the Home and About sections; no code change is needed. Until the file exists, a clearly labelled
placeholder is shown.

## Contact form
The form validates its fields but there is no server in a static site, so it never pretends to send:
- **Now (nothing configured):** it opens the visitor's email app with the message pre-filled to nidhidev2007@gmail.com.
- **To send for real:** create a form endpoint (Formspree, Web3Forms, Getform, or your own API) and paste its URL into
  `assets/js/config.js` → `contactEndpoint`. The form then POSTs JSON `{ name, email, message }` and shows
  success/error messages.

## What changed vs. stock Phantom
| File | Change |
|---|---|
| `index.html` | Fully replaced with the portfolio (all 8 sections) |
| `assets/css/portfolio.css` | **New.** All custom styling, loaded after Phantom's `main.css` (kept untouched) |
| `assets/js/portfolio.js` | **New.** Pinned hero scrub, reveals, project stacking, footer rise, nav highlight, contact form |
| `assets/js/config.js` | **New.** Contact-form endpoint |
| `assets/js/main.js` | Two small edits: menu links scroll smoothly to in-page anchors; `data-native` textareas skip Phantom's auto-resize |
| `images/favicon.svg` | **New** |
| Everything else | Untouched (`main.css`, Sass, Font Awesome, jQuery, Phantom's slide-in menu used on tablet/mobile) |

`generic.html`, `elements.html` and `images/pic01–15.jpg` are Phantom demo files. They are not used by the portfolio
and can be deleted if you like. `images/logo.svg` is also unused now.

## Scroll and animation effects
- **Pinned hero:** the Home section stays on screen while you scroll. The text beside the portrait changes in three stages (Data & AI/ML, Practical Projects, By Doing), a three-dash progress bar fills, then the hero blurs away into About.
- **Blur-in reveals:** section headings, cards and the About/Contact panels fade up out of a blur as they enter.
- **About portrait:** tilts in 3D when you hover it (mouse only).
- **Education:** the accent line fills as you scroll down the timeline.
- **Tech Stack:** two marquee rows scrolling in opposite directions (pause on hover).
- **Featured Projects:** four full-screen cards that stack. Each new card slides over the previous one, which scales back and dims. A dot rail on the right shows which project you are on.
- **Footer:** the giant name rises as you reach the end of the page (your portrait appears behind it once `images/portrait.jpg` exists).
- **Certifications:** boxes are intentionally static (no hover, no motion); only the heading reveals.
- With `prefers-reduced-motion` the pinned hero, reveals, stacking and marquees are switched off and everything is simply visible.

## Needs your verification
1. **Kheti Sahayak live URL** — you gave `kheti-sahayak.netlify.app` (also what the README says), but the GitHub repo's
   website field points to `kheti-sahayak-inky.vercel.app`. The site uses the Netlify link. Swap if the Vercel one is current.
2. **Namma Electricity backend** — the README lists FastAPI/Python, but the root `package.json` has `backend` npm scripts.
   Tags show React, TypeScript, FastAPI, PostgreSQL, Pandas per the README; confirm FastAPI is what's actually running.
3. **FIXIO** — repo found: `github.com/nidhidev2122/FIXIO` (home services marketplace; HTML/CSS/JS, Node/Express, MongoDB per README).
4. **Tech Stack** — SQL and Docker come from your brief / the Namma Electricity README; remove any you can't explain.
5. **Education** — no board is shown for Class 12 (none was given). Add one in `index.html` if you want it.
6. **Education reference screenshot** — it didn't come through in the upload, so the timeline follows your written description.
7. **Name order** — the site uses "Dev Nidhi" (hero, About, logo, footer). To switch to "Nidhi Dev", search `index.html` for "Dev Nidhi" and the hero/footer text.
8. **Fonts** — Poppins, Inter and JetBrains Mono load from Google Fonts (needs internet). To self-host, download them and add `@font-face` rules.
