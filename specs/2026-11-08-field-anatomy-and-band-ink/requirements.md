Branch: `feature/field-anatomy-and-band-ink`

# Field anatomy and the month band's ink (63, 64): requirements

Roadmap items 63 and 64 (`specs/roadmap.md`), both from Klaudiusz on 2026-11-06, built together as two small design-system corrections.

- **63:** the month bands on All bookings (24) use the solid `--color-bg-secondary`. They should use a separator-style ink at 5% opacity, as a token with Light and Dark values and the Multi-color themes. 10% stays for strokes.
- **64:** a form field keeps its height with or without the helper or error row. In Buy and Sell, Limit grows when its error shows and pushes the order-duration control down. Klaudiusz's Figma (TextField, Des-Sys-Test, "Design System - Form Fields") gives the anatomy: a label row of 24dp (it may hold a regular 24dp icon), a 4dp gap, the control, a 4dp gap, and a text row of 16dp (it holds the small 16dp icon). The Optional text row and the Error text row are the same row, one replacing the other.

## Scope

**In:**

1. A new colour token `--color-separator-subtle`: the neutral ink at 5%, Light and Dark, in the plain look and in every Multi-color theme (D1, D2)
2. The month bands on All bookings use it (D3)
3. The Figma anatomy on every form field: label row 24dp, gaps 4dp, control, a 16dp text row that is always there (D5 to D7)
4. A scripted audit of every form field, with and without a helper or error row, in Light and Dark, 390px and desktop (D8)
5. A Form field specimen of the anatomy on the Components page (D9)

**Out (not in this branch):**

- Buy and Sell's labels ("Available in", "Credit account") and Buy's Price following the typed limit (65, 55)
- Chip tokens (48), the Motion specimens' Dark sample (66)
- Changing what any error says or when it shows (54's rules stay); only copy that does not fit one line is shortened (D7)
- Anything in the field's error markup or ARIA (D6)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A new token `--color-separator-subtle`** (interview): the same neutral ink as `--color-separator`, at 5% in Light and in Dark. `--color-separator` (10% in the plain look, 14% Light and 10% Dark from the theme engine) stays for strokes | Klaudiusz: 5% for the band, 10% stays for strokes. Named as a sibling of the existing separator, so the family reads as one |
| D2 | **The token goes through the pipeline, never into generated files.** The theme engine derives it (`DERIVED_NAMES` and the returned set in `scripts/theme-engine/lib/themeColors.ts`, then `js/theme-engine.js` is rebuilt as `scripts/theme-engine/README.md` says); `scripts/generate-tokens-css.mjs` emits it for the plain look (the mapped separator at 5% alpha), so `css/tokens.css` comes from `npm run tokens:build`; `js/theme-boot.js` (its default tokens and the list it applies) and `js/contrast-checker.js` (its two token lists) learn it, so a saved theme and the boot script carry it | AGENTS.md: edit the source, never the output. The boot script applies only the cached tokens it knows by name, so a token missing from its list would not reach a Multi-color theme before paint |
| D3 | **The band is built in two layers, and its label is the primary ink** (Klaudiusz, at review of task group 1): `background-color: var(--color-bg)` underneath and `background-image: linear-gradient(var(--color-separator-subtle), var(--color-separator-subtle))` over it, so the label's contrast never depends on what is behind the band, as a translucent fill alone would. The month label is `--color-fg` with no opacity at `--fs-text-sm`; medium weight, capitals by CSS and the letter spacing stay | The first version (the token as a translucent fill, the label in `--color-fg-secondary` at 70%) measured 3.73:1 in Multi-color Light; the label is now at least 8:1 everywhere (D10) |
| D4 | **No Figma import for the token.** It is an engineering token derived from the existing separator, as `--color-segmented-track-bg` and `--color-show-all-bg` are | The mapped Figma JSON has no 5% separator. If Figma later gains one, the generator reads it instead (open question) |
| D5 | **The Figma anatomy, from 24 / 4 / control / 4 / 16 dp** (interview: the whole anatomy): `.form-field__label` is a 24dp row (text vertically centred), the gap between label, control and text row is 4dp (`--space-1`), and the text row is exactly 16dp (`1rem`) | The Figma frame. The label is only a text line today, so a field with a 24dp icon in its label row would grow |
| D6 | **The text row is always 16dp, and an empty one is reserved by CSS only** (interview): the helper (`.form-field__optional-row`) and the error (`.form-field__error-row`) are fixed at 16dp with the 16dp icon; the empty row stays the `::after` spacer. `js/field-error.js` and every field's markup and ARIA (`aria-invalid`, `aria-describedby`, `aria-live`) stay as they are: no hidden placeholder text a screen reader could read | If either has to change, say so and run a VoiceOver check (interview). The cause today: the row is `min-height: 1rem` but its text line (`--lh-text`) is taller, so an error grows the field |
| D7 | **A message fits one line** (interview): at Regular on a 390px phone every message in a 16dp row is one line. The line height inside the row is the row's 16dp (the text trimmed to it, not the type's `--lh-text`). Where a message wraps at Large type or on a narrow field, the audit lists it; copy that wraps at Regular is shortened (no em dashes, plain English) | A fixed row cannot grow, so the text has to fit it. At Large type the row's height follows the rem, so the 16dp and the text scale together |
| D8 | **Every form field is covered** (interview): the shared CSS is fixed once, and a scripted audit measures each field's height with the text row empty, with a helper and with an error: Pay, the transfer, Buy and Sell, the admin sign-in, the profile forms, the picker and form sheets, the opening's and the fridge's fields. The three heights must be equal | A rule that holds for one flow and drifts in another is what 64 is about |
| D9 | **The Components page gets a Form field specimen of the anatomy** (interview): the 24 / 4 / 16 rows labelled, shown empty, with a helper and with an error, at the same height | The design system documents the rule, not only the CSS (mission principle 2) |
| D10 | **Contrast of the band's label is checked in every theme** (interview): `--color-fg` on the band (`--color-bg` under the 5% ink), in Light, Dark and one Multi-color theme in each, with the ratios recorded in `validation.md` | The band is paler than the secondary background it replaces; the numbers say the label still holds |
| D11 | **No VoiceOver gate** (interview), as long as D6 holds. **No new dependency**; the only storage key is D12's version marker | Markup and ARIA do not change |
| D12 | **A colour token cache saved before the token gets it from the boot script** (found in task group 1): `js/theme-boot.js` adds `color-separator-subtle` to each shell of a stored `uzBankWebColorTokens` that lacks it, as the neutral ink (`color-fg`) at 5%, once, marked by `uzBankWebSeparatorSubtle_v1` (listed in `apps/web/README.md`). The baked default tokens carry it | The boot script applies only what the cache holds, and an existing visitor's cache predates the token, so their band would have had no fill until they re-saved a theme. It follows the migrations already there (tonal wash, action circle) |

Checked against `tech-spec.md`: no new dependency, system or page. The "Field errors" Decisions row (reserved row) gains the anatomy, and a new row records the token, both at wrap-up.

## Context

- Month band: `.all-bookings__month` in `css/styles.css` (about line 2335), `background-color: var(--color-bg-secondary)`; built in `js/all-bookings.js` (about line 617).
- Token pipeline: `--color-separator` is `foreground.foreground-separator` (primary 900 at 10%) in `designs/tokens/mapped/light.json` and `dark.json`, emitted by `scripts/generate-tokens-css.mjs` (about line 456); the engine's `separatorWash` is 14% Light and 10% Dark (`themeColors.ts`, about lines 1887 and 1922); `DERIVED_NAMES` is at about line 148. Other places that name a derived token: `js/theme-boot.js` (line 16 default tokens, line 23 the list) and `js/contrast-checker.js` (lines 157 and 207).
- Form field: `.form-field` (about line 3250) has `gap: var(--space-1)`; the `::after` spacer (line 3257) reserves `1rem` only when there is no optional row, no visible error row, no footer; `.form-field__error-row` (line 3270) and `.form-field > .form-field__optional-row` (line 3544) are `min-height: 1rem` with `line-height: var(--lh-text)`; `.form-field--error > .form-field__optional-row` is hidden (line 9807), so the error takes the helper's place. `.form-field__label` (line 3281) is a plain text line.
- Error users: `js/field-error.js` (`show`, `clear`), called from `js/payment-overlay.js`, `js/iat-overlay.js` and `js/trade-flow-overlay.js`; the admin sign-in builds its own row in `js/admin.js` (line 46).
- Buy and Sell: the Limit field (`#uz-trade-limit-field` in `details-of-position.html`) sits above the duration control and has no helper row, so only the `::after` spacer keeps its height.
- Found while reading: `apps/web/scripts/generate-tokens-css 2.mjs` is a tracked file with non-code text appended after the generator (roadmap 70). The build reads `generate-tokens-css.mjs`, not this copy.

## Found in the build

- Task group 1: with the label in `--color-fg-secondary` at 70% the contrast was low before the band did anything: 3.89:1 on `--color-bg` in the saved Multi-color theme in Light (sage), 3.73:1 on the band. Klaudiusz settled it at review: the band in two layers and the label in `--color-fg` (D3), now 8.02:1 in that theme.

## Open questions

- Whether Figma's Small TextField variants (TextField, Small) use the same 24 / 4 / 16 anatomy; to read from Figma in task group 2 before touching the `--small` fields.
- ReadOnly fields (Account and Share information): they have no helper or error row in Figma's ReadOnly cases, so they are expected to keep their layout; the audit confirms it.
- Whether 5% over the plain look's navy (`#00157E` at 5%) and a Multi-color theme's neutral ink reads as a band at all on `--color-bg`; judged in task group 1 against Klaudiusz's 5% and, if it is too faint, raised with him rather than changed here.
- Where the new token is documented for readers (the Components page shows the band's use; a colour token list, if one exists, gets the row).
