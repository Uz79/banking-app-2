# Fridge result: the amount fits its ring on desktop (26): validation

Branch: `feature/fridge-ring-desktop`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

The result is step 7 of the fridge: Overview → Offers → Investment, then Next through the steps.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The ring on the floating panel (D1 to D3)

- [x] CHF 0: on one line at the same size as before (`--fs-h4`)
- [x] A five-digit amount (for example CHF 26'900): on one line, inside the ring
- [x] CHF 280'000 (every slider at its maximum): on one line, the line's box at least 4 px inside the inner circle, measured from the DOM
- [x] The widest amounts, CHF 500'000 and CHF 999'999 (set in the ring's text for the check): the same 4 px margin
- [x] "You could invest" stays inside the ring above the amount, and its box is inside the inner circle too
- [x] The ring is still 11rem; "Left each year" and the note are unchanged
- [x] At 640px (the narrowest floating panel) the same holds
- [x] With Legibility on Large and on Small, the result looks the same as on Regular (D5: it doesn't reach the fridge)

## 3. Everywhere

- [x] Phone width (390): unchanged from phone polish D8 (the label above the ring, only the amount inside)
- [x] Light and Dark, and a Multi-color theme: the amount reads clearly
- [x] Reduced motion: the bar is drawn at once, the amount as above
- [x] The fridge opened on its own (`fridge-advisor.html`) at desktop width looks the same as in the sheet

## 4. Baseline smoke test

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
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation (not run: the agent can't change the system setting; this branch adds no motion)

## Notes

- **Measured fits (2):** in a 176 px ring the inner circle's radius is 70.4 px. Amount line margins: CHF 0 21.5 px at 32px; CHF 26'900 9.7 px at 24.6px; CHF 280'000 9.3 px, CHF 500'000 8.9 px and CHF 999'999 10.8 px at 22.4px; the label 15 to 19 px. The phone's `155cqw` was tried and left 2.8 px for CHF 500'000, so `140cqw` (D1).
- **The widest amounts** were put into the ring's text and `--ring-chars` by hand; every slider at its maximum gives CHF 280'000, and reaching CHF 500'000 through the sliders (every reserve at 0) was not tried.
- **Reduced motion (3):** checked with the fridge's `?reduced` switch (the bar is drawn at its value at once), not the system setting.
- **Legibility (2):** Small and Large written to `uzBankWebAppearance` in turn and the fridge reloaded: the same 22.4px amount and 176 px ring; the value was then written back exactly.
- **Buy (baseline 3):** opened from the position page directly, not by way of Custody account. Its dialog's "Continue payment" is the known roadmap 30.
- **Desktop width:** the browser window was 1605 CSS px wide, not 1440; 640, 1000, 1200 and 390 checked in iframes.

Checked on 2026-11-04 against `feature/fridge-ring-desktop` (ec2d229), Chrome on macOS, on the agent's server (port 5199): the fridge in the Overview sheet and on its own; Light (UZ Bank) and Dark (Custom 06); desktop (1605 CSS px), iframes at 1200, 1000, 640 and 390; real Tab keys on Overview. Theme, Light, Legibility and User Type restored, the demo reset run. Not checked: the real reduced-motion system setting, Safari, a 1440 px window.
