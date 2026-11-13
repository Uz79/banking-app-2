Branch: `feature/escape-closes-banking-sheets`

# Banking sheets close on Escape (49): requirements

Roadmap item 49 (`specs/roadmap.md`): Pay, the internal transfer, Buy and Sell, and a booking's sheet ignore Escape; only their close button closes them. The fridge, the opening and the Playground close on Escape (`js/fridge-advisor-sheet.js` 197, `js/investment-opening.js` 1243, `js/playground-sheet.js` 74). Escape on a banking sheet should do what the sheet's close button does.

## Scope

**In:**

1. Escape on Pay, the transfer, Buy and Sell, and a booking's sheet does what their close button does (D1, D2)
2. What Escape does while something is open over a sheet: a picker, the calendar, a Discard or Delete prompt, the confirmation after Execute (D3, D4)
3. Focus after the close (D5)

**Out (not in this branch):**

- Sheets other than the five named in the item, and the form sheet's pickers and calendar (native dialogs that already close on Escape, `js/form-field-sheet.js` 139)
- The fridge, the opening and the Playground (already close on Escape)
- Closing on a tap outside a sheet (Pay says "do not close on scrim tap", `js/payment-overlay.js`)
- Other roadmap items

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Escape is the close button.** On Pay, the transfer, and Buy and Sell, Escape runs the same code as the X: Pay's `promptExitFlow` ("Discard payment?" or, when editing, "Discard changes?"), the transfer's `promptExit` ("Discard transfer?"), the trade flow's `promptExit` ("Discard order?"). Pay's recipient search, where the X closes at once because nothing is chosen, closes at once on Escape too. No new copy | Interview. One rule; the prompts already exist |
| D2 | **The booking sheet closes at once** on Escape, as its X does (`payment-details.js` 936). No prompt | Interview. Its X asks nothing |
| D3 | **Topmost layer only.** One Escape closes only the top layer. A picker or the calendar closes (native dialog, already so) and the sheet stays. A Discard prompt is a layer: Escape on it means keep going ("Continue payment", "Continue transfer", "Continue order", "Continue editing"), so a second Escape asks again. The sheet's own handler ignores an Escape that arrives while a `dialog[open]` exists, as the fridge's does (`fridge-advisor-sheet.js` 197) | Interview (Recommended option). Matches the Delete prompt, which already has `escapeStays: true` |
| D4 | **The confirmation after Execute:** Escape means Done (the same as its button), because the payment is already made and Done is the only exit | Interview |
| D5 | **Focus after the close** is whatever the X's close does today (the existing `UZBankSheetFocus` hand-on: the opening button or the row), so Escape and the X end in the same place | Roadmap item. Nothing new to build |
| D6 | **One shared path.** The key handler lives where each sheet's close function lives; a small shared helper is added only if three sheets would otherwise repeat the same guard (`defaultPrevented`, an open `dialog`, the sheet being active, not closing). `UZBankPaymentExitPrompt` gets `escapeStays: true` from the Discard prompts, as the Delete prompt has | Small diffs (AGENTS.md); one guard, written once |
| D7 | **No new storage, no new colours, no motion.** Reduced motion needs nothing beyond the existing close animation, which already has its reduced-motion path | Standing rules |
| D8 | **The merge gate** (interview): `npm run build`; this `validation.md` in a real browser (Light and Dark, 390px, keyboard, reduced motion, the last one checked by Klaudiusz on 5175 with the macOS setting); the baseline smoke test | Standard gate |

## Context

- Pay: `js/payment-overlay.js`: `promptExitFlow` (about 1255), the close button's handler (1288), Done (1306). Pay does not close on a scrim tap.
- Transfer: `js/iat-overlay.js`: `promptExit` (597), the close button (617), `closeOverlay` (544).
- Buy and Sell: `js/trade-flow-overlay.js`: `promptExit` (570), `closeOverlay` (549), the close button (637). One overlay serves both sides.
- Booking sheet: `js/payment-details.js`: `closeOverlay` (842), the close and confirm buttons (936), the Delete prompt with `escapeStays` (994).
- The Discard dialog: `js/payment-exit-confirm.js`: `prompt(exitFn, opts)`; its `cancel` handler (104) prevents the default and only acts when `escapeStays` is set.
- The pickers and the calendar: `js/form-field-sheet.js`, native `<dialog>` with a `cancel` handler (139) that closes after its animation.
- Item 41 made the confirmation dialogs modal; item 35 (reduced motion on closing) and 33 (the focus hand-on) are done.

## Open questions

- Is the confirmation after Execute a native `<dialog>`, or an overlay that the sheet's handler has to recognise by class? (Read it in group 1; D4 needs the answer.)
- Does the keyboard reach the sheet at all when focus sits on `body` after a click on the scrim? (The Playground handles it on `document`.)
