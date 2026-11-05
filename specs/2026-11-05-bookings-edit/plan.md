# All bookings: the sheet's Edit buttons open Pay (31): plan

Branch: `feature/bookings-edit`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The Pay sheet on All bookings (D1 to D4, D9)

- [ ] `apps/web/all-bookings-and-payments.html`: copy the Pay markup from `account-details.html` (D2)
- [ ] `apps/web/all-bookings-and-payments.html`: load `date-picker.js`, `form-field-sheet.js`, `payment-exit-confirm.js`, `data-render.js` and `payment-overlay.js` in Account details' order (D3)
- [ ] Only if the check needs it: a fix in `payment-details.js` or `payment-overlay.js`, recorded as a new decision (D4)
- [ ] Check: a pending payment made in the app and a built-in pending row each open Pay on the amount step with their details; changing the amount and confirming updates the booking and the list, on the same tab (D5); closing asks "Discard changes?" (D6)

## 2. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 31 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`: the All bookings row notes that Edit opens Pay. No new storage key, so no change to `apps/web/README.md`
