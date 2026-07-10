## Setup — required before anything renders

Every color token is scoped to `html[data-theme="light"]` / `html[data-theme="dark"]`
(spacing/type tokens are on `:root` and work regardless). Without the attribute,
components render with **zero color** — no backgrounds, no text/icon color, no
borders. Set it once, high in the tree:

```tsx
document.documentElement.dataset.theme = "light"; // or "dark"
```

Load the two token stylesheets before any `@banking-app/ui` component renders —
component CSS assumes the custom properties they define already exist:

```tsx
import "@banking-app/tokens/tokens.css";       // --space-*, --radius-*, --color-*, --fs-*, --lh-*
import "@banking-app/tokens/typography.css";   // .type-* utility classes (below)
import { Button, Card } from "@banking-app/ui";
```

No other provider or context is required — components are plain function
components with no React context dependency.

## Styling idiom

This is a **compiled BEM-class component library**, not a utility-class system.
Never invent utility classNames (no `bg-surface-1`-style guessing) — style
components through their real props (`variant`, `size`, `tone`, etc. — see each
`<Name>.prompt.md`), and reach for CSS custom properties directly for any custom
layout/spacing you add around them:

- Spacing: `var(--space-1)` … `var(--space-12)` (0.5rem → 9rem scale)
- Radius: `var(--radius-small)`, `var(--radius-regular)`, `var(--radius-pill)`
- Color: `var(--color-bg)`, `var(--color-fg)`, `var(--color-fg-secondary)`,
  `var(--color-btn-primary-bg)`, `var(--color-separator)`, etc. — grep
  `_ds/tokens/tokens.css` for the full set, all theme-aware.
- Type scale: `var(--fs-hero)` … `var(--fs-caption)`, or the ready-made classes
  from `typography.css`: `.type-hero`, `.type-h1`…`.type-h6`, `.type-lg`,
  `.type-md`, `.type-sm`, `.type-xs`, `.type-caption`, plus modifiers
  `.type-bold`, `.type-medium`, and `.type-trim` (tight leading for stacked
  labels — pair with `.type-stack-tight` on the flex/grid parent).

Icon props (`Button`'s `icon`, `Chip`'s `icon`, `ListItem`'s `icon`, etc.) take
a **sprite id string** (e.g. `"arrow-right"`, `"credit-card"`) rendered as
`<use href="#i-{id}">` — the host app must provide an SVG sprite with matching
`id="i-{name}"` symbols; the package does not vendor one. Only pass ids you know
exist in the host's sprite.

## Where the truth lives

Read `_ds/tokens/tokens.css` and `_ds/tokens/typography.css` before styling
anything by hand — they're the real, complete token set (not summarized here).
Each component's `_ds/components/general/<Name>/<Name>.prompt.md` documents its
exact props and shows real composed examples ported from this codebase's actual
usage (not invented) — prefer copying those patterns over guessing an API.

## Example

```tsx
<Card title="Checking account" headerEnd={<CardAmount currency="USD" value="4,281.06" />}>
  <ListItem icon="credit-card" title="Payment methods" subtitle="2 cards linked" chevron />
</Card>
```

# BankingAppUI (@banking-app/ui@0.1.0)

This design system is the published @banking-app/ui React library, bundled as a single
browser global. All 16 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.BankingAppUI`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.BankingAppUI.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { ActionBar } = window.BankingAppUI;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<ActionBar />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<ThemeRoot>{children}</ThemeRoot>
```

## Tokens

129 CSS custom properties from @banking-app/tokens. Names are
preserved verbatim from upstream. See `tokens/` for the full list.

- **color** (55): `--fs-text-lg`, `--fs-text-md`, `--fs-text-sm`, …
- **spacing** (20): `--section-card-header-padding-x`, `--section-card-header-gap-to-body`, `--space-1`, …
- **typography** (1): `--font-family`
- **radius** (3): `--radius-small`, `--radius-regular`, `--radius-pill`
- **other** (50): `--modal-payment-max-width`, `--confirmation-dialog-max-width`, `--fw-regular`, …

## Components

### general
- `ActionBar` — Ports .action-buttons / .action-button (row of circular quick-action
- `Button` — Standard button  ports .uz-btn from apps/web/css/styles.css.
- `Card` — Ports .section-card (header + bordered body) from apps/web/css/styles.css.
- `CardAmount` — Ports .section-card__amount  pairs with headerEnd on Card.
- `Carousel` — Ports .carousel (single-slide track with prev/next arrows + dot
- `Chip` — Ports .chip from apps/web/css/styles.css (see live story: Live/Components/Chip).
- `Dialog` — Ports the base .modal-overlay / .modal-shell / .modal structure from
- `Expander` — Ports .expander from apps/web/css/styles.css (title/subtitle/leading-icon/chevron
- `GroupAccountListItem` — Ports .list-item--group-account (bordered card row with trailing amount).
- `IconButton` — Icon-only button  ports .uz-btn--icon-only / --icon-only-secondary /
- `ListItem` — Ports the default .list-item variant (icon + content + optional chevron)
- `NavBar` — Ports .view__nav (page header bar: centered title + absolute-positioned
- `SegmentedControl` — Ports .segmented / .segmented__option from apps/web/css/styles.css
- `SelectField` — Ports .form-field__select-wrap / __select / __select-chevron.
- `TabControl` — Ports .tab-bar (fixed bottom tab navigation) from apps/web/css/styles.css
- `TextField` — Ports .form-field text-input variant (see live story: Live/Components/Form field
