# Native text trim (86): targets and what moved

## Where the targets come from

The Figma component frames and Design System 1.0's measured table were not reachable in this build (the Design System 1.0 repo is not on this machine and no Figma link was given). So the targets are the clean values the component already states in its own CSS and comments, which the item names as the Figma model: text boxes run from cap top to baseline, and a component spaces them with 8, 12, 16 and 24 (`--space-1`, `--space-2`, `--space-3`, `--space-4`). Every one is to be confirmed against the Figma frames before merge (see `validation.md`, "Not checked").

## The check

`scripts/measure-text-offsets.js` (paste into the console, or run through the browser tool). Distances are in px from the component's edge to the cap top, and from the baseline to the edge. Checked in Chrome 157 (text-box supported), Profile Pro, Regular legibility, desktop width, on `trim-harness.html` (a temporary page, not committed) and on the real pages.

## Status Message (title, body, since)

| Element | Target | Before | After |
|---|---|---|---|
| Title, cap top from the card's top | 16 | 22.07 (+6.07) | 16 |
| Body, baseline to the card's bottom | 16 | 21.5 (+5.5) | 16 |
| Title baseline to body cap top | 8 | about 13.6 | 8 (gap `--space-1`, was 2px) |
| "since" line, cap top | 16 | 21.28 | 16 (its 2px top padding removed) |

## Scale Preset Card

| Element | Target (padding 24 plus the 1px border) | Before | After |
|---|---|---|---|
| Eyebrow, cap top | 25 | 30.06 (+5.06) | 25 |
| Meta, baseline to the card's bottom | 25 | 32 (+7) | 25 |
| Gaps between the three lines | 24 (`--space-4`) | 24 plus trims | 24 between trimmed boxes |

## Date Picker

| Element | Target | Before | After |
|---|---|---|---|
| Weekday row, height (8 padding under a trimmed line) | about 16 | 22 | 15.9 |
| Month title, cap top in the 44px header | centred | 24.19 | 24.59 (the cap height is centred) |
| Day numbers | centred in a 36px cell | untouched | untouched: a grid centres them already, and `text-box` does not apply to a grid container |

## List rows (the shared list item and product item)

The 56dp rows named in the CSS comments (16 inset plus the trimmed two-line stack plus 16). Before, the rows measured 67.6px because the padding added the trim and the negative margins did not take it back out; now they measure 56px, with the cap top at 16 from the top and the baseline at 16 from the bottom. This shortens every list row by 11.6px across Overview, Payments, Account details and All bookings.

| Page | Rows before | Rows after |
|---|---|---|
| Overview | 67.6 | 56 |
| Payments | 67.6 | 56 |
| Account details | 69.6 | 58 |
| All bookings (Household) | 69.6 | 58 |

## Moved by the type classes

Every `.type-*` element is now trimmed (D2). Where a component set a fixed inset around untrimmed type, the text moves up by half the leading plus the ascender gap, about 5 to 8px at the sizes in use; the groups below list what was retuned.
