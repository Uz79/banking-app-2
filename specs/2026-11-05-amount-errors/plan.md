# Amount errors: an invalid amount shows where the error is (54): plan

Branch: `feature/amount-errors`. Decisions are cited as D1 to D17 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The shared error and the trade (D1 to D9, D11, D14)

- [x] `apps/web/js/field-error.js` (new): `UZBankFieldError.show` and `clear`; the row, `aria-invalid`, `aria-describedby`, `aria-live` (D2, D11)
- [x] `apps/web/css/styles.css`: the error stroke on `.amount-input`; the info row hidden while the error shows (D1, D3)
- [x] `apps/web/js/trade-flow-overlay.js`: check Amount and Limit price on blur after typing, live once shown, all on Confirm with focus to the first; no check on close; clear on open (D4 to D10)
- [x] Load `js/field-error.js` on `details-of-position.html` before the trade script (D2)
- [x] Check: Buy and Sell with empty, 0, more shares than held, a total over Household; Tab past without typing; X after typing; switch the debit account with an error showing

## 2. Pay and the transfer (D4 to D8, D10, D13)

- [x] `apps/web/js/payment-overlay.js`: the amount step's checks (empty, zero) on blur and Confirm; Execute of a now payment over Household's balance goes back to the amount step with the error (D10)
- [x] `apps/web/js/iat-overlay.js`: the amount as typed (D13); the same checks; Execute of a now transfer over the debit account's balance goes back (D10)
- [x] Load `js/field-error.js` on `overview.html`, `payments.html`, `account-details.html`, `all-bookings-and-payments.html` (D2)
- [x] Check: Pay and the transfer with empty, 0, over the balance now, over the balance later (no error), from Overview, Payments, Account details and All bookings

## 3. "share" and "shares" (D12)

- [x] `apps/web/js/trade-flow-overlay.js`, `js/details-of-position.js`, `js/investment-positions.js`, `js/payment-details.js`, `details-of-position.html`: number first, "share" or "shares"
- [x] Check: the trade sheet, the position page's Quantity, the Custody account list, a trade booking's sheet

## 4. Wrap-up

- [x] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with VoiceOver, the baseline smoke test and the dated "Checked on" line: run except VoiceOver and Reduce motion, left for Klaudiusz
- [x] Docs: `specs/roadmap.md` 54 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`: a Decisions row for field errors (when they show, the shared helper); no new storage key
