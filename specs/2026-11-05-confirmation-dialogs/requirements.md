Branch: `feature/confirmation-dialogs`

# Confirmation dialogs: modal, one layout, plain words (41): requirements

Roadmap item 41 (`specs/roadmap.md`), widened at the start of the spec to the dialog's content and layout. Four flows show a confirmation after their last step: Pay, the internal transfer, Buy and Sell. All share `.confirmation-dialog` in `css/styles.css`.

- **Focus (41 as written):** the dialog sits inside its sheet's overlay, so Tab still reaches the sheet behind it, including the button that placed the order. Focus stays on that button when the dialog opens. A second press is ignored today (each flow checks the dialog is visible), but after the dialog Pay can be confirmed again: its dialog is at `#pay/confirmation`, and browser Back from there reopens the summary with Execute live.
- **Content and layout (added):** the amount puts "CHF" and the sum 24px apart, at different sizes, off one baseline. The trade dialog reuses Pay's "to <recipient>" row with an empty first `<span>`, so "1 pcs. Apple Inc." sits 12px off-centre. The text mixes four styles over five lines.

## Scope

**In:**

1. While a confirmation shows, the sheet behind it is inert: no Tab, no click, hidden from screen readers. Focus goes to Done when it opens (D1, D2)
2. The dialog is announced as a dialog, named by its sentence (D3)
3. No second confirm after the dialog: browser Back from it closes the flow, as Done does, in every flow (D4, D5)
4. Done closes the dialog and the sheet; focus goes back to what opened the flow, as when a sheet closes (D6)
5. One layout for all four flows: the icon, one sentence, the amount, an optional secondary line, Done (D7 to D10)
6. New wording: one plain sentence per outcome, the date of a later payment in it, "share" or "shares" for stocks (D11 to D14)
7. Long names wrap inside the dialog, Light and Dark, desktop and 390px (D15)

**Out (not in this branch):**

- Escape on the sheets and the dialog (49)
- Wording for funds, ETFs and bonds: recorded (D13), not built, as no such position exists
- The exit prompts ("Discard order?") and the booking sheet
- A shared template for the dialog's markup instead of a copy per page
- `spa-source.html`, the old reference page (tech-spec: "Do not extend")

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **While the dialog shows, the sheet behind it is inert** (interview): the sheet's `.modal-shell`, a sibling of `.confirmation-overlay` in the same `.modal-overlay`, gets `inert` on open and loses it on close. A small shared helper in `js/dialog-focus.js` (next to 27's `UZBankSheetFocus`) does it for all three scripts | Interview. `inert` removes Tab, clicks and the accessibility tree in one attribute, as 27 does for the page |
| D2 | **Focus moves to Done when the dialog opens**, with the ring only after a keyboard action (as 27's helper: `focusVisible: false` after a pointer) | Roadmap 41. The button that placed the order no longer holds focus |
| D3 | **The dialog is `role="dialog"` with `aria-modal="true"`, labelled by its sentence** (`aria-labelledby`), the amount and the secondary line as its description (`aria-describedby`). Each copy gets ids of its own flow (`uz-pay-conf-…`, `uz-iat-conf-…`, `uz-trade-conf-…`), as a page can carry Pay's and the transfer's | Focus landing on Done inside a labelled dialog makes a screen reader read the sentence first |
| D4 | **Browser Back from a confirmation closes the flow, as Done does** (interview), instead of going back to the summary. Pay: a step route while the dialog shows, or after it, closes; leaving `#pay/…` after a confirm closes without the "Discard …?" prompt, as nothing is left to discard. The transfer: the same in its `popstate`. The trade: Back already closes it (`applyTradeRoute`); checked, not changed unless it prompts | Pay could record a second payment this way; the transfer's Back steps through its steps behind the dialog |
| D5 | **The existing guards stay**: each flow ignores its confirm button while the dialog shows. No disabled button (interview) | `specs/tech-spec.md`: no disabled call-to-action buttons. With D1 the button can't be reached anyway |
| D6 | **Done closes both, focus goes back to the flow's opener** through 27's `UZBankSheetFocus.close` (focus is inside the overlay, so it hands back). Unchanged code path, checked | Roadmap 41 asks where focus goes after Done |
| D7 | **One layout, top to bottom** (interview): the check icon; the sentence; the amount; an optional secondary line; Done. The empty-span "to" row, the "lead" line, the "footer" line and the "date" line go, in markup, CSS and JS | Interview. One structure for four flows, no row reused for something it isn't |
| D8 | **The sentence**: `--fs-text-md`, regular, `--color-fg`, centred, wraps | One text style for what happened |
| D9 | **The amount as elsewhere in the app**: "CHF" small (`--fs-text-sm`, `--color-fg-secondary`) and close before the value (`--space-1`), the value `--fs-text-lg` bold, on one baseline (`align-items: baseline`) | Matches the account and booking rows (currency first, small, baseline) |
| D10 | **The secondary line**: `--fs-text-sm`, `--color-fg-secondary`, shown only when there is something to say: a trade's terms ("Limit CHF 200.20, valid today", "At the market price"). Hidden otherwise | Interview: the terms are one secondary line |
| D11 | **Pay's sentences** (interview: the date in the sentence): "Your payment to Swisscom is done." / "Your payment to Swisscom will be made on 20.11.2026." / "Your standing order to Swisscom starts on 01.12.2026." / "Your recurring payment to Swisscom starts on 01.12.2026." Editing a payment says the same, from its new schedule | One sentence per outcome; the schedule step's choice decides it, as today (roadmap 15) |
| D12 | **The transfer's sentences**: "Your transfer to Savings Account is done." / "… will be made on 20.11.2026." / "Your recurring transfer to Savings Account starts on 01.12.2026." | Same pattern as Pay |
| D13 | **The trade's sentence**: "Your order to buy 1 Apple Inc. share has been placed." / "Your order to sell 12 Apple Inc. shares has been placed." "share" for 1, "shares" otherwise. For later types (interview, not built): funds and ETFs "unit"/"units", bonds a nominal amount ("CHF 5'000 nominal of …") | Interview. Every position today is an equity (`js/investment-positions.js`) |
| D14 | **Copy rules**: no em dashes, short plain English, a full stop at the end of the sentence, none on the secondary line | AGENTS.md copy rules |
| D15 | **Long names wrap**: the sentence wraps at spaces and breaks a long unbroken word (`overflow-wrap: anywhere`); the dialog never scrolls sideways | Recipients and instruments can be long |
| D16 | **Motion unchanged**: the dialog's slide and its reduced-motion rules stay as they are | Nothing new animates |
| D17 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (all four dialogs in Light and Dark, desktop and 390px, keyboard, reduced motion with the real setting, a long recipient and a long instrument name); VoiceOver on macOS reads each dialog's sentence when it opens (Klaudiusz switches it on when asked); the baseline smoke test | Interview |

## Context

- **Markup, eight copies:** Pay's dialog in `overview.html` (2890), `payments.html`, `account-details.html` and `all-bookings-and-payments.html`; the transfer's (`#uz-iat-confirmation`) in `overview.html` (3089), `payments.html` and `account-details.html`; the trade's (`#uz-trade-confirmation`) in `details-of-position.html` (2719).
- **Pay** (`js/payment-overlay.js`): `paintConfirmationDialog` (258 to 285) takes the page's first `.confirmation-dialog`; `showConfirmationVisual` and `hideConfirmationVisual` (848 to 855); the guard in `advanceStep` (973); the `#pay/confirmation` route in `syncRouteFromLocation` (893); Done is the document click handler on `[data-action="done"]` (1098). On leaving `#pay/…`, `worthProtecting` asks "Discard …?" when a recipient is set (868), also after a confirm.
- **Transfer** (`js/iat-overlay.js`): `paintConfirmationDialog` (319 to 332), `showConfirmation` and `hideConfirmation` (476 to 489), the guard in `nextStep` (381), `popstate` (618) steps through `#iat/<step>` without looking at the dialog.
- **Trade** (`js/trade-flow-overlay.js`): `paintConfirmationDialog` (292 to 313, "pcs." at 301), `showConfirmation` and `hideConfirmation` (315 to 328), the guard on the order button (543), Done (550), `applyTradeRoute` (502) closes the sheet when `#trade/…` goes.
- **CSS:** `css/styles.css` 4366 to 4602. `.confirmation-dialog__text`, `__amount`, `__currency`, `__sum`, `__recipient`, `__recipient-name`, `__footer`, `__date` and the `:has()` footer rules (4591 to 4602, roadmap 15 D3).
- **Focus helper:** `js/dialog-focus.js`, `UZBankSheetFocus` (27). Sheets are `.modal-overlay`; the dialog's overlay is inside one.

## Open questions

- Whether the trade's Back after a placed order shows "Discard order?". Answered 2026-11-05: it doesn't; it already closed without a prompt, so the trade's Back is unchanged (D4).
- Found in the check: Back into a `#pay/summary` entry left by an earlier page load opens Pay at the summary with fresh defaults, as any deep link does. It is not a repeat of the earlier payment, so it stays.
- Whether `aria-modal` on a dialog nested in a sheet that is not itself `role="dialog"` reads well in VoiceOver, or whether the sheet needs `aria-hidden` while the dialog shows, on top of `inert`. To hear in the VoiceOver check. Still open: waiting for Klaudiusz's VoiceOver pass.
