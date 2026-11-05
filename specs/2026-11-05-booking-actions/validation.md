# Booking actions: Edit, Delete, Copy and Done on every booking (42): validation

Branch: `feature/booking-actions`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings and Account details, with each action run

## 2. Persistence (D1 to D5, D12)

- [ ] First visit (nothing in `localStorage`): every built-in row shows
- [ ] Edit Swisscom on All bookings, reload: Swisscom's example row stays hidden, the edited payment shows in Pending
- [ ] Edit Apple on Account details, reload: Apple stays hidden; Household and the Today header count CHF 100 once (not the old Apple and the new payment both)
- [ ] Delete Helvetia Insurance and Tax office Zurich, reload: both stay gone; the emptied "Execute on 03.11.2026" group and its divider are gone
- [ ] Delete every pending row: the Pending tab says "No pending payments."; no empty month band on any tab
- [ ] Profile, Reset demo data: every built-in row is back on both pages, balances at their start

## 3. The function bar and Done (D6 to D8, D16)

- [ ] Built-in pending payment (Swisscom, Apple): Edit, Delete, Copy; the amount's pencil shows
- [ ] Pending payment made in the app: Edit, Delete, Copy
- [ ] Executed payment out (Café, SBB, an executed payment made in the app): Copy only, no pencil
- [ ] Pending transfer made in the app: Delete only
- [ ] Standing orders: built-in (Rent, Netflix) no bar; made in the app, Edit as before
- [ ] Trades, Salary, Interest credit, a built-in transfer (Pizza): no bar, no empty rule
- [ ] Footer reads "Done" on every booking and closes the sheet

## 4. Edit (D4, D9)

- [ ] Edit on a built-in pending row opens Pay with its recipient, amount and date (Swisscom: 30.10.2026); Execute updates the list, no duplicate
- [ ] Edit on Apple opens with today's date

## 5. Delete (D10 to D13)

- [ ] Delete asks "Delete payment?" (a transfer: "Delete transfer?"); Keep and Escape change nothing
- [ ] Delete removes the row; a pending transfer loses both legs, on both accounts' lists
- [ ] Deleting a pending payment changes no balance; deleting Apple brings Household and the Today header back to 10'000.00
- [ ] Focus after Delete: on the next row (keyboard: with the ring), or the previous, or the tab; the status line is read out

## 6. Copy (D14, D15)

- [ ] Copy of Café (executed) and Tax office Zurich (pending): Pay opens at the amount step with the recipient and amount, As soon as possible on, today's date
- [ ] Execute adds a new booking; the original row is unchanged
- [ ] Closing Pay after Copy asks "Discard payment?" as a new payment does, and leaves the original untouched

## 7. Look and access

- [ ] Desktop (1440px) and 390px, Light and Dark: the bar, the prompt, the empty tab line
- [ ] A Multi-color theme: the bar and the prompt take the theme
- [ ] Keyboard: the bar's buttons in order, visible focus, Enter and Space work
- [ ] Reduced motion (the real macOS setting): the sheet and the prompt open and close without sliding

## 8. Baseline smoke test

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
- [ ] All bookings: tabs, month chips and search work

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
