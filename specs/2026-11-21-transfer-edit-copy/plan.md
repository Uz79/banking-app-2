# Booking sheet: Edit and Copy for a transfer (51): plan

Branch: `feature/pending-transfer-edit-copy`. Decisions are cited as D1 to D11 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. Copy (D1, D2, D3, D7, D8, D10)

- [ ] `js/iat-overlay.js`: `openOverlay(prefill)` takes the accounts and amount from a copy context (and a mandate)
- [ ] `js/payment-details.js`: `bookingActions` for transfers (Copy on executed and built-in, per the table), the edit context for a transfer, the noun in `applyActions`
- [ ] Check: Copy on an executed transfer, a built-in transfer and a mandate transfer opens the flow on the same accounts and amount, as soon as possible

## 2. Edit (D1, D2, D4 to D6, D9)

- [ ] `js/payment-state.js`: `updateTransfer(id, updates)`, both legs in place, status and Repeats rules from `updatePayment`
- [ ] `js/iat-overlay.js`: seed the schedule step (status, date, Repeats), call `updateTransfer` on Execute when editing
- [ ] `js/payment-details.js`: Edit on a pending and a recurring transfer, opening at the step named by the button
- [ ] Check: edit a pending transfer's amount and date; edit a recurring one's Repeats; make a pending one immediate; both legs and balances stay right

## 3. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md` (51 to Done, in number order), `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` if its booking sheet or transfer rows list the actions
