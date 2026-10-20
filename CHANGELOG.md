# Changelog

All notable changes to `apps/web` are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased
<!-- changelog: last-commit 0cc3dbff2d47c19e150299146df9a817c4100390 -->

### Decided
- **Spec-driven workflow.** From now on every change goes through a dated spec folder (`specs/<YYYY-MM-DD>-<name>/`) created with `/feature-spec`, on its own branch, with a validation pass and the baseline smoke test before it reaches `main`. Added `AGENTS.md`, `specs/mission.md`, `specs/tech-spec.md`, `specs/roadmap.md`, `specs/baseline/`, and the `/feature-spec` and `/changelog` skills. The app's code is unchanged. The state before this is tagged `v1-presentable`.

### Added
- **Mobile Light/Dark toggle.** On Overview, Payments, Profile and Design system, under 1280px, a small glyph-only button in the top left of the top bar swaps Light and Dark. It shows the sun in Light and the moon in Dark, switches instantly through the same function as the sidebar (so Multi-color themes work as before), and keeps no hover fill after a tap on touch screens. It is hidden at 1280px and up, where the sidebar has the control, and is not on the deeper screens, which keep their back arrow. New file `js/mode-toggle.js`; no new storage key.

## v1-presentable (2026-10-19)

The app as built before the spec-driven process: see `specs/baseline/requirements.md` for what it contains. Earlier history is in git.
