# An edited next payment goes with its standing order's edit or delete (68): plan

Branch: `feature/standing-order-edit-exception`. Decisions are cited as D1 to D7 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The state drops the edits (D1, D2, D3, D5, D6)

- [x] `apps/web/js/payment-state.js`: a helper that removes a rule's instance edits (bookings with that `ruleId`); `instanceEditsOf(ruleId)` returns their dates; called by `commitPayment` for `replacesBuiltIn` of a rule, by `updatePayment` for a recurring rule, by `deleteBooking` and by `removeBuiltIn`; exported and listed in the file's header comment
- [x] Check: Rent on Savings (a built-in rule): Edit its next payment to 1'700, then Edit the rule to 1'750: Pending shows one Rent payment on that date, 1'750; Delete the rule with an edited next payment: the lone one-off is gone; the same on Household; a standing order made in the app, edited in place, shows one payment

## 2. Telling the customer (D4)

- [x] `apps/web/js/payment-overlay.js`: after a commit or update that dropped edits, the confirmation's note line says so; hidden otherwise
- [x] `apps/web/js/payment-details.js`: not built; there is no Delete for a standing order (see D3 in `requirements.md`)
- [x] Check: the confirmation's note shows only when something is dropped and has no em dashes (a screen reader was not run)

## 3. Wrap-up

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [x] `specs/roadmap.md`: 68 marked done and moved to Done, with what was settled and found
- [x] `specs/tech-spec.md`: the booking rows or standing orders row gains the ownership rule; check
- [x] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [x] `apps/web/README.md`: no change expected; check
