# Fund the asset management mandate (18): plan

Branch: `feature/fund-mandate`. Decisions are cited as D1 to D14 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The state and the Overview row (D5 to D8, D12)

- [x] `js/payment-state.js`: `funded` on mandates (normalised, default 0); a transfer to a mandate key adds to `funded` when executed and books only the out-leg (D5, D6); `commitMandate` returns the new id; the Overview total counts `funded` (D8)
- [x] `js/data-render.js`: the row shows "Pending: CHF …" until funded, then the funded balance (D7)
- [x] Check (by script through `UZBankPayState`): an executed, a pending and a recurring transfer to a mandate; the row, the total, Household; a reload; a stored state without `funded`

## 2. The transfer (D1 to D4, D11)

- [ ] `js/iat-overlay.js`: Custody account out (D11); mandates from the state as credit accounts only, after Household and Savings (D1 to D3); Household as the debit default for a mandate (D4); `__UZ_IAT_OPEN` takes a prefill (from, to, amount); the `#iat/fund/{id}` route (D10)
- [ ] `js/form-field-sheet.js` only if the picker needs a second line for the strategy
- [ ] Check: the credit list on Overview, Account details and Payments with none, one and two mandates; a real transfer to a mandate from Household and from Savings; the confirmation names "Asset management"

## 3. Completion (D9, D10)

- [ ] `js/investment-opening.js`, `js/investment-opening-config.js`: "Transfer now" and the new copy; in a sheet it posts a message with the mandate id and amount, on its own page it goes to `overview.html#iat/fund/{id}`
- [ ] `js/fridge-advisor-sheet.js`: on that message, close the sheet without asking and open the transfer prefilled
- [ ] Check: open an account through the opening in the Overview sheet, "Transfer now", Execute; the row turns into a balance and the total stays the same. The same from `investment-opening.html` on its own

## 4. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/tech-spec.md` ("Opened products" in the Decisions); `specs/roadmap.md` 18 marked done; `CHANGELOG.md` under `Unreleased`; `apps/web/README.md` only if a key or file changed (none planned)
