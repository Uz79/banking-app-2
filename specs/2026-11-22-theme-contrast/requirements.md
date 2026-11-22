# Multi-color themes: controls reach 4.5:1 (74): requirements

Branch: `feature/theme-contrast`

## Scope

In: the theme engine's ink choices (`scripts/theme-engine/lib/themeColors.ts`, rebuilt into `js/theme-engine.js`) so that every control whose text colour the engine derives reaches 4.5:1 on its own fill, in all 12 built-in themes and both shells; and a scripted audit that measures it. Controls: primary and secondary buttons, the three chips (primary, secondary, filled tonal), the segmented control.

Out: changing the built-in themes' accent colours; the plain UZ Bank look (already 12.1 to 14.9:1); non-text contrast (borders, focus rings); the Playground (item 58). Roadmap item 74 (Later), found in 48.

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | `inkOnPrimaryFill` picks an ink at 4.5:1 (new `MIN_TEXT_CONTRAST`), not the shared 3:1 `MIN_RAMP_CONTRAST`. Order stays: white, the neutral ink, the page background; if none reaches 4.5, the darkest or lightest of black and white that does. Accents are not changed. | Interview answer. 3:1 is the bar for large type and ramp steps, so a light accent passed with white or the neutral ink at 3.3:1. |
| D2 | The inks that read neutral-on-bg (secondary button and chip, tonal button and chip, segmented, resting) are held to 4.5:1 too: `ensureReadableShellContrast` (a theme's neutral foreground against its background) asks 4.5, falling back to the canonical indices as now. The tonal fill is 5% of the ink over the background, so its ratio is checked against the blended fill. | Custom 02 Light's secondary chip (4.03) and tonal chip (3.81) are neutral ink on its own tint. |
| D3 | The audit is `scripts/audit-theme-contrast.mjs` and `npm run audit:contrast`. It loads `js/theme-engine.js`, builds the tokens for each built-in theme in Light and Dark, and measures: `button-primary-foreground` on `button-primary-background`, `button-secondary-foreground` on its background, `button-tonal-foreground` on its background over the page, `segmented-foreground` and `-selected`, `chip-foreground` and `-selected`, and the three chip groups' `-fg` on `-bg`. It prints a table and exits 1 under 4.5. | A gate, not a one-off. |
| D4 | The audit is part of the merge gate in `validation.md`, not of `npm run build`. | Interview answer: a failing theme must not block a Vercel deploy by surprise. |
| D5 | No change to Monochrome. Its inverted ink (`pickInvertedInk`) is checked by the audit; it is changed only if it fails. | Stated as fine in 74. |
| D6 | Saved custom themes are recomputed by the engine when applied; nothing is stored differently, so no new storage key. The cached tokens (`uzBankWebColorTokens`) refresh on the next theme apply. | Tokens are derived, not stored data. |
| D7 | No new page or dependency. `js/theme-engine.js` is rebuilt with the command in `scripts/theme-engine/README.md`, never edited by hand. | AGENTS.md: generated files. |

## Context

- `inkOnPrimaryFill`, `inkOnPrimaryControl`, `primaryControlInkForReport`, `primaryInkForShell`, `ensureReadableShellContrast` and `MIN_RAMP_CONTRAST = 3` are in `lib/themeColors.ts` (about 969 to 1110). `primaryControlInk` (about 1879) feeds `button-primary-foreground`, `segmented-foreground-selected` and `chip-foreground-selected`; the chip groups' `-fg` come from `btnPrimaryFg` and `neutralInk` (about 1965).
- Failures listed in 74: primary chip and button 3.31 (Custom 10 Dark, Custom 01), 3.39 (Custom 06), 3.64 (Custom 02), 3.72 (Custom 05, Custom 04), 4.38 (Custom 10 Light); Custom 02 Light secondary chip 4.03 and filled tonal chip 3.81.
- `MIN_RAMP_CONTRAST` also guards other things (ramp steps, background picks); only the ink and neutral-pair checks move to 4.5, so nothing else shifts.

## Open questions

- Whether raising the neutral foreground/background bar (D2) moves any theme's chosen neutral steps visibly; the audit shows which themes change, and the three fixed themes are looked at in the browser.
- If white on some accent can never reach 4.5 and black looks wrong on it, whether that theme's accent step must move (the roadmap's other option). Decided when the audit shows a case.
