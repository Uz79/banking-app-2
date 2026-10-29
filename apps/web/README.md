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
| `uzBankWebPlaygroundSound` | Design system > Payday run: `on` or `off`, the Sound switch in the settings dialog (missing means on) |
| `uzBankWebPlaygroundSettings` | Design system > Payday run settings dialog: JSON `{ quality, camera, effects, fog }`; anything missing or unknown falls back to the default |
| `uzBankWebPlaygroundBest` | Design system > Payday run: the best run, `{ "balance": number, "date": "YYYY-MM-DD" }` |
| `uzBankWebAnalyticsOff` | `1` when `?analytics=off` was used on this device: the Vercel analytics script is not loaded (`?analytics=on` removes it) |

Persisted in `sessionStorage` (this tab only):

| Key | Purpose |
|-----|---------|
| `uzBankWebOpeningDraft` | Investment opening draft: JSON `{ step, answers, fridgeAmount, from }`, written by the fridge's "Show suitable products" and on every change in the opening; cleared on completion and by the demo data reset. Unreadable means a fresh start |

## Source layout

- `spa-source.html` — wide SPA-style reference (not the primary runtime)
- `components.html` — button design-system gallery
- `character-kit.html` — design system: the 3D persona character, with a live specimen
- `fridge-advisor.html` — "How much should I invest?": the 3D fridge advisor (opened as a sheet from Overview > Offers > Investment)
- `playground.html` — design system: "Payday run", a small 3D game (full screen, opened as a sheet from the Design system page)
- `css/tokens.css` — generated from `designs/tokens/`
- `css/typography.css` — generated responsive type scale
- `css/styles.css` — components and page layout

## Persona character (Profile > User Type)

- `js/mode-toggle.js` — the mobile Light/Dark button in the top bar of the four main screens (Overview, Payments, Profile, Design system): calls `UZBankApplyThemeChoice`, keeps the button's accessible name current. The sun or moon is chosen in CSS by `html[data-theme]`. Hidden at 1280px and up, where the sidebar has the control.
- `js/profile-persona.js` — three sliders set the profile (novice / standard / power): title, story, UI preview and the Legibility preset (Large / Regular / Compact). Each slider also owns part of the character: financial knowledge → headwear (the head is always the Rogue's), banking products → outfit + back, digital affinity → animation loop.
- `js/profile-persona-character.js` — three.js scene (runtime from jsDelivr). KayKit parts mixed on one shared rig, recoloured to the theme (monochrome + one accent), transparent stage with an overlay-tint shadow and a spotlight on dark backgrounds.
- `assets/3d/kaykit/` — KayKit Adventurers 2.0 by Kay Lousberg (CC0), pruned to the parts used.
- `assets/images/persona/` — UI previews rendered from Figma (`banking-app_main-view-profile_setting-persona_ui-previews`), recoloured to the live theme at runtime.

## Playground (Design system > Payday run)

- `playground.html` + `js/playground.js` — page, game loop, overlays (start, pause, result), keyboard and touch input, the still version for reduced motion
- `js/playground-config.js` — every number that decides how it feels (speeds per profile, steering, camera, track, coins, gates, chest, forest growth, rendering)
- `js/playground-track.js` (the curve and distance lookup), `js/playground-world.js` (the town), `js/playground-coins.js`, `js/playground-gates.js`, `js/playground-chest.js`, `js/playground-forest.js`
- `js/playground-audio.js` — the two sounds (footsteps, coin) through the Web Audio API; unlocked by the Start click, muted by the HUD button
- `js/playground-sheet.js` — the Design system page opens the game as a flow-style sheet (iframe, slides up and down like the payment flow)
- `assets/3d/playground/town` and `assets/3d/playground/forest` — KayKit City Builder Bits 1.0 and Forest Nature Pack 1.0 by Kay Lousberg (CC0), pruned to the models used; licences included
- `assets/audio/playground/` — step-town-1..4, step-forest-1..4 and coin as mono WAV, converted from Kenney Impact Sounds (CC0, licence included)
- Dev URL parameters: `?debug` (draw calls, frame cost), `?touch` (show the touch buttons), `?reduced` (force the still version), `?from=<distance>&money=<chf>` (start partway along the track)

## Fridge advisor (Overview > Offers > Investment)

- `fridge-advisor.html` + `js/fridge-advisor.js` — page, steps, sliders with typable fields, the result formula, the closing screen
- `js/fridge-advisor-config.js` — every number that decides how it looks (camera poses, doors, food packing, slider ranges, the step copy)
- `js/fridge-advisor-scene.js` — the scene: the kit fridge, shelves and drawers as boxes, food packed in rows, the persona, the theme
- `js/fridge-advisor-sheet.js` — Overview opens the page as a wide flow sheet (iframe, `.modal-shell--wide`, slides up and down like Pay)
- `assets/3d/fridge/` — Kenney Furniture Kit (the fridge) and Food Kit (15 models and the colour map), CC0; the build copies it to `dist`
- No `localStorage` keys: the values live in memory only. Dev URL parameters: `?reduced` (force the still version), `?open=1` (both doors open)
