# Legibility reaches the Playground (58): requirements

Branch: `feature/playground-legibility`

## Scope

In: `playground.html` loads `js/appearance.js` so Profile > Legibility (Small, Regular, Large; Typeface; Font) applies there as on the fridge and the opening; a check of the Playground's screens at Small and Large, desktop and 390px, and a narrow fix for anything that breaks. Roadmap item 58 (Later), found in 34.

Out: converting the Playground's fixed sizes to the `--fs-*` and `--space-*` tokens wholesale; the game's canvas and 3D scene; Playground gameplay (item 6) and the easter egg (item 3).

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | `playground.html` loads `js/appearance.js` as a classic script after `js/payment-exit-confirm.js` and before the `js/playground.js` module, the same place the fridge loads it. | Interview answer; `tech-spec.md` says the fridge and the opening load it on their own, and the Playground does not yet (58). |
| D2 | No wholesale move of fixed sizes to tokens. Only what breaks at Small or Large (clipped text, overflow, overlapping controls) is fixed, with a narrow selector scoped to the Playground. | Interview answer; AGENTS.md: small, contained diffs, narrow selectors. |
| D3 | The game's HUD, touch buttons and settings dialog are included in the check, not excluded. | Interview answer. |
| D4 | Nothing is stored or added: the key `uzBankWebAppearance` already exists; no new page or dependency. `tech-spec.md`'s Legibility line (and its "doesn't load it yet" note) is updated. | Conventions. |
| D5 | Reduced motion and focus rings are unchanged; a fix that adds an animation needs a reduced-motion path. | AGENTS.md. |

## Context

- `playground.html` loads `css/tokens.css`, `css/typography.css`, `css/styles.css`, `js/theme-boot.js`, `js/admin-boot.js` (guard), then at the end `analytics.js`, `payment-state.js`, `dialog-focus.js`, `payment-exit-confirm.js`, `profile-persona.js` and the `playground.js` module. It has no `js/appearance.js` and no `js/app-mp.js`.
- `js/appearance.js` scales `--fs-*` and `--space-*` on `<html>` from `uzBankWebAppearance` on load, and sets `data-legibility`, `data-persona` and `data-font-family`.
- The Playground is admin only (`js/admin-boot.js` with `data-guard`): a browser check signs in as admin first.

## Open questions

- Which Playground text uses the tokens and which is fixed; the check at Small and Large shows it. If most of the visible text is fixed, say so and propose a follow-up item rather than widening this spec.
