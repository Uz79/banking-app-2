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
| `uzBankWebColorOverride_v2` | Profile > Theme: committed colour theme (see `scripts/theme-engine/`) |
| `uzBankWebColorTokens` | Finished `--color-*` tokens for Light and Dark, applied by the boot script on every page |
| `uzBankWebAppearance` | Profile legibility / persona scale |
| `uzBankWebPersonaProfile` | Profile > User Type slider values (financial knowledge, banking products, digital affinity) |
| `uzBankWebPaymentState` | Demo payment balances and bookings |
| `uzBankWebSavedColorThemes_v2` | Profile > Theme saved theme cards |
| `uzBankWebBuiltinThemesSeeded_v1` | Built-in theme cards seeded once |

## Source layout

- `spa-source.html` — wide SPA-style reference (not the primary runtime)
- `components.html` — button design-system gallery
- `css/tokens.css` — generated from `designs/tokens/`
- `css/typography.css` — generated responsive type scale
- `css/styles.css` — components and page layout

## Persona character (Profile > User Type)

- `js/profile-persona.js` — three sliders set the profile (novice / standard / power): title, story, UI preview and the Legibility preset (Large / Regular / Compact). Each slider also owns part of the character: financial knowledge → headwear (the head is always the Rogue's), banking products → outfit + back, digital affinity → animation loop.
- `js/profile-persona-character.js` — three.js scene (runtime from jsDelivr). KayKit parts mixed on one shared rig, recoloured to the theme (monochrome + one accent), transparent stage with an overlay-tint shadow and a spotlight on dark backgrounds.
- `assets/3d/kaykit/` — KayKit Adventurers 2.0 by Kay Lousberg (CC0), pruned to the parts used.
- `assets/images/persona/` — UI previews rendered from Figma (`banking-app_main-view-profile_setting-persona_ui-previews`), recoloured to the live theme at runtime.
