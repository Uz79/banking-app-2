# Standing orders: the rule and its payments (47), with dates from today (53): validation

Branch: `feature/standing-orders`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings, Account details and Overview, with each sheet opened and each edit made

## 2. Dates from today (53; D12 to D15)

- [x] First visit (after the reset): every built-in Pending and Recurring date is after today
- [x] Swisscom and Helvetia Insurance 2 working days ahead, Tax office Zurich 6; Rent on the 1st, Netflix and Internet & Phone on the 5th (a weekend moves to Monday)
- [x] Groups in date order in both tabs; the month bands and month chips match (bands checked, and the re-sort with today set to 03.11.2026; month chips belong to Executed)
- [x] Edit on Swisscom and on Apple opens Pay on the row's date (Swisscom through Edit; Apple's date set to 09.11.2026, its Edit not opened)
- [x] A standing order made in the app keeps its date

## 3. The rule's sheet (D1 to D6)

- [x] Rent in Recurring: "Standing order", Status "Active", Frequency "Monthly", Next execution with its date; no Booking confirmation or Signed
- [x] A standing order and a recurring payment made in the app: the same (the edited Rent; one made through the state)
- [x] A recurring transfer made in the app: its accounts, "Active", Frequency, Next execution, no bar
- [x] Edit on Rent: Pay on Standing order or Recurring, its date; Execute: the Recurring tab shows the edited rule, Rent's built-in row is gone, also after a reload; Pending shows the new amount
- [x] Copy on Rent: Pay as a new single payment, as soon as possible; the rule unchanged
- [x] Rent in the Executed tab: still an Executed payment sheet with Copy

## 4. The next instance in Pending (D7 to D11)

- [x] Pending lists Rent, Netflix and Internet & Phone on their next dates with the "Pending" chip, among the other pending payments in date order
- [x] A standing order made in the app shows its next payment in Pending too
- [x] An instance's sheet: Pending, Edit and Copy
- [x] Edit on Netflix's instance, a new amount: one Netflix row in Pending with it; the rule in Recurring unchanged; after a reload the same
- [x] Delete that edited payment: the derived instance is back with the rule's amount
- [x] Search finds an instance; "No pending payments." never shows while a rule exists

## 5. Look and access

- [x] Desktop (1440px) and 390px, Light and Dark: the rule's sheet and the Pending rows (desktop Light and Dark; 390px Light)
- [ ] A Multi-color theme: the "Active" chip and the new rows take the theme
- [x] Keyboard: the rule's sheet's bar (Edit, Copy) in order, visible focus, Enter and Space work
- [ ] Reduced motion: the sheet opens and closes without sliding, as before

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work (tabs and search)

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

Checked on 2026-11-06 against `feature/standing-orders`, Chrome (Claude in Chrome) on the agent's server (port 5199), desktop 1483px and 390px (a same-origin iframe), Light and Dark (set through `UZBankApplyThemeChoice`), All bookings on `?account=household`; flows driven by scripts, keyboard by real Tab. Not checked: a Multi-color theme, Dark at 390px, the real macOS Reduce motion setting, a weekend day of month on a real date (only Netflix's 05.12.2026 moving to 07.12.2026), and in the baseline the Light/Dark toggle by click, page transitions, the status message, User Type, Legibility, Theme, the Design system pages and Tab through Overview.

Checked on 2026-11-06 by Klaudiusz, by hand: phone width passed.
