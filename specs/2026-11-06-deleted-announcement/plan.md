# "Payment deleted." reaches VoiceOver (60): plan

Branch: `feature/deleted-announcement`. Decisions are cited as D1 to D6 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. Status lines after the confirmation (D1 to D4, D6)

- [ ] `apps/web/js/dialog-focus.js`: `UZBankAnnounce(region, text)`
- [ ] `apps/web/js/payment-details.js`: the region made at start; Delete announces through the helper
- [ ] `apps/web/js/app-mp.js`: the demo reset's line through the helper
- [ ] Check by script: after Delete the region is empty while the dialog is open, then holds the text after it closed and after focus is on the next row; the same with reduced motion; the reset line likewise

## 2. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), the baseline smoke test, Klaudiusz's VoiceOver check (D5) and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 60 done; `CHANGELOG.md` under `Unreleased`
