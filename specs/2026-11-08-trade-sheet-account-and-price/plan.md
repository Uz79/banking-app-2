# The trade sheet: account labels and the price (55, 65): plan

Branch: `feature/trade-sheet-account-and-price`. Decisions are cited as D1 to D8 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. Buy: the price and the account label (D1, D2, D5, D6)

- [x] `apps/web/details-of-position.html`: an id on the "Available in" label (`uz-trade-available-label`)
- [x] `apps/web/js/trade-flow-overlay.js`: `paintSummary` writes `live.marketPrice` into the Price row and the total from `orderTotals`; it writes the "Available in <account> account" label (D5)
- [x] Check: Buy with a typed limit of 100.00, Price stays at the market price and the total follows the limit; with Savings chosen the label and balance read Savings; back to Household and they follow; Market hides the limit and Price and total use the market price

## 2. Sell: no "Available in", "Credit account" (D3, D4)

- [x] `apps/web/js/trade-flow-overlay.js`: in `paintForm` or `paintSummary`, hide the "Available in" row for Sell and show it for Buy; the account field's label, the button's `aria-label` and the picker's title read "Credit account" for Sell (`openAccountPicker`, line 580)
- [x] Check: Sell shows Price, Expected total price and In Custody account only; the account field reads "Credit account" and its picker is titled the same; closing and opening Buy again brings back "Debit account" and the row

## 3. Wrap-up

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [ ] `specs/roadmap.md`: 55 and 65 marked done, with what was settled and found
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [ ] `specs/tech-spec.md` and `apps/web/README.md`: no change expected; check
