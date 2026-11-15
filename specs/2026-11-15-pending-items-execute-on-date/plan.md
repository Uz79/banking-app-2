# Pending payments and transfers execute on their date (37): plan

Branch: `feature/pending-items-execute-on-date`. Decisions are cited as D1 to D12 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; stop it when done). A run changes `localStorage`, so use `?today=YYYY-MM-DD` and clear storage between cases.

## 1. The date rule (D4, D5)

- [x] `apps/web/js/payment-state.js`: `nextDueDate(frequency, anchorDay, after)` for `'monthly'` (last day of a short month, weekend to Monday), a clear error for any other frequency; its own small `today()` with `?today=` (D11): `built-in-bookings.js` loads after it, so the helper is duplicated, not shared
- [x] Check: from the console, dates for 31 January, 29 February, a rule on a Saturday; an unknown frequency throws

## 2. One-off items run (D1, D2, D3, D7)

- [x] `apps/web/js/payment-state.js`: `runDue()` runs every stored pending item due today or earlier: status and `executeOn` removed, `dateISO` its execute date at local noon, both legs of a transfer, a mandate credited; called on load, `pageshow` and `visibilitychange`; dispatches the change event once
- [x] Check: a payment pending for a later date, opened with `?today=` on that date, is executed under that day and the balance has moved; opened a day before it is still pending

## 3. Rules repeat (D4, D5, D6, D10)

- [x] `apps/web/js/payment-state.js`: for a stored rule, each due period becomes an executed booking with `ranOf` and `occurrence` (up to 12), the rule's `executeOn` and `anchorDay` move on
- [x] No change needed in `built-in-bookings.js`, `all-bookings.js` or `data-render.js`: an executed occurrence is a plain executed booking (no `ruleId`), Pending shows the rule's next payment, a deleted rule keeps what ran (checked in the browser)
- [x] Check: a Recurring payment started on a past date, opened with `?today=` three months later, shows three executed bookings and one pending; delete the rule, the three stay

## 4. The status message (D8)

- [x] `apps/web/js/status-feed.js`, fed by `takeRunNotes()` in `payment-state.js`: one info message naming what ran, once per load or return, nothing when nothing ran
- [x] Check: the message names one payment, and "3 payments ran." for a catch-up; none on a plain load

## 5. Wrap-up

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it): not run in full, see its "Checked on" line
- [x] `specs/roadmap.md`: 37 marked done and moved to Done; 45 gets a pointer to D4's function
- [x] `specs/tech-spec.md`: the Standing orders and Demo data rows (and the booking shape) gain the run rule
- [x] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [x] `apps/web/README.md`: the booking shape if it lists fields (`ranOf`, `occurrence`, `anchorDay`); check
