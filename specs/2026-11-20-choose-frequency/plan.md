# Pay and the transfer: choose a frequency (45): plan

Branch: `feature/choose-frequency`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The dates (D4, D5)

- [ ] `js/payment-state.js`: `nextDueDate` for weekly, quarterly, yearly; weekend and month-end rules; `runDueRules` anchors per D5
- [ ] Check: seed a rule of each frequency in the past, reload: the right number of executed instances on the right dates, the next payment correct

## 2. The choice in Pay (D1 to D3, D6 to D10)

- [ ] Schedule markup in every page copy: the "Repeats" segmented group, hidden on Single
- [ ] `js/payment-overlay.js`: read the choice into the booking, seed it on Edit and Copy, confirmation sentence
- [ ] `js/payment-state.js`: store the chosen frequency on commit and update
- [ ] `css/styles.css`: the group's look and the 390px wrap
- [ ] Check: make a Recurring and a Standing order payment of each frequency; the sheet, rows and the 44 line read it; Edit opens on it

## 3. The choice in the transfer (D2, D3, D6 to D8)

- [ ] `partials/iat-overlay.html` and `js/iat-overlay.js`: the same group under Recurring execution, the sentence, Edit
- [ ] Check: a recurring transfer of each frequency, its instances and sheet

## 4. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md` (45 to Done, in number order), `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` if its payment notes name monthly only
