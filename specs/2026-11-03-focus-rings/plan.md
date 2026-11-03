# Focus rings app-wide (25): plan

Branch: `feature/focus-rings`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The base rule and the month chip (D1 to D5)

- [ ] Reproduce the month chip's browser ring after a click: Chrome, desktop and 390, the bar in the list and docked; find the cause (D5)
- [ ] `css/styles.css`: the base rule with `:where` (D1), keyboard only (D2), fields keep their stroke (D3), `tabindex="-1"` left out (D4)
- [ ] `js/all-bookings.js`, only if D5's cause is a script moving focus
- [ ] Check: the month chip shows the app's ring from the keyboard and none after a click or tap; buttons, links and cards on Overview and Profile look as before

## 2. The tokens and the audit (D6, D7)

- [ ] `css/styles.css`: the outline rules in `--color-input-stroke-focus` move to `--color-fg-interactive` (D6)
- [ ] The audit: every page in `vite.config.js` and every flow and dialog, Tab with real keys, a script records each focused element's ring; then a click on each kind of control (D7)
- [ ] Fix what the audit finds, or list it in `validation.md` with the reason
- [ ] Check: a Multi-color theme colours every ring, including the payment rows; Dark keeps them readable

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/tech-spec.md` (the rule in the Decisions, D8); `specs/roadmap.md` 25 marked done; `CHANGELOG.md` under `Unreleased`; the Components page only if it shows focus states
