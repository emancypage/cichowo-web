# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`cicholas.pl` — landing page for "Cicho Las", a wooden vacation cottage in Cichowo. Pure static site, hosted on GitHub Pages (`emancypage/cichowo-web`, branch `master`).

## Stack & deploy

- **Stack**: HTML5 + CSS3 + vanilla JS. No build step, no frameworks, no CDN React/Babel. Everything ships as static files.
- **Fonts**: DM Serif Display (display) + DM Sans (body) from Google Fonts.
- **Hosting**: GitHub Pages on CNAME `cicholas.pl`. `.nojekyll` disables Jekyll — files served 1:1 from the repo.
- **Deploy**: `git push origin master` → GH Pages builds automatically (~30-60s).
- **No tests/linters**: verified by opening `file:///.../index.html` locally and eyeballing.

## URL structure (clean, no `.html`)

- `/` → `index.html`
- `/blog/` → `blog/index.html`
- `/blog.html` → single-page redirect stub (meta refresh + JS replace + `<link rel="canonical">`) for old bookmarks; **do not delete it**
- Internal links use absolute paths (`/`, `/blog/`, `/css/styles.css`, `/js/filters.js`) — anchors on the main page as `#xxx`, anchors from other pages as `/#xxx`

When adding a new subpage: create `name/index.html` (not `name.html`), always link as `/name/`.

## Visual architecture

Palette tokens (defined in `:root` in `css/styles.css`):
- `--bg: #fbf8f1` (cream) — main background
- `--bg-warm: #f3eddf` — "warm" sections (contact, gallery filter)
- `--bg-ink: #1a1610` — dark background (Amenities section, hero badge)
- `--ink`, `--ink-soft`, `--ink-dim` — text
- `--rust: #a64a2b`, `--rust-soft: #c66a44` — accent (door in logo, italics in headings, hover, icons)
- `--moss` — secondary accent
- `--rule` — separators

Sections on the main page (order, each styled separately in `css/styles.css`): nav · hero (mosaic 2 photos + rating chip + weather chip) · about · gallery (filter chips + 6-tile asymmetric grid) · amenities (dark, 10 cards with SVG icons) · blog-teaser · contact (3 rows: phone, navigate, email + map) · footer.

Responsive breakpoints: 1080px and 720px.

## JavaScript

Only two modules, both loaded `defer`:

- **`js/filters.js`** — `bindChipGroup()` toggles `is-active` class within a `.chip` group. Gallery on index.html: purely visual (no photo metadata). Blog: actually filters cards by `data-kicker`.
- **`js/weather.js`** — Open-Meteo (no API key), current temperature + WMO weather code mapped to an icon. Cache in `localStorage["cichoWeather"]` with 30 min TTL:
  - Fresh cache (<30 min) → render, no fetch
  - Stale cache → render immediately + background fetch
  - No cache and fetch failed → leaves the static HTML text (fallback `+22°C`)
  - Cichowo lat/lon: `51.98, 16.80`

If you add JS: stick to vanilla, no bundler, load via `<script src="/js/..." defer>`.

## Iconography

All icons are inline SVG, `viewBox="0 0 24 24"`, line-based, `stroke="currentColor"` so they inherit color from the container. Stroke-width: 1.7-2 (1.7 for larger, 2 for 16-32px). Amenity cards use this pattern — `.amenity__num` is a 44×44 box with bg `rgba(--rust, .18)` and `color: var(--rust-soft)`; the inner SVG scales via `.amenity__num svg { width: 22px; height: 22px }`.

The house logo appears in three places: SVG in nav (index.html and blog/index.html), SVG in footer (lighter stroke), and `favicon.svg` (with a `<rect>` bg for visibility in tabs). If you change the logo, change it in all three + regenerate `favicon.ico` and `apple-touch-icon.png` (`convert -background none -density 256 favicon.svg ...`).

## Content conventions

- All website copy is in Polish.
- **Do not use `&nbsp;` in HTML.** Use regular spaces only. The repo has a linter/formatter that strips `&nbsp;` entities, so adding them is pointless — they get removed on save. If orphan-prevention before single-letter conjunctions ("i", "w", "z", "o", "do") is needed, handle it in CSS (e.g. `text-wrap: pretty`) or accept the orphan.
- Polish address: `64-010 Cichowo, Osiedle leśne 5` (alternatively "Zaścianek 5" — only as an informational alias in parentheses).
- Lake: always "Jezioro Cichowo" (not "Mórka", not "Wielkie").
- Phone: `692 497 160` (links as `tel:+48692497160`).
- Email: `leszekszymkowiak0@gmail.com`.
- The "Nawiguj" button in nav and Contact section links to Google Maps directions: `https://www.google.com/maps/dir/?api=1&destination=64-010%20Cichowo%2C%20Osiedle%20le%C5%9Bne%205` — **this exact URL** (owner's requirement).

## Git workflow

- Branch: `master` (the only deploy branch for GH Pages).
- Identity set locally in the repo: `Szymon Szymkowiak <szymkowiak.szymon@gmail.com>`.
- **Claude only commits. USER pushes.** After finishing a change: `git add` + `git commit` — STOP. Only run `git push` when USER explicitly says "push"/"pushujemy"/"wypchnij". A plain "ok"/"robimy"/"zrób X" means commit without push.
- Commit messages in English, short and to the point. **Never add `Co-Authored-By: Claude`, "🤖 Generated with Claude Code", or any other reference to Claude/Claude Code.** The commit should look as if USER wrote it themselves.
- `.idea/` is gitignored (JetBrains).
- Binary icon files (`favicon.ico`, `apple-touch-icon.png`) are regenerable from `favicon.svg`, but kept in the repo since there's no build step.
