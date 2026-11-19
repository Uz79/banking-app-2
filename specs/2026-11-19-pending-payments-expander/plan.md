# Account details: the "Pending payments" summary expands (72): plan

Branch: `feature/pending-payments-expander`. Decisions are cited as D1 to D12 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The Expander extension (D7, D8)

- [x] `css/styles.css`: `.expander__trailing` slot, a panel convention (`hidden`, no height animation), the chevron's reduced-motion rule
- [x] `designs/components/expander` notes: none in the repo (no such folder), nothing to update
- [x] Check: the Expander in the design system page still looks and works the same; reduced motion has no chevron transition

## 2. The summary row becomes an expander (D3, D4, D5, D9, D10, D11)

- [x] `account-details.html`: both pending lines become the extended expander with a panel and the "Show all pending" button
- [x] `js/data-render.js`: fill the panel with at most 3 rows grouped by date (nearest first), the signed total, the button only when more than 3, an open panel kept across a redraw
- [x] `css/styles.css`: the row and panel rules (tokens only)
- [x] Check: Household and Savings, 0 / 1 / 3 / more than 3 pending, closed on load, open and close by pointer and keyboard, a rows opens its sheet with Edit and Delete

## 3. "Show all pending" (D6)

- [x] `js/all-bookings.js`: read `?status=` once on load and select that tab
- [x] The button's own handler in `js/data-render.js` goes through `UZShellNav.go` with `?account=&status=pending` (not `js/app-mp.js`)
- [x] Check: the link lands on the right account's Pending tab; Back returns to Account details; a plain "Show all bookings" still opens Executed

## 5. Review follow-up (D13 to D15)

- [x] `js/data-render.js`: day groups go before `[data-action="show-all-bookings"]` (D15); `ACCOUNT_DAYS = 2` becomes `ACCOUNT_ROWS = 5`, counted across days (D13); the "Show all pending" click handler and the `more` logic go (D14)
- [x] `account-details.html`: the two "Show all pending" buttons removed (D14)
- [ ] Klaudiusz: `npm run build`, then the follow-up checks in `validation.md`

## 4. Wrap-up

- [x] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test (in part: see its Checked line)
- [x] `specs/roadmap.md` (72 to Done, in number order), `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy); `specs/tech-spec.md` if its Expander or All bookings rows change
