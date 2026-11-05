Branch: `feature/transfer-status`

# Booking sheet: a transfer shows its real type and status (32, 46): requirements

Roadmap items 32 and 46 (`specs/roadmap.md`), built together (interview). Both are in `buildDataFromStateBooking` (`js/payment-details.js`), which turns a booking made in the app into the booking sheet's data.

- **32:** every stored transfer gets the status "executed", so a transfer made with "Immediately" off, or as a standing order, reads "Executed" in its sheet. Payments read their stored status since 23.
- **46:** on All bookings the sheet of a transfer made in the app reads "Domestic Payment". The function needs the account list from `window.__UZ_IAT_ACCOUNTS__`, which `js/iat-overlay.js` sets, and All bookings doesn't load that script. Without the list the function returns `null` and the click falls back to the payment sheet. Account details shows the same booking as an "Internal Account Transfer".

## Scope

**In:**

1. A transfer made in the app shows its stored status in its sheet: "Pending" for a pending or recurring one, "Executed" for an executed one (D1, D2)
2. All bookings loads `js/iat-overlay.js` on its own, so a transfer made in the app opens as an "Internal Account Transfer" there, with both accounts, as on Account details (D3, D4)
3. Both legs of a transfer (the out-leg on the debit account's list, the in-leg on the credit account's) behave the same (D5)

**Out (not in this branch):**

- A standing order's own sheet with "Active", Frequency and Next execution (47). Until then a recurring transfer reads "Pending", as a recurring payment does (D2)
- Editing a pending transfer: the sheet's Edit buttons are payment-only (`pd-domestic-only`), and nothing changes that (D6)
- A trade's status: trades are executed when placed, so they keep "Executed" (D7)
- One shared account list in `payment-state.js` instead of the transfer script's (D3)
- Pending transfers executing on their date (37), booking rows by keyboard (33), the confirmation dialog's focus (41)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A transfer's sheet reads the booking's own `status`**, as payments do since 23: `buildDataFromStateBooking` returns `booking.status \|\| 'executed'` instead of `'executed'`. A booking stored before 28 has no status and stays "Executed" | `commitInternalTransfer` already stores the schedule on both legs through `applySchedule` (`js/payment-state.js` 466 to 474, 525, 554); only the sheet ignores it |
| D2 | **A recurring transfer reads "Pending"** (interview), as a recurring payment does: the sheet knows Pending and Executed only (`openOverlay`, `data.status !== 'executed'`) | Interview. 47 gives standing orders their own sheet; a new status now would be replaced there and would need the payment to match |
| D3 | **All bookings loads `js/iat-overlay.js` without the transfer's markup** (interview). The script sets `__UZ_IAT_ACCOUNTS__` and `__UZ_IAT_ACCOUNT_FOR__` (lines 49 and 79) before it looks for its sheet (`if (!overlay) return;`, line 93), so on a page without the markup it publishes the account list and stops | Interview. One script tag, no change to the transfer that three pages share. The page still can't start a transfer |
| D4 | **The script goes after `js/payment-details.js`**, as on Account details (3481, 3482). The list is read when a row is clicked, not when the scripts load, so the order only has to match | Same order as the page where the sheet is right |
| D5 | **Both legs get the same fix.** The in-leg ("Transfer from …") on the credit account's All bookings reads the same status and the same two accounts as the out-leg | Both legs carry the status and both accounts' keys |
| D6 | **Edit stays off on a transfer's sheet.** With D1 a pending transfer's sheet gets `pd--pending` and `pd--editable`, but its Edit buttons and actions are all `pd-domestic-only` (`.payment-details__edit-btn`, the function bar), so none shows. Checked in the browser, not assumed | The sheet's Edit opens Pay, which can't edit a transfer |
| D7 | **Trades keep "Executed"** | A trade is booked when it is placed (`commitTrade` stores no status) |
| D8 | **No motion, token, layout or copy change.** The sheet's status chip and both variants exist already | Nothing new to animate or style |
| D9 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, desktop and 390, keyboard, reduced motion); the baseline smoke test | Standard gate |

## Context

- `buildDataFromStateBooking`: `js/payment-details.js` 432 to 484 (the transfer's `status: 'executed'` at 455, the trade's at 478). Called at 854 when a clicked row has a booking id; when it returns `null`, the click builds a "Domestic Payment" from the row (around 860 to 881).
- Built-in transfer rows already read their `data-status` through `rowSchedule` (43), so only transfers made in the app are affected.
- The "yesterday" override (around 885) turns any booking in the Yesterday group executed. Unchanged.
- All bookings today loads `payment-state`, `data-render`, `payment-overlay`, `app-mp`, `payment-details` and `all-bookings` (lines 3348 to 3353), but not `iat-overlay`.
- `iat-overlay.js` reads balances live from the payment state (`liveBalance`, lines 15 to 20), so the sheet's balances match Account details'.

## Open questions

- Whether anything else in `iat-overlay.js` runs before line 93 and does something on a page without the transfer's markup (a listener on `document`, a hash route). To check in the build; a change found there is recorded as a new decision.
