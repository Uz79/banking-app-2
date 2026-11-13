# The schedule step's date overrides the toggle (40): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Payments, Account details

## Pay: schedule step (Single)

- [ ] First visit (nothing in `localStorage`): the toggle is on, the field shows the next working day and is not greyed
- [ ] Tapping the field opens the calendar while the toggle is on; today and weekends are dimmed
- [ ] Picking the next working day keeps the toggle on; the summary shows that day and the confirmation reads "will be executed on …"
- [ ] Picking a later day turns the toggle off; the booking is pending on that day
- [ ] Turning the toggle back on resets the date to the next working day
- [ ] Turning the toggle off on its own date moves the date to the working day after (D4); on a Friday that is Monday
- [ ] On a weekend (set the device date) the next working day is Monday

## Pay: Recurring and Standing order

- [ ] Same controls and rules; the booking is recurring and starts on the shown date
- [ ] An edited pending payment opens with the toggle off and its date; an edited executed one with the toggle on

## Internal transfer

- [ ] "Immediately" is on: the field is visible, shows today and opens the calendar
- [ ] Today and weekends are pickable; picking today keeps the toggle on; a Saturday turns it off and the transfer is pending on that date
- [ ] Turning the toggle on again resets the date to today
- [ ] Recurring execution uses the same pair; an immediate transfer still confirms with "is done."
- [ ] Money moves only for an immediate transfer (balances 9'380 / 25'500 after 500 to Savings)

## Screen readers and keyboard

- [ ] The live line follows the toggle and a date pick ("… on, executes on …"); it is silent on first paint
- [ ] Tab reaches the toggle and the field; Enter opens the calendar; focus returns to the field after a pick or Escape
- [ ] The field's label reads "Execute on, <date>, change date" in every state
- [ ] A screen reader (VoiceOver) hears the toggle's change

## Looks

- [ ] Light and Dark, desktop and 390px: the field never looks disabled; no em dashes in new copy
- [ ] Reduced motion: nothing new moves

## Baseline smoke test

(Copy `specs/baseline/validation.md` here and tick it. Leave that file unticked.)

Checked on: not yet run.
