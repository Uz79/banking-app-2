# Focus rings app-wide (25): validation

Branch: `feature/focus-rings`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Keyboard checks use real keys, not scripted focus.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the only entries were a browser extension's "message channel closed", not the app)

## 2. The rule (D1 to D5)

- [x] The month chip on All bookings: no browser ring after a click, in the list and docked in the sticky header, desktop and 390; from the keyboard it shows the app's ring, whole (D11). Not on a touch device: a tap was not tried
- [x] The cause of the month chip's ring is recorded (D5): the chip had no ring of its own, so Tab got the browser's; a click never matched `:focus-visible`
- [x] Buttons, links, chips, cards, tabs and sliders: a ring from the keyboard, none after a click (Overview's action buttons and cards, Profile's tabs and User Type slider, All bookings' tabs and chips, the Pay sheet's rows and buttons)
- [x] Text fields (the Pay amount, the recipient fields, the bookings search, the Buy amount, the opening's amount): the focused stroke or ring shows on a click and from the keyboard, as before (D3). The Profile hex field in the colour dialog likewise
- [x] The flows' step headings and the assistant's title get no ring when focus moves to them (D4): the opening's headings, the assistant's title on desktop and in the phone layer
- [x] Elements whose ring sits on a child (the action buttons' circle, the debit account, the colour sliders' thumb) look as before

## 3. The tokens and the audit (D6, D7)

- [x] Every page in `vite.config.js` (16) tabbed through with real keys; no element with the browser's ring or no ring, except the exceptions below. `index` and `account-information` redirect (to Overview and to Account details' section) and were audited where they land
- [x] The flows and dialogs: Pay (every step and "Discard payment?"), internal transfer (and "Discard transfer?"), trade (Buy, and "Discard order?"), the fridge (every step and the result), the opening with its assistant (desktop column; the phone layer at 390 inside the Overview sheet), the Profile colour dialog ("Set neutral color", Profile's only dialog), the Playground and its settings. Not checked: the "Leave for now?" dialog of the fridge and the opening (its buttons are the same `uz-btn` as the "Discard …" dialogs, which pass)
- [x] A Multi-color theme (Custom 06): every ring took the accent (`#e06900`), including the payment rows and the currency button (D6); the UZ Bank card restores the default (`#00157E`, no stored override)
- [x] Light and Dark, desktop and 390: the rings are readable on every background they were seen on (Light navy, Dark white, Custom 06 orange on the dark cards). 390 was checked in frames: Overview in Dark, the opening's sheet and phone layer in Light
- [x] Accessible names in the page tree unchanged: the rule is CSS only; the one markup change (D13) adds `tabindex="-1"` to the two month bars, which keep their role and name (group "Month")

Exceptions found by the audit, each with its reason:

- No ring on the element itself, drawn elsewhere on purpose (D3, as before): the action buttons (on their circle), the colour sliders and the hue slider (on the thumb), the select (inset shadow), the text fields and the bookings search (the wrapper's stroke), the opening's amount (the box's outline).
- No ring by design (D4): the step headings and the assistant's title, which only receive focus from script.
- Fixed in this branch: a focusable scroller with the browser's ring (D12) and the hidden docked month bar as a Tab stop (D13).
- Found, not fixed here (roadmap): Tab leaves the Pay and Buy sheets for the page behind (27); focus drops to the page after a month chip docks the bar (with 24); the fridge result's amount crosses its ring on desktop with Large type (26).

## 4. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop, the character lower right) and with the tab bar in a 390 frame in Dark
- [x] ★ Light/Dark toggle switches and survives a reload (desktop)
- [x] Navigating Overview → Account details → All bookings and back by the back arrows (the transitions' directions not judged)
- [x] The "Open payment!" status message is there on Overview; a tap dismisses it (the 12 s not timed)

### 3. Banking flows

- [x] ★ Pay: recipient → amount → schedule → summary → Execute; Household 9'900 to 9'400 and the booking listed (desktop, Light; not at 390)
- [x] Internal transfer completes: CHF 500, Household 8'900, Savings 25'500
- [x] Custody account → Apple Inc. → Buy opens the trade flow and is dismissed (X, Discard)
- [x] All bookings: the tabs switch, a month chip scrolls to its month, "Migros" finds 2

### 4. Profile

- [x] ★ User Type: End on financial knowledge puts the wizard hat on the character; Home puts it back (desktop)
- [x] Legibility: Compact changes the stored scale and the page; the stored value set back exactly as found (Large). Typeface, Font and Paddings not tried
- [x] ★ Theme: Custom 06 recolours the app (orange rings, buttons and chart, desktop, Light and Dark); the UZ Bank card restores the navy look
- [x] Demo data reset restores the Household balance (9'900, Savings 25'000)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components, Character kit and Payday run (the arrows' motion not judged)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and "Max · Power user" changes the figure

### 6. Accessibility

- [x] Tab through Overview (real keys): focus always visible, the app's ring on every stop, on the action buttons a ring on their circle
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: the system setting was not switched; this branch adds no motion

Checked on 2026-11-03 against `feature/focus-rings`, Chrome on the agent's server (port 5199): desktop at 1512 wide, the phone as 390 frames (Overview in Dark, the opening in the Overview sheet in Light); Light, Dark and Custom 06; real Tab, Shift+Tab, Enter, Home and End keys, with a focus logger recording each stop's outline and shadow; clicks for the no-ring checks. The test payment and transfer were cleared with the demo reset; theme (Light, UZ Bank), legibility (Large) and User Type left as found. Not checked: Safari, a touch device (taps), VoiceOver (D10: not part of this gate), the system reduced-motion setting, the starred baseline items at 390 other than Overview, Typeface, Font and Paddings.
