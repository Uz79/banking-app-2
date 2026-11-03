# The risk experience: validation

Branch: `feature/risk-experience`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), through Overview > Offers > Investment to the risk step, on desktop (a 677 sheet) and at 390 in Light and Dark unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (only the known notices about classic scripts)
- [x] The browser console shows no errors on the risk step, the strategy step, the summary and Overview (only the extension's own messages)

## 2. The chart (D1 to D5)

- [x] "Your {amount} over {n} years" with the amount from the amount step and the horizon's years (2, 5, 10, 15 for the four horizons, each seen)
- [x] Three lines from the amount, the band between good and unfavourable, the end values as text in CHF with the change in percent (desktop; a phone shows the amounts, D17); CHF 10'000 over 10 years gives 24'500, 14'900 and 9'100
- [x] Amounts CHF 5'000, CHF 50'000 and CHF 999'999 (good end CHF 3'344'400 over 15 years): the end values fit, nothing overlaps, at both widths (the phone's columns measured, no overflow)
- [x] The footnote behind "How is this worked out?" at both widths; it shows in place of the plot and the values, "Back to the chart" returns; `aria-expanded` follows
- [x] Light, Dark and Custom 06 (Multi-color): only token colours, the highlight in the theme's accent (orange in Custom 06); the UZ Bank theme restored
- [ ] Reduced motion: the lines and the highlight shown at once. Not checked: the system setting was not switched; the CSS has the reduced-motion rule for the draw-in, the fade and the transitions

## 3. The scenarios and the scoring (D6 to D10)

- [x] Each question in francs: question 1's three amounts are 90%, 80% and 75% of the amount; question 2's sure amounts 25% and 40%; question 3 as before (D9 amended)
- [x] The open question's part of the chart is highlighted: the unfavourable line, the band, the expected line (`data-part` bad, band, expected, none once all are answered); Change moves the highlight to the reopened question
- [x] One question open at a time, the answered ones folded into one line with their number, answer and Change (D16)
- [x] Same scoring: sums 0, 3, 5, 7, 9 give Income, Conservative, Balanced, Growth, Dynamic (the bands of 9a D12); 9 under 3 years gives Conservative, 3 to 5 years Balanced, knowledge None Balanced. A full pass (6 points) gave Growth on the strategy step and the summary's "Risk profile"
- [x] Next with nothing answered: "Answer all three questions." under the first open question, tied to it (`aria-describedby`), focus on its first option; the message moves to the next open question and nothing scrolls with it, at both widths
- [x] A draft in the existing shape with risk answers resumes on the risk and strategy steps with those answers (the ids are unchanged); the summary's rows unchanged
- [x] Keyboard (real keys): Arrow Down twice and Enter chose "At CHF 37'500" and moved focus to question 2 with a visible ring

## 4. Fit and the assistant (D11, D12)

- [x] Desktop, 677 sheet (621px panel): each question open in turn, each reopened with Change, the footnote open, nothing scrolls, with CHF 5'000, 50'000 and 999'999
- [x] 390 at 823 (752px panel): the same
- [x] The assistant's risk chips: "How are these lines worked out?", "Is there a right answer?", "Why a sure amount or a chance?", "Can I change these answers?"; desktop column and phone layer; the first one's answer read

## 5. VoiceOver and touch (Klaudiusz on an iPhone, preview URL)

- [x] The chart itself is skipped; the line above it, the end values and the footnote are read
- [x] Each question is read with its options in francs
- [x] Touch: choosing, Change and Next work; nothing scrolls

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone, a 390 frame in Dark); the 3D character's canvas is in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload (desktop)
- [x] Navigating Overview → Account details → All bookings and back
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. Checked: it is there. Not checked: the dismissal

### 3. Banking flows

- [x] ★ Pay: recipient search ("Lena") → recipient → amount → schedule → summary → confirm (desktop, Light; not repeated at 390). Household went from 9'300 to 9'400 after CHF 500: the oldest booking's refund, roadmap 14, not from this branch
- [x] Internal transfer completes (Savings 25'500)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (X and Discard)
- [x] All bookings: tabs, month chips and search work ("Migros" found two)

### 4. Profile

- [x] ★ User Type: moving a slider changes the character (End and Home on financial knowledge; back to zero)
- [x] Legibility: a preset changes type and spacing app-wide (it was on Large, now Regular, the default)
- [x] ★ Theme: Custom 06 recolours the opening; the UZ Bank card restores the default look
- [x] Demo data reset restores the Household balance (9'900) and Savings (25'000)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components, Character kit and Payday run
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (from Components)
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation. Not checked: the system setting was not switched

Checked on 2026-11-03 against `feature/risk-experience`, Chrome on the agent's server (port 5199): the phone as a 390×823 frame of Overview, desktop in the 1440×823 window and a 1440×823 frame (a 677 sheet, 621px panel); Light, Dark and Custom 06; real keys for the risk options and Overview's focus, scripted clicks elsewhere; heights measured in the page. Section 5 (VoiceOver and touch) checked by Klaudiusz on an iPhone on the Vercel preview, 2026-11-03. Not checked: the system reduced-motion setting, the starred baseline items at 390 except Overview, the status message's dismissal, the Pay flow at 390. Known and not from this branch: the Pay schedule step names Hans Meyer, the oldest booking's refund (roadmap 14).
