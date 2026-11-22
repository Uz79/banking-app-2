# Multi-color themes: controls reach 4.5:1 (74): validation

## Build and audit

- [x] `npm run build` in `apps/web` succeeds
- [x] `npm run audit:contrast` exits 0: 12 themes x Light and Dark, every pair in D3 at 4.5:1 or more
- [x] Before the fix the audit lists the failures named in 74 (it measures what it should)

## In the browser (Profile > Theme)

- [x] Custom 10 in Dark: the primary button, primary chip and selected segment read clearly
- [x] Custom 02 in Light: secondary and filled tonal chips read clearly
- [ ] Custom 06: the primary button and chip
- [ ] The plain UZ Bank look, Light and Dark, looks as before
- [ ] A custom theme made in the panel gets readable inks

## How it reads

- [ ] 390px for the three themes above
- [ ] Legibility Large; reduced motion (the theme switch)
- [ ] First visit (nothing in `localStorage`)

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-22 against feature/theme-contrast, Chrome, desktop width. Checked: build; the audit failed 41 pairs before the fix (the numbers in 74) and passes 192 of 192 after (lowest 4.51); a token diff against the old bundle shows the UZ Bank look unchanged and only the primary ink changed for Custom 10, 01, 06, 05 and 04; Custom 10 Dark (dark ink on the green fill) and Custom 02 Dark in the Profile page. Not checked: Custom 02 Light and Custom 06 in the browser, 390px, Legibility, reduced motion, a custom theme made in the panel, first visit, the baseline smoke test beyond the build. Noted: Custom 02 Dark's page tint is darker (#5c4a35 to #4d3825) because its stored pair was under 4.5:1.
