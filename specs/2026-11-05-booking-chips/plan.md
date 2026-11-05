# Booking rows: real status, counterparty icons and a status chip (43): plan

Branch: `feature/booking-chips`. Decisions are cited as D1 to D16 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The tonal chip (D10, D11)

- [x] `apps/web/css/styles.css`: `.chip--tonal` next to `.chip`, on the `--color-btn-tonal-*` tokens
- [x] `designs/components/chip/chip.md`: the tonal variant
- [x] Check: a tonal chip in Light, Dark and a Multi-color theme; checked on the rows in group 3, where the chip first appears

## 2. Row data and the sheet (D1, D2, D3, D5)

- [x] `apps/web/all-bookings-and-payments.html`: `data-type`, `data-execute-on` and `data-frequency` on the built-in rows (D2, D5, D7)
- [x] `apps/web/account-details.html`: `data-status`, `data-type` and `data-frequency` on the built-in rows (D1, D5, D7)
- [x] `apps/web/js/payment-details.js`: `isInternalTransferRow` reads `data-type`; `buildAllBookingsRowData` and the Account details path read the row's status and date; Edit only for bookings from the state (D3)
- [x] Check: Swisscom opens "Pending" and no Edit; Rent opens as a payment; Pizza stays a transfer (its data); a pending payment made in the app still shows Edit and opens Pay

## 3. Icons and chips in the lists (D4, D6 to D9, D12, D13)

- [x] `apps/web/js/payment-state.js`: `frequency` on recurring bookings, kept by `updatePayment`, passed by `getState` (D9)
- [x] A shared helper for the chip label and the counterparty icon (`bookingRowLook` and `frequencyLabel` in `js/payment-state.js`, which both pages load first), used by `js/all-bookings.js` and `js/data-render.js` (D4, D8)
- [x] Built-in markup on both pages: counterparty icons, no `#i-repeat`, the chip after the name (D4, D6)
- [x] `apps/web/js/all-bookings.js` and `apps/web/js/data-render.js`: rendered rows get `data-type`, the icon and the chip (D12)
- [x] `apps/web/css/styles.css`: the row's name shrinks before the chip (D13)
- [x] Check: every tab on All bookings and Account details on desktop (390 in the validation pass), a transfer made in the app on both accounts' lists (anchor on Household's, home on Savings'), a recurring payment made in the app reads "Monthly", one stored without a frequency too

## 4. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 43 marked done and 42 noted to turn Edit on; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` if the booking data model is described there. No new storage key, so no change to `apps/web/README.md`
