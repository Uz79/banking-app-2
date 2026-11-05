# Pay's schedule step names the chosen recipient (29): validation

Branch: `feature/schedule-recipient`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on Overview, Payments and Account details (the only errors logged came from the browser extension's messaging, not the app)

## 2. The schedule step

- [x] First visit (nothing in `localStorage`): Pay on Overview to a recipient other than Hans Meyer; the schedule step shows that name (Lena Fischer)
- [x] Back to the recipient search, pick another recipient, forward to the schedule step: the new name shows (Payments: Paul Schneider, then Anna Ricci)
- [x] The schedule step's edit button next to Recipient goes to the recipient step, and coming back shows the same name (Payments, Anna Ricci)
- [x] The same on Payments and on Account details (Payments: Anna Ricci, Sofia Keller; Account details: Klaus Vogel)
- [x] Editing a pending payment from Account details (roadmap 23) opens the schedule step with that booking's recipient (Klaus Vogel, "as soon as possible" off as stored; driven through the booking sheet's edit context, since Account details lists only executed bookings and All bookings' Edit does nothing, roadmap 31)
- [x] Desktop (1440px) and 390px, Light and Dark: a long name fits the field as on the amount step (a 50-character name through the edit context: one line on desktop Dark, wraps to two lines beside the edit button at 390 Light; Sofia Keller at 390 Dark, Marie Dupont on desktop Light)

## 3. The other placeholders (D3)

With a recipient other than Hans Meyer, on Overview, Payments and Account details:

- [x] The recipient step's name, street, city and country (Lena Fischer, Bahnhofstrasse 12, 8050 Zürich, Switzerland on Overview; Anna Ricci, Via Garibaldi 8, 20121 Milano, Italy at 390; Klaus Vogel's name on Account details)
- [x] The amount step's Recipient and the debit account balance (Lena Fischer and Household 9'900.00 on Overview; Anna Ricci and Klaus Vogel on the other two)
- [x] The summary's amount, Execute on and Recipient (all three pages)
- [x] The confirmation's amount and recipient (Lena Fischer "is done", Anna Ricci "is done", Klaus Vogel "will be made on 05.11.2026")
- [x] The booking in All bookings and on Account details (All bookings: Lena Fischer and Anna Ricci executed, Klaus Vogel pending on 05.11.2026; Account details lists only executed bookings, as since 23)
- [x] No step and no confirmation is ever seen empty where a name belongs (D2; none seen in any run above)

## 4. The booking goes to the chosen recipient (D10)

The case from the 2026-10-28 baseline run:

- [x] Search "Lena", pick Lena Fischer, pay CHF 500 (as soon as possible): every step and the confirmation name Lena Fischer
- [x] The stored booking (`uzBankWebPaymentState`) has recipient Lena Fischer and CHF 500 (`recipientName: "Lena Fischer"`, `amount: 500`, `accountKey: "household"`, `direction: "out"`)
- [x] All bookings lists it under Lena Fischer; its sheet names her ("-500.00 CHF to Lena Fischer, Bahnhofstrasse 12, 8050 Zürich", Executed)
- [x] The Household balance on Overview and Account details drops by exactly CHF 500 (9'900.00 to 9'400.00 on Overview and on All bookings' account card; Account details' card was not read on its own)

## 5. Keyboard and motion

- [x] Tab through the schedule step: focus is visible on the edit button, the segmented control, the toggle and Execute on (desktop Light: Edit recipient, Single, Recurring, Standing order, the toggle, then Confirm, each with a 2px solid ring; Execute on is skipped while "as soon as possible" is on, as 28 built it, D4 there)
- [ ] Reduced motion on: the Pay sheet opens, moves between steps and closes as before (not run: needs the real macOS setting; this branch adds no motion)

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (extension messaging only)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload (sidebar on desktop, the top-left button at 390)
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions (the transitions play, seen mid-frame both ways; their direction can't be judged from still screenshots)
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (it showed on Overview and a tap dismissed it; when it appeared was not measured)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (desktop Dark: Lena Fischer; 390 Dark: Anna Ricci, Household 9'900 to 9'400)
- [x] Internal transfer completes (CHF 500 Household to Savings, "is done")
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (Apple Inc.; "Discard order?" still offers "Continue payment", roadmap 30)
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (desktop Dark to Power user; 390 to All-rounder)
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (checked on Profile; not on another page)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly (Custom 11 on desktop with a #0022b8 ring on Overview; Custom 10 at 390; UZ Bank clears the override both times)
- [x] Demo data reset restores the Household balance (asks first, then 9'900.00 and no stored bookings)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (the sidebar's Overview item and the Pay sheet's controls)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation (not run: needs the real macOS setting)

Checked on 2026-11-04 against `feature/schedule-recipient`, Chrome on macOS through Claude in Chrome on the test server (port 5199): desktop (1483 px window) in Light and Dark, the UZ Bank theme and two Multi-color themes (Custom 10, Custom 11); 390 px in an iframe in Light and Dark; keyboard on the schedule step and Overview. Not checked: the real macOS Reduce motion setting, the page transitions' direction, when the status message first appears, Account details' own Household card after the payment, Safari and Firefox.
