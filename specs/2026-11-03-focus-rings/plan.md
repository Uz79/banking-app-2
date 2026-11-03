# Focus rings app-wide (25): plan

Branch: `feature/focus-rings`. Decisions are cited as D1 to D13 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The base rule and the month chip (D1 to D5)

- [x] Reproduce the month chip's browser ring after a click: Chrome, desktop and 390, the bar in the list and docked; find the cause (D5)
- [x] `css/styles.css`: the base rule with `:where` (D1), keyboard only (D2), fields keep their stroke (D3), `tabindex="-1"` left out (D4)
- [x] `js/all-bookings.js`, only if D5's cause is a script moving focus: not needed (the cause is the missing ring, D5)
- [x] `css/styles.css`: the month bars get room for the ring, which their scroll area and the dock clipped (D11, found in the build)
- [x] Check: the month chip shows the app's ring from the keyboard and none after a click or tap; buttons, links and cards on Overview and Profile look as before

## 2. The tokens and the audit (D6, D7)

- [x] `css/styles.css`: the outline rules in `--color-input-stroke-focus` move to `--color-fg-interactive` (D6)
- [x] The audit: every page in `vite.config.js` and every flow and dialog, Tab with real keys, a script records each focused element's ring; then a click on each kind of control (D7)
- [x] Fix what the audit finds, or list it in `validation.md` with the reason: the base rule matches any keyboard focus (D12); the month bars leave the Tab order (D13)
- [x] Check: a Multi-color theme colours every ring, including the payment rows; Dark keeps them readable

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/tech-spec.md` (the rule in the Decisions, D8); `specs/roadmap.md` 25 marked done; `CHANGELOG.md` under `Unreleased`; the Components page only if it shows focus states
