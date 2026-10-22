# Changelog

All notable changes to `apps/web` are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased
<!-- changelog: last-commit d64abe6d0f06f3c85068eae5ec6cdeb339a8dc9e -->

### Decided
- **Spec-driven workflow.** From now on every change goes through a dated spec folder (`specs/<YYYY-MM-DD>-<name>/`) created with `/feature-spec`, on its own branch, with a validation pass and the baseline smoke test before it reaches `main`. Added `AGENTS.md`, `specs/mission.md`, `specs/tech-spec.md`, `specs/roadmap.md`, `specs/baseline/`, and the `/feature-spec` and `/changelog` skills. The app's code is unchanged. The state before this is tagged `v1-presentable`.

### Added
- **Mobile Light/Dark toggle.** On Overview, Payments, Profile and Design system, under 1280px, a small glyph-only button in the top left of the top bar swaps Light and Dark. It shows the sun in Light and the moon in Dark, switches instantly through the same function as the sidebar (so Multi-color themes work as before), and keeps no hover fill after a tap on touch screens. It is hidden at 1280px and up, where the sidebar has the control, and is not on the deeper screens, which keep their back arrow. New file `js/mode-toggle.js`; no new storage key.
- **Playground: "Payday run"** (Design system, admin only). A small 3D game that takes the persona character, the colour themes and the motion out for a run. A fourth card on the Design system page opens `playground.html` as a full-screen sheet that slides up and down like the flow screens, with a close button on the right; Escape pauses, then closes. The runner is the User Type character and its profile sets the pace (Beat jogs, Lena runs, Max sprints). The run goes through a town (KayKit City Builder Bits, CC0) collecting coins from the salary, past gates for rent, groceries and bills, into a savings chest, then through a forest (KayKit Forest Nature Pack, CC0) where trees grow as you close in and the savings compound. It ends on a result screen with a breakdown and a "New best" badge. The world takes the active colour theme. Steering: arrow keys or A/D, or two on-screen buttons on touch devices. With reduced motion the run is a short set of still scenes with Next. All tuning numbers are in `js/playground-config.js`. A "Try it in the Playground" link ends the Character kit page.
- New `localStorage` key `uzBankWebPlaygroundBest` (best run), listed in `apps/web/README.md`.
- Assets: `assets/3d/playground/town` and `assets/3d/playground/forest` (about 1.0 MB, CC0, with the pack licences).

- **Playground sound.** Two sounds: footsteps and a coin. Footsteps follow the run clip's foot contacts, so Beat, Lena and Max each get their own cadence, and they change from hard ground to grass at the forest, with a small random pitch and volume spread. The coin pings and climbs in pitch for quick pickups, then starts low again after a short pause. Sound starts with the Start button and is on by default; a round button left of the close button mutes it and is remembered. It pauses with the Quit dialog and when the tab is hidden; the still (reduced motion) version has no sound and no button. Volumes and pitch steps are in `js/playground-config.js`. New `js/playground-audio.js` (Web Audio, no library).
- New `localStorage` key `uzBankWebPlaygroundSound`, listed in `apps/web/README.md`.
- Assets: `assets/audio/playground/` (nine mono WAV files, about 340 KB, Kenney Impact Sounds, CC0, with the licence).

### Changed
- **Dev server:** `npm run dev` now uses port 5175 (it fails instead of moving to another port if that is taken), listens on the network and accepts `*.local` host names, so a phone on the same Wi-Fi can open `http://klaudiuszs-macbook-pro.local:5175/overview.html`. Docs and earlier specs say 5175. `AGENTS.md` tells agents to use port 5199 for their own checks. Dev tooling only; the app is unchanged.
- `js/profile-persona-character.js`: the figure exposes `loopPhase()` (where the current loop is in its cycle). Nothing else changes.
- Design system hub: the cards use the shared hover ink and gained a pressed state.
- Playground: the start and result card follows the confirmation dialog: secondary button first, primary last, the same title size, and a bottom sheet on mobile and tablet.
- Playground: Escape, the close button and a tab switch during a run now open one "Quit this run?" dialog (Keep playing or Quit run), replacing the "Paused" dialog. It reuses the app's confirmation dialog, which gained optional button and Escape settings that the payment flows do not use.
- Playground review fixes: the start button no longer shows a focus ring until a key is pressed, the steer buttons use neutral inks, and the Components icon on the Design system hub renders as an outline.
- Admin sign-in: a wrong password now shows the design system's text field error state (error stroke, warning icon and message under the field) instead of a separate pink line.
- `js/profile-persona-character.js` now exports `createFigure()` (the character without a scene), `readTheme`, `monochromeLut`, `preparePalette`, `cssColor` and `THREE`, so the Playground reuses the character instead of forking it. `setLoop` takes an optional `timeScale`. The Profile, Character kit and ambient figures behave as before.
- `AGENTS.md`: a full-screen page with no scroll header does not need an entry in `bindMainScrollChrome`.
- `AGENTS.md`: ideas found during a feature go onto `specs/roadmap.md` as a new item, committed on the feature branch on their own, with a pointer in the spec's out-of-scope list. The roadmap gained items 5 to 7 (sound, gameplay, a Playground settings dialog).

## v1-presentable (2026-10-19)

The app as built before the spec-driven process: see `specs/baseline/requirements.md` for what it contains. Earlier history is in git.
