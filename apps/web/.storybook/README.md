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

`.storybook/preview.js` imports the same stylesheets as HTML pages, in the same order:

1. `css/tokens.css` (generated)
2. `css/typography.css` (generated — trim + `.type-*` classes)
3. `css/styles.css` (components)

`npm run storybook` runs `tokens:build` first. If typography looks wrong after a Figma import, fix `designs/tokens/*.json` and rebuild — see `designs/tokens/README.md`.

## Run Storybook

```bash
npm run storybook
```

Default port: **6006** (use `-p 6010` if 6006 is busy).
