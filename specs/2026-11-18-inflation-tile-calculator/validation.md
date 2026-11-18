# Overview tile: an investment return calculator in "Cash loses value" (82): validation

Branch: `feature/inflation-tile-calculator`. Run on `http://localhost:5199/overview.html` unless noted.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview or in the opening
- [x] A search finds no reference to `opening-risk-chart`, `RISK_CHART`, `riskChart` or `.opening-chart` in `apps/web`

## The expander

- [x] Closed on every load; the tile is exactly as in 79 (idle cash, 10 years, the loss band, the link)
- [x] Opens and closes with a click, Enter and Space; `aria-expanded` follows; the chevron turns
- [x] Opening starts from idle cash rounded to 5'000, 10 years, Balanced; closing and opening again resets them
- [ ] Idle cash under CHF 1'000: the whole tile is hidden; idle cash between 1'000 and 2'499: the amount starts at 5'000

## The sliders

- [x] Duration 1 to 30, amount 5'000 to 500'000 in steps of 5'000, strategy five stops; the field follows the slider and the slider follows the field
- [x] A typed value outside the range is clamped; an amount like 12'345 becomes 10'000 on Enter and on blur; nothing is forced while typing
- [x] The strategy field shows the name and cannot be typed in; the slider's value is read out as the name
- [ ] End labels (1 and 30, 5'000 and 500'000, safe and risky) never wrap

## The chart

- [x] Open: the cash line, today's flat dashed line, the band and good, expected and unfavourable curves are in one chart on the same axes
- [x] The cash line uses the slider's amount and duration; the sentence, Today and "In N years" follow; closed again they are idle cash and 10 years
- [x] Balanced, CHF 10'000, 10 years: about 24'500, 14'900 and 9'100 (rounded to 100), +145%, +49%, -9% as text
- [ ] Each strategy: a safer strategy gives a narrower band; the unfavourable line at 1 year does not leave the chart
- [ ] The y range does not jump while a slider is dragged (it moves in steps); the amount slider changes the figures, not the picture
- [ ] With colour taken away (grayscale) the five lines and the legend still tell apart
- [x] The notes read in plain English: example, not a forecast, before inflation; no em dashes
- [ ] "See how much to invest" is unchanged and opens the fridge sheet

## Look and phone

- [ ] Light and Dark, desktop (1440 and the two-column width)
- [x] 390px (iframe): sliders, fields, chart, legend and list fit; no horizontal scroll; no wrapped labels
- [ ] Legibility Large and Small: nothing clipped; results as rows at Large on a phone
- [ ] A Multi-color theme: the lines and band stay readable

## Keyboard, screen reader, motion

- [ ] Tab order: expander, the three sliders and fields, the link; focus is always visible
- [ ] Arrow, Home, End and Page keys move each slider; the result is announced once on release, not on every step
- [ ] Reduced motion: no animation anywhere in the tile, the chart redraws at once

## State

- [ ] A payment or Reset demo data while the expander is open updates the cash start values sensibly (the sliders keep the customer's values; the closed tile re-reads idle cash)
- [x] The opening still works: the assistant's "{amount}" is CHF 10'000 before an amount is entered, the risk step looks right at 1440 and 390

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

Checked on 2026-11-18 against `feature/inflation-tile-calculator`, Chrome (Claude in Chrome), dev server on 5199, Dark at desktop width and at 390px in an iframe; `npm run build` passed. Checked by script: the expander, the start values (idle cash CHF 35'000, 10 years, Balanced), the three sliders and both fields (12'345 became 10'000 at CHF 5'000 steps, 99 years became 30), the strategy name as the slider's value text, the results (Balanced, 10 years: +145%, +49%, -9% and cash -18%), the live region text, no horizontal overflow at 390px or with `data-legibility="large"` set by hand, the opening's risk step showing CHF 10'000. Not checked: Light, a Multi-color theme, the real Legibility settings (Large and Small), the amount at 1'000 to 2'499 and under 1'000, keyboard and screen reader by hand, reduced motion (nothing animates, by design), grayscale reading of the lines, whether the y range feels steady while dragging, a payment or Reset while open, the opening's risk step by eye at 390, the 1100px width, and the baseline smoke test beyond the build. Noted: with the sliders open the tile is about 935px tall, so on a short window the chart scrolls out of view while a slider is used.
