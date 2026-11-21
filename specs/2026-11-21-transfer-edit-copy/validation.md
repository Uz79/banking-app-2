# Booking sheet: Edit and Copy for a transfer (51): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## Which rows (D1)

- [x] Pending app-made transfer: Edit, Copy, Delete
- [x] Recurring app-made transfer: Edit, Copy
- [x] Executed app-made transfer: Copy only
- [x] Built-in transfer (both accounts): Copy only; a trade and money-in payment unchanged

## Copy (D7, D8)

- [x] Same accounts and amount, as soon as possible, Single
- [ ] A transfer to a mandate: Copy opens to the mandate

## Edit (D4 to D6, D9)

- [x] Opens on the booking's accounts, amount, date, status and Repeats
- [x] Change the amount and date of a pending transfer: both legs updated in place, same ids, no duplicate
- [ ] Change a recurring transfer's Repeats: the sheet and the 44 line read it
- [x] Make a pending transfer "as soon as possible": it runs now, balances move once
- [ ] An amount over the debit balance is blocked; the old amount is not counted twice
- [ ] Delete still works on a pending transfer

## How it reads (D10)

- [ ] 390px; Legibility Large
- [ ] Keyboard: the function bar buttons reachable, the flow's focus returns to the row
- [ ] Screen reader: "Edit transfer", "Copy transfer"

## Across

- [ ] Household and Savings, both directions
- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, desktop width
- [ ] Reduced motion

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-21 against feature/pending-transfer-edit-copy, Chrome, desktop width, Dark/default theme, All bookings page (Savings list). Checked: build; the row table for pending, recurring and executed stored transfers and a built-in one; Copy of executed and built-in rows; Edit of a pending transfer (amount 100 to 80, both legs in place, same ids, date kept) and a recurring one (opens on Recurring, weekly); a copy adds two legs; in the state API: a recurring edit with no schedule runs now (balance moves once) and an edit of a pending mandate transfer funds the mandate once. Not checked: Copy of a mandate transfer in the UI, changing Repeats in the UI, the over-balance block on an edit, Delete after this change, Household list, 390px, Legibility, keyboard and focus return, screen reader, Light, Multi-color, reduced motion, first visit, the baseline smoke test beyond the build.
