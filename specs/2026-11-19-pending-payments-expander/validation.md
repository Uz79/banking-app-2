# Account details: the "Pending payments" summary expands (72): validation

## Build

- [ ] `npm run build` in `apps/web` succeeds

## The expander (D1 to D5, D7, D9, D10)

- [ ] Household and Savings: the row is closed on load, every visit; nothing pending hides it
- [ ] 1 and 3 pending: all shown, no "Show all pending"
- [ ] More than 3 pending: exactly 3 rows, the 3 nearest by date, and "Show all pending"
- [ ] The total has a minus and matches the Pending tab's total of all items
- [ ] Rows carry the Pending chip, are grouped by date, and open the booking sheet; Edit and Delete work
- [ ] Making a payment, then deleting one, redraws the panel; an open panel stays open
- [ ] Mouse and touch open and close it; Enter and Space on the focused row; `aria-expanded` and `aria-controls` are right; focus stays on the row
- [ ] The chevron points the right way open and closed

## The link (D6)

- [ ] "Show all pending" opens All bookings for the same account on the Pending tab
- [ ] Back returns to Account details; "Show all bookings" still opens Executed
- [ ] `?status=recurring` selects Recurring; `?status=nonsense` and no parameter keep Executed

## Across

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, 390px and desktop width
- [ ] Reduced motion: no chevron transition
- [ ] Legibility Large: the row, the total and the button fit
- [ ] The Expander on the design system page is unchanged

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on: not yet run.
