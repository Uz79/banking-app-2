# Account details: the "Pending payments" summary expands (72): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## The expander (D1 to D5, D7, D9, D10)

- [x] Household: closed on load; Savings (nothing pending) hides the row
- [x] 1 and 3 pending: all shown, no "Show all pending" (checked by mocking the list; 4 shows 3 and the button)
- [x] More than 3 pending: exactly 3 rows, the 3 nearest by date, and "Show all pending" (Household has 5)
- [x] The total has a minus and matches the Pending tab's total of all items
- [x] Rows carry the Pending chip, are grouped by date, and open the booking sheet; Edit and Delete work
- [ ] Making a payment, then deleting one, redraws the panel; an open panel stays open
- [ ] Mouse and touch open and close it; Enter and Space on the focused row; `aria-expanded` and `aria-controls` are right; focus stays on the row
- [ ] The chevron points the right way open and closed

## The link (D6)

- [x] "Show all pending" opens All bookings for the same account on the Pending tab
- [ ] Back returns to Account details; "Show all bookings" still opens Executed
- [x] `?status=recurring` selects Recurring; `?status=nonsense` and no parameter keep Executed

## Across

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, 390px and desktop width
- [ ] Reduced motion: no chevron transition
- [ ] Legibility Large: the row, the total and the button fit
- [ ] The Expander on the design system page is unchanged

## Review follow-up (D13 to D15)

- [x] `npm run build` succeeds
- [x] Household: below the pending row, the 5 newest executed bookings show, grouped by day with balances, then "Show all bookings"
- [ ] Savings: the same, with its own bookings
- [x] Pending row closed: no executed booking is hidden; open: at most 3 pending rows, no "Show all pending" button
- [ ] Make a payment in the app: it appears at the top of the executed list (and the oldest of the five drops off)
- [ ] Light and Dark, 390px

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-19 against `feature/pending-payments-expander`, Chrome, dev server on 5199, desktop width, Dark theme. Run: the build; Household closed on load, open shows Apple (20.11) and Swisscom and Helvetia (23.11) with "Show all pending"; a row opens its sheet with Edit, Delete, Copy; "Show all pending" lands on Household's Pending tab (5 rows, total -1'654.80 matches the 5 built-ins); an unknown `status` keeps Executed; the panel redraws and an open panel stays open when the list changes (mocked 0, 1, 3, 4 items). Not checked: payments made in the app and deleting from the panel by hand, `?status=recurring` (code path only), Light, a Multi-color theme, 390px, keyboard by hand (the toggle is a native button), reduced motion, Legibility Large, the Expander on the design system page, first visit with empty storage, the baseline smoke test beyond the build.

Follow-up (D13 to D15) checked on 2026-11-19 by Klaudiusz: `npm run build` on `fix/account-details-bookings`, then the merged result on `main` in the browser (executed bookings back, at most 3 pending, no "Show all pending"). Not checked: Savings on its own, a payment made in the app, Dark, 390px.
