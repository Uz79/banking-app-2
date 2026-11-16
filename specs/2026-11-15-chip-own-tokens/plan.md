# Chip: its own tokens (48): plan

Branch: `feature/chip-own-tokens`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The tokens in the pipeline (D1, D2)

- [x] `designs/tokens/mapped/light.json` and `dark.json`: add the `chip` group copied verbatim from `designs/tokens/_NEW/260617_tokens/tokens/mapped/Light.json` and `Dark.json` (a script that copies the one key, so nothing else in the files moves; check the diff touches only the new key)
- [x] `apps/web/scripts/generate-tokens-css.mjs`: read `chip.primary`, `chip.secondary` and `chip.filled tonal` (background, border, foreground, hover state, pressed state) and emit the 15 `--color-chip-*` custom properties for Light and Dark; run `npm run tokens:build`
- [x] `designs/tokens/required-manifest.json`: decide per the open question and add the chip paths if the manifest lists generator inputs
- [x] Check: `css/tokens.css` gains only the 30 new lines; the values match Figma (Light tonal background is the primary ink at 5%, Dark white at 10%); the app still builds and renders unchanged

## 2. The theme engine and the boot script (D3, D4)

- [x] `apps/web/scripts/theme-engine/lib/themeColors.ts`: the 15 tokens in `DERIVED_NAMES` and in the returned set (primary mirrors the primary button, secondary the secondary button, tonal as D3); confirm the legacy "chip-*" table is untouched and nothing reads both; rebuild `apps/web/js/theme-engine.js` as `scripts/theme-engine/README.md` says
- [x] `apps/web/js/theme-boot.js`: the tokens in `DEFAULT_TOKENS` and the applied list, and the one-time migration `uzBankWebChipTokens_v1` for caches saved before; `apps/web/js/contrast-checker.js`: both lists
- [x] Check: picking a Multi-color theme sets the 15 tokens on the page (read them in the console) in Light and Dark; the UZ Bank card restores the default; a cache saved without them (simulated in `localStorage`) gains them on the next load and the migration key is set

## 3. The chip reads its tokens (D5 to D8)

- [x] `apps/web/css/styles.css`: `.chip` on `--color-chip-primary-*`, `.chip--tonal` on `--color-chip-filled-tonal-*`, a new `.chip--secondary` on `--color-chip-secondary-*`; `.chip__dismiss` hover, pressed and focus follow D6 and D8; no hand-rolled colour
- [x] Check: the booking-row chips ("Pending", "Monthly") on All bookings and Account details, and the sheet's status chip, in Light, Dark and a Multi-color theme: only Dark tonal is visibly different (10% instead of 5%); nothing else moved

## 4. The documentation and specimen (D9, D10)

- [x] `designs/components/chip/chip.md` and `chip.json`: the three cases, sizes, tokens and the unbuilt states; the note that the tonal button's colours are no longer borrowed
- [x] `apps/web/components.html`: a Chip section (regular and small; primary, secondary, filled tonal; with and without icon and dismiss); `apps/web/src/stories/live/components/chip.stories.js`: the same cases
- [x] Contrast numbers for each case in Light, Dark and a Multi-color theme, noted for `validation.md` (D10)
- [x] Check: the section in Light and Dark, desktop and 390px; Tab through it: the dismiss buttons show the focus ring

## 5. Wrap-up

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it) (run in part; the items not run are unticked there)
- [x] `specs/roadmap.md`: 48 marked done and moved to Done in number order; 73 stays under Later
- [x] `specs/tech-spec.md`: a row for the chip tokens (where the generator, engine and boot script carry them)
- [x] `apps/web/README.md`: the key `uzBankWebChipTokens_v1`
- [x] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
