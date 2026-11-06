Branch: `feature/legibility-fridge-opening`

# Legibility in the fridge and the opening (34): requirements

Roadmap item 34 (`specs/roadmap.md`). Profile > Legibility (type and spacing scale, Typeface, Font) is applied by `js/app-mp.js`, which `fridge-advisor.html` and `investment-opening.html` don't load. A reader on Large gets default type in the fridge and the investment opening, both in Overview's sheet (where each runs in an iframe) and on their own pages. The fonts themselves already load there (`css/styles.css` imports them).

## Scope

**In:**

1. The Legibility code moves out of `js/app-mp.js` into its own script, unchanged in what it does (D1, D2)
2. The fridge and the opening load it, so their type, spacing and typeface follow Profile (D3)
3. Every fridge step and opening screen checked at Small, Regular and Large, and what breaks is fixed here (D4, D5)

**Out (not in this branch):**

- The Playground (`playground.html`), which also ignores Legibility: roadmap 58
- Changing Legibility while the fridge or the opening is open (Profile and the sheet are never on screen together; the frame reads the settings when it loads)
- The 3D scenes: the fridge, the persona, the helper and the vehicles keep their sizes; only text and spacing around them scale

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **`js/appearance.js` holds the Legibility code**: the presets, the fonts, `readAppearance`, `applyAppearance`, `applyAppearancePreset`, `window.UZBankAppearance`, and the first apply on load, moved as they are from `js/app-mp.js` (lines 74 to 192) (interview) | One copy of the scale logic for every page |
| D2 | **Every page that loads `js/app-mp.js` loads `js/appearance.js` just before it** (11 pages); `app-mp.js` keeps everything else | Same order and timing as today, so nothing else changes on those pages |
| D3 | **`fridge-advisor.html` and `investment-opening.html` load `js/appearance.js`** before their other scripts | They need only Legibility, not the shell's toggles and carousels |
| D4 | **Layouts at Small and Large are fixed in this branch** (interview): text that overflows, clips or crosses a ring or a panel edge, at desktop and 390px | 34 asks for the check; a setting that breaks a page isn't done |
| D5 | **Fixes use the existing tokens and rules**: the `--fs-*` and `--space-*` scale, `clamp()`, wrapping; no new fixed sizes, no per-setting overrides unless a layout can't be made to fit otherwise (then recorded as a decision here) | The scale should just work, as on the other pages |
| D6 | **No new storage key**: `uzBankWebAppearance` as today | The frame shares the app's origin and storage |
| D7 | **At Large on a phone the risk chart's end values are rows** (name and amount on one row each, under the chart), by `:root.assistant--full[data-legibility="large"]` on `.opening-chart__values`; the one per-setting override D5 allows (build) | Three columns of label and amount can't fit 390px at Large in a wide typeface; wrapping inside each column split names mid-word |
| D8 | **The strategy markers' names stop growing on a narrow screen**: `font-size: min(var(--fs-text-xs), 3.1vw)`, columns `minmax(min-content, 1fr)`, ellipsis kept (build) | Five names in one row overflowed at Large; `hyphens: auto` didn't break them in Chrome ("Conservati/ve") |

## Context

- Legibility: `js/app-mp.js` lines 74 to 192 (presets Small 0.9 / 0.86, Regular 1 / 1, Large 1.16 / 1.14; `APPEARANCE_VAR_NAMES` scales `--space-*` and `--fs-*` on `<html>`; `data-legibility`, `data-persona`, `data-font-family`; the event `uzbank:appearance-change`).
- Users of `UZBankAppearance`: `js/profile-settings.js` (Profile's Legibility tab), `js/profile-persona.js` (User Type sets a preset, line 353; seeds sliders from the old persona, line 104). `profile-persona.js` is also loaded by the fridge and the opening, where it only reads.
- `css/styles.css` line 917: a rule keyed to `--appearance-space-scale`.
- The fridge and the opening: their own pages, loaded into an iframe by `js/fridge-advisor-sheet.js` (and the opening the same way) inside Overview's sheet; framed by `fridge--framed` and `opening--framed`. Fixed sheet sizes: the film frame 960 x 640 (8d), the opening 960 wide with the assistant's 360 column (9b), the flow sheet's height clamp (9d D14).
- Earlier finding (26): a six-digit amount wraps in the result ring whatever the type size; the ring's text is sized by length.

## Found in the build

- Desktop at Small, Regular and Large: every fridge step and opening screen fit as they were.
- Phone (390px) at Large: the risk chart's legend names wrapped into its amounts (now the key sits above the name, D7 at Large); the strategy markers' names ran out of their markers (D8); the summary's strategy chip ran past the edge (now it goes under the name).
- A wide typeface (Source Serif 4) at Large on a phone made all three worse; the overflow check passes with it after the fixes.
- The page in the sheet's frame reloaded once by itself during the check, most likely Vite's reload on a CSS save; the session draft brought it back where it was.
- The Playground ignores Legibility too: roadmap 58.
