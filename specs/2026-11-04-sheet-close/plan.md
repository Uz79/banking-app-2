# Sheets close without waiting for an animation (35): plan

Branch: `feature/sheet-close`. Decisions are cited as D1 to D8 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The helper and the transfer (D1, D2, D6)

- [x] `apps/web/js/dialog-focus.js`: `UZBankAfterSheetClose(shell, done)`
- [x] `apps/web/js/iat-overlay.js`: `closeOverlay` ends through the helper
- [x] Check (emulated reduced motion): on Overview, close the transfer, then click Pay: Pay opens. Without reduced motion the transfer still slides out

## 2. The other seven sheets (D3, D5)

- [x] `apps/web/js/payment-overlay.js`, `trade-flow-overlay.js`, `payment-details.js`, `account-information.js`, `share-information.js`, `fridge-advisor-sheet.js`, `playground-sheet.js`: their close ends through the helper
- [x] `apps/web/design-system.html`: load `js/dialog-focus.js` before `js/playground-sheet.js`
- [x] Check (emulated reduced motion, and without): each sheet closes, its slide unchanged without reduced motion, and the page behind takes a click

## 3. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The sweep (D7) with the real macOS setting, switched by Klaudiusz; the validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 35 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the Sheet focus row gains the close); `apps/web/README.md` unchanged (no new key or file)
