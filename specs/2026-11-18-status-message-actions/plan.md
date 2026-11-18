# Status message: Remind me later and Go to payment (80): plan

Branch: `feature/status-message-actions`. Decisions are cited as D1 to D14 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done). Nothing is committed (D14).

## 1. The card with two buttons (D1 to D4, D12)

- [x] `js/status-message.js`: `render()` takes `opts.actions` (`[{ label, kind, onClick }]`); with actions the root is a `div` (`role="alert"` for an error) holding the text block and a `.status-message__actions` row; without them it stays the `<button>`. No click-to-dismiss on the `div`; the drop-in, the leave motion and the restore on another view keep working
- [x] `css/styles.css`: `.status-message__actions` (row, gap on the spacing tokens, stacked full width at 390px, one-line labels with an ellipsis), the `div` root without the button's hover and active shell; `prefers-reduced-motion` unchanged
- [x] Check: `?status=error` on Overview shows the card with the buttons; it does not dismiss on a tap of the body; Tab reaches Remind me later, then Go to payment; 390px stacked; Light and Dark

## 2. The behaviour and the state (D5 to D7, D13)

- [x] `js/status-message.js`: "Remind me later" dismisses and schedules the return after `reappearAfter` every time; "Go to payment" calls the message's `onAct`; the acted-on key `uzBankWebStatusActed` is read by `feed()` (an acted-on id is never shown)
- [x] `js/status-feed.js`: the Open payment definition gets the two actions and `onAct` (write the key, dismiss for good, go to the route); header comment rewritten
- [x] `js/payment-state.js`: `reset()` also removes `uzBankWebStatusActed`
- [x] `apps/web/README.md`: the new key
- [x] Check: Remind me later hides it and it drops in again 8 s later, twice in a row; Go to payment hides it on every main view and it does not return on reload; Reset demo data brings it back after its delay

## 3. The bill and its route (D8 to D10)

- [x] `js/payment-details.js`: a registry of route-only payments with the open bill (type `domestic`, status `open`, placeholder recipient and amount, flagged); a first load of its route opens the sheet; `openOverlay` and `applyActions` show "Open" and no Edit, Delete or Copy for it; every other stale route is cleared as before
- [x] Check: typing `account-details.html#payment-details/domestic/open-bill-2026-10-04` on a fresh tab opens the read-only sheet; closing it clears the hash; Back and forward behave; a made-up id opens nothing; the console shows `uzbank:screen` with that route; the bill is in no list (Household and Private, All bookings)

## 4. Wrap-up

- [x] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test (in part: the items not run are unticked there)
- [x] `specs/baseline/validation.md` line 17, `specs/tech-spec.md` (Status messages and Status message timing rows), `specs/roadmap.md` (80 to Done, in number order)
- [x] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
