# Profile: "Reset demo data" asks first and confirms without disabling (22): validation

Branch: `feature/reset-demo-confirm`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. Asking first (D1, D2)

Set up: make a payment so there is something to clear.

- [ ] "Reset demo data" opens "Reset demo data?" with the D1 message, "Cancel" and "Reset"
- [ ] Cancel closes the dialog; the payment is still there and no status line shows
- [ ] Escape does the same as Cancel
- [ ] Reset closes the dialog and clears the payment: Household is back to its starting balance, the booking is gone from Overview
- [ ] An opened asset management mandate and a trade are gone after a reset too (the new subtitle is true, D6)
- [ ] Keyboard: Tab reaches the button, Enter opens the dialog, Tab stays inside it, the focus ring is visible on both buttons; after either choice the focus is back on "Reset demo data"

## 3. The status line (D3 to D5)

- [ ] After Reset, "Demo data reset." with the check icon shows under the button; before any reset the line takes no space
- [ ] The button is never disabled and keeps its label throughout
- [ ] A second reset right away asks again and works; the line is emptied and refilled (read from the live region's text during the reset)
- [ ] The line is in a `role="status"` element (read from the DOM)
- [ ] Leaving Profile and coming back: the line is gone

## 4. Everywhere

- [ ] Light and Dark, and a Multi-color theme: the line, icon and dialog read clearly and use the theme's colours
- [ ] Phone width (390): the dialog fits, the line wraps cleanly under the button
- [ ] Reduced motion: the dialog opens and closes without animation, the line has none

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet.
