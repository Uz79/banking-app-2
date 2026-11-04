# Pay's schedule step names the chosen recipient (29): validation

Branch: `feature/schedule-recipient`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Payments and Account details

## 2. The schedule step

- [ ] First visit (nothing in `localStorage`): Pay on Overview to a recipient other than Hans Meyer; the schedule step shows that name
- [ ] Back to the recipient search, pick another recipient, forward to the schedule step: the new name shows
- [ ] The schedule step's edit button next to Recipient goes to the recipient step, and coming back shows the same name
- [ ] The same on Payments and on Account details
- [ ] Editing a pending payment from Account details (roadmap 23) opens the schedule step with that booking's recipient
- [ ] Desktop (1440px) and 390px, Light and Dark: a long name fits the field as on the amount step

## 3. The other placeholders (D3)

With a recipient other than Hans Meyer, on Overview, Payments and Account details:

- [ ] The recipient step's name, street, city and country
- [ ] The amount step's Recipient and the debit account balance
- [ ] The summary's amount, Execute on and Recipient
- [ ] The confirmation's amount and recipient
- [ ] The booking in All bookings and on Account details
- [ ] No step and no confirmation is ever seen empty where a name belongs (D2)

## 4. The booking goes to the chosen recipient (D10)

The case from the 2026-10-28 baseline run:

- [ ] Search "Lena", pick Lena Fischer, pay CHF 500 (as soon as possible): every step and the confirmation name Lena Fischer
- [ ] The stored booking (`uzBankWebPaymentState`) has recipient Lena Fischer and CHF 500
- [ ] All bookings lists it under Lena Fischer; its sheet names her
- [ ] The Household balance on Overview and Account details drops by exactly CHF 500

## 5. Keyboard and motion

- [ ] Tab through the schedule step: focus is visible on the edit button, the segmented control, the toggle and Execute on
- [ ] Reduced motion on: the Pay sheet opens, moves between steps and closes as before

## 6. Baseline smoke test

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
