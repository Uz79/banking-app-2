# Payday run: plan

Branch: `feature/payday-run`. Decisions are cited as D1 to D18 from `requirements.md`.

Each group ends with something to look at in the browser (`cd apps/web && npm run dev`, `http://localhost:5174/overview.html`, signed in as admin). On the feature branch each group is committed on its own once implementation is approved. Nothing is merged to `main` without an explicit ask.

## 1. Hub card and an empty full-screen page

What you see: a fourth card "Payday run" under Character kit on the Design system page. It slides up as a full-screen sheet over the hub, like the flow screens, with an empty page and a close button on the right; close slides it back down (D19). Signed out, the page redirects to Profile > Admin access.

- [x] `playground.html`: copy the head and boot script from `character-kit.html` (title "UZ Bank – Playground", `admin-boot.js` with `data-guard`, no `section-build-boot.js`), the inline icon sprite block, `body.body[data-screen="playground"][data-page="playground"]`. One `main.main-content` holding `section.view.view--active.view--playground` with the close link `a.view__nav-btn.view__nav-btn--trailing[href="design-system.html"][data-playground-close][aria-label="Close Playground"]` using `#i-x`, and an empty `div.playground-stage` (D5, D6). No sidebar, tab bar or sticky header. Scripts: `analytics.js` and the `js/playground.js` module only; no page-transition scripts and nothing that adds the status message (D19)
- [x] `design-system.html`: fourth `a.ds-hub__card` to `playground.html` ("Payday run", one-line meta, `#i-play`, trailing arrow)
- [x] Register the page (D5, D18): `vite.config.js`; `NAV_DEPTH` in `js/section-build-boot.js` and `js/shell-nav.js`; `ROOT_TAB_BY_SCREEN` in `js/shell-nav.js`; (no `bindMainScrollChrome` entry, D18); `.body[data-screen="playground"]` full-screen rules in `css/styles.css` (100dvh, no scroll, no padding, sidebar and tab bar hidden, close button above the stage)
- [x] `AGENTS.md`: add the full-screen exception to the "new page" rule (no `bindMainScrollChrome` entry for pages without a scroll header)
- [x] Check `npm run build` emits `playground.html`
- [x] Review change (D19): close button on the right; `js/playground-sheet.js` and the sheet markup and CSS on the hub; `js/playground.js` close message

## 2. The runner on a themed stage (character module refactor)

What you see: the Playground page shows the persona character idling on a bare stage in the active theme, and it changes with the User Type set in Profile. Profile, Character kit and Overview look and behave exactly as before.

- [x] `js/profile-persona-character.js`: extract `createFigure()`, export `readTheme`, the lightness-to-theme-hue map and `createFigure`; add `timeScale` to `setLoop`; keep `mountStage` and `init` behaviour identical (see "What changes in the character module")
- [x] `js/playground.js` (ES module): static `import` of the character module (it also re-exports `THREE`, so there is one three.js instance), create the renderer, scene, camera and lights, add the figure, read `UZBankPersona.read()`, play `Idle_A`, resize with the stage, re-apply the theme on `data-theme` and token changes
- [x] `playground.html`: add `js/profile-persona.js` and the module script
- [x] Regression (checked 2026-10-20, see the note below): Profile User Type, Character kit specimen, Overview ambient figure (baseline sections 2, 4, 5)

Note on the regression: all seven pages mounted the figure and reached the ready state, with no errors; the Character kit presets, Light/Dark recolour and running animation, and the Profile slider (character, title, stored value) behaved as before. Not checked in group 2: a Multi-color theme, reduced motion, drag-to-turn, and the phone width. Those are in `validation.md` and the final baseline run.

## 3. Track, camera and steering

What you see: press Space and the figure runs along a curved ribbon track in theme colours with a chase camera; steer with the arrow keys or A/D inside the track width; Escape pauses with Resume and Close. Pace differs for Beat, Lena and Max.

- [x] `js/playground-config.js`: first version of the config object (D10): per-profile speed and `timeScale`, steering response, camera distance, height and lag, track width and length, `maxPixelRatio`
- [x] `js/playground.js`: spline and arc-length table, `(s, x)` player state, ribbon mesh along the curve, chase camera with lag, game states (ready, running, paused), start overlay, pause overlay (D11, D8)
- [x] `css/styles.css`: overlay and HUD base styles with `--color-*` tokens, focus rings on `--color-fg-interactive`
- [x] Keyboard only here; checked in Dark and a Multi-color theme (Light not checked on the running view)

Note: `js/playground-track.js` holds the curve and lookup table (pure maths, used again by the world in group 5). Reduced motion is not handled yet (group 11): the figure holds its pose but the camera and run still move.

## 4. Touch controls and layout at 390px

What you see: on a phone-sized touch device two large Left and Right buttons appear at the bottom and steer while held; the layout works in portrait and landscape.

- [x] Left/Right buttons, shown on `(hover: none) and (pointer: coarse)` (D4); pointer events with capture so a finger sliding off the button still releases; safe-area insets
- [x] Pause on `visibilitychange` and on orientation change
- [x] Checked at 390px portrait and 844x390 landscape in same-origin iframes of that size (the window itself could not be resized); `?touch` shows the buttons on any device, for testing. A real touch device has not been tried

## 5. The town

What you see: the run goes through a town: varied buildings on both sides, lamps, benches, hydrants, parked cars, a water tower, all recoloured to the theme (Light, Dark, a Multi-color theme).

- [x] Copy the proposed City Builder models, texture and `License.txt` to `assets/3d/playground/town/` (list in `requirements.md`)
- [x] `js/playground-world.js`: load models, build one `InstancedMesh` per model, place along the track on both sides with seeded variation, per-pack scale from the config (D12, D14)
- [x] Recolour the shared texture with the exported theme map (D13)
- [x] Log the draw-call count in the console with `?debug` (37 draw calls and about 77,000 triangles with the town, figure and track, desktop, 2026-10-20); record it in `validation.md` when measuring

Note: the town is placed by `js/playground-world.js` (seeded, so it is the same every run), tuned in `CONFIG.world`. The hub and close button got a soft backing so they stay legible over buildings. The app is deployed as source, so the folder URL for the models is resolved at runtime (`@vite-ignore`), which keeps the build free of new warnings.

## 6. Payday burst, coins and the balance

What you see: at the start the salary bursts out as coins; the HUD shows the balance in the app's CHF format; running through coins collects them and the balance ticks up.

- [x] Coins as one `InstancedMesh` in the accent colour; burst at the start (instanced, no per-coin objects); coin layout along the town stretch; pickup by `(s, x)` distance on a flat array (D11, D9)
- [x] HUD: balance via `formatMoney` from `js/payment-state.js` (loaded for the formatter only, state untouched), distance or stage marker
- [x] Coin and burst sizes and counts in the config

Note: the salary is CHF 6'000 split over 100 coins (CHF 60 each), laid out by `js/playground-coins.js` in lines, waves and zigzags along the town. The balance starts at 0 and the salary shows as a toast at the start (D9). `?debug` also logs draw calls. The balance is announced to screen readers every 20 coins, not on every coin. On narrow screens the pace word and the "Balance" label are hidden so the top row fits.

## 7. Gates for rent, groceries and bills

What you see: three labelled gates across the track; passing through each takes its amount off the balance with a clear HUD change.

- [x] Gate meshes (accent frame, label from a canvas texture, one per kind), placed at config distances; deduction on crossing; HUD delta line (D9)
- [x] A short text line in the HUD for each: "Rent", "Groceries", "Bills", with the amount

Note: starting values are rent CHF 1'200 at 105, groceries CHF 400 at 160, bills CHF 500 at 210 (CHF 2'100 of a CHF 6'000 salary). A runner who misses many coins can go below zero at a gate; the balance shows the minus sign. Whether to floor it is for the tuning pass (open question 1).

## 8. The savings chest

What you see: at the end of the town the track runs through a chest; what is left is deposited and the HUD switches from balance to saved.

- [x] Chest mesh built from simple geometry (accent), deposit on crossing, HUD change (D9)
- [x] Transition into the forest stretch

Note: the chest is an arch of two walls and a half-cylinder lid in the accent colour with a lock plate and a "Savings" banner (`js/playground-chest.js`), at distance 240 on the starting config. What is in the balance moves to "Saved" (never below zero). Coins now end at 232 so none are lost after the deposit. `?from=214` starts the run partway along the track, for looking at a later stretch (dev only).

## 9. The forest with growing trees

What you see: after the chest the town gives way to a forest; trees along the track grow stage by stage as you run, and the saved amount compounds with them.

- [x] Copy the proposed Forest Nature models, texture and `License.txt` to `assets/3d/playground/forest/`
- [x] Growth: the `Tree_2_A` to `Tree_2_E` series swapped by instance index and distance (a swap or a scale tween per stage), `Tree_1` series and ground cover for variety; the saved amount grows by the config rate per stage (D9)
- [x] Recolour (D13); resolve open question 2

Note: the forest starts at distance 254 and is cut into 5 stretches ("years"), one tree size up each (`Tree_2_A` to `E`), with the broader `Tree_1` series behind. Trees are seedlings until the runner is 55 units away and full size at 24 (growth follows the runner's distance, no timers; with reduced motion all trees are full size). Entering a stretch grows the saved amount by 20 % (`CONFIG.forest.rate`). Accent on foliage was not used (open question 2: monochrome, accent only on interactive things). The forest and town together are 58 draw calls and about 163,000 triangles in the forest (desktop, `?debug`); culling by distance belongs to group 12. Dev only: `?from=335&money=3000` starts partway with savings.

Tuning after a first full run (2026-10-20): weaving without aiming left the savings at CHF 0 with the first values (rent 1'600, groceries 500, bills 700; growth 15 %), so costs were lowered, growth raised to 20 %, and the coin reach widened. A perfect run now ends near CHF 9'700 (3'900 saved, five stretches at 20 %), a careless one near zero. Still to tune by playing (open question 1).

## 10. Result screen and best run

What you see: at the finish the run ends on a result screen with the final balance, a breakdown, a "New best" badge when it applies, and Play again / Close. The best run survives a reload.

- [ ] Result overlay: balance via `formatMoney`, one line per step, badge, buttons, focus moved into the dialog and returned on close (D2)
- [ ] `uzBankWebPlaygroundBest` read and written with try/catch around `localStorage`; first visit shows no best
- [ ] `apps/web/README.md`: add the key to the storage list

## 11. Reduced motion: the stepped version

What you see: with reduced motion on, the run is a set of still scenes with a Next button, no camera movement and no animation, ending on the same result screen.

- [ ] `matchMedia('(prefers-reduced-motion: reduce)')` switches to the stepped mode at start and reacts live (D15)
- [ ] Scenes for payday, town, gates, chest, forest at final tree size, result; Next and Skip to result as buttons
- [ ] Check no animation is left running anywhere in the mode, including the overlays

## 12. Performance pass and entry point

What you see: smooth play on a throttled phone profile; a "Try it in the Playground" link at the end of Character kit.

- [ ] Dynamic resolution (D16); `maxPixelRatio`; stop rendering when paused or hidden; dispose geometries and textures on leaving
- [ ] Measure: frame time and draw calls on a 4x CPU-throttled desktop run and at 390px; record the numbers and the device in `validation.md`; decide open question 4
- [ ] `character-kit.html`: "Try it in the Playground" link at the end of the page (an `a.uz-btn` to `playground.html`)

## 13. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] Work through `validation.md` in a real browser and fill in its "Checked on" line
- [ ] Run the baseline smoke test (final section of `validation.md`)
- [ ] `specs/roadmap.md`: mark item 2 done
- [ ] `specs/tech-spec.md`: add `playground.html` to the Pages table, a Playground line under "Other systems" (config, world, game module), and a Decisions row for the stepped reduced-motion version
- [ ] `apps/web/README.md`: storage key `uzBankWebPlaygroundBest`, new files and `assets/3d/playground/`
- [ ] `character-kit.html`: update the Assets paragraph to mention that the Playground reuses the module and has its own assets
- [ ] `/changelog`, tidy, commit on the branch; merge to `main` only on an explicit ask
