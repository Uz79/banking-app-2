Branch: `feature/sheet-focus`

# Sheets keep focus (27): requirements

Roadmap item 27 (`specs/roadmap.md`). Six sheets are plain `div` overlays: Pay, the internal transfer, Buy and Sell, the booking sheet, Account information and Share information. While one is open, Tab past its last control moves focus to the page behind the scrim, which can't be seen or used. Opening a sheet also leaves focus on the button that opened it, and closing one doesn't bring focus back.

The other modal surfaces are fine already: the "Discard" dialogs and the picker sheets (`form-field-sheet.js`) are native `<dialog>`s opened with `showModal()`, which keeps focus in, and the fridge and playground sheets set `inert` on `.app` while open.

## Scope

**In:**

1. While one of the six sheets is open, everything else in the page is inert: Tab and Shift+Tab stay in the sheet, and a screen reader doesn't reach the page behind (D1 to D4)
2. A sheet opened on top of another (Share information over Account information) shuts off the one beneath too, and closing it gives the one beneath back (D2)
3. Opening a sheet moves focus into it; closing puts focus back on what opened it (D5, D6)

**Out (not in this branch):**

- The fridge and playground sheets, which already make the page inert (D7)
- The native dialogs (Discard, the picker sheets), unchanged
- `js/app.js`'s modal (only `spa-source.html`, not a shipped page)
- Escape on the sheets, roles and `aria-modal` on the overlays
- Booking rows reachable by keyboard: roadmap 33 (D6)
- Other open roadmap items (28 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A shared stack helper** (interview) in `js/dialog-focus.js`, next to `UZBankDialogFocus`: `UZBankSheetFocus.open(overlay)` and `.close(overlay)`. Opening sets `inert` on every child of `<body>` other than the sheet that isn't inert already, and remembers which ones it set; closing clears exactly those | Interview. One rule for six sheets; the file is already the shared home for dialog focus |
| D2 | **Stacking:** the helper keeps a stack, so a sheet opened over another inerts the one beneath (it's a child of `<body>` too) and closing it hands the page back to the one beneath, not to the page | Share information opens over Account information |
| D3 | **Left alone by the helper:** `<dialog>` elements (the Discard prompt and the picker sheets are appended to `<body>` and must stay usable over a sheet), `<script>` and `<style>`, and any `aria-live` region | An inert dialog couldn't be used; an inert live region isn't announced |
| D4 | **Each sheet calls the helper** where it adds and removes `modal-overlay--active`: `payment-overlay.js` (`openModalVisual`, `closeModal`), `iat-overlay.js` (`openOverlay`, `closeOverlay`), `trade-flow-overlay.js` (`openOverlay`, `closeOverlay`), `payment-details.js` (`openOverlay`, `closeOverlay`), `account-information.js` and `share-information.js` (their `…Visual` open and `…Animated` close). A sheet whose script loads without the helper still works as today (`if (window.UZBankSheetFocus)`) | Small, contained diff; the helper is optional for pages that don't load it |
| D5 | **Focus moves in** (interview): after the sheet's slide starts, if the sheet hasn't put focus inside itself (Pay's search field and the transfer's amount do), the helper focuses the sheet's `.modal` (given `tabindex="-1"`), so the next Tab reaches its first control and a screen reader starts at the sheet. The container gets no ring (a rule for `.modal[tabindex="-1"]:focus`, its controls keep theirs) | Interview. The opener goes inert, so focus would otherwise fall to the body |
| D6 | **Focus comes back** (interview): closing focuses the element that had focus when the sheet opened, if it is still in the page and can take focus; with the ring only when the close came from the keyboard, as the fridge does (phone polish D9: `focus({ focusVisible: false })` after a pointer close). If the opener can't take focus (a booking row, roadmap 33) nothing is focused. A sheet that closes because another opens (the booking sheet's Edit opening Pay) hands its opener on, so closing Pay returns there | Interview. The standard modal contract |
| D7 | **The fridge and playground sheets stay as they are** (interview) | Interview. They already work and don't stack with the six |
| D8 | **`dialog-focus.js` on All bookings:** the page loads `payment-details.js` but not `dialog-focus.js`; it gets the script tag, before `payment-details.js`. No other page changes its scripts | The booking sheet on All bookings needs the helper |
| D9 | **No animation is added**; the sheets' slides and their reduced-motion paths are unchanged | Nothing new moves |
| D10 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (each of the six sheets by real Tab and Shift+Tab, Share over Account information, desktop and 390, Light, Dark, a Multi-color theme, reduced motion); the baseline smoke test | Standard gate |

## Context

- Overlays are children of `<body>`, after `<div class="app">` (`overview.html` 2655 Pay, 2917 transfer; `account-details.html` 2632, 2892, 3089 Account information, 3217 Share information, 3339 the booking sheet; `details-of-position.html` 2567 trade; `all-bookings-and-payments.html` 2939; `payments.html` 2541, 2803).
- The pattern to follow: `js/fridge-advisor-sheet.js` (`app.inert` at lines 117 and 138, `focusOpener()`), `js/playground-sheet.js` (lines 41 and 58).
- `js/payment-exit-confirm.js` appends its `<dialog>` to `<body>` (line 111) and opens it with `showModal()` (line 137); `js/form-field-sheet.js` opens its dialog with `showModal()` (line 394).
- `js/dialog-focus.js` is loaded on Overview, Payments, Account details, Position details, Profile and the playground; not on All bookings.
- `js/payment-details 2.js` is a stray tracked copy of `payment-details.js` (from 0453e15), loaded by no page; left alone.

## Open questions

None.
