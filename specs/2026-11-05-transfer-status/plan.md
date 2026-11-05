# Booking sheet: a transfer shows its real type and status (32, 46): plan

Branch: `feature/transfer-status`. Decisions are cited as D1 to D9 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The transfer's status (32; D1, D2, D5 to D7)

- [ ] `apps/web/js/payment-details.js`: `buildDataFromStateBooking` returns the booking's status for a transfer (D1); the trade's stays `'executed'` (D7)
- [ ] Check on Account details: a transfer made with "Immediately" off opens a sheet reading "Pending"; a standing order reads "Pending" (D2); an immediate one reads "Executed"; no Edit on any of them (D6)

## 2. Transfers open as transfers on All bookings (46; D3 to D5)

- [ ] `apps/web/all-bookings-and-payments.html`: load `js/iat-overlay.js` after `js/payment-details.js` (D3, D4)
- [ ] Check `iat-overlay.js` for anything it does before its markup check on a page without the transfer (the open question); record a decision if something needs a change
- [ ] Check on All bookings: the same three transfers open as "Internal Account Transfer" with both accounts and the right status, in Executed, Pending and Recurring; the in-leg on Savings' All bookings too (D5); a payment's sheet is unchanged

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 32 and 46 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`: the All bookings row notes that it loads `iat-overlay.js` for the account list. No new storage key, so no change to `apps/web/README.md`
