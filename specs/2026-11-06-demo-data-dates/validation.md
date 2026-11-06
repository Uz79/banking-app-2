# Demo data moves with the real date (62, with 69): validation

Branch: `feature/demo-data-dates`. Run on the agent's server (port 5199), then the baseline smoke test. Start each section after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on Overview, Account details (both slides) and All bookings (both accounts, all tabs)

## 2. Dates (D3 to D7, D16)

- [x] Today's date: Yesterday is yesterday, no Executed booking dated after today, the newest band is the current month
- [x] Rent on the 1st, Internet & Phone and Netflix on the 5th, Salary on the 25th, in every month listed up to today
- [x] `?today=2026-12-01` (a month's first day): Savings' Rent under Today, December's band and chip, five months, August to December; Household has nothing on the 1st, so four months, August to November
- [x] `?today=2027-01-04` (a Monday in January): the bands and chips carry the year; Yesterday is Sunday 03.01
- [x] `?today=` is ignored on a Vercel preview URL (or by a host check in the console standing in for it)
- [x] Pending one-offs and standing orders' next dates as since 53, for today and the dates above

## 3. Balances (D8 to D11)

- [x] First visit (nothing in `localStorage`): Household reads 10'000.00 on Overview, Account details, All bookings and Pay's Debit account card; Savings 25'000.00; the newest day on each list ends at the card's balance
- [x] Every day's balance equals the day after's minus what that day moved (checked by script over both lists)
- [x] A payment of 120 made in Pay, executed now: 9'880.00 everywhere, Today appears with it, the older days unchanged; Overview's total adds up
- [x] A payment made later or as a standing order changes no balance
- [ ] Apple: in Household's Pending, not under a day on Account details; its Delete changes no balance
- [x] A stored payment dated yesterday (set through the payment state) shows under Yesterday, not Today, and the balances chain through it (D12)

## 4. All bookings (D2, D13)

- [x] Both accounts, Executed: five months of groups; one chip per month, the newest active, the same in the docked bar
- [ ] A chip scrolls to its band; scrolling moves the active chip; focus stays on the chip when the bar docks
- [ ] Delete of a month's last Household row (a pending row, or after Edit) leaves no empty group, band or chip behind
- [ ] Edit and Copy of a built-in pending row and of a standing order; the standing orders' next payments in Pending as before; a `removedBuiltIns` stored before this branch still hides its rows
- [x] Search: results, no-results line, a month with no match shows no band

## 5. Account details (D14, D15)

- [x] Both slides: the two newest days with bookings, labelled Today, Yesterday or a date; Show all bookings opens the right account
- [ ] "Pending payments" sums what that account's Pending tab lists; a pending payment made in Pay adds to it; it hides when nothing is pending
- [x] A row's sheet, Edit and Delete as before; focus back on the row after the sheet

## 6. Look and access

- [x] Light and Dark, a Multi-color theme, desktop (1440px) and 390px
- [x] Keyboard: Tab reaches every row and chip, Enter opens a sheet, focus visible
- [ ] Reduced motion: chips jump instead of scrolling, as before (nothing new moves)

## 7. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-11-06 against `feature/demo-data-dates`, Chrome on the agent's server (5199), desktop (1456px) and 390px in same-origin frames, Light and Dark with a Multi-color theme (the one stored on 5199) and the default look; lists read by script, dates also checked in Node for 06.11.2026, 01.12.2026, 04.01.2027, a Saturday and a short month. First visit (storage cleared): 10'000.00 and 25'000.00 everywhere, Overview 65'000.00, each list's newest day at its card, every day's balance chaining (Household 5'807.25 in July to 10'000.00, Savings 20'889.40 to 25'000.00). A payment of 120 to Lena Fischer made through Pay's own sheet: 9'880.00 on Overview (total 64'880.00), Account details and All bookings, Today with it, older days unchanged; a pending 50 and 200 moved no balance, the 200 raised Household's pending line to 1'854.80. `?today=2026-12-01`: Savings Aug to Dec with Rent under Today, Household Aug to Nov; `?today=2027-01-04`: bands and chips with the year, Yesterday Sunday 03.01; `?today=2026-11-07`: pending as since 53; `?today` ignored for `*.vercel.app` hosts (Node host check). Pending lines 1'654.80 and 1'859.00 equal the Pending tabs; Delete of Tax office through its dialog: group and divider gone, focus on Netflix, line 454.80. Edit of Swisscom and Copy of Lena Fischer open Pay with recipient and amount; sheets of Bakery Sprüngli, Netflix, Internet & Phone (-59.00), Transfer to Household and Transfer from Savings (Savings to Household) right; focus back on the row after a sheet; Tab reaches chips and rows with the ring, Enter opens the sheet. Search "migros" 5 rows, "zzz" its line. No horizontal overflow at 390px. No console errors from the app; the build passes (its "can't be bundled" notices are the one-per-classic-script kind, two more for the new file). Not checked: the active chip following a manual scroll and focus moving with the dock (chip scrolls landed under the header in 4 of 5 tries; the first, right after a find, overshot and didn't recur); Delete of a month's last row; Edit of a standing order and of its next payment through the UI (the edited next payment checked through the payment state); Apple's own Delete; a `removedBuiltIns` stored before this branch (the ids are unchanged); "Pending payments" hiding (something is always pending in the demo data); Show all bookings from each slide; the real macOS Reduce motion setting (nothing new moves); Light at 390px; VoiceOver; and in the baseline the shell items (Light/Dark toggle by its button, page transitions, the status message), the transfer, Buy, User Type, Legibility, Theme switching, the Design system pages beyond loading Components and Character kit without errors, and Tab through Overview.
