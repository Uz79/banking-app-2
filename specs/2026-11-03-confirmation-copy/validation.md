# Confirmation copy (15): validation

Branch: `feature/confirmation-copy`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Test bookings are cleared with Profile's demo reset afterwards.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited

## 2. The transfer (D1 to D4, D7)

- [ ] Now: "Your transfer of CHF … to … is done.", no date, Done
- [ ] Later ("immediately" off, a future date): "… will be made on" and the date
- [ ] Recurring: "Your recurring transfer of … starts on" and the date
- [ ] Both directions (Household to Savings, Savings to Household) name the right account

## 3. The payment (D1 to D3, D5)

- [ ] Now: "Your payment of CHF … to … is done.", no date, no "with sufficient credit"
- [ ] Later (as soon as possible off, a future date): "… will be made on" and the date
- [ ] Recurring: "Your recurring payment of … starts on" and the date
- [ ] Standing order: "Your standing order of … starts on" and the date

## 4. The trade (D6, D7)

- [ ] Buy, limit, Daily order: "Your order to buy", the total, the quantity and name, "has been placed.", "Limit CHF …, valid today", Done
- [ ] Limit with GTC ("valid until cancelled") and with Execute until ("valid until" and the date)
- [ ] Market: "At the market price"
- [ ] Sell: "Your order to sell"

## 5. Everywhere

- [ ] The transfer and payment dialogs read the same from Overview, Account details and Payments (D8)
- [ ] Light and Dark, desktop and 390: the text wraps inside the dialog, nothing is cut off
- [ ] Keyboard: Done is reachable and closes the dialog and the flow, as before
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
