# Legibility in the fridge and the opening (34): plan

Branch: `feature/legibility-fridge-opening`. Decisions are cited as D1 to D8 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. One script for Legibility (D1 to D3, D6)

- [x] `apps/web/js/appearance.js`: the Legibility block moved from `apps/web/js/app-mp.js`
- [x] Every page with `js/app-mp.js`: `js/appearance.js` just before it
- [x] `apps/web/fridge-advisor.html`, `apps/web/investment-opening.html`: load `js/appearance.js`
- [x] Check: Profile's Legibility and User Type still change every page; Large shows in the fridge and the opening, in the sheet and on their own pages; the Typeface choice too

## 2. Layouts at Small and Large (D4, D5, D7, D8)

- [x] Every fridge step (1 to 7) and opening screen at Small and Large, desktop and 390px: list what breaks
- [x] `apps/web/css/styles.css` (and the pages' own markup if needed): fix each, with the scale's tokens
- [x] Check: the same pass again, nothing overflows or clips

## 3. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 34 done, the Playground as a new item; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the new script); `apps/web/README.md` if it lists the scripts
