# Pay and the transfer: choose a frequency (45): validation

## Build

- [ ] `npm run build` in `apps/web` succeeds

## The dates (D4, D5)

- [ ] Weekly, Monthly, Quarterly, Yearly rules in the past run the right number of times on the right dates
- [ ] A 31st anchor and 29 February clamp to the month's last day; a weekend moves to Monday
- [ ] A weekly rule keeps its weekday

## Pay (D2, D3, D7, D8)

- [ ] "Repeats" shows on Recurring and Standing order, not on Single
- [ ] Each frequency: the confirmation says "repeating <frequency>"; the booking sheet and the 44 line read it
- [ ] Edit and Copy open on the booking's own frequency; one instance's edit shows no Repeats

## The transfer (D2, D7, D8)

- [ ] The same for Recurring execution, each frequency, Edit

## How it reads (D9)

- [ ] 390px: four options fit or wrap cleanly, also at Legibility Large
- [ ] Keyboard: arrow keys move the choice, focus ring visible; screen reader names the group "Repeats"

## Across

- [ ] First visit (nothing in `localStorage`)
- [ ] Light and Dark, one Multi-color theme, desktop width
- [ ] Reduced motion

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on: not yet run.
