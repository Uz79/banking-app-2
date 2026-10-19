# Changelog

All notable changes to `apps/web` are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Decided
- **Spec-driven workflow.** From now on every change goes through a dated spec folder (`specs/<YYYY-MM-DD>-<name>/`) created with `/feature-spec`, on its own branch, with a validation pass and the baseline smoke test before it reaches `main`. Added `AGENTS.md`, `specs/mission.md`, `specs/tech-spec.md`, `specs/roadmap.md`, `specs/baseline/`, and the `/feature-spec` and `/changelog` skills. The app's code is unchanged. The state before this is tagged `v1-presentable`.

## v1-presentable (2026-10-19)

The app as built before the spec-driven process: see `specs/baseline/requirements.md` for what it contains. Earlier history is in git.
