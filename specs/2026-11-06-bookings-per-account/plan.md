# Bookings per account: each account lists its own built-in rows (56): plan

Branch: `feature/bookings-per-account`. Decisions are cited as D1 to D10 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. Rows by account (D1 to D5, D8)

- [ ] `apps/web/all-bookings-and-payments.html`: `data-account` on every built-in group and divider; Pending and Recurring as Household's; Apple under its date in Pending; Household's Today and Yesterday (Café, Pizza, Railway) in Executed; "No standing orders." in Recurring
- [ ] `apps/web/js/all-bookings.js`: remove the other account's groups and dividers first, before dates, rows, sync and bands
- [ ] Check: `?account=household` and `?account=savings` each list only their rows in all three tabs; Savings' Pending and Recurring say they're empty; month bands and chips right

## 2. Figures and sheets (D6, D7, D9)

- [ ] `apps/web/js/all-bookings.js` (or `js/data-render.js`): Household's Today and Yesterday headers as on Account details
- [ ] `apps/web/js/payment-details.js`: a Household row on All bookings opens its Account details sheet
- [ ] Check: Household's headers match Account details before and after a payment; Café, Pizza and Railway open as on Account details; Copy of a Savings row books on Household

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 56 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` if a decision there changes (none expected)
