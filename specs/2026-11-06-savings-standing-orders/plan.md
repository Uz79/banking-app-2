# Savings' standing orders (59, with 57): plan

Branch: `feature/savings-standing-orders`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. Rent and Internet & Phone back on Savings (D1, D2, D9)

- [x] `apps/web/all-bookings-and-payments.html`: the Recurring groups of Rent and Internet & Phone get `data-account="savings"` (split from Netflix's group as needed)
- [x] Check: Savings' Recurring lists Rent and Internet & Phone, its Pending their next payments; Household's lists Netflix and its next payment, and the one-offs

## 2. The sheets name the row's account (D8, 57)

- [x] `apps/web/js/payment-details.js`: the row's own account (`rowAccountKey`: its group's `data-account`, a stored booking's `accountKey`, a next payment's rule), used by the edit context in group 3
- [x] Check: every rule's and next payment's sheet, on both accounts: no debit account shows in the payment sheet (57, see Found in the build)

## 3. Pay books from the row's account (D3 to D7, D10)

- [x] `apps/web/js/payment-state.js`: `commitPayment` and `updatePayment` keep `payment.accountKey`
- [x] `apps/web/js/payment-details.js`: the edit context (Edit and Copy) carries `accountKey`
- [x] `apps/web/js/payment-overlay.js`: `live.debitKey`, the Debit account card painted from it, the over-balance check against its balance; `apps/web/js/data-render.js` paints the card's balance for the account it names
- [x] Check: Edit of Rent's next payment on Savings, Edit of the Rent rule, Copy of a Savings payment: each lands on Savings (list, sheet, balance); a fresh Pay is Household's as before

## 4. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 59 and 57 done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the Booking rows and Standing orders rows: a row's account, Pay's debit account)
