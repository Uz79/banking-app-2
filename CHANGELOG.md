# Changelog

All notable changes to `apps/web` are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased
<!-- changelog: last-commit 27d448d95b1a2e42e869c46f95b9cb28661a1ff1 -->

### Decided
- **Spec-driven workflow.** From now on every change goes through a dated spec folder (`specs/<YYYY-MM-DD>-<name>/`) created with `/feature-spec`, on its own branch, with a validation pass and the baseline smoke test before it reaches `main`. Added `AGENTS.md`, `specs/mission.md`, `specs/tech-spec.md`, `specs/roadmap.md`, `specs/baseline/`, and the `/feature-spec` and `/changelog` skills. The app's code is unchanged. The state before this is tagged `v1-presentable`.

### Added
- **Playground: "Payday run"** (Design system, admin only). A small 3D game that takes the persona character, the colour themes and the motion out for a run. A fourth card on the Design system page opens `playground.html` as a full-screen sheet that slides up and down like the flow screens, with a close button on the right; Escape pauses, then closes. The runner is the User Type character and its profile sets the pace (Beat jogs, Lena runs, Max sprints). The run goes through a town (KayKit City Builder Bits, CC0) collecting coins from the salary, past gates for rent, groceries and bills, into a savings chest, then through a forest (KayKit Forest Nature Pack, CC0) where trees grow as you close in and the savings compound. It ends on a result screen with a breakdown and a "New best" badge. The world takes the active colour theme. Steering: arrow keys or A/D, or two on-screen buttons on touch devices. With reduced motion the run is a short set of still scenes with Next. All tuning numbers are in `js/playground-config.js`. A "Try it in the Playground" link ends the Character kit page.
- New `localStorage` key `uzBankWebPlaygroundBest` (best run), listed in `apps/web/README.md`.
- Assets: `assets/3d/playground/town` and `assets/3d/playground/forest` (about 1.0 MB, CC0, with the pack licences).

### Changed
- Playground review fixes: the start button no longer shows a focus ring until a key is pressed, the steer buttons use neutral inks, and the Components icon on the Design system hub renders as an outline.
- Admin sign-in: a wrong password now shows the design system's text field error state (error stroke, warning icon and message under the field) instead of a separate pink line.
- `js/profile-persona-character.js` now exports `createFigure()` (the character without a scene), `readTheme`, `monochromeLut`, `preparePalette`, `cssColor` and `THREE`, so the Playground reuses the character instead of forking it. `setLoop` takes an optional `timeScale`. The Profile, Character kit and ambient figures behave as before.
- `AGENTS.md`: a full-screen page with no scroll header does not need an entry in `bindMainScrollChrome`.

## v1-presentable (2026-10-19)

The app as built before the spec-driven process: see `specs/baseline/requirements.md` for what it contains. Earlier history is in git.
