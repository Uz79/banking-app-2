# Standing orders: the rule and its payments (47), with dates from today (53): plan

Branch: `feature/standing-orders`. Decisions are cited as D1 to D15 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. Dates from today (53; D12 to D14)

- [x] `apps/web/all-bookings-and-payments.html`: `data-builtin-id` on Rent, Netflix and Internet & Phone; the rows' derivation data (`data-offset-days` on Pending, `data-day-of-month` on Recurring)
- [x] `apps/web/js/all-bookings.js` (or a small helper beside it): set each built-in row's `data-execute-on` and its group label from today, re-sort the groups by date before the month bands
- [x] `apps/web/account-details.html`: Apple's date (+1 working day)
- [x] Check: Pending and Recurring dates are after today, in date order, the month bands right; a weekend day of month moves to Monday

## 2. The rule's sheet (47; D1 to D6)

- [x] `apps/web/js/payment-details.js`: a rule's data (`rule: true`, frequency, next execution) from a Recurring row or a recurring booking; the `pd--rule` variant: title, "Active" chip, Frequency and Next execution rows; `bookingActions`: rule Edit and Copy (transfer: none)
- [x] The sheet markup on each page that has it: the Frequency and Next execution rows (hidden unless `pd--rule`); `apps/web/css/styles.css`: what `pd--rule` hides and shows
- [x] Edit on a rule (all future, D5), built-in replaced via `removedBuiltIns`; Copy as a single payment
- [x] Check: Rent's sheet, an app-made standing order's sheet, Edit then the Recurring tab and a reload

## 3. The next instance in Pending (47; D7 to D11)

- [x] `apps/web/js/all-bookings.js`: one derived row per rule in the Pending tab (`data-source="rule"`, `data-rule-id`, `data-occurrence`), hidden where a stored booking has that rule and occurrence
- [x] `apps/web/js/payment-details.js`, `apps/web/js/payment-overlay.js`, `apps/web/js/payment-state.js`: an instance's sheet (Pending, Edit, Copy); its Edit stores a pending booking with `ruleId` and `occurrence`
- [x] Check: Rent, Netflix and Internet & Phone in Pending with the chip; edit Rent's instance: one row, the new amount, the rule unchanged; delete the edit: the derived instance is back

## 4. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line (partly: see its "Not checked")
- [x] Docs: `specs/roadmap.md` 47 and 53 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`: a Decisions row for standing orders (the rule, derived instances, edits as exceptions); no new storage key
