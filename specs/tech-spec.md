# Technical Spec

Scope: `apps/web`. The other folders (`apps/ios`, `apps/backend`, `packages/`, `designs/`) are supporting material; `designs/tokens/` is the token source.

## Stack

- Vanilla HTML, CSS and JavaScript, multi-page, built with Vite (`npm run dev` on port 5175, `npm run build`)
- Classic `<script>` files for the app shell; ES modules only where a library needs them (the 3D character)
- three.js 0.170 from jsDelivr, loaded only by the 3D character module
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main` (it uploads `apps/web` after a build)

## Not using

- No UI framework, no TypeScript, no state library
- No test runner or end-to-end infrastructure; checks are manual and recorded in each spec's `validation.md`
- No backend: all data is simulated in the browser
- No new runtime dependency without a spec decision that records why

## Pages

Every shell page shares the same structure: sidebar (desktop) or tab bar (mobile), `.main-content` with a sticky header, the inline icon sprite, the inline boot script, and `data-screen` on `<body>`.

| Page | `data-screen` | Depth | Notes |
|---|---|---|---|
| `overview.html` | overview | 0 | Accounts, products, offers; the 3D character at 1× |
| `payments.html` | payments | 0 | Pay flow overlays (`#pay/...`), recipient search, schedule, summary |
| `profile.html` | profile | 0 | User Type, Legibility, Theme tabs; admin access; demo data reset |
| `account-details.html` | account-details | 1 | Account with bookings |
| `investment-product-details.html` | investment-product-details | 1 | Custody account, positions, trade |
| `all-bookings-and-payments.html` | all-bookings | 2 | Executed, pending, recurring |
| `details-of-position.html` | details-of-position | 2 | Position chart, buy and sell |
| `account-information.html` | | | Account information overlay content |
| `design-system.html` | design-system | 0 | Admin hub: Motion, Components, Character kit |
| `motion-specimens.html` | motion-specimens | 1 | Admin: motion specimens with live demos |
| `components.html` | components | 1 | Admin: buttons and states |
| `character-kit.html` | character-kit | 1 | Admin: the 3D character, live specimen |
| `playground.html` | playground | 1 | Admin: "Payday run", a full-screen 3D game, opened as a sheet from the Design system page. No page-transition scripts, no sidebar or tab bar |
| `fridge-advisor.html` | fridge-advisor | 1 | "How much should I invest?": a 3D fridge advisor, not admin only. Opens as a wide flow sheet (iframe) from Overview > Offers > Investment; no sidebar or tab bar, no page-transition scripts |
| `spa-source.html` | | | Old single-page reference, not the runtime. Do not extend |

Depth drives the page transitions (`js/section-build-boot.js`, `js/section-build-motion.js`): deeper pages enter from the right, back goes left.

Registering a new page: see `AGENTS.md` → Conventions (five places).

## Design tokens and styles

- `css/tokens.css`: generated from `designs/tokens/` by `scripts/generate-tokens-css.mjs` (`npm run tokens:build`, also run by `dev` and `build`)
- `css/typography.css`: generated responsive type scale
- `css/styles.css`: every component and page layout, one file
- Icons: one sprite, inlined into each page (`scripts/sync_icons_sprite.py`), used as `<svg><use href="#i-name"/></svg>` so strokes follow `currentColor`

## Theme

- Light and Dark: `data-theme` on `<html>`, from `uzBankWebTheme`, set by the inline boot script before paint. The sidebar segmented control switches it.
- Colour themes (Profile > Theme): the engine is ported from `cartography-lab-app` (`themeColors.ts`), bundled to `js/theme-engine.js` (global `UZBankThemeEngine`, Profile only) from `scripts/theme-engine/`. A save stores the finished `--color-*` tokens for both shells in `uzBankWebColorTokens`; the boot script and the sidebar toggle only apply that cache. No colour maths outside Profile.
- The built-in "UZ Bank" card (and "Reset to theme") clears the override, so the untouched `tokens.css` look applies.
- `--color-fg-interactive` is the interactive ink: equal to `--color-fg` in Monochrome, the primary accent in Multi-color.

## 3D character kit

- `js/profile-persona.js`: User Type sliders → profile (Newbie, All-rounder, Power user) and a part recipe; persists `uzBankWebPersonaProfile`; exposes `window.UZBankPersona`
- `js/profile-persona-character.js`: three.js scene, KayKit Adventurers parts on one shared rig, recoloured to the theme. Modes: Profile (1.5×, interactive), ambient (1× on `AMBIENT_SCREENS`), specimen (`[data-character-specimen]`, Character kit page)
- Assets: `assets/3d/kaykit/` (CC0). Unused KayKit packs live outside the repo, in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/`
- Full documentation: `character-kit.html`
- The Playground reuses the module: `createFigure()` (the character without a scene), `readTheme`, `monochromeLut`, `preparePalette`, `cssColor` and `THREE` are exported

## Other systems

- Playground ("Payday run"): `playground.html`, `js/playground.js` (loop, overlays, input, the still version for reduced motion), `js/playground-config.js` (every tuning number), and small modules for the track (curve and distance lookup, no physics, no raycasts), the town, coins, gates, the chest and the forest. One `InstancedMesh` per model part and one shared, theme-recoloured material per world (about 30 to 50 draw calls). KayKit City Builder Bits and Forest Nature Pack (CC0) in `assets/3d/playground/`. The Design system page opens it as a flow-style sheet (`js/playground-sheet.js`, an iframe). Sound (footsteps timed by the run clip's foot contacts, a coin sound with a rising pitch) through the Web Audio API in `js/playground-audio.js`, samples in `assets/audio/playground/` (Kenney Impact Sounds, CC0). Two storage keys: `uzBankWebPlaygroundBest`, `uzBankWebPlaygroundSound`. Specs: `specs/2026-10-19-payday-run/`, `specs/2026-10-22-playground-sound/`
- Fridge advisor: `fridge-advisor.html`, `js/fridge-advisor.js` (steps, sliders, the formula, the panel), `js/fridge-advisor-config.js` (every tuning number: camera poses, doors, food packing, slider ranges, the step copy) and `js/fridge-advisor-scene.js` (the scene: the kit fridge, boxes for shelves and drawers, food packed in rows, the persona, the theme through the shared helpers from `profile-persona-character.js`). Kenney Furniture Kit and Food Kit (CC0) in `assets/3d/fridge/`, copied to `dist` by a small plugin in `vite.config.js`. Opens as a flow sheet (`js/fridge-advisor-sheet.js`, an iframe, `.modal-shell--wide`). No storage keys. Spec: `specs/2026-10-22-fridge-advisor/`
- Mobile Light/Dark toggle: `js/mode-toggle.js` and a `.view__mode-toggle` button (the small glyph-only button component) in the top bar of the four main screens under 1280px; it uses the same `UZBankApplyThemeChoice` as the sidebar, so no new storage key
- Admin: a demo-only switch (`uzBankAdmin` in `localStorage`), signed in from Profile; credentials in `js/admin.js`. Not security
- Status messages: `js/status-message.js` (component) and `js/status-feed.js` (demo feed, first appearance after 12 s)
- Payment simulation: `js/payment-state.js` (`uzBankWebPaymentState`), reset from Profile
- Analytics hook: `js/analytics.js`; Maze snippet in each page head

## Storage keys

All in `localStorage`, all prefixed `uzBankWeb` (except the admin flag). The list is kept in `apps/web/README.md`; add new keys there.

## Decisions

Settled choices, so they don't get re-argued. Add a row when a decision changes how the app looks or behaves.

| Need | Decision | Notes |
|---|---|---|
| Changing the process | Spec-driven workflow adopted in place on 2026-10-19; the code was not rebuilt | A rebuild would have meant weeks of parity work on a presentable app. The pre-process state is tagged `v1-presentable` |
| Deploy | Deploy = source: GitHub Pages serves `apps/web` as it is (`path: apps/web` in `deploy.yml`), `dist` is never deployed | Assets loaded at run time by a computed URL (3D models, audio) need no copy step in the build |
| Default look | UZ Bank navy on white / white on navy, shown as the built-in "UZ Bank" theme card | Nothing changes until a user picks a theme |
| Light/Dark with colour themes | The sidebar toggle stays; each theme remembers its own Light and Dark contrast | Cached tokens per shell; switching is instant on every page |
| Interactive ink | `--color-fg-interactive` for focus rings, selected states and sliders; follows Cartography for filled primary buttons and active segments | Secondary buttons and nav stay neutral |
| 3D character | three.js with KayKit (CC0), replacing Spline | One rig, mixable parts, theme recolour; documented on `character-kit.html` |
| Character on main screens | 1× in the lower right, behind content, hidden below 62rem except on Profile | Decoration, reads the saved recipe |
| Status message timing | First appearance 12 s after a main view lands; back 8 s after dismissal | Demo pacing |
| Playground placement | A fourth card on the Design system page, admin only, full screen, opened as a flow-style sheet (not a page transition); an easter egg from the avatar may follow later | Not in the customer menu. See `specs/roadmap.md` and D19 in the Payday run spec |
| Playground and reduced motion | A stepped version of still scenes with Next, not a slowed run | The run is a game of movement; a slowed version would still be motion. Same result card and best run |
| Dev server | Port 5175, strict (it fails if the port is taken), listening on the network, `.local` hosts allowed. A phone on the same Wi-Fi opens it through the Mac's `.local` name. Agents use 5199 for their own checks | A fixed URL that docs and the phone can rely on. Anyone on the same network can reach the server while it runs. See `specs/2026-10-22-dev-server-port/` |
| Playground world | No physics library, no raycasts: the runner is (distance along a curve, sideways offset) and pickups are distance checks | Keeps it light and easy to tune; one config file |
| Wide flow sheets | `.modal-shell--wide` on a flow sheet's shell makes it 960dp wide (the main box width) from 1024px, via `--modal-wide-max-width` (default 960px); below that the sheet is unchanged. The page inside decides its columns. First user: the fridge advisor (stage left, steps right) | A reusable modifier of the payment-flow sheet, not a one-off. The iframe is only 960 wide, so the page asks the parent viewport (`matchMedia` on `window.parent`) rather than its own |
| Fridge advisor | A rough guide, not advice: investable = max(0, total assets - one month of spending - reserve for the unplanned - reserve for bigger purchases), where a month of spending is salary minus what is left at month end. Opens as a flow sheet from the Offers list. Nothing is remembered; the scene is the fridge metaphor with the persona, in the theme colours | Klaudiusz confirmed the formula. Item 9 (product opening) continues from "Show suitable products" |

## Guiding rule

Only add a dependency or a new system when a roadmap item needs it, and update this file in the same change.
