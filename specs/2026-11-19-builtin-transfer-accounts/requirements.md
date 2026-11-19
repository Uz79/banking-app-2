# Built-in transfers name both accounts (50): requirements

Branch: `feature/builtin-transfer-accounts`

Roadmap item 50, found during 46 (2026-11-05). A built-in transfer's sheet could read "from Savings account to Savings account". Since then the built-in rows became per-account (`js/built-in-bookings.js`) and a transfer row that carries `from` and `to` reads both (62 D18), so the item is partly done. What remains: one row that is a transfer to its own account, two transfer rows with no `from`/`to` (they fall back to the page's account as the debit in `buildAllBookingsRowData`, `js/payment-details.js`), and two spellings of Savings.

## Scope

**In:**

1. `sv-to-savings-2-3` on Savings ("Transfer to Savings", 500) becomes a transfer from Savings to Household.
2. Every built-in row of type `transfer` carries `from` and `to`.
3. One name for the Savings account in user-facing copy: "Savings account".

**Out (one-line pointers, not this branch):**

- Moving the transfer sheet's debit logic: the fallback to the page's account stays for transfers made in the session (their own data names both accounts).
- Pay and the transfer sheet's choice of frequency, pending-transfer actions (45, 51).
- Any change to balances, to the other built-in rows or to the Custody account.

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **`sv-to-savings-2-3` becomes "Transfer to Household"**, icon `i-home`, `from: 'savings'`, `to: 'household'`, same amount (500) and date. | Klaudiusz's answer. Keeps a plain internal transfer, only the name, icon and accounts change. |
| D2 | **Every built-in `type: 'transfer'` row sets `from` and `to`**, so the built-in sheet never takes the page's account as the debit. Rows: `sv-to-household-320` (savings to household) and `hh-pizza` (household to savings, from its anchor icon; its name "Pizza" is kept). | Klaudiusz's answer: one rule. `hh-pizza`'s direction is a guess, see Open questions. |
| D3 | **The name is "Savings account"** everywhere users read it: the transfer overlay and its markup (`js/iat-overlay.js`, `js/trade-flow-overlay.js`, the "from" names in `account-details.html`, `payments.html`, `overview.html`). | Klaudiusz's answer. Matches the majority and the booking sheets. |
| D4 | **No new storage key, no new page, no CSS.** Mock data and copy only. | Smallest diff. |
| D5 | **Anything that compares the old capitalised name must keep working** (`findIatAccountKeyByName` in `js/payment-details.js`, and any lookup by account name). | A rename must not break a lookup by name. |

## Context

- `buildAllBookingsRowData` (`js/payment-details.js` about line 241) reads `data-from`/`data-to`; without them the debit is `window.__UZ_ACTIVE_ACCOUNT__` and the credit is parsed from "Transfer to X".
- `built-in-bookings.js` sets the attributes at about line 393.
- The two Savings spellings are listed in the roadmap item; the grep for "Savings Account" gives the files in D3.

## Open questions

- `hh-pizza` is a built-in "transfer" with no direction and the same 320 and day as `sv-to-household-320`. If it was meant as the Household side of that one, say so at review: it would become Savings to Household instead.
