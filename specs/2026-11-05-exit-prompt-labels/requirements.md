Branch: `feature/exit-prompt-labels`

# Every exit prompt names its own task (30): requirements

Roadmap item 30 (`specs/roadmap.md`). Closing Buy or Sell asks "Discard order?", but its stay button reads "Continue payment": `promptExit` in `js/trade-flow-overlay.js` sets the title, message and Discard label, not `stayLabel`, so the shared dialog's default shows. Reading the other callers of `UZBankPaymentExitPrompt` found the same gap in two more prompts: the internal transfer's "Discard transfer?" and Pay's "Discard changes?" while editing a booking.

## Scope

**In:**

1. Buy and Sell's "Discard order?" stays with "Continue order" (D1)
2. The internal transfer's "Discard transfer?" stays with "Continue transfer" (D1)
3. Pay's edit-mode "Discard changes?" stays with "Continue editing" (D1)
4. The shared dialog's defaults become neutral, and Pay's new-payment prompt passes its own words (D2, D3)

**Out (not in this branch):**

- Escape on these prompts: it does nothing unless a caller opts in (only the fridge does, `escapeStays`). Unchanged (D5)
- The dialog's look, motion and focus handling
- `js/app.js` and `spa-source.html` (they call the prompt too, but neither is the runtime)
- Other open roadmap items (31 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Each stay button names the task** (interview), matching its title: "Continue order" (Buy and Sell, one prompt in `trade-flow-overlay.js`), "Continue transfer" (`iat-overlay.js`), "Continue editing" (Pay's edit mode, `promptExitFlow` in `payment-overlay.js`). New Pay keeps "Continue payment" | Interview. The button says what the customer goes back to |
| D2 | **Neutral defaults in the shared dialog** (interview), `js/payment-exit-confirm.js`, in both the markup and `prompt()`: title "Discard changes?", message "If you leave now, your entries will not be saved.", stay "Keep going", leave "Discard". A caller that forgets a label can no longer show another task's words | Interview. The Pay wording as the default is how this bug happened. "Keep going" is what the fridge and the Playground already say |
| D3 | **Pay's new payment passes its words explicitly**: "Discard payment?", "You have not finished this payment. If you exit now your entries will not be submitted.", "Continue payment", "Discard", the same text it shows today | With the neutral default, Pay must not change by accident |
| D4 | **Callers that already set their labels stay as they are**: the fridge ("Leave" / "Keep going"), the Playground ("Keep playing"), Profile's reset ("Cancel" / "Reset") | Already right |
| D5 | **Escape unchanged:** Pay, the transfer and the trade ignore Escape in the prompt (no `escapeStays`), as today | Not part of this item; changing it would change three flows' keyboard behaviour |
| D6 | **No motion, layout or token change.** Longer labels ("Continue transfer", "Continue editing") sit in the same block buttons | Nothing new to animate or style |
| D7 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser with every prompt opened (Pay new and edit, the transfer, Buy, Sell, the fridge, the Playground, the reset) in Light and Dark, desktop and 390, by keyboard; the baseline smoke test | Standard gate |

## Context

- The shared dialog: `apps/web/js/payment-exit-confirm.js`. The markup's defaults are at lines 77 to 86, `prompt(exitFn, opts)` at 122 (title 127, message 129, leave 131, stay 133). Loaded on Overview, Payments, Account details, the position page, Profile and the Playground.
- Callers: `js/trade-flow-overlay.js:470` (`promptExit`, Buy and Sell), `js/iat-overlay.js:507` (`promptExit`), `js/payment-overlay.js:1061` (`promptExitFlow`: edit mode passes title, message and leave; new payment passes nothing), `js/fridge-advisor-sheet.js:172`, `js/playground.js:456`, `js/app-mp.js:464` (reset).
- The Components page doesn't document this dialog, so no design-system page changes.

## Open questions

None.
