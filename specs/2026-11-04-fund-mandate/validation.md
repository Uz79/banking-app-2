# Fund the asset management mandate (18): validation

Branch: `feature/fund-mandate`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Test openings and transfers are cleared with Profile's demo reset afterwards.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (only the browser extension's "message channel closed" entries)

## 2. The state and the row (D5 to D8, D12)

- [ ] First visit (`uzBankWebPaymentState` removed): no mandate row, the total 64'900, the transfer's lists Household and Savings only. Checked after the demo reset instead (no mandate row, 64'900); the key itself was not removed, and the lists were not opened with no mandates
- [x] A mandate with nothing funded: "Pending: CHF …" in the secondary style, not in the total
- [x] An executed transfer of CHF 1'000 to it: the row shows CHF 1'000 as a balance, Household drops by 1'000 and the total stays the same (the money moved within it; before this branch it dropped); Household's list shows "Transfer to Asset management" (All bookings)
- [x] A second transfer adds to the balance (the interview: any amount, any number of times); also from Savings
- [x] A pending and a recurring transfer to it: booked, nothing funded (D6)
- [x] After a reload the row and the total are the same
- [x] A stored mandate without `funded`, or with a broken one (`"abc"`), loads as pending
- [x] Past the 100-booking limit, the funded balance stays (D5); the total only lost the test payments
- [x] The demo reset clears the mandates and the funding

## 3. The transfer (D1 to D4, D10, D11)

- [x] "Custody account" is in neither list, on Overview (both), Account details (both) and Payments (credit list; its debit list was not opened)
- [x] With two (and three) mandates, all are in the credit list after Savings, each with its strategy and balance; none is in the debit list
- [ ] Choosing a mandate as credit puts Household as debit; Savings can be picked instead. Savings as debit for a mandate: checked, and the transfer books. The switch to Household when Savings was the debit before picking the mandate was not exercised (Household was already the debit each time)
- [x] `overview.html#iat/fund/{id}` opens the transfer prefilled (on load and on a hash change); an unknown id opens it as usual; back does not reopen it
- [x] Added in the build: a mandate transfer's booking details on Account details show "Asset management" with its strategy

## 4. Completion (D9)

- [x] In the Overview sheet: completion shows the new copy, "Transfer now" (primary) and Done (secondary); "Transfer now" closes the sheet without "Leave for now?" and opens the transfer: Household to this mandate, the opening's amount, Immediately on
- [x] Execute there: the row turns into a balance, Household drops by the amount, the total stays the same
- [x] On `investment-opening.html` on its own: "Transfer now" goes to Overview with the transfer open, prefilled
- [x] Done still closes as before (focus back on Investment, no transfer)

## 5. Everywhere

- [ ] Light and Dark, desktop and 390: the row, the picker with mandates and the completion buttons fit, nothing cut off. Checked: Light desktop (all three), Dark desktop (picker), Dark 390 (row, picker, completion). Not checked: Light at 390. At 390 a pending row wraps "Asset management" onto two lines, as before this branch; the funded row fits on one
- [x] A Multi-color theme (Custom 01): the row and the buttons take the theme
- [ ] Keyboard: "Transfer now" and Done reachable; the picker's mandates reachable and selectable. Checked: the picker opens with Enter, Tab reaches each mandate, Enter selects it and focus returns to the field. Not checked: tabbing to "Transfer now" and Done (plain buttons in the actions row)
- [x] No em dashes in the new copy

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (extension entries only)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop. Light and Dark desktop, Dark 390
- [x] ★ Light/Dark toggle switches instantly and survives a reload (and page loads)
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions. The pages load and back works; the direction of each transition was not judged
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. Not confirmed: nothing new appeared in 14 s on Overview on desktop

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update. Checked on desktop in Light (a Multi-color theme): CHF 500 to Anna Ricci, Household 2'400 to 1'900. Not repeated in Dark or at 390
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed ("Discard order?", Discard)
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider changes the character (Financial knowledge to high added the hat). Not repeated in Dark or at 390; the title stayed Newbie for that one slider
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work. Compact checked, then the stored setting restored; Typeface, Font and Paddings not exercised
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly (no colour override left). Light desktop only
- [x] Demo data reset restores the Household balance (9'900: 10'000 less today's fixed 100)

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move. The hub shows them (and Payday run); the hover motion was not checked
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (checked from the Character kit)
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (the first six stops)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: a system setting the agent cannot change

Checked on 2026-11-04 against `feature/fund-mandate` (e8b85e1 plus the wrap-up docs), Chrome on the agent's server (5199), desktop 1512 wide and a 390x760 frame, Light and Dark, the UZ Bank theme and Custom 01, by script through `UZBankPayState` and by hand. Not checked: Light at 390; keyboard to "Transfer now" and Done; the Household switch when Savings was the debit; the first visit with the key removed; reduced motion; the baseline's transition directions, the status message, Pay in Dark and at 390, Legibility's manual settings and the hub's hover motion. Test data cleared with the demo reset; legibility, Light mode, the UZ Bank theme and User Type restored.
