# Payday run: requirements

Branch: `feature/payday-run`

Roadmap item 2 (`specs/roadmap.md`). A small 3D game on its own design system page, showing what the character kit can do beyond the app.

## Scope

**In (the whole story, built in order, D1):**

1. A fourth card on the Design system hub that opens a full-screen `playground.html` as a flow-style sheet, with a close button on the right, admin only
2. The persona character as the runner, paced by its profile
3. A spline track, chase camera, keyboard and touch steering
4. Payday burst: the salary lands as a coin burst at the start
5. A small town with coins to collect
6. Gates for rent, groceries and bills
7. A savings chest that takes what is left
8. A forest where trees grow along the track (compound growth)
9. A result screen: balance in the app's CHF format, a breakdown, the best run kept
10. A calm, still alternative for reduced motion
11. A "Try it in the Playground" link at the end of `character-kit.html`

**Out (not in this branch):**

- Sound (D3)
- The easter egg entry from the avatar on the main screens (roadmap item 3)
- Any connection to the real demo balance: the game never reads or writes `uzBankWebPaymentState`
- Tilt or swipe steering (D4)
- A second level, a leaderboard, difficulty settings

**Agreed before this spec (roadmap), confirmed and not re-opened:** placement (fourth hub card, full screen, close button; changed at review, see D19), player (the persona character, profile sets the pace), mechanics (spline track, no physics library, no raycasts, steer within the track width, chase camera, instanced effects), story, look (the world takes the active colour theme), assets (the two KayKit packs, CC0), tuning (one config object), performance (60 fps on a mid-range phone, few draw calls).

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | The whole story is in v1, built in story order so each task group is reviewable. The last two beats (chest, forest) can be cut at review without breaking the run | Interview. The compound-growth forest is the point of the story |
| D2 | The result screen shows the final balance (CHF, Swiss format via `formatMoney` in `js/payment-state.js`), one line per step (salary, rent, groceries, bills, saved, forest growth), a "New best" badge, and Play again / Close. The best run is kept in one new key, `uzBankWebPlaygroundBest`, JSON `{ "balance": number, "date": "YYYY-MM-DD" }`, listed in `apps/web/README.md` | Interview. One key, prefixed `uzBankWeb` as AGENTS.md requires. Best is compared on balance only |
| D3 | No sound in v1 | Interview. Avoids autoplay and mute rules, adds no files and no storage key. A follow-up can add it |
| D4 | Touch: two large on-screen buttons (left, right), hold to steer, shown only on `(hover: none) and (pointer: coarse)`. `?touch` in the URL shows them on any device, for testing. Keyboard: arrow keys or A/D to steer, Space or Enter to start and restart. Escape pauses while running and closes the game from the start, pause and finish screens, like the flow screens (changed at review: it first resumed from pause). No swipe, no tilt | Interview. Buttons match the keyboard one to one, are discoverable and need no gesture. Tilt needs a permission prompt on iOS and is hard to make accessible |
| D5 | New page `playground.html`, `data-screen="playground"`, depth 1, root tab `design`. Registered in the places from AGENTS.md that apply to a full-screen page (see Context and D18). Admin only: `js/admin-boot.js` with `data-guard` | Same as `character-kit.html`. Depth 1 under the hub (depth 0) gives the "back" motion on close, which is what the roadmap asks for |
| D6 | The page is full screen: no sidebar, tab bar, sticky header or status message. The only chrome is the close button (top right, D19) and the HUD. The `.body[data-screen="playground"]` layout rules are new, not a copy of a neighbour's | AGENTS.md says to copy the closest page's rules; no existing page is full screen, so this is a deliberate exception |
| D7 | The persona module is reused, not forked. `js/profile-persona-character.js` is refactored so the figure can be created inside any three.js scene (see "What changes in the character module"). `mountStage` keeps exactly today's behaviour | Roadmap: "reuse the module, don't fork it". A fork would drift from the kit |
| D8 | Pace by profile uses the three clips that exist (`Idle_A`, `Walking_A`, `Running_A`), no new animation files. Beat jogs: `Running_A` at a lower `timeScale` and lower speed. Lena runs: `Running_A` at 1×. Max sprints: `Running_A` at a higher `timeScale` and higher speed. The rig has no sprint clip | Avoids new assets. Speed and `timeScale` are config values (D10) |
| D9 | Game rules, as starting values to be tuned (all in config): the player starts with the salary, which bursts out as coins that must be collected on the way (collected coins add to the balance); each gate spans the full track width and takes a fixed amount (rent largest, then bills, then groceries) and cannot be dodged; at the chest the remaining balance is deposited automatically; in the forest each tree stage adds a growth rate to the saved amount, one stage per fixed stretch of track. The forest has no coins and no obstacles | Keeps the skill element to steering for coins, with no collision physics (roadmap). Marked for review because the roadmap leaves the rules open |
| D10 | One config object in `js/playground-config.js` (ES module): speeds per profile, steering response, camera distance and lag, track length and width, coin values and counts, gate amounts, chest rate, growth rate and stage length, effect sizes, world scale per pack, `maxPixelRatio`. Starting values in the first commit that uses them | Roadmap: feel is tuned by changing numbers |
| D11 | Track: a `CatmullRomCurve3` through control points, sampled once into an arc-length lookup table. The player is `(distance s, lateral offset x)`; position is the curve point plus the normal times `x`, `x` clamped to the track width. Coins and gates are flat arrays compared by `(s, x)`: no raycasts, no physics. The road is a generated ribbon mesh along the curve, so the packs' road tiles are not used | Roadmap mechanics. Tiles would not follow a spline |
| D12 | The world is built from instanced meshes: one `InstancedMesh` per model, merged where possible, so the whole scene stays at a few dozen draw calls. Shadows only for the figure (as in the kit); the world has none | 60 fps on a mid-range phone |
| D13 | The world takes the active theme the way the character does: the pack textures go through the same monochrome lightness-to-theme-hue map (shared helper exported from the character module), and one accent (`--color-fg-interactive`) is used for coins, gates and the chest. Re-applied when `data-theme` or the colour tokens change | Roadmap look; Mission principle 3 (colour is spent in one place) |
| D14 | Assets are copied from the packs as `.gltf` + `.bin` + the shared texture PNG, no conversion tool, into `assets/3d/playground/` with each pack's `License.txt`. About 1.0 MB in total (list below). `GLTFLoader` already ships with the character module's three.js import, so no new runtime dependency | No new dependency; CC0. A single-file GLB pack step is an optional later optimisation |
| D15 | Reduced motion gives a stepped, still version, not a slowed one: the run becomes a sequence of still scenes (payday, town, gates, chest, forest, result), each with a Next button; the figure holds `Idle_A`, the camera does not move, no burst, no growth animation (trees show their final size for the step), numbers update with a plain fade or none | Roadmap: "a calm, still alternative". Decided here because the roadmap does not define it; open to change at review |
| D16 | Dynamic resolution: if the frame time stays above budget for about a second, the pixel ratio steps down (floor 1), never back up in the same run | Cheap safety net for phones, no extra dependency |
| D17 | The game state is in memory only. Nothing is stored except the best run (D2). Closing the page mid-run discards the run | Simulation, not backend (Mission principle 6) |
| D18 | `'playground'` is not added to the `bindMainScrollChrome` list in `js/app-mp.js`: that list only wires the scroll-edge header, and a full-screen page has none. `AGENTS.md` records the exception in its "new page" rule | Review decision. A no-op entry would only mislead the next reader |
| D19 | Review change: the close button is on the right, and the page opens and closes like the flow screens, not with the page transition. The hub card opens `playground.html` in an iframe inside a full-screen sheet (`js/playground-sheet.js`, `.modal-overlay--playground`) that reuses the payment flow's classes and timing: slides up 0.35 s ease-out with the scrim fading in, and closes by sliding down 0.28 s ease-in. The iframe is created on open and removed after the close, so the WebGL context only lives while the sheet is open. The page closes by `postMessage` (`js/playground.js`). Opened directly (or from the Character kit link later), the close button is a plain link to the hub. `playground.html` therefore does not load the page-transition scripts (`section-build-boot.js`, `section-build-motion.js`, `shell-nav.js`, `nav-button-motion.js`). The NAV_DEPTH and ROOT_TAB entries stay, so other pages that link to it pick the right direction | The page transition (tectonics) is a page-to-page pattern and cannot show the hub underneath; the flow sheet can. An iframe keeps `playground.html` a real registered page |
| D20 | Review change: the screen's primary button takes focus when a screen opens (so Enter and Space work) but its focus ring stays hidden until a key is pressed (`data-quiet` on the overlay, cleared when Tab is pressed, set again on `pointerdown`; Escape, Enter and the steering keys leave it hidden). Keyboard focus is still visible once Tab is used | A script-focused button showed the ring to touch and mouse users |
| D21 | Review change: the touch steer buttons use the foreground ink for the arrows and the separator ink for the circle outline; held state fills with the separator ink. Size 64 dp (was 88), icon the standard 24 dp with `fill: none` (the default black fill drew a rectangle inside the stroked arrow). The right arrow does not nudge: the shared Arrow nudge rule excludes `.playground-touch__btn` | Neutral controls over the scene; the accent stays on coins, gates and the chest |
| D22 | Review fix: the Design system hub's Components icon gets `fill: none` like the other hub icons (stroke icons filled in and looked broken, most visibly in Light) | Consistency with the other hub cards |
| D23 | Review change outside the Playground: the admin sign-in error follows the Figma TextField, Case = Error (`321:1230263`): error stroke on the control, `alert-triangle` icon and message in the field's own `.form-field__error-row` under the password field, label unchanged. `.admin-login__error` is removed; dark mode uses the same pink as before | The dialog used a separate paragraph that did not match the design system's text field |
| D24 | Review change: one confirmation dialog replaces the "Paused" dialog, for Escape, the close button (top right) and an automatic pause (tab switch, rotation). Title "Quit this run?", text "Your progress in this run will be lost. Your best run stays saved.", secondary "Keep playing" (closes it, the run resumes), primary "Quit run" (leaves the Playground like the close button did). The run pauses while it is open; focus starts on "Keep playing" with its ring hidden until Tab (`data-quiet` on the dialog, as in D20); Escape inside the dialog means Keep playing. It reuses the app's existing confirmation dialog (`js/payment-exit-confirm.js`, the "Dismiss process?" pattern, which needs `js/dialog-focus.js` beside it), extended with three optional settings (`stayLabel`, `onStay`, `escapeStays`) that the payment flows do not set, so their behaviour is unchanged. It only appears while a run is in progress (running, paused, or the still scenes); on the start and result screens Escape and the close button leave straight away, since nothing is lost there. The dialog's own "Close" link on those two screens is unchanged. D4 and the earlier Escape wording are superseded | One confirmation for every way out, and no second dialog pattern. The start and result screens have no progress, so asking there would only be friction. Automatic pauses use the same dialog because the "Paused" dialog is gone; open to change at review |
| D25 | Review change: the Playground's start, result and still-scene card follows the design system's confirmation dialog: buttons in the order secondary then primary (Close, Skip to result, then Start, Next or Play again) on every screen size; the same title size (`--fs-text-lg`, medium), message style, padding, border and width (22.5rem) as `.basic-dialog-payment-exit`; and on mobile and tablet (under 1280px) it sits at the bottom as a sheet with the same slide-in, with no animation under reduced motion. Desktop (1280px and up) stays centred. The still scenes keep their own placement | One dialog language in the app; the card had its own larger title and a different button order |
| D26 | Review change outside the Playground: the Design system hub cards take the app's state tokens, `--color-surface-state-hover` and `--color-surface-state-pressed`, and gain the pressed state they lacked. The tokens are translucent, so they are drawn as an inset `box-shadow` layer over the card (animated like before, 0.15 s) rather than as a background, which would show the page through. The old hover was a hand-rolled `color-mix` of `--color-bg` and `--color-fg` | The cards were the only tappable surface on that page without the shared hover and pressed inks |

## What changes in the character module

Read in full: `js/profile-persona-character.js` (619 lines), `js/profile-persona.js` (363 lines), and the Character kit page.

Today everything lives inside `mountStage(stage, opts)`: renderer, scene, camera, lights, floor, loading of five character GLBs plus the two animation GLBs, palette preparation and recolour, slot mounting, the recipe squash tween, the animation loop, drag-to-turn, scroll turn, and the render loop. Nothing is exported, and the file runs `init()` on load. The Playground needs the figure and the recolour inside its own scene and camera.

Required change (and nothing else):

1. Extract lines ~217 to ~424 (loading, `preparePalette`, `recolour`, `dyeCells`, `mount`, `setRecipe`, tween runner, `syncHairAccent`, `setLoop`) into an exported `createFigure()` returning `{ actor, setRecipe(recipe, animate), setLoop(name, { timeScale }), applyTheme(theme, force), update(dt), ready }`. `mountStage` calls it and keeps its floor, lights, camera, drag, scroll turn and render loop unchanged.
2. `setLoop` gains an optional `timeScale` (D8). Default behaviour is unchanged.
3. Export `readTheme()` and the monochrome lightness-to-theme-hue map so the world can reuse them (D13), with no change to how the figure is coloured.
4. Export these as named ES exports. `init()` stays, but is a no-op on `playground.html` (no specimen, no profile panel, `playground` is not in `AMBIENT_SCREENS`), so importing the module there does not mount anything. The Playground must not be added to `AMBIENT_SCREENS`.

`profile-persona.js` is not changed. The Playground reads the profile with `UZBankPersona.read()` (`profile`, `name`, `recipe`), so it needs that script on its page.

This touches a module used by Profile, Character kit and five ambient screens, so the baseline smoke test sections 2, 4 and 5 are re-run after task group 2 and again at the end.

## Assets: proposed models

Source (read-only): `~/Documents/Projects/AI Portfolio Projects/Design System/_resources/`. Each pack ships `obj`, `fbx`, `fbx (unity)` and `gltf` folders; only `gltf` (+ `.bin`) is used. Sizes are `.gltf` + `.bin` bytes. Roads and bases are not needed because the track is a generated ribbon (D11).

**City Builder Bits 1.0** (41 models in the pack, one shared texture `citybits_texture.png`, 19,885 bytes). Proposed 17:

| Models | Use | Size |
|---|---|---|
| `building_A_withoutBase` to `building_H_withoutBase` (8) | The town, in varied heights (1.5 to 2.95 units) | 480,638 B |
| `streetlight`, `bench`, `bush`, `firehydrant`, `trash_A`, `trafficlight_A` | Street dressing along the track | 70,644 B |
| `watertower` | Landmark before the chest | 11,333 B |
| `car_taxi`, `car_sedan` | Parked cars as dressing (the heaviest two at about 1,200 triangles each; drop if the draw budget needs it) | 135,888 B |
| `citybits_texture.png` | Shared texture | 19,885 B |
| **Town total** | | **718,388 B (0.69 MB)** |

**Forest Nature Pack 1.0** (105 models, one shared texture `forest_texture.png`, 48,679 bytes). The trees come in size series by suffix; the bounding boxes confirm the order (to be checked by eye when the models are first on screen). Proposed 14:

| Models | Use | Size |
|---|---|---|
| `Tree_2_A_Color1` to `Tree_2_E_Color1` (5) | The growth series: 4.7 to 8.8 units tall, 336 to 1,560 triangles | 119,552 B |
| `Tree_1_A_Color1` to `Tree_1_C_Color1` (3) | A second, broader species, three stages | 91,979 B |
| `Tree_4_A_Color1`, `Tree_Bare_1_A_Color1` | A tall narrow tree and a bare one for the forest edge | 30,440 B |
| `Bush_1_A_Color1`, `Bush_2_A_Color1`, `Rock_1_A_Color1`, `Grass_1_A_Color1` | Ground cover | 20,482 B |
| `forest_texture.png` | Shared texture | 48,679 B |
| **Forest total** | | **311,132 B (0.30 MB)** |

**Both together: 1,029,520 B, about 1.0 MB**, on top of the 1.6 MB already in `assets/3d/`. Scale is not shared between the packs (a forest tree is 4 to 9 units, a town building 1.5 to 3, the figure about 2.65), so each pack gets a scale factor in the config (D10). Per-model triangle counts are small (largest 2,228), so draw calls, not triangles, are the budget.

**Changed during the build:** `Grass_1_A_Color1` was dropped (flat blades looked wrong at game scale), so the forest has 13 models. As copied into `assets/3d/playground/`, the town is 718,388 B, the forest 306,018 B, both together 1,024,406 B (about 0.98 MB), plus the two `LICENSE.txt` files.

## Context

- Registering a new page (AGENTS.md, five places) maps to:
  1. `vite.config.js`: add `playground: resolve(dir, 'playground.html')` to `build.rollupOptions.input`
  2. `NAV_DEPTH` in `js/section-build-boot.js` (line 15) and `NAV_DEPTH` in `js/shell-nav.js` (line 36): `'playground.html': 1`
  3. `ROOT_TAB_BY_SCREEN` in `js/shell-nav.js` (line 22): `playground: 'design'`
  4. The screen list in `bindMainScrollChrome`, `js/app-mp.js` line 497: not needed for this page (D18)
  5. `.body[data-screen="playground"]` rules in `css/styles.css` (D6). The existing blocks that list `design-system`, `components`, `character-kit` are at lines 526, 630, 1042, 1057, 1104, 1135, 4700 and 4736; the Playground has no sticky header, so it needs its own full-screen rules rather than being added to those lists
- The icon sprite is embedded into every `*.html` in `apps/web` by `scripts/sync_icons_sprite.py` (glob), so `playground.html` needs the `uzbank-icon-defs` block and is then kept current automatically. Icons needed exist already: `i-x` (close), `i-play` (hub card), `i-arrow-right`.
- Hub cards live in `design-system.html` at lines 2378 to 2397 (`a.ds-hub__card`, styles at `css/styles.css` 9458). The new card goes under Character kit.
- Every shell page carries the same inline boot script in `<head>` (`scripts/boot-inline-theme.html`); `playground.html` copies it unchanged.
- Flow sheets: `.modal-overlay` and `.modal-shell` (`css/styles.css` from line 2340) and `openModalVisual` / `closeModal` in `js/payment-overlay.js` are the pattern D19 copies.
- The Character kit page loads the character module as `<script type="module">` (line 2682); the Playground imports it from `js/playground.js` instead of via a tag.
- `localStorage` keys in use are listed in `apps/web/README.md` lines 52 to 59; `uzBankWebPlaygroundBest` is added there.
- No em dashes in user-facing text (HUD, result screen, hub card, ARIA labels). English, short, plain.
- Colours only through `--color-*` tokens; the three.js scene reads them the way `readTheme()` does. The accent is `--color-fg-interactive`.

## Open questions (resolve during the build, record the answer here)

1. Starting values for D9 (gate amounts, coin value and count, chest and growth rates). The goal is a run that lands between roughly CHF 5'000 and 12'000 so improvement is visible; settle by playing.
2. Whether the forest foliage should take the accent on its texture cells (as the kit does for cloth) or stay monochrome with the accent only on coins, gates and the chest. Default: monochrome, accent only on the interactive things (Mission principle 3).
3. Whether the stepped reduced-motion version (D15) should keep a "Skip to result" shortcut. Default: yes, as a plain button.
4. Whether the two parked cars stay in (D14 table) once draw calls are measured.
