Branch: `feature/schedule-recipient`

# Pay's schedule step names the chosen recipient (29): requirements

Roadmap item 29 (`specs/roadmap.md`), found again during 28 as item 38, which is closed as its duplicate (D7). Pay's Time Schedule step shows "Recipient: Hans Meyer" whoever was picked. The name is the markup's placeholder in the `data-step="schedule"` step, and `paintScheduleStep` in `js/payment-overlay.js` never writes it. The amount step, the summary, the confirmation and the stored booking use the right name.

## Scope

**In:**

1. The schedule step's Recipient field shows the chosen recipient, on every page that carries the Pay sheet (Overview, Payments, Account details), as the amount step does (D1, D5)
2. A check of every other placeholder in the Pay sheet against a recipient that isn't Hans Meyer (D3)
3. Editing a pending payment (roadmap 23) shows the booking's recipient on the schedule step (D6)
4. The Pay sheet's "Hans Meyer" placeholders removed from the markup of the three pages (D2)
5. The booking itself goes to the chosen recipient: the Lena Fischer case (D10)

**Out (not in this branch):**

- A name, street or city typed on the recipient step is never read back into the flow, so the later steps and the booking keep the name picked from the list: roadmap 39, added with this spec (D4)
- The transfer, Buy and Sell (they have no recipient field on their schedule step)
- `js/app.js`, `spa-source.html` and the Storybook stories (they carry the same placeholder, but none is the runtime)
- Other open roadmap items (30 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **`paintScheduleStep` writes `live.recipient.name`** into the schedule step's first field (`.form-field__value`), the same way `paintAmountStep` does for the amount step. Nothing else in the paint changes | One line in the paint that already runs every time the step shows (`showStep`, after `ensureFlowSeeded`) |
| D2 | **The "Hans Meyer" placeholders leave the Pay sheet's markup** (review, revising the first draft that kept them) in `overview.html`, `payments.html`, `account-details.html`: the recipient step's name input (`value=""`), the Recipient values of the amount, schedule and summary steps and the confirmation's recipient name are empty. Every one is painted from the flow before it shows, and no script reads them. Payments' own saved-recipient row "Hans Meyer" (`payments.html:2497`) is real content and stays | Review: a real-looking name as a placeholder is how this bug stayed hidden. An empty field shows a missed paint at once |
| D3 | **The other placeholders:** read in the code, the recipient step, the amount step, the summary, the confirmation, "Execute on" and the debit account amounts are all painted from the flow's state (`paintRecipientStep`, `paintAmountStep`, `paintSummaryStep`, `paintConfirmationDialog`, `data-render.js`). The schedule step's name was the only one left. Validation confirms each with a recipient other than Hans Meyer on all three pages | The roadmap item asks to check the same fixed name everywhere the Pay sheet appears |
| D4 | **Typed recipient fields are out** (interview). The recipient step's inputs are filled from `live.recipient` but nothing reads them back (`js/payment-overlay.js`, the `input` handler only syncs the clear buttons). Recorded as roadmap 39 | Interview. It changes what a booking stores, so it needs its own spec and testing |
| D5 | **Pages:** the three pages share `js/payment-overlay.js`, so one change covers them. Markup changes only for D2; no CSS or registration changes; no new storage key | Smallest diff |
| D10 | **The booking itself goes to the chosen recipient** (review): the 2026-10-28 baseline case (search "Lena", pick Lena Fischer, pay CHF 500) is checked in the stored booking, All bookings and the Household balance, not only on the steps' labels | Review. The labels being right doesn't prove the booking is |
| D6 | **Edit flow:** editing a booking sets `live.recipient` from the edit context before the steps paint (around line 928), so the schedule step shows the booking's recipient with no extra code. Validation checks it from Account details (All bookings' Edit does nothing, roadmap 31) | Roadmap 23 opens the edit on the schedule step, where the wrong name was most visible |
| D7 | **Roadmap 38 is closed as a duplicate of 29** (interview). Its extra point, a look at the other steps' placeholders, is D3 here | Interview. One bug, one item |
| D8 | **Motion and accessibility:** nothing animates or changes focus. The field is plain text; a screen reader reads the right name with its "Recipient" label | No new reduced-motion path is needed |
| D9 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, desktop and 390, keyboard, reduced motion) on Overview, Payments and Account details; the baseline smoke test | Standard gate |

## Context

- Schedule step markup: `apps/web/overview.html:2800` (`data-step="schedule"`, the Recipient field at 2802 to 2810), also `payments.html:2691` and `account-details.html:2782`.
- `apps/web/js/payment-overlay.js`: `paintAmountStep` (184) writes the name at 189; `paintScheduleStep` (201) writes only the date; `showStep` calls the paint for the active step (840); the edit button on the schedule step's Recipient (`data-payment-nav="recipient"`) is handled at 613.
- Recipients: `apps/web/js/payment-state.js` (the list starts with Hans Meyer, so a check has to pick someone else).

## Open questions

None.
