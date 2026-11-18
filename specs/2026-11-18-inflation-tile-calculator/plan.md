# Overview tile: an investment return calculator in "Cash loses value" (82): plan

Branch: `feature/inflation-tile-calculator`. Decisions are cited as D1 to D19 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. Config, and the old chart out of the way (D6, D15, D16)

- [x] `js/investment-opening-config.js`: a `CALCULATOR` block (z, the duration, amount and strategy slider limits, `r` and `s` per strategy flagged as placeholders, the copy), `AMOUNT.exampleAmount`, and `RISK_CHART` removed
- [x] `js/investment-opening.js`: import and use `AMOUNT.exampleAmount`
- [x] Check: the opening still opens, and the assistant's "{amount}" shows CHF 10'000 before an amount is entered

## 2. The expander and the sliders (D3 to D5, D11, D12, D14, D15, D18)

- [x] `overview.html`: the expander, the three slider rows with fields and end labels, the results list, the legend and the notes inside the tile; the tile's script as `type="module"`
- [x] `js/inflation-tile.js`: ES module importing the config; start values from idle cash; sliders and fields kept in step; clamp and round on Enter or blur; strategy output and `aria-valuetext`
- [x] `css/styles.css`: the slider rows (the fridge's `cc-color-slider`), the fields, the expander inside the tile, phone layout
- [x] Check: the expander opens and closes (mouse and keyboard); sliders and fields follow each other; the tile hides under CHF 1'000

## 3. The curves in the chart (D1, D2, D7 to D10)

- [x] `js/inflation-tile.js`: percent-of-amount drawing, the snapped y range, the three curves and the band, the cash line for the slider values, the sentence and figures following the sliders while open, back to idle cash on close
- [x] `js/inflation-tile.js` and `overview.html`: the end values as text, the legend with dash patterns, the live region on `change`
- [x] `css/styles.css`: the line patterns, the band, the legend, the results list (Large and phone rows)
- [x] Check: moving each slider redraws without a jump or animation; balanced 10 years at CHF 10'000 gives about 24'500, 14'900 and 9'100; the chart reads with colour taken away

## 4. Cleanup (D16)

- [x] Delete `js/opening-risk-chart.js` and the `.opening-chart*` rules; check by search that nothing else references them
- [x] Check: the opening's risk step at 1440 and 390 still looks right

## 5. Wrap-up

- [x] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test (in part: the items not run are unticked there)
- [x] `specs/roadmap.md` (82 and 81 to Done, in number order), `specs/tech-spec.md` (the tile's row, the opening's chart mention), `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
