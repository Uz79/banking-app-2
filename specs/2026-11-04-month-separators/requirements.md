# All bookings: month separators (24): requirements

Branch: `feature/month-separators`

Roadmap item 24 (`specs/roadmap.md`). The list on All bookings runs day group after day group with nothing marking where a month starts, and the month chips above it have no visible counterpart in the list. The chips already scroll to their month's first day group; this branch adds the separators, makes the active chip follow the scroll, and fixes where focus goes after a chip (found during 25).

## Scope

**In:**

1. A separator row at the start of each month, in all three tabs (D1 to D4)
2. The chips scroll to their separator; while scrolling, the chip of the month in view becomes active (D5, D6)
3. Search hides a month's separator when the month has no match (D7)
4. Focus after a chip stays on the same month's chip in whichever bar is shown (D8)
5. The chip scroll respects reduced motion (D10)

**Out (not in this branch):**

- A sticky separator (D9)
- Month separators on Account details or Overview
- Month chips on the Pending and Recurring tabs (they have none today)
- The static Executed list's dates (February to June 2026) against the in-app bookings, which join its Today group
- Other open roadmap items (26 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A separator is an `<h2 class="all-bookings__month">`** placed before the month's first day group, with the month's name ("May"), shown in capital letters by CSS (`text-transform: uppercase`), no amount. It takes the place of the divider before that group; the first month of a tab gets one too, above Today | The roadmap item. A heading lets a screen reader jump month to month; the page's only other heading is the `h1`. Capitals by CSS, so a screen reader reads "May", not "M A Y" |
| D2 | **The year is added** ("December 2025") to every separator of a tab whose months cross a year; otherwise the month alone | The roadmap item. Within one tab the labels stay uniform |
| D3 | **Look** (interview): a full-width band inside the card (edge to edge, no side margin), `--color-bg-secondary` behind, the text in `--color-fg-secondary` at `--fs-text-sm` with a little letter spacing, padded like a group header. No animation | Interview: the roadmap's "separator background token" doesn't exist (`--color-separator` is the 10% line colour); the page background reads as a break and follows every theme |
| D4 | **Built by the script**, not written into the markup: `js/all-bookings.js` adds the separators to each tab after its list is rendered (and again whenever the in-app bookings change). Executed groups take their month from `data-bookings-month-start` (carried down to the following groups); Pending and Recurring groups from the date in their label ("Execute on 03.11.2026", "Next on 05.11.2026"), so the in-app pending and recurring bookings get separators too | One rule for all three tabs and for the static and the in-app groups; the Pending and Recurring groups are partly built by the script already |
| D5 | **A chip scrolls to its month's separator**, below the sticky header and the docked chips, instead of to the first day group | The separator is the chip's counterpart in the list (the roadmap item) |
| D6 | **The active chip follows the scroll** on the Executed tab: the active month is the last one whose separator has passed under the header and docked chips; at the top, the first month. Read on scroll, once per frame. While a chip's own scroll runs, the chip stays active and the scroll doesn't move it | The roadmap item. Without the pause, a smooth scroll from June to February would flick the active chip through every month on its way |
| D7 | **Search**: a separator is hidden with its month when none of the month's rows match, as the groups and dividers are today; the chip of such a month stays dimmed (unchanged). The year rule (D2) counts every month of the tab, matched or not | The roadmap item ("a month with no matches shows no separator"); labels don't change while typing |
| D8 | **Focus after a chip** (interview): when the chip bars swap (the flow bar is hidden and the docked one shown, or back), and focus is on a chip in the bar being hidden, focus moves to the same month's chip in the bar being shown, without scrolling | Found during 25 (roadmap 24's last point): today focus drops to the page body and the next Tab starts from the top. Covers both directions, so scrolling back up with focus in the dock doesn't lose it either |
| D9 | **No sticky separator** (interview) | The docked chip bar with its active chip (D6) already names the month in view; a third sticky layer would repeat it |
| D10 | **The chip's scroll is instant under reduced motion** (`behavior: 'auto'` when `prefers-reduced-motion: reduce` matches), smooth otherwise | The standing rule: every animation has a reduced-motion path. The smooth scroll had none |
| D12 | **Pending and Recurring stay in date order**: an in-app group goes in among the static groups at its date, not above them all | Found in the build: `renderBookings` put every in-app group at the top, so a pending payment for 04.11.2026 stood above the static 30.10.2026 and the list read November, October, November, which would show NOVEMBER twice |
| D11 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, a Multi-color theme, desktop and 390, keyboard, search, all three tabs); the baseline smoke test | Standard gate |

## Context

- `apps/web/all-bookings-and-payments.html`: the docked chip bar (line 2378, inside the sticky header) and the flow bar (line 2436) each carry five chips, Feb to Jun 2026. The Executed panel (line 2449) has 17 day groups; the five with `data-bookings-month-start` open a month (Today is June). Each group is followed by a `<div class="divider">`. Pending (line 2828) and Recurring (line 2866) hold dated groups ("Execute on …", "Next on …") in October and November 2026.
- `apps/web/js/all-bookings.js`: `setActiveMonth` and `scrollToMonth` (lines 82 to 111) with `getStickyOffset` (the sticky header's height); `bindMonthChips` (line 113); `syncDockA11y` (line 190) swaps `aria-hidden` and `tabIndex` between the bars when they merge, which is where focus is lost; `bindMonthMerge` (line 207); search (line 281) hides groups and dividers with `is-search-hidden` and keeps `monthAnchors`; `renderBookings` (line 411) adds the in-app rows and the Pending and Recurring groups, and runs again on `uzbank:state-changed`.
- `apps/web/css/styles.css`: `.divider` (line 1771), `.booking-group__header` (line 2006), the month chips (from line 2357), `.all-bookings__list.bookings-card` (line 2397).

## Open questions

None.
