# Payday run: validation

Branch: `feature/payday-run`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5174/overview.html`). Unless a line says otherwise, check Light and Dark, and desktop (1440px) and phone (390px).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] `dist/` contains `playground.html`
- [ ] The browser console shows no errors on any page visited below
- [ ] `assets/3d/playground/` holds only the models in `requirements.md`, the two textures and both `License.txt` files; total about 1.0 MB

## 2. Entry and guard

- [ ] Design system hub shows four cards; "Payday run" is the fourth and its trailing arrow moves like the others
- [ ] The card opens the page as a sheet that slides up from below with the scrim fading in, like the payment flow; the hub is visible behind it while it moves
- [ ] Signed out (clear `uzBankAdmin`): opening `playground.html` directly redirects to Profile > Admin access
- [ ] The page has no sidebar, tab bar, header or status message (wait over 12 s)
- [ ] The close button is top right, has an accessible name, and slides the sheet down and the scrim out, like closing the payment flow; focus returns to the card and the hub is usable again (not inert, scrolls)
- [ ] Opening the page directly (`playground.html`) works, and its close button goes to the hub
- [ ] With reduced motion on, the sheet appears and disappears without sliding and nothing is left behind
- [ ] Character kit ends with a "Try it in the Playground" link that opens the page

## 3. The runner

- [ ] First visit (nothing in `localStorage`): the default profile (Beat) appears
- [ ] Set User Type to each of Newbie, All-rounder, Power user in Profile; the Playground figure matches and the pace is jog, run, sprint in that order
- [ ] A Multi-color theme recolours figure, track and world; switching Light/Dark while paused updates everything without a reload
- [ ] Resizing the window keeps the figure and track framed

## 4. Controls

- [ ] Keyboard: arrows and A/D steer, Space or Enter starts and restarts, Escape pauses and Resume works
- [ ] Steering stays inside the track width at both edges
- [ ] Touch emulation at 390px: Left/Right buttons appear, steer while held, release when the finger slides off
- [ ] The buttons do not appear with a mouse
- [ ] Portrait and landscape both work; rotating pauses the run
- [ ] Switching tab or app pauses the run
- [ ] Keyboard focus is visible (`--color-fg-interactive` outline) on close, start, pause, Resume, result buttons

## 5. The story

- [ ] Payday burst: coins burst out at the start
- [ ] Town: buildings and props on both sides, recoloured, none floating or sunk
- [ ] Coins: collected coins disappear and the balance ticks up in CHF format (`10'000.00` style)
- [ ] Gates: rent, groceries and bills each take their amount once, and the HUD shows it
- [ ] Chest: the remaining balance is deposited and the HUD changes to saved
- [ ] Forest: trees grow stage by stage along the track and the saved amount grows with them
- [ ] The run ends on the result screen after the forest

## 6. Result and best run

- [ ] Result screen: final balance, one line per step (salary, rent, groceries, bills, saved, forest growth), no em dashes in any text
- [ ] First finished run shows "New best"; `uzBankWebPlaygroundBest` holds `{balance, date}`
- [ ] A worse run does not overwrite the best, and does not show the badge; a better run does
- [ ] Reload: the best run is still shown
- [ ] With `localStorage` blocked or the key holding invalid JSON, the game still runs and the result shows without errors
- [ ] Play again restarts cleanly (balance, coins, gates, trees reset); Close returns to the hub
- [ ] `uzBankWebPaymentState` is unchanged before and after a run (the demo balance is untouched)
- [ ] The key is listed in `apps/web/README.md`

## 7. Reduced motion

- [ ] With reduced motion on (System Settings > Accessibility > Display), the Playground opens in the stepped mode: still scenes, a Next button, no camera movement, no burst, no animation anywhere
- [ ] Every beat is reachable by keyboard only; Skip to result works
- [ ] The stepped mode ends on the same result screen and the best run still works
- [ ] Turning reduced motion off or on while the page is open switches mode without a reload or a broken state
- [ ] Page transitions in and out of the Playground are still (as everywhere else)

## 8. Performance

- [ ] Desktop: steady 60 fps through the whole run; frame time and draw calls recorded below
- [ ] 4x CPU throttle: no sustained drop below about 30 fps; dynamic resolution steps down instead of stuttering
- [ ] 390px touch emulation: playable; record the draw-call count
- [ ] Leaving the page and coming back does not leak (memory does not climb across three round trips)
- [ ] Paused or hidden: rendering stops

## 9. Accessibility

- [ ] Contrast of HUD and overlays in Light, Dark and one Multi-color theme (tokens only)
- [ ] The canvas is `aria-hidden`; the HUD balance and the result are available as text; changes to the balance are announced politely, not on every coin
- [ ] Tab order: close, then in-page controls; no keyboard trap while running or paused
- [ ] Legibility presets (Profile > Legibility) do not break the HUD or the result screen layout

## 10. Baseline smoke test

Copied from `specs/baseline/validation.md`. Run after the checks above. Setup: `cd apps/web && npm run build`, then `npm run dev` and open `http://localhost:5174/overview.html`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview > Account details > All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### Banking flows

- [ ] ★ Pay: recipient search > recipient > amount > schedule > summary > confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account > a position > Buy opens the trade flow and can be dismissed
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

### Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation

---

Checked on: not yet run. Fill in with the date, branch, browser, viewports and what was not checked when the checks are done.
