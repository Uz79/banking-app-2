# The execution date can be picked (28): plan

Branch: `feature/execution-date`. Decisions are cited as D1 to D12 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The calendar (D1, D2, D3, D8, D9, D10)

- [x] `apps/web/js/date-picker.js`: `UZBankDatePicker` builds the month grid for a range and a selected date, with the keyboard rules (D8)
- [x] `apps/web/js/form-field-sheet.js`: `openDateSheet(anchor, options)` on `UZBankFormSheet`, sheet type `date`
- [x] `apps/web/css/styles.css`: the calendar's layout, selected, today and disabled states, with tokens only
- [x] Script tags on Overview, Payments and Account details (D11)
- [x] Check: on Overview, calling the sheet from the console opens it anchored on desktop and as a bottom sheet at 390; weekends and dates out of range can't be picked; the keyboard works

## 2. Pay and the transfer use it (D4, D5, D6)

- [x] `apps/web/js/payment-overlay.js`: the toggle off picks the next working day; "Execute on" opens the calendar while the toggle is off; on goes back to today; an edited booking's date that isn't allowed moves to the next working day
- [x] `apps/web/js/iat-overlay.js`: the same for Immediately and the transfer's field
- [x] The field's markup in `overview.html`, `payments.html`, `account-details.html`: "Execute on" is a button (D8 label; committed with group 1)
- [x] Check: a later payment and a later transfer on a picked date show it in the summary and the confirmation, and as pending on that date in the bookings; Recurring starts on the picked date

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 28 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (a Decisions row for the calendar); `apps/web/README.md` (the new file, no new key)
