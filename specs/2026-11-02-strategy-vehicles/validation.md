# Strategy choice with the vehicles (9d): validation

Branch: `feature/strategy-vehicles`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), in the opening reached from Overview > Offers > Investment > Show suitable products, unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors in the fridge, the opening (every screen) and the Character kit page
- [ ] The vehicles are not requested before the risk screen (Network panel), and are requested once per page load

## 2. The stage (D1 to D5, D11)

- [ ] Desktop (sheet at 960 with the assistant's column): the stage sits between the intro text and the cards; the whole step fits the sheet without scrolling, also with the fall-back note showing
- [ ] Phone (390×844): the shorter stage; the step fits without scrolling, Next and Help? visible
- [ ] On arrival the stage shows the chosen strategy (the recommendation by default); each pick swaps to its vehicle; fast picks end on the last one
- [ ] Each of the five vehicles is whole in the frame at both sizes (the parachute's canopy, the jetpack seen from the side)
- [ ] The persona is the customer's: Newbie (Beat), All-rounder (Lena) and Power user (Max) set in Profile; with nothing stored, Beat
- [ ] Arriving from the risk screen the stage is ready or fades in without the step jumping; a resumed draft at the strategy screen and an edit from the summary also show it
- [ ] Without 3D (three.js blocked, or a model URL failing): the step is 9a's plain cards, a console warning, no error, Next works
- [ ] The stage stops drawing on the other screens and with the tab hidden, and resumes on return without loading again
- [ ] Light, Dark and a Multi-color theme: vehicles in the monochrome, the persona's accent the only colour, the stage card in the theme

## 3. Preview and caption (D6, D7, D8)

- [ ] Hovering Growth or Dynamic (above the profile) shows its vehicle dimmed with "Above your risk profile" in the caption; moving away returns to the chosen strategy
- [ ] Keyboard: Tab enters the group on the chosen card; the arrow keys reach the unavailable cards and preview them; Space or Enter on them changes nothing; Tab out returns the stage to the chosen strategy
- [ ] The knowledge, purpose and horizon option groups behave exactly as before (arrow keys, selection)
- [ ] The caption names the vehicle for each strategy; a screen reader (VoiceOver) reads the caption once per change, not the canvas
- [ ] No em dashes in the new copy

## 4. Credits (D9)

- [ ] "Model credits" shows the four CC BY models and the tent in place of the stage, at the same height; "Back to the vehicles" returns
- [ ] Each link opens its Poly Pizza page or the licence in a new tab, takes the interactive colour and shows the focus ring
- [ ] Desktop and 390: the credits fit without scrolling the step

## 5. Assistant (D10)

- [ ] "What do the vehicles mean?" is among the strategy step's questions, with the right length for Newbie, All-rounder and Power user; it gives no advice

## 6. Motion and access (D12)

- [ ] Reduced motion (the system setting, if Klaudiusz switches it, or a forced still version if the build adds one): still frame with the sit applied, picks and previews instant, no fade, no hover or sway
- [ ] The focus ring stays visible on the cards and the links

## 7. The Character kit (D2)

- [ ] The Character kit's Vehicles section works as after 9c: picker, profiles from the specimen, reduced motion, credits

## 8. Baseline smoke test

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

Checked on: not yet run.
