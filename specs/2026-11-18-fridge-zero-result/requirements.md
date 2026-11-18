# Fridge advisor result: CHF 0 with no reason (83): requirements

Branch: `feature/fridge-zero-result`

Roadmap item 83, from Klaudiusz, 2026-11-18. On step 7 ("Your freezer") the ring can say "You could invest CHF 0" while the line under it says "Left each year: CHF 33'600". That happens when one month of spending plus the two reserves is at least the total assets (`investable()` in `js/fridge-advisor.js`). Nothing says why, and the yearly line reads as a contradiction.

## Scope

**In:** the result screen only (`buildResult()` in `js/fridge-advisor.js`, its copy, a small CSS rule):

1. A one-sentence explanation shown only when the result is CHF 0, with a hint to lower the reserves.
2. The yearly line relabelled so it reads as a separate recurring amount.
3. The yearly line stays when the result is 0.

**Out (one-line pointers, not this branch):**

- The result's formula (`investable()`), the sliders, the steps before the result, and the 3D scene.
- "Show suitable products" and the opening: unchanged at CHF 0 (the opening already shows no suggestion when `fridgeAmount` is 0).
- Naming which of spending, unplanned or bigger purchases is the biggest cause.
- Real advice: the note "A rough guide, not financial advice." stays.

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The explanation shows only when `investable()` is 0**, as one sentence under the ring and above the yearly line: "Your spending for a month and your reserves use up your assets. Try lowering a reserve." The amount stays CHF 0 and the ring stays empty. | Klaudiusz's answer. The customer sees why and what to try, in two short sentences, no em dashes. |
| D2 | **It is one message for every zero,** whichever of the month's spending, the unplanned reserve or the bigger-purchases reserve is largest. When total assets are 0 the same sentence is shown. | The interview chose one line, not a cause per case. Keeps the copy short. |
| D3 | **The yearly line is relabelled "You could set aside each year: CHF X"** and the figure is unchanged (what is left at month end times 12). It stays when the result is 0, and when the left amount is 0 it reads CHF 0. | Klaudiusz's answer. It is a recurring amount, true whatever the lump sum is. Hiding it would drop the only useful number for a customer with no lump sum. |
| D4 | **Nothing changes when the result is above 0:** no explanation, the same ring, the same amount. Only the yearly label changes. | Smallest diff. |
| D5 | **Screen readers:** the explanation is real text under the ring (not `aria-hidden`), and the step's announcement ("You could invest CHF 0.") gains the sentence at 0, in the same live region. | The ring is decoration; the text must say what it shows (the app's chart rule). |
| D6 | **"Show suitable products" is unchanged at 0.** The opening starts with no suggestion. | Klaudiusz's answer. No change to the flow. |
| D7 | **Styling:** the explanation uses `.fridge__note`'s look (secondary text colour, `--fs-text-sm`) centred like the rest of the result, tokens only; no motion, so nothing for reduced motion. A sentence may wrap (it is text, not a label); the yearly label is one line where it fits and otherwise wraps at a space, never clipped. | Matches the screen. |
| D8 | **No new storage key and no analytics change.** | Nothing is stored or measured. |

## Context

- `investable()` is `max(0, assets - max(0, salary - left) - unplanned - bigger)` (`js/fridge-advisor.js` about line 158).
- `buildResult()` (about line 306) builds the ring, the screen reader line, `fridge__year` ("Left each year: " + `chf(values.left * 12)`) and the note. The announcement is in `render()` (about line 413).
- `.fridge__year` is at `css/styles.css` about 12444; `.fridge__note` about 12357.
- The fixed-height sheet has no scrolling step ("no step scrolls", 9a D26): the added sentence must still fit at 390 and at Legibility Large (to check).

## Open questions

- Whether the extra sentence fits the result screen at 390 and at Legibility Large without pushing the button out of view. Decided at build by looking at it; if it does not fit, shorten the copy before changing the layout.
