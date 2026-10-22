# Fridge advisor (8a): validation

Branch: `feature/fridge-advisor`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`). Unless a line says otherwise, check Light and Dark, and desktop (1440px) and phone (390px).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build and assets

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] `dist/` contains `fridge-advisor.html`
- [ ] `assets/3d/fridge/` holds only the fridge, the 15 food models, the texture and both `License.txt` files; about 0.3 MB plus the texture
- [ ] The browser console shows no errors on any page visited below

## 2. Entry and the sheet

- [ ] Side by side with the payment flow (Pay) and the trade flow (Custody account > a position > Buy): the sheet looks and moves the same, so a customer cannot tell it is a separate page: slide-in and slide-out timing and direction, the scrim, the header, the Back button (position, size, icon, hover and pressed states), the close button, the sheet's corners on desktop (its width differs on purpose from 1024px, D21), and the bottom-sheet behaviour on phone
- [ ] Wide layout (D21): at 1024px and wider the sheet is 960dp wide with the stage on the left at full height and the text, sliders and buttons on the right, the header across the top; at 1023px and below it is stacked (640dp column, full screen on a phone); resizing across 1024px switches the layout without a reload; the camera frames the fridge and the figure in both layouts on every step; `.modal-shell--wide` leaves the payment and trade flows unchanged
- [ ] Overview > Offers > Investment opens the flow as a sheet that slides up with the scrim fading in, like the payment flow; Overview is visible behind it while it moves
- [ ] The Investment item no longer opens `investment-product-details.html`; the account row and performance card on Overview still do
- [ ] Opening `fridge-advisor.html` directly works and its close button goes back to Overview
- [ ] The close button slides the sheet down; focus returns to the Investment item and Overview is usable again
- [ ] The page has no sidebar, tab bar or status message (wait over 12 s)
- [ ] Back is hidden on the first screen and steps back one screen on the others

## 3. The scene

- [ ] First visit: the closed fridge and the persona standing next to it, matching the User Type set in Profile
- [ ] Light, Dark and a Multi-color theme recolour the fridge, food and figure; switching Light/Dark while the page is open updates everything without a reload
- [ ] The accent marks only the active compartment and the result ring
- [ ] The persona is idle only, no other animation
- [ ] The kit fridge's inside looks right with the shelves and drawers (D13 decision recorded in `requirements.md`)
- [ ] Resizing the window keeps the scene framed

## 4. The tour (screens 1 to 4)

- [ ] The camera glides to the main compartment, the reserve drawers and the freezer; each door opens as it arrives and the previous one closes
- [ ] The explanation cards read correctly, in English, with no em dashes
- [ ] Back returns to the previous stage with the reverse motion

## 5. Sliders and food (screens 5 and 6)

- [ ] On first visit all sliders are at 0 and the shelves are empty
- [ ] Next is off on screen 5 until the monthly salary is above 0; on screen 6 it is always on
- [ ] Each slider has a number field beside it showing the exact CHF value in Swiss format; typing a value (digits and apostrophes) moves the slider and the food and is used in the result; out of range or empty input snaps back; Enter applies it
- [ ] Slider steps are 100 for salary and left at month end and 1'000 for assets and both reserves; the value is announced by a screen reader ("CHF 21'000")
- [ ] The assets slider is finer at the low end: values under 50'000 take about the first third of the track and are easy to set by drag; arrow keys always change the value by one step, Page Up and Page Down by ten, Home and End jump to the ends
- [ ] The top shelf follows the salary, the middle shelf follows left at month end, the bottom shelf follows total assets; the left drawer follows the unplanned reserve (full at 3 times the salary), the right drawer follows the reserve for bigger purchases
- [ ] The marker at 3 times the salary shows on the unplanned slider and its line updates with the salary
- [ ] Left at month end cannot exceed the salary; lowering the salary clamps the other sliders
- [ ] Adding value adds items without reshuffling the others
- [ ] Back and forth between screens 5 and 6 keeps the entered values; closing and reopening the flow starts at 0 again (nothing remembered, `localStorage` has no new key)

## 6. The result (screens 7 and 8)

- [ ] Worked example: salary 6'000, left at month end 1'000, assets 60'000, unplanned 18'000, bigger 5'000 gives investable 60'000 - 5'000 - 18'000 - 5'000 = 32'000, yearly amount 12'000
- [ ] An input that would be negative shows CHF 0
- [ ] The doors close, a short cooling moment, then the freezer opens with the amount in `CHF` Swiss format and the note "A rough guide, not financial advice."
- [ ] The freezer's contents match the investable share of the assets
- [ ] "Show suitable products" opens the closing screen with the amount and "Choosing a product comes next."; Done closes the flow without a prompt
- [ ] The formula in `requirements.md` D9 is confirmed by Klaudiusz

## 7. Keyboard, screen reader, motion

- [ ] Every screen and slider works by keyboard only, with a visible `--color-fg-interactive` focus ring; focus moves to the panel heading on each step
- [ ] Escape closes with nothing entered; once a slider has moved it asks "Leave this guide?" and Escape in that dialog means Keep going
- [ ] The live region announces each step and the result
- [ ] With reduced motion on (or `?reduced`): no camera flights or door swings, each stage is a still frame, food appears at once, the freezer simply shows open; the sheet appears and disappears without sliding
- [ ] Phone (390px) in portrait and landscape: scene on top, panel below, nothing overlaps or is cut off, Next is reachable

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

---

Checked on: not yet run.
