Branch: `feature/demo-data-dates`

# Demo data moves with the real date (62, with 69): requirements

Roadmap items 62 and 69 (`specs/roadmap.md`), both from Klaudiusz on 2026-11-06. 62: every built-in booking is dated relative to today, so "Today" and "Yesterday" are right whenever the app is opened, the month chips come from the data, and Household gets several months of history again. 69: after the demo reset Household's card reads CHF 9'900.00 while the list's newest day ends at 10'000.00, because the pending Apple (-100) is taken off the card. Built together, as both are about one set of balances agreeing.

## Scope

**In:**

1. Every built-in booking (executed, pending and standing orders, both accounts) lives in one JS list, and All bookings and Account details draw their rows from it (D1, D2)
2. Executed history on calendar days: standing items on their day of the month, one-offs on a day in a month back from today, a few recent ones a set number of days back; the current month and the four before it (D3 to D5)
3. Household gets its own months of history (D6); Savings keeps its rows and amounts, re-dated (D7)
4. Every day's balance is worked out from the bookings, backwards from the account's balance, so the newest day always matches the card (D8, D9)
5. The cards show the booked balance: a pending payment counts nowhere until it executes, Apple included (D10, D11)
6. Payments made in the app go into the group of the day they were made (D12)
7. The month chips come from the months listed (D13)
8. Account details shows each account's two newest days, and its "Pending payments" line sums what is really pending (D14, D15)
9. A dev-only `?today=YYYY-MM-DD` on localhost to check other dates (D16)

**Out (not in this branch):**

- Pending payments executing on their date, and standing orders advancing (37): a built-in pending payment keeps moving ahead of today, as since 53
- Built-in transfers reading "from Household to Household" and the two names for Savings (50)
- Pay's calendar, "as soon as possible" and the flows' own dates (they follow the device date, not `?today`)
- What the "Pending payments" line does when tapped (it has hover styles but no action today)
- Overview's other accounts (Custody, Retirement 3a), which have no bookings

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One list, `js/built-in-bookings.js`** (`UZBankBuiltInBookings`), holds every built-in booking per account: id, name, amount, direction, type, icon, frequency, status and a date rule. All bookings and Account details render their built-in groups from it; the hand-written groups and their balances leave both HTML files (interview) | Today each row is written twice and each day's balance typed by hand, which is why Savings' card (25'000) and its Today (25'320) disagree |
| D2 | **The built-in rows keep their ids and their data attributes** (`data-builtin-id`, `data-status`, `data-type`, `data-execute-on`, `data-frequency`, `data-account`), so the sheet, Edit, Copy, Delete, `removedBuiltIns`, the standing-order instances (47) and the sync (42, 61) read them as before. Executed rows get ids too (`hh-…`, `sv-…`) | Nothing downstream should notice where a row came from. A stored `removedBuiltIns` keeps working because the existing ids stay |
| D3 | **Calendar days** (interview): a standing item falls on its own day of the month (Rent the 1st, Internet & Phone and Netflix the 5th, as their standing orders say; Salary the 25th); a one-off is `{ monthsAgo, day }`; a few recent ones are `{ daysAgo }` so Yesterday always has some (Café, Pizza, Railway on Household, as now). A date after today is dropped; a day past a short month's end moves to its last day | The executed instances agree with the rules in Recurring; one-offs still look scattered |
| D4 | **Five months: the current one and the four before it**, as the five chips today (Feb to Jun) | Enough to scroll and to check a month's last row being deleted |
| D5 | **The date rules for Pending and Recurring move into the list unchanged**: one-offs a few working days after today (53 D12), standing orders on their next day of the month, a weekend moved to Monday (53 D13). `dateBuiltInRows` in `js/data-render.js` becomes the list's own date helper | One home for every built-in date |
| D6 | **Household's history is authored for the five months**: about four to eight bookings a month of everyday spending (groceries, transport, cafés, a pharmacy), Netflix on the 5th (its standing order is Household's, 59), and money in from Savings once a month with the matching transfer out on Savings. The names come from the existing data where they fit. The list is reviewed in task group 1's check | Household lost its months in 56; the month chips and a month's last Delete need them there |
| D7 | **Savings keeps its rows and amounts**, re-dated by D3: Salary monthly on the 25th, Rent on the 1st, Internet & Phone on the 5th at CHF 59.00 (its standing order's amount; the history said 60.00), the one-offs in their month on their old day of the month | Same story, real dates |
| D8 | **Day balances are worked out, never typed**: the newest day ends at the account's running balance (`accountBalances` in `UZBankPayState`), and each earlier day ends at the later day's balance minus what the later day moved. Payments made in the app count on their day; the `carried` amounts (14) have no day, so they sit before every day listed. `days(account)` and `balanceAt(account, day)` in `js/built-in-bookings.js` are the one place both pages call. The stored `carried.householdOut` is no longer read (it fed the old Today figure) and stays in the schema (D17) | The newest day always matches the card, on every page (69) |
| D9 | **The registered balances stay** (Household 10'000, Savings 25'000): they are the balances after every built-in executed booking up to today, before anything made in the app | No change to the payment state, its schema or the demo reset |
| D10 | **The cards show the booked balance** (interview): a pending payment counts in no balance until it executes. `STATIC_TODAY_OUTFLOW` and `staticTodayOutflow()` leave `js/payment-state.js`, so Household reads 10'000.00 after the reset on Overview, Account details, All bookings and Pay's Debit account card, and the Overview total rises by 100 | Every other pending payment already moves nothing (`isExecuted` in `payment-state.js`); Apple was the one exception |
| D11 | **Apple is a pending payment like the others**: it leaves Account details' Today group (Account details lists executed bookings, plus the pending line of D15) and stays in Household's Pending tab on All bookings, dated the next working day | It hasn't moved money, so it doesn't belong under a day's balance |
| D12 | **A payment made in the app goes into the group of its own day** (`dateISO`), a new group in date order if the list has none for that day; one older than the five months shows with its own month band. Today holds only today's | Once Yesterday means yesterday, a payment from yesterday can't stay under Today |
| D13 | **The month chips come from the Executed list**: one chip per month listed, oldest first, the newest active, in the flow bar and the docked bar alike; the year on a chip only when the list crosses one, as the bands do (24) | The chips (`data-bookings-month="2026-02"` …) are fixed markup and stop matching once the dates move |
| D14 | **Account details shows each account's two newest days with bookings**, labelled Today, Yesterday or the date (`DD.MM`, as All bookings), then Show all bookings as now | Today may have no booking; the panel should not go empty on such a day |
| D15 | **The "Pending payments" line sums what the account's Pending tab lists**: its pending one-offs and each standing order's next payment, built-in and made in the app, without "until 31.05.2026". On both accounts; hidden when nothing is pending. The next-payment derivation (47, `rulesOf` and `renderInstances` in `js/all-bookings.js`) moves where both pages can call it | The line's date and amount are stale markup. One derivation, so the line and the tab can't disagree |
| D16 | **`?today=YYYY-MM-DD` sets the date the demo data counts from, on `localhost` and `*.local` only**, ignored on every other host (the live domain and Vercel previews). Nothing is stored; the flows keep the device date | So a month's first day, a Monday and a January (the year band) can be checked without changing the Mac's clock (interview) |
| D17 | **No new storage key, no schema change** | D9 |
| D18 | **Household gets CHF 1'500 from Savings every month, on the 26th** (a working day): "Transfer from Savings" (+) on Household and "Transfer to Household" (-) on Savings, each leg naming both accounts (`from`, `to`) for its sheet. Savings' "Transfer to Household" -320 and Household's "Pizza" -320 stay as they were, yesterday (they are 50's) | Settled in the build (task group 1), the open question on D6. Without money in, Household's past balances only ever fall; the existing pair is 50's to sort out |
| D19 | **A standing order's next execution is its first occurrence after today, the weekend already moved** (53 D13 moved the weekend after picking the month). The same occurrence is the executed instance once it is today or earlier | Found in the build: on a Saturday the 1st, 53's rule skipped to next month while this month's Monday occurrence was still ahead, so one month's Rent was in neither list |

Checked against `tech-spec.md`: no new dependency or system. The "Booking rows" and "Standing orders" decisions still hold; the "Standing orders" row's "Built-in Pending and Recurring dates are set from today when the page builds (`UZBankBuiltInRows.date` in `js/data-render.js`)" changes to the new list (D5) and is updated at wrap-up, with a new row for D1, D8 and D10.

## Context

- `all-bookings-and-payments.html` (about lines 2387 to 2980): the month chips (Feb to Jun, fixed, in the flow bar and the dock), the Executed groups (Household: an empty Today and Yesterday; Savings: Today with Salary, then dated groups 28.05 to 05.02, each with a typed balance), Pending (Apple, Swisscom, Helvetia, Tax office, with `data-offset-days`) and Recurring (Rent, Netflix, Internet & Phone, with `data-day-of-month`).
- `account-details.html` (about lines 2468 to 2596): the same Household and Savings Today and Yesterday groups, Apple pending in Household's Today, and the stale "Pending payments until 31.05.2026" line with CHF 2'500.00.
- `js/payment-state.js`: `INITIAL_HOUSEHOLD`, `YESTERDAY_BALANCE`, `STATIC_TODAY_OUTFLOW` and `STATIC_TODAY_ROW` (about lines 52 to 61); `accountRunningBalance` takes Apple off Household (line 366); `getState()` builds `todayBalance` and `yesterdayBalance` for the headers.
- `js/data-render.js`: `renderBookingsForAccount` puts in-app executed bookings into Account details' Today; `renderDayBalances` sets the two `data-day-balance` headers; `dateBuiltInRows` and `syncBuiltInRows` (`UZBankBuiltInRows`).
- `js/all-bookings.js`: `renderBookings` puts in-app executed bookings into Today and adds their net to its typed figure (`data-base`); `renderMonthSeparators`, the month chips and spy; `rulesOf` and `renderInstances` derive the standing orders' next payments from the Recurring markup; `init` removes the other account's groups.
- `js/payment-details.js`: `buildAllBookingsRowData` reads a built-in row's status and date from its attributes; `BOOKING_MAP_HOUSEHOLD` and `BOOKING_MAP_SAVINGS` hold a few rows' sheet details by name (Apple's and Café's addresses), and stay.
- Stored bookings carry `dateISO` (`commitPayment`, the transfer, trades), so D12 needs no new field.

## Open questions

- ~~Household's monthly money in from Savings~~: settled in D18.
- A built-in transfer's sheet reads the page's account as its debit (50). The new monthly pair carries `from` and `to`; whether the sheet reads them is checked in task group 3.
- Whether `components.html`'s booking row specimens use fixed dates or balances that should stay as they are (expected: they stay, they are specimens).
