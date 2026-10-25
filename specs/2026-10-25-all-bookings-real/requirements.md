# All bookings: make the page real, with an always-visible search: requirements

Branch: `feature/all-bookings-real`

Roadmap item 12, plus a change to the search pattern that item 10 introduced (`specs/2026-10-23-bookings-search-and-balance/`). It is not a follow-up task group of that spec: that one is merged, and this one changes its search decisions D5, D7, D8 and D9 (see D1 and D12). No new page, no new storage key.

## Scope

**In:**

1. **The search pattern.** The Search button that expands a field is replaced by an always-visible search field in the toolbar, as in the Contacts screen of Klaudiusz's tracker app. It filters the current list in place, together with the active tab (D1 to D4).
2. **Working tabs.** Executed, Pending and Recurring each show their own list (D5, D6).
3. **In-app bookings in the list.** The payments, internal transfers and trades made in the app appear in the page, in the right tab, for the account being viewed (D7 to D10).
4. **A decision row in `tech-spec.md`** that records the search pattern (D13).

**Out (not in this branch):**

- Search anywhere else, searching by date or month, remembering a query (no storage)
- Editing, cancelling or deleting a pending or recurring booking from this page. The existing edit flow for pending payments on Account details stays as it is
- Day rollover: nothing is executed later. Pending and recurring bookings stay where they are for the session
- The registered (end of yesterday) figures in the Yesterday and older day headers: they stay as they are
- The real Contacts layout of the tracker app: this spec uses only the description below, not a screen to copy

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Always-visible search field, no toggle on any size (decided, confirmed here).** The Search button, its expand and collapse and `aria-expanded` go. The field sits in the toolbar. Desktop and tablet: one row, the Executed / Pending / Recurring control on the left and the field filling the remaining width, with the search icon inside and the clear button once there is text. Phone: the field on its own full-width row directly under the tabs. It stays visible; nothing opens or closes. | Decided before the interview. An always-visible field is the pattern when the search only narrows what you already see |
| D2 | **It filters the current list in place, together with the active tab and month.** The result is the active tab's rows that match the query. The month chips keep jumping to a month; while a query is typed, a chip for a month with no match is dimmed and inert (this replaces "all chips inert" of the old D7), and the others still jump to their first visible group. The sticky header, the month dock and the merge keep working for Executed. | "Together with the month" is read as: the month bar stays usable and follows the filtered list, instead of being switched off. To check at review: the alternative is a month chip that also hides every other month |
| D3 | **What it matches: names and amounts (confirmed in the interview).** Case-insensitive text in the payee or transfer name and in the amount text (apostrophes ignored, so `1800` finds `1'800.00`). Not dates. | Same as the first search; the rows do not show dates, so a date match would find rows for no visible reason |
| D4 | **Empty state and announcements.** With a query and no match, a line replaces the list: `No bookings match “query”` (in the quotes the app uses). A polite live region announces the match count after each change. Escape in the field clears it (it no longer closes anything). | The wording from the first search, confirmed in the interview |
| D5 | **Each tab has its own list.** The tab control becomes a proper tablist with `aria-controls` and three `role="tabpanel"` lists. Executed keeps the existing markup (every row gets `data-status="executed"`). Pending and Recurring get a few static mock rows each, in the same row component, grouped under a date label (the day it will execute) rather than a day balance, since those bookings have not reached the account yet. | Seeded mock rows plus in-app rows, as chosen in the interview. Same row markup keeps the design system honest |
| D6 | **Month bar and dock only for Executed.** Pending and Recurring are short lists with no months, so the month bar and the dock are hidden (not just dimmed) on those tabs and the sticky header settles back to the title only. Switching tabs scrolls the list to its top. | Chips for months that do not exist would be noise. The merge logic is tied to the Executed list |
| D7 | **A booking has a status.** `status` is `executed`, `pending` or `recurring`, stored on the booking in `UZBankPayState`. Old stored bookings without it count as executed. `getState().bookings` returns it. | The page needs to know which tab a booking belongs in. No schema bump: the field is optional and defaults |
| D8 | **The Pay and internal transfer flows set it from the schedule step.** "As soon as possible" on, or the date is today: `executed`. A single execution on a later date: `pending`. Recurring execution (or standing order in Pay): `recurring`, with the execute-on date kept for the label. The trade flow always creates executed bookings. The schedule is read from the flow's existing state; the step's own UI does not change. | Today the schedule step has no effect; this gives it a visible one. Scope stays at reading what the step already collects |
| D9 | **Pending and recurring bookings do not move money.** `accountRunningBalance`, the sums and the Today balances count `executed` bookings only. The Today and Yesterday lists on Account details and the Overview rows show executed bookings only, so no list shows a booking whose money has not moved. | Without this a scheduled payment would debit at once and the balance rule of the previous spec would break |
| D10 | **Where in-app bookings appear.** For the account in `?account=` (household, savings, deposit), the state's bookings of that account are rendered into the matching tab: executed ones into the Executed list's Today group, newest first; pending and recurring ones into their tab, under a date label. Both legs of an internal transfer appear, each on its own account. The list re-renders on `uzbank:state-changed`. The Today header balance becomes the static header value plus the net of the in-app executed bookings for that account, so it follows a payment without changing what a first visit shows. The search and the tab lists are rebuilt after each render. | Same placement as Account details, which already renders state bookings into its Today group. The header rule keeps the first-visit look and still agrees after a payment |
| D11 | **No five-booking cap.** `MAX_BOOKINGS` (5 payments, 20 rows in all, oldest dropped) is replaced by one limit of 100 stored bookings, oldest dropped. | Chosen in the interview. A list that silently loses rows after the sixth payment is not "real"; 100 keeps `localStorage` small. Account details and Overview show more of the same bookings as a side effect |
| D12 | **What the old bar's code does.** The `.all-bookings__search*` bar, its open transition and the toggle button are removed, and so is the toggle's reduced-motion rule. The field, icon and clear button still reuse the `recipient-search__field-wrap`, `__icon`, `__input` and `__clear` classes inside a `role="search"` wrapper with `aria-label="Search bookings"`, and the focus ring stays `--color-fg-interactive`. New rules use narrow selectors under `.all-bookings__toolbar`. There is no animation, so no reduced-motion path is needed beyond what the tab switch already has (none: tab switch is instant). | The pattern changes from reveal to always-on, so the reveal code is dead. Narrow selectors per AGENTS.md |
| D13 | **Record the pattern in `tech-spec.md` (done with this spec).** A Decisions row: "An inline search field filters the current view; a Search button opens a separate search view or flow (like the payment recipient search)." The pages table row for All bookings is updated when the tabs are real (plan group 5). | Asked for; it is a rule for later screens |
| D14 | **Copy:** English, short, no em dashes. Placeholder "Search bookings", clear button "Clear search", empty state "No bookings match “query”". Pending and recurring date labels: "Pending" rows under "Execute on 30.10.2026" style labels, recurring under "Next on 30.10.2026". | AGENTS.md. The date format is the one the Pay flow already shows (dd.mm.yyyy) |

## Context

- `all-bookings-and-payments.html` has 144 static `.booking-row` elements in about 20 day groups (months Feb to Jun 2026, Today and Yesterday on top), a toolbar with the tab control and the Search button, and the search bar from the first spec in `.all-bookings__intro`. `js/all-bookings.js` binds the tabs as a class toggle only, the month chips, the sticky heights, the month merge and the search.
- `js/payment-state.js`: `commitPayment`, `commitInternalTransfer` and `commitTradeOrder` write `{ id, recipientName, currency, amount, dateISO, accountKey, icon, direction, kind? }` and cap the list (`MAX_BOOKINGS`, a `cap` of 20). `accountRunningBalance` sums every booking for an account. `payment-overlay.js` commits `{ recipient, amount, currency, dateISO: now }`, so the schedule step is ignored.
- `js/data-render.js` `renderBookingsForAccount` renders state bookings into the Today group of Account details, newest first, under the header. This spec reuses that idea for All bookings (D10).
- The payments flow has an edit flow for a pending payment (`editingBookingId`, `editingStaticRow`) that hides a static row when a real one replaces it. It is untouched; D9 only needs to keep it from showing a non-executed booking in Today lists.
- The page defaults to the Savings account when `?account=` is missing; the static rows are one list used for all three accounts.

## Open questions

- Which width counts as "phone" for the second row: use the app's existing phone breakpoint (found while building); the tablet one-row layout has to be checked at 768px as well as desktop.
- How the schedule step exposes mode, date and the as-soon-as-possible toggle to `payment-overlay.js` and `iat-overlay.js` (found while building; D8 reads what is there and does not change the step).
- Whether the Today header rule of D10 looks right for Household, where the static header and the running balance already differ (found while building).
