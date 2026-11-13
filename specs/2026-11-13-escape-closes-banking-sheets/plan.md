# Banking sheets close on Escape (49): plan

Branch: `feature/escape-closes-banking-sheets`. Decisions are cited as D1 to D8 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; stop it when done).

## 1. The Discard prompt and the guard (D3, D4, D6)

- [ ] `apps/web/js/payment-overlay.js`, `iat-overlay.js`, `trade-flow-overlay.js`: pass `escapeStays: true` to their Discard prompts
- [ ] Read the confirmation after Execute (open question); decide the guard (`defaultPrevented`, `dialog[open]`, active, not closing) and where it lives
- [ ] Check: Escape on a Discard prompt keeps the flow; a second Escape asks again

## 2. Pay (D1, D3, D4, D5)

- [ ] `apps/web/js/payment-overlay.js`: a keydown for Escape runs the close button's path; recipient search closes at once; Escape on the confirmation is Done
- [ ] Check: Escape on each step asks "Discard payment?"; in an edit "Discard changes?"; with the calendar open it closes only the calendar; focus returns as the X does

## 3. The transfer (D1, D3, D4, D5)

- [ ] `apps/web/js/iat-overlay.js`: the same, with `promptExit`
- [ ] Check: as Pay, "Discard transfer?"; an immediate transfer's confirmation closes on Escape

## 4. Buy and Sell (D1, D3, D5)

- [ ] `apps/web/js/trade-flow-overlay.js`: the same, with `promptExit`
- [ ] Check: Escape on Buy and on Sell asks "Discard order?"; an account picker over it closes alone

## 5. The booking sheet (D2, D5)

- [ ] `apps/web/js/payment-details.js`: Escape closes it at once, ignored while the Delete prompt is open
- [ ] Check: Escape closes the sheet and focus lands on the row; with Delete's prompt open Escape keeps the payment

## 6. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [ ] `specs/roadmap.md`: 49 marked done and moved to Done
- [ ] `specs/tech-spec.md`: a Decisions row for Escape on sheets, if it lists sheet rules; check
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [ ] `apps/web/README.md`: no change expected (no storage keys); check
