Branch: `feature/booking-actions`

# Booking actions: Edit, Delete, Copy and Done on every booking (42): requirements

Roadmap item 42 (`specs/roadmap.md`), widened at the start of the spec from "edited example rows come back after a reload" to making built-in pending rows fully actionable. The booking sheet (`partials/payment-details-overlay.html`, copied into `account-details.html` and `all-bookings-and-payments.html`) has a function bar with Edit, Delete and Copy, and a footer button.

- **Persistence (42 as written):** editing a built-in example row (Swisscom, Helvetia Insurance or Tax office Zurich on All bookings, Apple on Account details) stores the edit as a new booking and hides the example row only in the page (`hidden` and `data-replaced`, `js/payment-overlay.js:1021`). After a reload the example row is back next to its edited copy.
- **Function bar (added):** 43 hid it on built-in rows (`pd--editable` needs a booking id, `js/payment-details.js:676`), so a built-in pending row shows no action at all. Delete and Copy have no handler anywhere; only Edit works, and only on payments made in the app.
- **Footer (added):** the sheet's footer button reads "Confirm" and only closes the sheet. A details view has nothing to confirm.

## Scope

**In:**

1. Built-in rows that an edit replaced or a delete removed stay hidden after a reload, on All bookings and Account details; the demo data reset brings them back (D1 to D4)
2. A group, or a month band, that loses its last row hides with it; an empty Pending tab says so (D5)
3. The function bar shows on built-in pending rows too. Pending payment: Edit, Delete, Copy. Executed payment out: Copy. Pending transfer: Delete. Standing orders as today, trades and money in no bar (D6 to D8)
4. Edit keeps the row's date, as for payments made in the app (D9)
5. Delete asks first, then removes the booking; balances follow what is listed (D10 to D13)
6. Copy opens Pay with the recipient and the amount, a new date, and the original stays (D14, D15)
7. The footer reads "Done" on every booking (D16)

**Out (not in this branch):**

- Standing orders: their sheet, Edit and Delete (47). Built-in recurring rows (Rent, Netflix, Internet & Phone) and recurring bookings made in the app keep what they have today
- Edit and Copy for transfers: the transfer flow has no prefill path yet. Becomes a new roadmap item
- A message in Copy: Pay has no message field
- Account details' "Pending payments until 31.05.2026 CHF 2'500.00" line: a static figure today, not tied to the rows
- Escape on the booking sheet (49)
- Stale built-in dates (see Open questions)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Each built-in row gets a stable id**, `data-builtin-id` (for example `allb-pending-swisscom`, `ad-household-apple`), on every built-in row of All bookings and Account details that can be edited or deleted | Built-in rows have no id today; persistence needs one that survives a reload |
| D2 | **Removed built-in rows are a field in the payment state**, `removedBuiltIns: [id, …]` in `uzBankWebPaymentState` (schema version stays 2; a missing or broken field reads as an empty list). No new key | The demo data reset already wipes this key, so the rows come back with no extra code (requirement). Recorded in `apps/web/README.md` against the existing key |
| D3 | **Every page that lists bookings hides the listed ids on load and on `uzbank:state-changed`**, and shows them again when the list no longer has them (after a reset). One small function in `js/data-render.js`, used by All bookings and Account details | One place for both pages, run on load and on every state change, as the rest of the renderer |
| D4 | **Edit of a built-in row records its id when Pay commits the new booking**, in place of today's in-page `hidden` and `data-replaced` (`js/payment-overlay.js`); the edit context carries the row's id instead of the row's DOM node | The DOM node is gone after a reload; the id is not |
| D5 | **An emptied group hides with its divider**; on All bookings a month band with no visible row in its month hides, as search already does for a month with no match (`js/all-bookings.js`). A tab left with no row shows "No pending payments." in the tab's place | Requirement: no empty month band. An empty panel with no words reads as broken |
| D6 | **The function bar is the home for actions.** It shows when the booking has at least one action and each button shows only when its action applies; the amount's pencil follows Edit. `pd--editable` and the bar's `pd-domestic-only` / `pd-pending-only` gating give way to one function in `js/payment-details.js` that decides the actions | 43 hid the bar for built-in rows; per-button rules fit four cases better than two classes |
| D7 | **Which actions** (interview): pending payment (built-in or made in the app): Edit, Delete, Copy. Executed payment out: Copy. Pending transfer made in the app: Delete (both legs). Standing orders (recurring, built-in or made in the app): as today until 47, so app-made ones keep Edit only and built-in ones show no bar. Trades and money in (Salary, Interest credit, a transfer's in-leg on its own): no bar | Interview. Copying incoming money or a trade means nothing; standing orders belong to 47 |
| D8 | **Built-in executed rows get Copy on both pages**, including Account details' static map rows (Café, SBB, Rent's executed instance). Pizza and the other built-in transfers get no bar (D7) | Requirement: executed bookings get Copy |
| D9 | **Edit keeps the row's date** (`data-execute-on`, already read by `rowSchedule`), and its status, as for payments made in the app (23, D3). Apple, which has no date (it sits in Today), opens with today's date | Requirement |
| D10 | **Delete asks first** with the shared prompt (`UZBankPaymentExitPrompt`, already on both pages, as Profile's reset uses it): "Delete payment?", "This payment will not be made. You can't undo it.", Delete and "Keep payment"; Escape keeps it. For a transfer: "Delete transfer?", "This transfer will not be made. You can't undo it.", "Keep transfer" | Requirement. Same dialog and words pattern as "Reset demo data?" (22) and the exit prompts (30) |
| D11 | **Delete removes the booking**: a built-in row's id goes into `removedBuiltIns` (D2); a booking made in the app leaves the state through a new `UZBankPayState.deleteBooking(id)`, which removes both legs of a transfer. Then the sheet closes | One API for the state, the list re-renders from it |
| D12 | **Balances follow what is listed** (interview). Pending bookings move no money, so deleting one changes no balance, except Apple: its CHF 100 is counted in Household's running balance and the Today header today (`STATIC_TODAY_OUTFLOW` in `js/payment-state.js`). Apple counts only while it is listed: deleted or replaced by an edit, it no longer does, and the edited payment counts by its own status | Interview. Today an edit of Apple counts it twice once the new payment executes |
| D13 | **After Delete, focus goes to the next row in the same list**, else the previous one, else the active tab; with the ring only after a keyboard action. A polite status line says "Payment deleted." or "Transfer deleted." | The opener row is gone, so 27's hand-back has nothing to focus. Profile's reset line (22) is the pattern for the status |
| D14 | **Copy opens Pay at the amount step with the recipient and the amount**, through the same edit context as Edit but with no booking id and no row id, and a fresh schedule (As soon as possible, today's date). Execute records a new booking; the original is untouched. A recipient not in the list (Swisscom, Apple) goes in by name, as Edit does today | Interview: kept in 42. Same path as Edit, so little new code |
| D15 | **Copy leaves no message**: Pay has no message field. When Pay gets one, Copy fills it | Requirement asked for the message; not possible without a field |
| D16 | **The footer button reads "Done" on every booking** and closes the sheet, as it does today. The class `uz-pd-confirm` is kept; only the label changes, in the partial and both copies | Requirement. A label change, not a new control |
| D17 | **The change is in the partial and its two copies**: `partials/payment-details-overlay.html`, `account-details.html`, `all-bookings-and-payments.html` | As 41 did for the confirmation dialog: no shared template yet |

## Context

- `js/payment-details.js` opens the sheet. Built-in rows: All bookings builds them from the row (`buildAllBookingsRowData`), Account details from static maps (`BOOKING_MAP_HOUSEHOLD` and the others) with the row's status (43). Rows made in the app carry `data-booking-id` and read from the state.
- `js/payment-overlay.js` consumes `window.__UZ_PD_EDIT_CONTEXT__` (around line 925): `bookingId` means update in place (`updatePayment`), `staticRow` means commit a new booking and hide the row.
- `js/payment-state.js`: `STATIC_TODAY_OUTFLOW = 100` is Apple's amount, taken off Household's running balance and the Today header. `reset()` removes `uzBankWebPaymentState`.
- `js/data-render.js` renders app-made rows into Account details' Today group; `js/all-bookings.js` owns the tabs, month bands and search hiding (`setHidden`, around line 400).
- `js/payment-exit-confirm.js`: `UZBankPaymentExitPrompt(fn, { title, message, leaveLabel, stayLabel, escapeStays })`.
- Built-in rows on All bookings: Pending has Swisscom and Helvetia Insurance (30.10.2026) and Tax office Zurich (03.11.2026); Recurring has Rent, Netflix, Internet & Phone. Account details: Apple pending in Today; executed rows in Yesterday and on the other accounts' slides.

## Open questions

- The built-in pending dates (30.10.2026, 03.11.2026) are already past. Edit keeps them as they are (D9), so Pay may open with a date the calendar would not offer. To see in the build; moving the built-in dates into the future is the same staleness 47 names for Recurring, and if it is needed it goes on the roadmap, not into this branch.
- Whether a pending transfer made in the app shows the function bar at all today (the bar is `pd-domestic-only`). D6 replaces that gating; to check that the transfer's sheet layout takes a bar.
