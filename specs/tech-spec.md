# Technical Spec

Scope: `apps/web`. The other folders (`apps/ios`, `apps/backend`, `packages/`, `designs/`) are supporting material; `designs/tokens/` is the token source.

## Stack

- Vanilla HTML, CSS and JavaScript, multi-page, built with Vite (`npm run dev` on port 5175, `npm run build`)
- Classic `<script>` files for the app shell; ES modules only where a library needs them (the 3D character)
- three.js 0.170 from jsDelivr, loaded only by the 3D character module
- Deployed to Vercel on every push to `main`; other branches get a preview URL. Vercel runs `npm run build` first, so a failing build never deploys

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
| `all-bookings-and-payments.html` | all-bookings | 2 | Executed, pending, recurring (each its own list, filled from `UZBankPayState`), an always-visible search field |
| `details-of-position.html` | details-of-position | 2 | Position chart, buy and sell |
| `account-information.html` | | | Account information overlay content |
| `design-system.html` | design-system | 0 | Admin hub: Motion, Components, Character kit |
| `motion-specimens.html` | motion-specimens | 1 | Admin: motion specimens with live demos |
| `components.html` | components | 1 | Admin: buttons and states |
| `character-kit.html` | character-kit | 1 | Admin: the 3D character, live specimen |
| `playground.html` | playground | 1 | Admin: "Payday run", a full-screen 3D game, opened as a sheet from the Design system page. No page-transition scripts, no sidebar or tab bar |
| `fridge-advisor.html` | fridge-advisor | 1 | "How much should I invest?": a 3D fridge advisor, not admin only. Opens as a wide flow sheet (iframe) from Overview > Offers > Investment; no sidebar or tab bar, no page-transition scripts |
| `investment-opening.html` | investment-opening | 1 | "Open asset management": the opening flow, loaded into the fridge's sheet by "Show suitable products" (the sheet narrows to 640). Works on its own with its own header; no sidebar or tab bar, no page-transition scripts |
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
- Fridge advisor: `fridge-advisor.html`, `js/fridge-advisor.js` (steps, sliders, the formula, the panel), `js/fridge-advisor-config.js` (every tuning number: camera poses, doors, food packing, slider ranges, the step copy) and `js/fridge-advisor-scene.js` (the scene: the kit fridge, boxes for shelves and drawers, food packed in rows, the persona, the theme through the shared helpers from `profile-persona-character.js`). Kenney Furniture Kit and Food Kit (CC0) in `assets/3d/fridge/`, copied to `dist` by a small plugin in `vite.config.js`. Opens as a flow sheet (`js/fridge-advisor-sheet.js`, an iframe, `.modal-shell--wide` and `.modal-shell--fixed-height`, 960 x 640). The 3D stage fills the sheet body and the steps sit in a `.float-panel` on the right, docked at the bottom below a 640px page; the camera frames each pose in the area the panel leaves free (`setFree` in the scene, three.js `setViewOffset`). Its only stored value is the amount it hands to the opening (in the opening's draft). Specs: `specs/2026-10-22-fridge-advisor/`, `specs/2026-10-29-fridge-film/`
- Investment opening: `investment-opening.html`, `js/investment-opening.js` (screens, option groups, the recommendation, navigation, the summary edits, completion) and `js/investment-opening-config.js` (every screen, question, option, score and line of copy). It runs in the fridge's sheet: the sheet (`js/fridge-advisor-sheet.js`) owns Back, the title and close, and the page in the frame sets the width and title by `postMessage` (`uzbank:sheet-layout`, `uzbank:sheet-title`). At 640 the sheet has one fixed height (`.modal-shell--fixed-height`) and no step scrolls; long content opens in place (one risk question at a time, "What counts?", the information sheets). Answers live in a session draft (`uzBankWebOpeningDraft`, sessionStorage); with a draft past the intro, Investment resumes the opening. Completion adds a mandate to the payment state. Spec: `specs/2026-10-29-investment-opening/`
- Mobile Light/Dark toggle: `js/mode-toggle.js` and a `.view__mode-toggle` button (the small glyph-only button component) in the top bar of the four main screens under 1280px; it uses the same `UZBankApplyThemeChoice` as the sidebar, so no new storage key
- Admin: a demo-only switch (`uzBankAdmin` in `localStorage`), signed in from Profile; credentials in `js/admin.js`. Not security
- Status messages: `js/status-message.js` (component) and `js/status-feed.js` (demo feed, first appearance after 12 s)
- Payment simulation: `js/payment-state.js` (`uzBankWebPaymentState`: payments, bookings and the asset management mandates), reset from Profile
- Analytics hook: `js/analytics.js`; Maze snippet in each page head

## Storage keys

All prefixed `uzBankWeb` (except the admin flag), all in `localStorage` except the opening's draft (`uzBankWebOpeningDraft`), which lives in `sessionStorage` for the tab. The list is kept in `apps/web/README.md`; add new keys there.

## Decisions

Settled choices, so they don't get re-argued. Add a row when a decision changes how the app looks or behaves.

| Need | Decision | Notes |
|---|---|---|
| Changing the process | Spec-driven workflow adopted in place on 2026-10-19; the code was not rebuilt | A rebuild would have meant weeks of parity work on a presentable app. The pre-process state is tagged `v1-presentable` |
| Deploy | Deploy = source: Vercel serves `apps/web` as it is (preset Other, root `apps/web`, output `.`), `dist` is never deployed. The build command `npm run build && rm -rf dist node_modules` is only a gate: it removes `dist` and `node_modules` so they are not published | Assets loaded at run time by a computed URL (3D models, audio) need no copy step in the build |
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
| Wide flow sheets | `.modal-shell--wide` on a flow sheet's shell makes it 960dp wide (the main box width) from 1024px, via `--modal-wide-max-width` (default 960px); below that the sheet is unchanged. The page inside decides its layout. First user: the fridge advisor (since 8d the stage fills the sheet and the steps float on it) | A reusable modifier of the payment-flow sheet, not a one-off. The iframe is only 960 wide, so the page asks the parent viewport (`matchMedia` on `window.parent`) rather than its own |
| Fridge advisor | A rough guide, not advice: investable = max(0, total assets - one month of spending - reserve for the unplanned - reserve for bigger purchases), where a month of spending is salary minus what is left at month end. Opens as a flow sheet from the Offers list. Nothing is remembered. Total assets starts at the Household + Savings running balances (read, never written), with a note that it means liquid assets only (8c, D28 to D30); the scene is the fridge metaphor with the persona, in the theme colours | Klaudiusz confirmed the formula. The opening (9a) continues from "Show suitable products" in the same sheet |
| Fixed-height flow sheets | `.modal-shell--fixed-height` gives a flow sheet one height from 1024px, `clamp(480px, 60vh, 640px)`, whatever the step holds, with the action pinned at the bottom. A page that uses it keeps every step within that height (no scrolling inside the sheet; content opens in place instead) | Decided 2026-10-29 (9a D26, D27). Users: the investment opening and, since 8d, the fridge, so the hand-over to the opening only changes the width |
| Floating panel | `.float-panel` (in `css/styles.css`, on the Components page): a frosted panel over a scene, after the cartography app's HUD panels. The fill is the background at 70% with an 8px blur, a 1px rim and a soft shadow in Light only, all from the colour tokens through custom properties (`--float-panel-fill`, `--float-panel-blur`, `--float-panel-highlight`, `--float-panel-shade`, `--float-panel-shadow`, `--float-panel-padding`). `.float-panel--docked` docks it at the bottom edge with the safe-area inset. Solid with reduced transparency or more contrast; denser without blur support. No noise texture | Decided 2026-10-29 (8d D5 to D7). First user: the fridge, whose steps float on the right of the 3D stage from a 640px page and are docked below it |
| Investment recommendation | Three risk questions scored 0 to 3 each (0 to 9 in all), mapped to the five strategies (0 to 1 Income, 2 to 3 Conservative, 4 to 5 Balanced, 6 to 7 Growth, 8 to 9 Dynamic), then capped: no riskier than Conservative for a horizon under 3 years, than Balanced for 3 to 5 years or no knowledge. A more careful strategy can be chosen, a riskier one cannot | A placeholder for the bank's rules (9a D12), all numbers in `js/investment-opening-config.js` |
| Opened products | A completed opening is a mandate in the payment state (`mandates`: strategy, amount, date), shown on Overview after Retirement savings 3a as "Pending" and not counted in the total; the demo reset clears it. Nothing is funded yet | 9a D21, D22. Funding is roadmap item 18 |
| Search pattern | An inline search field filters the current view; a Search button opens a separate search view or flow (like the payment recipient search) | Decided 2026-10-25. First user: All bookings (`specs/2026-10-25-all-bookings-real/`) |
| Light/Dark outside `app-mp.js` | A page that does not load `js/app-mp.js` (the Playground) switches the mode with `setMode` in `js/playground-settings.js`, which mirrors `UZBankApplyThemeChoice` (cached tokens, `data-theme`, `uzBankWebTheme`); the sheet's parent follows by `postMessage` | Decided 2026-10-26. `specs/2026-10-25-playground-settings-dialog/` |
| Visitor analytics | Vercel Web Analytics, loaded by `js/analytics.js` on `banking-app-2-bay.vercel.app` only; source entry paths are rewrites in `apps/web/vercel.json` (one segment); `?analytics=off` or `on` sets or clears `uzBankWebAnalyticsOff` | Decided 2026-10-26. `specs/2026-10-26-web-analytics/` |

## Guiding rule

Only add a dependency or a new system when a roadmap item needs it, and update this file in the same change.
