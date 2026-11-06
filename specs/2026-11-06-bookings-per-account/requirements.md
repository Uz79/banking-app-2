Branch: `feature/bookings-per-account`

# Bookings per account: each account lists its own built-in rows (56): requirements

Roadmap item 56 (`specs/roadmap.md`). All bookings shows the same built-in Executed, Pending and Recurring rows for every account. They are Savings' rows: its Today and Yesterday match Savings' Account details (Salary; Rent, Transfer to Household). Household's Account details rows (Apple pending; Café, Pizza, Railway) are on no All bookings view. Pay always books to Household (`commitPayment`, `js/payment-state.js`), so editing a built-in row on the Savings view hides it there and the edited payment shows only on Household's view.

## Scope

**In:**

1. Every built-in row on All bookings belongs to one account, and each account's view lists only its own (D1, D2)
2. Pending and Recurring move to Household, so every row you can edit is Household's and an edit stays on its account (D3, D4)
3. Household's Executed tab shows its Account details rows (D5 to D7)
4. Empty Pending and Recurring tabs on Savings say so (D8)

**Out (not in this branch):**

- Pay debiting Savings (a debit account choice in Pay)
- More example history for Household (interview: as on Account details)
- An executed instance naming its standing order (44): Rent's executed rows stay in Savings' history while the rule is Household's (D4)
- Built-in transfers reading as a transfer to the same account (50); Pizza keeps the sheet it has on Account details

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Each built-in group and divider on All bookings carries `data-account`** (`household` or `savings`). When the page builds, before any other step (dates, in-app rows, month bands, search), the other account's groups and dividers are removed from the page | The account is fixed per page load (`?account=`), so removing once keeps every later step (53's dating, 47's instances, 42's built-in sync, month bands) unchanged |
| D2 | **Savings keeps the Executed history All bookings has today** (Salary, Rent, Transfer to Household, the months back to February) | It is Savings' list already; it matches Savings' Account details |
| D3 | **Pending and Recurring are Household's** (interview): Swisscom, Helvetia Insurance, Tax office Zurich, and Apple (from Account details, under its date, the same `data-builtin-id` so an edit or delete on either page applies to both); the standing orders Rent, Netflix and Internet & Phone | Interview. Pay books to Household, so every row with Edit is Household's and an edit keeps its account |
| D4 | **Rent's executed payments stay in Savings' history** while the rule is Household's. They are not linked (44) | Moving history would rewrite Savings' balances and months; linking an instance to its rule is 44 |
| D5 | **Household's Executed tab: Today and Yesterday as on Account details** (interview): a Today group (where payments made in the app go) and Yesterday with Café, Pizza and Railway. Apple is in Pending (D3), not Today | Interview. The two pages agree; no new example data |
| D6 | **Household's Today and Yesterday headers show Household's figures**, the same as Account details shows for that day (Today follows the running balance, as there) | One balance per account and day across pages |
| D7 | **A Household row opens the sheet it has on Account details** (Café, Pizza, Railway from `BOOKING_MAP_HOUSEHOLD`, with the row's status); Savings rows open as today | The sheets agree across pages; Savings unchanged |
| D8 | **Savings' Pending says "No pending payments."** (the existing line), **Recurring gets "No standing orders."** in the same style | An empty tab says so, as 42 settled for Pending |
| D9 | **Copy on a Savings row starts a new payment from Household**, as every Copy does today | Copy makes a new payment; Pay has one debit account |
| D10 | **No query still opens Savings**; Account details' "Show all" passes the account as before | Only Account details links to All bookings |

## Context

- All bookings markup: `all-bookings-and-payments.html`, Executed from line 2452 (Today, Yesterday, then month groups to February), Pending from 2834, Recurring from 2876. Every row is `data-mock-booking="static"`.
- The page's account: `accountKeyFromQuery` and `init` in `js/all-bookings.js` (`window.__UZ_ACTIVE_ACCOUNT__`). `renderBookings` puts executed in-app rows into the Executed panel's `[data-day="today"]` group and sets its header from `data-base` plus what moved.
- Household's rows: `account-details.html` around line 2482 (Today with Apple, Yesterday with Cafe, Pizza, Railway); its day headers are set by `renderDayBalances` in `js/data-render.js`.
- Sheets: `js/payment-details.js`, the row click handler (static All bookings rows through `buildAllBookingsRowData`, Account details rows through `getBookingMap()`).
- Order of page set-up: `UZBankBuiltInRows.date` (53), `renderBookings` with 47's instances, `UZBankBuiltInRows.sync` (42), `renderMonthSeparators`, search.
