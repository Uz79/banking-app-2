# Booking rows by keyboard (33, 52): plan

Branch: `feature/booking-rows-keyboard`. Decisions are cited as D1 to D7 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. Rows as buttons (D1 to D4, D7)

- [ ] `apps/web/account-details.html`, `apps/web/all-bookings-and-payments.html`: every `div.booking-row` becomes `button type="button"`
- [ ] `apps/web/js/data-render.js` (`buildBookingRow`), `apps/web/js/all-bookings.js` (`buildRow`, `instanceRow`): build a button
- [ ] `apps/web/css/styles.css`: the button reset in `.booking-row`
- [ ] Check: both pages look as before (Light, Dark, 390px); Tab reaches every visible row, Enter and Space open its sheet; closing returns focus to the row; search-hidden rows are skipped

## 2. Focus after a Delete or an edit (D5, D6)

- [ ] `apps/web/js/payment-details.js`: before the row leaves, note the next focus target (next row, the one before, else the tab or Show all) and focus it after the close
- [ ] The same for an edit that replaces the row (`apps/web/js/payment-overlay.js` or the sheet's close)
- [ ] Check: Delete Apple and Swisscom by keyboard, focus lands on the next row with the ring; the last row in a list hands on to the one before; an empty list hands on to the tab

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 33 done and 52 closed as its duplicate; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`'s Booking rows decision names the element
