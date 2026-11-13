# Banking sheets close on Escape (49): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on Overview, Account details, Custody account, All bookings

## Pay

- [x] Recipient search: Escape closes at once
- [x] Recipient, amount, schedule, summary: Escape asks "Discard payment?"; Escape on the prompt keeps the flow; Discard closes it
- [ ] Editing a payment: Escape asks "Discard changes?"
- [x] With the calendar or a picker open: Escape closes only it; the sheet stays
- [x] After Execute: Escape closes like Done
- [ ] Focus after Escape lands where the X leaves it

## Internal transfer

- [x] Every step: Escape asks "Discard transfer?"; the same keep and discard
- [x] With the calendar or the account picker open: Escape closes only it
- [x] After Execute: Escape closes like Done

## Buy and Sell

- [x] Buy and Sell: Escape asks "Discard order?"; keep and discard
- [x] With the account picker open: Escape closes only it

## Booking sheet

- [x] Escape closes it at once; focus lands on the row
- [x] With the Delete prompt open: Escape keeps the payment

## Cross-cutting

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, desktop and 390px
- [ ] Keyboard only: open, Escape, Escape, Tab order intact
- [ ] Reduced motion (Klaudiusz, macOS setting): close and prompt show no animation

## Baseline smoke test

(Copy `specs/baseline/validation.md` here and tick it. Leave that file unticked.)

Checked on 2026-11-13 against `feature/escape-closes-banking-sheets`, Chrome on the agent's server (5199), Dark theme, desktop (about 1530px). Checked with the real Escape key: Pay's recipient search closing at once; Pay's recipient and schedule steps asking "Discard payment?", Escape on the prompt keeping the flow, a second Escape asking again, Tab to Discard plus Enter closing it; the calendar closing alone on the first Escape; the transfer's prompt, keep and ask again; the transfer's account picker closing alone; Buy's prompt, keep and discard; the booking sheet closing on Escape with focus back on its row; Delete's prompt keeping the payment (the pending list still had 5 rows) and the next Escape closing the sheet. Checked with a synthetic Escape event (which cannot cancel a native dialog, so the keep step was not exercised): the confirmation after Execute closing like Done in Pay, the transfer and Buy; the transfer's and Sell's prompt appearing; Pay on `payments.html`. The build passed and the console showed only the Chrome extension's own "message channel closed" exception. Not checked: 390px (the window would not resize this time); Light; the first visit with empty `localStorage`; reduced motion (macOS setting); VoiceOver; Pay's edit prompt ("Discard changes?"); Sell's keep and discard by the real key; Account and Share information (unchanged, they do not register); the baseline smoke test beyond the Pay, transfer, Buy and Sell, booking sheet and page-load checks above. The 5199 `localStorage` was cleared afterwards.
