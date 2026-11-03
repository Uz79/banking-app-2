# Booking balance: a dropped booking keeps its money (14): validation

Branch: `feature/booking-balance`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Bookings past the limit are made by script through `window.UZBankPayState`; the real sheets are used where an item says so.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on Overview, Account details and All bookings (read on the tab after the walk)

## 2. The carry (D1 to D6)

- [x] First visit (`uzBankWebPaymentState` removed; the theme and legibility keys left): Household 9'900, Savings 25'000, Overview's total 64'900, nothing carried
- [x] From a reset, a transfer of CHF 1'000, a pending and a recurring payment, a trade of CHF 50, then 110 payments of CHF 10: the list holds 100; Household 7'750 (9'900 − 1'000 − 50 − 1'100), Savings 26'000, Overview's total 63'750, Account details' 33'750 and its Today header 7'750, shown alike on Overview, Account details and All bookings. Without the carry the same list gives 8'900 and 25'000
- [x] A transfer of CHF 1'000 Household to Savings, then enough payments to drop both of its legs: Household and Savings still include it (carried −1'150 and +1'000)
- [x] A pending payment (CHF 7) and a recurring payment (CHF 9) dropped by the limit: nothing carried for them
- [x] A trade (Buy, CHF 50, by script) dropped by the limit keeps its debit
- [x] All bookings' Today header: a new CHF 10 payment that dropped an old CHF 10 one moved Household's header from 22'170 to 22'160 and left Savings' at 26'820 (D10, found and fixed in the build; before the fix it stayed put)
- [x] After a reload, every balance is the same as before it (also in Node)
- [x] A stored state without `carried` loads with nothing carried: 8'900 and 25'000, what the branch before would show for the same list
- [x] A broken `carried` (`'x'`, `null`, `Infinity`) loads as zeros
- [x] Past the limit, a real payment (Lena Fischer, CHF 500, Pay sheet) took Household from 7'750 to 7'250, and a real internal transfer (CHF 500 to Savings) to 6'750 and Savings to 26'500, the total unchanged; both dropped an old booking, which was carried
- [x] The available balance matches past the limit: the Pay sheet's debit account and the transfer sheet show 7'250 and 26'000, the Buy sheet "Available in Household account CHF 6'750"
- [x] The demo reset (Profile's button, after 105 payments) restores 9'900 and 25'000 with nothing carried
- [x] Light (desktop) and Dark (desktop, and 390 frames of Overview, Account details and All bookings for both accounts): the balances and lists look as before, no sideways scroll

## 3. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop, the character lower right) and with the tab bar in a 390 frame in Dark
- [x] ★ Light/Dark toggle switches and survives a reload (desktop)
- [x] Navigating Overview → Account details → All bookings and back (the transitions' directions not judged)
- [x] The "Open payment!" status message is there on Overview; a tap dismisses it (the 12 s not timed)

### 3. Banking flows

- [x] ★ Pay: recipient → amount → schedule → summary → Execute; the balance and bookings update (desktop, Light; not at 390). The schedule step names Hans Meyer, known
- [x] Internal transfer completes
- [x] Custody account → Apple Inc. → Buy opens the trade flow and is dismissed (X, Discard)
- [x] All bookings: the tabs switch, a month chip clicks without error (its effect not judged), "Migros" finds 2

### 4. Profile

- [x] ★ User Type: End on financial knowledge puts the wizard hat on the character; Home puts it back (desktop)
- [x] Legibility: Compact changes the stored scale; the stored value set back exactly as found (Large). Typeface, Font and Paddings not tried
- [x] ★ Theme: Custom 06 recolours Overview (orange actions and chart); the UZ Bank card restores the navy look (desktop)
- [x] Demo data reset restores the Household balance (9'900)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components, Character kit and Payday run (the arrows' motion not judged)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and "Max · Power user" changes the figure

### 6. Accessibility

- [x] Tab through Overview (14 presses, real keys): focus always visible, a 1 to 2px outline, on the action buttons a ring on their circle
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: the system setting was not switched; this branch changes no motion

Checked on 2026-11-03 against `feature/booking-balance`, Chrome on the agent's server (port 5199): desktop at 1512 wide, the phone as 390 frames in Dark; Light, Dark and Custom 06; the carry through `UZBankPayState` calls and also in Node, the real Pay, transfer and Buy sheets, Profile's reset button, real keys for the slider and the focus walk. The test payments were cleared with the demo reset; theme, legibility and User Type left as found. Not checked: the system reduced-motion setting, the starred baseline items at 390 other than Overview (Pay, User Type, Theme), the month chips' effect, Typeface, Font and Paddings, a real trade past the limit (by script only).
