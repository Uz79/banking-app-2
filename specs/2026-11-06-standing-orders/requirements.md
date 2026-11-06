Branch: `feature/standing-orders`

# Standing orders: the rule and its payments (47), with dates from today (53): requirements

Roadmap items 47 and 53 (`specs/roadmap.md`), on one branch.

- **47:** a standing order is a rule; its executions are bookings. Today tapping Rent in the Recurring tab opens a payment sheet with Status "Pending". Rent, Netflix and Internet & Phone are missing from the Pending tab, where their next payment belongs.
- **53:** the built-in Pending "Execute on" dates (Swisscom and Helvetia Insurance 30.10.2026, Tax office Zurich 03.11.2026) and the Recurring "Next on" dates (Rent 01.11.2026, Netflix and Internet & Phone 05.11.2026) are fixed in the markup, so they are already past and still pending.

## Scope

**In:**

1. A third variant of the booking sheet for the rule, next to Domestic Payment and Internal Account Transfer: Status "Active", Frequency, Next execution (D1 to D4)
2. The rule's function bar: Edit changes all future payments; Copy (D5, D6)
3. The Pending tab lists each standing order's next payment with the "Pending" chip, derived from the rule (D7 to D9)
4. A pending instance keeps its Pending sheet; its Edit changes that payment only; Copy (D10, D11)
5. Built-in dates derived from today, never in the past (D12 to D15)

**Out (stays on the roadmap):**

- 44: an executed instance naming its standing order
- 45: a frequency choice in Pay and the transfer (every rule made in the app stays monthly)
- 37: payments executing on their date; nothing here moves money or advances a rule's next date
- From 47's own "later" list: skipping one payment, pausing or deleting a standing order, a "Recent payments" list in the rule's sheet
- Edit and Copy for transfers (51): a recurring transfer gets the rule's info rows but no Edit

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A rule is any booking with status `recurring`**: Pay's Recurring and Standing order, the transfer's Recurring execution, and the three built-in rows of the Recurring tab (Rent, Netflix, Internet & Phone) | They are stored the same way (`js/payment-state.js`); Pay names Recurring and Standing order apart only in its confirmation |
| D2 | **The rule's sheet is a variant of the booking sheet**, not a new page: class `pd--rule` next to `pd--domestic` and `pd--internal`, title "Standing order" (a transfer rule keeps "Internal Account Transfer" with its two accounts). Its info rows: Status chip "Active" (repeat icon), "Frequency" ("Monthly"), "Next execution" (the date). "Booking confirmation" and "Signed" hide, as no payment has been made by the rule itself | Roadmap 47. A rule has no booking of its own to confirm |
| D3 | **The rule's amount has no pencil** unless the rule can be edited (D5); the pencil follows Edit, as in 42 | One way to change a rule |
| D4 | **The Recurring tab's rows open the rule's sheet**; the Executed tab's monthly rows (Rent, Internet & Phone) keep their Executed sheet with Copy (42) | Roadmap 47: an instance keeps its sheet |
| D5 | **The rule's Edit changes all future payments** (interview): Pay opens with the rule's recipient and amount, on its schedule mode (Recurring) with "as soon as possible" off and the next execution date; Execute updates the rule. A built-in rule is replaced as a built-in pending row is in 42 (`removedBuiltIns`, a new recurring booking in its place) | Interview. Reuses 42's edit context and replacement |
| D6 | **Function bars** (interview): rule: Edit, Copy; pending instance: Edit, Copy. No Delete on either. Copy opens Pay as a new single payment with the recipient and amount, as soon as possible, as 42's Copy does. A recurring transfer's rule and instance: no bar (51) | Interview. Delete would be "delete a standing order" or "skip this payment", both later in 47 |
| D7 | **The next instance is derived, not stored** (interview): each time a list renders, every rule yields one row in the Pending tab, under "Execute on <next execution>", with the rule's name, amount, icon and the "Pending" chip. Nothing is written to the payment state until the instance is edited | Interview. No new storage key; the instance can't drift from its rule. 37 moves the date on later |
| D8 | **An instance carries its rule and date**: `data-rule-id` (the rule's booking id, or the built-in's `data-builtin-id`) and `data-occurrence` (DD.MM.YYYY) on the row, `data-source="rule"` so a re-render replaces it | The sheet and Edit need both |
| D9 | **Instances sort by date among the other pending groups**, sharing a group with pending payments on the same date; month bands and search see them as any row | Roadmap 24's order |
| D10 | **Edit on a pending instance changes that payment only** (interview): Pay opens as a Single payment, "as soon as possible" off, on the instance's date. Execute stores a pending booking with `ruleId` and `occurrence`; the derived instance for that rule and date then hides, and the stored one shows in its place. The rule is untouched | Roadmap 47. One stored exception per edited payment |
| D11 | **An edited instance is an ordinary pending payment** from then on: its sheet, Edit, Delete and Copy as 42 has them. Deleting it brings the derived instance back (it is the edit that is deleted, not the payment) | Skipping a payment is later in 47 |
| D12 | **Built-in Pending dates are working days after today** (interview): Swisscom and Helvetia Insurance +2, Tax office Zurich +6, Monday to Friday as the date picker allows (`UZBankDatePicker.nextWorkingDay`) | Interview. Keeps their order and spacing |
| D13 | **Built-in standing orders keep their day of the month** (interview): Rent the 1st, Netflix and Internet & Phone the 5th. The next execution is the next such day after today, moved to the next working day if it falls on a weekend | Interview. A rent on a stable day reads true |
| D14 | **The derived dates are set when the page builds**, in the rows' `data-execute-on` and their group labels, and the groups re-sort by date; the HTML keeps a fallback date. Apple on Account details gets one too (+1 working day), used by its Edit | The labels, the sheet and Edit read the same attribute |
| D15 | **A rule made in the app keeps the date it was given**; one whose date is past still shows it (37 moves it on). An edit of it sets a new one | Advancing dates is executing, which is 37 |

## Context

- Built-in Pending and Recurring rows: `all-bookings-and-payments.html` around lines 2834 to 2915 (`data-status`, `data-execute-on`, `data-frequency`; Pending rows have `data-builtin-id`, Recurring rows don't yet). Apple: `account-details.html:2490`.
- In-app rows by tab: `renderBookings` in `js/all-bookings.js` (Executed into Today; `pending` and `recurring` into their tabs under "Execute on" and "Next on" groups, inserted by date). `UZBankBuiltInRows.sync` (`js/data-render.js`) hides removed built-ins, then `renderMonthSeparators`.
- The sheet: `js/payment-details.js`. `openOverlay` sets the variant class, the status chip (Pending or Executed) and `applyActions`; `bookingActions` (line 637) has recurring as Edit only when made in the app. The sheet's info rows (Status, Booking confirmation, Signed, Message) are in each page's markup.
- Rules in the state: `commitPayment` and `updatePayment` (`js/payment-state.js`) store `status`, `executeOn`, `frequency` ('monthly'). Pay seeds an edit's schedule with `seedScheduleFromBooking` (`js/payment-overlay.js:233`).
- Dates: `js/date-picker.js` (`nextWorkingDay`, `formatLabel`, `parseLabel`), loaded on All bookings and Account details.

## Open questions

- The repeat icon for the "Active" chip: `#i-repeat` if the sprite has it, else `#i-refresh-cw`. To check in the build.
