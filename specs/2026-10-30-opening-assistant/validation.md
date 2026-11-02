# The assistant, first version (9b): validation

Branch: `feature/opening-assistant`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab (no `uzBankWebOpeningDraft`) unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on Overview, the fridge, the opening (panel open and closed), the Components page and the Character kit page

## 2. Questions? and the panel (D1, D3 to D5, D13; as first built, replaced by section 5b)

- [x] Every screen of the opening, including completion and the exit screen, has Questions? on the right of its heading
- [x] Desktop: Questions? widens the sheet from 640 to 960 (animated); the step stays as it was on the left, the panel is on the right; closing narrows it back to 640; the height never changes
- [x] Phone (390px): Questions? opens a bottom sheet over the dimmed step, at most 70% high; its close button, Escape and a tap on the dimmed step close it
- [x] With the panel open, Next and Back keep it open and show the new screen's chips; coming back to a screen shows the questions already asked there
- [x] Closing the sheet (X, Escape, Leave in the exit prompt) and completion's Done close the panel; since D24 the desktop column is always there and every screen starts with the invitation (section 5b)
- [x] The fridge, the hand-over to the opening and "Start over" are unchanged
- [x] No new storage key; the draft is unchanged by anything the assistant does

## 3. Chips and answers (D6 to D10, D15)

- [x] Each screen shows three or four chips matching the config; a tap adds the question and the answer, and removes the chip; follow-ups appear where written
- [x] Newbie: the full answer; All-rounder: the short answer with More, which adds the rest in place; Power user: the short answer only; no stored profile: as All-rounder
- [x] "Talk to an advisor" answers "We will call you to find a time. Your answers are kept." and nothing else happens
- [x] No answer says which option to pick or gives personal advice; no answer promises something the prototype does not do (funding, a call)
- [x] A long answer scrolls inside the panel, never the step
- [x] No em dashes and no exclamation marks in any answer
- [x] Copy reviewed by Klaudiusz (group 2)

## 4. The helper (D11, D12)

- [x] The figure appears at the top of the panel after the first open, with a quiet placeholder before; later opens show it at once
- [x] It looks unlike every persona (the Lorekeeper, a whole model of his own, D19) and takes the theme's colours in Light, Dark and a Multi-color theme
- [x] It gestures once (`Interact`) when an answer arrives; with `?reduced` it stands still
- [x] With the models blocked (DevTools request blocking), the panel still works without the figure. Blocked by renaming `lorekeeper.glb` for the check (no request blocking in the agent's tools)

## 5. Look, keyboard, motion (D13 to D15)

- [x] Light, Dark, a Monochrome theme and a Multi-color theme: lines, chips and the figure read well, at 960 and at 390
- [x] Keyboard only: heading, Questions?, the panel's title focused on open, the chips in order, More, Talk to an advisor, close; focus back on Questions? after closing; on a phone focus stays in the bottom sheet
- [x] Each new answer is announced once (the log's text read from the page; not with a screen reader)
- [x] Reduced motion (`?reduced`, and the system setting if Klaudiusz switches it): no width animation, no slide, no fade, a still figure. `?reduced` only; the system setting was not switched

## 5b. Help per step (D24 to D30; replaces the checks of D20 to D23)

- [x] Desktop: the sheet is 960 on the fridge, through the hand-over and on a resumed opening; the column is there on every screen and never collapses
- [x] Desktop: every screen (the ten steps, completion and the exit screen) starts with the invitation: the Lorekeeper large, "Questions about this step?", "Yes, help me"; no foot; focus stays on the step's heading
- [x] "Yes, help me": the helper shrinks to 120 (64 after a question), focus on the panel's title, the chips, answers and "Talk to an advisor"; "I can do it myself" at the bottom
- [x] "I can do it myself": back to the invitation, focus on "Yes, help me"; Next and Back start the next screen in the invitation; a yes on a screen visited before shows its earlier lines
- [x] No "Questions?" anywhere; the draft has no help field
- [x] Phone (390): Help? (tonal, the head rising a little above it) and the main button side by side in the bottom bar, both 44px, a 12px gap, Next taking the rest; other buttons below the row; no other help button or strip
- [x] Phone: Help? opens the conversation full screen under the sheet's header (a modal dialog, focus on its title, the step inert); "I can do it myself" and Escape close it with focus back on Help?; the next screen starts closed
- [x] Names: Help? is announced as "Questions about this step" (read from the page; not with a screen reader), the panel is labelled by its title
- [x] Light and Dark; keyboard by real key presses through the invitation, the conversation and back

## 6. Documentation (D16)

- [x] Components > "Questions and answers": the conversation, chips, both line styles and More, in Light and Dark
- [x] Character kit > "The helper": the Lorekeeper and his model note, next to the persona (D19)

## 7. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions. Forward seen mid-transition; going back works, but the screenshot tool timed out during the back transitions, so their direction was not seen by eye
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
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-11-02 against `feature/opening-assistant` (after `183e32a`, the Lorekeeper; section 5b re-checked on 2026-11-02 after the second review change D24 to D30, which replaced D20 to D23: every screen of the opening on desktop at 960 and at 390, completion and the exit screen included, the hand-over and a resumed opening, Escape, focus on every switch by real key presses on desktop and from the page on the phone; the Help? head and the column's figure by eye in Light and Dark. Not re-checked for D24 to D30: a Multi-color theme, the system reduced-motion setting, the panel without the figure, and a window resized across 1024px), on the agent's server (port 5199) in Chrome: desktop at a 2391 x 1179 viewport (the sheet at 640 and 960; not resized to 1440), phone width as a 390 x 844 frame of the app; Light and Dark; the UZ Bank (Monochrome) and Custom 06 (Multi-color) themes; keyboard by real key presses; reduced motion with `?reduced`; a full walk of the fridge, the hand-over and all twelve opening screens, including the exit screen and completion by eye. Build passes with no warnings; no console errors on the pages visited. Not checked: the system reduced-motion setting (Klaudiusz's to switch); the direction of the back page transitions by eye; network throttling; reduced transparency; a real screen reader (the log's text and role were read from the page). Each Legibility control was not tried on its own (the presets move Font and Paddings). Known issues from before this branch, unchanged: the Pay schedule shows Hans Meyer whatever the recipient; the trade exit prompt says "Continue payment"; the Profile character overlaps the sliders at 390.
