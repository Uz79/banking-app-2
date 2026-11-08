# Display-only rows and account cards against the field anatomy (71): validation

Branch: `feature/display-rows-and-account-cards`. Run on the agent's server (port 5199), then the baseline smoke test. Start after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Payments, Account details, All bookings, the position page (with Buy and Sell opened), Profile and Components

## 2. Display-only value rows (D1, D2)

- [ ] Pay's recipient step: IBAN and Bank Name are 88dp each; Recipient name (a text field) is 88dp too, so the step is an even rhythm
- [ ] The transfer's recipient step: its value rows are 88dp
- [ ] A value that wraps to two lines (a long IBAN at Large type or at 390px) does not push the row past 88dp, or the exception is listed here
- [ ] The edit button keeps its 32dp target and its focus ring is not clipped
- [ ] Account information and Share information look as before (88dp grid, 4px gap)
- [ ] Light and Dark: the underline is the separator colour, one pixel, at the bottom of the 40dp

## 3. Account cards (D3, D4)

- [ ] Pay's Debit account, the transfer's From and To, and the trade sheet's accounts: label 24dp, 4dp, the card at its own height, 4dp, a 16dp reserved row (a script reads the boxes)
- [ ] A field marked `--no-footer` reserves nothing, as before
- [ ] Pay, the transfer, Buy and Sell: the action button is still visible without a new scroll at desktop and at 390px (measure the sheet's content height against its box, before and after)
- [ ] The card's hover, pressed and focus states are unchanged; Tab reaches it and Enter opens the picker
- [ ] The picker still opens and chooses an account; the balance and name stamp as before

## 4. The Components specimen (D6)

- [ ] The Form field section shows the display-only row and the account card with their marks, in Light and Dark, desktop and 390px; no em dashes

## 5. Cross-cutting

- [ ] Legibility Large and Small: nothing overlaps; the reserved rows follow the small text size
- [ ] Keyboard: Tab order unchanged on every flow touched
- [ ] Reduced motion: nothing new animates
- [ ] First visit (nothing in `localStorage`) and a Multi-color theme: the same heights

## 6. Baseline smoke test

Copy the items from `specs/baseline/validation.md` here when the wrap-up group starts, and run them.

Checked on: (not yet run)
