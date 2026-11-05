# All bookings: the sheet's Edit buttons open Pay (31): plan

Branch: `feature/bookings-edit`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The Pay sheet on All bookings (D1 to D4, D9, D11)

- [x] `apps/web/all-bookings-and-payments.html`: copy the Pay markup from `account-details.html`, before the booking sheet (D2, D11)
- [x] `apps/web/all-bookings-and-payments.html`: load `date-picker.js`, `form-field-sheet.js`, `payment-exit-confirm.js`, `data-render.js` and `payment-overlay.js` in Account details' order (D3)
- [x] Only if the check needs it: a fix in `payment-details.js` or `payment-overlay.js`, recorded as a new decision (D4). Not needed: the markup order fixed it (D11)
- [x] Check: a pending payment made in the app (built-in rows have no Edit, item 43) opens Pay on the amount step with its details; changing the amount and confirming updates the booking and the list, on the same tab (D5); closing asks "Discard changes?" (D6)

## 2. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 31 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`: the All bookings row notes that Edit opens Pay. No new storage key, so no change to `apps/web/README.md`

## 3. Follow-up: the layout matches across tabs (D12)

- [x] `apps/web/all-bookings-and-payments.html`: the docked month bar wrapped in `.all-bookings__month-dock-inner`
- [x] `apps/web/css/styles.css`: the inner wrapper with no padding; Executed's gap above the Pending and Recurring lists; `scrollbar-gutter: stable` on this screen's `.main-content`
- [x] Check: the header is 74px on all three tabs, the column stays put, the gap under the toolbar is 24px on each tab, the dock is 0px collapsed and docks when scrolled, a docked chip's focus ring is not clipped
- [x] `npm run build`; `CHANGELOG.md`
