# Focus rings app-wide (25): validation

Branch: `feature/focus-rings`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Keyboard checks use real keys, not scripted focus.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited

## 2. The rule (D1 to D5)

- [ ] The month chip on All bookings: no browser ring after a click or a tap, in the list and docked in the sticky header, desktop and 390; from the keyboard it shows the app's ring
- [ ] The cause of the month chip's ring is recorded (D5)
- [ ] Buttons, links, chips, cards, tabs and sliders: a ring from the keyboard, none after a click or tap (one of each kind, on Overview, Profile, All bookings and in the Pay sheet)
- [ ] Text fields (the Pay amount, the bookings search, a Profile field): the focused stroke shows on a click and from the keyboard, as before (D3)
- [ ] The flows' step headings and the assistant's title get no ring when focus moves to them (D4)
- [ ] Elements whose ring sits on a child (the action buttons' circle, the debit account, the colour sliders) look as before

## 3. The tokens and the audit (D6, D7)

- [ ] Every page in `vite.config.js` (16) tabbed through with real keys; no element with the browser's ring or no ring, or each exception listed below with its reason
- [ ] The flows and dialogs: Pay, internal transfer, trade (Buy), the fridge, the opening with its assistant (desktop column and phone layer), the "Leave for now?" dialog, the Profile dialogs, the Playground and its settings
- [ ] A Multi-color theme: every ring takes the accent, including the payment rows (D6); the UZ Bank card restores the default
- [ ] Light and Dark, desktop and 390: the rings are readable on every background they sit on
- [ ] Accessible names in the page tree unchanged on the pages audited

Exceptions found by the audit: none yet.

## 4. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet.
