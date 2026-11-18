# Overview tile: an investment return calculator in "Cash loses value" (82): validation

Branch: `feature/inflation-tile-calculator`. Run on `http://localhost:5199/overview.html` unless noted.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (the warnings listed are the existing classic-script ones, now also for the new page)
- [ ] No console errors on Overview or in the opening
- [x] A search finds no reference to `opening-risk-chart`, `RISK_CHART`, `riskChart` or `.opening-chart` in `apps/web`

## Follow-up: the calculator in a sheet (D20 to D32)

The three sections after this one were written for the expander and are superseded where this section says otherwise: the same checks now run on the calculator page in the sheet.

- [x] The tile keeps the sentence, the inflation chart, the figures and the note; it is short again (no expander, no sliders, no results); the button reads "Try the calculator" on one line (390 and Legibility Large: an ellipsis if too long, no wrap)
- [x] The tile no longer has "See how much to invest"; the tile still hides under CHF 1'000, the button with it
- [x] The button opens the calculator in the sheet (title "Investment calculator", wide from 1024px, full screen at 390); Offers > Investment still opens the fridge directly
- [x] The sliders start from the account balances (idle cash rounded to 5'000), 10 years, Balanced; the amount is not read from anything the fridge knows
- [x] Wide: sliders card left, chart and results right, the primary button under; 390: chart, results, sliders, notes, button, one column, no horizontal scroll
- [x] Moving a slider redraws the one chart (cash and the three curves) at once; the results, the live region and the fields behave as in the sections below
- [x] "See how much to invest" loads the fridge in the same sheet: step 1, no Back, as from Offers; nothing from the calculator (amount, strategy) appears there; the fridge's Back and Start over behave as today
- [x] Close, Escape (also with the keyboard inside the frame) and the X close the calculator at once, with no prompt; focus returns to the tile's button; no ring after a pointer close
- [x] Reopening starts fresh from the balances, whatever the sliders were; closing and reopening several times works, on the dev server and on `npm run build` then `npx vite preview`
- [ ] The page opened on its own (`investment-calculator.html`) shows its own header and works; a reload inside the sheet's frame is not blank
- [x] The page is registered: it is in the build output, no console errors, the sidebar and tab bar stay out of it like the fridge page
- [ ] Reduced motion: nothing animates; Light and Dark; a Multi-color theme; Legibility Large and Small; keyboard: Tab order inside the sheet, arrows on the sliders
- [x] No new `localStorage` or `sessionStorage` key (reset demo data has nothing to clear)

## The expander (as first built, superseded by the section above)

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

Follow-up (the sheet) checked on 2026-11-18 against `feature/inflation-tile-calculator`, Chrome (Claude in Chrome), Dark, desktop width and 390px in iframes. On the Vite dev server (5199) and on a plain static server of `apps/web` (5198, how Vercel serves it: the repo's `vercel.json` builds only to check and serves the folder; `vite preview` cannot show this because `dist` has no `js` folder): the tile is short again (360px) with "Try the calculator"; the sheet opens on the calculator ("Investment calculator", 960 wide); the three-slider chart and four results work; "See how much to invest" loads the fridge with no Back, as from Offers; close by the X, Escape from inside the frame and reopening three times work with no prompt on the calculator, focus back on the tile's button; a moved slider is fresh again on reopening; Offers > Investment still opens the fridge (its "Leave for now?" prompt is the existing behaviour); at 390 the page is one column, chart and results first, no horizontal scroll, the button label on one line; no console errors. Not checked: the Vercel preview of the branch (after a push), Light, a Multi-color theme, real Legibility Large and Small, keyboard and screen reader by hand, the page opened on its own with its header by eye, 1100px, the tile with idle cash under CHF 1'000, a payment or Reset, and the baseline smoke test beyond the build.


## Review of the sheet (D33 to D35)

- [ ] The sliders' panel has the secondary background and no border; the two number fields are readable on it, in Light, Dark and a Multi-color theme
- [ ] 32 dp left, right and bottom around the content at desktop (the sheet, 960 wide); the primary button is the standard medium one with the arrow
- [ ] The chart is square; moving the strategy from Income to Dynamic makes the good line climb visibly steeper, with the same scale throughout; moving the duration rescales it
- [ ] Sliders and chart columns are equal width; legend order is name, change, amount; each legend row is one line at desktop at Regular and Large; on a phone at Large the change wraps under the name
- [ ] Intro sits 24 dp under the header; the visible gap below the button is 32 dp (36 px at Large)
- [ ] The whole page fits the sheet without scrolling at desktop (Large); on a phone it scrolls
