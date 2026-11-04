# Sheets keep focus (27): validation

Branch: `feature/sheet-focus`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

Use real Tab and Shift+Tab key presses, not scripted focus.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. Focus stays in each sheet (D1, D4)

For each sheet: open it by keyboard, Tab past its last control and Shift+Tab past its first; focus never reaches the page behind.

- [ ] Pay (Overview, Payments, Account details), on its first step and on the summary
- [ ] The internal transfer (Overview, Payments, Account details)
- [ ] Buy and Sell (a position's page)
- [ ] The booking sheet (Account details, All bookings)
- [ ] Account information (Account details)
- [ ] Share information, opened from Account information: focus stays in Share, not in Account information beneath; closing Share gives Account information back with Tab working in it (D2)
- [ ] With a sheet open, the page behind has `inert` set (read from the DOM) and the sheet itself doesn't

## 3. Focus in and back (D5, D6)

- [ ] Opening a sheet by keyboard puts focus inside it (its field, or the sheet itself with no ring on the container), and the next Tab is its first control
- [ ] Closing by keyboard (Enter on X, or a step that closes it) puts focus back on what opened it, with the ring
- [ ] Closing by click puts focus back without the ring
- [ ] The booking sheet's Edit opens Pay; closing Pay leaves the page usable by Tab (the booking row can't take focus until 33)
- [ ] The fridge's "Transfer now" opens the transfer, and closing it leaves the page usable by Tab
- [ ] After any close, nothing in the page is left `inert`

## 4. Unchanged

- [ ] The Discard prompt over Pay, the transfer and Buy works by keyboard (Continue, Discard)
- [ ] The picker sheets (an account picker in the transfer, a select) open over their sheet and work by keyboard
- [ ] The fridge and playground sheets behave as before

## 5. Everywhere

- [ ] Phone width (390): Pay and the booking sheet open and close by tap; nothing is left inert
- [ ] Light and Dark, and a Multi-color theme: the focus rings inside the sheets show in the theme's colour
- [ ] Reduced motion: the sheets open and close as before, focus moves the same way

## 6. Baseline smoke test

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
