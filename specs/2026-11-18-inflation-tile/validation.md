# Dashboard tile: what inflation does to idle money (79): validation

Branch: `feature/inflation-tile`.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings

## The tile (D1 to D5, D7)

- [x] Overview shows "Cash loses value" under Offers in the third column at 1440px, with and without the status message above; nothing overlaps the Offers card or the Offers list (Dark, 1440; with the status message the rects stack without overlap)
- [x] The sentence shows the demo's idle cash (Household plus Savings: CHF 35'000 at the start) and its buying power after 10 years at 2%; the figures agree with the line
- [x] The line falls from today's amount; the flat dashed reference sits at today's amount; no axes needed to read it
- [x] The footnote says it is an example at 2% a year, not a forecast
- [x] At two columns (about 1100px) and at 390px the tile follows Offers, full width, with nothing cut off (390 and 1000px in iframes: single column, full width, no horizontal overflow)
- [ ] Light and Dark, and a Multi-color theme: the line, the reference and the text keep their contrast (Light and Dark looked right by eye; no Multi-color theme, no contrast measurement)
- [ ] Legibility Small, Regular and Large: the text scales and nothing overflows; the link label is one line or ellipsizes
- [ ] No other page has the tile (Payments, Account details, Profile)

## The amount (D3)

- [x] A payment out of Household lowers the tile; an internal transfer between Household and Savings leaves it as it was (by faking the state: 5'000 gives CHF 4'100; no real payment or transfer made)
- [ ] Reset demo data brings the starting figures back
- [x] With less than CHF 1'000 idle the tile is hidden; above it, it is back (faked state)
- [ ] First visit (nothing in `localStorage`): the tile shows the starting figures

## The link (D6)

- [x] "See how much to invest" opens the fridge advisor sheet, as the Offers "Investment" item does; closing returns to Overview with focus on the link (focus came back to the link after "Leave for now?")
- [ ] With a fridge or opening draft in the session it resumes as the Offers item does (9a D19)
- [ ] Keyboard: Tab reaches the link after Offers' items; Enter opens the sheet; the focus ring is visible
- [ ] Screen reader: the card is announced with its heading, the sentence reads as text, the chart is skipped

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

Checked on 2026-11-18 against `feature/inflation-tile`, Chrome (Claude in Chrome), dev server on 5199, desktop width in Dark and one Light screenshot, 390 and 1000px in iframes. Not checked: a Multi-color theme and contrast numbers, Legibility Small and Large, keyboard (Tab order and Enter), screen reader, a real payment or transfer (the state was faked), Reset demo data, the first visit with an empty `localStorage`, resuming a draft from the tile, other pages for the tile's absence, and the baseline smoke test beyond `npm run build`.
