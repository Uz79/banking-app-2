Branch: `feature/sheet-close`

# Sheets close without waiting for an animation (35): requirements

Roadmap item 35 (`specs/roadmap.md`), taken before 28 because it is live on `main` and blocks the whole page: with reduced motion on, closing the internal transfer leaves an invisible layer over the page that takes every click until a reload.

## Root cause

`closeOverlay()` in `js/iat-overlay.js` (line 451) finishes the close only in a `transitionend` listener on the sheet's shell, with no fallback. With reduced motion, `.modal-shell.modal-shell--closing` has `transition: none !important` (`css/styles.css`, the `prefers-reduced-motion` block after the close rule), so no transition runs and the event never fires. The overlay keeps `modal-overlay--active modal-overlay--closing`: its scrim fades to opacity 0, but the overlay itself stays over the page with `pointer-events: auto`.

Every other sheet already guards its close with a fallback timer next to the same listener, each its own copy: Pay (`payment-overlay.js` `closeModal`, 300 ms), Buy and Sell (`trade-flow-overlay.js` `closeOverlay`), the booking sheet (`payment-details.js` `closeOverlay`), Account information and Share information (their `close…Animated`), the fridge sheet, which also hosts the opening (`fridge-advisor-sheet.js` `close`, 300 ms), and the Playground sheet (`playground-sheet.js` `close`, 300 ms). The opening's assistant layer closes at once when reduced motion is on and has a timer otherwise (`opening-assistant.js` `hideFull`, 9f). The Playground settings dialog skips its animation under reduced motion.

## Scope

**In:**

1. One shared way for a sheet's close to finish: on its slide's end, after a fallback timer, or at once with reduced motion (D1, D2)
2. The transfer and the seven other sheets use it (D3)
3. A sweep of every sheet and overlay with reduced motion on and off, desktop and 390: open, close, click the page behind (D7)

**Out (not in this branch):**

- The opening animations of the sheets (nothing waits on them)
- The native dialogs (Discard, the picker sheets), the assistant layer, the Playground settings dialog, the page transitions and the Pay step animations: each already has a fallback or a reduced-motion path (D4)
- `js/app.js` (only `spa-source.html`)
- Other open roadmap items (28 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One shared helper** (interview) in `js/dialog-focus.js`, next to `UZBankSheetFocus`: `UZBankAfterSheetClose(shell, done)` runs `done` exactly once: at once when `prefers-reduced-motion: reduce` matches; otherwise on the shell's own `transitionend` for `transform`, or after 300 ms, whichever comes first | Interview. The close slide is 0.28 s; 300 ms is the timer most sheets already use. One copy instead of eight, so no close can depend on an event again |
| D2 | **Closing at once with reduced motion:** no slide runs then, so there is nothing to wait for; the sheet disappears on the frame the close starts. Without reduced motion the slide and its timing are unchanged | Reduced motion already shows no slide; waiting 300 ms on nothing only delays the page |
| D3 | **The eight sheets call the helper** in place of their own listener and timer: the transfer (`iat-overlay.js` `closeOverlay`, which gains the fallback), Pay (`payment-overlay.js` `closeModal`), Buy and Sell (`trade-flow-overlay.js` `closeOverlay`), the booking sheet (`payment-details.js` `closeOverlay`), Account information (`account-information.js` `closeAccountInformationAnimated`), Share information (`share-information.js` `closeShareInformationAnimated`), the fridge sheet (`fridge-advisor-sheet.js` `close`) and the Playground sheet (`playground-sheet.js` `close`). What each does when the close ends stays as it is | Interview. Small, contained diffs; the sheets' own finish code is not touched |
| D4 | **Left as they are:** the Discard prompt (`payment-exit-confirm.js`, `animationend` with a 420 ms fallback), the picker sheets (`form-field-sheet.js`, with a fallback), the assistant layer (closes at once with reduced motion, 400 ms fallback), the Playground settings dialog (skips its animation with reduced motion), the page transitions (`shell-nav.js`, with a fallback), the Pay step animations (they only clear a class) | Each already ends without its event; checked in the sweep (D7), not rewritten |
| D5 | **`js/dialog-focus.js` on the Design system page:** it loads `playground-sheet.js` but not the helper; it gets the script tag before `playground-sheet.js`. Every other page with one of the eight sheets already loads it | The Playground sheet needs the helper |
| D6 | **The transfer keeps its sheet-focus call at the start of the close** (27 D11); the page's `inert` and focus are already handed back before the slide | No change in behaviour there |
| D7 | **The sweep** (interview): Pay, the transfer, Buy, Sell, the booking sheet, Account information, Share information, the fridge, the opening in the fridge's sheet, the opening's assistant layer (phone), the Playground sheet. Each: open, close, then click something on the page behind it and see it respond; with reduced motion on and off; desktop and 390. Reduced motion is the macOS setting (System Settings > Accessibility > Display > Reduce motion), switched on and off by Klaudiusz when the agent asks, since the agent can't change system settings; emulation (the reduced-motion rules injected, `matchMedia` stubbed) is used during the build | Interview. The bug only shows with the real setting's CSS path, and the agent may not change system settings |
| D8 | **The merge gate** (interview): `npm run build`; the sweep (D7); this branch's `validation.md`; the baseline smoke test | Standard gate plus the sweep |

## Context

- The close rule and its reduced-motion override: `css/styles.css`, `.modal-shell.modal-shell--closing` (transform with a 0.28 s transition) and the `@media (prefers-reduced-motion: reduce)` block after it (`transition: none !important`, the scrim's `::before` at opacity 0 while closing).
- `js/dialog-focus.js` is loaded on Overview, Payments, Account details, a position's page, Profile, All bookings and the playground page; not on the Design system page.
- 9f's stuck assistant layer was the same kind of fault (an `animationend` with no fallback); `opening-assistant.js` `hideFull` is the fixed version.

## Open questions

None.
