# Status message: Remind me later and Go to payment (80): requirements

Branch: `feature/status-message-actions`

Roadmap item 80, from Klaudiusz, 2026-11-18. Purpose: show that the message pattern works. The message appears, it is noticed, and the customer acts on it. Fixing the bill is not the point; there is no real scenario for it yet. Roadmap 67 (the message's timing) was closed as superseded in the same sitting: the "9 s" was the reappear timer, and this item removes the reappear-on-tap behaviour.

## Scope

**In:**

1. **The "Open payment!" card** gets two buttons, "Remind me later" and "Go to payment". A tap on the card body no longer dismisses it.
2. **"Remind me later"** dismisses it and it returns after the demo delay (8 s), every time.
3. **"Go to payment"** dismisses it for good and opens the details of one payment, the open bill, by a unique hash route.
4. **The bill** exists as a payment the sheet can open, listed nowhere, and the route opens it also on a first load.
5. **The acted-on state** in a `uzBankWeb` localStorage key, cleared by Reset demo data.
6. **Docs:** README key, tech-spec, baseline line, changelog.

**Out (one-line pointers, not this branch):**

- The warning and info variants and the "Scheduled payment" messages: unchanged (tap to dismiss).
- A Pay button or any way to settle the bill, and a bill row in any bookings list.
- Custom analytics events, counting "shown" or "Remind me later" (`specs/2026-10-26-web-analytics`, Hobby plan).
- Renaming the session keys `uzStatusDismissed` and `uzStatusActive` to `uzBankWeb` names.
- A path-based route (rewrite) if Vercel turns out not to list hash routes (D11).

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Only the "Open payment!" card changes.** The `warning` and `info` variants (`?status=`) and the "Scheduled payment" messages keep the one-card, tap-to-dismiss behaviour and `reappearAfter`. | Chosen in the interview. Nobody asked to change them, and they have no target to go to. |
| D2 | **The card with actions is not a `<button>`.** `render()` in `js/status-message.js` makes a `div` (keeps `role="alert"` for an error) when the message has `actions`; a message without `actions` stays the one tappable `<button>` as today. A `<button>` cannot hold buttons. | Valid markup and a real tab order. Tap on the body does nothing (D1 of the paste: "the buttons do"). |
| D3 | **Layout:** the buttons sit in a row under the text, "Remind me later" (secondary) then "Go to payment" (primary), so the filled one is last, as in the app's other two-button dialogs. At 390px they stack full width, same order. A label never wraps: one line, an ellipsis when too long. The `since` date, the icon and the drop-in motion stay. | Chosen in the interview. Order and button size are open to review. |
| D4 | **Copy:** title "Open payment!" and the body text as today; buttons "Remind me later" and "Go to payment". No em dashes. The `?status=error` test parameter shows the same card with the buttons. | The roadmap names the labels. |
| D5 | **"Remind me later"** dismisses (the existing dismissal) and schedules the card back after `reappearAfter` (8000 ms), with the full drop, every time and for ever. | Chosen in the interview. It keeps the way the message appears visible in a demo. |
| D6 | **"Go to payment"** writes the acted-on state (D7), removes the card from every view, and goes to `account-details.html#payment-details/domestic/open-bill-2026-10-04`. On Account details it only sets the hash; from another page it goes there (plain `location.assign`, not the shell's slide). | The conversion. Settled in the interview: the sheet opens on Account details. |
| D7 | **Acted-on state:** localStorage key `uzBankWebStatusActed`, JSON `{ "<message id>": <timestamp> }`. If the feed's id is in it, the message is not shown again. `UZBankPayState.reset()` (Reset demo data) removes the key, so the message comes back (after its 12 s delay). Listed in `apps/web/README.md`. | Chosen in the interview. Survives tabs and reloads; Reset brings the demo back. |
| D8 | **The route:** `#payment-details/domestic/open-bill-2026-10-04`, the existing `#payment-details/<type>/<id>` shape; the id is the feed's. It is not a row in any list and no other control links to it, so a view is the card, or a typed address. A **first load** of this route opens the sheet: `js/payment-details.js` gets a small registry of payments that exist only for a route, with this one in it. Any other route on a first load behaves as today (cleared). | Chosen in the interview: not in any list, so a view means the message did it. |
| D9 | **The bill's sheet is read-only.** Same sheet, status chip "Open", the recipient, the amount, the due date (since 04.10.2026), a message; no Edit, Delete or Copy, no pay action. The recipient and amounts are placeholders, flagged in the file. | Chosen in the interview. Delete would remove the very thing the message points at. |
| D10 | **A direct open is not told apart from one from the card.** Opening the route by typing it counts like the card does; nothing links to it, so this is a typed address only. | The paste asks the spec to say so. A marker would need an extra segment or a custom event. |
| D11 | **Measurement:** no custom events. `js/analytics.js` already emits the route as a screen ID (`account-details/payment-details/domestic/open-bill-2026-10-04`) on `uzbank:screen`; Vercel Web Analytics may list only page paths, not the hash, and only production is counted (never localhost or a preview). So the spec **records the risk instead of promising the proof**: after the first production visit, check what Vercel lists; if it lists only `/account-details.html`, the path-based route is a new roadmap item. The base is Overview views. | Raised in the interview; the route was chosen as written. Not verifiable before merge. |
| D12 | **Accessibility and motion:** the buttons are real `<button>`s in reading order after the title, text and date; the card does not take focus when it drops in; focus stays visible (`--color-fg-interactive`); with reduced motion the existing no-drop path applies, and the buttons are there at once. Colours only through tokens. | AGENTS.md conventions. |
| D13 | **Docs that name the old behaviour change with it:** `specs/baseline/validation.md` line 17 ("tapping it dismisses it"), the `tech-spec.md` rows (Status message timing: "back 8 s after dismissal" becomes after "Remind me later"; the feed line), `js/status-feed.js`'s header comment. | Otherwise they say something untrue. |
| D14 | **The branch is left uncommitted for review unless Klaudiusz says otherwise**; no merge or push without an explicit ask. | Instruction from Klaudiusz, 2026-11-18. |

## Context

- `js/status-message.js` (573 lines): `render(opts)` builds one `<button class="status-message status-message--<state>">`; `activate(entry)` dismisses on click; dismissals are in `sessionStorage` (`uzStatusDismissed`, `uzStatusActive`); `scheduleReappear` and `feed()` handle the snooze. `js/status-feed.js` holds the definition (`id: 'open-bill-2026-10-04'`, `delay: 12000`, `reappearAfter: 8000`, `since: '04.10.2026'`) and the "Scheduled payment" messages. CSS: `.status-message*` from `css/styles.css:9345`.
- `js/payment-details.js` is loaded only by `account-details.html` and `all-bookings-and-payments.html`. The route is `#payment-details/<domestic|internal>/<id>`; `applyPaymentDetailsRoute()` opens the overlay only when a row tap has already set `currentPaymentData`, so a first load finds nothing and the stale route is cleared (`clearPaymentDetailsRouteIfStale`). `openOverlay(data)` shows the status chip as Executed, Pending or Active (a rule), and `applyActions(data)` shows Edit, Delete and Copy for pending.
- Measured 2026-11-18 on a fresh Overview load: the first appearance is at 12.2 s from navigation start (12000 ms plus about 0.2 s of load). The 9 s was the 8 s reappear plus the drop.
- Pending items run on their date (`runDue`, roadmap 37): the bill is not a stored pending item, so it is never "run".

## Open questions

- Whether the sheet's chip icon for "Open" is `#i-alert-circle` or `#i-clock`: settle by eye in group 3.
- Whether `Go to payment` from another page should use the shell's slide transition rather than `location.assign`: start with the plain load (D6).
