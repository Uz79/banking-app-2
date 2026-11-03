# Fund the asset management mandate (18): validation

Branch: `feature/fund-mandate`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Test openings and transfers are cleared with Profile's demo reset afterwards.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited

## 2. The state and the row (D5 to D8, D12)

- [ ] First visit (`uzBankWebPaymentState` removed): no mandate row, the total 64'900, the transfer's lists Household and Savings only
- [ ] A mandate with nothing funded: "Pending: CHF …" in the secondary style, not in the total
- [ ] An executed transfer of CHF 1'000 to it: the row shows CHF 1'000 as a balance, the total grows by 1'000, Household drops by 1'000; Household's list shows "Transfer to Asset management"
- [ ] A second transfer adds to the balance (the interview: any amount, any number of times)
- [ ] A pending and a recurring transfer to it: booked, nothing funded (D6)
- [ ] After a reload the row and the total are the same
- [ ] A stored mandate without `funded`, or with a broken one, loads as pending
- [ ] Past the 100-booking limit, the funded balance stays (D5)
- [ ] The demo reset clears the mandates and the funding

## 3. The transfer (D1 to D4, D10, D11)

- [ ] "Custody account" is in neither list, on Overview, Account details and Payments
- [ ] With two mandates, both are in the credit list after Savings, each with its strategy and balance; neither is in the debit list
- [ ] Choosing a mandate as credit puts Household as debit; Savings can be picked instead
- [ ] `overview.html#iat/fund/{id}` opens the transfer prefilled; an unknown id opens it as usual

## 4. Completion (D9)

- [ ] In the Overview sheet: completion shows the new copy, "Transfer now" (primary) and Done (secondary); "Transfer now" closes the sheet without "Leave for now?" and opens the transfer: Household to this mandate, the opening's amount, Immediately on
- [ ] Execute there: the row turns into a balance, the total grows
- [ ] On `investment-opening.html` on its own: "Transfer now" goes to Overview with the transfer open, prefilled
- [ ] Done still closes as before

## 5. Everywhere

- [ ] Light and Dark, desktop and 390: the row, the picker with mandates and the completion buttons fit, nothing cut off
- [ ] A Multi-color theme: the row and the buttons take the theme
- [ ] Keyboard: "Transfer now" and Done reachable; the picker's mandates reachable and selectable
- [ ] No em dashes in the new copy

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

Checked on: not yet.
