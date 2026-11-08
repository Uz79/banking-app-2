# The trade sheet: account labels and the price (55, 65): validation

Branch: `feature/trade-sheet-account-and-price`. Run on the agent's server (port 5199), then the baseline smoke test. Start after Profile's "Reset demo data" unless it says otherwise. Open the sheet from Custody account, a position, Buy or Sell.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (built 2026-11-08)
- [ ] No console errors on the position page, with the sheet opened as Buy and as Sell

## 2. Buy

- [x] Price shows the market price when the sheet opens; typing a limit of 100.00 leaves Price unchanged (Price CHF 1'008.50 before and after a limit of 100.00)
- [x] Expected total price is shares times the typed limit (3 shares at 100.00 reads CHF 300.00); emptying the limit or choosing Market makes it shares times the market price (3 shares at limit 100.00 gave CHF 300.00; Market gave CHF 3'025.50)
- [x] "Available in Household account" with Household's balance by default (read from the DOM: label and CHF 10'000.00)
- [x] Choosing Savings account in the picker makes the label "Available in Savings account" and the balance 25'000.00 at once; choosing Household brings the first back (no "Savings Account account") (label "Available in Savings account", CHF 25'000.00; back to Household not repeated here, a reopened Buy reads Household again)
- [ ] The over-balance error still reads "You have CHF ... in <account>." and uses the same total (a limit above the balance triggers it)
- [ ] The account field is still labelled "Debit account" and its picker sheet is titled "Debit account"

## 3. Sell

- [x] The summary shows Price, Expected total price and In Custody account; there is no "Available in" line (the three visible rows, read from the DOM)
- [x] The account field is labelled "Credit account", its button reads "Select credit account" to the screen reader tree (read from the DOM), and its picker sheet is titled "Credit account" (label, aria-label "Select credit account" and the picker title, and the picker lists Household and Savings Account)
- [x] Price stays at the market price with a typed limit; the total follows the limit (limit 100.00, 2 shares: Price CHF 1'008.50, total CHF 200.00)
- [x] Closing the sheet and opening Buy brings back "Debit account" and the "Available in" row; opening Sell again hides it again (Buy reopened after Sell reads "Debit account", the row shown and Household)
- [ ] A sale still books and the confirmation reads as before (D8)

## 4. Everywhere

- [ ] Light and Dark, desktop and 390px: the summary rows fit, nothing wraps that did not before, and Sell's sheet loses a row without a gap
- [ ] Legibility Large: the label "Available in Savings account" fits or wraps without overlapping its value
- [ ] Keyboard: Tab order and the focus ring are unchanged; the picker opens with Enter and Space
- [ ] Reduced motion: nothing new animates

## 5. Baseline smoke test

Not run yet: copy the items from `specs/baseline/validation.md` here and run them before this branch is merged.

Checked on 2026-11-08 against `feature/trade-sheet-account-and-price`, Chrome on the agent's server (5199), desktop only, Light, the default Multi-color theme, the sheet driven through the DOM with one screenshot. Not checked: the over-balance error; the Debit account picker title in Buy; a Sell booking and its confirmation; console errors; Dark; 390px; Legibility Large; keyboard; reduced motion; the baseline smoke test.
