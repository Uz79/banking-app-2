# Confirmation copy (15): validation

Branch: `feature/confirmation-copy`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Test bookings are cleared with Profile's demo reset afterwards.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (a browser extension's "message channel closed" entries aside)

## 2. The transfer (D1 to D4, D7, D10)

- [x] Now: "Your transfer of CHF 500.00 to Savings Account is done.", no date, Done; both legs booked on Execute, nothing more on Done
- [x] Later ("Immediately" off): "… will be made on 03.11.2026", booked as pending. The date can't be picked (it stays today; roadmap 28), so a future date was not seen
- [x] Recurring: "Your recurring transfer of … starts on 03.11.2026", booked as recurring
- [x] Both directions: Household to Savings on Overview, Savings to Household on Payments ("… to Household is done.")

## 3. The payment (D1 to D3, D5)

- [x] Now: "Your payment of CHF 500.00 to Hans Meyer is done.", no date, no "with sufficient credit"
- [x] Later (as soon as possible off): "… will be made on 03.11.2026", booked as pending (on Overview and on Account details); the date is today, as above
- [x] Recurring: "Your recurring payment of … starts on 03.11.2026"
- [x] Standing order: "Your standing order of … starts on 03.11.2026"

## 4. The trade (D6, D7, D10)

- [x] Buy, limit, Daily order: "Your order to buy CHF 20'020.00 100 pcs. Apple Inc. has been placed. Limit CHF 200.20, valid today", Done; one booking on the order button, none on Done
- [x] Limit with GTC ("valid until cancelled") and with Execute until ("valid until 03.11.2026")
- [x] Market: "At the market price" (the order type set through its select by script)
- [x] Sell: "Your order to sell"
- [x] X and Discard on an unsent order book nothing

## 5. Everywhere

- [x] The transfer and payment dialogs read the same from Overview, Account details and Payments (D8; the transfer's markup is identical in the three files)
- [x] Light (desktop) and Dark (390 frames: the recurring transfer and the trade's limit line, the longest texts): the text wraps inside the dialog, nothing is cut off
- [x] Keyboard: Done is reachable with Tab, shows its ring, and Enter closes the dialog and the flow. A second Enter on Execute or the order button, which keep the focus behind the dialog, records nothing more (found in the build, D10)
- [x] No em dashes in the new copy

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop, the character lower right) and with the tab bar in a 390 frame in Dark
- [x] ★ Light/Dark toggle switches and survives a reload (desktop)
- [x] Navigating Overview → Account details → All bookings and back by the back links (the transitions' directions not judged)
- [x] The "Open payment!" status message is there on Overview; a tap dismisses it (the 12 s not timed)

### 3. Banking flows

- [x] ★ Pay: recipient → amount → schedule → summary → Execute in four schedule cases; the bookings are stored (desktop, Light; at 390 only the transfer and the trade dialogs, by script)
- [x] Internal transfer completes (now, later, recurring; both directions)
- [x] Custody account → Apple Inc. → Buy opens the trade flow and is dismissed (X, Discard)
- [x] All bookings: the tabs switch, the Apr chip scrolls to April, "Migros" finds 2

### 4. Profile

- [x] ★ User Type: End on financial knowledge puts the wizard hat on the character; Home puts it back (desktop)
- [x] Legibility: Compact changes the stored scale; the stored value set back exactly as found (Large). Typeface, Font and Paddings not tried
- [x] ★ Theme: Custom 06 sets the accent (`#e06900`); the UZ Bank card restores `#00157E` with no stored override (desktop, Light)
- [x] Demo data reset restores the Household balance (9'900, Savings 25'000)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components, Character kit and Payday run (the arrows' motion not judged)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (from the Character kit)
- [x] The Character kit specimen loads and "Max · Power user" changes the figure

### 6. Accessibility

- [x] Tab through Overview (14 presses, real keys): a ring on every stop
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: the system setting was not switched; this branch adds no motion

Checked on 2026-11-04 against `feature/confirmation-copy`, Chrome on the agent's server (port 5199): desktop at 1512 wide in Light, 390 frames in Dark; real clicks and keys through every schedule case of the transfer, the payment and the trade, reading the dialog's text and the stored bookings after each; Overview, Account details, Payments and the Apple Inc. position. The test bookings were cleared with the demo reset; theme (Light, UZ Bank), legibility (Large) and User Type left as found. Not checked: a future execution date (none can be picked, roadmap 28), Safari, a touch device, a screen reader, the system reduced-motion setting, the payment dialog at 390, Dark at desktop width, Typeface, Font and Paddings.
