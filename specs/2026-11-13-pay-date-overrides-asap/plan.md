# The schedule step's date overrides the toggle (40): plan

Branch: `feature/pay-date-overrides-asap`. Decisions are cited as D1 to D11 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; stop it when done).

## 1. The calendar and the shared rule (D2, D3, D4)

- [x] `apps/web/js/date-picker.js`: `executionRange` takes the transfer's flag (today to +12 months, weekends allowed); a helper for the toggle's own date (next working day for Pay, today for the transfer) and one for "the next day that differs" (D4); `syncField` stops disabling the field
- [x] `apps/web/js/form-field-sheet.js`: `openDateSheet` passes the range through if it does not already
- [ ] Check: from the console, the transfer's calendar offers today and a Saturday, Pay's does not offer today or weekends

## 2. Pay (D1, D2, D4, D5, D6, D8)

- [x] `apps/web/js/payment-overlay.js`: the field always opens the calendar; the toggle on resets the date to the next working day; a pick of that date keeps the toggle on, any other turns it off; the toggle off applies D4; the summary and confirmation copy (D5); the seed for an edited booking (D8)
- [ ] Check: all three modes; pick the next working day (toggle stays on), pick a later day (toggle goes off), switch it back on (date resets); the confirmation reads "will be executed on …"

## 3. The transfer (D1, D2, D4, D6, D8)

- [x] `apps/web/js/iat-overlay.js`: the field is always visible and opens the calendar; today is pickable; the same toggle and date rules
- [ ] Check: Immediately on shows today; pick today (stays on), pick a Saturday (goes off, pending on that date); the confirmation still reads "is done." for an immediate transfer

## 4. Screen readers (D7)

- [x] The live line next to each toggle, created by both overlays (`.visually-hidden` exists), so no markup change in the three pages; Pay's toggle also gets `role="switch"` and `aria-checked`
- [ ] Check: the line's text follows the toggle and the date; the field's label reads the same in every state

## 5. Wrap-up

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it): not run in full, see its "Checked on" line
- [x] `specs/roadmap.md`: 40 marked done and moved to Done; a note on 28's superseded decisions
- [x] `specs/tech-spec.md`: the Decisions table or the schedule step's row, if it describes 28's D4; check
- [x] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [x] `apps/web/README.md`: no change expected (no storage keys); check
