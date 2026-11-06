# Booking rows by keyboard (33, 52): validation

Branch: `feature/booking-rows-keyboard`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on Account details and All bookings (both accounts)

## 2. Rows by keyboard (D1 to D3, D5, D7)

- [x] First visit (after the reset), Account details: Tab reaches every booking row in order (Apple, Café, Pizza, Railway); Enter opens the sheet; Space opens it too (Apple to Cafe by Tab, Space on Cafe)
- [x] All bookings, Household and Savings, each tab (Executed, Pending, Recurring): Tab reaches every visible row; Enter opens the right sheet (a payment, a transfer, a standing order, a standing order's next payment) (Household's Pending: every row by Tab; Enter on Swisscom, Helvetia, Apple and Internet & Phone's next payment)
- [x] A payment made in the app: its row on both pages is reached and opens its sheet (an edited Helvetia on All bookings; Account details not checked)
- [x] Closing the sheet (Done, the X, by keyboard) puts focus back on the row with the ring; closed by mouse, no ring (Done by keyboard on Account details and All bookings; the X and a mouse close not checked)
- [x] Search on All bookings: a row it hides is skipped by Tab
- [x] A row reads as its text (name, chip, amount), checked in the accessibility tree

## 3. Focus after a Delete or an edit (D6)

- [x] Delete Swisscom by keyboard: focus on the next row, with the ring; "Payment deleted." is announced
- [ ] Delete the last row of a list: focus on the one before (no deletable row is last in a list after a reset: standing orders' next payments end Pending)
- [x] Delete Apple on Account details (its only pending row): focus on the next row
- [x] Edit Helvetia Insurance by keyboard and Execute: focus on a row, not the page body (the built-in: on Tax office Zurich, the next row; the edited payment edited again: on its own row)
- [x] An empty Pending tab after deletes: focus on the Pending tab (with the search narrowing Pending to Apple, then Apple deleted)

## 4. Look and access (D4)

- [x] Desktop (1440px) and 390px, Light and Dark: rows look exactly as before (type, colour, padding, hover and pressed layer, the chip) (desktop Light and Dark, 390px Light and Dark; hover and pressed not checked)
- [ ] A Multi-color theme: the ring takes `--color-fg-interactive`
- [ ] Reduced motion: nothing new moves

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work (tabs and search) (tabs and chips)

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation


Checked on 2026-11-06 against `feature/booking-rows-keyboard`, Chrome (Claude in Chrome) on the agent's server (port 5199), desktop 1483px and 390px (same-origin iframes), Light and Dark; keys pressed for real (Tab, Shift+Tab, Enter, Space), the target focused by script where a long walk would have been needed; Pay and the transfer driven by script. Not checked: a Multi-color theme, the real macOS Reduce motion setting (this branch adds no animation), VoiceOver, the X and a mouse close of the booking sheet, hover and pressed, a payment made in the app on Account details, Delete of the last row in a list, Savings' All bookings by keyboard, and in the baseline page transitions, the status message, User Type, Legibility, Theme, the Design system pages and Tab through Overview.
