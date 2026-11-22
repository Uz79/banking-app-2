# Promote the 260617 token export (73): requirements

Branch: `feature/promote-260617-tokens`

## Scope

In: take Figma's 260617 token export (`designs/tokens/_NEW/260617_tokens/tokens`) into `designs/tokens/` through the promote pipeline, without moving any layout:
- teach `scripts/promote-tokens.mjs` (and `token-lib.mjs`) the export's format;
- promote, and emit the roughly 359 new component tokens in `css/tokens.css`, wired to nothing;
- take the two changed colour tokens (secondary text, separator);
- the chip group from 48 then comes from the promote, and its verbatim copy is dropped.

Out: wiring any component's CSS to its new tokens (each is a later item, so every visual change is reviewable on its own); Figma's re-indexed spacing scale and the main section padding that depends on it (D1, D5); changing the theme engine.

Roadmap item 73 (Later). Its wording ("run `npm run tokens:promote -- 260617_tokens`") does not work, see Context.

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | `alias.space.*` keeps its live mapping. The export re-points `space.1` to `space.19` one size step lower (a new `size.0-25` is inserted), which would move every `var(--space-N)` (608 in `css/styles.css`). | Decided in the interview: no layout moves. Recorded as a deliberate divergence from Figma. |
| D2 | The promote script accepts Figma's folder layout (`alias/alias.json`, `brand/brand.json`, `mapped/Light.json`, `mapped/Dark.json`, `responsive/Desktop.json`, `responsive/Mobile.json`) as well as the flat one, and writes the flat layout into `designs/tokens/`. | The roadmap's command fails today: "missing brand.json, alias.json". Renaming files by hand each time would be error prone. |
| D3 | Colours written to `designs/tokens/` stay `rgba()`: the promote converts the export's 8-digit hex (`#00157e33`) while it merges. `generate-tokens-css.mjs` (`withAlpha` accepts rgba only) is not changed. | Keeps the diff to real changes (176 "changed" entries are mostly this format change; 26 are real) and leaves the generator alone. |
| D4 | Tokens the generator reads that the export drops (`button.primary.background-hover`, `button.secondary.background-hover`, and `button.text-style.*`, `component.button-padding.*` if used) are carried forward from the live set, as `mergeEngineeringTokens` already does for `font-metrics`; `required-manifest.json` lists them. | The promote must not break `tokens:build`. |
| D5 | Taken: `foreground-secondary` (Light `primary.700` to `primary.900-70pc`, Dark `primary.50` to `neutral.white-70pc`) and `foreground-separator` (10% to 20%). Not taken: `section.padding.main` (`space.8` to `space.7`), because it only makes sense with the re-indexed scale. | Decided in the interview. |
| D6 | The new component groups (account-picker, button, checkbox, form field, list item, menu item, paginator, radio button, row item, segmented control, slider, tab control, toggle switch and more) are emitted into `css/tokens.css` by the generator in the pattern the chip tokens use (`--color-<group>-<variant>-<state>`), and no stylesheet reads them yet. | Decided in the interview: emit, wire none. |
| D7 | The chip group comes from the promote; the copy made in 48 and the `color.primary.900-5pc` addition are dropped if the export carries both. | The roadmap's own plan for 73. |
| D8 | The archive the promote writes (`designs/tokens/_archive/<timestamp>_before_<folder>`) is committed with the branch. | `designs/tokens/README.md`: it is the rollback. |
| D9 | The merge gate: `npm run build`, the list of every variable that changes in `css/tokens.css` (kept in this folder as `token-diff.md`), `npm run audit:contrast`, before and after of Overview, All bookings, Pay and Profile in Light, Dark and one Multi-color theme at desktop width and 390px (iframe), and the baseline smoke test. | Decided in the interview. |
| D10 | No new dependency, storage key or page. `tech-spec.md`'s token paragraph and the `designs/tokens/README.md` promote steps are corrected. | Docs follow the code. |
| D11 | Done as built: D1 and D5 are `keepLive` entries in `required-manifest.json` (so the next promote does not undo them), D4 is a `mapped` list there; `--color-show-all-bg` (Light) no longer follows the separator, so it stays at 10%; component tokens skip `marker test` and `Icon Name`; the hex-to-rgba conversion and a case and type-blind diff are in `token-lib.mjs`. | Found while building: the show-all background was the separator's value. |

## Context

- Dry run in a throwaway worktree (2026-11-22): `tokens:promote -- 260617_tokens` stops with "export is missing required files: brand.json, alias.json". Flattened by hand, it reaches `tokens:build` and fails in `withAlpha` ("expected rgba(), got #00157e33").
- Diff of the flattened export against live: 359 added (all component groups in `mapped/light` and `mapped/dark`), 20 removed (four `brand.font-metrics.profile-pro.*`, which the promote carries forward; per mode `button.primary` and `button.secondary` `background-hover`, `button.text-style.*`, `component.button-padding.*`), 176 changed of which 26 are real: `alias.space.1` to `19`, `brand.size.0` (0 to 0.001), the two foreground tokens and `section.padding.main` in both modes.
- `scripts/generate-tokens-css.mjs` reads tokens by hand (`mappedColor(map, "button.primary.background-hover")`), so new groups are not emitted until it is taught to (D6).
- The chip tokens of 48 (`--color-chip-*`) are the model for D6.

## Open questions

- Whether the generator reads `button.text-style.*` and `component.button-padding.*` (D4): check in group 1.
- Naming of layout tokens in the new groups (D6): settle in group 3 against the chip pattern.
- Whether 70% ink for secondary text keeps 4.5:1 on every page tint (D5): check in the contrast audit; if not, skip that token and say so.
