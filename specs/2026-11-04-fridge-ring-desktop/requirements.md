Branch: `feature/fridge-ring-desktop`

# Fridge result: the amount fits its ring on desktop (26): requirements

Roadmap item 26 (`specs/roadmap.md`). On the fridge's result step (step 7, "Your freezer"), the floating panel's ring holds "You could invest" and the amount. A six-digit amount (CHF 280'000 with every slider at its maximum) wraps onto two lines, and the second line reaches the ring's inner edge: its box ends 73 px from the centre of a 70 px inner circle. Item 19 was the same fault on a phone, fixed in 21 (phone polish D8); the floating panel kept the old rule.

The roadmap entry says "with Legibility set to Large". Reading the code, Legibility doesn't reach the fridge page at all (it has no `app-mp.js`, phone polish D8 noted this), so the type scale is not the cause: the amount's length is. Measured 2026-11-04 in the Overview sheet at desktop width with Legibility Large: the same wrap as at Regular.

## Scope

**In:**

1. On the floating panel (640px and wider), the amount sits on one line and its size steps down with its length, so any amount the fridge can produce fits inside the ring's inner circle with a margin, below "You could invest" (D1 to D3)

**Out (not in this branch):**

- The phone layout (phone polish D8), unchanged
- Legibility reaching the fridge and the opening: roadmap 34 (D5)
- The ring's size, the bar's animation, the screen-reader text, "Left each year" and the note
- Other open roadmap items (27 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The phone's rule, label inside** (interview): from 640px the amount is on one line (`white-space: nowrap`) at `min(--fs-h4, <k>cqw / --ring-chars)`, the ring a size container like the phone's. "You could invest" stays inside the ring above the amount, as now. `k` is set in the build so the widest amount fits (D2); short amounts keep `--fs-h4`. Built: `k` = 140 (the phone's 155 left under 3 px for CHF 500'000), so amounts up to 7 characters (CHF 0 to CHF 999) keep 32px, CHF 4'500 is 27px, CHF 26'900 25px and 11 characters 22px; the line clears the inner circle by 9 px or more | Interview. The phone's formula is proven (D8 there), and `--ring-chars` is already set by `buildResult()`; one CSS rule, no new markup |
| D2 | **The widest amount:** the fridge's largest result is CHF 500'000 (total assets at its 500'000 maximum, every reserve at 0), 11 characters, the same length as CHF 999'999. Both must fit with the line's box inside the inner circle (radius 48 of the ring's 60 units, about 70 px at 11rem) with at least 4 px to spare, the label's box too | A measured fit, not an eyeballed one: the current failure was 3 px over |
| D3 | **The ring stays 11rem** and its padding unchanged; only the amount's size and wrapping change | The ring's size is part of the panel's composition (8d) |
| D4 | **Files:** `css/styles.css` only (the fridge's result rules after `.fridge__ring-amount`). No JS, markup, page, storage key or dependency | Small, contained diff |
| D5 | **Legibility in the fridge and the opening** (interview): a new roadmap item, not this branch: the type scale and the other Legibility settings don't apply inside the fridge and the opening, so a reader on Large gets default type there | Interview. Found while reading for 26; it touches every fridge and opening layout |
| D6 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (amounts from CHF 0 to the maximum on the floating panel and at 390, Light, Dark, a Multi-color theme, reduced motion); the baseline smoke test | Standard gate |

## Context

- `apps/web/js/fridge-advisor.js`: `buildResult()` (line 306) builds the ring with `.fridge__ring-label` and `.fridge__ring-amount` inside `.fridge__ring-text`, and sets `--ring-chars` to the amount's length (line 318). `syncLayout()` (line 28) sets `html.fridge--wide` from 640px. `investable()` (line 158) is assets minus the month's spending and both reserves.
- `apps/web/css/styles.css`: `.fridge__ring` 11rem (line 11672); `.fridge__ring-text` padded `0 var(--space-4)` (line 11700); `.fridge__ring-amount` at `--fs-h4` (line 11716); the phone's rules under `html:not(.fridge--wide)` (line 11751), with `container-type: inline-size` on the ring and `min(var(--fs-h5), calc(155cqw / var(--ring-chars, 10)))` on the amount.
- The ring's SVG: viewBox 120, r 52, stroke 8, so the inner edge is at 48.

## Open questions

None.
