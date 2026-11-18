# Fridge advisor result: CHF 0 with no reason (83): plan

Branch: `feature/fridge-zero-result`. Decisions are cited as D1 to D8 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The explanation and the label (D1 to D7)

- [ ] `js/fridge-advisor.js`: in `buildResult()` the zero-result sentence (only when `investable()` is 0), the relabelled yearly line; the announcement in `render()` gains the sentence at 0
- [ ] `css/styles.css`: the explanation's rule (tokens only), centred in `.fridge__result`
- [ ] Check: the fridge at a result of 0 (assets equal to a month plus reserves, and assets 0) shows the sentence and "You could set aside each year"; at a result above 0 only the label differs; 390 and Legibility Large fit

## 2. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md` (83 to Done, in number order), `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy); `specs/tech-spec.md` only if its fridge row names the yearly line
