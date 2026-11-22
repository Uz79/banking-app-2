# Multi-color themes: controls reach 4.5:1 (74): validation

## Build and audit

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `npm run audit:contrast` exits 0: 12 themes x Light and Dark, every pair in D3 at 4.5:1 or more
- [ ] Before the fix the audit lists the failures named in 74 (it measures what it should)

## In the browser (Profile > Theme)

- [ ] Custom 10 in Dark: the primary button, primary chip and selected segment read clearly
- [ ] Custom 02 in Light: secondary and filled tonal chips read clearly
- [ ] Custom 06: the primary button and chip
- [ ] The plain UZ Bank look, Light and Dark, looks as before
- [ ] A custom theme made in the panel gets readable inks

## How it reads

- [ ] 390px for the three themes above
- [ ] Legibility Large; reduced motion (the theme switch)
- [ ] First visit (nothing in `localStorage`)

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on: not yet run.
