# Fridge: the persona exits and returns (8e): plan

Branch: `feature/fridge-persona-walk`. Decisions are cited as D1 to D11 from `requirements.md`. Groups 1 and 2 were built and committed together: the walk out and the walk in are one function and one config block.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. Walking out and back on step 1 (D1 to D3, D7 to D9)

What you see: on Next from step 1 the persona turns right and walks out of the frame, then the camera glides to the fridge (D3 amended); Back from step 2 walks it back in to its spot.

- [x] `js/fridge-advisor-config.js`: `figure.walk` (distance, duration, turn time, time scale)
- [x] `js/fridge-advisor-scene.js`: `showFigure(on)` replaced by a walk (turn, `Walking_A` while moving, `Idle_A` at rest, hidden once out of the frame), cancelled and continued by a newer step (D9); reduced motion shows or hides at once (D8)
- [x] Settle open questions 1 and 2 by eye (the camera now waits for the walk out)
- [x] Check: Next and Back between steps 1 and 2, fast clicks, `?reduced`, Light and Dark, no console errors

## 2. Back in for the result (D4 to D6, D11)

What you see: on step 7 the persona walks in from the right during the cooling moment and stands next to the open freezer as the amount appears, in a slightly wider frame; Back to 6 walks it out.

- [x] `js/fridge-advisor-config.js`: `camera.pose.result`, `figure.result`, step 7's `stage: 'result'`
- [x] `js/fridge-advisor-scene.js`: the walk in to the result spot and the turn toward the viewer; the walk out on Back
- [x] Settle open question 3 (the pose and the spot) on desktop and at 390
- [x] Check: steps 6 to 7 and back, the hand-over to the opening and "Start over" unchanged, step 4 still the close-up, Light and Dark, a Multi-color theme, desktop and 390, `?reduced`

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` item 8e marked done; `CHANGELOG.md` under `Unreleased`; fridge D22 amended in `specs/2026-10-22-fridge-advisor/requirements.md` (a pointer to this spec, D11); `specs/tech-spec.md` (the fridge line mentions the walk; fix the stale "the sheet narrows to 640" for the opening, which is 960 since 9b D24)
