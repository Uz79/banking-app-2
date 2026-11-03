# Confirmation copy: say what happened (15): requirements

Branch: `feature/confirmation-copy`

Roadmap item 15 (`specs/roadmap.md`), found at the end of `specs/2026-10-25-all-bookings-real/`: the transfer confirmation says the transfer "will be executed now". Reading the code showed that the same dialog shell gets it wrong in all three flows that use it:

- **Transfer:** "Your payment of CHF 500.00 to Savings account will be executed now", with a Confirm button. It calls a transfer a payment, and says "now" also for a transfer scheduled later or recurring. The button suggests one more step, although the transfer is already booked.
- **Payment:** "will be executed with sufficient credit on 03.11.2026", also for a payment that has just run.
- **Trade (Buy and Sell):** "Your order to buy … will be executed now", with a Confirm button, also for a limit order.

The interview settled:

- all three confirmations are in scope;
- the text says what happened, following the schedule step: done now, made later on a date, or recurring from a date;
- the button says "Done" in all three;
- the merge gate is the standard one, with every schedule case of each flow checked.

## Scope

**In:**

1. The transfer confirmation: its sentence follows the schedule, and it gets a date line (D1 to D4)
2. The payment confirmation: the same rule, without "with sufficient credit" (D1 to D3, D5)
3. The trade confirmation: says the order was placed, with its limit and validity (D6)
4. "Done" on all three buttons (D7)
5. The copies of the markup on Overview, Account details and Payments, and the trade's on the position page (D8)

**Out (not in this branch):**

- What the flows book or with which status: only the words change (when the transfer and the trade record moved to Execute, D10)
- The flows' other steps and their summaries
- How a screen reader announces the dialog (not in the interview's merge gate; a check of it, if wanted, is its own item)
- `spa-source.html`, the old reference that the tech-spec says not to extend
- Other open roadmap items (23: editing a pending payment turns it executed)
- Found in the build, on the roadmap: the execution date can't be picked, so a later or recurring booking keeps today's date (28)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The sentence follows the schedule step's choice**, which each flow already works out as `scheduleStatus()` (`executed`, `pending` or `recurring`). Executed: "Your transfer of CHF 500.00 to Savings account is done." Pending: "… will be made on 05.11.2026." Recurring: "… starts on 05.11.2026." | Interview: say what happened. The status already decides how the booking is stored, so the words can't drift from what the app did |
| D2 | **The lead names the flow:** "Your transfer of" in the transfer, "Your payment of" in the payment. For a recurring choice: "Your recurring transfer of", "Your recurring payment of", and "Your standing order of" for the payment's Standing order option | A transfer is not a payment; the payment's schedule step offers Recurring and Standing order as separate options, so the dialog uses their own names |
| D3 | **The date** shows only when it isn't today's execution: pending and recurring show the chosen date (`live.dateLabel`) on its own line, as the payment's dialog does now; executed shows no date | "is done" needs no date; a future date is the one fact the customer needs to check |
| D4 | **The transfer dialog gets the date line** (`.confirmation-dialog__date`) that the payment dialog already has | Same shell, same parts |
| D5 | **"with sufficient credit" goes** | The app has no credit check, and for a payment that has run it reads as a condition that wasn't met yet |
| D6 | **The trade says the order is placed:** lead "Your order to buy" or "Your order to sell", the total, the quantity and name as now, then "has been placed." A limit order adds a line "Limit CHF 200.20, valid today" (Daily order), "… valid until cancelled" (GTC) or "… valid until 05.11.2026" (Execute until); a market order adds "At the market price" | An order is placed, not executed, until the market fills it; the limit and its validity are what the customer chose. The app books the trade at once (unchanged here), so "placed" stays true either way |
| D7 | **The button says "Done"** in all three dialogs; it still only closes the dialog and the flow | Interview. The action is complete when the dialog shows |
| D8 | **The words are set by script** in each flow's `paintConfirmationDialog()`; the markup in `overview.html`, `account-details.html`, `payments.html` and `details-of-position.html` gets the same defaults (the executed case) so the copies stay identical | The text depends on the schedule, so it has to be painted; the static defaults keep the copies honest if a script fails |
| D9 | **Copy:** English, short, no em dashes; dates as the flows already format them (`dd.mm.yyyy`); amounts as now | AGENTS.md |
| D10 | **The transfer and the trade record on Execute** (found in the build, amends D7 and the "Out" list): they recorded only when the dialog's Confirm was pressed, so the dialog was the last step rather than a confirmation. Now Execute (transfer) and the order button (trade) record, as the payment's Execute already does, and the dialog's Done only closes. Like the payment's, they do nothing while the dialog is open, since they keep the keyboard focus behind it | A dialog that says "is done" or "has been placed" must come after the booking, or the words are false whenever the dialog is left another way. The booking itself (amounts, status, accounts) is unchanged |
| D11 | **A footer that ends the text** takes the date line's size and spacing above the button; a footer with a date or limit line under it stays small, as the payment's did. One rule on `.confirmation-dialog__footer` replaces the transfer's and trade's own | The footer is now sometimes last and sometimes not, in all three dialogs |

## Context

- `js/iat-overlay.js`: `scheduleStatus()` near line 189 (`recurring` from `data-exec`, else `live.immediately`); `paintConfirmationDialog()` near line 277 paints currency, amount and recipient only; the button is `#uz-iat-conf-btn`.
- `js/payment-overlay.js`: `scheduleStatus()` near line 143 (mode by the segmented option's text: Single, Recurring, Standing order; the "as soon as possible" toggle); `paintConfirmationDialog()` near line 238 paints the date from `live.dateLabel`; the button is `[data-action="done"]` and already reads Done.
- `js/trade-flow-overlay.js`: `paintConfirmationDialog()` near line 291 sets the lead; the order type is `#uz-trade-order-type` (limit, market), the validity `live.duration` (`daily`, `gtc`, `until`) with `live.untilDateLabel`; the limit from `#uz-trade-limit`. The button is `#uz-trade-conf-btn`.
- The transfer and payment dialogs' markup is copied in `overview.html`, `account-details.html` and `payments.html` (and `spa-source.html`, left alone); the trade's is in `details-of-position.html`.

## Open questions

None from the interview. The exact words above can be changed at review.
