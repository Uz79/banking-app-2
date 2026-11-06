Branch: `feature/deleted-announcement`

# "Payment deleted." reaches VoiceOver (60): requirements

Roadmap item 60 (`specs/roadmap.md`), found in Klaudiusz's manual check on 2026-11-06. After Delete in a booking's sheet, VoiceOver says nothing: the status line "Payment deleted." (42) isn't read. Profile's "Demo data reset." (22) is filled the same way, behind the same confirmation.

## Scope

**In:**

1. "Payment deleted." and "Transfer deleted." after Delete, on All bookings and Account details (D1 to D3)
2. "Demo data reset." on Profile (D4)
3. One shared helper for a status line set after a confirmation (D2)

**Out (not in this branch):**

- The other live regions (search results, field errors, the date picker's month): not reported as silent
- What the lines say, and how they look

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **(Replaced by D7 for Delete)** **The bookings' status region exists from page load** (created when `js/payment-details.js` starts, not on the first Delete) | VoiceOver may ignore a live region that is inserted and filled at once |
| D2 | **A status line is set only once every modal `<dialog>` has closed**, then after a short pause (250 ms) so the focus move has landed: `UZBankAnnounce(region, text)` in `js/dialog-focus.js` empties the region, waits for the open dialog's `close` event if one is open, then sets the text (interview) | While the confirmation is open (up to 420 ms as it animates out) everything outside it is inert, so the change was never heard; the next row taking focus in the same moment competes with it |
| D3 | **The text stays as it is** ("Payment deleted.", "Transfer deleted."), polite, visually hidden | 42's wording |
| D4 | **Profile's reset line uses the same helper**; its markup region (`[data-demo-reset-status]`, `role="status"`) stays, with its visible check icon (interview) | Same cause: set 100 ms after Reset while the confirmation still closes |
| D5 | **The gate includes Klaudiusz's VoiceOver check** on 5175 or the preview before the merge (interview); after D7: the four tests again in Chrome, and once in Safari | The agent can't run VoiceOver; it checks timing and focus by script |
| D6 | **No new storage key, no visible change** | |
| D7 | **Delete says what it did with the focus move**: the element that takes focus after the sheet closes (the next row, or the tab when no row is left, from 33's pick) gets `aria-describedby` pointing at a hidden note ("Payment deleted." or "Transfer deleted.", `#uz-pd-delete-note`), removed when it loses focus. The Delete live region goes; `UZBankAnnounce` stays for the demo reset (Klaudiusz, after the first VoiceOver check) | VoiceOver reads the focused row (1 to 2 s) and drops a polite update made meanwhile; a longer delay would depend on speech rate |

## Context

- `js/payment-details.js` (about line 930): `announce()` creates a visually hidden `role="status"` paragraph on the first call, empties it, and sets the text after 100 ms. It runs inside the confirmation's leave callback, right after `closeOverlay()`.
- `js/payment-exit-confirm.js`: the confirmation is a `<dialog>` opened with `showModal()`; Delete calls `closeDialogAnimated()` (an animation with a 420 ms fallback, at once with reduced motion) and then the callback.
- `js/dialog-focus.js`: the sheet's close hands focus to the next row (`handOn`, 33) when the sheet's slide ends (up to 300 ms).
- `js/app-mp.js` (about line 320): `runDemoReset` fills `[data-demo-reset-status]` after 100 ms.

## Found in the build

- Klaudiusz's VoiceOver check after group 1 (Chrome, 5175): "Payment deleted." and "Transfer deleted." were not heard, VoiceOver read the next focused row and then nothing; "Demo data reset." was heard (no focus move). Hence D7.
- With clicks made by script (no focus on the clicked buttons), focus after Delete ended on the page instead of the next row; with real keys it lands on the next row. Not from this branch.

