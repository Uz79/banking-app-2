# Demo data moves with the real date (62, with 69): plan

Branch: `feature/demo-data-dates`. Decisions are cited as D1 to D17 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The list and its dates (D1 to D7, D16)

- [x] `apps/web/js/built-in-bookings.js` (new): `UZBankBuiltInBookings` with each account's executed, pending and standing-order bookings and their date rules; `today()` honouring `?today=` on localhost and `*.local` only; the date helpers moved from `dateBuiltInRows` in `js/data-render.js`
- [x] Household's five months authored (D6); Savings' rows re-dated (D7); the open question on the monthly transfer settled and recorded in `requirements.md` (D18; D19 found on the way)
- [x] Loaded before `js/data-render.js` on `all-bookings-and-payments.html` and `account-details.html` (the other pages that load `data-render.js` list no built-in rows; `dateBuiltInRows` returns early without the list)
- [x] Check in the console on both pages: the list for today, for `?today=2026-12-01`, `?today=2027-01-04` and a Saturday; no date after today in Executed; Rent on the 1st, Internet & Phone and Netflix on the 5th, Salary on the 25th; a 31st one-off lands on a short month's last day

## 2. Balances (D8 to D11, D17)

- [x] `apps/web/js/payment-state.js`: `STATIC_TODAY_OUTFLOW` and `staticTodayOutflow()` go (D10); the header figures (`todayBalance`, `yesterdayBalance`) give way to a per-day balance worked out from the list and the stored bookings (D8), in one place both pages call (`days` and `balanceAt` in `js/built-in-bookings.js`)
- [x] `apps/web/js/data-render.js`: `renderDayBalances` follows; Overview and Account details show Household at 10'000.00 after the reset
- [x] Check: Household reads 10'000.00 on Overview, Account details, All bookings and Pay's Debit account card after the reset; a payment of 120 now makes it 9'880.00 everywhere; Overview's total adds up

## 3. All bookings from the list (D2, D12, D13)

- [ ] `apps/web/all-bookings-and-payments.html`: the built-in groups, their dividers and the fixed month chips leave the markup; the panels, their empty lines and the bars stay
- [ ] `apps/web/js/all-bookings.js`: render the account's groups from the list (with day balances), the in-app executed bookings in their day's group (D12), then the chips from the months listed (D13), before the sync, the bands, the spy and search; the standing orders' next payments read their rules from the list (D15's move)
- [ ] Check: both accounts, all three tabs; the bands and chips match (five months, the newest active); a chip scrolls to its band; Delete of a month's last row; Edit and Copy of a built-in pending row and a standing order; search

## 4. Account details from the list (D11, D14, D15)

- [ ] `apps/web/account-details.html`: the hand-written groups leave both panels; the "Pending payments" line on both, without its date
- [ ] `apps/web/js/data-render.js`: each panel's two newest days with bookings from the list and the stored bookings; the pending line's total from the shared next-payment derivation, hidden when nothing is pending
- [ ] Check: both carousel slides; Today, Yesterday or a date as labels; Apple not under a day; the pending line's total equals what Household's Pending tab lists, before and after a pending payment made in Pay; a row's sheet, Edit and Delete as before

## 5. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 62 and 69 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the "Standing orders" row's date helper, a new row for the built-in list, worked-out balances and the booked balance; `js/built-in-bookings.js` under Other systems); `apps/web/README.md` (the new file, and `?today=` as a dev URL parameter)
