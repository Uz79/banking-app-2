# Card components

Figma exports named **Card - …** are grouped here under `card/` (category folder, same idea as `selection-control/` or `menu/`).

## Components in this folder

| Folder | Manifest | Web implementation | Role |
|--------|----------|-------------------|------|
| `section-card/` | `section-card.json` | `.section-card` in `styles.css` | Dashboard **section shell**: header row + bordered body. Figma labels (`Card - Bookings`, `Card - Performance`, …) are **content variants** of this one component — not separate components. |
| `color-theme/` | `color-theme.json` | Profile theme picker | Small selectable theme cards (different pattern from section-card). |

## Why `section-card/` exists

- One reusable layout in the app: `.section-card__header` + `.section-card__body`.
- Figma ships many **filled examples** (accounts, bookings, performance chart, positions table, …) as separate exports.
- Those exports live as `section-card/variants/<slug>/default.svg` so Storybook and docs stay aligned with a single manifest.

You do **not** need a separate component folder per Figma card label — only when the **UI pattern** differs (e.g. `color-theme`).

## Adding exports

1. Drop `Card - <Label>.svg` (and `.png` if exported) in `designs/_inbox/` with prefix `card -`, or place at `card/` root temporarily.
2. Run `python3 designs/scripts/normalize_design_exports.py` — routes to `section-card/variants/<kebab-label>/`.
3. Update `section-card.json` + `section-card.md` variant table.
4. Regenerate Storybook refs: `node apps/web/scripts/generate-storybook-design-exports.mjs`

Convention per component: `<slug>.json`, `<slug>.md`, `variants/<variant-kebab>/default.svg` (+ `default.png` when exported).
