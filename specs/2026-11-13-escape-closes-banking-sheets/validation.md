# Banking sheets close on Escape (49): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Account details, Custody account, All bookings

## Pay

- [ ] Recipient search: Escape closes at once
- [ ] Recipient, amount, schedule, summary: Escape asks "Discard payment?"; Escape on the prompt keeps the flow; Discard closes it
- [ ] Editing a payment: Escape asks "Discard changes?"
- [ ] With the calendar or a picker open: Escape closes only it; the sheet stays
- [ ] After Execute: Escape closes like Done
- [ ] Focus after Escape lands where the X leaves it

## Internal transfer

- [ ] Every step: Escape asks "Discard transfer?"; the same keep and discard
- [ ] With the calendar or the account picker open: Escape closes only it
- [ ] After Execute: Escape closes like Done

## Buy and Sell

- [ ] Buy and Sell: Escape asks "Discard order?"; keep and discard
- [ ] With the account picker open: Escape closes only it

## Booking sheet

- [ ] Escape closes it at once; focus lands on the row
- [ ] With the Delete prompt open: Escape keeps the payment

## Cross-cutting

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, desktop and 390px
- [ ] Keyboard only: open, Escape, Escape, Tab order intact
- [ ] Reduced motion (Klaudiusz, macOS setting): close and prompt show no animation

## Baseline smoke test

(Copy `specs/baseline/validation.md` here and tick it. Leave that file unticked.)

Checked on: not yet run.
