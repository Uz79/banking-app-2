# Field anatomy and the month band's ink (63, 64): plan

Branch: `feature/field-anatomy-and-band-ink`. Decisions are cited as D1 to D11 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The token and the band (D1 to D4, D10)

- [x] `apps/web/scripts/theme-engine/lib/themeColors.ts`: `color-separator-subtle` in `DERIVED_NAMES` and in the returned tokens (neutral ink at 5%, Light and Dark); rebuild `apps/web/js/theme-engine.js` as `scripts/theme-engine/README.md` says (never edit the output)
- [x] `apps/web/scripts/generate-tokens-css.mjs`: emit `--color-separator-subtle` for Light and Dark (the mapped separator colour at 5% alpha); run `npm run tokens:build`
- [x] `apps/web/js/theme-boot.js` (default tokens and the applied list) and `apps/web/js/contrast-checker.js` (both lists) learn the token
- [x] `apps/web/css/styles.css`: `.all-bookings__month` fills with `var(--color-separator-subtle)`; its label stays `--color-fg-secondary`
- [x] Check: All bookings (all three tabs) in Light, Dark and a Multi-color theme: the band is a faint tint, readable, the label legible; saving a theme and reloading keeps it (the boot script); the UZ Bank card restores the default look; the contrast numbers noted for the wrap-up (D10)

## 2. The field anatomy (D5 to D7)

- [x] Read Figma's TextField (Regular and Small, Default, Informative, Error) for the anatomy and the Small case (open question)
- [x] `apps/web/css/styles.css`: `.form-field__label` as a 24dp row; the gaps 4dp; `.form-field__optional-row` and `.form-field__error-row` exactly 16dp with the 16dp icon and the text trimmed to the row; the empty-row `::after` spacer the same 16dp (still CSS only, no markup or ARIA change, no change to `js/field-error.js`)
- [x] Check in Buy (done; Pay's amount with the shared helper, Pay's and the transfer's real flows and the admin sign-in in the group 3 audit): Limit's error shows and clears with the duration control not moving by a pixel (measure the control's top before and after); the same in Sell, Pay's amount, the transfer's amount and the admin sign-in

## 3. The audit and the copy (D7, D8)

- [ ] A script (kept in the scratchpad, not the repo) that, for every form field on every page and flow, measures the field's height empty, with a helper and with an error, in Light and Dark at 390px and desktop and at Regular and Large type; the three must be equal. Lists any message that wraps
- [ ] Shorten any message that wraps at Regular on 390px (config or the flow's own file; no em dashes); list what still wraps at Large in `validation.md`
- [ ] Check that the sheets that must fit still do (Buy, Sell, Pay, the transfer; the fridge and the opening's fixed-height steps), since every label row is now 24dp
- [ ] Check: every flow's forms by eye at 390px and desktop in Light and Dark

## 4. The Components specimen (D9)

- [ ] `apps/web/components.html`: a "Form field" specimen of the anatomy: 24 / 4 / control / 4 / 16 dp marked, shown empty, with a helper and with an error, side by side at one height; the text below is plain and has no em dashes
- [ ] Check: the specimen in Light and Dark, desktop and 390px; Tab order and the focus ring are unaffected

## 5. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [ ] `specs/roadmap.md`: 63 and 64 marked done, with what was settled and found
- [ ] `specs/tech-spec.md`: the "Field errors" row gains the anatomy; a new row for `--color-separator-subtle` and where the engine, generator and boot script carry it
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [ ] `apps/web/README.md`: no storage key or file list changes expected; check
