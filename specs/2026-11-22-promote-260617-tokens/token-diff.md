# Token diff report (roadmap 73)

Source: `designs/tokens/_NEW/260617_tokens/tokens`, promoted on 2026-11-22. Archive of the live set before: `designs/tokens/_archive/*_before_tokens/`.

## Existing variables in `css/tokens.css` whose value changes

| Selector | Variable | Before | After |
|---|---|---|---|
| `html[data-theme="light"] {` | `--color-fg-secondary` | `#39499B` | `rgba(0, 21, 126, 0.7)` |
| `html[data-theme="light"] {` | `--color-separator` | `rgba(0, 21, 126, 0.1)` | `rgba(0, 21, 126, 0.2)` |
| `html[data-theme="dark"] {` | `--color-fg-secondary` | `#F1F2F8` | `rgba(255, 255, 255, 0.7)` |
| `html[data-theme="dark"] {` | `--color-separator` | `rgba(255, 255, 255, 0.1)` | `rgba(255, 255, 255, 0.2)` |

Another 47 variables change only in letter case (`#00157E` to `#00157e`, the export writes lower case); the colour is the same.

## New variables: 172 per mode (344 in all)

Emitted by `componentColorLines` in `scripts/generate-tokens-css.mjs` as `--color-<group>-<path>`, in both the Light and the Dark block. No stylesheet reads any of them (checked with a grep of `css/`, `js/` and the pages).

- `--color-account-picker-*`: 8
- `--color-button-*`: 63
- `--color-checkbox-*`: 12
- `--color-form-field-*`: 10
- `--color-list-item-*`: 7
- `--color-menu-item-*`: 12
- `--color-paginator-*`: 4
- `--color-radio-button-*`: 12
- `--color-row-item-*`: 7
- `--color-segmented-control-*`: 10
- `--color-slider-*`: 7
- `--color-tab-control-*`: 6
- `--color-toggle-switch-*`: 14

## Source tokens (designs/tokens)

- Added 359 (mapped Light and Dark: account-picker, button, checkbox, form field, list item, menu item, paginator, radio button, row item, segmented control, slider, tab control, toggle switch; alias colour steps `black-*`, `secondary.900-*` and others). `marker test` (a test colour) and `Icon Name` (text) are not emitted.
- Removed by the export and not carried: `button.text-style.*` and `component.button-padding.*` in both modes (nothing reads them).
- Removed by the export and carried forward from the live set (`mergeEngineeringTokens`): `brand.font-metrics.profile-pro.*` (4) and `button.primary.background-hover`, `button.secondary.background-hover` in both modes (the generator reads them, D4).
- Kept from the live set whatever the export says (`keepLive` in `required-manifest.json`): `alias.space` (the export re-points `space.1` to `19` one size step lower, D1) and `section.padding.main` (`space.8` in the live set, `space.7` in the export, D5).
- Changed and taken: `foreground.foreground-secondary` and `foreground.foreground-separator` in both modes (D5).
- Formatting only, not a change: 8-digit hex colours converted to `rgba()` (D3), hex case, `"12"` against `12` in the typography files.
- Not taken, noted: `brand.size.0` goes from `0` to `0.001` in the export. It changed no variable in `tokens.css`.

## One generator change besides the new groups

`--color-show-all-bg` in Light was the separator's value, so the 20% separator would have made it 20% too. It now uses `{color.primary.900-10pc}` directly (10%, as before). No variable changes for it.
