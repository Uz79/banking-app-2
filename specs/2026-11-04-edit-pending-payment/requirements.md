# Editing a pending payment keeps it pending (23): requirements

Branch: `feature/edit-pending-payment`

Roadmap item 23 (`specs/roadmap.md`), found during 14. Editing a payment from its booking sheet rebuilds the booking from five fields, so a pending payment loses its status and date and becomes executed, its money leaves Household, and the schedule picked in the edit is ignored. While reading the code, a second fault turned up behind the first: the booking sheet shows every payment made in the app as "Pending" with Edit buttons, executed ones too.

## Scope

**In:**

1. The edit keeps every field it doesn't change and applies the schedule step's choice (D1, D2)
2. The edit opens with the booking's own schedule on the schedule step (D3, D4)
3. The booking sheet shows a payment's real status; Edit only on pending and recurring payments (D5, D6)
4. Static sample rows keep working as today, with their status carried into the edit (D7)

**Out (not in this branch):**

- All bookings: the sheet's Edit buttons do nothing there, since the page has no Pay sheet (roadmap 31)
- The booking sheet shows a pending transfer as "Executed" (roadmap 32)
- The schedule step's fixed "Hans Meyer" (roadmap 29)
- A date picker for "Execute on" (roadmap 28)
- Storing whether a recurring payment was "Recurring" or "Standing order" (D4)
- Found during the checks, added to the roadmap: booking rows can't be reached by keyboard (33)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **`updatePayment` keeps the booking** and changes only what an edit can change: recipient name, currency, amount and the schedule (D2). `accountKey`, `icon`, `direction` and any other field stay as they were | The roadmap item. Today it rebuilds the booking from `id`, `recipientName`, `currency`, `amount` and `dateISO`, so the rest is lost and a missing `status` reads as executed |
| D2 | **The schedule step decides the status**, as for a new payment: "Single" with "As soon as possible" on executes the payment now (status `executed`, `executeOn` removed, `dateISO` set to now, so the money leaves Household from that moment); off makes it `pending` with the step's date; "Recurring" or "Standing order" makes it `recurring` with the step's date. A booking that stays pending or recurring keeps its `dateISO` | The roadmap item ("a pending payment edited to 'now' executes, as a new payment would"). Keeping `dateISO` keeps its place in the list; an executed payment is dated when it ran |
| D3 | **The edit opens with the booking's schedule**: the sheet's edit context carries `status` and `executeOn`, and the Pay flow sets the schedule step from them before showing it. Pending: "Single", "As soon as possible" off, "Execute on" the booking's date (today when it has none). Recurring: "Recurring", the toggle off, its date. Executed (static samples only, D7): the defaults | Interview. Without it the step shows whatever the last flow left (a new payment resets it to "as soon as possible"), so an untouched edit would still execute the payment |
| D4 | **A recurring booking opens on "Recurring"**, not "Standing order": the booking stores only `recurring`. Storing the mode is out | Small diff; no change to the stored shape. The confirmation already reads the mode from the step |
| D5 | **The sheet shows the real status** of a payment in the stored state (`bk_` bookings): it reads the booking's `status` instead of falling back to "Pending". Edit shows on `pending` and `recurring`, not on `executed`. The chip keeps its two labels: "Pending" (clock) for pending and recurring, "Executed" (check) | Interview. An executed payment can't be changed at a bank; showing it as pending with Edit is how this bug was reachable at all. No new chip label needed |
| D6 | **The "yesterday" rule stays**: a row in the yesterday group reads as executed whatever its data says | Unchanged behaviour; not part of this item |
| D7 | **Static sample rows** (Apple and the others in `BOOKING_MAP_*`) keep their own status, and an edit still commits a new booking and hides the row. Their status goes into the edit context like a stored booking's (D3), so editing the pending Apple sample stays pending unless the step is changed | Same rule for both kinds of row; the static path already commits through `commitPayment`, which applies the schedule |
| D8 | **No new storage key, no stored-shape change.** Bookings already stored keep working; a booking with no `status` reads as executed, as today | Small diff; `apps/web/README.md` unchanged |
| D9 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, desktop and 390, keyboard), editing a pending, a recurring and a static pending payment and reading the stored booking after each, and checking that an executed payment shows no Edit; the baseline smoke test | Standard gate |

## Context

- `apps/web/js/payment-state.js` line 562: `updatePayment(id, updates)` rebuilds the booking from five fields. `applySchedule` (line 465) copies `pending` or `recurring` and `executeOn`; `isExecuted` (line 334) treats a missing status as executed. Overview's and Account details' balances count only executed bookings.
- `apps/web/js/payment-overlay.js`: `STEPS` (line 51) runs recipient search, recipient, amount, schedule, summary. `scheduleStatus()` (line 143) reads the segmented control and the toggle; `resetPaymentDefaults()` (line 153) runs only from the Pay button; `paintScheduleStep()` (line 202) snaps the date to today while the toggle is on. The edit context is read at line 890; Execute (line 967) sends `status` and `executeOn` to `updatePayment` or `commitPayment`.
- `apps/web/js/payment-details.js`: the edit context is written in `finishClose` (line 769) with the booking id, recipient, amount and currency only. A stored payment's row falls through to the fallback at line 860 with `status: 'pending'`. `buildDataFromStateBooking` (line 420) covers transfers and trades only, both as executed. The chip and `pd--pending` (which shows the Edit buttons, `css/styles.css` line 7476) are set at line 656.
- Edit buttons (`data-pd-edit="amount"`) are in `account-details.html` (lines 3357 and 3403) and `all-bookings-and-payments.html`. Only Account details loads `payment-overlay.js`, so editing works there alone (roadmap 31).
- Found in the build: Account details lists only executed bookings made in the app (`data-render.js` line 127); pending and recurring ones are listed on All bookings alone. So until 31, the stored-booking edit (D1 to D3) has no button that reaches it: the bug was reachable only through an executed payment shown as "Pending", which D5 removes. The edit path was checked by handing the Pay sheet the same edit context the booking sheet writes; the Apple sample's edit runs through the real buttons.
- `apps/web/js/payment-details 2.js` is a tracked copy of an older `payment-details.js` that no page loads. Left alone.

## Open questions

None.
