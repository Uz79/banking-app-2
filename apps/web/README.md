# UZ Bank Web

Multi-page e-banking shell (`apps/web` in the banking-app monorepo): overview, payments, profile, account and investment flows, with design tokens from `../../designs/tokens/`.

Opening **Pay** starts the type-ahead recipient search step (`#pay/recipient-search`), then recipient → amount → schedule → summary. See `../../designs/screens/` for payment-flow exports.

Icons are centralised: one sprite plus same-document `<use>` references so strokes follow `var(--color-fg)` via `currentColor`.

## Quick start

```bash
cd apps/web
npm install
npm run dev
```

Open `http://localhost:5173/overview.html`.

## Icons workflow

1. **Add or edit** a source file under `assets/icons/` named `icon24-{name}.svg` (24×24 viewBox).
2. **Regenerate the sprite**:

   ```bash
   python3 scripts/sync_icons_sprite.py
   ```

   Rebuilds `assets/icons-sprite.svg` and embeds symbols into shell HTML pages.

3. **Markup** — each shell page includes an inline sprite block after `<body>` (`#uzbank-icon-defs`). Icons use same-document references:

   ```html
   <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false">
     <use href="#i-home"/>
   </svg>
   ```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/sync_icons_sprite.py` | Build sprite, migrate legacy `<img>` icons, embed into shell HTML |
| `scripts/generate-tokens-css.mjs` | Regenerate `css/tokens.css` from `designs/tokens/` |
| `scripts/generate-storybook-design-exports.mjs` | Reference Storybook stories from `designs/` |

## Storage keys

Persisted in `localStorage` (see `js/storage-migrate.js` for legacy key migration):

| Key | Purpose |
|-----|---------|
| `uzBankWebTheme` | `light` / `dark` |
| `uzBankWebColorOverride` | Custom `{ bg, fg }` palette |
| `uzBankWebAppearance` | Profile legibility / persona scale |
| `uzBankWebPaymentState` | Demo payment balances and bookings |
| `uzBankWebSavedColorThemes` | Profile saved colour themes |

## Source layout

- `spa-source.html` — wide SPA-style reference (not the primary runtime)
- `components.html` — button design-system gallery
- `css/tokens.css` — generated from `designs/tokens/`
- `css/typography.css` — generated responsive type scale
- `css/styles.css` — components and page layout
