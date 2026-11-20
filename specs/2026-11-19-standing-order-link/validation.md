# Booking sheet: an executed instance names its standing order (44): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## The line (D1, D2, D6)

- [x] A standing order made in the app, run once (a past date): its executed instance shows "Standing order: Monthly" under Status
- [ ] The same for a standing transfer's instance
- [x] A one-off payment, a built-in row and a pending payment show no such line
- [ ] The line is on every page that opens the sheet (Account details, All bookings, Overview, Payments)

## The link (D3, D4)

- [x] The line opens the order's sheet (Active, frequency, next payment); Back returns to the instance
- [x] (orphaned instance, order not in state) Delete the order: the instance's line is plain text, same words, not in the tab order, no pointer
- [ ] After Reset demo data nothing is left to open and nothing breaks

## How it reads (D5)

- [ ] 390px: the line fits on one row, or wraps cleanly, at Legibility Large too
- [ ] Keyboard: Tab reaches the button, Enter and Space open the order, focus ring visible
- [ ] Screen reader: the name is "Standing order: Monthly, open the standing order"; plain-text case is read as text

## Across

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, desktop width
- [ ] Reduced motion (nothing new moves)

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-20 against `feature/standing-order-link`, Chrome on the dev server (port 5199), desktop width, Dark, by script on All bookings (Household) with seeded bookings: the instance shows "Standing order: Monthly" with the aria name "Standing order: Monthly, open the standing order"; the button opens the order's sheet (Active, Monthly) and browser Back returns to the instance; an instance whose order is gone reads "Standing order: Weekly" as plain text; a one-off, a built-in row and the rule itself show no line; the focus outline is 2px solid. `npm run build` passes. Not checked: a standing transfer's instance, the line on Account details, Overview and Payments (same markup copy, not opened), Light, a Multi-color theme, 390px and Legibility Large, a keyboard pass by hand, a screen reader, reduced motion, Reset demo data, first visit, and the baseline smoke test beyond the build.
