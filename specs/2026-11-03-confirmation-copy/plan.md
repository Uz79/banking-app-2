# Confirmation copy (15): plan

Branch: `feature/confirmation-copy`. Decisions are cited as D1 to D11 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The transfer and the payment (D1 to D5, D7 to D9)

- [x] `js/iat-overlay.js`: `paintConfirmationDialog()` sets the lead, the footer and the date from `scheduleStatus()` (D1 to D3); Execute records the transfer, Done only closes (D10)
- [x] `js/payment-overlay.js`: the same, with Recurring and Standing order named apart (D2), and no "with sufficient credit" (D5)
- [x] `overview.html`, `account-details.html`, `payments.html`: the transfer dialog gets the date line (D4); both dialogs' defaults read the executed case; the transfer's button says Done (D7, D8)
- [x] `css/styles.css`: one footer rule for a footer that ends the text (D11)
- [x] Check: a transfer and a payment in each schedule case (now, later, recurring; the payment's standing order too), from Overview, Account details and Payments

## 2. The trade (D6 to D8, D10)

- [x] `js/trade-flow-overlay.js`: "has been placed", and the limit line by validity or the market line (D6); the order button records the order, Done only closes (D10)
- [x] `details-of-position.html`: the defaults and Done (D7, D8)
- [x] Check: Buy and Sell; limit with Daily, GTC and Execute until; market

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 15 marked done; `CHANGELOG.md` under `Unreleased`
