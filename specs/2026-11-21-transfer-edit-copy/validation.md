# Booking sheet: Edit and Copy for a transfer (51): validation

## Build

- [ ] `npm run build` in `apps/web` succeeds

## Which rows (D1)

- [ ] Pending app-made transfer: Edit, Copy, Delete
- [ ] Recurring app-made transfer: Edit, Copy
- [ ] Executed app-made transfer: Copy only
- [ ] Built-in transfer (both accounts): Copy only; a trade and money-in payment unchanged

## Copy (D7, D8)

- [ ] Same accounts and amount, as soon as possible, Single
- [ ] A transfer to a mandate: Copy opens to the mandate

## Edit (D4 to D6, D9)

- [ ] Opens on the booking's accounts, amount, date, status and Repeats
- [ ] Change the amount and date of a pending transfer: both legs updated in place, same ids, no duplicate
- [ ] Change a recurring transfer's Repeats: the sheet and the 44 line read it
- [ ] Make a pending transfer "as soon as possible": it runs now, balances move once
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

Checked on: not yet run.
