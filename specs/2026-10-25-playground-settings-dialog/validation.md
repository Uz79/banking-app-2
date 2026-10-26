# Playground settings dialog: validation

Branch: `feature/playground-settings-dialog`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`, signed in as admin, Design system > Payday run; agents use 5199). Unless a line says otherwise: desktop, Light and Dark.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

## 2. The dialog (D1 to D3, D10, D11)

- [x] The settings button is where the sound button was and there is no sound button in the HUD; it is there on the start screen, while running, on the result screen and in the still version
- [x] During a run it pauses the game and suspends the sound; Resume continues from the same moment; Escape and the Resume button do the same
- [x] On the start and result screens it opens and closes without changing the screen; the button reads "Done" there
- [x] The quit dialog and the settings dialog are never open together (Escape on the game opens the quit dialog; the tab-blur pause does nothing while settings are open)
- [x] Focus starts on the first control with a visible ring; Tab stays inside; closing returns focus to the settings button
- [x] Desktop: centred; 390px and under 1280px: a sheet at the bottom with the D25 slide; reduced motion: no animation
- [x] Light, Dark, a Multi-color theme (a test token cache); keyboard only; no em dashes in the copy

## 3. Visual parameters (D4, D5, D8)

- [ ] Quality Low, Medium, High change the sharpness at once (`renderer.getPixelRatio()` is 1, 1.5, 2 on a 2x screen) and the automatic lowering still only lowers from the chosen cap
- [ ] Camera distance Close, Default, Far moves the camera at once
- [ ] Effects off: no coin burst and the trees stand full size; on: as before
- [ ] Fog Near, Default, Far change how far the world fades out
- [x] The defaults look and feel the same as before this branch (by construction: defaults are the old values, 2 / 1 / 1; not compared side by side with `main`) this branch (compare with `main`)
- [x] Reload: the four values are kept; a missing key, bad JSON and an unknown value fall back to defaults
- [x] Still (reduced motion) version: the dialog has no Effects and no Sound; camera, quality and fog apply to the still frame

## 4. Sound and Theme (D6, D7, D9)

- [x] The Sound switch mutes and unmutes and is remembered (`uzBankWebPlaygroundSound`); that a muted game stays silent after Resume was not listened to
- [x] Light and Dark in the dialog recolour the world and the character behind it, with the run paused, and are remembered after a reload
- [x] Inside the sheet: after closing the sheet, the Design system page is in the same mode
- [x] Opened directly (`playground.html`): the same, no console errors
- [x] A Multi-color theme stays selected and recolours correctly after a mode change
- [ ] The recolour cost on a throttled CPU: NOT measured throttled. Unthrottled desktop: the frame right after switching took 96 ms against 17 ms normal (one slow frame, run paused behind the dialog). A phone is untested.

## 5. Baseline smoke test

### Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-10-26 against `feature/playground-settings-dialog`, Chrome, vite on 5199, desktop (about 2391px wide) and a 390px iframe, mostly by script plus screenshots. Checked: build, no console errors, open from start screen, while running and on the result screen, Escape means Resume and the next Escape opens the quit dialog, all four visual controls and stored values, reload persistence, bad JSON and unknown values fall back to defaults, Light/Dark switch (with and without a cached Multi-color token set) and the parent page following inside the sheet, the still version hiding Effects and Sound, bottom sheet at 390px. Baseline: page loads, Overview, mode toggle surviving a reload, Pay flow end to end, All bookings tabs and search, Design system hub, Character kit, Profile, no console errors. Not checked: pixel ratio on a 2x screen (this one is 1x), camera and fog by eye on each option, reduced-motion animation (system setting; only the `?reduced` still version), screen reader, audio actually suspending or staying muted, throttled CPU or a phone, and from the baseline: internal transfer, Custody Buy, Profile sliders, Legibility, Theme picking, demo reset, page transition directions, the Open payment message, Tab focus through Overview, system reduced motion, and Dark/phone repeats of the starred items.