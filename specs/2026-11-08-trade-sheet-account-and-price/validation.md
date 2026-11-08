# The trade sheet: account labels and the price (55, 65): validation

Branch: `feature/trade-sheet-account-and-price`. Run on the agent's server (port 5199), then the baseline smoke test. Start after Profile's "Reset demo data" unless it says otherwise. Open the sheet from Custody account, a position, Buy or Sell.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on the position page, with the sheet opened as Buy and as Sell

## 2. Buy

- [ ] Price shows the market price when the sheet opens; typing a limit of 100.00 leaves Price unchanged
- [ ] Expected total price is shares times the typed limit (3 shares at 100.00 reads CHF 300.00); emptying the limit or choosing Market makes it shares times the market price
- [ ] "Available in Household account" with Household's balance by default
- [ ] Choosing Savings account in the picker makes the label "Available in Savings account" and the balance 25'000.00 at once; choosing Household brings the first back (no "Savings Account account")
- [ ] The over-balance error still reads "You have CHF ... in <account>." and uses the same total (a limit above the balance triggers it)
- [ ] The account field is still labelled "Debit account" and its picker sheet is titled "Debit account"

## 3. Sell

- [ ] The summary shows Price, Expected total price and In Custody account; there is no "Available in" line
- [ ] The account field is labelled "Credit account", its button reads "Select credit account" to the screen reader tree (read from the DOM), and its picker sheet is titled "Credit account"
- [ ] Price stays at the market price with a typed limit; the total follows the limit
- [ ] Closing the sheet and opening Buy brings back "Debit account" and the "Available in" row; opening Sell again hides it again
- [ ] A sale still books and the confirmation reads as before (D8)

## 4. Everywhere

- [ ] Light and Dark, desktop and 390px: the summary rows fit, nothing wraps that did not before, and Sell's sheet loses a row without a gap
- [ ] Legibility Large: the label "Available in Savings account" fits or wraps without overlapping its value
- [ ] Keyboard: Tab order and the focus ring are unchanged; the picker opens with Enter and Space
- [ ] Reduced motion: nothing new animates

## 5. Baseline smoke test

Copy the items from `specs/baseline/validation.md` here when the wrap-up group starts, and tick them as they are run.

Checked on: (not yet run)
