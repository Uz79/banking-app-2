# Phone polish of the fridge and the opening: validation

Branch: `feature/phone-polish`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), through Overview > Offers > Investment, at 390 in Light and Dark unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors in the fridge, every opening screen and Overview

## 2. The fridge on a phone (D1, D7, D8)

- [ ] 390: the sliders are the regular size; from 640 (the floating panel) still compact
- [ ] 390: every fridge step fits without scrolling, Next visible
- [ ] Touch and keyboard still move the sliders as before (steps, Page Up and Down, Home and End, the number fields)
- [ ] "Show suitable products": the cause of the pale look recorded in D7; the button now matches the app's primary button, Light, Dark and a Multi-color theme
- [ ] 390: "You could invest" above the ring, only the amount inside; CHF 0, CHF 29'400 and CHF 999'999 inside the ring with a margin, at the default and the largest Legibility font size
- [ ] Desktop (960 sheet): the result as before
- [ ] Reduced motion: the ring is drawn at once, as before

## 3. Next is never disabled (D4, D5)

- [ ] Fridge step 5 with no salary: Next looks enabled; a tap shows "Set your monthly salary to continue." under the salary and puts focus on its slider; setting a salary removes the message; then Next moves on
- [ ] Each opening screen with nothing answered (knowledge, purpose and horizon, amount, risk, strategy, ESG, tax, documents): a tap shows its message under the first missing question and moves focus to it; answering removes the message
- [ ] Strategy: "Choose a strategy first." under the current card, focus on its "Choose this strategy"; from Growth or Dynamic the carousel first moves to the recommended card; once chosen, Next reads "Continue with <name>"
- [ ] The same by keyboard (Enter and Space on Next), and on desktop
- [ ] Summary edits: "Back to summary" and "Next in this section" behave the same way
- [ ] Names: each message is read with its field (`aria-describedby`), checked in the page code
- [ ] No `disabled` left on a call-to-action in the fridge or the opening; the other disabled call-to-actions in the app are listed here and on the roadmap (D6)

## 4. The assistant's layer on a phone (D2, D3)

- [ ] Help? opens the layer over the whole sheet: "Questions about this step" and its own X at the top, the sheet's Back, title and X hidden
- [ ] The layer's X, "I can do it myself" and Escape close only the layer; focus returns to Help?; the sheet's header is back
- [ ] Tab and Shift+Tab stay inside the layer; the sheet's header cannot be reached while it is open
- [ ] Names: the layer is a modal dialog named "Questions about this step", its X "Close questions" (page code)
- [ ] Opens with a slide; with reduced motion at once
- [ ] Light, Dark and a Multi-color theme: the header reads as the sheet's
- [ ] Desktop: the assistant's column unchanged

## 5. Closing, keeping and resuming (D9 to D13)

- [ ] X and Escape ask "Leave for now?" / "Your progress is kept for this session, so you can continue where you left off." with "Keep going" and "Leave" on every fridge step (1 to 7) and every opening screen, the first ones included
- [ ] "Keep going" returns focus to where it was; "Leave" closes
- [ ] Completion and the booked appointment close without asking
- [ ] Reopen after leaving the fridge on steps 1, 4 and 7: the same step and values, no prefill over kept values; the scene in that step's pose (step 7: the persona standing, no walk-in)
- [ ] Reopen after leaving the opening on the intro, the strategy step and the summary: the same screen and answers; the fridge's values still kept
- [ ] Complete the opening, then Investment: the fridge at step 1 with the prefill (Household + Savings), nothing kept
- [ ] "Start over" on the opening's intro: the fridge at step 1, nothing kept
- [ ] Profile's demo data reset clears the draft
- [ ] A draft in the old shape (no `page`): Investment opens as before (the opening when its step is past the intro)
- [ ] First visit (no draft): the fridge at step 1 with the prefill
- [ ] Focus after a close: Investment has focus with a visible ring after Escape or Enter on X or Leave; no ring after a tap or click; the next Tab shows the ring
- [ ] Desktop: the same prompt, keeping and resuming

## 6. VoiceOver (D14, Klaudiusz on an iPhone, preview URL)

- [ ] The layer is announced as "Questions about this step", its X as "Close questions"
- [ ] Next with something missing: the message is read when focus lands on the field
- [ ] The strategy carousel's names still as in 9d ("Balanced, 3 of 5, recommended")
- [ ] The exit prompt reads its title and message

## 7. Baseline smoke test

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
