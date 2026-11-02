# Vehicles in the Character kit (9c): plan

Branch: `feature/character-kit-vehicles`. Decisions are cited as D1 to D13 from `requirements.md`. Groups 1 and 2 were built and committed together: the poses had to be tuned with the vehicles in place.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), on `character-kit.html` signed in as admin.

## 1. The models on a stage (D1, D2, D3, D4, D8, D10)

What you see: a "Vehicles" section with a stage and the strategy picker; each pick shows its vehicle alone, sized and turned, in the theme's monochrome.

- [x] Copy and rename the five models into `assets/3d/vehicles/`; convert the Vespa with Blender's command line (D3); `CREDITS.md` with authors, licences, links and the conversion command
- [x] `js/character-vehicles-config.js`: per strategy the file, target size, position, yaw, camera framing
- [x] `js/character-vehicles.js`: `mountVehicles(box, { reduced, active })` with its own stage (renderer, lights, shadow as the helper's), loading, sizing and the monochrome recolour (flat colours and the parachute's texture), theme follow-up
- [x] `character-kit.html`: the section, the picker, the entry `pre` and the table; the IntersectionObserver wiring
- [x] Check: all five on desktop in Light, no console errors (Dark, a Multi-color theme and 390 in the validation pass)

## 2. The persona rides (D5, D6, D9)

What you see: the persona with each vehicle in its pose; switching squashes and springs back.

- [x] `scripts/build_kaykit_helper.py`: also write `assets/3d/kaykit/rig-medium-ride.glb` (`Jump_Idle`); run it
- [x] `js/character-vehicles.js`: the persona via `createFigure()` following the live specimen's picks (D4 amended); poses: stand (`Idle_A`), sit (bone overrides after the mixer, D5), fly (`Jump_Idle`, D6); the swap on a pick (D9)
- [x] Tune the sit, the parachute harness and the jetpack's place on the back by eye; settle open questions 2 and 3
- [x] Check: each strategy with Beat and Max (Max's hat and cape against the vehicles); fast picks, Lena, Dark and 390 in the validation pass

## 3. Idle, reduced motion, credits (D7, D11, D12)

What you see: the jetpack hovers, the parachute sways; with reduced motion all is still; a Credits section lists the models.

- [x] `js/character-vehicles.js`: the bob and the sway from the config; reduced motion holds a still frame (with the sit applied) and switches at once
- [x] Confirm each model's licence and link (open question 1); the "Credits" section after "Assets", and the `assets/3d/vehicles/` line in "Assets"
- [x] Check: `?reduced` (`character-kit.html?reduced` works like the fridge's), picks made while the 3D loads (kept, shown once ready), keyboard through the picker (in the validation pass), the stage stops drawing off screen

## 4. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` item 9c marked done, and 9d noted to give the credits a customer-reachable place (D12); `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the 3D character kit: the vehicles, the module, the ride clip; drop the stale "copied to `dist` by a small plugin" in the fridge line); `apps/web/README.md` (the `assets/3d/vehicles/` line; drop the stale "the build copies it to `dist`" in the fridge line)
