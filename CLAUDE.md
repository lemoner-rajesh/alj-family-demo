# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive family tree prototype for "The Jameel Family" — a React + Vite demo, no backend. All data is
mock/local in `src/data/familyData.js`, modeled on a source PDF chart. The app is a single page
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

### Data model (`src/data/familyData.js`)
- The tree is built from nested `person()` factory objects: `id, name, fullName, born, died, gender,
  hasBio, unverified, note, businesses[], children[], spouses[]`.
- `spouses` is an array of `person()` objects (almost always length 1) — a married couple is one primary
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
- `CoupleUnit.jsx` renders one couple. The ref used for line-anchoring wraps *only* the primary+spouse
  pair — never the expand/collapse toggle. An earlier bug had the toggle inside the measured box, which
  skewed the connector line's anchor point sideways toward the spouse.
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

### HTTP Basic Auth (`basicAuthMiddleware.js`, `vite.config.js`)
Opt-in: only active if `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` are set. Real server-side check via a Vite
`configureServer`/`configurePreviewServer` plugin, so credentials never ship in the client bundle. This
only protects `npm run dev`/`npm run preview` (a Node server) — it does **not** protect a static deploy
(e.g. Vercel serving `dist/`), which would need the host's own equivalent (Edge Middleware, etc.).

### Deployment
`vercel.json` has a catch-all rewrite to `index.html`, needed for client-side routing to survive a hard
refresh on a static host. There's currently only one route, so this mostly matters if routing is
reintroduced later.
