# Account details: the "Pending payments" summary expands (72): requirements

Branch: `feature/pending-payments-expander`

Roadmap item 72, found 2026-11-13. The "Pending payments" row above the booking list on Account details (`bookings-card__pending` in `account-details.html`, filled by `renderAccountBookings` in `js/data-render.js`) shows a chevron and a total but opens nothing. The 2026-11-19 interview added a limit: the expanded row shows at most 3 pending payments, and a "Show all pending" button opens All bookings on its Pending tab when there are more.

## Scope

**In:**

1. The summary row becomes an expander (the design system's `.expander`, extended with a trailing slot, a panel and a reduced-motion rule for the chevron; no new component).
2. Expanded: the pending payments as booking rows with the Pending chip, grouped by execution date, at most 3 rows. Rows open the booking sheet (Edit, Delete) as on All bookings.
3. "Show all pending" under the rows when there are more than 3, opening All bookings on the same account's Pending tab.
4. `?status=pending` read by All bookings (`js/all-bookings.js`).

**Out (one-line pointers, not this branch):**

- Changing what counts as pending, or the pending sort on All bookings (`pendingTotal`, `pending`, `nextPayments` in `js/built-in-bookings.js` are reused).
- Edit and Copy for a pending transfer (51).
- The Overview page's pending handling.

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **At most 3 pending rows are shown** when the row is expanded. The button "Show all pending" appears only when there are more than 3, and not otherwise. | Klaudiusz's answer (3 of "3 to 5"). Keeps the card short on a phone; Household has 5 built-in pending items before any made in the app. |
| D2 | **The 3 shown are the nearest by execution date**, the same order as the Pending tab (date ascending); ties keep the tab's order. | Default. The next payments due are the useful ones, and the link opens the same list in full. |
| D3 | **Closed by default**, every visit. The open state is not stored. | The roadmap's suggestion, accepted. No new storage key. |
| D4 | **The total keeps its current figure and gets a minus** when money goes out ("-CHF 2'654.80"). The row stays hidden when nothing is pending (as now). | The roadmap's suggestion, accepted: booking rows show "-amount", so the summary should too. Wording of the sign to check at review (see Open questions). |
| D5 | **The rows reuse the All bookings Pending group markup** (`booking-group` per date, `booking-row` with the Pending chip) and open the sheet the same way (Edit, Delete). | One look and one set of handlers. |
| D6 | **"Show all pending" opens `all-bookings-and-payments.html?account=<key>&status=pending`.** `js/all-bookings.js` reads `status` once, on load: `pending` or `recurring` select that tab; anything else (or none) keeps Executed. Back returns to Account details. | Klaudiusz's answer: a link that does what its label says. No storage key. |
| D7 | **The expander is a `<button>` with `aria-expanded` and `aria-controls`** pointing at a `hidden` panel that is toggled in JS; Enter and Space work; focus stays on the button. No height animation. | Roadmap: `aria-controls` is missing from `.expander` today. Accessibility rule. |
| D8 | **Reduced motion:** the chevron's rotation gets a `prefers-reduced-motion` path (no transition). | AGENTS.md: every animation has one; `.expander` has none today. |
| D9 | **Both accounts' panels** (Household and Savings, `data-account-bookings`) get the expander, since each draws its own pending line. Custody keeps whatever it has (nothing to expand). | `account-details.html` has one `data-pending-line` per slide. |
| D10 | **The rows follow the data:** a payment made, edited or deleted while the page is open redraws the panel (the existing `uzbank:state-changed` redraw); an open panel stays open across the redraw. | Without it the panel would show stale rows. |
| D11 | **Copy:** "Pending payments" (unchanged label) and "Show all pending" (button, `show-all-btn` look with the arrow, as "Show all bookings"). No em dashes. | Default; matches the existing button. |
| D12 | **No new page, no dependency, no storage key.** | Nothing to register or list. |
| D13 | **Follow-up (2026-11-19, review):** under the pending row, Account details shows the **5 most recent executed bookings**, grouped by day with each day's balance, instead of the two newest days. A day can be cut part-way when the five run out. | Klaudiusz at review: 3 pending in the panel, and about five executed bookings below it. |
| D14 | **"Show all pending" is removed** (supersedes D6 and the button half of D11). "Show all bookings" is the one way on to All bookings. `all-bookings.js` keeps reading `?status=` (harmless, still works from a URL). | Klaudiusz at review: no second button. |
| D15 | **Fix:** the day groups are placed before the account's own `[data-action="show-all-bookings"]` button. Since 72 they were placed before the first `.show-all-btn`, which became the hidden "Show all pending" inside the collapsed panel, so no executed booking showed on main. | Regression found at review; the first validation never looked below the pending row. |

## Context

- The row today: two `bookings-card__pending` blocks plus a `data-pending-divider` in `account-details.html` (about lines 1771 and 1791); CSS at `css/styles.css` about 1977 and the icon rules at 4654 and 4714.
- `renderAccountBookings` (`js/data-render.js` about line 132) hides the line when `pendingTotal` is 0 and writes `Math.abs(total)`.
- `.expander` (`css/styles.css` about 1455) is a `<button>` with a leading icon, title and subtitle and a trailing chevron; it has no trailing slot, no panel and no `aria-controls`. The Payment details instance wires its panel in JS only.
- All bookings' Pending panel is drawn by `renderInstances` and `renderBookings` (`js/all-bookings.js` about 686 to 735): date groups "Execute on <date>" with rows.
- The roadmap item's findings on the total (Household's built-in pending items alone sum to 1'654.80; the rest comes from payments made in the app and standing orders) still hold: the total adds every pending item, not only the 3 shown, so a "total of N rows" must not be implied.

## Open questions

- **Order inside the panel:** the roadmap says the nearest date sits just above the "now" line and later ones further up (a newest-first list). D2 chooses which 3 are shown (nearest); the panel then draws them in the list's own direction. Confirm at review whether to draw the panel top-down in tab order instead.
- **The total beside 3 rows:** the total covers every pending item, so it can be larger than the 3 rows beside it. Say if the total should instead show only the shown rows' sum (not recommended: it would stop matching the Pending tab).
