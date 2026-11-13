# The schedule step's date overrides the toggle (40): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Payments, Account details

## Pay: schedule step (Single)

- [x] First visit (nothing in `localStorage`): the toggle is on, the field shows the next working day and is not greyed
- [x] Tapping the field opens the calendar while the toggle is on; today and weekends are dimmed
- [x] Picking the next working day keeps the toggle on; the summary shows that day and the confirmation reads "will be executed on …"
- [x] Picking a later day turns the toggle off; the booking is pending on that day
- [x] Turning the toggle back on resets the date to the next working day
- [x] Turning the toggle off on its own date moves the date to the working day after (D4); on a Friday that is Monday
- [ ] On a weekend (set the device date) the next working day is Monday

## Pay: Recurring and Standing order

- [x] Same controls and rules; the booking is recurring and starts on the shown date
- [ ] An edited pending payment opens with the toggle off and its date; an edited executed one with the toggle on

## Internal transfer

- [x] "Immediately" is on: the field is visible, shows today and opens the calendar
- [x] Today and weekends are pickable; picking today keeps the toggle on; a Saturday turns it off and the transfer is pending on that date
- [x] Turning the toggle on again resets the date to today
- [x] Recurring execution uses the same pair; an immediate transfer still confirms with "is done."
- [ ] Money moves only for an immediate transfer (balances 9'380 / 25'500 after 500 to Savings)

## Screen readers and keyboard

- [x] The live line follows the toggle and a date pick ("… on, executes on …"); it is silent on first paint
- [x] Tab reaches the toggle and the field; Enter opens the calendar; focus returns to the field after a pick or Escape
- [x] The field's label reads "Execute on, <date>, change date" in every state
- [ ] A screen reader (VoiceOver) hears the toggle's change

## Looks

- [ ] Light and Dark, desktop and 390px: the field never looks disabled; no em dashes in new copy
- [ ] Reduced motion: nothing new moves

## Baseline smoke test

(Copy `specs/baseline/validation.md` here and tick it. Leave that file unticked.)

Checked on 2026-11-13 against `feature/pay-date-overrides-asap`, Chrome on the agent's server (5199), Dark theme, desktop (about 1660px) and a 390px window, the device date a Friday (13.11.2026, so Pay's next working day was Monday 16.11). Checked: Pay Single, Recurring and Standing order on the toggle on (the field shows 16.11 and opens the calendar; today and weekends dimmed); a pick of 16.11 kept the toggle on; a pick of 18.11 turned it off; toggling on reset to 16.11 and off moved it to 17.11; the summary showed 16.11, the confirmation read "will be executed on 16.11.2026" and Household went to 9'500; the transfer showed today with the field visible, today and Saturday pickable, a Saturday turned it off, on reset to today, off on today moved to 16.11, an immediate transfer confirmed with "is done."; the live lines read as specified in both flows; at 390px the calendar opened as a bottom sheet, ArrowDown plus Enter picked 23.11 and focus returned to the field. Not checked: Light (setting the theme attribute did not repaint, so the field was not seen in Light); reduced motion (the macOS setting was not switched; nothing new animates); a weekend device date; an edited pending or executed payment opening the schedule step; a Multi-color theme; the first visit with empty `localStorage`; VoiceOver; the baseline smoke test (only the Pay and transfer flows ran); the pending transfer's "will be made on" copy.
