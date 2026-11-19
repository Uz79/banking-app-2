# Pay: the recipient step's typed details count (39): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## The typed details (D1, D2)

- [x] Pick a recipient, change the name: the schedule step, the summary, the confirmation and the booking list show the typed name
- [x] Change Street and City: the summary and the booking sheet show them
- [x] Go Back to the recipient step: the typed values are still there; forward again keeps them
- [x] The Edit link on the summary for Recipient opens the step with the typed values
- [ ] The next Pay, with the same recipient picked, starts from the saved details, not the typed ones
- [ ] Picking another recipient replaces the typed values with that recipient's

## An empty name (D3, D7)

- [x] Clear the name, press Next: "Enter a name." on the field, focus on it, no advance
- [x] Type a letter: the error clears; Next works
- [x] A name of spaces only is blocked
- [ ] Street and City emptied: Next works, the booking has no address lines for them
- [ ] The error reads right for a screen reader (announced, tied to the field)

## The stored booking (D4, D5, D6)

- [ ] Edit a payment made with typed details: the flow opens on them, and saving keeps them
- [x] Copy does the same, as a new payment
- [x] An older booking (no street or city stored) and a built-in row open as before, with the catalogue address
- [ ] Reset demo data clears the booking and its address

## Across

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, 390px and desktop width
- [ ] Keyboard: Tab through the three fields, Enter or Next with an error, focus returns to the field
- [ ] Reduced motion (nothing new moves)
- [ ] Legibility Large: the error line fits under the field

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-19 against `feature/pay-recipient-details`, Chrome, dev server on 5199, desktop width, Dark theme. Run: the build; a recipient with a changed name, street and city carries to amount, schedule and summary, stays when going Back through the summary's Recipient edit, and is stored on the booking (saved list of 8 recipients unchanged); the booking sheet shows the typed address; Copy opens the flow on it; an empty or blank name shows "Enter a name.", does not advance and clears on typing; Edit of a built-in row (Apple) still opens on the catalogue details. Found in the check: `getState()` copied bookings field by field and dropped the new fields (fixed). Not checked: Edit of a stored pending payment with typed details, a booking from before this change, the next Pay starting from saved details by eye, Street/City emptied, screen reader announcement, Reset demo data, first visit, Light, a Multi-color theme, 390px, keyboard by hand, Legibility Large, the baseline smoke test beyond the build.
