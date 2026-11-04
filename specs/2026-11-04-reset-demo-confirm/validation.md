# Profile: "Reset demo data" asks first and confirms without disabling (22): validation

Branch: `feature/reset-demo-confirm`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. Asking first (D1, D2)

Set up: a transfer (Household to Savings) seeded through the payment state, so there is something to clear.

- [x] "Reset demo data" opens "Reset demo data?" with the D1 message, "Cancel" and "Reset"
- [x] Cancel closes the dialog; the payment is still there and no status line shows
- [x] Escape does the same as Cancel
- [x] Reset closes the dialog and clears the payment: Household is back to its starting balance, the booking is gone from Overview (bookings 2 to 0; Overview's Household at 9'900, its starting balance less today's fixed 100)
- [x] An opened asset management mandate and a trade are gone after a reset too (the new subtitle is true, D6). Seeded through the payment state (`commitMandate`, `commitTradeOrder`), not through the opening or the trade sheet: the mandate and the trade's booking were gone and the positions back to their defaults
- [x] Keyboard: Enter on the button opens the dialog with focus on Cancel, Tab moves to Reset with its ring visible; after Cancel, Escape and Reset the focus is back on "Reset demo data". Tab past Reset (staying inside) was not pressed

## 3. The status line (D3 to D5)

- [x] After Reset, "Demo data reset." with the check icon shows under the button. Before any reset the line has no height, but the section's flex gap still leaves 8 px below the button, at the very end of the page
- [x] The button is never disabled and keeps its label throughout
- [x] A second reset right away asks again and works; the line is emptied and refilled (a mutation log read "Demo data reset.", "", "Demo data reset.")
- [x] The line is in a `role="status"` element (read from the DOM). What a screen reader says was not listened to
- [x] Leaving Profile and coming back: the line is gone

## 4. Everywhere

- [x] Light and Dark, and a Multi-color theme: the line, icon and dialog read clearly and use the theme's colours. Light and Custom 01 on desktop (Reset takes the accent; the line has the subtitle's colour and size), Dark at 390
- [x] Phone width (390, a 390x760 frame, Dark): the dialog fits; the line sits under the button on one line (it did not need to wrap); no sideways scroll
- [ ] Reduced motion: the dialog opens and closes without animation, the line has none. Not checked: a system setting the agent cannot change. The line has no animation; the dialog's reduced-motion path is the shared one, unchanged

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (extension entries only)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop. Light desktop, Dark at 390 (tab bar)
- [x] ★ Light/Dark toggle switches instantly and survives a reload (Dark at 390, reloaded)
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions (forward pages from the right, back from the left, read from each page's entry class)
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (session keys cleared: absent at 7 s, there at 15 s; gone after a tap)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update. Desktop Light with a typed search (Lena Fischer, Household 9'900 to 9'400); Dark at 390 with a recommended recipient (Hans Meyer, 8'900 to 8'400). The schedule step names "Hans Meyer" whoever was picked, a fixed name in the markup since the first commit (roadmap 29)
- [x] Internal transfer completes (Household to Savings, CHF 500)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed ("Discard order?", Discard; its stay button reads "Continue payment", roadmap 30)
- [x] All bookings: tabs, month chips and search work (Pending and back, Mar, "Rent")

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview. Desktop Light by keyboard (Power user: title, preview, hat); Dark at 390 the slider snapped 70 to 50 and the title read Power user
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Compact; DM Sans on Overview too; Font and Paddings moved their stored scales, the rendered size not measured; the stored setting restored after)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly. Custom 01 on Profile in Light desktop and on Overview in Dark at 390; the UZ Bank card left no colour override
- [x] Demo data reset restores the Household balance (now through "Reset demo data?")

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (on hover only the arrow runs `uz-arrow-nudge`)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (history back for all three; the page's back button on the Character kit)
- [x] The Character kit specimen loads and the profile buttons change the figure (Max, Power user: hat, knight, cape)

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (the first eight stops; the ring read and seen on Payments and the Dark toggle)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: a system setting the agent cannot change

Checked on 2026-11-04 against `feature/reset-demo-confirm` (6669a54), Chrome on the agent's server (5199), desktop 1568 wide and a 390x760 frame, Light and Dark, the UZ Bank theme and Custom 01, by hand and by script (DOM reads, a mutation log of the status line). Not checked: reduced motion; a screen reader's announcement; Tab past the dialog's last button; the opening and the trade sheet as the source of the cleared mandate and trade (seeded through the payment state); the rendered size for Font and Paddings. Found, not fixed here: roadmap 29 and 30. Test data cleared with the demo reset; legibility, Light mode, the UZ Bank theme and User Type restored.
