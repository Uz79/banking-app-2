# Sheets keep focus (27): validation

Branch: `feature/sheet-focus`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

Use real Tab and Shift+Tab key presses, not scripted focus.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. Focus stays in each sheet (D1, D4)

For each sheet: open it by keyboard, Tab past its last control and Shift+Tab past its first; focus never reaches the page behind.

- [x] Pay (Overview, Payments, Account details), on its first step and on the summary
- [x] The internal transfer (Overview, Payments; on Account details not run separately, the same script and markup)
- [x] Buy and Sell (a position's page)
- [x] The booking sheet (Account details, All bookings)
- [x] Account information (Account details)
- [x] Share information, opened from Account information: focus stays in Share, not in Account information beneath; closing Share gives Account information back with Tab working in it (D2)
- [x] With a sheet open, the page behind has `inert` set (read from the DOM) and the sheet itself doesn't

## 3. Focus in and back (D5, D6)

- [x] Opening a sheet by keyboard puts focus inside it (its field, or the sheet itself with no ring on the container), and the next Tab is its first control
- [x] Closing by keyboard (Enter on X, or a step that closes it) puts focus back on what opened it, with the ring
- [x] Closing by click puts focus back without the ring
- [x] The booking sheet's Edit opens Pay; closing Pay leaves the page usable by Tab (the booking row can't take focus until 33)
- [ ] The fridge's "Transfer now" opens the transfer, and closing it leaves the page usable by Tab
- [x] After any close, nothing in the page is left `inert`

## 4. Unchanged

- [x] The Discard prompt over Pay, the transfer and Buy works by keyboard (Continue, Discard)
- [x] The picker sheets (an account picker in the transfer, a select) open over their sheet and work by keyboard
- [x] The fridge and playground sheets behave as before

## 5. Everywhere

- [x] Phone width (390): Pay and the booking sheet open and close by tap; nothing is left inert
- [x] Light and Dark, and a Multi-color theme: the focus rings inside the sheets show in the theme's colour
- [x] Reduced motion: the sheets open and close as before, focus moves the same way

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation (not run: the agent can't change the system setting)

## Notes

- **How focus was checked (2, 3):** real Tab, Shift+Tab, Enter and Escape key presses, with a `focusin` logger naming each stop and the layer it was in. Past a sheet's last or first control, focus goes to the browser's own toolbar and back into the sheet, never to the page.
- **Opened from a booking row (3):** a click on a row doesn't move focus, so the sheet's opener is whatever had focus before, and closing returns there (on Account details, "More functions"). Rows become focusable in 33.
- **Not run (3):** the fridge's "Transfer now", which needs a completed opening. By reading `js/fridge-advisor-sheet.js`, the fridge clears `.app.inert` before it opens the transfer (`finish()`, then `afterClose`), so the helper then takes over.
- **Reduced motion (5):** checked by injecting the reduced-motion rules for the sheets, not the system setting. Focus and `inert` are right for Pay and the transfer. It showed an existing fault, now roadmap 35: the transfer's close never finishes without its transition, so an invisible overlay stays over the page and takes every click.
- **Found and fixed in the build (D3, D11):** the first version of the helper inerted everything in `<body>`, including a browser extension's elements; after Discard and after More functions focus fell to the page body.
- **Desktop width:** the browser window was 1605 CSS px wide, not 1440; 390 checked in iframes with touch-style pointer events.

Checked on 2026-11-04 against `feature/sheet-focus` (a33e220), Chrome on macOS, on the agent's server (port 5199): Overview, Payments, Account details, a position's page, All bookings, the Design system; Light (UZ Bank) and Dark (Custom 06); desktop (1605 CSS px) and 390 iframes. Theme, Light, Legibility and User Type restored, the demo reset run. Not checked: the real reduced-motion system setting, the fridge's "Transfer now", Safari, VoiceOver, a 1440 px window.
