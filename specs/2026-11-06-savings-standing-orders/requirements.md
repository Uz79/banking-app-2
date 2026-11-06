Branch: `feature/savings-standing-orders`

# Savings' standing orders (59, with 57): requirements

Roadmap item 59 (`specs/roadmap.md`), found in Klaudiusz's manual check on 2026-11-06. Since 56, Savings' All bookings says "No standing orders." in Recurring and "No pending payments." in Pending, while its Executed history shows Rent and Internet & Phone with the "Monthly" chip. A standing order's executions and its rule belong to the same account. Built with 57 (a standing order's next payment on Household reads "from Savings account"), which sits in the same code.

## Scope

**In:**

1. Rent and Internet & Phone are Savings' standing orders again: their rules in Savings' Recurring, their next payments in Savings' Pending (D1, D2)
2. Netflix and the Pending one-offs stay Household's (D2)
3. Pay books from the account a row belongs to: an edit or a Copy of a Savings rule or its next payment stays on Savings, in the lists, the sheets and the balance (D3 to D7)
4. Every rule's sheet and its next payment's sheet name the rule's own account (57, D8)

**Out (not in this branch):**

- A debit account choice in Pay for a new payment (the card stays Household's for a fresh payment; its chevron stays inert, as today)
- Linking an executed instance to its rule (44), a frequency choice (45), rules that execute on their date (37)
- The transfer flow, Buy and Sell
- An edited next payment surviving an edit of its rule: roadmap 68
- A debit account in the payment sheet (57's finding)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Rent and Internet & Phone are Savings'**: their Recurring groups carry `data-account="savings"` (interview) | The rules follow their history (56 D4 left Rent's executions on Savings and its rule on Household) |
| D2 | **Netflix stays Household's, as do Swisscom, Helvetia Insurance, Tax office Zurich and Apple** (interview) | Netflix has no history on either account; the one-offs were settled in 56 |
| D3 | **A booking made by Pay carries the account it books from** (`payment.accountKey`, default `household`); `commitPayment` and `updatePayment` in `js/payment-state.js` keep it | The lists and balances already filter by `accountKey`; only Pay hard-codes Household |
| D4 | **The edit context names the account**: `js/payment-details.js` passes the row's account (a built-in row's `data-account` group, a stored booking's `accountKey`) as `accountKey` in `__UZ_PD_EDIT_CONTEXT__`; Pay keeps it in `live.debitKey` (interview) | An edit stays on its account |
| D5 | **Copy keeps the row's account too** | Revises 56 D9 ("Copy on a Savings row starts a new payment from Household"): with Pay able to book from Savings, a copy of a Savings payment is a Savings payment. Flagged for review |
| D6 | **Pay's Debit account card is painted from `live.debitKey`** (name, IBAN, icon, running balance), on the amount step and the summary, on every page with Pay (`overview.html`, `account-details.html`, `all-bookings-and-payments.html`, `payments.html`); a fresh payment shows Household as today | What the card shows is what gets booked |
| D7 | **The over-balance check uses the debit account's running balance** (`householdBalance` in `js/payment-overlay.js` becomes the debit account's) | 54's check must not compare a Savings payment with Household's balance |
| D8 | **A row's account comes from the row itself** (`rowAccountKey` in `js/payment-details.js`: a stored booking's `accountKey`, a next payment's rule, a built-in row's group or Account details panel, else the page's), used for the edit context. Revised in the build: the domestic payment sheet shows no debit account, so 57 changes nothing visible (see Found in the build) | A row knows its account; the page's account was the wrong source |
| D9 | **Savings' empty-tab lines stay** for when a tab is empty (after a Delete, for example); Household keeps its own | 56 D8 |
| D10 | **No new storage key**; stored bookings without `accountKey` read as Household, as today | Old data keeps working |

## Context

- Savings' Executed history (`all-bookings-and-payments.html`): Rent on Yesterday and 15.03, Internet & Phone on 07.05, all `data-frequency="monthly"`. The rules: `allb-recurring-rent` (day 1), `allb-recurring-netflix` and `allb-recurring-internet` (day 5), in groups with `data-account="household"` since 56.
- 56's D1: the other account's groups are removed when the page builds; 47's next payments are derived from the remaining rules.
- `commitPayment` (`js/payment-state.js`, about line 501) sets `accountKey: 'household'`; `renderBookings` (`js/all-bookings.js`), `renderBookingsForAccount` (`js/data-render.js`) and `accountRunningBalance` filter by `accountKey`.
- Pay's Debit account card is static markup naming Household on the amount step and the summary (`overview.html` about lines 2779 and 2862, and the same on the other Pay pages).
- The edit context: `__UZ_PD_EDIT_CONTEXT__`, consumed in `js/payment-overlay.js` (about line 1029).
- `buildAllBookingsRowData` (`js/payment-details.js`, about line 222) takes the debit from `window.__UZ_ACTIVE_ACCOUNT__`; `instanceData` (about line 496) falls back to it for a built-in rule.

## Found in the build

- 57: the domestic payment sheet (every rule and next payment here) never shows a debit account. Its hidden debit row keeps the markup's text, "Savings account" (`#uz-pd-debit-name` in `all-bookings-and-payments.html` and `account-details.html`), which is what was read in 33's check. Nothing on screen named the wrong account, so 57 is closed by D8 without a visible change; showing a debit account in the payment sheet would be a new item.
- An edit of a rule's next payment, followed by an edit of the rule itself, leaves two payments on that date in Pending: the edited one-off (stored with the old rule's id) and the new rule's next payment. 47's behaviour on either account, not from this branch: roadmap 68.
- Pay's Debit account card had its balance painted by `js/data-render.js` with Household's figure on every state change; it now paints the balance of the account the card names (`data-debit-key`).
