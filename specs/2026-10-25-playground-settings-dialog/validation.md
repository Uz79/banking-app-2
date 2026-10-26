# Playground settings dialog: validation

Branch: `feature/playground-settings-dialog`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`, signed in as admin, Design system > Payday run; agents use 5199). Unless a line says otherwise: desktop, Light and Dark.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

## 2. The dialog (D1 to D3, D10, D11)

- [ ] The settings button is where the sound button was and there is no sound button in the HUD; it is there on the start screen, while running, on the result screen and in the still version
- [x] During a run it pauses the game and suspends the sound; Resume continues from the same moment; Escape and the Resume button do the same
- [x] On the start and result screens it opens and closes without changing the screen; the button reads "Done" there
- [x] The quit dialog and the settings dialog are never open together (Escape on the game opens the quit dialog; the tab-blur pause does nothing while settings are open)
- [x] Focus starts on the first control with a visible ring; Tab stays inside; closing returns focus to the settings button
- [x] Desktop: centred; 390px and under 1280px: a sheet at the bottom with the D25 slide; reduced motion: no animation
- [ ] Light, Dark, a Multi-color theme; keyboard only; no em dashes in the copy

## 3. Visual parameters (D4, D5, D8)

- [ ] Quality Low, Medium, High change the sharpness at once (`renderer.getPixelRatio()` is 1, 1.5, 2 on a 2x screen) and the automatic lowering still only lowers from the chosen cap
- [ ] Camera distance Close, Default, Far moves the camera at once
- [ ] Effects off: no coin burst and the trees stand full size; on: as before
- [ ] Fog Near, Default, Far change how far the world fades out
- [ ] The defaults look and feel the same as before this branch (compare with `main`)
- [x] Reload: the four values are kept; a missing key, bad JSON and an unknown value fall back to defaults
- [x] Still (reduced motion) version: the dialog has no Effects and no Sound; camera, quality and fog apply to the still frame

## 4. Sound and Theme (D6, D7, D9)

- [x] The Sound switch mutes and unmutes and is remembered (`uzBankWebPlaygroundSound`); that a muted game stays silent after Resume was not listened to
- [x] Light and Dark in the dialog recolour the world and the character behind it, with the run paused, and are remembered after a reload
- [x] Inside the sheet: after closing the sheet, the Design system page is in the same mode
- [ ] Opened directly (`playground.html`): the same, no console errors
- [ ] A Multi-color theme stays selected and recolours correctly after a mode change
- [ ] The recolour cost on a throttled CPU: NOT measured throttled. Unthrottled desktop: the frame right after switching took 96 ms against 17 ms normal (one slow frame, run paused behind the dialog). A phone is untested.

## 5. Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when the branch reaches this step, and tick it.

Checked on 2026-10-26 against `feature/playground-settings-dialog`, Chrome, vite on 5199, desktop (about 2391px wide) and a 390px iframe, mostly by script plus screenshots. Checked: build, no console errors, open from start screen and while running, Escape means Resume and the next Escape opens the quit dialog, all four visual controls and storage values, reload persistence, Light/Dark switch and the parent page following inside the sheet, the still version hiding Effects and Sound, bottom sheet at 390px. Not checked: Dark/Light visuals of every state, result screen, Multi-color themes, bad-JSON fallback, defaults compared with `main`, pixel ratio on a 2x screen, camera/fog by eye on each option, reduced-motion animation, screen reader, audio actually suspending, throttled CPU or a phone, the baseline smoke test (section 5 not run).
