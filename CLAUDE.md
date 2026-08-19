# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive family tree prototype for "The Jameel Family" — a React + Vite demo, no backend. All data is
mock/local in `src/data/familyData.json`, modeled on a source PDF chart. The app is a single page
(`HomePage.jsx`) with a Tree view and a Timeline view, search, and a detail drawer.

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint (config: .oxlintrc.json)
```

There is no test suite in this project.

To enable HTTP Basic Auth on `dev`/`preview`, set `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` in a local `.env`
(copy `.env.example`). Leave unset to run without auth.

## Architecture

### Single page, no router
`App.jsx` renders `HomePage.jsx` directly. An earlier version of this project had five alternate "Option"
pages (dark org-chart, a literal PDF-replica skin, a recursive free-form layout, etc.) behind a small
custom router (`useRoute.js`). All of that — the router, the pages, and every component used exclusively
by them — was deliberately removed at the user's request. Some of the *shared* infrastructure they used
(`useMeasuredEdges.js`, `genColorIndex`, the branch-color CSS system) is more generic/reusable than a
single-page app strictly needs — that's residue from supporting multiple renderers, not accidental
complexity. Don't reintroduce multi-page routing unless explicitly asked.

### Data model (`src/data/familyData.json` + `src/data/familyData.js`)
- `familyData.json` is the single source of truth — a fully-nested tree of person records, each with the
  complete field set explicit on every node (no JS factory defaults to fall back on): `id, name, fullName,
  born, died, gender, hasBio, bio, unverified, note, businesses[], mentionedInBio[], relatedMentions[],
  photoUrl, defaultCollapsed, spouses[], children[]`. `id` is a stable name-derived slug (e.g.
  `"hayat-jameel"`), disambiguated with a `-2`/`-3` suffix on collision (two people are both named "Hussein
  Jameel": `hussein-jameel` and `hussein-jameel-2`).
- `familyData.js` is a thin loader — `familyRoot` is just the parsed JSON, and `defaultCollapsedIds` is
  derived at import time by walking the tree for `defaultCollapsed: true` flags. Swapping in a real
  API/CMS later means replacing this loader (e.g. `fetch()` + the same shape), not the JSON shape or any
  consuming component.
- `bio` is `null` for every person right now (no real biography text exists yet) — `DetailDrawer`'s "View
  biography" panel shows `person.bio` when set, else falls back to prototype placeholder text. Populating
  `bio` per person is enough to make it real; no component change needed.
- `spouses` is an array of person objects (almost always length 1) — a married couple is one primary
  person plus entries in `.spouses`, not two peers in `children`. A remarriage (e.g. Hayat Jameel, married
  to both Saif Al-Din Al Samannoudi and Marwan Al Fawaz per the source chart) is just a second entry in
  the array — all children from every marriage stay flat in the primary person's own `children[]` rather
  than being split per-spouse, since nothing downstream needs that distinction and the source chart
  doesn't consistently make it either. `CoupleUnit`/`TimelinePair` render one card + one "M" toggle per
  spouse in `spouses`, each independently expandable.
- People whose identity isn't confirmed on the source chart use the chart's own literal bracket notation
  as their `name` (e.g. `"[NAME] Hamza"`, `"BROTHER"`, `"[SISTER?]"`) rather than an invented placeholder
  like "Unnamed spouse" — keep this convention for any new entries pulled from the source PDF.
- `unverified: true` is still set on some people but is **not read by any UI** — the "Unverified"
  badge/dashed-border/header-stat was intentionally removed. Treat the field as inert unless asked to
  reintroduce verification UI.
- Generation depth: `0` = Family Founder (root), `1` = Origins, `2`–`5` = "Generation 1"–"Generation 4"
  (matches the source chart's own generation labels, offset by one). See `GENERATION_LABELS` in
  `familyUtils.js`.
- `defaultCollapsedIds` lists the generation-3 branches with the most great-grandchildren, collapsed by
  default so the initial tree isn't overwhelming.

### Tree view rendering pipeline
- `TreeView.jsx` calls `buildVisibleRows()` (`familyUtils.js`) to flatten the currently-expanded tree into
  rows keyed by generation depth, plus a flat `{parentId, childId, childGen}` edge list.
- `useMeasuredEdges.js` is a shared hook: after render/resize it measures the real DOM position of each
  registered node (via a `registerNode(id, el)` ref callback) and turns the edge list into SVG path data
  for the connector lines. It measures the canvas via `getBoundingClientRect()`, not
  `scrollWidth`/`scrollHeight` — using scroll size caused a real bug where the absolutely-positioned SVG
  overlay's own stale size fed back into the measurement, so the canvas could never shrink back down after
  collapsing a large branch. Don't revert that.
- Every person registers **two** nodes in `CoupleUnit.jsx`, not one — this distinction matters and was the
  source of two separate bugs when collapsed into a single node. `${person.id}:source` marks the whole
  `.couple-unit__pair` (primary + spouse card(s) + "M" toggle(s) together); plain `person.id` marks only the
  primary's own `PersonCard` (passed down as a `cardRef` prop it forwards to its root `<button>`).
  `useMeasuredEdges` looks up `${edge.parentId}:source` for where a branch *departs* and plain
  `edge.childId` for where it *arrives*:
  - **Departure** (`:source`, the whole pair) is deliberate: the source chart draws the branch to children
    dropping from the marriage connector, not from either spouse individually. Every `PersonCard` is the
    same fixed width, so for the common one-spouse case the pair's geometric center lands right on the "M"
    glyph between the two cards — matching the chart with no special-casing needed. It degrades sensibly at
    the edges too: a spouse-less primary's "pair" is just their own card, so the departure point is their
    card center; a remarriage (`CoupleUnit` puts the first spouse before the primary and the rest after, so
    the primary stays visually centered — see below) has no single marriage to point to, so it falls back to
    the primary's own center by the same symmetric-width math.
  - **Arrival** (plain id, primary's card only) must stay separate from departure: an incoming line from
    THIS person's own parent has to land on their card specifically, not drift onto their marriage with
    their own spouse. Reusing one shared node for both directions was tried and is wrong — it makes a
    person's own children branch correctly from their marriage, but also makes the line arriving from THEIR
    parent land on that same marriage point instead of on them.
  - The expand/collapse toggle stays a sibling *outside* the ref'd `.couple-unit__pair` row (an earlier bug
    had it inside the measured box, which skewed the departure point sideways) — CSS alone
    (`align-items: center` on `.couple-unit`) keeps the toggle visually centered under the same row the
    `:source` ref measures, so the toggle and the line it controls always agree on where the branch starts.
- A remarriage (2+ entries in `spouses[]`, e.g. Hayat Jameel) renders with the *first* spouse to the
  primary's left and the rest to their right, rather than stacking every spouse on one side — that's what
  keeps the primary horizontally centered in the pair (see `CoupleUnit.jsx`'s `beforeState`/`afterStates`
  split), which in turn is what keeps the departure point centered on the primary rather than skewed toward
  one marriage.
- `MIN_COLLAPSIBLE_GEN` (`familyUtils.js`, currently `1`) hides the expand/collapse toggle at shallower
  depths than that. Collapsing the lone-child Founder row hides ~the entire tree in one click and reads as
  the app breaking; Origins (depth 1) onward do show the toggle since collapsing them is actually useful.

### Timeline view
`TimelineView.jsx`/`TimelinePair.jsx` render the same data as flat generation lanes (via
`flattenPeople()`), not a connected diagram — no SVG lines involved.

### Detail drawer
`DetailDrawer.jsx` is driven by `gen` (numeric depth, used for the branch-color accent bar/avatar) and
`relations` (spouse/children, computed via `getRelations()` in `HomePage.jsx`). Clicking a Spouse/Children
link calls `onJump`, which expands the ancestor path (`manualOpenIds` state in `HomePage.jsx`) and
re-selects that person.

### Styling (`src/index.css` + `src/App.css`)
- The brand palette is CSS custom properties in `index.css`: `--bg` (white), `--item-bg` (`#e6f0e5` sage,
  primary person cards), `--item-bg-alt` (light grey, spouse cards), `--text`/`--accent` (`#445f5c`),
  `--text-muted` (`#7a8a7a`), `--radius` (`5px`, applied via `var(--radius)` almost everywhere). A
  `prefers-color-scheme: dark` block provides a dark variant of the *same* brand family, not an unrelated
  palette.
- Generation color-coding: `--gen-0`…`--gen-4` are 5 fixed hues; `.gen-0`–`.gen-4` utility classes set a
  local `--row-color` custom property that cascades to descendants (card top-border, sidebar accent bar,
  connector-line stroke, drawer avatar/accent bar). `genColorIndex(gen)` maps raw tree depth to one of the
  5 slots (Founder and Origins share slot 0).
- `.app-header` is a deliberately fixed dark theme (`#1a3a3a` background, light text) independent of the
  light-mode vars used everywhere else — a distinct branded bar, not themed app chrome. Its buttons
  (`.view-toggle button`, `.search-bar`, `.expand-controls button`) are outlined pill shapes.
- The `+`/`−` expand toggle (`.toggle-btn`) is intentionally circular and always solid `var(--accent)`
  dark green, *not* the branch color — that was tried and explicitly reverted per feedback.
- The marriage toggle ("M") is intentionally plain text with no box/border — also explicit feedback, don't
  re-add a button box around it.
- The left generation-label sidebar (`.gen-row__label`) is deliberately very slim with vertical
  (`writing-mode: vertical-rl`) text, and `.gen-row` uses `align-items: stretch` so the label's opaque
  background spans the row's full height — without that, horizontally-scrolling cards show through above
  and below the label.

### HTTP Basic Auth (`basicAuthMiddleware.js`, `middleware.js`, `vite.config.js`)
Opt-in: only active if `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` are set. Two separate enforcement points, both
reading the same two env var names but from different places:
- `basicAuthMiddleware.js` is a real server-side check via a Vite `configureServer`/`configurePreviewServer`
  plugin (credentials never ship in the client bundle), reading `.env`. Only covers `npm run dev`/
  `npm run preview` — a Node server. It does **not** run for a static deploy at all.
- `middleware.js` (root-level) is Vercel Edge Middleware, the equivalent for the static `dist/` Vercel
  actually serves — it runs at the edge in front of every request (matcher `/:path*`, so static assets are
  covered too, not just `/`), before any file is served. Reads the env vars from the Vercel project's own
  Settings → Environment Variables, not `.env` — that file never reaches the deployed edge runtime, so it
  has to be set there separately. Same opt-in fallback as local dev: unset either var and auth is skipped
  rather than failing closed.
Other static hosts (Netlify, GitHub Pages, ...) would need their own equivalent again — `middleware.js` is
Vercel-specific.

### Deployment
`vercel.json` has a catch-all rewrite to `index.html`, needed for client-side routing to survive a hard
refresh on a static host. There's currently only one route, so this mostly matters if routing is
reintroduced later.
