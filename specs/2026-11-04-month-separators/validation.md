# All bookings: month separators (24): validation

Branch: `feature/month-separators`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

Pages: `all-bookings-and-payments.html?account=household` and `?account=savings`.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The separators (D1 to D4)

- [x] Executed: JUNE above Today, then MAY, APRIL, MARCH, FEBRUARY, each above its month's first day; no divider line directly above a separator; no year (one year only)
- [x] Pending and Recurring: OCTOBER and NOVEMBER above their dated groups
- [x] An in-app pending payment (made in the Pay sheet with "As soon as possible" off) appears under its month's separator; an in-app payment that crosses into a new month gets a new separator
- [x] A list that crosses a year shows the year on every separator of that tab ("DECEMBER 2025"), checked with a pending booking dated in another year put into the stored state
- [x] First visit (nothing in the payment state): the separators show as above
- [x] Screen reader structure: each separator is an `h2` whose text is the month in normal case ("May"); the headings list reads the months in order (read from the DOM)

## 3. Chips and scroll (D5, D6)

- [x] Each chip scrolls its separator to just under the docked chips, and that chip is active
- [x] Scrolling by hand: each month's chip becomes active as its separator passes under the docked chips; back at the top, Jun is active
- [x] A chip's scroll from Jun to Feb doesn't flick through the months between
- [x] The Pending and Recurring tabs show no chips (unchanged), and switching back to Executed starts at the top with Jun active

## 4. Search (D7)

- [x] "Rent": only the months with a matching row keep their separator; the others' chips are dimmed; clearing brings every separator back
- [x] A query with no match hides every separator and shows "No bookings match"

## 5. Keyboard and focus (D8)

- [x] Tab to a chip in the flow bar and press Enter: the list scrolls, the chips dock, and focus is on the same month's chip in the docked bar with its ring visible; the next Tab goes on from there
- [x] Scrolling back to the top with focus on a docked chip: focus moves to the same chip in the flow bar
- [x] A click on a chip does the same (focus stays on the chip, the ring only for keyboard focus)

## 6. Everywhere

- [x] Light and Dark, and a Multi-color theme: the band and its text read clearly and use the theme's colours
- [x] Phone width (390): the separators span the card; the chips, the scroll and the active chip work; no sideways scroll
- [x] Reduced motion: a chip jumps to its month without the smooth scroll (D10)

## 7. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation (not run: the agent can't change the system setting; this branch adds no page transition or character motion)

## Notes

- **Reduced motion (6):** checked by stubbing `window.matchMedia` so `prefers-reduced-motion: reduce` matches: the chip jumps (`behavior: 'auto'`) and lands 8 px under the header like the smooth one. The real system setting was not toggled.
- **First visit (2):** checked in the state the demo reset leaves (no bookings in the payment state), not with `localStorage` fully cleared.
- **In-app and cross-year bookings (2):** pending and recurring bookings were made with `UZBankPayState.commitPayment` in the console (October, November, December 2026 and January 2027) as well as through Pay; Recurring then read "November 2026", "January 2027".
- **Desktop width:** the browser was zoomed out, so "desktop" was 2407 CSS px wide rather than 1440; phone width in a 390 x 760 iframe.
- **Two fixes made during validation:** switching back to Executed resyncs the active chip (it kept the month it had before the switch), and a pixel short of the list's end counts as the end (it showed Mar instead of Feb).

Checked on 2026-11-04 against `feature/month-separators` (038d2c8), Chrome on macOS, on the agent's server (port 5199): Light and Dark, the UZ Bank and Custom 01 themes, desktop (2407 CSS px) and 390 x 760, keyboard, search, all three tabs on Household and Savings. Not checked: the real reduced-motion system setting, a first visit with `localStorage` fully cleared, a 1440 px window.
