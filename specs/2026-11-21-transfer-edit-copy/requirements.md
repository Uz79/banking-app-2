# Booking sheet: Edit and Copy for a transfer (51): requirements

Branch: `feature/pending-transfer-edit-copy`

## Scope

In: Edit and Copy in the booking sheet for transfers between own accounts, and what they need: a prefill path for the transfer flow (`js/iat-overlay.js`), an in-place update of a stored transfer (`js/payment-state.js`), and the sheet's rules (`js/payment-details.js`).

| Row | Edit | Copy | Delete (as now) |
|-----|------|------|-----------------|
| Pending transfer made in the app | yes | yes | yes |
| Recurring transfer (the standing order) made in the app | yes | yes | no |
| Executed transfer made in the app | no | yes | no |
| Built-in transfer (50 gave them both accounts) | no | yes | no |

Out: a recurring transfer's single next payment (no Edit of one instance, as Pay has in 47); skipping an occurrence; trades; money in as a payment. Roadmap item 51 (Later), after 42, 47, 50 and 45 (whose Repeats choice Edit can now reopen).

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | Which rows get which actions is the table above, in `bookingActions` in `js/payment-details.js` (the `type === 'internal'` branch). | Mirrors Pay (42, D6 to D8; 47, D6); built-in rows are examples, so no Edit. |
| D2 | The transfer flow takes a prefill `{ fromKey, toKey, amount, status, executeOn, frequency, bookingId }`. `window.__UZ_IAT_OPEN(prefill)` already takes `{ toKey, fromKey, amount }` (18); it gains the rest. An unknown account is ignored as now. | One path, no second entry point. |
| D3 | The sheet writes an edit context for the transfer as it does for Pay (`window.__UZ_PD_EDIT_CONTEXT__`), then opens the transfer after the sheet has closed, at the step the Edit button names. | Same hand-over as Pay, so focus and history behave the same. |
| D4 | Edit: Execute calls a new `updateTransfer(id, updates)` in `js/payment-state.js` that changes both legs in place (same ids, same place in the lists), as `updatePayment` does for a payment. It keeps what the edit cannot change. | Answers "does Edit update both legs"; no duplicate, no changed ids. |
| D5 | An Edit that turns a pending or recurring transfer into "as soon as possible" runs it now (status and date dropped, dated now, money moves once); a recurring one stays recurring with its Repeats choice (45). Editing a recurring transfer replaces all its future payments, and its edited next payments are dropped as Pay does (68). | Same behaviour as `updatePayment`. |
| D6 | The schedule step of an edit opens on the booking's own status, date and Repeats, as Pay's does (23, D3, D4; 45, D8). | One rule across both flows. |
| D7 | Copy opens a new transfer with the same two accounts and amount, as soon as possible, on Single; nothing else is copied. | Same as Copy in Pay (42, D14). |
| D8 | An executed transfer to or from a mandate has one leg; Copy of it opens to that mandate with Household as debit (18, D9), as the funding link does. | Reuses the existing mandate prefill. |
| D9 | Balance checks stay as they are: the amount cannot exceed the debit account at Execute. An Edit does not count the booking's own old amount twice. | A pending transfer holds no money, so only the new amount is checked. |
| D10 | Edit and Copy have the same aria labels pattern as Pay ("Edit transfer", "Copy transfer"); the sheet's function bar needs no new markup. Copy: no em dashes. | Conventions; `applyActions` names the noun for payments only today. |
| D11 | No new storage key, page or dependency. | `tech-spec.md`: nothing new. |

## Context

- `js/payment-details.js`: `bookingActions` (about 727, the internal branch returns `edit: false`, `copy: false`); `applyActions` (about 746, noun text); the edit context export in `finishClose` (about 911 to 960); `buildDataFromStateBooking` returns the transfer's data with `status`, `executeOn`, `frequency`.
- `js/iat-overlay.js`: `openOverlay(prefill)` (about 511) resets amount, accounts and schedule; `scheduleStatus()` and `commitTransfer()` (about 240); `STEPS = ['recipient', 'schedule', 'summary']`; the amount is on the recipient step.
- `js/payment-state.js`: `commitInternalTransfer` (524) makes an out leg `iat_out_<suffix>` and an in leg `iat_in_<suffix>` (one leg for a mandate); `transferSuffix`, `deleteBooking` handle both legs; `updatePayment` (about 604) is the model for `updateTransfer`.
- The confirmation for a transfer already says "starts on ..., repeating ..." (45).
- No conflict with `tech-spec.md`'s "Not using" list.

## Open questions

- The transfer's Edit buttons on the summary step: whether the existing `data-iat-nav` links are enough or the amount (on the recipient step) needs its own target.
- Whether a stored transfer's `fromKey`/`toKey` of a built-in row is always reachable for Copy (check after 50's data).
