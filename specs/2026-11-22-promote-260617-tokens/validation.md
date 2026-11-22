# Promote the 260617 token export (73): validation

- [x] `npm run build` in `apps/web` succeeds
- [x] `npm run tokens:validate -- 260617_tokens/tokens` passes; the promote runs from the export's own layout
- [x] `token-diff.md` exists and lists every changed variable in `css/tokens.css`
- [x] Existing variables changed: only secondary text and the separator (and nothing under `--space-*`)
- [x] The new component variables exist in `tokens.css`; no stylesheet reads them
- [x] The chip group comes from the promote; chips look the same as before
- [x] `npm run audit:contrast`: all 12 themes in both shells pass; secondary text at 70% keeps 4.5:1 (else the token is skipped, noted)
- [ ] Before and after, Light: Overview, All bookings, Pay (schedule step), Profile; only secondary text and dividers differ
- [ ] Before and after, Dark, and one Multi-color theme: the same
- [x] 390px (iframe): no overflow, nothing clipped
- [ ] Keyboard focus rings and reduced motion unaffected (no CSS wiring changed)

### Baseline smoke test
Copy from `specs/baseline/validation.md` and run.

Checked on 2026-11-22 against `feature/promote-260617-tokens`, Chrome, on the user's dev server (http://localhost:5175, serving the working tree), desktop 1440px and a 390px-wide same-origin iframe. Done: `npm run build` passes; `tokens:validate -- 260617_tokens` finds the export in its own layout; `tokens:promote -- 260617_tokens` runs end to end; `token-diff.md` written (4 variables change value, 47 change letter case only, 172 added per mode); `grep` shows no stylesheet, script or page reads a new variable; `npm run audit:contrast`: 12 themes x 2 shells, 192 pairs, all pass, lowest 4.51. Secondary text at 70% ink in the Bank default, measured on every element that uses `--color-fg-secondary`: Overview, Payments, Account details and Profile Light 5.92 and Dark 4.89 at the lowest, All bookings Light 6.26 and Dark 7.68; the lowest pair is Dark text on `--color-bg-secondary` (4.88 by calculation), so the token is kept. Bank default (inline theme tokens cleared) Overview looks right in Light and Dark. No horizontal overflow at 390px on Overview, All bookings, Payments, Profile and Account details in Light and Dark. Pay (to the confirmation) and the internal transfer (to "Your payment is done.") complete. Not checked: before and after screenshots (the app's default green theme and every Multi-color theme set secondary text and the separator inline, so the token change shows only in the Bank default; I compared values, not images); a Multi-color theme in the browser (the engine sets both tokens for every theme, `themeColors.ts`); the "UZ Bank" card restoring the default (the engine is not loaded on the pages I used); the browser console; keyboard and reduced motion; Storybook; the rest of the baseline smoke test (Custody and Buy, All bookings tabs and search, Profile sliders, Legibility, Design system, the status message); signed-out and first visit.
