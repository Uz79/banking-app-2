# Booking balance: a dropped booking keeps its money (14): plan

Branch: `feature/booking-balance`. Decisions are cited as D1 to D9 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The carry (D1 to D7)

- [x] `js/payment-state.js`: `carried` in `defaultState()`, `loadState` (read when valid, else zeros; trim the loaded list) and `saveState`
- [x] `js/payment-state.js`: one `trimBookings()` that drops the oldest past `MAX_BOOKINGS` and carries each executed one (D1, D4); used by `commitPayment`, `commitInternalTransfer`, `commitTradeOrder` and `loadState`
- [x] `js/payment-state.js`: `accountRunningBalance` adds `carried[key]`; `todayBalance` subtracts `householdOut` (D2, D3)
- [x] `js/payment-state.js`: the comment block at the top (the shape, the limit, the carry)
- [x] `js/payment-state.js` and `js/all-bookings.js`: `getState()` returns `carried`; All bookings' Today header adds it (D10, found in the build)
- [x] Check: from a reset, 110 payments of CHF 10 by script leave Household at 9'900 − 1'100 = 8'800 and the list at 100. A transfer pushed past the limit keeps Household and Savings. A pending payment dropped changes nothing. A reload keeps it all. Overview, Account details and All bookings agree. The demo reset restores 9'900 and 25'000

## 2. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 14 marked done, and the edit bug as a new item; `CHANGELOG.md` under `Unreleased`; `apps/web/README.md` (the state's `carried`); `specs/tech-spec.md` only if its description of the payment state needs it
