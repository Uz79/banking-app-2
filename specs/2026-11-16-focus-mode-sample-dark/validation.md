# Focus-mode sample keeps its panel in Dark (66): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, sign in as admin (the `uzBankAdmin` flag), open `http://localhost:5199/motion-specimens.html#focus-swap`.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (run after the edit; see the last section)

## No. 002 Focus-mode choreography

- [x] Dark, UZ Bank, closed: the stage is `rgb(37, 44, 47)`, the same as No. 003's stage and the Core CSS block, darker than the page (`rgb(57, 67, 63)`); the course text sits on a panel
- [x] Dark, UZ Bank, opened (`is-focus`, the "Extra" column): same panel, text readable
- [x] Dark, Multi-color (Custom 03): stage, No. 003 and Core CSS are all `rgb(28, 30, 35)` on the page's `rgb(77, 78, 42)`
- [x] Light: white panel (`rgb(255, 255, 255)`) on the grey page (`rgb(245, 246, 244)`), as before; No. 003 and the Core CSS block match
- [x] The cube still reads as a light object on a dark scene in Dark (ink and paper swap kept); seen in the screenshots
- [ ] Reduced motion: not run in the browser; the change is a background colour only, no animation or transition is touched (`git diff` shows two lines of `.s2-stage` CSS)
- [ ] Phone width (390px): not run; the rule is width-independent

## No. 001 (D2)

- [x] `.s1-stage` in Dark: its side bands use `--color-bg` (`rgb(37, 44, 47)`, the same panel colour as the other samples) with a tonal centre; no change needed

## Left alone (D3)

- [x] `.ms-sheet`, `.s6-card`, `.s8-msg`: not edited (`git diff` touches only the two `.s2-stage` lines)

## Baseline smoke test

- [x] `npm run build` succeeds
- [ ] The rest of `specs/baseline/validation.md`: not run; only one admin-only specimen page's CSS changed (Design system pages: Motion specimens opens and shows its samples, checked)

Checked on 2026-11-16 against `feature/focus-mode-sample-dark`, Chrome (Claude in Chrome), desktop width, UZ Bank and Custom 03 in Dark, UZ Bank in Light, with computed styles and screenshots of No. 002 and No. 003. Not checked: reduced motion, 390px, the other 10 themes, the first visit, the rest of the baseline smoke test.
