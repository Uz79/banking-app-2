# 3D stages read the latest visibility entry (20): plan

Branch: `feature/observer-latest-entry`. Decisions are cited as D1 to D5 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The two observers (D1, D2, D4)

- [x] `apps/web/character-kit.html`: the helper's observer reads `entries[entries.length - 1]` (D1)
- [x] `apps/web/js/profile-persona-character.js`: `mountStage`'s observer reads the latest entry (D2)
- [x] Check: on the Character kit, a fast scroll past the helper, the live specimen and the Vehicles stage, then back; each draws when on screen and is still when off. The forced case (D5): a callback handed a stale-then-fresh pair for each stage. Profile's persona and Overview's ambient figure still draw

## 2. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 20 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` and `apps/web/README.md` unchanged (no new system, key or file)
