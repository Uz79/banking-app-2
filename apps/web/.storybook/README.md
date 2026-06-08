# Storybook (UZ Bank web app)

## Sidebar lanes

| Lane | Source | Purpose |
|------|--------|---------|
| **Live** | Hand-written `src/stories/**/*.stories.js` and `src/stories/live/**` | Real HTML/CSS, Controls, hover states, and page shells with app scripts |
| **Reference** | Auto-generated `npm run storybook:sync` → `components/design-export/`, `pages/design-export/` | Figma SVG grids from `designs/` (read-only) |

Use the **Canvas** tab for design exports (Docs are disabled on Reference stories).

## Regenerating Reference stories

```bash
npm run storybook:sync
```

Do not edit `*.stories.mjs` under `design-export/` by hand.

## Live page stories with scripts

`Live/Pages/Account Details` loads app IIFEs via `.storybook/load-app-scripts.js` in the story `play` function. `app-mp.js` and `data-render.js` use `onDocumentReady()` so init runs even when scripts load after the document is ready.

## CSS parity with the app

`.storybook/preview.js` loads the same stylesheet order as shell pages:

1. `css/tokens.css` — primitives + trim variables (`--trim-top-*`, `--text-row-gap`)
2. `css/typography.css` — `.type-*`, `.type-trim`, `.type-stack-tight` (generated)
3. `css/styles.css` — components

`npm run storybook` and `npm run build-storybook` run **`tokens:build` first** so Storybook never drifts from regenerated typography.

### Leading trim in Live stories

Two-line rows (product item, list item, group-account card) should match production markup:

```html
<div class="… type-stack-tight">
  <span class="… type-sm type-trim">Title</span>
  <span class="… type-xs type-trim">Subtitle</span>
</div>
```

See **Live → Foundations → Typography** for the trim stack reference.

`storybook-static/` is a build artifact — rebuild with `npm run build-storybook` after token or CSS changes.

## Run Storybook

```bash
npm run storybook
```

Default port: **6006** (use `-p 6010` if 6006 is busy).
