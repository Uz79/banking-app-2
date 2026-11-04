# Profile: "Reset demo data" asks first and confirms without disabling (22): requirements

Branch: `feature/reset-demo-confirm`

Roadmap item 22 (`specs/roadmap.md`), found during 21. The design-system rule from 21 (`specs/tech-spec.md`, "Call-to-action buttons") says a call-to-action is never disabled. Profile's "Reset demo data" disables itself for 1.2 s while its label reads "Reset ✓". The reset also wipes everything at once with no way back, from one tap.

## Scope

**In:**

1. The button asks first, in the app's existing confirm dialog (D1, D2)
2. After a reset, a status line under the button says so; the button stays enabled and keeps its label (D3, D4, D5)
3. The section's subtitle says what the reset really clears (D6)

**Out (not in this branch):**

- A shared toast component (D3)
- What the reset clears (`UZBankPayState.reset()` is unchanged)
- Other open roadmap items (23 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Ask first** with the shared confirm dialog (`js/payment-exit-confirm.js`, `UZBankPaymentExitPrompt`): title "Reset demo data?", message "This clears your payments, trades and investments and restores the starting balances. You can't undo it.", buttons "Cancel" (secondary) and "Reset" (primary). The reset runs only on "Reset" | Interview. The reset wipes bookings, positions, mandates and the opening's draft and can't be undone; one stray tap during a demo would lose the lot. The dialog is the one the payment, transfer, trade and fridge flows already use, so no new component |
| D2 | **Escape and Cancel keep the data** (`escapeStays: true`). Focus returns to "Reset demo data" when the dialog closes (the native `<dialog>` behaviour) | Escape meaning "do nothing" is the safe reading for a destructive prompt; the keyboard user lands back where they were |
| D3 | **A status line, not a toast:** a `<p role="status">` under the button, empty until a reset, then "Demo data reset." with the check icon (`#i-check`) | Interview. The app has no shared toast (only the Playground's own); a line next to the button is where the eye already is and needs no new component |
| D4 | **The line stays** until the customer leaves the page. A second reset empties it and fills it again, so a screen reader announces it again | Nothing to time; a line that vanishes can be missed |
| D5 | **The button is never disabled** and keeps its label "Reset demo data". The 1.2 s timer and the label swap go | The rule from 21; the roadmap item |
| D6 | **The subtitle** becomes "Clear your payments, trades and investments, and restore the starting balances." | Interview. Today's copy names only bookings and Household; the reset also clears trades, the asset management mandates and the opening's draft, and restores every account |
| D7 | **Profile loads the dialog's two scripts** (`js/dialog-focus.js`, `js/payment-exit-confirm.js`) in the same order as Overview. The handler in `js/app-mp.js` stays delegated on `#demoResetBtn` | Profile doesn't load them today. Same scripts and order as every page that already prompts |
| D8 | **Styles** come from the existing `.demo-reset` block in `css/styles.css`: the line in `--color-fg-secondary` at `--fs-text-md`, the icon in `currentColor`; no animation, so no reduced-motion path is needed. The dialog keeps its own animation and reduced-motion path | Colours only through tokens; small diff |
| D9 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, desktop and 390, keyboard: the dialog's focus and Escape, the status line read from its live region); the baseline smoke test | Standard gate |

## Context

- `apps/web/js/app-mp.js` near line 441: the delegated click handler for `#demoResetBtn`. It calls `UZBankPayState.reset()`, swaps the label to "Reset ✓" and sets `disabled` for 1.2 s.
- `apps/web/profile.html` near line 2652: the `.demo-reset` section (title, subtitle, button). Scripts from line 2694; `dialog-focus.js` and `payment-exit-confirm.js` are absent.
- `apps/web/js/payment-exit-confirm.js`: `prompt(exitFn, { title, message, leaveLabel, stayLabel, onStay, escapeStays })`. The leave button is primary, the stay button secondary. Overview loads `dialog-focus.js` then `payment-exit-confirm.js` (overview.html near line 3133).
- `apps/web/js/payment-state.js` near line 664: `reset()` removes `uzBankWebPaymentState` and the opening's session draft, restores `defaultState()` and dispatches `uzbank:state-changed`.
- `apps/web/css/styles.css` near line 6054: `.demo-reset`, `.demo-reset__title`, `.demo-reset__subtitle`.

## Open questions

None.
