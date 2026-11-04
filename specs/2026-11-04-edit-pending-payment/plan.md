# Editing a pending payment keeps it pending (23): plan

Branch: `feature/edit-pending-payment`. Decisions are cited as D1 to D9 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The booking sheet shows the real status (D5 to D7)

- [x] `apps/web/js/payment-details.js`: a stored payment's row reads its `status` from the state (pending, recurring or executed) instead of the fallback's "Pending"; the yesterday rule stays (D6); static samples unchanged (D7)
- [x] Check: on Account details, an executed payment made in the app shows "Executed" and no Edit, and the Apple sample still shows "Pending" with Edit; a pending and a recurring one show "Pending" with Edit (on All bookings, the only page that lists them)

## 2. The edit keeps the booking and its schedule (D1 to D4, D7)

- [x] `apps/web/js/payment-details.js`: the edit context carries `status` and `executeOn` (D3)
- [x] `apps/web/js/payment-overlay.js`: when an edit context arrives, set the schedule step from it (mode, toggle, `live.dateLabel`) (D3, D4)
- [x] `apps/web/js/payment-state.js`: `updatePayment` keeps the existing booking and applies recipient name, currency, amount and the schedule (D1, D2)
- [x] Check: editing a pending payment's amount opens the schedule step with "As soon as possible" off; Execute keeps it pending with the new amount, and Household is unchanged; editing it to "as soon as possible" executes it and Household drops by the amount; a recurring one opens on "Recurring" and stays recurring; the Apple sample's edit stays pending. The stored pending and recurring edits through a hand-built edit context, since no button reaches them until 31

## 3. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 23 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` only if a described system changed; `apps/web/README.md` unchanged (no new key or file, D8)
