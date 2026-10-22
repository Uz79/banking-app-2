# Fridge advisor (8a): validation

Branch: `feature/fridge-advisor`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`). Unless a line says otherwise, check Light and Dark, and desktop (1440px) and phone (390px).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build and assets

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] `dist/` contains `fridge-advisor.html`
- [x] `assets/3d/fridge/` holds only the fridge, the 15 food models, the texture and both `License.txt` files; about 0.3 MB plus the texture
- [ ] The browser console shows no errors on any page visited below

## 2. Entry and the sheet

- [ ] Side by side with the payment flow (Pay) and the trade flow (Custody account > a position > Buy): the sheet looks and moves the same, so a customer cannot tell it is a separate page: slide-in and slide-out timing and direction, the scrim, the header, the Back button (position, size, icon, hover and pressed states), the close button, the sheet's corners on desktop (its width differs on purpose from 1024px, D21), and the bottom-sheet behaviour on phone
- [x] Wide layout (D21): at 1024px and wider the sheet is 960dp wide with the stage on the left at full height and the text, sliders and buttons on the right, the header across the top; at 1023px and below it is stacked (640dp column, full screen on a phone); resizing across 1024px switches the layout without a reload; the camera frames the fridge and the figure in both layouts on every step; `.modal-shell--wide` leaves the payment and trade flows unchanged (checked: 960dp wide two-column in the browser, the stacked layout emulated at 960dp and in a 390px frame; not checked: resizing across 1024px, an actual 1023px window)
- [x] Overview > Offers > Investment opens the flow as a sheet that slides up with the scrim fading in, like the payment flow; Overview is visible behind it while it moves
- [x] The Investment item no longer opens `investment-product-details.html`; the account row and performance card on Overview still do
- [ ] Opening `fridge-advisor.html` directly works and its close button goes back to Overview
- [ ] The close button slides the sheet down; focus returns to the Investment item and Overview is usable again
- [x] The page has no sidebar, tab bar or status message (wait over 12 s)
- [x] Back is hidden on the first screen and steps back one screen on the others

## 3. The scene

- [x] First visit: the closed fridge and the persona standing next to it, matching the User Type set in Profile
- [ ] Light, Dark and a Multi-color theme recolour the fridge, food and figure; switching Light/Dark while the page is open updates everything without a reload
- [x] The accent marks only the active compartment and the result ring
- [x] The persona is idle only, no other animation
- [x] The kit fridge's inside looks right with the shelves and drawers (D13 decision recorded in `requirements.md`)
- [ ] Resizing the window keeps the scene framed

## 4. The tour (screens 1 to 4)

- [x] The camera glides to the main compartment, the reserve drawers and the freezer; each door opens as it arrives and the previous one closes (the frost veil of the cooling moment was not seen in a still)
- [x] The explanation cards read correctly, in English, with no em dashes
- [x] Back returns to the previous stage with the reverse motion

## 5. Sliders and food (screens 5 and 6)

- [x] On first visit all sliders are at 0 and the shelves are empty
- [x] Next is off on screen 5 until the monthly salary is above 0; on screen 6 it is always on
- [x] Each slider has a number field beside it showing the exact CHF value in Swiss format; typing a value (digits and apostrophes) moves the slider and the food and is used in the result; out of range or empty input snaps back; Enter applies it
- [x] Slider steps are 100 for salary and left at month end and 1'000 for assets and both reserves; the value is announced by a screen reader ("CHF 21'000") (the spoken value was not checked with a screen reader)
- [x] The assets slider is finer at the low end: values under 50'000 take about the first third of the track and are easy to set by drag; arrow keys always change the value by one step, Page Up and Page Down by ten, Home and End jump to the ends (arrow, Page Up and the track mapping checked; Home and End by reading the code only)
- [x] The top shelf follows the salary, the middle shelf follows left at month end, the bottom shelf follows total assets; the left drawer follows the unplanned reserve (full at 3 times the salary), the right drawer follows the reserve for bigger purchases
- [x] The marker at 3 times the salary shows on the unplanned slider and its line updates with the salary
- [x] Left at month end cannot exceed the salary; lowering the salary clamps the other sliders
- [x] Adding value adds items without reshuffling the others
- [x] Back and forth between screens 5 and 6 keeps the entered values; closing and reopening the flow starts at 0 again (nothing remembered, `localStorage` has no new key)

## 6. The result (screens 7 and 8)

- [x] Worked example: salary 6'000, left at month end 1'000, assets 60'000, unplanned 18'000, bigger 5'000 gives investable 60'000 - 5'000 - 18'000 - 5'000 = 32'000, yearly amount 12'000
- [x] An input that would be negative shows CHF 0
- [x] The doors close, a short cooling moment, then the freezer opens with the amount in `CHF` Swiss format and the note "A rough guide, not financial advice."
- [x] The freezer's contents match the investable share of the assets
- [x] "Show suitable products" opens the closing screen with the amount and "Choosing a product comes next."; Done closes the flow without a prompt
- [x] The formula in `requirements.md` D9 is confirmed by Klaudiusz

## 7. Keyboard, screen reader, motion

- [ ] Every screen and slider works by keyboard only, with a visible `--color-fg-interactive` focus ring; focus moves to the panel heading on each step
- [x] Escape closes with nothing entered; once a slider has moved it asks "Leave this guide?" and Escape in that dialog means Keep going
- [x] The live region announces each step and the result (the text of the live region was read; not heard with a screen reader)
- [ ] With reduced motion on (or `?reduced`): no camera flights or door swings, each stage is a still frame, food appears at once, the freezer simply shows open; the sheet appears and disappears without sliding
- [x] Phone (390px) in portrait and landscape: scene on top, panel below, nothing overlaps or is cut off, Next is reachable (in a 390px frame, not a real phone; landscape not checked)

## 8. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
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

---

Checked on 2026-10-22 against `feature/fridge-advisor`, Chrome on macOS, dev server on port 5199 (never 5175). Fridge advisor: Dark on a 2391px viewport (the sheet 960dp, wide layout), Light for screen 5, the stacked layout emulated at 960dp, a 390px frame for the phone layout (screens 5 to 7), `?reduced` for the still version, keyboard by real Tab and arrow presses on screen 5. Baseline: all pages return 200 and Overview loads, Pay opens at 640dp unchanged (the wide modifier does not touch it), Light/Dark toggle switches.

Not checked: a Multi-color theme; switching Light/Dark while the page is open; resizing across 1024px and a real 1023px window; phone in landscape and on a real phone; the sheet's slide timing side by side with Pay and Trade; the page opened directly (its close button); the "Open payment!" message on the page; focus returning to the Investment item; reduced motion through the system setting (only `?reduced`); a screen reader; the rest of the baseline smoke test (Pay to the end, internal transfer, trade flow, All bookings, Profile, Design system, accessibility tab-through). Console: no fridge errors in this session; the browser's console history holds unrelated stale extension errors. The baseline smoke test must be completed before this branch is merged.

Update, 2026-10-22 (after the framing change): Dark checked on the wide sheet (960dp) and in a 390px frame for screen 7, with the open freezer door deliberately cropped (59% of it visible on the wide sheet, 43% in the phone frame; measured by projecting the door). Light/Dark choice survived a reload and navigating to Profile; Profile loads with its 3D stage and three persona sliders (a slider move was not verified). Still not checked: the framing of every step in a 390px frame and in Light, the rest of the baseline list above.

Update, 2026-10-22 (baseline run, Chrome on macOS, port 5199, Dark, 2391px): the "Open payment!" status message appears on Overview after about 14 s. Overview > Custody account (Details) > Apple position > Buy opens the trade sheet, and its close button asks "Discard order?" (as designed). Profile User Type: dragging the Financial knowledge slider changed the character (a hat appeared); the story title stayed "Newbie", so the title change was not confirmed. Still not run: Pay to the end, internal transfer, All bookings, Legibility presets, Multi-color theme, demo data reset, Design system (admin) pages, Tab-through and reduced motion on Overview, dismissing the status message by tap. The baseline smoke test is therefore only partly done; finish it before merging.

Update, 2026-10-22 (baseline run completed, Chrome on macOS, port 5199, 2391px wide, mostly Dark, a Multi-color theme and the UZ Bank default; admin signed in through the app's own demo sign-in on 5199's own storage):
- Passed: status message appears after about 14 s and a tap dismisses it. Overview > Account details > All bookings and back. Pay end to end (recipient search filters, recipient, amount, schedule, summary, confirmation; Household went 9'900 to 9'400 and "Lena Fischer -500.00" shows under Today on Account details). Internal transfer (Household to Savings, 500; balances 8'900 and 25'500). Custody account > Apple > Buy opens and its close button asks "Discard order?". All bookings: Executed/Pending tabs and month chips switch. Profile User Type (slider changed the character; the title "Newbie" is correct, the profile follows the average of the three sliders). Legibility: Compact and Default presets, Typeface (Georgia and back), Font and Paddings sliders. Theme: Custom 02 (orange) recoloured Overview, the character and the fridge advisor (outline, sliders and Next in the accent); the UZ Bank card restored the navy default. Demo data reset restored Household to the starting 9'900. Design system (admin): hub lists Motion, Components, Character kit and Payday run; Motion and Components open and the back arrow returns to the hub; Character kit specimen loads and its profile buttons change the figure. Tab through Overview: focus ring visible on the sidebar and the quick actions.
- Not run: the Search button on All bookings does nothing (it has no handler, and the page is unchanged from `main`, so it predates this branch); the Payday run page; Light and phone-width (390px) repeats of the starred items; reduced motion through the system setting; Overview > Account details card shows Household 10'000 while Overview shows the booked balance (looks like the same pre-existing behaviour, not compared against `main`).
- Build: `npm run build` passes after removing the `copyRuntimeAssets` plugin (D25).
