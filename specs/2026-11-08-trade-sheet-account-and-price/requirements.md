Branch: `feature/trade-sheet-account-and-price`

# The trade sheet: account labels and the price (55, 65): requirements

Roadmap items 55 and 65 (`specs/roadmap.md`), built together because they are the same sheet and 65 asks whether 55 is still needed.

The Buy and Sell sheet (`details-of-position.html`, `js/trade-flow-overlay.js`) has four rough edges:

- **Sell shows a line it should not.** The summary lists "Available in Household account". When selling, the money goes in, so there is nothing to be "available" (65).
- **Sell's account is called "Debit account".** In Sell it is the account that receives the proceeds, a credit account (65).
- **Buy's "Available in Household account" is a fixed label** (`details-of-position.html:2618`). With Savings chosen as the debit account the label still says Household. The amount next to it already follows the chosen account (`paintSummary`, line 328) (55).
- **"Price" follows the typed limit.** `paintSummary` writes `effectiveLimitPrice()` into the Price row, so with Limit set to 100.00 the row reads CHF 100.00 instead of the market's 389.22 (65).

## Scope

In:

- Buy: "Available in" names the chosen account, with its balance, and follows the picker.
- Sell: the "Available in" row goes; the account field's label and the picker's sheet title read "Credit account".
- Buy and Sell: "Price" always shows the market price; "Expected total price" uses the typed limit.

Out:

- Sell's confirmation, booking row and booking sheet wording (they keep what they say).
- The display-only rows and account pickers against the field anatomy (roadmap 71).
- Any change to how a trade books, to balances, or to the over-balance check.

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | The Price row shows the market price (`live.marketPrice`) in every state: Buy or Sell, Limit or Market, whatever is typed in Limit | It is the price the market is at; the order's limit is the user's input and has its own field. Asked and answered in the interview |
| D2 | "Expected total price" is shares times the typed limit for a Limit order, and shares times the market price for a Market order (as `orderTotals` already does) | It is the most a limit order can cost or the least a sale brings in, and it matches the Limit field. Only the Price row changes. The over-balance check in Buy keeps using the same total |
| D3 | In Sell the "Available in" row is hidden (`hidden`), not removed from the markup; "In Custody account" stays | Buy and Sell share one sheet, so the row comes back when the side is Buy. Selling needs the shares held, which that row already shows |
| D4 | In Sell the account field's label and the picker sheet's title read "Credit account", and the button's `aria-label` reads "Select credit account". In Buy they stay "Debit account" | The same account, named for what it does in that order. `live.debtorKey` and the data keep their names (no rename, AGENTS.md) |
| D5 | In Buy the row's label is "Available in " plus the chosen account's name plus " account" ("Household account", "Savings account"), set by `paintSummary` and so updated the moment the picker closes. A trailing "Account" in the catalogue name is dropped so it does not read "Savings Account account" | 55: the label follows the account, as the amount already does. Spelled the way the row reads today |
| D6 | The label sits in its own element with an id (`uz-trade-available-label`); no other markup moves, and no ARIA changes except D4's `aria-label` | Small diff; the rows are not form fields, so the field anatomy (roadmap 64) is not touched |
| D7 | No new page, script, dependency or storage key. Copy has no em dashes | AGENTS.md conventions; nothing in the "Not using" list is touched |
| D8 | Sell's other wording (confirmation, booking, sheet) is left as it is | Asked and answered in the interview: label and picker title only |

## Context

- `paintSummary` (`js/trade-flow-overlay.js:315`) writes Price, Total, Available and In Custody. `paintForm` and `paintAccounts` call it, and the account picker's `onSelect` calls `paintAccounts`, so a label painted there follows the picker with no new wiring.
- `effectiveLimitPrice()` (line 199) returns the market price for Market and for a limit of 0 or empty. The total and the over-balance check keep using it.
- The sheet exists only in `details-of-position.html`; no other page carries it.
- The account label is a static `<span class="form-field__label">Debit account</span>` at `details-of-position.html:2692` and the picker title is `'Debit account'` in `openAccountPicker` (line 580).

## Open questions

- Does Sell's picker sheet list "Savings Account" and "Household" with their balances as it does in Buy? Expected yes, same catalogue; check in the build.
