Branch: `feature/chip-own-tokens`

# Chip: its own tokens, as in Figma (48): requirements

Roadmap item 48 (`specs/roadmap.md`), added 2026-11-05. `.chip--tonal` (43) borrows the tonal button's colours, and `.chip` (primary) borrows the primary button's. Figma's Chip (Des-Sys-Test, Component Library > Chip, node 769:106445) has its own token sets, `chip/primary/*`, `chip/secondary/*` and `chip/filled tonal/*`, each with background, border, foreground, hover state and pressed state. They are in `designs/tokens/_NEW/260617_tokens` but not in `designs/tokens/mapped`, so the app cannot read them.

## Scope

**In:**

1. The `chip` group copied verbatim from `260617_tokens/tokens/mapped/Light.json` and `Dark.json` into `designs/tokens/mapped/light.json` and `dark.json` (D1)
2. `--color-chip-primary-*`, `--color-chip-secondary-*` and `--color-chip-filled-tonal-*` (background, border, foreground, hover, pressed) emitted by `scripts/generate-tokens-css.mjs` for Light and Dark (D2)
3. The theme engine derives the same 15 tokens for every Multi-color theme, and the boot script, the contrast checker and older saved caches learn them (D3, D4)
4. `.chip` and `.chip--tonal` read their own tokens; a new `.chip--secondary` (D5 to D8)
5. `designs/components/chip/chip.md` documents all three cases and the tokens; a Chip specimen on the Components page and in the Storybook live story (D9)

**Out (not in this branch):**

- Promoting the whole 260617 export (checkbox, slider, paginator and the other components it carries): a new roadmap item under Later (73), with a visual check of every component it touches (D1)
- An interactive chip (a button or a link with hover and pressed). The tokens for hover and pressed are emitted and documented; no chip in the app is interactive yet, and `chip.md` lists only the `default` state (D6)
- Chip SVG exports for the new cases (`chip.md` says tonal "has no SVG export yet"; that stays)
- The other chips in the app (`.all-bookings__month-chip`, `.performance-card__range-chip`, `.assistant__chip`, the theme flow's `tf-*chip`): they are their own components with their own classes

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Merge only the `chip` group, verbatim** (interview). Copy the `chip` object from Light.json and Dark.json of `260617_tokens` into `designs/tokens/mapped/light.json` and `dark.json` as a new top-level `chip` key, values untouched (`{color.primary.900-5pc}` and so on). Do not run `tokens:promote` | The live mapped files lack the other components in the export, and a full promote changes every one of them. Promoting everything is its own item (73) with its own visual check |
| D2 | **The generator reads the mapped values.** `scripts/generate-tokens-css.mjs` reads `chip.<case>.<part>` with `mappedColor` and emits `--color-chip-primary-{bg,border,fg,hover,pressed}`, the same for `secondary` and `filled-tonal`. Figma's "filled tonal" becomes `filled-tonal` and "hover state" becomes `hover`, "pressed state" `pressed`, as the button tokens name them. `css/tokens.css` is regenerated with `npm run tokens:build`, never edited | AGENTS.md: edit the source, never the output. Naming follows `--color-btn-*` and the roadmap's `--color-chip-filled-tonal-*` |
| D3 | **The theme engine derives the 15 tokens for Multi-color themes**: `scripts/theme-engine/lib/themeColors.ts` gets them in `DERIVED_NAMES` and in the returned set, then `js/theme-engine.js` is rebuilt (`scripts/theme-engine/README.md`). Primary mirrors the primary button (fill, ink, 10% and 20% state layers); secondary mirrors the secondary button; filled tonal is the neutral ink at 5% in Light and 10% in Dark, with the ink as foreground, a 0% border, and 10% and 20% ink for hover and pressed, which is what Figma's tonal case resolves to | Mapped Figma values are fixed colours; a Multi-color theme needs them derived from its own palette, as every other `--color-*` token is. Tonal Dark is 10% in Figma (`white-10pc`) and 5% in Light (`primary.900-5pc`) |
| D4 | **Boot script, checker and older caches learn the tokens.** `js/theme-boot.js` carries them in `DEFAULT_TOKENS` and in what it applies; a one-time migration (`uzBankWebChipTokens_v1`) adds them to a colour token cache saved before they existed, from the cache's own button tokens and `color-fg` (primary and secondary copy the matching `color-btn-*`; tonal is `color-fg` at 5% Light and 10% Dark, the ink as foreground); `js/contrast-checker.js` lists them in both its lists. The key goes into `apps/web/README.md` | As roadmap 63 did for `--color-separator-subtle`: the boot script applies only the tokens it knows by name, so an unlisted token never reaches a saved theme before paint, and a chip with an undefined token would lose its fill |
| D5 | **`.chip` (primary) reads `--color-chip-primary-*`; `.chip--tonal` reads `--color-chip-filled-tonal-*`** (interview: tonal wired in, all three cases). The class stays `.chip--tonal`, as the button's is `uz-btn--tonal`; `chip.md` says it is Figma's FilledTonal | Four JS files, the story and the docs use `.chip--tonal`. Renaming churns markup for no behavioural gain (interview) |
| D6 | **A new `.chip--secondary`**: the `chip-secondary-*` background, border and foreground. Only the `default` state is built; `hover` and `pressed` exist as tokens for the day a chip is a button or a link. `.chip__dismiss`'s hover and pressed, today a mix of `--color-btn-primary-fg`, read the case's foreground instead (`currentColor` mixes) | The Secondary case is documented in Figma and chip.md and should exist in the system. Building states nothing uses would be untested code |
| D7 | **The tonal chip follows Figma's look** (interview): Light is the primary ink at 5% with that ink as text; Dark is white at 10% with white text. Today's tonal chip is the tonal button's fill (the neutral ink at 5% in both shells), so the booking-row chips ("Pending", "Monthly") change only in Dark, from 5% to 10% | The point of the item is that the chip follows its own Figma tokens, not the button's. The change is small and is checked for contrast in Light, Dark and a Multi-color theme (D10) |
| D8 | **No hand-rolled colours.** Every colour in `.chip*` is a `--color-chip-*` token; the focus ring of `.chip__dismiss` stays `--color-fg-interactive` (AGENTS.md) | Standing rule |
| D9 | **The specimen is documented in three places**: `designs/components/chip/chip.md` (the three cases, sizes, tokens, hover and pressed unbuilt), `apps/web/components.html` (a Chip section: regular and small, primary, secondary and filled tonal, with and without an icon and a dismiss), and `src/stories/live/components/chip.stories.js` (the same cases). No em dashes | The Components page is where the design system is shown and where the Light, Dark and Multi-color checks happen. It has no chip section today |
| D10 | **Contrast is measured**, not assumed: each case's foreground on its background in Light, Dark and a Multi-color theme (Light and Dark shells), at least 4.5:1 for the small chip's text; the numbers go in `validation.md` | A 5% or 10% tint under text is the case where a theme can get close to the limit (roadmap 63 measured 3.73:1 once) |

## Context

- `.chip`, `.chip--md`, `.chip--sm`, `.chip--tonal`, `.chip__dismiss` are in `apps/web/css/styles.css` (about line 1370). Chips are used in JS-built markup: `js/all-bookings.js` (twice), `js/data-render.js`, `js/built-in-bookings.js`, and statically as `#uz-pd-status-chip` in `account-details.html` and `all-bookings-and-payments.html` (primary, small).
- The generator already derives button tonal from `bgSecondary`; it does not read a Figma tonal button, which is why chips needed their own source (`scripts/generate-tokens-css.mjs` 410 to 418).
- The theme engine already has a legacy "chip-*" name table (`chip-background`, `chip-state-hover` and so on, `themeColors.ts` around 1991) for the theme flow. It is not the app's `--color-*` tokens; check in task group 2 that adding `--color-chip-*` does not collide with it, and leave it unchanged.
- `designs/tokens/mapped/*.json` is a thinner shape than the export (top-level `background`, `border`, `button`, `component`, `foreground`, `section`), so the merged `chip` group is the first component-level group there; `tokens:validate` and `required-manifest.json` do not know it (see open questions).

## Open questions

- Whether `required-manifest.json` should list the chip tokens, so a later promote of an export without them fails `tokens:validate` instead of silently dropping the chip colours. Settle in task group 1 by reading how the manifest lists engineering tokens; if it only lists generator inputs, add the chip paths.
- Whether the legacy "chip-*" table in `themeColors.ts` is read anywhere outside the theme flow (task group 2).
