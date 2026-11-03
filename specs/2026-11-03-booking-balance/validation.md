# Booking balance: a dropped booking keeps its money (14): validation

Branch: `feature/booking-balance`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Bookings past the limit are made by script through `window.UZBankPayState`; the real sheets are used where an item says so.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on Overview, Account details and All bookings

## 2. The carry (D1 to D6)

- [ ] First visit (nothing in `localStorage`): Household 9'900, Savings 25'000, the totals as before
- [ ] From a reset, 110 executed payments of CHF 10: the list holds 100, Household shows 8'800 on Overview, Account details and All bookings, and the Today header on Account details matches
- [ ] A transfer of CHF 1'000 Household to Savings, then enough payments to drop both of its legs: Household and Savings still include it
- [ ] A pending payment and a recurring payment dropped by the limit: no balance changes
- [ ] A trade (Buy) dropped by the limit keeps its debit
- [ ] After a reload, every balance is the same as before it
- [ ] A stored state without `carried` (an older one) loads with nothing carried and the same balances as before this branch
- [ ] A broken `carried` (a field not a number) loads as zeros
- [ ] Past the limit, a real payment through the Pay sheet and a real internal transfer through its sheet update the balances by exactly their amounts
- [ ] The available balance in the transfer and trade sheets matches the account's balance past the limit
- [ ] The demo reset restores 9'900 and 25'000 with nothing carried
- [ ] Light and Dark, desktop and 390: the balances and lists look as before (nothing visible changes)

## 3. Baseline smoke test

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
