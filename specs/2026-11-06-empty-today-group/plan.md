# No empty "Today" group (61): plan

Branch: `feature/empty-today-group`. Decisions are cited as D1 to D4 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. Hide a group without rows (D1 to D4)

- [x] `apps/web/js/data-render.js`: `syncBuiltInRows` hides any group with no row shown
- [x] `apps/web/js/all-bookings.js`: `renderMonthSeparators` carries the month over hidden groups
- [x] Check: Household's All bookings opens with June's band over Yesterday and no Today; a payment made in Pay brings Today back, with its balance; Savings and Account details as before

## 2. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 61 done; `CHANGELOG.md` under `Unreleased`
