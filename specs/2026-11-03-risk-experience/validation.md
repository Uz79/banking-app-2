# The risk experience: validation

Branch: `feature/risk-experience`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), through Overview > Offers > Investment to the risk step, on desktop (a 677 sheet) and at 390 in Light and Dark unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the risk step, the strategy step, the summary and Overview

## 2. The chart (D1 to D5)

- [ ] "Your {amount} over {n} years" with the amount from the amount step and the horizon's years (2, 5, 10, 15 for the four horizons)
- [ ] Three lines from the amount, the band between good and unfavourable, the end values as text in CHF with the change in percent; CHF 10'000 over 10 years gives about 24'500, 14'900 and 9'100 with the first values of D3
- [ ] Amounts CHF 5'000, CHF 50'000 and CHF 999'999: the axis and the end values fit, nothing overlaps, at both widths
- [ ] The footnote is there (or behind its toggle at 390, D11)
- [ ] Light, Dark and a Multi-color theme: only token colours, the highlight in the theme's accent
- [ ] Reduced motion: the lines and the highlight shown at once (the system setting switched, or the media query emulated; say which)

## 3. The scenarios and the scoring (D6 to D10)

- [ ] Each question in francs: question 1's three amounts are 90%, 80% and 75% of the amount; question 2's sure amounts 25% and 40%; question 3 unchanged
- [ ] The open question's part of the chart is highlighted: the unfavourable line, the band, the expected line; Change moves the highlight to the reopened question
- [ ] One question open at a time, the answered ones folded with their new wording and Change (9a D27)
- [ ] Same scoring: for each band (sums 0, 3, 5, 7, 9) the recommendation matches `main`'s; the horizon caps (under 3, 3 to 5) and the knowledge cap still apply
- [ ] Next with nothing answered: "Answer all three questions." under the first open question, focus on its first option
- [ ] A draft from before this branch with risk answers resumes on the risk step with those answers; the summary's "Risk profile" unchanged
- [ ] Keyboard: arrows move within the open question, Space and Enter choose and move on; focus always visible

## 4. Fit and the assistant (D11, D12)

- [ ] Desktop, 677 sheet: each of the three questions open in turn, nothing scrolls, Next visible
- [ ] 390 at 823: the same
- [ ] The assistant's risk chips: "How are these lines worked out?", "Why a sure amount or a chance?", "Is there a right answer?", "Can I change these answers?"; desktop column and phone layer

## 5. VoiceOver and touch (Klaudiusz on an iPhone, preview URL)

- [ ] The chart itself is skipped; the line above it, the end values and the footnote are read
- [ ] Each question is read with its options in francs
- [ ] Touch: choosing, Change and Next work; nothing scrolls

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider changes the character
- [ ] Legibility: a preset changes type and spacing app-wide
- [ ] ★ Theme: a Multi-color theme recolours the app; the UZ Bank card restores the default look
- [ ] Demo data reset restores the Household balance and removes the mandate

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components, Character kit and Payday run
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet.
