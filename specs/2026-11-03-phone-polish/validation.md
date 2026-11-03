# Phone polish of the fridge and the opening: validation

Branch: `feature/phone-polish`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), through Overview > Offers > Investment, at 390 in Light and Dark unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors in the fridge, every opening screen and Overview (only Vite's dev client in the emptied test page and the extension's own messages)

## 2. The fridge on a phone (D1, D7, D8)

- [x] 390: the sliders are the regular size (24px); from 640 (the floating panel) still compact (16px)
- [x] 390: every fridge step fits without scrolling, Next visible (steps 1 to 7 measured)
- [x] Keyboard still moves the sliders as before (Arrow Right, Page Up, Home, the number fields). Touch on a real phone not tried
- [x] "Show suitable products": the cause of the pale look recorded in D7 (the hover colour sticking after a tap); the base colour is the primary's in Light and Dark (measured), Custom 06 checked on the opening's Next. The touch fix itself needs a real touch screen (Klaudiusz's phone)
- [x] 390: "You could invest" above the ring, only the amount inside; CHF 0 (28px), CHF 26'900 (21px, 92 wide), CHF 482'000 (a real result, 94 wide) and CHF 999'999 (91 wide) inside the 109px inner circle. Legibility's font size does not reach the fridge page (no `app-mp.js`), so the largest size does not apply
- [x] Desktop (960 sheet): the result as before (label inside, 11rem ring)
- [ ] Reduced motion: the ring is drawn at once, as before. Not checked: unchanged code, the system setting was not switched

## 3. Next is never disabled (D4, D5)

- [x] Fridge step 5 with no salary: Next looks enabled; a tap shows "Set your monthly salary to continue." under the salary and puts focus on its slider; setting a salary removes the message; then Next moves on
- [x] Each opening screen with nothing answered (knowledge, purpose and horizon, amount, risk, strategy, ESG, tax, documents with the sheets list open): a tap shows its message under the first missing question and moves focus to it; answering removes the message, or moves it to the next missing question
- [x] Strategy: "Choose a strategy first." under the cards, focus on the current card's "Choose this strategy"; from Dynamic the carousel first moved to the recommended card; once chosen, Next reads "Continue with <name>". Desktop at a 677 sheet: no scrolling, figure 143px
- [ ] The same by keyboard (Enter and Space on Next), and on desktop. Checked: desktop (strategy). Not checked: Enter and Space on Next (the same click handler)
- [x] Summary edits: "Next question" and "Back to summary" behave the same way (Buy a home cleared the horizon; both buttons showed the horizon's message)
- [x] Names: each message is read with its field (`aria-describedby`, kept alongside a field's own descriptions), checked in the page code
- [x] No `disabled` left on a call-to-action in the fridge or the opening; the other disabled call-to-actions in the app: Profile's "Reset demo data" only (roadmap 22)

## 4. The assistant's layer on a phone (D2, D3)

- [x] Help? opens the layer over the whole sheet: "Questions about this step" and its own X at the top, the sheet's Back, title and X hidden and inert
- [x] The layer's X and Escape close only the layer; focus returns to Help?; the sheet's header is back. "I can do it myself" uses the same close (9b), not clicked again
- [x] Tab and Shift+Tab stay inside the layer (real keys: from the title back to "I can do it myself", forward to the X); the sheet's header cannot be reached while it is open; a second Escape asks to leave
- [x] Names: the layer is a modal dialog named "Questions about this step", its X "Close questions" (page code)
- [ ] Opens with a slide; with reduced motion at once. Checked: the slide. Not checked: the system setting (the CSS has the reduced-motion rule)
- [x] Light, Dark and Custom 06: the header reads as the sheet's
- [x] Desktop: the assistant's column unchanged (the bar hidden, the title in the column)

## 4a. The assistant's container on desktop (D16 to D18)

- [x] No line between the step and the assistant, none above "I can do it myself"; the summary's section lines stay
- [x] After "Yes, help me": the conversation in a rounded container with a space-1 padding, the secondary background and a separator stroke; the customer's lines and "I can do it myself" on the page background; Light (a shade darker) and Dark (a shade lighter)
- [x] "I can do it myself" level with Next (both 573 to 613 in a 677 sheet)
- [x] The invitation stays on the sheet's background, no container
- [ ] The phone's layer: no line above "I can do it myself", nothing else changed. Checked in the CSS (every new rule is under `.assistant--wide`), not looked at in the browser

## 5. Closing, keeping and resuming (D9 to D13)

- [x] X and Escape ask "Leave for now?" / "Your progress is kept for this session, so you can continue where you left off." with "Keep going" and "Leave": checked on fridge steps 1, 5 and 7 and on the opening's intro, strategy, summary and purpose; the rule is one line for every screen
- [x] "Keep going" returns focus to where it was; "Leave" closes
- [x] Completion and the booked appointment close without asking
- [x] Reopen after leaving the fridge on steps 5 and 7: the same step and values, no prefill over kept values, the prefill note kept; the scene in that step's pose (step 7: the persona standing, no walk-in)
- [x] Reopen after leaving the opening on the intro, the ineligible screen and the summary: the same screen and answers; the fridge's values still kept
- [x] Complete the opening, then Investment: the fridge at step 1 with the prefill (Household + Savings), nothing kept
- [x] "Start over" on the opening's intro: the fridge at step 1, nothing kept
- [x] Profile's demo data reset clears the draft
- [x] A draft in the old shape (no `page`): Investment opens as before (the opening at step 2, the fridge at step 0)
- [x] First visit (no draft): the fridge at step 1 with the prefill
- [x] Focus after a close: Investment has focus with a visible ring after Escape and Enter on Leave (real keys); no ring after a click on X and Leave (real clicks, `:focus-visible` false); the next Tab shows the ring. A tap on a real phone not tried
- [ ] Desktop: the same prompt, keeping and resuming. Checked at 390; the code has no width rule for it. Desktop resume checked on the strategy step only

## 6. VoiceOver (D14, Klaudiusz on an iPhone, preview URL)

- [ ] The layer is announced as "Questions about this step", its X as "Close questions"
- [ ] Next with something missing: the message is read when focus lands on the field
- [ ] The strategy carousel's names still as in 9d ("Balanced, 3 of 5, recommended")
- [ ] The exit prompt reads its title and message

## 7. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop (its canvas there; the tab bar seen in the 390 frame)
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back (the pages; the transitions' direction not judged by eye)
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. Checked: it is there after 14 s. Not checked: the dismissal

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; Household 9'900 → 9'400 (desktop, Light; not repeated at 390)
- [x] Internal transfer completes (Savings shows +500 in All bookings)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (by X and Discard; Escape did nothing there, not from this branch)
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider changes the character (End and Home on financial knowledge; back to zeros)
- [x] Legibility: a preset changes type and spacing app-wide (Large, then Regular); the manual controls not tried
- [x] ★ Theme: Custom 06 recolours Overview, Profile, the Design system and the opening (primary buttons and the messages take the accent); the UZ Bank card restores the default look
- [x] Demo data reset restores the Household balance (9'900) and removes the mandate

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components, Character kit and Payday run (arrows not watched)
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub. Checked: Character kit. Not checked: Motion, Components
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: the system setting was not switched

Checked on 2026-11-03 against `feature/phone-polish`, Chrome on the agent's server (port 5199): the phone as a 390×823 frame of Overview in the 1440×823 window, desktop in a 1440×823 frame (a 677 sheet) and the real pages; Light, Dark and Custom 06; real key presses and clicks for the focus and the layer's keyboard, scripted clicks elsewhere. Not checked: VoiceOver (section 6, Klaudiusz on an iPhone), a real touch screen (the sticky hover fix, slider touch, the quiet focus after a tap), the system reduced-motion setting, Enter and Space on Next, the full keep-and-resume set on desktop, the baseline's starred items at 390 and the status message's dismissal, Motion and Components. Known and not from this branch: Escape does nothing in the trade flow, "Continue payment" in its discard prompt, the 9d changelog line that still says Next is disabled (superseded by this branch's Changed entry).
