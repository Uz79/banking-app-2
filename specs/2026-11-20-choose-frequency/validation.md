# Pay and the transfer: choose a frequency (45): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## The dates (D4, D5)

- [x] Weekly, Monthly, Quarterly, Yearly rules in the past run the right number of times on the right dates
- [x] A 31st anchor and 29 February clamp to the month's last day; a weekend moves to Monday
- [x] A weekly rule keeps its weekday

## Pay (D2, D3, D7, D8)

- [x] "Repeats" shows on Recurring and Standing order, not on Single
- [x] Each frequency: the confirmation says "repeating <frequency>"; the booking sheet and the 44 line read it
- [x] Edit and Copy open on the booking's own frequency; one instance's edit shows no Repeats

## The transfer (D2, D7, D8)

- [x] The same for Recurring execution, each frequency, Edit

## How it reads (D9)

- [ ] 390px: four options fit or wrap cleanly, also at Legibility Large
- [ ] Keyboard: arrow keys move the choice, focus ring visible; screen reader names the group "Repeats"

## Across

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, desktop width
- [ ] Reduced motion

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-20 against `feature/choose-frequency`, Chrome on the dev server (port 5199), desktop width, Dark, by script and one screenshot. Dates: weekly (02.11 ran 02, 09, 16; next 23.11), quarterly (31.07 then Saturday 31.10 as 02.11; next 01.02.2027), yearly (28.02.2025, then 02.03.2026; next Monday 01.03.2027), monthly (31.08, 30.09, 02.11; next 30.11). Pay: Repeats hidden on Single, shown on Recurring, quarterly and yearly chosen, a standing order made as yearly stored `yearly` with "repeating yearly" in the confirmation; Edit of that rule opened on Recurring and Yearly. Transfer: Repeats hidden then shown; a weekly recurring transfer stored weekly on both legs, with "repeating weekly" in the confirmation and its first run on the start date. `npm run build` passes. Not checked: Copy, an instance edit hiding Repeats, a 29 February anchor, 390px (the browser window did not resize, so phone width is unchecked) and Legibility Large, keyboard arrow keys by hand, a screen reader, Light and a Multi-color theme, reduced motion, first visit, the booking row chips and the 44 line for the new frequencies, and the baseline smoke test beyond the build.
