# Booking rows by keyboard (33, 52): validation

Branch: `feature/booking-rows-keyboard`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Account details and All bookings (both accounts)

## 2. Rows by keyboard (D1 to D3, D5, D7)

- [ ] First visit (after the reset), Account details: Tab reaches every booking row in order (Apple, Café, Pizza, Railway); Enter opens the sheet; Space opens it too
- [ ] All bookings, Household and Savings, each tab (Executed, Pending, Recurring): Tab reaches every visible row; Enter opens the right sheet (a payment, a transfer, a standing order, a standing order's next payment)
- [ ] A payment made in the app: its row on both pages is reached and opens its sheet
- [ ] Closing the sheet (Done, the X, by keyboard) puts focus back on the row with the ring; closed by mouse, no ring
- [ ] Search on All bookings: a row it hides is skipped by Tab
- [ ] A row reads as its text (name, chip, amount), checked in the accessibility tree

## 3. Focus after a Delete or an edit (D6)

- [ ] Delete Swisscom by keyboard: focus on the next row, with the ring; "Payment deleted." is announced
- [ ] Delete the last row of a list: focus on the one before
- [ ] Delete Apple on Account details (its only pending row): focus on the next row
- [ ] Edit Helvetia Insurance by keyboard and Execute: focus on a row, not the page body
- [ ] An empty Pending tab after deletes: focus on the Pending tab

## 4. Look and access (D4)

- [ ] Desktop (1440px) and 390px, Light and Dark: rows look exactly as before (type, colour, padding, hover and pressed layer, the chip)
- [ ] A Multi-color theme: the ring takes `--color-fg-interactive`
- [ ] Reduced motion: nothing new moves

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work (tabs and chips)

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation


Checked on: not yet.
