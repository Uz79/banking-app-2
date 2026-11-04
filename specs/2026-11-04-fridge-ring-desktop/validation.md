# Fridge result: the amount fits its ring on desktop (26): validation

Branch: `feature/fridge-ring-desktop`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

The result is step 7 of the fridge: Overview → Offers → Investment, then Next through the steps.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The ring on the floating panel (D1 to D3)

- [ ] CHF 0: on one line at the same size as before (`--fs-h4`)
- [ ] A five-digit amount (for example CHF 26'900): on one line, inside the ring
- [ ] CHF 280'000 (every slider at its maximum): on one line, the line's box at least 4 px inside the inner circle, measured from the DOM
- [ ] The widest amounts, CHF 500'000 and CHF 999'999 (set in the ring's text for the check): the same 4 px margin
- [ ] "You could invest" stays inside the ring above the amount, and its box is inside the inner circle too
- [ ] The ring is still 11rem; "Left each year" and the note are unchanged
- [ ] At 640px (the narrowest floating panel) the same holds
- [ ] With Legibility on Large and on Small, the result looks the same as on Regular (D5: it doesn't reach the fridge)

## 3. Everywhere

- [ ] Phone width (390): unchanged from phone polish D8 (the label above the ring, only the amount inside)
- [ ] Light and Dark, and a Multi-color theme: the amount reads clearly
- [ ] Reduced motion: the bar is drawn at once, the amount as above
- [ ] The fridge opened on its own (`fridge-advisor.html`) at desktop width looks the same as in the sheet

## 4. Baseline smoke test

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

Checked on: not yet run.
