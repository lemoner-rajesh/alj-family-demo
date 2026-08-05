# alj-family-demo

Interactive family tree prototype for The Jameel Family — a React + Vite demo built to explore different UI treatments of the same underlying data (parents, marriages, and four generations of descendants).

All data is mock/local (`src/data/familyData.js`); there is no backend.

## Pages

- **Home** (`/`) — full experience: tree/timeline toggle, search, legend, stats.
- **Option 1** (`/option-1`) — bare generation-lane tree canvas, no chrome.
- **Option 2** (`/option-2`) — a literal recreation of the source PDF chart's print-document look.
- **Option 3** (`/option-3`) — dark, colorful org-chart style with avatars, gender-coded cards, and a floating search box.
- **Option 4** (`/option-4`) — same visual style as Option 3, but a free-form recursive node-link layout instead of shared horizontal rows.

## Running locally

```bash
npm install
npm run dev
```

```bash
npm run build   # production build
npm run lint    # oxlint
```
