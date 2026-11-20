# Booking sheet: an executed instance names its standing order (44): requirements

Branch: `feature/standing-order-link`

Roadmap item 44, added 2026-11-05 out of 43's scope. An executed booking that ran from a standing order shows no hint of it in its sheet. It gets a line "Standing order: Monthly" that opens the order.

## Scope

**In:**

1. The booking sheet of an executed instance (a stored booking with `ranOf`, made by the app when a standing order ran, `runDueRules` in `js/payment-state.js` about line 860) shows a "Standing order: <frequency>" line.
2. The line opens the order's own sheet (the rule's: Active, frequency, next payment, Edit, Delete).
3. When the order no longer exists, the line stays as plain text without a link.

**Out (one-line pointers, not this branch):**

- Built-in executed rows for Rent, Netflix and Internet & Phone: those orders have no executed rows today (they are only in `STANDING_ORDERS` in `js/built-in-bookings.js`) and none are added.
- The Recurring tab (no scroll-to, no new `?status=` use).
- Frequency choice in Pay and the transfer (45).
- A pending instance (it is still the order's "next payment", already marked as such by 47).

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Only instances made by the app get the line:** a stored booking with `ranOf` (its rule's id) and no `status`. Built-in rows and one-off bookings do not. | Klaudiusz's answer. It uses the existing link and adds no mock history. |
| D2 | **The line reads "Standing order: <frequency>"**, the frequency spelled by `frequencyLabel` as the rule's own sheet spells it (for example "Monthly"), and sits in the sheet's info block under Status. | The roadmap's wording. One spelling for frequency across sheets. |
| D3 | **The line is a button that opens the order's sheet** in place of the instance's, by the same route the Recurring tab uses to open a rule. Back returns to the instance. | Klaudiusz's answer. The sheet already knows how to show a rule. |
| D4 | **When the rule is gone** (deleted, or never there after a reset), the line stays as plain text, not a button: same words, no link, not in the tab order. | Klaudiusz's answer. The booking is still what the standing order made. |
| D5 | **Phone and screen reader:** the line is one row as wide as the sheet's other info rows; the button's accessible name is "Standing order: Monthly, open the standing order"; a visible focus ring in `--color-fg-interactive`; no motion, so nothing for reduced motion. Colours through `--color-*` tokens only. | Roadmap's open point on how it reads. |
| D6 | **The rule is found by `ranOf`** against the stored bookings with `status: 'recurring'` and no `ruleId` (what `isStoredRule` tests in `js/payment-state.js`). A transfer's instance (suffix id from `transferSuffix`) follows the same field. | One lookup for payments and transfers. |
| D7 | **Copy:** "Standing order: Monthly" for the line; no em dashes. | Short and plain. |
| D8 | **No new storage key, no new page, no dependency.** `ranOf` is already stored. | Nothing to list in `apps/web/README.md`. |

## Context

- `ranOf` is written when a rule runs (`js/payment-state.js` about lines 848 and 875) and kept by `getState()`'s per-booking copy (about line 417).
- The sheet fills its status block in `js/payment-details.js` about lines 814 to 822 (`frequencyValEl`, `uz-pd-frequency-value`, used for a rule only today); `buildDataFromStateBooking` (about line 494) builds a stored booking's data and already copies `frequency`.
- The sheet's route is a hash (`#payment-details/<type>/<id>`, `pushState` about line 621), and Back and forward go through `applyPaymentDetailsRoute` (about line 962).
- Each page that has the sheet carries its own copy of the markup (`partials/payment-details-overlay.html` and the inline copies in `account-details.html` and `all-bookings-and-payments.html`): the new line must be added to all of them.

## Open questions

- Whether the order's sheet can be reached by its booking id through the existing hash route for a stored rule: checked in the build; if it cannot, the route gets the small addition it needs.
