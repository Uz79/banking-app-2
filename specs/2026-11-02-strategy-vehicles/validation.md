# Strategy choice with the vehicles (9d): validation

Branch: `feature/strategy-vehicles`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), in the opening reached from Overview > Offers > Investment > Show suitable products, unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors in the fridge, the opening (every screen) and the Character kit page
- [x] The vehicles are not requested before the risk screen (Network panel), and are requested once per page load

## 2. The stage (D1 to D5, D11)

- [x] Desktop (sheet at 960 with the assistant's column): the stage sits beside the cards (D15; between the intro text and the cards was the plan); the whole step fits the sheet without scrolling at 677 and 800 high. The fall-back note's extra line was not checked
- [x] Phone (390 wide): the stage above the cards takes the leftover height (107 to 123px); the step fits without scrolling, Next and Help? visible
- [x] On arrival the stage shows the chosen strategy (the recommendation by default); each pick swaps to its vehicle; fast picks end on the last one
- [x] Each of the five vehicles is whole in the frame at both sizes (the parachute's canopy, the jetpack seen from the side)
- [x] The persona is the customer's: Newbie (Beat), All-rounder (Lena) and Power user (Max) set in Profile; with nothing stored, Beat
- [x] Arriving from the risk screen the stage is ready or fades in without the step jumping; a resumed draft at the strategy screen and an edit from the summary also show it
- [x] Without 3D (a model URL failing): the step is 9a's plain cards, a console warning, no error, Next works. Blocking three.js itself was not tried
- [ ] The stage stops drawing on the other screens and with the tab hidden, and resumes on return without loading again. Checked: no drawing on the other screens, resumes after Back, no second load. Not checked: the tab hidden
- [x] Light, Dark and a Multi-color theme: vehicles in the monochrome, the persona's accent the only colour, the stage card in the theme

## 3. Preview and caption (D6, D7, D8)

- [x] Hovering Growth or Dynamic (above the profile) shows its vehicle dimmed with "Above your risk profile" in the caption; moving away returns to the chosen strategy
- [x] Keyboard: Tab enters the group on the chosen card; the arrow keys reach the unavailable cards and preview them; Space or Enter on them changes nothing; Tab out returns the stage to the chosen strategy
- [x] The knowledge, purpose and horizon option groups behave exactly as before (arrow keys, selection)
- [ ] The caption names the vehicle for each strategy; a screen reader (VoiceOver) reads the caption once per change, not the canvas. Checked: the captions, `aria-live="polite"` on the caption and `aria-hidden` on the stage. Not checked: VoiceOver
- [x] No em dashes in the new copy

## 4. Credits (D9)

- [x] "Model credits" shows the four CC BY models and the tent in place of the stage, at the same height; "Back to the vehicles" returns
- [x] Each link opens its Poly Pizza page or the licence in a new tab, takes the interactive colour and shows the focus ring
- [x] Desktop and 390: the credits fit without scrolling the step (as one paragraph, D9)

## 5. Assistant (D10)

- [x] "What do the vehicles mean?" is among the strategy step's questions, with the right length for Newbie, All-rounder and Power user; it gives no advice

## 6. Motion and access (D12)

- [ ] Reduced motion (the system setting, if Klaudiusz switches it, or a forced still version if the build adds one): still frame with the sit applied, picks and previews instant, no fade, no hover or sway. Not checked: the system setting was not switched and the opening has no forced still version. The code passes `reduced` to the module and the fade has a reduced-motion rule
- [x] The focus ring stays visible on the cards and the links

## 7. The Character kit (D2)

- [x] The Character kit's Vehicles section works as after 9c: picker, profiles from the specimen, reduced motion, credits

## 7a. The strategy carousel (D16 to D19)

Supersedes the layout checks of section 2 (the stage beside or above the cards) and the hover preview of section 3.

- [ ] Desktop (677 and 800 sheets) and 390: one card centred, the neighbours peeking in, the markers and "Model credits" below; the step does not scroll, also with the fall-back note
- [ ] Each card: the persona and its vehicle large, the name with Recommended or Above your risk profile, one line of description, risk segments and return dots with labels, "Choose this strategy" or the reason
- [ ] Starts on the recommended card; with a stored choice (resumed draft, summary edit) on the chosen one
- [ ] Arrow buttons, markers, swipe (trackpad) and the arrow keys move between cards; the arrows stop at the ends; a click on a peeking card moves to it
- [ ] Next is disabled with "Choose a strategy." until a card is chosen, then reads "Continue with <name>"; Growth and Dynamic cannot be chosen
- [ ] Screen reader names: each card "Balanced, 3 of 5, recommended" and announced on change; only the current card is in the Tab order; the figure is named by its caption
- [ ] Reduced motion (forced): no slide, the card swaps at once; no fade
- [ ] The live stage moves with the current card, the others show stills; the stills follow Light, Dark and Custom 06
- [ ] Without 3D: the cards without figures, the rest works
- [ ] "Model credits" shows the credits in the carousel's place and returns

## 8. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (only the browser extension's own "message channel closed" messages)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions (the pages and the back arrow checked; the transitions' direction not judged by eye)
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (it came back within 14 s; the exact 12 s not timed)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (the full flow in Light on desktop; in Dark at 390 up to the recipient step and the discard prompt)
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (the discard prompt still says "Continue payment", known)
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Compact and Comfortable presets checked; the manual controls not)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: the system setting was not switched

Checked on 2026-11-03 against `feature/strategy-vehicles`, Chrome on the agent's server (port 5199): desktop at 1440×823 (a 677 sheet) plus a 960×733 frame for the 800 cap, and the phone at 390×823 through Overview; Light, Dark and Custom 06. Not checked: VoiceOver, the system reduced-motion setting, the tab hidden, blocking three.js itself, the fall-back note's extra line, the exact 12 s timing, the transitions' direction by eye, Legibility's manual controls. Known and not from this branch: Hans Meyer on the Pay schedule, "Continue payment" in the trade's discard prompt, the Profile character overlapping the sliders at 390, roadmap 19 and 20.
