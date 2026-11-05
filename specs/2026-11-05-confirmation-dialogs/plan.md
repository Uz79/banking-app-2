# Confirmation dialogs: modal, one layout, plain words (41): plan

Branch: `feature/confirmation-dialogs`. Decisions are cited as D1 to D17 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The dialog keeps focus (D1, D2, D5, D6)

- [x] `apps/web/js/dialog-focus.js`: a shared helper that, when a confirmation opens, makes its sheet's `.modal-shell` inert and focuses Done; on close it lifts the inert (D1, D2)
- [x] `apps/web/js/payment-overlay.js`, `js/iat-overlay.js`, `js/trade-flow-overlay.js`: call it from each flow's show and hide (D1)
- [x] Check in each flow: after confirm, focus is on Done; Tab and Shift+Tab stay on Done; the sheet behind takes no click; Enter on Done closes both and focus goes back to the opener (D6)

## 2. No second confirm after the dialog (D4, D5)

- [x] `apps/web/js/payment-overlay.js`: a step route while or after the dialog shows closes the flow; leaving `#pay/…` after a confirm skips "Discard …?" (D4)
- [x] `apps/web/js/iat-overlay.js`: the same in its `popstate` (D4)
- [x] `apps/web/js/trade-flow-overlay.js`: check Back after a placed order; change only if it prompts (D4, open question)
- [x] Check in each flow: confirm, then browser Back: the flow closes, one booking or order recorded

## 3. One layout and plain words (D3, D7 to D15)

- [x] Markup in all eight copies (`overview.html`, `payments.html`, `account-details.html`, `all-bookings-and-payments.html`, `details-of-position.html`): icon, sentence, amount, secondary line, Done; `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby` with per-flow ids (D3, D7)
- [x] `apps/web/css/styles.css`: the sentence, the amount on one baseline, the secondary line, wrapping; remove the old row, lead, footer and date rules (D8 to D10, D15)
- [x] `apps/web/js/payment-overlay.js`, `js/iat-overlay.js`, `js/trade-flow-overlay.js`: paint the sentence and the secondary line (D11 to D14)
- [x] Check every outcome in each flow (Pay: now, later, recurring, standing order, an edit; transfer: now, later, recurring; Buy and Sell: limit, market, 1 and more shares), Light and Dark, desktop and 390px, with a long recipient and a long instrument name

## 4. Wrap-up

- [x] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with VoiceOver, the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 41 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`: the confirmation dialog's pattern (modal over its sheet, one layout) in the Decisions table. No new storage key, so no change to `apps/web/README.md`
