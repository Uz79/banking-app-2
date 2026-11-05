# Booking actions: Edit, Delete, Copy and Done on every booking (42): validation

Branch: `feature/booking-actions`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings and Account details, with each action run

## 2. Persistence (D1 to D5, D12)

- [x] First visit (nothing in `localStorage`): every built-in row shows (after the reset)
- [x] Edit Swisscom on All bookings, reload: Swisscom's example row stays hidden, the edited payment shows in Pending
- [x] Edit Apple on Account details, reload: Apple stays hidden; Household and the Today header count CHF 100 once (not the old Apple and the new payment both): Household 10'000.00 with the edited Apple pending
- [x] Delete Helvetia Insurance and Tax office Zurich, reload: both stay gone; the emptied "Execute on 03.11.2026" group and its divider are gone
- [x] Delete every pending row: the Pending tab says "No pending payments."; no empty month band on any tab (with an app-made pending payment added after, its November band and group show, no stray divider)
- [x] Profile, Reset demo data: every built-in row is back on both pages, balances at their start

## 3. The function bar and Done (D6 to D8, D16)

- [x] Built-in pending payment (Swisscom, Apple): Edit, Delete, Copy; the amount's pencil shows
- [x] Pending payment made in the app: Edit, Delete, Copy
- [x] Executed payment out (Café, SBB, an executed payment made in the app): Copy only, no pencil (checked on every executed row of All bookings and Apple's page)
- [x] Pending transfer made in the app: Delete only
- [x] Standing orders: built-in (Rent, Netflix) no bar; made in the app, Edit as before
- [x] Trades, Salary, Interest credit, a built-in transfer (Pizza): no bar, no empty rule: no buttons. A payment's sheet keeps its rule as the section divider, as before; a transfer's sheet has no bar
- [x] Footer reads "Done" on every booking and closes the sheet

## 4. Edit (D4, D9)

- [x] Edit on a built-in pending row opens Pay with its recipient, amount and date (Swisscom: 30.10.2026); Execute updates the list, no duplicate: it opens on 06.11.2026, the next possible day, as 30.10.2026 is past (53)
- [x] Edit on Apple opens with today's date: the next possible day, 06.11.2026, as Pay does for any later payment

## 5. Delete (D10 to D13)

- [x] Delete asks "Delete payment?" (a transfer: "Delete transfer?"); Keep and Escape change nothing: Escape checked; the Keep button not clicked (the prompt's stay path, as Escape)
- [x] Delete removes the row; a pending transfer loses both legs, on both accounts' lists
- [x] Deleting a pending payment changes no balance; deleting Apple brings Household and the Today header back to 10'000.00
- [ ] Focus after Delete: on the next row (keyboard: with the ring), or the previous, or the tab; the status line is read out: changed in the build (D13). The status line is set ("Payment deleted.", "Transfer deleted."); rows can't take focus (52). Not heard with a screen reader

## 6. Copy (D14, D15)

- [x] Copy of Café (executed) and Tax office Zurich (pending): Pay opens at the amount step with the recipient and amount, As soon as possible on, today's date: checked with Migros (executed); Tax office not copied
- [x] Execute adds a new booking; the original row is unchanged
- [x] Closing Pay after Copy asks "Discard payment?" as a new payment does, and leaves the original untouched

## 7. Look and access

- [x] Desktop (1440px) and 390px, Light and Dark: the bar, the prompt, the empty tab line (desktop Light and Dark; 390px Light for All bookings, Dark for Account details and Overview)
- [x] A Multi-color theme: the bar and the prompt take the theme (Custom 08; the prompt not opened in it)
- [x] Keyboard: the bar's buttons in order, visible focus, Enter and Space work: close, pencil, Edit, Delete, Copy, Download, Further options; Enter on Copy opens Pay with focus in the amount
- [ ] Reduced motion (the real macOS setting): the sheet and the prompt open and close without sliding

## 8. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop (desktop Light, 390px Dark)
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes (Overview, CHF 500 to Savings)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (Discard order? then closed)
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [x] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly (Custom 08 on All bookings; UZ Bank restored, override cleared)
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-11-05 against `feature/booking-actions`, Chrome (Claude in Chrome) on the agent's server (port 5199), desktop 1483px and 390px (same-origin iframes), Light, Dark and Custom 08; keyboard in the booking sheet. Not checked: the real macOS Reduce motion setting (section 7 and baseline 6), a screen reader, the Keep button by click, Copy of a pending row, and in the baseline the Light/Dark toggle by click (set through storage instead), page transition directions, the status message timing, Pay from recipient search (Pay ran from Edit and Copy, amount step on), Legibility, and Tab through Overview.
