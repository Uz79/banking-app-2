# Pay: the recipient step's typed details count (39): plan

Branch: `feature/pay-recipient-details`. Decisions are cited as D1 to D8 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The typed details become the flow's recipient (D1, D2)

- [ ] `js/payment-overlay.js`: read Name, Street and City on `input` into a copy of `live.recipient`; the repaint on Back shows them
- [ ] Check: change the name on the recipient step; the schedule step, the summary and the confirmation show it; the saved recipient list is unchanged on the next Pay

## 2. An empty name blocks Next (D3, D7)

- [ ] `js/payment-overlay.js`: on Next from the recipient step, check the name with `UZBankFieldError`; clear it on typing; focus the field
- [ ] Check: clear the name, press Next: error "Enter a name.", no advance; type a letter, the error clears and Next works; Street and City empty is allowed

## 3. The booking keeps the address (D4, D5, D6)

- [ ] `js/payment-state.js`: `commitPayment` and `updatePayment` store `recipientStreet` and `recipientCity`
- [ ] `js/payment-overlay.js`: pass them on commit; seed from the edit context
- [ ] `js/payment-details.js`: the sheet's "To" and the edit context use the booking's own details first
- [ ] Check: pay with a changed name, street and city; the booking sheet shows them; Edit opens the flow on them; Copy too; an old booking and a built-in row still read as before

## 4. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md` (39 to Done, in number order), `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` and `apps/web/README.md` only if they document the booking shape
