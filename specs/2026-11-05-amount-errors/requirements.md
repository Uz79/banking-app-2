Branch: `feature/amount-errors`

# Amount errors: an invalid amount shows where the error is (54): requirements

Roadmap item 54 (`specs/roadmap.md`). The flows' amount fields take any value and fail without a word:

- **Buy and Sell:** Confirm with an empty or zero amount does nothing (`js/trade-flow-overlay.js:543`, `totals.quantity <= 0`): no message, no focus move. Sell accepts more shares than held; the holding drops to 0 (`commitTradeOrder` in `js/payment-state.js`). An empty or zero limit price silently falls back to the market price (`effectiveLimitPrice`).
- **Pay:** the amount step has no check (`js/payment-overlay.js`, the Confirm handler only steps on). With 0 the flow goes on; on Execute `commitPayment` drops it, yet the confirmation still shows.
- **The transfer:** its first step returns silently on 0 (`js/iat-overlay.js:384`). An emptied field keeps the previous amount (`collectRecipientStep`, line 342), so Confirm goes on with CHF 500 no longer shown.
- **Nothing checks a balance.** Household can go negative; the smoke test for 41 found it below zero after test payments.
- **"pcs."** is still the unit in four places: the trade sheet's "In Custody account pcs. 51", the position page's Quantity, the Custody account list, and a trade booking's message. 41 changed only the confirmation.

## Scope

**In:**

1. The error state on every amount field of the four flows: the trade's Amount and Limit price, Pay's amount step, the transfer's amount (D1 to D3)
2. When it shows: on leaving a field that was typed into; Confirm checks every field (D4 to D6)
3. The messages for empty, zero, too many shares and over the balance (D7 to D10)
4. How screen readers hear it (D11)
5. "share" and "shares" in place of "pcs." everywhere (D12)
6. The transfer no longer goes on with an amount that was emptied (D13)

**Out (not in this branch):**

- Escape on the sheets (49); D6 is written so it holds once Escape closes them
- Other fields' errors (recipient name, IBAN, dates)
- The error colour as a token: the dark-mode pink is hard-coded in the existing error rules (`css/styles.css`, "status error placeholder until status tokens exist"); this branch reuses those rules and adds no colour
- Funds, ETFs and bonds as units (41, D13)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The existing form-field error state**, as the admin sign-in has it (`js/admin.js`): `.form-field--error` on the field, a `.form-field__error-row` with the `#i-alert-triangle` icon and the message under the control, `aria-invalid="true"` on the input. The error stroke rules gain `.amount-input` next to `.form-field__text-wrap`, in the same colours | Roadmap 54. One look for every field error; no new colour (AGENTS.md: tokens only, and the placeholder pink is already there) |
| D2 | **One small shared helper**, `UZBankFieldError` in a new `js/field-error.js`: `show(field, input, message)` and `clear(field, input)`. It builds the row once per field, sets `aria-invalid` and `aria-describedby`. Loaded on every page that carries one of the four flows (overview, payments, account-details, all-bookings-and-payments, details-of-position) | Three scripts need the same markup and ARIA; a copy in each drifts |
| D3 | **While an error shows, it takes the field's info row's place**: the trade Amount's "Stock split 1" line hides and comes back with the error gone | One row under a field, as Figma's TextField has one footer row |
| D4 | **The error shows when focus leaves a field that was typed into** (interview), not one only passed through. Once shown, it updates and clears live as the value changes: gone as soon as it's valid | Interview. No error for a half-typed amount; no error for tabbing past |
| D5 | **Confirm checks every field** of its step (interview): it marks all errors, moves focus to the first one, and does not go on. This covers untouched fields. Confirm stays enabled | Interview. `specs/tech-spec.md`: call-to-action buttons are never disabled |
| D6 | **Closing never shows an error** (interview): a field left by pressing the sheet's close button (or, once 49 lands, Escape) is not checked. Opening Buy or Sell resets the form and clears every error. The blur check is deferred a frame and skipped when the press was on the sheet's close button or the sheet is closing | Interview. Pressing X takes focus from the field first; without the guard the error would flash as the sheet closes |
| D7 | **Empty**: "Enter an amount." (Limit price: "Enter a limit price.") | Roadmap 54's own words |
| D8 | **Zero**: money "Enter an amount above 0."; shares "Enter at least 1 share."; limit price "Enter a limit price above 0." | Says what would be valid, not that it's wrong |
| D9 | **Sell over the holding**: "You hold 51 shares." ("You hold 1 share.") on the Amount | Roadmap 54 |
| D10 | **Over the balance, only for what runs now** (interview): Buy's total over the debit account's running balance, on the Amount: "You have CHF 9'900.00 in Household." Pay and the transfer pick their schedule after the amount, so their amount step checks only empty and zero; on the summary, Execute of a payment or transfer that runs now and is over the balance goes back to the amount step with the error shown and focus in the field. A later or recurring one is not checked, as it moves no money yet | Interview. Shows the error where it can be fixed, without guessing the schedule at the amount step |
| D11 | **Screen readers**: the error row is `aria-live="polite"` and named by the input's `aria-describedby`, so it is read when it appears after a blur, and with the field when Confirm moves focus into it. No `role="alert"` (it would interrupt and double the reading on Confirm) | To hear in the VoiceOver check (open question) |
| D12 | **"pcs." becomes "share" or "shares"**, number first: the trade sheet ("51 shares"), the position page's Quantity, the Custody account list, a trade booking's message ("12 shares") | Roadmap 54, left from 41 (D13 there) |
| D13 | **The transfer reads its amount as typed**: an emptied field is 0, not the last amount, and its Confirm uses D5 | The transfer could move CHF 500 that no longer showed |
| D14 | **Messages say amounts as the app shows them**: "CHF 9'900.00", the account's own name ("Household", "Savings account") | Matches the balances on the same screen |

## Context

- Error CSS: `css/styles.css`, `.form-field__error-row` (around line 3261) and `.form-field--error .form-field__text-wrap` (around line 9789), with the dark-mode override.
- The trade's Amount is `.form-field.form-field--informative > .amount-input` with a `.form-field__optional-row` ("Stock split 1") in `details-of-position.html`; the limit price is a second `.amount-input`.
- Running balances: `UZBankPayState.getState().accountBalances` (household, savings). The trade's debit account is `live.debtorKey`; Pay debits Household; the transfer's is `live.fromKey`, and a mandate or the custody account has no balance to check against.
- Pay's amount input handler (`js/payment-overlay.js`, around line 484) sets `live.amount`; the transfer's `collectRecipientStep` (`js/iat-overlay.js:342`).

## Open questions

- Whether `aria-live="polite"` plus the focus move on Confirm reads the error once or twice in VoiceOver (D11). To hear in the check; if it doubles, the live region is muted while Confirm moves focus.
- Whether Pay's and the transfer's balance check at Execute (D10) reads well, or whether the amount step should check the balance when "As soon as possible" is the default. To try in the build.
