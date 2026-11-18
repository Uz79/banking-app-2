Branch: `feature/opening-mobile-review`

# Opening review after the phone test (78): requirements

Roadmap item 78 (`specs/roadmap.md`), from Klaudiusz's review of the product opening on a phone, 2026-11-18. Six changes to the steps of "Open asset management" (`js/investment-opening.js`, `js/investment-opening-config.js`), and one idea that leaves the flow (the forecast chart, 79).

## Scope

**In:**

1. Purpose and horizon: one column instead of two (D1)
2. Amount: the minimum shown under the field (D2)
3. Risk: the three questions stay open, no Change buttons, and the forecast chart leaves the step (D3, D4)
4. Strategy: all five strategies can be chosen, and the primary button waits for a choice (D6, D7)
5. Summary: the section Edit buttons become glyph-only pencil buttons (D5)
6. The assistant's copy that no longer matches (D8)

**Out (not in this branch):**

- The dashboard tile that explains what inflation does to idle money, which takes over the chart's job (79, D4)
- The scoring, the bands, the caps and the three risk questions' wording and scores (9a D12, 9e D6 to D9)
- The other steps' two-column groups (Sustainability, Tax status), the carousel's look, the vehicles
- Any change to the step count: it stays at 10

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Purpose and horizon are one column each.** The `opening-options--grid` class comes off both groups in `BUILD.purpose`; the step scrolls on a phone if it must. The rule stays in CSS, as other steps use it | Review: a single list reads better than two columns, even if it scrolls. This overrides 9a D27 ("fits the sheet without scrolling") for this step only |
| D2 | **The minimum is always visible under the amount field**, as a field note: "Minimum CHF 5'000." (`AMOUNT.min` is 5000; new `AMOUNT.hint` with `{min}`). It is part of the input's `aria-describedby`. The existing `belowMin` message ("The minimum is CHF 5'000.") still appears on Next when the amount is under it | The minimum was only said after a failed Next. The field's helper text is where the form anatomy puts it (`2026-11-08-field-anatomy-and-band-ink`) |
| D3 | **The three risk questions stay open.** No question folds into a line, so the `open` state, `opening-question__done`, `data-state` and the three Change buttons go. Each question shows all its options with the chosen one marked. Choosing by click, Space or Enter still moves focus to the next unanswered question, or to Next when all are answered | Review: the customer wants the overview of what they chose, and a folded line hides it. With nothing folded, Change has nothing to do. Reverses 9e D10 and D16 |
| D4 | **The forecast chart leaves the risk step.** `BUILD.risk` no longer builds it, the questions' `part` highlight goes, and the "How is this worked out?" look-up no longer exists on the step, so the risk step's hesitation signals become `['switch']` only. `js/opening-risk-chart.js`, `RISK_CHART` and the `.opening-chart*` CSS stay in the repo, unused, for the tile (79). The questions keep their francs wording, from `ownAmount()` | Review: the chart's job is to show that money left on an account loses value to inflation, which is a different message from risk and crowds the step. The customer prefers it as an educational tile outside the flow, which nudges people to invest (79). Until 79 is built the opening has no forecast anywhere; that gap is accepted |
| D5 | **Summary Edit buttons are glyph-only.** `uz-btn uz-btn--sm uz-btn--icon-only-secondary` with the pencil glyph (`#i-edit-2`, the one Account details uses), `aria-label` "Edit {section}", still described by the section title. `SUMMARY.edit` stays as the label's source | The app's pattern for edit actions is the pencil glyph, not a text button. The Change buttons on the risk step, which the review also named, are gone under D3 |
| D6 | **All five strategies can be chosen.** Cards above the recommendation no longer dim, lose their Choose button or show "Riskier than your answers allow." (`STRATEGY.reason`); each has "Choose this strategy". Each one above the recommendation carries "Above your risk profile" as the small chip with a strong warning or error ink (existing chip tokens; a variant only if none fits), and choosing one opens a confirmation dialog in the style of the app's other confirmations (`2026-11-05-confirmation-dialogs`) that names the strategy and says it is riskier than the answers suggest, with a confirm and a cancel; cancel leaves the choice as it was (O1 settled). `reconcile()` and the "Your answers changed, so we now recommend {name}." note go: a chosen strategy stays chosen when answers change, and the summary's "Your changes moved the recommendation" line still tells the customer | Review: nothing is shown disabled, and every strategy is electable. Keeping the tag keeps the customer informed without blocking them |
| D10 | **Help? keeps its look** (the tonal pill as today). On the strategy step, while the primary button is hidden (D7), Help? keeps its own width and sits at the left of the action row; it does not stretch | Review, 2026-11-18, replacing an earlier idea of a round primary button. A lone button should not become a full-width bar |
| D7 | **The strategy step shows no primary button until a strategy is chosen.** Nothing is chosen on arrival (unchanged, 9d D16). Until then the action row holds only Help?; once chosen, the button reads "Continue with {name}" as today. `STRATEGY.missing` and the step's `missing` and `need` go, as they cannot be reached | Review: the app does not show a disabled call to action, and a button that only says "choose first" on tap is the same thing. Other steps keep an always-visible Next (phone polish D4, D5) |
| D8 | **The assistant's text is brought in line.** `opening-assistant-config.js` lines that say a riskier strategy "cannot be chosen online" and that an advisor must go through it (about 163 to 164) are reworded to match D6; the risk step's helper question and chips that point at the chart are checked and reworded | Left as is, the helper would contradict the screen |
| D9 | **Process:** this spec and the branch name only; the agent does not create the branch or commit (Klaudiusz's git preference, AGENTS.md "Git"). No new dependency, storage key or page | Matches AGENTS.md |

## Context

- `BUILD.purpose` adds `opening-options--grid` to both groups (`js/investment-opening.js` about 667); `BUILD.amount` builds the field and its notes (about 690); `BUILD.risk` (about 740) holds the chart, the fold and the Change buttons; `strategyCarousel` (about 377) has the `above()` paths; `BUILD.summary` (about 946) builds the Edit buttons.
- `render()` already never disables Next, and shows the screen's message on a tap with something missing (phone polish D4, D5). D7 is the one screen that hides it instead.
- `SCORING.caps` still limit the recommendation for a short horizon or no knowledge. Since all strategies can now be chosen (D6), those caps only decide what is recommended.
- Reference: the review screenshots, in this project's `261028_product-opening` folder and the phone captures of 2026-11-18.

## Open questions

- **O1 (settled 2026-11-18).** Letting a customer choose a strategy above their risk profile is, in a real bank, a suitability (FinSA) matter, usually with a warning and a confirmation. For the prototype the tag is the only signal (D6). Is that enough, or should choosing one show a one-line confirmation?
- **O2 (settled 2026-11-18).** Help? keeps its width when alone (D10).
