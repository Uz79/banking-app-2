# All bookings: month separators (24): plan

Branch: `feature/month-separators`. Decisions are cited as D1 to D11 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The separators (D1 to D4, D7)

- [ ] `apps/web/js/all-bookings.js`: after each render, add an `h2.all-bookings__month` before each month's first group in all three tabs, replacing the divider before it; the year when a tab crosses a year; search indexes the separators and hides one with its month
- [ ] `apps/web/js/all-bookings.js`: in-app Pending and Recurring groups go in at their date among the static ones (D12)
- [ ] `apps/web/css/styles.css`: `.all-bookings__month`, tokens only
- [ ] Check: Executed shows JUNE, MAY, APRIL, MARCH, FEBRUARY above their first day; Pending and Recurring show OCTOBER and NOVEMBER; an in-app pending payment's month gets one; "Rent" leaves only the months with a match; Light and Dark

## 2. Chips and scroll (D5, D6, D8, D10)

- [ ] `apps/web/js/all-bookings.js`: chips scroll to the separator (instant under reduced motion); the active chip follows the scroll on Executed, quiet while a chip's own scroll runs; when the bars swap, focus on a chip in the hidden bar moves to the same chip in the shown one
- [ ] Check: Mar scrolls to MARCH under the docked chips with Mar active; scrolling by hand makes each month's chip active as its separator passes; Enter on a chip leaves focus on the same chip in the docked bar, and Tab moves on from there

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 24 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` only if a described system changed; `apps/web/README.md` unchanged (no new key or file)
