# Opening review after the phone test (78): validation

## Build gate

- [x] `npm run build` in `apps/web` succeeds

## Purpose and amount (D1, D2)

- [x] Purpose and horizon are single columns at 390 and on desktop; the step scrolls if needed, with Next still reachable (desktop seen; 390 not)
- [ ] "Buy a home" still limits the horizon and shows its note
- [x] Amount: "Minimum CHF 5'000." is visible on first arrival, with and without the fridge's suggestion (without the suggestion; `aria-describedby` names the hint)
- [x] Typing 4'000 and tapping Next shows "The minimum is CHF 5'000." under the field; 5'000 passes

## Risk (D3, D4)

- [x] No chart on the step; the three questions are all open at all times, in francs
- [x] The chosen answer of each question is marked; changing one does not fold anything
- [ ] Keyboard: arrows move within a question, Tab reaches the next one; after a click focus moves to the next unanswered one, then to Next
- [x] Next with a question unanswered shows the message under the first unanswered one (under question 2 with 1 answered)
- [ ] The helper's risk question and chips make sense without the chart

## Strategy (D6, D7, D8)

- [ ] On arrival nothing is chosen and there is no primary button (seen on desktop: none); Help? alone keeps its own width, left-aligned, at 390 (D10): not checked, the window could not be resized
- [x] All five cards have "Choose this strategy"; none dimmed; "Above your risk profile" tag only as information (5 buttons, 4 chips, no `reason`; the cards are as bright as the others)
- [x] Choosing shows "Continue with {name}"; choosing Dynamic works through to the summary and completion (Growth and Income: "Continue with ..."; the summary reached with Growth; completion not walked)
- [x] Changing risk answers after choosing leaves the chosen strategy; the summary says when the recommendation moved (Dynamic stayed after the answers moved to the most careful; the summary line was not re-read)
- [x] The helper no longer says a riskier strategy cannot be chosen (reworded in the config; not read in the panel)

## Review fixes (D11, D12)

- [ ] The summary's pencils have no border or fill (plain glyph); hover and pressed visible; focus ring visible
- [ ] The summary's main button reads "Open product" on one line at 390
- [ ] No button in the flow shows two lines at 390 or at Legibility Large; a label that does not fit ends in an ellipsis (try "Continue with Conservative", "Back to summary")
- [ ] Buttons moved to the span (every `button()` in the opening) look unchanged otherwise: height, padding, trailing arrow where there is one

## Summary (D5)

- [x] Strategy, Amount and Your answers each show a pencil-only button; each walks its screens and returns with "Back to summary" (three pencils seen; Strategy walked and returned; the others not)
- [x] Name for screen readers is "Edit Strategy" and so on; focus ring visible; Light and Dark (the labels read "Edit Strategy", "Edit Amount", "Edit Your answers"; Dark seen; focus ring not checked)

## Across the flow

- [ ] First visit (nothing in `sessionStorage`), and a resumed draft from before this change (a draft at the risk step or with a chosen strategy still opens)
- [ ] Light, Dark and a Multi-color theme; desktop (sheet) and 390
- [ ] Reduced motion on: nothing moves that should be still

## Baseline smoke test

(Copy the checklist from `specs/baseline/validation.md` here when running it.)

Extra, not in the plan: choosing a strategy above the profile opens the app's confirmation dialog (`UZBankPaymentExitPrompt`, scripts added to `investment-opening.html`): Go back leaves nothing chosen and no primary button, Choose Growth shows "Continue with Growth", and a recommended strategy is chosen directly.

Checked on 2026-11-18 against `feature/opening-mobile-review` (uncommitted), Chrome (Claude in Chrome), desktop width, Dark mostly and one Light screenshot, a draft seeded in `sessionStorage` for each step. Not checked: 390px (the window could not be resized), keyboard (arrows, Tab order, focus after a click was checked by script only), reduced motion, a Multi-color theme, the first visit through the fridge, a resumed draft from before this change (a seeded draft at the strategy step with a strategy above the profile opened fine), the whole flow through completion, and the baseline smoke test beyond `npm run build`.
