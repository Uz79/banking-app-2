# Dashboard tile: what inflation does to idle money (79): plan

Branch: `feature/inflation-tile`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The tile (D1 to D5, D7, D8)

- [x] `overview.html`: the `section-card--overview-inflation` card after Offers (heading, the sentence, the chart host, the footnote, the link), and the script tag for `js/inflation-tile.js` after `data-render.js`
- [x] `js/inflation-tile.js` (new, classic script, one config block at the top: rate, years, copy): reads the idle cash, draws the line and the flat reference line as inline SVG, writes the sentence and the end value, hides the tile under CHF 1'000
- [x] `css/styles.css`: the card's chart and text (tokens only), and its place in the grid at three columns, two columns and the phone
- [x] Check: Overview at 1440 (three columns, with and without the status message), 1100 (two) and 390; Light and Dark; the figures match the demo's balances

## 2. Data and the link (D3, D6)

- [x] `js/inflation-tile.js`: re-read and redraw on the payment state's change event
- [x] `js/fridge-advisor-sheet.js`: bind every `a[href="fridge-advisor.html"]` on the page, not the first only
- [x] Check: a transfer from Savings to Household leaves the tile the same (the sum), a payment out of Household lowers it; the link opens the fridge sheet, and with a draft past the intro still resumes; the tile hides under CHF 1'000

## 3. Wrap-up

- [x] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test (in part: the items not run are unticked there)
- [x] `specs/roadmap.md` (79 to Done, in number order), `specs/tech-spec.md` (a row for the tile and its placeholders), `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
