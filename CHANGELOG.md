# Changelog

All notable changes to `apps/web` are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased
<!-- changelog: last-commit 29a86a53a8f4833fbc9a9996cfa061a8085efc77 -->

### Decided
- **Spec-driven workflow.** From now on every change goes through a dated spec folder (`specs/<YYYY-MM-DD>-<name>/`) created with `/feature-spec`, on its own branch, with a validation pass and the baseline smoke test before it reaches `main`. Added `AGENTS.md`, `specs/mission.md`, `specs/tech-spec.md`, `specs/roadmap.md`, `specs/baseline/`, and the `/feature-spec` and `/changelog` skills. The app's code is unchanged. The state before this is tagged `v1-presentable`.

### Added
- **Playground settings dialog.** A settings button in the Payday run HUD pauses the run and opens a dialog: Quality, Camera distance, Effects and Fog (remembered in `uzBankWebPlaygroundSettings`), a Sound switch (replaces the HUD mute button) and Light/Dark, which the Design system page behind the sheet follows. Resume or Escape continues the run. The dialog is 640px wide on desktop and a bottom sheet under 1280px.

### Changed
- **One running balance rule.** Household and Savings show the running balance (registered balance plus payments and transfers made in the app) on Overview, Account details (both carousel slides), the All bookings card, the payment sheet's debit rows and the internal transfer sheet. The Overview and Account details totals add up from the same figures. The registered balance stays only for the Yesterday and day headers.

### Added
- **All bookings: the page is real.** Executed, Pending and Recurring each show their own list, and the payments, internal transfers and trades made in the app appear in it for the account being viewed (newest first in Today, with the Today balance following). A payment or transfer set to recurring, or to not run as soon as possible, is recorded as recurring or pending and moves no money. The month bar and dock belong to the Executed tab. The stored bookings limit is 100 (it was 5 payments).
- **All bookings search.** The Search button opens an inline bar under the toolbar that filters bookings by payee or amount across all months, hides empty day groups, shows an empty state and a match count for screen readers, and closes with Escape. The month chips are dimmed while a query is typed. No new storage key.
- **All bookings search is now always visible** (replaces the Search button). The field sits next to the tabs (under them on a phone) and filters the active tab by payee or amount; month chips with no match are dimmed. The search field is the standard text field height (2.5rem), also in the Pay recipient search (it was 3rem). Pattern recorded in `specs/tech-spec.md`: an inline field filters the current view, a Search button opens a separate search view or flow.
- **Mobile Light/Dark toggle.** On Overview, Payments, Profile and Design system, under 1280px, a small glyph-only button in the top left of the top bar swaps Light and Dark. It shows the sun in Light and the moon in Dark, switches instantly through the same function as the sidebar (so Multi-color themes work as before), and keeps no hover fill after a tap on touch screens. It is hidden at 1280px and up, where the sidebar has the control, and is not on the deeper screens, which keep their back arrow. New file `js/mode-toggle.js`; no new storage key.
- **Playground: "Payday run"** (Design system, admin only). A small 3D game that takes the persona character, the colour themes and the motion out for a run. A fourth card on the Design system page opens `playground.html` as a full-screen sheet that slides up and down like the flow screens, with a close button on the right; Escape pauses, then closes. The runner is the User Type character and its profile sets the pace (Beat jogs, Lena runs, Max sprints). The run goes through a town (KayKit City Builder Bits, CC0) collecting coins from the salary, past gates for rent, groceries and bills, into a savings chest, then through a forest (KayKit Forest Nature Pack, CC0) where trees grow as you close in and the savings compound. It ends on a result screen with a breakdown and a "New best" badge. The world takes the active colour theme. Steering: arrow keys or A/D, or two on-screen buttons on touch devices. With reduced motion the run is a short set of still scenes with Next. All tuning numbers are in `js/playground-config.js`. A "Try it in the Playground" link ends the Character kit page.
- New `localStorage` key `uzBankWebPlaygroundBest` (best run), listed in `apps/web/README.md`.
- Assets: `assets/3d/playground/town` and `assets/3d/playground/forest` (about 1.0 MB, CC0, with the pack licences).

- **Playground sound.** Two sounds: footsteps and a coin. Footsteps follow the run clip's foot contacts, so Beat, Lena and Max each get their own cadence, and they change from hard ground to grass at the forest, with a small random pitch and volume spread. The coin pings and climbs in pitch for quick pickups, then starts low again after a short pause. Sound starts with the Start button and is on by default; a round button left of the close button mutes it and is remembered. It pauses with the Quit dialog and when the tab is hidden; the still (reduced motion) version has no sound and no button. Volumes and pitch steps are in `js/playground-config.js`. New `js/playground-audio.js` (Web Audio, no library).
- New `localStorage` key `uzBankWebPlaygroundSound`, listed in `apps/web/README.md`.
- Assets: `assets/audio/playground/` (nine mono WAV files, about 340 KB, Kenney Impact Sounds, CC0, with the licence).

- **Fridge advisor: "How much should I invest?"** (Overview > Offers > Investment). The first step of opening an investment product, as in an advisory meeting. A 3D fridge in the theme colours with the persona beside it: the main compartment is money for daily needs, the reserve drawers are reserves for the unplanned and for bigger purchases, the freezer is what can be invested. Eight screens: an intro, a three-stop tour, two slider screens (monthly salary, left at month end, total assets, reserve for the unplanned with a marker at 3 times the salary, reserve for bigger purchases; each with a typable CHF field) where the shelves and drawers stock up like a real fridge, the result (the doors close, a short cooling moment, the freezer opens; a ring with the amount, the yearly amount and "A rough guide, not financial advice.") and a closing screen. Opens as a flow sheet like Pay; Back, Escape and the "Leave this guide?" dialog work like the other flows. Still versions for reduced motion. Nothing is stored.
- **Wide flow sheets.** `.modal-shell--wide` makes a flow sheet 960dp wide (the main box width) from 1024px, with the page inside choosing its columns. The fridge advisor is the first user (fridge on the left, steps on the right). Below 1024px nothing changes.
- Assets: `assets/3d/fridge/` (Kenney Furniture Kit and Food Kit, CC0, with the licences; about 0.4 MB with the texture).
- Spec: `specs/2026-10-22-fridge-advisor/` (roadmap item 8a).

### Changed
- **Fridge advisor: the active compartment is tinted instead of outlined.** The accent outline bars are gone. The interior of the compartment being explained or filled (walls and shelves, the drawers, or the freezer) takes a tint of the accent, lighter in Light and a matching darker step in Dark, and fades to the next compartment with the camera. The fridge body, doors and food stay neutral.
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

### Decided
- **Deploy is source.** `dist` is never deployed (GitHub Pages serves `apps/web` as it is), so runtime-loaded assets need no copy step in the build (fridge advisor D25).
- Two pre-existing gaps found in the baseline run went onto the roadmap: the All bookings Search button (item 10) and the Household balance on Account details (item 11).

## v1-presentable (2026-10-19)

The app as built before the spec-driven process: see `specs/baseline/requirements.md` for what it contains. Earlier history is in git.
