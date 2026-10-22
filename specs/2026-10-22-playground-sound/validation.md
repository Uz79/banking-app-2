# Playground sound: validation

Branch: `feature/playground-sound`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5174/overview.html`, signed in as admin). Unless a line says otherwise, check Light and Dark, and desktop (1440px) and phone (390px). Use headphones or speakers; sound cannot be checked from a screenshot.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build and assets

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] `dist/assets/audio/playground/` contains the nine WAV files and `License.txt`, about 330 KB in total
- [ ] The browser console shows no errors (also with the sound files blocked: the game runs silently)

## 2. Start and the autoplay rule

- [x] First visit (nothing in `localStorage`): sound is on, the button shows the on icon
- [x] Nothing plays on the start screen, only after pressing Start
- [ ] Play again after the result screen plays sound again
- [ ] Opening the Playground from the Design system sheet (iframe) and directly (`playground.html`) both give sound
- [ ] Chrome and Safari both play (desktop); a phone browser if available

## 3. Footsteps

- [ ] Feet land with the animation, two sounds per stride, for each profile (Newbie, All-rounder, Power user); Max's steps are faster than Beat's
- [x] Hard-ground steps in the town; they switch to grass in the forest, at the first trees, not before
- [ ] No two identical sounds back to back; the volume and pitch vary slightly
- [ ] No steps on the start screen, while paused, in the Quit dialog, or on the result screen
- [ ] Steps stay in time after a pause and resume

## 4. Coin

- [ ] Each collected coin makes a sound
- [ ] Picking up several in a row climbs in pitch, up to the cap; after a short pause the next coin starts low again
- [ ] A burst of many coins at once does not become a wall of noise (one voice per frame)
- [ ] The coin is clearly louder than the steps

## 5. Mute button

- [x] It sits top right, immediately left of the close button, same size and style; at 390px the name, balance, sound and close do not overlap
- [x] Click and Enter/Space toggle it; the icon changes between on and muted; muting is instant, also mid-run, and unmuting brings the sound back without restarting
- [x] The setting survives a reload (`uzBankWebPlaygroundSound` is `on` or `off` in `localStorage`)
- [ ] Screen reader name and state are right ("Mute sound" / "Unmute sound", `aria-pressed`)
- [ ] Keyboard focus ring is visible (`--color-fg-interactive`); it also works with Tab order top row to close
- [ ] Light, Dark and a Multi-color theme: icon and button take the tokens
- [ ] With storage blocked or the key set to garbage, the game still loads (sound on)

## 6. Pause and background

- [ ] Escape: the sound stops under the Quit dialog; Keep playing resumes it; Quit run leaves with no leftover sound
- [ ] Switching to another tab or window silences it; coming back shows the Quit dialog and no sound until Keep playing
- [ ] Rotating the phone (pause) behaves the same
- [ ] A coin or step that was playing when the dialog opened does not finish ringing under the dialog

## 7. Reduced motion

- [x] With `?reduced` (and the system setting): no footsteps, no coin sound, and the mute button is hidden
- [ ] Switching the system setting live while on the start screen switches to the still version without leaving sound running

## 8. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components, Character kit and Payday run; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure
- [ ] The Payday run still plays end to end (town, gates, chest, forest, result) and the best run is kept

### Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

---

Checked on 2026-10-22 against `feature/playground-sound`, Chrome on macOS (desktop), served by `npm run dev`; the 390px layout through a same-origin iframe. Sound was verified by counting `AudioBufferSourceNode.start` calls and their buffer lengths and pitch, not by ear: steps every 0.5 s for Lena (two per cycle) on concrete samples in the town and grass samples from `?from=262`; coins at pitch 1.0 then 1.059; no new sounds while the Quit dialog was open and sound back after Keep playing; mute stopped new sounds and wrote `off`/`on` to `uzBankWebPlaygroundSound`; the button is hidden with `?reduced`; no overlap of name, balance, sound and close at 390px. The build passes (the audio files are served from the source tree like the 3D assets, which the deploy uploads).

Not checked, so not ticked: how it sounds (volume balance, whether the steps feel in time with the feet, the coin ladder by ear); Safari and any phone; Beat and Max cadence; Light and a Multi-color theme for the button; the hidden-tab, rotation and Quit run paths; Play again; the sheet (iframe) entry; blocked storage; screen reader wording; the focus ring; live reduced-motion switching; and the whole baseline smoke test.

Second pass on 2026-10-22: Klaudiusz ran the remaining checks himself (by ear, the other browsers and devices, and the baseline smoke test) and reported that they passed. The individual boxes above were not ticked one by one, and the details of what was run were not recorded here.
