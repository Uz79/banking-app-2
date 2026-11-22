# Multi-color themes: controls reach 4.5:1 (74): plan

Branch: `feature/theme-contrast`. Decisions are cited as D1 to D7 from `requirements.md`. Browser checks run on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The audit first (D3, D4)

- [ ] `scripts/audit-theme-contrast.mjs`: loads `js/theme-engine.js`, builds the tokens of every built-in theme in both shells, measures the pairs in D3, prints a table, exits 1 under 4.5
- [ ] `package.json`: `audit:contrast`
- [ ] Check: it reports the failures listed in 74 (the baseline), so the numbers match before any fix

## 2. The engine (D1, D2, D5, D7)

- [ ] `scripts/theme-engine/lib/themeColors.ts`: `MIN_TEXT_CONTRAST = 4.5`; `inkOnPrimaryFill` and the neutral pair check use it
- [ ] Rebuild `js/theme-engine.js` (command in `scripts/theme-engine/README.md`)
- [ ] Check: `npm run audit:contrast` exits 0 for all 12 themes, both shells; the UZ Bank look is unchanged

## 3. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`: the three most-changed themes (Custom 10 Dark, Custom 02 Light, Custom 06) in the browser at desktop and 390px, then the baseline smoke test
- [ ] `specs/roadmap.md` (74 to Done, in number order), `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (theme engine row) and `scripts/theme-engine/README.md` (the audit)
