# All bookings search and the Household balance: requirements

Branch: `feature/bookings-search-and-balance`

Roadmap items 10 and 11, together. Both are gaps found in the fridge advisor's baseline run, and both predate it. No new page, no new storage key.

## Scope

**In:**

1. **Household balance (item 11).** One rule: every place that shows the Household or Savings balance shows the running balance (what is left after today's bookings and transfers), like the Overview rows already do. Today the Account details card and the All bookings card show a fixed 10'000, and the Overview total ("Accounts & investment") and the Account details total ("All accounts") use the fixed registered figure, so they do not add up to the rows.
2. **Search (item 10).** The Search button on All bookings works: it opens an inline search field under the toolbar and filters the bookings on the page as you type.

**Out (not in this branch):**

- Making the All bookings tabs real (Executed, Pending and Recurring all show the same static list today) and showing the payments and transfers you make in that list: roadmap item 12
- Search anywhere else, and searching by date or month
- Remembering a search (no storage)
- The registered (end of yesterday) figures in the day headers of the bookings lists: they stay as they are

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The balance rule:** the running balance (`getState().accountBalances.household` and `.savings`) is the balance shown for Household and Savings everywhere. The registered balance (`state.household`) stays internal, for the Yesterday and day headers. The comment block in `payment-state.js` that says the displayed balance stays fixed all session is rewritten to say this. | One rule, no page disagrees with another. It is what the Overview rows already do, and it makes the demo react to a payment on every screen. |
| D2 | **The sums follow the rows:** `overviewAccountsTotal` is running Household + running Savings + Custody (20'000) + Retirement (10'000); `accountDetailsAccountsTotal` is running Household + running Savings. The key names in `getState()` stay. | The totals were 65'000 and 35'000 while the rows added up to less after a payment. |
| D3 | **Where it changes:** the first two slides of the Account details carousel (Household, Savings), the All bookings summary card (Household and Savings; Custody stays 20'000), and the debit account rows of the payment modal (Household), and the account balances in the internal transfer flow (`js/iat-overlay.js`) and the trade flow (`js/trade-flow-overlay.js`). Both overlays carry their own constant `balance` strings (Household 10'000, Savings 25'000, Custody 20'000); Household and Savings are read from the state instead, Custody stays 20'000. | The payment modal's "debit account" is the balance a payment draws on, so the running figure is the honest one. |
| D4 | **All bookings reads the state, not constants:** the page loads `js/payment-state.js` before `js/all-bookings.js`; `all-bookings.js` takes the balance from `UZBankPayState.getState().accountBalances` and re-reads it on `uzbank:state-changed`. The hardcoded `balance` strings in its `ACCOUNTS` table stay only as the fallback when the state is missing. `js/data-render.js` is not loaded on that page. | The page has no renderer today, and `data-render.js` does other work (the bookings lists) that this page does not need. |
| D5 | **Search is an inline bar, not a sheet:** the Search button toggles (`aria-expanded`) a search field that opens under the toolbar (D7). Typing filters at once (the list is static, no debounce). Filtering is by case-insensitive text in the payee name or the amount text, across all months. Day groups with no visible row are hidden. The field has a clear button; Escape or the Search button closes the bar and restores the list. | Agreed in the interview. The least new UI, and it keeps the page's own scroll chrome. |
| D6 | **No results and announcements:** with no match, an empty state line replaces the list ("No bookings match" and the query, in the quotes the app uses elsewhere). A polite live region announces the number of matches after each change. | The page is long (102 day groups); a silent empty list looks broken. |
| D7 | **Where the bar sits (corrected while building; supersedes the first version of D7, which put it in the sticky header):** the toolbar with the tabs and the Search button is not in the sticky header, it is in the page's scrolling intro. So the search bar opens right under the toolbar in the intro, scrolls with the page, and the sticky header, the month dock and the merge logic are not touched. The month chips are disabled (dimmed, `aria-disabled`, no scroll) while a query is typed, because a chip scrolls to a day group that may be hidden; they work again when the query is cleared or the bar closes. | Found by reading the markup: the first spec assumed the header. This is smaller and avoids re-measuring the sticky chrome. |
| D8 | **Focus and keyboard:** opening moves focus to the field; closing returns it to the Search button; the field is `type="search"` inside a `role="search"` wrapper with `aria-label="Search bookings"`; the focus ring is `--color-fg-interactive`. The field, its icon and its clear button reuse the existing `recipient-search__field-wrap`, `__icon`, `__input` and `__clear` classes (the Pay recipient search), so the look matches. | Matches the Pay recipient search and the project's accessibility rule; no new component. |
| D9 | **Motion and colour:** the bar opens with a short height and opacity transition on the app's existing duration and easing tokens, instant with `prefers-reduced-motion`. Colours only through `--color-*` tokens. The rules use narrow selectors (`.all-bookings__search`, not bare `.segmented` or `.uz-btn`). | AGENTS.md conventions. |
| D10 | **Copy:** English, short, no em dashes: placeholder "Search bookings", empty state "No bookings match", clear button label "Clear search". | AGENTS.md conventions. |
| D11 | **The page stays a static mock otherwise:** tabs, the booking list and the month chips are not changed, and the payments made in the app still do not appear in this list. Roadmap item 12 is added for that. | Agreed in the interview: only what the two fixes touch. |

## Context

- `js/iat-overlay.js` and `js/trade-flow-overlay.js` each hold constant `balance` strings for the three accounts and paint them into the sheets (found while writing this spec, so the gap is wider than the two pages in the roadmap items).
- `js/payment-state.js` already returns both figures: `state.household` (registered, fixed at 10'000) and `accountBalances.household` and `.savings` (running). `js/data-render.js` `renderHouseholdBalance` and `renderAccountSum` choose between them page by page, which is where the disagreement comes from.
- `all-bookings-and-payments.html` has the Search button (`.all-bookings__search-btn`) with no handler and no field. `js/all-bookings.js` binds the segmented tabs (class toggle only), the month chips, the sticky heights and the month merge. There are two month bars (flow and dock) that swap as the page scrolls.
- The booking rows are static HTML, so search filters DOM rows rather than data.

## Open questions

- Whether the transfer and trade flows may let a balance go below zero once the running balance is used (they validated against the constants before); keep their current validation unless it breaks.
- Whether the dividers between day groups look right when groups are hidden (a divider follows each group; the one after a hidden group is hidden too).
