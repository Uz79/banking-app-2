# Built-in transfers name both accounts (50): plan

Branch: `feature/builtin-transfer-accounts`. Decisions are cited as D1 to D5 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The rows (D1, D2)

- [ ] `js/built-in-bookings.js`: `sv-to-savings-2-3` becomes "Transfer to Household" with `from`/`to`; `sv-to-household-320` and `hh-pizza` get `from`/`to`
- [ ] Check: All bookings on Household and on Savings; open each of the three rows' sheets: debit and credit differ and match the row

## 2. One name for Savings (D3, D5)

- [ ] `js/iat-overlay.js`, `js/trade-flow-overlay.js`, `account-details.html`, `payments.html`, `overview.html`: "Savings Account" to "Savings account"
- [ ] Check `findIatAccountKeyByName` and other lookups by name still resolve Savings
- [ ] Check: the transfer sheet and the trade flow show "Savings account"; a transfer made now reads the same on its booking sheet

## 3. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md` (50 to Done, in number order), `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
