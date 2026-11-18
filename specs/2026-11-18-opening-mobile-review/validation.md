# Opening review after the phone test (78): validation

## Build gate

- [ ] `npm run build` in `apps/web` succeeds

## Purpose and amount (D1, D2)

- [ ] Purpose and horizon are single columns at 390 and on desktop; the step scrolls if needed, with Next still reachable
- [ ] "Buy a home" still limits the horizon and shows its note
- [ ] Amount: "Minimum CHF 5'000." is visible on first arrival, with and without the fridge's suggestion
- [ ] Typing 4'000 and tapping Next shows "The minimum is CHF 5'000." under the field; 5'000 passes

## Risk (D3, D4)

- [ ] No chart on the step; the three questions are all open at all times, in francs
- [ ] The chosen answer of each question is marked; changing one does not fold anything
- [ ] Keyboard: arrows move within a question, Tab reaches the next one; after a click focus moves to the next unanswered one, then to Next
- [ ] Next with a question unanswered shows the message under the first unanswered one
- [ ] The helper's risk question and chips make sense without the chart

## Strategy (D6, D7, D8)

- [ ] On arrival nothing is chosen and there is no primary button; Help? alone keeps its own width, left-aligned, at 390 (D10)
- [ ] All five cards have "Choose this strategy"; none dimmed; "Above your risk profile" tag only as information
- [ ] Choosing shows "Continue with {name}"; choosing Dynamic works through to the summary and completion
- [ ] Changing risk answers after choosing leaves the chosen strategy; the summary says when the recommendation moved
- [ ] The helper no longer says a riskier strategy cannot be chosen

## Summary (D5)

- [ ] Strategy, Amount and Your answers each show a pencil-only button; each walks its screens and returns with "Back to summary"
- [ ] Name for screen readers is "Edit Strategy" and so on; focus ring visible; Light and Dark

## Across the flow

- [ ] First visit (nothing in `sessionStorage`), and a resumed draft from before this change (a draft at the risk step or with a chosen strategy still opens)
- [ ] Light, Dark and a Multi-color theme; desktop (sheet) and 390
- [ ] Reduced motion on: nothing moves that should be still

## Baseline smoke test

(Copy the checklist from `specs/baseline/validation.md` here when running it.)

Checked on: not yet run.
