# The risk experience: plan

Branch: `feature/risk-experience`. Decisions are cited as D1 to D17 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), through Overview > Offers > Investment to the risk step, on desktop (a 677 sheet) and at 390 unless a check says otherwise.

## 1. The chart (D1 to D5, D13, D14)

What you see: the customer's amount over their horizon, three lines with their end values in CHF, and the footnote, above the three questions as they are today.

- [x] `js/investment-opening-config.js`: `RISK_CHART` (r, s, the years per horizon, the line labels, "Your {amount} over {n} years", the footnote)
- [x] `js/opening-risk-chart.js` (new): build the SVG from the amount, the years and the config; the end values as text; `highlight(part)` for the unfavourable line, the band or the expected line; the draw-in with its reduced-motion path
- [x] `js/investment-opening.js`: `risk()` puts the chart and its text above the questions
- [x] `css/styles.css`: `.opening-chart*` (sizes on desktop and phone, the lines, the band and the highlight through tokens)
- [x] Check: CHF 5'000, 10'000, 50'000 and 999'999 with each of the four horizons; Light, Dark and a Multi-color theme. Reduced motion only in the CSS (the system setting was not switched)

## 2. The scenarios (D6 to D10)

What you see: each question in the customer's francs, its part of the chart highlighted while it is open.

- [x] `js/investment-opening-config.js`: the three questions' new labels and option labels with `{placeholders}`; ids and scores untouched
- [x] `js/investment-opening.js`: fill the francs from the amount; the open question sets the chart's highlight; the folded line shows the new wording
- [x] Check: the same answers give the same recommendation as on `main` (every band, and a horizon and a knowledge cap); an old draft with risk answers resumes with them; Next with nothing answered shows "Answer all three questions." under the first open question; Change reopens a question and moves the highlight

## 3. Fit and the assistant (D11, D12)

What you see: the step without scrolling on both widths, and the assistant's new risk chips.

- [x] `css/styles.css`: the phone sizes tuned until the step fits at 390, and the footnote's toggle if it is needed (D11)
- [x] `js/opening-assistant-config.js`: the risk chips (D12); `js/investment-opening.js`: `after20` removed from `setValues` if unused
- [x] Check: desktop at a 677 sheet and 390 at 823, every question open in turn, nothing scrolls; the phone's assistant layer and the desktop column show the new chips

## 4. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line; VoiceOver and touch left for Klaudiusz on the preview (section 5 open)
- [x] Docs: `specs/roadmap.md` 9e marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the opening's description: the risk step's chart and its module; the Investment recommendation row unchanged); the intervention map's Risk row (`designs/conversation/investment-opening/intervention-map.md`)
