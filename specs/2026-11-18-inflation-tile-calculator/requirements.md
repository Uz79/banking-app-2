# Overview tile: an investment return calculator in "Cash loses value" (82): requirements

Branch: `feature/inflation-tile-calculator`

Roadmap item 82, from Klaudiusz, 2026-11-18, a follow-up to 79. The "Cash loses value" tile (`js/inflation-tile.js`) gets an expander with three sliders. Open, the good, expected and unfavourable investment curves for the slider values are drawn into the tile's one chart, next to the cash line, so the customer sees cash losing value against what investing could do. It closes item 81 (the unused risk chart) by taking over what is worth keeping from it. The numbers are placeholders and the tile says it is an example, not advice.

Reference: the bank's calculator, `calculator.png` in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261028_product-opening/scenario` (sliders for years, amount and strategy, each with its value in a field; Good, Expected, Unfavourable with CHF and percent; a short disclaimer).

## Scope

**In:**

1. **The expander** inside the tile, below the existing note and above the link, closed by default. The design system's `.expander` button pattern, no new component.
2. **Three sliders** inside it: duration in years (1 to 30), amount in CHF (5'000 to 500'000, step 5'000), strategy (the five of `STRATEGIES`, safe to risky). Native `input type="range"` in the fridge's style, each with its value in a field.
3. **One chart.** Closed, the tile is as today. Open, the chart draws the cash line and the three investment curves for the slider values, on the same axes, with a legend and the end values as text.
4. **Copy:** the note ("An example, not a forecast") and the reference's short disclaimer in plain English.
5. **Cleanup (item 81):** delete `js/opening-risk-chart.js`, the `.opening-chart*` rules and `RISK_CHART`; keep what the opening still needs.
6. **Docs:** roadmap (82 and 81 done), tech-spec, CHANGELOG.

**Out (one-line pointers, not this branch):**

- Carrying the slider values into the fridge advisor or the opening.
- Showing the calculator when idle cash is under CHF 1'000.
- Any real return, inflation or advice; custom analytics events or a route for the expander.
- A new slider component from the 260617 token export (roadmap 73).
- The unrelated `.show-all-btn` comment-in-selector CSS found during 80 (not yet on the roadmap).

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One chart, nothing replaced, no second chart.** The inflation curve (what the money buys, falling) and today's amount as the flat dashed line are the baseline and stay. The investment curves are drawn into the same SVG on the same axes. | Klaudiusz's answer. The point is cash against investing in one picture. |
| D2 | **Closed, the tile is exactly as in 79:** the customer's idle cash, 10 years, the loss band. Open, the cash line is for the slider's amount and duration, not idle cash, so the comparison is like for like. The sentence and the Today and "In N years" figures follow the sliders while it is open and go back to idle cash when it closes. | A cash line for CHF 12'000 beside curves for CHF 50'000 would mislead. The tile's text must say what the picture shows. |
| D3 | **The sliders start from the customer's own numbers:** amount is idle cash rounded to the nearest 5'000 and kept within 5'000 to 500'000 (so a customer with CHF 1'000 to 2'499 starts at 5'000), duration 10 years, strategy Balanced. They start from these each time the tile is opened or the page loads; nothing is stored. | Klaudiusz's answer. Closed by default and not persisted, so no new storage key. |
| D4 | **The slider fields:** duration and amount have a text field (numeric keypad on a phone, `inputmode="numeric"`, apostrophe grouping like the fridge's field). A value typed is clamped to the range and the amount rounded to 5'000 on Enter or blur; while typing nothing is forced. Strategy has no field to type in: its field is read-only text showing the name ("Balanced"), and the slider's `aria-valuetext` is the name. Under each slider the end labels: 1 and 30, 5'000 and 500'000, "safe" and "risky". | The reference shows a value field for each. A free-text strategy makes no sense, so it is output only. Labels never wrap (the app's one-line rule: an ellipsis if too long). |
| D5 | **The slider is a native range** with the fridge's `cc-color-slider` styling and tokens. | Keyboard (arrows, Home, End, Page keys) and screen reader values come free. The fridge already uses it, so no new component. Checked against the 260617 export later (roadmap 73). |
| D6 | **The maths is the old chart's:** a curve is `amount × exp(r × t + k × z × s × √t)`, k 0 for expected, +1 for good, -1 for unfavourable, z 1.96, so 19 in 20 outcomes fall between good and unfavourable. Each strategy has a placeholder `r` and `s`, flagged in the file as placeholders for the bank's numbers. Balanced keeps the old 0.04 and 0.08. First values: Income 0.015 and 0.03, Conservative 0.027 and 0.055, Balanced 0.04 and 0.08, Growth 0.052 and 0.11, Dynamic 0.062 and 0.14. | One model already reviewed in 9e. Values rise with the strategy's risk and return out of five (`STRATEGIES`). They are examples and must be flagged as such. |
| D7 | **The investment curves are before inflation; the cash line is after.** The legend and a short note say so ("Investment values are before inflation."). This is the comparison Klaudiusz asked for, and it favours investing; the honest alternative, deflating the curves too, is a one-line change in the config. | The reference does the same. Flagged for review: it is the decision most worth a second look. |
| D8 | **The axes do not jump.** The chart is drawn as a percent of the amount (100 at the start), so the amount slider changes the figures but not the picture. The x axis is the duration (0 to N years) for all curves. The y range is the unfavourable line's lowest point and the good line's end (and the cash line's end), snapped outward to a multiple of 25 percentage points. A change redraws at once: stepped, no animation, so there is nothing for reduced motion to switch off. | A y range that follows every pixel of a drag jitters. Snapping gives stable steps. Not animating satisfies "reduced motion respected". |
| D9 | **Never colour alone.** Each line has its own dash pattern and a legend entry that shows the same pattern: cash after inflation (solid, thin), today's amount (dashed, as in 79), good (long dashes), expected (solid, heavy), unfavourable (dotted). The expected line is the only heavy one. Colours only through `--color-*` tokens. The band between good and unfavourable replaces the loss band while open. | The app's chart rules (9e D1 to D4). The old chart did the same with unfavourable dashed. |
| D10 | **The numbers are text too.** Open, a list gives the four end values in CHF with the change against the amount ("Good CHF 23'500 +52%", "Expected", "Unfavourable", "Cash after inflation") in the same order as the legend; the SVG is `aria-hidden`. The sliders announce their own values. A visually hidden polite live region says the result once a slider is released (the `change` event), not on every `input`. | Same rule as 79 and 9e: the picture is decoration. A live region on every drag step would be chatty. |
| D11 | **The expander** is the design system's `.expander` (a button, `aria-expanded`, `aria-controls`, the chevron) with the title "Compare with investing". Content is hidden with `hidden` when closed. Closed on every load; not stored. | Reuse, as asked. No state to persist. |
| D12 | **The copy** (English, no em dashes): note "An example, not a forecast." (kept); disclaimer "Possible outcomes for this strategy, based on example figures. 19 in 20 outcomes end between Good and Unfavourable. Real returns vary and you can lose money." and "Investment values are before inflation." Labels: "Investment duration in years", "Amount in CHF", "Strategy". | The reference's disclaimer, shortened. Plain, no promise. |
| D13 | **"See how much to invest" is unchanged** and leaves the slider values behind. | Klaudiusz's answer. The fridge works out its own suggested amount. |
| D14 | **The tile still hides below CHF 1'000 of idle cash,** the expander with it. | Klaudiusz's answer. |
| D15 | **The tile's script becomes an ES module** (`<script type="module">`), so it imports `AMOUNT` and `STRATEGIES` and the new `CALCULATOR` config from `js/investment-opening-config.js` (names, the 5'000 minimum, and `r` and `s` in one place). The old chart's drawing and maths are ported into it. | A classic script cannot import the config. Overview already loads a module script, and Vite bundles it. Avoids copying the strategy names. |
| D16 | **Item 81 is closed here.** `RISK_CHART` goes except `exampleAmount` (CHF 10'000, still the opening's fallback for the assistant's `{amount}`), which moves to `AMOUNT.exampleAmount`, same value, no visible change. `js/opening-risk-chart.js` and the `.opening-chart*` rules (including the Legibility Large rule) are deleted. Dated spec folders and the CHANGELOG keep their mentions as the record; `tech-spec.md` is updated. | Item 81 said these are unused; the check found `exampleAmount` is not. Moving it keeps the opening untouched. |
| D17 | **Analytics:** nothing new. The expander and sliders stay on Overview, so no screen or route; no custom events. | The same reasoning as item 80, no new measurement asked. |
| D18 | **Phone and Legibility Large:** at 390px the tile is the full column; the slider fields stack under their labels, the results list is one row per line (name, amount, change), the chart is taller (10rem) than closed (6rem) and the legend wraps by row, not inside a label. At Legibility Large the results go to rows as in 9e D7. | Matches the fridge's phone rules and the old chart's Large rule. |
| D19 | **No new storage key and no analytics change.** | D3 and D17. |

## Context

- `js/inflation-tile.js` (classic IIFE, 79) draws the cash line from `amount / (1 + rate)^t` into `[data-inflation-plot]` with a `ResizeObserver`, and re-renders on `uzbank:state-changed`. The tile is `section-card--overview-inflation` in `overview.html` (about line 1918), CSS `.inflation-tile*` near `styles.css` 9572.
- `js/opening-risk-chart.js` (123 lines) is an ES module: three curves, the band, an end value list, "How is this worked out?". `.opening-chart*` is about 250 lines of CSS near 12877.
- `RISK_CHART.exampleAmount` is read by `js/investment-opening.js` lines 173 and 741; nothing else imports `RISK_CHART` or `riskChart`.
- The fridge's slider: `js/fridge-advisor.js` about line 219, `type="range"` with `cc-color-slider` and a `fridge__num` text field.
- `.expander` is at `styles.css` about 1462 (used in `all-bookings-and-payments.html`).
- Old chart numbers: balanced, CHF 10'000, 10 years: 24'500, 14'900 and 9'100 before rounding.

## Open questions

- Whether the 390px tile, with the sliders open, needs the sliders and the chart in a different order (chart above or below). Decided at build by looking at it.
