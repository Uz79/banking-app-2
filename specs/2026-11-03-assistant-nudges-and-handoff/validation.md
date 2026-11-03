# The assistant, second version (9f): validation

Branch: `feature/assistant-nudges-and-handoff`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), through Overview > Offers > Investment, on desktop (a 960 sheet) and at 390 in Light and Dark unless an item says otherwise. `?nudge=fast` (D4) where an item waits for time.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (only the known notices about classic scripts)
- [x] The browser console shows no errors in the opening (a nudge, Show me and a booking), Overview, Character kit and Motion (only Vite's and the extension's own messages). The fridge's own steps were not visited

## 2. The signals and the thresholds (D1 to D5)

- [x] Newbie: every counted step nudges after 1.5x its reading time (intro to summary, a scripted walk with `?nudge=fast`, none early); completion and the exit screen have no entry in `NUDGES`, so they never nudge (read, not timed)
- [x] All-rounder: only knowledge, amount, risk, tax and documents nudge, after 2.5x (a scripted walk). No stored User Type was not tried separately; it reads as All-rounder through 9b's `level()`
- [x] Power user: no nudge on knowledge after four changes and 7 s with `?nudge=fast`
- [x] Switching an answer a third time nudges at once (knowledge, Newbie, at full speed); changes within a second count once. Found and fixed: a first change within a second of loading the page was not counted
- [x] Going back to strategy a second time, a second "What counts?" on tax, the amount field left empty, and every strategy card seen: each nudges at once. The documents' information sheets were not tried
- [x] The clock pauses while the tab is hidden (`document.hidden` faked for 4 s) and while the conversation is open (5 s in help, then the nudge about 3 s after "I can do it myself")
- [x] Without `?nudge=fast` a nudge waits the full time: the Newbie intro nudged 22.7 s after loading (22.5 s expected)

## 3. The nudge (D6 to D11)

- [x] Desktop: the invitation shows the step's question, "Show me" and "No, thanks"; "Show me" opens the conversation with the question asked and answered (focus on the panel's title, fixed in the build); "No, thanks" brings back "Questions about this step?" and "Yes, help me" (focus on it)
- [x] Phone (a 390×823 frame): the bubble rises above Help? with the question and its X; a tap opens the layer with the answer; the X dismisses it and focus returns to Help?; it is gone on the next step
- [x] One nudge per step: a step that nudged did not nudge again after the sheet reloaded and resumed. A step whose question was already asked: in the code (`wasAsked`), not tried
- [x] The escalation (D10): the third nudge, and the first nudge on documents and on summary, carry "Talk to an advisor" (desktop) and "Or talk to an advisor" (phone); it opens the handoff
- [x] Focus never moves by itself; the status region reads "A question about this step: What counts as basic knowledge?"
- [x] The bubble covers nothing needed at 390: its top is at 604px; the risk step's lowest option ends at 481 (question 1 open) and 503 (question 3 open), the documents' checkbox at 392, the summary's last section at 471; the summary does not scroll. Measured with Legibility on Large, as it was set
- [x] Keyboard (real keys, phone frame): Tab from the last option reaches the bubble's question, then its X with a visible ring; Enter dismisses and focus goes to Help?. The bubble comes before Help? in the Tab order (fixed in the build). Desktop's "Show me" and "No, thanks" are plain buttons, used by script
- [x] Light, Dark (desktop invitation and phone bubble) and Custom 06 ("Show me" in its orange accent): tokens only, readable; the UZ Bank theme restored after
- [x] Reduced motion: the bubble and the invitation change appear at once, the helper does not wave (Klaudiusz, iPhone, system setting, preview at `8612b11`; the layer also opens and closes at once)
- [x] An old draft without `nudged` or `handoff` resumes normally (the Newbie walk started from one)

## 4. The handoff (D12 to D16)

- [x] "Talk to an advisor" (the quiet button, the documents' chip, the nudge's advisor) offers "Call me back" and "Book a video meeting"
- [x] Three times each: never in the past, never on a weekend, within 8:00 to 18:00. Checked with `slotsFor` in Node for 8 clocks (Tuesday 7:10, 13:20, 15:00, 16:30, 22:00, Friday 16:30, Saturday 10:00, Sunday 23:30) and in the browser on a Tuesday evening
- [x] Choosing one shows the confirmation and "Your answers are kept."; on another step "Talk to an advisor" shows the booking with "Choose another time" and "Cancel it"; both work. Changed in the build: once booked or cancelled, "Talk to an advisor" comes back on that step too
- [x] The booking survives the sheet reloading; a booking that ended is gone, one still running is kept until it ends, an invalid one is ignored
- [x] The exit screen's "Book an appointment" opens the handoff (desktop column, phone layer) and the screen then shows the booking with Done, without announcing the step again
- [x] No field asks for a name, a number or an email; no request on booking (no new resource entries)
- [x] Completion clears the booking and the nudges with the draft (the draft is gone). Start over not tried; it clears the same draft

## 4b. Review change: the layer slides down (D21)

- [x] Phone at 390, Light and Dark: the layer's X, "I can do it myself" and Escape each slide the layer down (computed: `assistant-layer-out` 0.28s `cubic-bezier(0.4, 0, 1, 1)`; hidden after 300 to 305 ms); it opens with `assistant-layer-in` 0.35s `cubic-bezier(0.22, 1, 0.36, 1)`. Paused halfway in both themes: the step shows above, the layer's background is solid
- [x] Focus lands on Help? only once the slide has finished (not on it 60 ms in), and the sheet's header comes back then (still hidden mid-slide). Escape closes only the layer, the sheet stays open
- [x] Opening Help? again 100 ms into a close works: the layer is open, with no leftover slide
- [x] Reduced motion (`matchMedia` faked to reduce in the frame): no slide for any of the three, the layer is gone at once and focus is on Help?. Found and fixed: the first version left the layer stuck open on this path
- [x] Desktop (1440): "I can do it myself" brings the invitation back at once with focus on "Yes, help me", no slide class. The handoff's confirmation stays in the open layer (nothing closes it), as D21 says
- [x] `npm run build` succeeds

## 5. Documentation (D19)

- [x] Components: two new sections after "Questions and answers", the nudge (desktop invitation and phone bubble) and the handoff, in Light and Dark

## 6. VoiceOver and touch (Klaudiusz on an iPhone, preview URL)

- [x] The nudge is announced once and the bubble's question and X are read (Klaudiusz, iPhone, VoiceOver, preview at `b4b1e1c`)
- [x] The handoff's choices and times are read as buttons; the confirmation is read (Klaudiusz, iPhone, VoiceOver, preview at `b4b1e1c`)
- [x] Touch: the bubble, its X and the time chips work; nothing scrolls on the steps (Klaudiusz, iPhone, preview at `8612b11`)

## 7. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (read on Overview, the opening, Character kit and Motion)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop, its canvas in the lower right); in a 390 frame in Dark it loads and opens Investment (the tab bar not looked at)
- [x] ★ Light/Dark toggle switches instantly and survives a reload (desktop)
- [x] Navigating Overview → Account details → All bookings and back (the directions not judged)
- [x] The "Open payment!" status message is there on Overview; tapping it collapses it into its small bar

### 3. Banking flows

- [x] ★ Pay: "Lena" → Lena Fischer → CHF 500 → schedule → summary → Execute; Household 9'900 to 9'400 and one booking (desktop, Light; not at 390). The schedule step names Hans Meyer, known
- [x] Internal transfer completes (Savings 25'500)
- [x] Custody account → Apple Inc. → Buy opens the trade flow and is dismissed (X, Discard)
- [x] All bookings: tabs and search work ("Migros" found two); the month chips are there (10), not clicked

### 4. Profile

- [x] ★ User Type: End on financial knowledge puts the wizard hat on the character; Home puts it back (desktop)
- [x] Legibility: Default changes the stored scale; set back to Large, as it was. Typeface, Font and Paddings not tried
- [x] ★ Theme: Custom 06 recolours the opening and Profile; the UZ Bank card restores the default look (desktop)
- [x] Demo data reset restores the Household balance (9'900) and Savings (25'000)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components, Character kit and Payday run (the arrows' motion not judged)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (from Character kit)
- [x] The Character kit specimen loads and "Max · Power user" changes the figure

### 6. Accessibility

- [x] Tab through Overview (14 presses): focus always visible, a 2px outline
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: the system setting was not switched

Checked on 2026-11-03 against `feature/assistant-nudges-and-handoff`, Chrome on the agent's server (port 5199): desktop in the 1440×823 window (the sheet at 960, and the opening on its own), the phone as a 390×823 frame of Overview; Light, Dark and Custom 06; Legibility on Large as found (restored after the preset test); each User Type through `uzBankWebPersonaProfile`, `?nudge=fast` for the walks and one step at full speed; real keys for the bubble, the Overview focus and the slider, scripted clicks and storage elsewhere; the times also in Node. Not checked: the system reduced-motion setting, VoiceOver and touch (section 6, for Klaudiusz on the preview), the documents' look-up signal, a step whose question was already asked, Start over, no stored User Type, the starred baseline items at 390 except Overview and the opening, the month chips, Typeface, Font and Paddings. The test payment, transfer and mandate were undone with the demo reset.

D21 checked on 2026-11-03 against `feature/assistant-nudges-and-handoff`, Chrome on port 5199: the phone as a 390×823 frame of Overview > Investment, Light and Dark; desktop as a 1440 frame of the opening. Closes, timing and focus by script (clicks and a dispatched Escape), the look from two paused screenshots. Not checked: the system reduced-motion setting itself, a real phone or VoiceOver (for the preview).

iPhone checks by Klaudiusz on 2026-11-03, on the preview at `b4b1e1c`, before D21: VoiceOver (section 6) and the system reduced-motion setting on the layer. D21 (`88a53ea`) was not on that preview.

Klaudiusz rechecked on 2026-11-03 on the preview at `8612b11`, with D21: the slide-down and focus on Help?, the system reduced-motion setting, and touch. All pass.
