# Demo data moves with the real date (62, with 69): validation

Branch: `feature/demo-data-dates`. Run on the agent's server (port 5199), then the baseline smoke test. Start each section after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Account details (both slides) and All bookings (both accounts, all tabs)

## 2. Dates (D3 to D7, D16)

- [ ] Today's date: Yesterday is yesterday, no Executed booking dated after today, the newest band is the current month
- [ ] Rent on the 1st, Internet & Phone and Netflix on the 5th, Salary on the 25th, in every month listed up to today
- [ ] `?today=2026-12-01` (a month's first day): Rent under Today; December's band and chip; five months, August to December
- [ ] `?today=2027-01-04` (a Monday in January): the bands and chips carry the year; Yesterday is Sunday 03.01
- [ ] `?today=` is ignored on a Vercel preview URL (or by a host check in the console standing in for it)
- [ ] Pending one-offs and standing orders' next dates as since 53, for today and the dates above

## 3. Balances (D8 to D11)

- [ ] First visit (nothing in `localStorage`): Household reads 10'000.00 on Overview, Account details, All bookings and Pay's Debit account card; Savings 25'000.00; the newest day on each list ends at the card's balance
- [ ] Every day's balance equals the day after's minus what that day moved (checked by script over both lists)
- [ ] A payment of 120 made in Pay, executed now: 9'880.00 everywhere, Today appears with it, the older days unchanged; Overview's total adds up
- [ ] A payment made later or as a standing order changes no balance
- [ ] Apple: in Household's Pending, not under a day on Account details; its Delete changes no balance
- [ ] A stored payment dated yesterday (set through the payment state) shows under Yesterday, not Today, and the balances chain through it (D12)

## 4. All bookings (D2, D13)

- [ ] Both accounts, Executed: five months of groups; one chip per month, the newest active, the same in the docked bar
- [ ] A chip scrolls to its band; scrolling moves the active chip; focus stays on the chip when the bar docks
- [ ] Delete of a month's last Household row (a pending row, or after Edit) leaves no empty group, band or chip behind
- [ ] Edit and Copy of a built-in pending row and of a standing order; the standing orders' next payments in Pending as before; a `removedBuiltIns` stored before this branch still hides its rows
- [ ] Search: results, no-results line, a month with no match shows no band

## 5. Account details (D14, D15)

- [ ] Both slides: the two newest days with bookings, labelled Today, Yesterday or a date; Show all bookings opens the right account
- [ ] "Pending payments" sums what that account's Pending tab lists; a pending payment made in Pay adds to it; it hides when nothing is pending
- [ ] A row's sheet, Edit and Delete as before; focus back on the row after the sheet

## 6. Look and access

- [ ] Light and Dark, a Multi-color theme, desktop (1440px) and 390px
- [ ] Keyboard: Tab reaches every row and chip, Enter opens a sheet, focus visible
- [ ] Reduced motion: chips jump instead of scrolling, as before (nothing new moves)

## 7. Baseline smoke test

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
