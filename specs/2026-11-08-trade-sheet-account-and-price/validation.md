# The trade sheet: account labels and the price (55, 65): validation

Branch: `feature/trade-sheet-account-and-price`. Run on the agent's server (port 5199), then the baseline smoke test. Start after Profile's "Reset demo data" unless it says otherwise. Open the sheet from Custody account, a position, Buy or Sell.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (built 2026-11-08)
- [x] No console errors on the position page, with the sheet opened as Buy and as Sell (Buy opened and read; Sell was opened after the last console read; only the Chrome extension's "message channel closed" notice appeared, filtered out)

## 2. Buy

- [x] Price shows the market price when the sheet opens; typing a limit of 100.00 leaves Price unchanged (Price CHF 1'008.50 before and after a limit of 100.00)
- [x] Expected total price is shares times the typed limit (3 shares at 100.00 reads CHF 300.00); emptying the limit or choosing Market makes it shares times the market price (3 shares at limit 100.00 gave CHF 300.00; Market gave CHF 3'025.50)
- [x] "Available in Household account" with Household's balance by default (read from the DOM: label and CHF 10'000.00)
- [x] Choosing Savings account in the picker makes the label "Available in Savings account" and the balance 25'000.00 at once; choosing Household brings the first back (no "Savings Account account") (label "Available in Savings account", CHF 25'000.00; back to Household not repeated here, a reopened Buy reads Household again)
- [x] The over-balance error still reads "You have CHF ... in <account>." and uses the same total (a limit above the balance triggers it) (50 shares at 1000.00 gave "You have CHF 10'000.00 in Household.")
- [x] The account field is still labelled "Debit account" and its picker sheet is titled "Debit account" (the picker title read "Debit account" in Buy)

## 3. Sell

- [x] The summary shows Price, Expected total price and In Custody account; there is no "Available in" line (the three visible rows, read from the DOM)
- [x] The account field is labelled "Credit account", its button reads "Select credit account" to the screen reader tree (read from the DOM), and its picker sheet is titled "Credit account" (label, aria-label "Select credit account" and the picker title, and the picker lists Household and Savings Account)
- [x] Price stays at the market price with a typed limit; the total follows the limit (limit 100.00, 2 shares: Price CHF 1'008.50, total CHF 200.00)
- [x] Closing the sheet and opening Buy brings back "Debit account" and the "Available in" row; opening Sell again hides it again (Buy reopened after Sell reads "Debit account", the row shown and Household)
- [x] A sale still books and the confirmation reads as before (D8) (1 share sold: "Your order to sell 1 ABB Ltd share has been placed.", Limit CHF 1'008.50, Household 10'000.00 to 11'008.50; nine shares gave "You hold 5 shares.")

## 4. Everywhere

- [ ] Light and Dark, desktop and 390px: the summary rows fit, nothing wraps that did not before, and Sell's sheet loses a row without a gap (Dark: desktop and a 390px frame, no overflow, labels on one line; Light: desktop Sell by screenshot, rows fit; Light at 390px not looked at)
- [x] Legibility Large: the label "Available in Savings account" fits or wraps without overlapping its value (390px frame, Dark, Large: "Available in Savings account" is one line, 24.4dp, no overflow)
- [ ] Keyboard: Tab order and the focus ring are unchanged; the picker opens with Enter and Space (Tab order amount, order type, limit, duration, Custody, account button; Enter on the account button opened the Credit account picker with focus on its first row; Space was not pressed; the inputs and account cards keep the outline none they had, the focus ring on the chips and buttons is a 2px solid outline)
- [ ] Reduced motion: nothing new animates (nothing animated was added; the macOS setting was not switched)

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Desktop in Light then Dark.

- [x] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below (read on Components, Character kit, Motion specimens, the position page with Buy and All bookings; not on Overview, Pay, the transfer or Profile)
- [x] Overview loads with sidebar; the 3D canvas is present (the character itself was not looked at)
- [x] Light/Dark toggle switches and survives a reload (Dark to Light, reload: still Light)
- [ ] Navigating Overview, Account details, All bookings and back plays the page transitions in the right directions (not checked)
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (appeared at about 12.1 s from load; a tap dismissed it)
- [x] Pay: recipient, amount, schedule, summary, execute: Household 11'008.50 to 10'888.50, focus on Done
- [x] Internal transfer completes (500 Household to Savings: 10'388.50 and 25'500)
- [x] Custody account, a position, Buy opens the trade flow and can be dismissed (Discard order? with Continue order and Discard)
- [x] All bookings: tabs, month chips and search work (Executed 5 bands, Pending 1, Recurring 1, 20 chips; "Rent" left 5 rows; "Hans" left none on this account, where no Hans booking is listed)
- [x] User Type: the knowledge slider to 100 was stored (the character, title and preview were not looked at)
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Large, Small and Regular set `--fs-text-sm` to 1.015, 0.7875 and 0.875rem; Typeface, Font and Paddings not run)
- [x] Theme: the UZ Bank card cleared the 38 inline colour tokens and restored the plain look; Custom 10 restored them (not walked page by page)
- [x] Demo data reset restores 10'000 and 25'000 after its dialog; "Demo data reset." appeared
- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (the four cards are listed; the arrows were not watched)
- [x] Motion specimens, Components and Character kit open (Components' back link goes to the hub; the others were opened by address)
- [x] The Character kit profile buttons are present and the first one set (Beat); the figure was not looked at
- [ ] Tab through Overview: focus is always visible (not run on Overview; the trade sheet's Tab order is above)
- [ ] With reduced motion on, page transitions and the character are still (the macOS setting was not switched)

Checked on 2026-11-08 against `feature/trade-sheet-account-and-price`, Chrome on the agent's server (5199), desktop 1728px and one 390px frame, Dark and Light (the toggle left it on Light), the default Multi-color theme, Custom 10 and the UZ Bank look; demo admin switched on in `localStorage` for the design pages and cleared again. Not checked: Sell's Light look at 390px; Space on the account button; every Tab stop on every page; reduced motion with the macOS setting; page transitions; Legibility's Typeface, Font and Paddings; the console on Overview, Pay, the transfer and Profile; the arrows on the hub; the 3D figure by eye.
