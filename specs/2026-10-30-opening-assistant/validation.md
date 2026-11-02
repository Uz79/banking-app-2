# The assistant, first version (9b): validation

Branch: `feature/opening-assistant`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab (no `uzBankWebOpeningDraft`) unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on Overview, the fridge, the opening (panel open and closed), the Components page and the Character kit page

## 2. Questions? and the panel (D1, D3 to D5, D13)

- [ ] Every screen of the opening, including completion and the exit screen, has Questions? on the right of its heading
- [ ] Desktop: Questions? widens the sheet from 640 to 960 (animated); the step stays as it was on the left, the panel is on the right; closing narrows it back to 640; the height never changes
- [ ] Phone (390px): Questions? opens a bottom sheet over the dimmed step, at most 70% high; its close button, Escape and a tap on the dimmed step close it
- [ ] With the panel open, Next and Back keep it open and show the new screen's chips; coming back to a screen shows the questions already asked there
- [ ] Closing the sheet (X, Escape, Leave in the exit prompt) and completion's Done close the panel; reopening Investment starts with it closed
- [ ] The fridge, the hand-over to the opening and "Start over" are unchanged
- [ ] No new storage key; the draft is unchanged by anything the assistant does

## 3. Chips and answers (D6 to D10, D15)

- [ ] Each screen shows three or four chips matching the config; a tap adds the question and the answer, and removes the chip; follow-ups appear where written
- [ ] Newbie: the full answer; All-rounder: the short answer with More, which adds the rest in place; Power user: the short answer only; no stored profile: as All-rounder
- [ ] "Talk to an advisor" answers "We will call you to find a time. Your answers are kept." and nothing else happens
- [ ] No answer says which option to pick or gives personal advice; no answer promises something the prototype does not do (funding, a call)
- [ ] A long answer scrolls inside the panel, never the step
- [ ] No em dashes and no exclamation marks in any answer
- [ ] Copy reviewed by Klaudiusz (group 2)

## 4. The helper (D11, D12)

- [ ] The figure appears at the top of the panel after the first open, with a quiet placeholder before; later opens show it at once
- [ ] It looks unlike every persona (other head and outfit, no headwear) and takes the theme's colours in Light, Dark and a Multi-color theme
- [ ] It waves once when an answer arrives; with `?reduced` it stands still
- [ ] With the models blocked (DevTools request blocking), the panel still works without the figure

## 5. Look, keyboard, motion (D13 to D15)

- [ ] Light, Dark, a Monochrome theme and a Multi-color theme: lines, chips and the figure read well, at 960 and at 390
- [ ] Keyboard only: heading, Questions?, the panel's title focused on open, the chips in order, More, Talk to an advisor, close; focus back on Questions? after closing; on a phone focus stays in the bottom sheet
- [ ] Each new answer is announced once (the log's text read from the page; not with a screen reader)
- [ ] Reduced motion (`?reduced`, and the system setting if Klaudiusz switches it): no width animation, no slide, no fade, a still figure

## 6. Documentation (D16)

- [ ] Components > "Questions and answers": the conversation, chips, both line styles and More, in Light and Dark
- [ ] Character kit > "The helper": the Lorekeeper and his model note, next to the persona (D19)

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

Checked on: not run yet. When it is, a dated line goes here saying when, where and how, and what was not checked.
