# Vehicles in the Character kit (9c): requirements

Branch: `feature/character-kit-vehicles`

Roadmap item 9c (`specs/roadmap.md`). The five investment strategies of the opening (9a) each get a way of travelling, faster and riskier as it goes up: Income = tent (hiking), Conservative = tricycle, Balanced = Vespa, Growth = parachute, Dynamic = jetpack (agreed before the 9 specs). Before a flow uses them (9d), the design system shows them: the models prepared, recoloured to the theme, sized to the persona, and shown with the persona in a matching pose on `character-kit.html`, with a credits section for the CC-BY models.

## Scope

**In:**

1. The five vehicle models in `assets/3d/vehicles/`, renamed and pruned to the five used; the Vespa converted from OBJ to GLB (D2, D3)
2. A small module that loads a vehicle, sizes and turns it to the persona, recolours it to the theme and poses the persona on or beside it (D4 to D8)
3. A new "Vehicles" section on the Character kit page: one 3D stage with the persona and the chosen strategy's vehicle, a strategy picker (Income to Dynamic) beside it, and the recipe shown like the live specimen's (D1, D9, D10)
4. The persona's poses: a hand-built sit (tricycle, Vespa), the pack's `Jump_Idle` (parachute, jetpack), standing in `Idle_A` (tent) (D5, D6)
5. A small idle per vehicle: the jetpack hovers, the parachute sways, the rest stand still; reduced motion holds everything still (D7)
6. A "Credits" section on the Character kit page naming every CC-BY model shipped, with the tent as a courtesy line (D11, D12)

**Out (not in this branch):**

- Any change to the opening's strategy screen, its cards or its copy (9d)
- Airplane, Motorcycle, Raft, Donkey, White Horse and the Farm Animals: not copied into the repo, not credited (interview)
- Travel motion: turning wheels, a scrolling ground, drifting, flames (9d if wanted)
- Any change to the persona's recipe, parts, recolour or the live specimen's controls
- A public credits page: the Character kit page is admin only, which is enough while only that page shows the models; 9d must give the credits a place a customer can reach (D12)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One stage, a strategy picker** (interview): a new section "Vehicles" after "The helper", with one 3D stage card on the left and the controls on the right, the same grid as the live specimen (`.ck-specimen`). The picker is a segmented control with the five strategies in order (Income, Conservative, Balanced, Growth, Dynamic), wrapping on a phone; below it a `pre` with the current entry, e.g. `{ strategy: 'balanced', vehicle: 'vespa', pose: 'sit', idle: 'none' }`, and a short table of all five | Interview. One WebGL context more on the page (the specimen and the helper already have one each), drawn only while on screen |
| D2 | **Assets:** `assets/3d/vehicles/` holds `tent.glb`, `tricycle.glb`, `vespa.glb`, `parachute.glb`, `jetpack.glb`, copied from `_resources/261028_product-opening/3d-models/poly-pizza_models-various/` and renamed, plus `CREDITS.md` with each model's author, licence and Poly Pizza link. Nothing else from that folder is copied. Loaded at run time by URL, so nothing to copy into `dist` (tech-spec, Deploy = source) | Roadmap: "Copy only the models used". About 2.8 MB in all; the parachute (1.2 MB, a texture inside) is the largest |
| D3 | **The Vespa is converted once**, OBJ and MTL to GLB, with Blender's command line (`/Applications/Blender.app`, background mode, the default glTF exporter), and the result committed. The command is written in `assets/3d/vehicles/CREDITS.md`. No build step and no converter in the repo | It is the only OBJ, and it never changes. A committed GLB keeps Deploy = source |
| D4 | **The vehicle module:** `js/character-vehicles.js` exports `mountVehicles(box, { reduced, active })`, returning `{ show(strategy), wake() }`, built like `mountHelper` in `js/opening-assistant-helper.js` (own small stage, lights and shadow as the persona's stage, theme follow-up on `uzbank:theme-change`-style events the helper already listens to). It uses `createFigure()` for the persona with the saved recipe (as on Overview). Every number lives in `js/character-vehicles-config.js`: per strategy the file, a scale so the vehicle reads at its real size beside a 1.8 m figure, a position and yaw, the persona's offset and pose, the idle, and the camera framing | Same shape as the helper and the fridge (one config to tune by eye, fridge D7). 9d can reuse the module and the config |
| D5 | **Sit, built by hand** (interview: the pack has no sit clip): `Idle_A` plays, and after each mixer update the hips are lowered and the legs bent to a seated pose by setting `upperleg.l/.r` and `lowerleg.l/.r` rotations from the config (`sit: { hips, upperLeg, lowerLeg, feet }`). The arms keep the idle; if they float through the handlebars, the config may also set `upperarm`/`lowerarm` toward the grips. Used for the tricycle and the Vespa | Interview. No new clip to source or license; the numbers are tuned by eye like every other pose |
| D6 | **Flying uses `Jump_Idle`** (the mid-air hold, legs tucked) from KayKit's `Rig_Medium_MovementBasic.glb`, looped, for the parachute (hanging under the canopy, the harness at the shoulders) and the jetpack (on the back). It is added to the repo by extending `scripts/build_kaykit_helper.py` to also write `assets/3d/kaykit/rig-medium-ride.glb` (that one clip, no meshes); the persona's existing files stay as they are. The tent's persona stands beside it in `Idle_A` | Interview. Same pipeline as the helper's `Interact` (9b D19): the full pack stays outside the repo |
| D7 | **A small idle each** (interview): the jetpack (with the persona) bobs up and down, about 0.06 of the figure's height over 2 s; the parachute (with the persona) sways about 4 degrees over 3 s; the tent, tricycle and Vespa stand still while the persona's clip or pose plays. Reduced motion (system or `?reduced`): no bob, no sway, the clip held still, a switch is instant | Interview. Shows the vehicles are alive without suggesting speed or return. AGENTS.md: every animation has a reduced-motion path |
| D8 | **Colour: monochrome, like the fridge.** Every vehicle material's colour (or texture, for the parachute) goes through the theme's monochrome ramp (`monochromeLut`, `preparePalette` for the texture, the same lightness law as the fridge's food); the vehicles take no accent. The persona keeps its own accent, so the colour is still spent in one place | Mission principle 3. Roadmap: "recoloured to the theme like the fridge and the food". An accent on the vehicle would compete with the persona's |
| D9 | **Switching** a strategy plays the kit's part-swap squash on the whole group (persona and vehicle: out 168 ms, swap, spring back 420 ms, the curves in the Motion table); the persona's pose cross-fades in the same swap. Picks made during a swap wait, only the latest counts (as the specimen's recipe). Reduced motion: instant | Reuses a motion the page already documents rather than inventing one |
| D10 | **Framing:** a fixed three-quarter view (turned 30 degrees toward the viewer's left, as the persona's rest pose); the camera fits each vehicle with its persona (the parachute's canopy is the tallest, the jetpack the highest off the ground) with one config entry per strategy. No drag to turn | Each vehicle reads from one angle chosen by eye; dragging adds little on a reference page and is not asked for |
| D11 | **Credits** (interview: only the models shipped): a new "Credits" section after "Assets" listing Tricycle and Parachute by Poly by Google, Jetpack by Roman Miller and Vespa by Jasmine Roberts, each CC-BY via Poly Pizza with a link to its page and the licence; the Tent by Quaternius (CC0) as a courtesy line. The "Assets" section gains a line for `assets/3d/vehicles/` | CC-BY requires attribution where the work is used. Roadmap: the credits must be live before any CC-BY model reaches `main` |
| D12 | **Credits stay on the admin page for 9c.** The Character kit page is the only place showing the models, so attribution there is where the work is used. 9d puts the models in the customer's opening; it must give the credits a place a customer can reach (noted in 9d on the roadmap) | Keeps 9c in scope while making sure the gap is not forgotten |
| D13 | **Files:** `assets/3d/vehicles/` (D2, D3), `assets/3d/kaykit/rig-medium-ride.glb` and `scripts/build_kaykit_helper.py` (D6), `js/character-vehicles.js`, `js/character-vehicles-config.js`, `character-kit.html` (the two sections, styles in its own `<style>` like the other `ck-` rules). No new page, storage key or runtime dependency | Small, contained diff (AGENTS.md) |

## Context

- `js/profile-persona-character.js`: `createFigure({ reduced })` returns `{ actor, mixer, setRecipe, setLoop, recolour, update }`. Its clips come from `rig-medium-general.glb` (`Idle_A`) and `rig-medium-movement.glb` (`Running_A`, `Walking_A`); a third file needs the clip list widened or the clip handed to the module's mixer directly. The rig's bones include `hips`, `upperleg.l/.r`, `lowerleg.l/.r`, `foot.l/.r`, `upperarm`, `lowerarm`. `update(dt)` skips the mixer with reduced motion, so the sit override must also run once on a still frame.
- `js/opening-assistant-helper.js`: `mountHelper` is the pattern for a small own stage (renderer, lights, shadow, theme recolour, `active()`/`wake()` with an IntersectionObserver on the Character kit page, about line 2711).
- KayKit Adventurers 2.0 FREE (outside the repo, the path is in `scripts/build_kaykit_helper.py`): `Rig_Medium_MovementBasic.glb` has `Jump_Full_Long`, `Jump_Full_Short`, `Jump_Idle`, `Jump_Land`, `Jump_Start`, `Running_A/B`, `Walking_A/B/C`; `Rig_Medium_General.glb` has no sit clip. The Mystery Monthly Series 6 pack has the same Rig_Medium clips.
- The models (measured in their files): Tent 784 triangles, flat colours, rotated and scaled at its root (Quaternius export); Tricycle 3,604, flat colours; Parachute 1,304, one texture; Jetpack 4,624, flat colours, 10 materials; Vespa 826 faces in OBJ, 5 materials. Their units differ by orders of magnitude, so each is scaled to a target size in the config rather than by a common factor.
- `_resources/261028_product-opening/3d-models/poly-pizza_models-various/261028_attribution-notes` lists the authors and CC-BY; the Poly Pizza IDs are in the file names (e.g. `9UE6AhwMhbc`).

## Open questions

1. The licence version and link for each CC-BY model (Poly by Google models are CC-BY 3.0; to confirm on each model's Poly Pizza page before the credits are written).
2. Whether the hand-built sit reads well on the tricycle, which is small for a 1.8 m figure: scale the tricycle up (a toy-like look, fitting the KayKit style) or sit the persona higher. To settle by eye in group 2.
3. Where the parachute's harness sits on the persona and whether `Jump_Idle`'s raised arms meet the risers; if not, a hand-set arm pose like D5.
