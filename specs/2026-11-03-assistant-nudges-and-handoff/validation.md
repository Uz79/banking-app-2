# The assistant, second version (9f): validation

Branch: `feature/assistant-nudges-and-handoff`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), through Overview > Offers > Investment, on desktop (a 960 sheet) and at 390 in Light and Dark unless an item says otherwise. `?nudge=fast` (D4) where an item waits for time.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings (only the known notices about classic scripts)
- [ ] The browser console shows no errors in the opening, the fridge and Overview (only the extension's own messages)

## 2. The signals and the thresholds (D1 to D5)

- [ ] Newbie: every counted step nudges after 1.5x its reading time (intro to summary); completion and the exit screen never
- [ ] All-rounder, and no stored User Type: only knowledge, amount, risk, tax and documents nudge, after 2.5x
- [ ] Power user: no nudge on any step, whatever the signals
- [ ] Switching an answer a third time on knowledge or risk nudges at once (Newbie and All-rounder)
- [ ] Going back to a step a second time, a second "What counts?" on tax, a second open of the information sheets, the amount field left empty: each nudges at once
- [ ] The clock pauses while the tab is hidden and while the conversation is open on that step, and starts over on the next visit
- [ ] Without `?nudge=fast` a nudge waits the full time (one step timed with a stopwatch)

## 3. The nudge (D6 to D11)

- [ ] Desktop: the invitation shows the step's question, "Show me" and "No, thanks"; "Show me" opens the conversation with the question asked and answered; "No, thanks" brings back "Questions about this step?" and "Yes, help me"
- [ ] Phone: the bubble rises above Help? with the question and its X; a tap opens the layer with the answer; the X dismisses it; it is gone on the next step and when Help? is tapped
- [ ] One nudge per step: a step that nudged never nudges again, also after closing the sheet and resuming; a step whose question the customer already asked never nudges
- [ ] The escalation (D10): the third nudge, and a nudge on documents or summary, carries "Talk to an advisor"
- [ ] Focus never moves by itself; the status region reads "A question about this step: ..." once
- [ ] The bubble covers nothing needed and every step still fits without scrolling at 390 (risk with each question open)
- [ ] Keyboard: "Show me", "No, thanks", the bubble and its X reachable and working, with a visible ring
- [ ] Light, Dark and a Multi-color theme: tokens only, readable; the UZ Bank theme restored after
- [ ] Reduced motion: the bubble and the invitation change appear at once, the helper does not wave
- [ ] An old draft without `nudged` or `handoff` resumes normally

## 4. The handoff (D12 to D16)

- [ ] "Talk to an advisor" (chip and quiet button) offers "Call me back" and "Book a video meeting"
- [ ] Three times each: never in the past, never on a weekend, within 8:00 to 18:00 (a weekday morning, a weekday evening and a Saturday, the clock faked)
- [ ] Choosing one shows the confirmation and "Your answers are kept."; on another step "Talk to an advisor" shows the booking with "Choose another time" and "Cancel it"; both work
- [ ] The booking survives closing the sheet and resuming; a booking in the past is gone
- [ ] The exit screen's "Book an appointment" opens the handoff (desktop column, phone layer) and the screen then shows the booking with Done
- [ ] No field asks for a name, a number or an email; nothing leaves the browser (the network panel shows no request on booking)
- [ ] Completion and Start over clear the booking and the nudges with the draft

## 5. Documentation (D19)

- [ ] Components: "Questions and answers" shows the nudge (desktop invitation and phone bubble) and the handoff, in Light and Dark

## 6. VoiceOver and touch (Klaudiusz on an iPhone, preview URL)

- [ ] The nudge is announced once and the bubble's question and X are read
- [ ] The handoff's choices and times are read as buttons; the confirmation is read
- [ ] Touch: the bubble, its X and the time chips work; nothing scrolls on the steps

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
