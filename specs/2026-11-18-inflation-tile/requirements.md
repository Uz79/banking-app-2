# Dashboard tile: what inflation does to idle money (79): requirements

Branch: `feature/inflation-tile`

Roadmap item 79, from Klaudiusz, 2026-11-18, out of 78. The forecast chart left the opening's risk step (78 D4). This item adds an educational tile to Overview's third column that shows how money left on an account loses value to inflation, as a nudge to invest. It does not give advice: the rate is a placeholder and the tile says it is an example.

## Scope

**In:**

1. **The tile:** a new section card on Overview, in the third column under Offers, with a one-line chart of what today's idle cash buys over the years, a plain sentence, and a link.
2. **The amount:** the customer's idle cash, read from the demo data (Household plus Savings), and kept in step when the demo data changes.
3. **The link:** into the fridge advisor sheet, the same sheet the Offers "Investment" item opens.
4. **Layout:** the tile follows Offers at three columns, at two, and where the column stacks on a phone.
5. **Docs:** tech-spec, changelog.

**Out (one-line pointers, not this branch):**

- The unused `js/opening-risk-chart.js`, `RISK_CHART` in `js/investment-opening-config.js` and the `.opening-chart*` rules in `css/styles.css`: left as they are; removing them is roadmap item 81.
- Any other page (Payments, Account details, Profile); a tile on the phone's tab bar.
- A real inflation rate or any advice; custom analytics events.
- Showing the tile only to some customers (for example by persona).

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The picture is a new cash-against-inflation line.** One falling line: what the idle amount buys, year by year, over the horizon. A flat dashed line marks today's amount for comparison. The old risk chart is not used. | Chosen in the interview. The old chart shows what investing might do, not what idle cash loses. |
| D2 | **Placeholders, flagged in the file:** inflation 2% a year, horizon 10 years. The tile's footnote says "An example at 2% a year, not a forecast." Buying power after `t` years = amount / (1 + rate)^t. | The bank's numbers are not known; the numbers must not look like advice. |
| D3 | **The amount is idle cash from the demo data:** the Household and Savings running balances (`UZBankPayState`, the same ones Overview's totals use), not Custody, Retirement or mandates. The tile re-reads it when the payment state changes. Shown in whole francs, buying power rounded to CHF 100. With less than CHF 1'000 idle the tile is hidden (nothing to lose). | Chosen in the interview. "Idle" means money that is not already invested or tied up. |
| D4 | **The picture is inline SVG, no library, no animation.** Drawn at its real size (as the old chart was), colours only through `--color-*` tokens, `aria-hidden`: the sentence and the end value say everything it shows. No motion, so no reduced-motion path is needed. | Standing rules. A static chart is enough to make the point. |
| D5 | **Placement:** a new `.section-card.section-card--overview-inflation` in `overview.html`'s aside, after Offers. At three columns it sits in column 3 under Offers (the aside is flattened into the page grid there, so it gets its own grid row); at two columns and on a phone it follows Offers in the stack. Overview only. | Chosen in the interview. |
| D6 | **It leads to the fridge sheet.** The tile's link is an `<a href="fridge-advisor.html">`, like the Offers item; `js/fridge-advisor-sheet.js` binds both openers, so the sheet opens (and resumes a draft, 9a D19) the same way. Without the sheet script it is a plain link to the page. | Chosen in the interview: the first step of the nudge is "how much should I invest?". |
| D7 | **Copy (placeholders, English, short, no em dashes):** title "Cash loses value"; sentence "Left on an account, your CHF 35'000 buys what CHF 28'700 buys today in 10 years."; link "See how much to invest" (one line, an ellipsis if too long); footnote above. | Open to review at the spec. |
| D8 | **Accessibility:** the card has a heading, the figures are text, the link is a real link with a visible focus ring (`--color-fg-interactive`); the chart is decoration. Type sizes come from the `--fs-*` tokens, so Legibility presets scale it. | AGENTS.md conventions. |
| D9 | **No new storage key, page or dependency.** | Nothing needs remembering. |
| D10 | **The branch is committed per task group once implementation starts; no merge or push without an explicit ask.** | AGENTS.md. |

## Context

- Overview's third column is `aside.view__sidebar`. From `min-width: calc(1200px + 16rem)` with a container of 1200px it is `display: contents` and its children are grid items of the page grid (`overview.html`, `css/styles.css` near `.section-card--overview-offers`, grid rows 2 and 3 when the status slot is shown). A new card needs its own row there.
- Balances: `UZBankPayState.getState()` carries the running balances (`running.household`, `running.savings`, `js/payment-state.js` around line 380); `js/data-render.js` redraws Overview's figures on change.
- The Offers item opens the fridge as a sheet through `js/fridge-advisor-sheet.js` (`opener = a.list-item[href="fridge-advisor.html"]`, single element today).
- The old chart (`js/opening-risk-chart.js`, 123 lines) draws three lines from a risk model; its drawing approach (a ResizeObserver, `viewBox` = the real size) is the pattern for this one.

## Open questions

- Whether CHF 1'000 is the right floor for hiding the tile: settle by looking at the demo's balances (Household CHF 10'000 and Savings CHF 25'000 at the start).
- Whether the tile also wants the old "How is this worked out?" toggle: start without; the footnote carries it.
