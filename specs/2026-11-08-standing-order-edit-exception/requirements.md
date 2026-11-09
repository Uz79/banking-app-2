Branch: `feature/standing-order-edit-exception`

# An edited next payment goes with its standing order's edit or delete (68): requirements

Roadmap item 68 (`specs/roadmap.md`), found while building `specs/2026-11-06-savings-standing-orders/` (59), with Delete added in the interview.

The bug: Edit a standing order's next payment (Rent on Savings, 1'700 on 01.12). Pay stores it as a one-off booking carrying the rule's id and the date (`ruleId`, `occurrence`; `specs/2026-11-06-standing-orders/` D10), and the derived next payment for that rule and date hides. Then Edit the standing order itself (to 1'750). For a built-in rule the edit books a new rule with a new id and marks the old one removed (`replacesBuiltIn`, `js/payment-state.js:495`), so the one-off still points at the old, removed id and hides nothing. Pending lists the one-off (1'700) and the new rule's next payment (1'750), both on 01.12. Seen on Savings; the same on Household. The same gap on the other side: Delete a standing order and its edited next payment stays behind as a lone one-off, a payment of an order that no longer exists.

## Scope

In:

- Editing a standing order (a built-in rule or one made in the app) drops its edited next payments.
- Deleting a standing order drops them too.
- The customer is told when that happens, in the Pay confirmation (edit) and in the Delete prompt.

Out:

- Editing or deleting the next payment itself (47 D10, D11 stand: an edited payment is an ordinary pending payment, and deleting it brings the derived one back).
- Skipping a payment and the frequency choice (47 and roadmap 45).
- Any change to the data shape or the storage keys.

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | **An edited next payment belongs to its standing order.** A stored booking with a `ruleId` is an instance edit of that rule. When the rule is edited or deleted, its instance edits are removed | One rule for both bugs; the one-off only ever stood in for that rule's payment (47 D10) |
| D2 | **The rule's edit wins** (interview): after editing the rule (1'750), Pending shows one payment on 01.12, from the new rule. The earlier one-off (1'700) is dropped | The customer just changed the order itself, so the broader, later edit is the one they mean |
| D3 | **Delete does the same** (interview): deleting a standing order removes its edited next payments. Revised in the build: the app offers no Delete for a standing order today (`bookingActions` gives `del: false` for a recurring booking, `js/payment-details.js:707`; skipping is later in 47), so this is in the state only (`deleteBooking`, `removeBuiltIn`), where it holds for whatever deletes an order later, and it was tested through the state's API | Same ownership; a lone payment of a deleted order would be the same bug |
| D4 | **The customer is told** (interview). Edit: the Pay confirmation's note line (`#uz-pay-conf-note`, already in the markup and hidden) reads "The earlier change to the payment on 01.12.2026 was replaced." (the dates of the dropped payments, comma separated for more than one). Delete: the prompt would gain a sentence, but there is no Delete prompt for a standing order (D3), so that wording was not built. The line shows only when something was dropped | A plain line where the customer is already reading, no new dialog or toast. No em dashes |
| D5 | **The state owns it.** `js/payment-state.js` gets one helper that removes the instance edits of a rule id, called by `commitPayment` when the booking replaces a built-in rule, by `updatePayment` when the updated booking is a recurring rule, by `deleteBooking` and by `removeBuiltIn`; and one reader, `instanceEditsOf(ruleId)`, so the flows can word D4 before or after. Pay and the booking sheet only read it | The rule is in one place for every caller, as with the other booking rules; no screen re-implements it |
| D6 | **Only an edited next payment is dropped:** a stored booking whose `ruleId` equals the rule's id. Payments the customer made on their own, and other rules' edits, are untouched | Narrow, as the conventions ask |
| D7 | No markup, new page, script, dependency or storage key; the booking shape (`ruleId`, `occurrence`) is as it is. The "Payment deleted." announcement (roadmap 60) is unchanged | Small contained diff (AGENTS.md) |

## Context

- Derivation: `nextPayments` (`js/built-in-bookings.js:329`) lists a rule's next payment unless a stored booking has the same `ruleId` and `occurrence` (line 345).
- Edit paths: a built-in rule is replaced by a new booking (`replacesBuiltIn`, `payment-state.js:495`); a rule made in the app is updated in place (`updatePayment`, `payment-state.js:568`, same id).
- Delete paths: `payment-details.js:996`, `deleteBooking(id)` for a stored booking and `removeBuiltIn(id)` for a built-in; the prompt's text is at line 1001.
- The Pay confirmation sentence is set at `payment-overlay.js:302`; the note element `#uz-pay-conf-note` exists in the markup of each page that carries Pay and is not used yet.
- Roadmap 45 (a frequency choice) will touch the same edit path later; nothing here blocks it.

## Open questions

- A rule made in the app is updated in place and keeps its id, so today its edited next payment keeps hiding the rule's next payment while the dates match (one payment, but the rule's change seems not to apply). D2 makes that consistent: confirm in the build that the instance edit is dropped and the new rule's payment shows.
- Whether any page's Pay markup lacks `#uz-pay-conf-note`; if one does, the line goes in the confirmation message instead.

## Found in the build

- Task group 1: Delete is not reachable for a standing order in the app (D3), so the prompt wording of D4 was written, then taken out again rather than shipped unverifiable. The state keeps the rule for Delete.
- Both edit paths drop the edited next payment: a built-in order (a new booking replaces it, `replacesBuiltIn`) on Savings (Rent) and Household (Netflix), and an order made in the app (updated in place, same id). The open question about the in-place order is settled: its edited payment is dropped and the new rule's payment shows.
- At Large type on a 390px phone the note wraps to two lines inside the dialog and nothing overflows.
