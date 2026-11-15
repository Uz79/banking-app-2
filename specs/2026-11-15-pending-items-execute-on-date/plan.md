# Pending payments and transfers execute on their date (37): plan

Branch: `feature/pending-items-execute-on-date`. Decisions are cited as D1 to D12 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; stop it when done). A run changes `localStorage`, so use `?today=YYYY-MM-DD` and clear storage between cases.

## 1. The date rule (D4, D5)

- [ ] `apps/web/js/payment-state.js`: `nextDueDate(frequency, anchorDay, after)` for `'monthly'` (last day of a short month, weekend to Monday), a clear error for any other frequency; one shared `today()` (D11, open question)
- [ ] Check: from the console, dates for 31 January, 29 February, a rule on a Saturday; an unknown frequency throws

## 2. One-off items run (D1, D2, D3, D7)

- [ ] `apps/web/js/payment-state.js`: `runDue()` runs every stored pending item due today or earlier: status and `executeOn` removed, `dateISO` its execute date at local noon, both legs of a transfer, a mandate credited; called on load, `pageshow` and `visibilitychange`; dispatches the change event once
- [ ] Check: a payment pending for a later date, opened with `?today=` on that date, is executed under that day and the balance has moved; opened a day before it is still pending

## 3. Rules repeat (D4, D5, D6, D10)

- [ ] `apps/web/js/payment-state.js`: for a stored rule, each due period becomes an executed booking with `ranOf` and `occurrence` (up to 12), the rule's `executeOn` and `anchorDay` move on
- [ ] `apps/web/js/built-in-bookings.js`, `all-bookings.js`, `data-render.js`: read executed occurrences as plain executed bookings (no `ruleId`), Pending shows the next payment, a deleted rule keeps what ran
- [ ] Check: a Recurring payment started on a past date, opened with `?today=` three months later, shows three executed bookings and one pending; delete the rule, the three stay

## 4. The status message (D8)

- [ ] `apps/web/js/payment-state.js` and `js/status-feed.js` (or `status-message.js`): one info message naming what ran, once per load or return, nothing when nothing ran
- [ ] Check: the message names one payment, and "3 payments ran." for a catch-up; none on a plain load

## 5. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [ ] `specs/roadmap.md`: 37 marked done and moved to Done; 45 gets a pointer to D4's function
- [ ] `specs/tech-spec.md`: the Standing orders and Demo data rows (and the booking shape) gain the run rule
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [ ] `apps/web/README.md`: the booking shape if it lists fields (`ranOf`, `occurrence`, `anchorDay`); check
