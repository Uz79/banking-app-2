# Sheets keep focus (27): plan

Branch: `feature/sheet-focus`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The helper, Pay and the transfer (D1 to D3, D5, D6)

- [ ] `apps/web/js/dialog-focus.js`: `UZBankSheetFocus.open(overlay)` and `.close(overlay, opts)` with the stack, the inert set and cleared, the skipped elements, focus in and back
- [ ] `apps/web/css/styles.css`: no ring on a focused sheet container (`.modal[tabindex="-1"]:focus`)
- [ ] `apps/web/js/payment-overlay.js` and `apps/web/js/iat-overlay.js`: call the helper on open and close
- [ ] Check: on Overview, Pay and the transfer keep Tab and Shift+Tab inside; closing by keyboard puts the ring back on Pay or the transfer button; a click close returns focus without the ring; the Discard prompt over Pay still works

## 2. Buy and Sell, the booking sheet, Account and Share information (D2, D4, D6, D8)

- [ ] `apps/web/js/trade-flow-overlay.js`, `apps/web/js/payment-details.js`, `apps/web/js/account-information.js`, `apps/web/js/share-information.js`: call the helper on open and close
- [ ] `apps/web/all-bookings-and-payments.html`: load `js/dialog-focus.js` before `js/payment-details.js`
- [ ] The booking sheet's Edit hands its opener on to Pay (D6)
- [ ] Check: Buy and Sell keep focus; the booking sheet on Account details and All bookings keeps focus; Share information over Account information keeps focus in Share, and closing it gives Account information back

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 27 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` if it describes the sheets' focus; `apps/web/README.md` unchanged (no new key or file)
