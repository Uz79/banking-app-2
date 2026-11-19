# Pay: the recipient step's typed details count (39): validation

## Build

- [ ] `npm run build` in `apps/web` succeeds

## The typed details (D1, D2)

- [ ] Pick a recipient, change the name: the schedule step, the summary, the confirmation and the booking list show the typed name
- [ ] Change Street and City: the summary and the booking sheet show them
- [ ] Go Back to the recipient step: the typed values are still there; forward again keeps them
- [ ] The Edit link on the summary for Recipient opens the step with the typed values
- [ ] The next Pay, with the same recipient picked, starts from the saved details, not the typed ones
- [ ] Picking another recipient replaces the typed values with that recipient's

## An empty name (D3, D7)

- [ ] Clear the name, press Next: "Enter a name." on the field, focus on it, no advance
- [ ] Type a letter: the error clears; Next works
- [ ] A name of spaces only is blocked
- [ ] Street and City emptied: Next works, the booking has no address lines for them
- [ ] The error reads right for a screen reader (announced, tied to the field)

## The stored booking (D4, D5, D6)

- [ ] Edit a payment made with typed details: the flow opens on them, and saving keeps them
- [ ] Copy does the same, as a new payment
- [ ] An older booking (no street or city stored) and a built-in row open as before, with the catalogue address
- [ ] Reset demo data clears the booking and its address

## Across

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, 390px and desktop width
- [ ] Keyboard: Tab through the three fields, Enter or Next with an error, focus returns to the field
- [ ] Reduced motion (nothing new moves)
- [ ] Legibility Large: the error line fits under the field

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on: not yet run.
