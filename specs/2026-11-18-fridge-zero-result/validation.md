# Fridge advisor result: CHF 0 with no reason (83): validation

Branch: `feature/fridge-zero-result`. Run on `http://localhost:5199/overview.html`, Overview > Offers > Investment, to the last step.

## Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on the fridge

## The result at CHF 0

- [ ] Assets below one month of spending plus the two reserves: the ring says CHF 0 and is empty, the sentence "Your spending for a month and your reserves use up your assets. Try lowering a reserve." shows under it
- [ ] Assets exactly equal to a month plus the reserves (result 0): the sentence shows
- [ ] Assets 0: the sentence shows, nothing breaks
- [ ] The yearly line reads "You could set aside each year: CHF X" with X the left amount times 12, and it stays at 0
- [ ] Left at month end 0 and a result of 0: the yearly line reads CHF 0, the layout holds
- [ ] Lowering a reserve on the way back (Back to the reserves, then forward again) makes the result positive and the sentence goes away
- [ ] "Show suitable products" still opens the opening with no suggestion at 0

## The result above 0

- [ ] No explanation; the ring, the amount and the note are as before; only the yearly label differs
- [ ] "Show suitable products" opens the opening with the suggestion

## Look

- [ ] Light and Dark; a Multi-color theme
- [ ] Desktop (the 960 sheet) and 390px: the sentence, the yearly line and the button are all in view, nothing clipped, no scroll
- [ ] Legibility Large and Small
- [ ] Reduced motion: the ring is still, as before

## Keyboard and screen reader

- [ ] Reaching the result by keyboard: the heading takes focus; the announcement says "You could invest CHF 0." and then the sentence at 0
- [ ] The sentence is real text, not hidden from assistive tech

## Baseline smoke test

Copy from `specs/baseline/validation.md` and run.

- [ ] `npm run build` succeeds with no new warnings; no console errors on any page visited
- [ ] Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview, Account details, All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; "Remind me later" hides it and it returns after about 8 s; "Go to payment" opens the bill's details and the message stays away
- [ ] Pay: recipient search to confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account, a position, Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work
- [ ] User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance
- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure
- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet run.
