Branch: `feature/arrow-nudge-reduced-motion`

# Arrow nudge with reduced motion (36): requirements

Roadmap item 36 (`specs/roadmap.md`). With the macOS Reduce motion setting on, the forward arrows (Show all bookings, Details, Show all) keep their nudge loop. The back arrows stop as they should. Mission principle 4: every animation has a reduced-motion path.

## Scope

**In:**

1. The forward and back arrows' nudge loop never runs with reduced motion (D1, D2)
2. A disabled forward arrow stays still too (D3)
3. A check of every arrow and of the proceed button (its arrow nudge and the last step's pulse) with the real setting on and off (D4)

**Out (not in this branch):**

- Other animations' reduced-motion paths (a full sweep was offered and not chosen); anything found on the way goes onto the roadmap
- The motion itself (distance, timing, curves) and where it applies

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The two nudge loops are set only under `@media (prefers-reduced-motion: no-preference)`** (the forward rule and the back rule in the Arrow nudge block of `css/styles.css`); the block's `reduce` rule that set `animation: none` goes (interview) | With reduced motion the loop is never set, so no selector has to outweigh another; the bug was a reduce rule losing on specificity |
| D2 | **The selectors themselves stay as they are**: which arrows nudge, the proceed button and the Playground's steer button left out, the hover pause | A fix of when, not of where |
| D3 | **Disabled arrows are left out in the loop's own selector**: `:disabled` and `[aria-disabled="true"]` join the forward rule's `:not(…)`, and the back rule gets the same `:not(…)`; the separate disabled rule goes (interview) | That rule loses to the forward rule for the same reason; inside the selector there is nothing to outweigh |
| D4 | **Checked with the real macOS Reduce motion setting**, which Klaudiusz switches when asked, plus the browser's emulation for the rest (interview) | 35 found this bug only with the real setting |
| D5 | **The proceed button's block stays as it is** unless the check shows it moving with reduced motion (its reduce rule has equal weight and comes later, so it should hold) | Read in the code; confirmed in the check |
| D6 | **No new storage key, no markup change** | CSS only |

## Context

- `apps/web/css/styles.css`, Arrow nudge block (about lines 9696 to 9747): the forward rule `:is(a, button):not(.uz-btn--proceed, .playground-touch__btn):has(> svg > use[href="#i-arrow-right"]) > svg:has(…)` is specificity (0,2,4) once `:not()` counts its heaviest argument; the reduce rule without `:not()` is (0,1,4) and loses. The disabled rule `:is(a, button):is(:disabled, [aria-disabled="true"]) > svg` is (0,1,2) and loses too.
- The proceed button (`.uz-btn--proceed-next` arrow, `.uz-btn--proceed-final` pulse), about lines 9506 to 9577: its reduce rule `.uz-btn--proceed .uz-btn__icon--trailing` matches the nudge rule's weight and comes after it.
- Motion specimens No. 009 shows the Arrow nudge with the app's own rules.
- Forward arrows are on 14 pages (Overview, Account details, All bookings, Payments, Profile, the position and product pages, the fridge, the opening, the Design system pages, the Playground).

## Open questions

- Is any forward arrow in the app disabled today (to check D3 on a real one), or only by setting `aria-disabled` in the browser?
