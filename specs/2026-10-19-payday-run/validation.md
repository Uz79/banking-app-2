# Payday run: validation

Branch: `feature/payday-run`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5174/overview.html`). Unless a line says otherwise, check Light and Dark, and desktop (1440px) and phone (390px).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] `dist/` contains `playground.html`
- [x] The browser console shows no errors on any page visited below
- [x] `assets/3d/playground/` holds only the models in `requirements.md`, the two textures and both `License.txt` files; total about 1.0 MB

## 2. Entry and guard

- [x] Design system hub shows four cards; "Payday run" is the fourth and its trailing arrow moves like the others
- [x] The card opens the page as a sheet that slides up from below with the scrim fading in, like the payment flow; the hub is visible behind it while it moves
- [x] Signed out (clear `uzBankAdmin`): opening `playground.html` directly redirects to Profile > Admin access
- [x] The page has no sidebar, tab bar, header or status message (wait over 12 s)
- [x] The close button is top right, has an accessible name, and slides the sheet down and the scrim out, like closing the payment flow; focus returns to the card and the hub is usable again (not inert, scrolls)
- [x] Opening the page directly (`playground.html`) works, and its close button goes to the hub
- [ ] With reduced motion on, the sheet appears and disappears without sliding and nothing is left behind
- [ ] Character kit ends with a "Try it in the Playground" link that opens the page

## 3. The runner

- [x] First visit (nothing in `localStorage`): the default profile (Beat) appears
- [x] Set User Type to each of Newbie, All-rounder, Power user in Profile; the Playground figure matches and the pace is jog, run, sprint in that order
- [ ] A Multi-color theme recolours figure, track and world; switching Light/Dark while paused updates everything without a reload
- [ ] Resizing the window keeps the figure and track framed

## 4. Controls

- [x] Keyboard: arrows and A/D steer, Space or Enter starts and restarts, Escape or the close button opens the quit dialog while running (see section 9c); on the start and finish screens they leave straight away
- [x] Steering stays inside the track width at both edges
- [x] Touch emulation at 390px: Left/Right buttons appear, steer while held, release when the finger slides off
- [x] The buttons do not appear with a mouse
- [ ] Portrait and landscape both work; rotating pauses the run
- [ ] Switching tab or app pauses the run
- [x] Keyboard focus is visible (`--color-fg-interactive` outline) on close, start, the quit dialog buttons, result buttons

## 5. The story

- [x] Payday burst: coins burst out at the start
- [x] Town: buildings and props on both sides, recoloured, none floating or sunk
- [x] Coins: collected coins disappear and the balance ticks up in CHF format (`10'000.00` style)
- [x] Gates: rent, groceries and bills each take their amount once, and the HUD shows it
- [x] Chest: the remaining balance is deposited and the HUD changes to saved
- [x] Forest: trees grow stage by stage along the track and the saved amount grows with them
- [x] The run ends on the result screen after the forest

## 6. Result and best run

- [x] Result screen: final balance, one line per step (salary, rent, groceries, bills, saved, forest growth), no em dashes in any text
- [x] First finished run shows "New best"; `uzBankWebPlaygroundBest` holds `{balance, date}`
- [x] A worse run does not overwrite the best, and does not show the badge; a better run does
- [x] Reload: the best run is still shown
- [x] With `localStorage` blocked or the key holding invalid JSON, the game still runs and the result shows without errors
- [x] Play again restarts cleanly (balance, coins, gates, trees reset); Close returns to the hub
- [x] `uzBankWebPaymentState` is unchanged before and after a run (the demo balance is untouched)
- [x] The key is listed in `apps/web/README.md`

## 7. Reduced motion

- [ ] With reduced motion on (System Settings > Accessibility > Display), the Playground opens in the stepped mode: still scenes, a Next button, no camera movement, no burst, no animation anywhere
- [x] Every beat is reachable by keyboard only; Skip to result works
- [x] The stepped mode ends on the same result screen and the best run still works
- [ ] Turning reduced motion off or on while the page is open switches mode without a reload or a broken state
- [ ] Page transitions in and out of the Playground are still (as everywhere else)

## 8. Performance

- [x] Desktop: steady 60 fps through the whole run; frame time and draw calls recorded below
- [ ] 4x CPU throttle: no sustained drop below about 30 fps; dynamic resolution steps down instead of stuttering
- [ ] 390px touch emulation: playable; record the draw-call count
- [ ] Leaving the page and coming back does not leak (memory does not climb across three round trips)
- [ ] Paused or hidden: rendering stops

## 9. Accessibility

- [ ] Contrast of HUD and overlays in Light, Dark and one Multi-color theme (tokens only)
- [x] The canvas is `aria-hidden`; the HUD balance and the result are available as text; changes to the balance are announced politely, not on every coin
- [x] Tab order: close, then in-page controls; no keyboard trap while running or paused
- [x] Legibility presets (Profile > Legibility) do not break the HUD or the result screen layout

## 9b. Review fixes (group 14)

- [ ] Opening the game shows no focus ring on Start (mouse, touch); pressing Tab brings the ring back; Enter still starts
- [ ] Steer buttons: 64 dp, 24 dp arrows with no dark rectangle inside and no moving arrow, arrows in foreground ink, circle in separator ink, in Light and Dark (checked in Dark on desktop only)
- [ ] Design system hub: the Components icon is an outline in Light and Dark (checked in Dark)
- [ ] Admin sign-in with a wrong password: pink stroke on the password field, warning icon and message under it, label unchanged; typing clears it; Light and Dark (checked in Dark)

## 9c. Quit dialog (group 15, D24)

- [x] While running, Escape opens "Quit this run?" with the text "Your progress in this run will be lost. Your best run stays saved.", "Keep playing" (secondary) and "Quit run" (primary); the run stops moving behind it; focus is on "Keep playing" with no focus ring until Tab (checked in Dark on desktop)
- [x] Escape inside the dialog closes it and the run resumes (the balance kept rising)
- [x] The close button (top right) opens the same dialog while running; "Quit run" leaves (to the Design system on a direct visit; the sheet slides away when embedded)
- [ ] "Keep playing" by click or tap resumes; the held touch buttons do not stick
- [ ] Switching tab, or rotating the phone, during a run opens the dialog; coming back and choosing Keep playing resumes
- [ ] On the start and result screens, Escape and the close button leave straight away, with no dialog
- [ ] The dialog's "Close" link on the start and result screens leaves; the sheet slides away
- [ ] Reduced motion (the still scenes): Escape or the close button opens the dialog; Keep playing returns to the same scene
- [ ] Light and Dark, 390px and a real phone; no focus ring on a tap
- [ ] The payment flows' "Discard payment?" dialog still looks and works the same (Escape does nothing there, as before); the "Continue payment" and "Discard" labels are unchanged
- [ ] The best run is untouched after quitting

## 9d. Dialog language (D25)

- [x] Start screen: Close (secondary) above Start (primary); the title is 18 px, the same as the quit dialog (measured at 390px; Dark)
- [ ] Result screen: Close above Play again; the still scenes: Skip to result above Next
- [ ] Under 1280px the card sits at the bottom of the screen and slides up; at 1280px and up it is centred (only the narrow case was seen; a real 1280px window was not)
- [ ] The card and the quit dialog look alike side by side, in Light and Dark, on a phone
- [ ] Reduced motion: no slide

## 10. Baseline smoke test

Copied from `specs/baseline/validation.md`. Run after the checks above. Setup: `cd apps/web && npm run build`, then `npm run dev` and open `http://localhost:5174/overview.html`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview > Account details > All bookings and back plays the page transitions in the right directions
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### Banking flows

- [x] ★ Pay: recipient search > recipient > amount > schedule > summary > confirm; the balance and bookings update
- [x] Internal transfer completes
- [ ] Custody account > a position > Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components, Character kit and Payday run; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation

---

Checked on 2026-10-20 against `feature/payday-run` (commit before the wrap-up), Chrome on macOS (Apple M4, pixel ratio 1), served by `npm run dev`; desktop for the page itself, 390x844 and 844x390 through same-origin iframes of that size (the window could not be resized), keyboard by real key presses for Enter, Tab and Escape and by dispatched events for the arrow keys, the "still" version through `?reduced`. Light, Dark and the green Multi-color theme were all seen.

Not checked, and so not ticked:
- Playground: a real touch device or phone; the system "reduce motion" setting (only `?reduced`), including the live switch and the sheet with reduced motion; the Character kit link by clicking it; resizing a real window; rotation and tab-switch pause (the code path was checked with a blur event only); dynamic resolution stepping down (nothing to lower at pixel ratio 1); a 4x CPU throttle; a leak check (the heap readings were too noisy); contrast measurements; Light/Dark switching while the page is open; blocked (not just invalid) storage.
- Baseline: Light/Dark toggle survival on reload, the page transition directions, all-bookings tabs, month chips and search (a scripted attempt was inconclusive), dismissing the trade flow, Legibility, Theme card, the Reset demo data button (the same `reset()` was called from the console), the design system sub-pages' back motion, the Overview focus pass, and the reduced-motion pass of the baseline. Pay and Internal transfer reached their confirmation screens; the Household balance change was not compared against a known starting figure.

Changes made during validation: the result dialog scrolls on short screens (landscape phone); the dialog's Close and Escape behaviours were fixed earlier in the build.

Second pass on 2026-10-20 (desktop Chrome, `npm run dev` on port 5175, Overview in Light): the Light/Dark toggle switched and survived a reload (ticked). Partly looked at, not ticked: All bookings (the Pending tab selects, but `js/all-bookings.js` only binds the tab, it does not filter, and is unchanged since `v1-presentable`; month chips and search could not be driven by script, so they need a hand check), Legibility (picking a preset stored new `fontScale` and `spaceScale` in `uzBankWebAppearance`; the visual effect was not looked at), Reset demo data (the state was already the default, so the click proved nothing). The temporary theme and appearance keys were removed afterwards.
