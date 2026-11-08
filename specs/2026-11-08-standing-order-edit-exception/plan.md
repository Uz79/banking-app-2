# An edited next payment goes with its standing order's edit or delete (68): plan

Branch: `feature/standing-order-edit-exception`. Decisions are cited as D1 to D7 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The state drops the edits (D1, D2, D3, D5, D6)

- [ ] `apps/web/js/payment-state.js`: a helper that removes a rule's instance edits (bookings with that `ruleId`); `instanceEditsOf(ruleId)` returns their dates; called by `commitPayment` for `replacesBuiltIn` of a rule, by `updatePayment` for a recurring rule, by `deleteBooking` and by `removeBuiltIn`; exported and listed in the file's header comment
- [ ] Check: Rent on Savings (a built-in rule): Edit its next payment to 1'700, then Edit the rule to 1'750: Pending shows one Rent payment on that date, 1'750; Delete the rule with an edited next payment: the lone one-off is gone; the same on Household; a standing order made in the app, edited in place, shows one payment

## 2. Telling the customer (D4)

- [ ] `apps/web/js/payment-overlay.js`: after a commit or update that dropped edits, the confirmation's note line says so; hidden otherwise
- [ ] `apps/web/js/payment-details.js`: the Delete prompt's message names the changed payments that go with the order, only when there are some
- [ ] Check: both lines show only when something is dropped; the wording has no em dashes; a screen reader reads the note

## 3. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [ ] `specs/roadmap.md`: 68 marked done and moved to Done, with what was settled and found
- [ ] `specs/tech-spec.md`: the booking rows or standing orders row gains the ownership rule; check
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [ ] `apps/web/README.md`: no change expected; check
