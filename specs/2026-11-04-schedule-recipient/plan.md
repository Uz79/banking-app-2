# Pay's schedule step names the chosen recipient (29): plan

Branch: `feature/schedule-recipient`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The schedule step's recipient (D1, D2, D5, D6)

- [ ] `apps/web/js/payment-overlay.js`: `paintScheduleStep` writes `live.recipient.name` into the step's Recipient field, as `paintAmountStep` does
- [ ] `apps/web/overview.html`, `payments.html`, `account-details.html`: the Pay sheet's "Hans Meyer" placeholders are empty (D2)
- [ ] Check: on Overview, Pay to a recipient other than Hans Meyer shows that name on the schedule step; going back and picking another recipient updates it; editing a pending payment from Account details shows its recipient; Lena Fischer's CHF 500 booking goes to her (D10)

## 2. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), including the placeholder check on all three pages (D3), the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 29 marked done (38 already closed as its duplicate); `CHANGELOG.md` under `Unreleased`. No change to `specs/tech-spec.md` (no new page, system or decision of its kind) or `apps/web/README.md` (no new file or key)
