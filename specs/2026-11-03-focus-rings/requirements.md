# Focus rings app-wide (25): requirements

Branch: `feature/focus-rings`

Roadmap item 25 (`specs/roadmap.md`), point 7 of Klaudiusz's phone polish brief of 2026-11-03. Points 1 to 6 of that brief were already built in item 21 (`specs/2026-11-03-phone-polish/`, D1 to D13) and are not re-opened here.

The rule: no browser-default outlines anywhere in the app. Every interactive element shows the app's ring in `--color-fg-interactive`, and only for keyboard focus (`:focus-visible`), never after a click or a tap. The first known case is the selected month chip on All bookings, which shows a blue browser ring after a click.

The interview settled:
- one global base rule at zero specificity, so the existing component rings keep winning;
- text fields keep their focused stroke on a click;
- outlines drawn in other tokens move to `--color-fg-interactive`, while the fields' inset stroke stays;
- the merge gate is the standard one plus a scripted audit of every page.

## Scope

**In:**

1. A global base ring for every focusable element, keyboard only (D1 to D4)
2. The month chip on All bookings: its browser ring after a click, reproduced and gone (D5)
3. The rings drawn in other tokens moved to `--color-fg-interactive` (D6)
4. An audit of every page and flow: no element left with the browser's ring or with no ring (D7)
5. The rule recorded in `specs/tech-spec.md` as a design-system decision (D8)

**Out (not in this branch):**

- Folding the roughly 45 per-component copies of the ring into the base rule (interview: no broad clean-up)
- The fields' inset focus stroke (`--color-input-stroke-focus`), which stays as it is (interview)
- Points 1 to 6 of the brief (done in 21)
- The month separators on All bookings (item 24)
- Any change to focus order, to where focus moves, or to accessible names, other than recording what the audit finds

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One base rule** in `css/styles.css`, written with `:where(…)` so it has zero specificity. It covers `a[href]`, `button`, `input`, `select`, `textarea`, `summary`, `[role="button"]`, `[role="tab"]`, `[role="option"]`, `[role="slider"]`, `[tabindex]:not([tabindex="-1"])` and `[contenteditable]`. On `:focus-visible` they get the app's ring: `outline: 0.125rem solid var(--color-fg-interactive); outline-offset: 0.125rem`. | This is the ring the app already writes out about 45 times. Zero specificity means every existing component rule still wins, so nothing that looks right today changes. |
| D2 | **No ring from a pointer:** the same elements get `:focus:not(:focus-visible) { outline: none }`, also inside `:where`. A click or a tap never shows a ring. | The rule as briefed. Chrome and Safari already hide most rings on a click, but not every case (D5). |
| D3 | **Text fields keep their stroke on a click** (interview). Text inputs, `textarea` and `select` keep their own focused stroke on any focus, as today. The keyboard-only rule applies to buttons, links, chips, cards, tabs, sliders and the like. | A clicked field still needs to show where typing goes. Browsers treat focus in a field as visible for that reason. |
| D4 | **Focus targets are not controls:** elements with `tabindex="-1"` (the step headings the flows move focus to, the assistant's title) are left out of the base rule and keep their own `:focus { outline: none }`. | Otherwise a heading focused by script after a key press would get a ring, as if it could be used. |
| D5 | **The month chip:** the build reproduces the blue ring after a click (Chrome and Safari, desktop and 390, the chip bar both in the list and docked in the sticky header) and finds why it shows. D1 and D2 must then remove it. If a script moves focus after the click, that script is fixed rather than the ring hidden. | It is the known case. The cause decides whether CSS alone is enough. |
| D6 | **Rings in other tokens move to `--color-fg-interactive`** (interview). This covers the outlines on `.form-sheet__row` and the other outline rules using `--color-input-stroke-focus`. The fields' inset `box-shadow` stroke stays `--color-input-stroke-focus`. The ring in `--color-btn-primary-fg` stays where it sits on a filled button and must contrast with the fill. | Multi-color themes then colour every ring (tech-spec: "Interactive ink"). A field's stroke is a field state, not a ring. |
| D7 | **The audit:** on every page in `vite.config.js` and in every flow and dialog they open (Pay, transfer, trade, the fridge, the opening with its assistant, the Profile dialogs, the Playground), Tab through with real keys. A script records each focused element's outline and box-shadow. Any element showing the browser's ring (`auto` style or `-webkit-focus-ring-color`) or no ring at all is fixed here, or listed in `validation.md` with the reason. Then click and tap each kind of control and check that no ring shows. | "Anywhere in the app" needs a check that covers the whole app, not the one known case. |
| D8 | **Recorded:** `specs/tech-spec.md`'s Decisions gets the rule (keyboard-only rings in `--color-fg-interactive`, no browser outlines, fields keep their stroke, the base rule in `styles.css`). AGENTS.md's Accessibility convention already points at the token, so it is unchanged. | A design-system rule lives in the tech-spec, like the no-disabled-buttons rule from 21 (D4 there). |
| D9 | **Reduced motion:** nothing here animates. If an existing ring has a transition, it keeps its present reduced-motion path. | AGENTS.md: every animation has a reduced-motion path. |
| D10 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser, at desktop and 390, in Light, Dark and a Multi-color theme, with the audit (D7) and the accessible names checked in the page tree; the baseline smoke test. No VoiceOver pass: rings don't change what VoiceOver reads. | Chosen in the interview. |

## Context

- `css/styles.css`:
  - It has no global focus rule. About 45 component rules write out `outline: 0.125rem solid var(--color-fg-interactive)`, most with `outline-offset: 0.125rem`.
  - 9 `:focus-visible` rules set `outline: none`, because they draw the ring on a child or in another way: `.action-button` (on its circle), `button.debit-account`, `a.list-item.is-quiet-focus`, the colour sliders, the quiet overlays.
  - Two outline rules use `--color-input-stroke-focus`: `.form-sheet__row:focus-visible`, near line 7139, and one more.
  - Three field rules draw an inset `box-shadow` stroke.
  - `--color-fg-interactive` is defined near line 9734 and defaults to `--color-fg`. `--color-input-stroke-focus` is `--color-fg` in Light and `#FFFFFF` in Dark (`css/tokens.css`, generated).
- `.all-bookings__month-chip` (near line 2326) has no focus rule, so it gets the browser's default. The chips are buttons with `aria-pressed`. `bindMonthChips` in `js/all-bookings.js` sets the active chip and scrolls to the month. The bar docks into the sticky header (`all-bookings--month-merged`).
- `.fridge__heading:focus`, `.opening__heading:focus` and `.assistant__title:focus` hide the outline on their scripted focus (D4).
- The pages are the 16 inputs in `vite.config.js`: `index`, `overview`, `account-details`, `all-bookings-and-payments`, `payments`, `profile`, `account-information`, `investment-product-details`, `details-of-position`, `design-system`, `motion-specimens`, `components`, `character-kit`, `playground`, `fridge-advisor`, `investment-opening`.

## Open questions

1. Why the month chip shows the browser ring after a click (D5). The build settles it before choosing the fix.
