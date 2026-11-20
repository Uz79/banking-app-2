# Booking sheet: an executed instance names its standing order (44): plan

Branch: `feature/standing-order-link`. Decisions are cited as D1 to D8 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The line and its data (D1, D2, D6)

- [ ] `js/payment-details.js`: `buildDataFromStateBooking` carries the instance's order (`ranOf`, found rule, frequency label)
- [ ] Sheet markup in every copy (`partials/payment-details-overlay.html`, `account-details.html`, `all-bookings-and-payments.html`, and any other page that inlines it): the "Standing order" row under Status
- [ ] `css/styles.css`: the row's look (tokens only)
- [ ] Check: make a standing order that has run, open its executed instance: the line reads "Standing order: Monthly"; a one-off and a built-in row have none

## 2. The link (D3, D4, D5)

- [ ] `js/payment-details.js`: the row is a button that opens the rule's sheet by the existing route; plain text when the rule is gone
- [ ] Check: the button opens the order's sheet, Back returns to the instance; after deleting the order the line is plain text; keyboard and focus ring; 390px

## 3. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md` (44 to Done, in number order), `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` if its booking sheet row lists the lines
