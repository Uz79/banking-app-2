# Booking rows: real status, counterparty icons and a status chip (43): validation

Branch: `feature/booking-chips`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings and Account details. Only the Chrome extension's own "message channel closed" messages

## 2. The sheet

- [x] All bookings, Pending: Swisscom, Helvetia Insurance and Tax office Zurich open "Pending" and no Edit; their Execute on date is in the sheet's data (D2) (D1 to D3)
- [x] All bookings, Recurring: Rent, Netflix and Internet & Phone open as payments (not transfers), and no Edit. The sheet's status reads "Pending" for them, as it does for any booking not executed; it has no "Recurring" state
- [x] All bookings, Executed: Transfer to Household opens as a transfer; Rent opens as a payment
- [x] Account details: Pizza and Transfer to Household open as transfers (their data); Apple opens "Pending" with no Edit
- [x] A pending and a recurring payment made in the app still show Edit, and Edit still opens Pay (31). Pending: Lukas Huber, Edit opened Pay on the amount step

## 3. Icons and chips

- [x] No booking row on either page shows `#i-repeat`
- [x] Payments out show the out icon, money in the in icon; Transfer to Household shows the home icon, Transfer to Savings the anchor. Interest credit, which had a trending-up icon, now shows the in icon
- [x] A transfer made in the app: the out leg shows the other account's icon on the sending account's list, the in leg likewise on the receiving one's. Household to Savings: "Transfer to Savings account" with the anchor on Household's lists, "Transfer from Household" with the home icon on Savings'. On All bookings its sheet reads "Domestic Payment", which is item 46, not this branch
- [x] Pending tab: every row has "Pending"
- [x] Recurring tab: Rent, Netflix and Internet & Phone have "Monthly"; none says "Recurring"
- [x] Executed tab: Rent's and Internet & Phone's executed instances have "Monthly"; one-off payments and incoming money have no chip
- [x] Account details: Rent has "Monthly", Apple "Pending"; the others no chip
- [x] A recurring payment made in the app reads "Monthly"; one stored before this branch (no `frequency`) reads "Monthly" too. The old one simulated by removing `frequency` from a stored booking
- [x] Search still finds rows by name and amount; the chip doesn't change what matches. "Rent" and "1800" find both Rent rows, "Monthly" finds nothing

## 4. Layouts, themes, keyboard and motion

- [x] Desktop (1440px) and 390px, Light and Dark: the chip sits after the name; at 390 a long name is cut before the chip, which stays whole with the amount. At 390, a name forced to "Helvetia Insurance Company Switzerland Ltd" in the page was cut, with the chip whole before the amount
- [x] A Multi-color theme: the chip takes the theme's tonal colours, readable in Light and Dark. Custom 01 at 390 Dark: the chip is a faint tint with the theme's light text, as the theme engine sets the tonal tokens (tonal buttons look the same)
- [x] The first visit (nothing in `localStorage`): both pages show the built-in rows with their icons and chips. 9 chips on All bookings, 2 on Account details, icons out, in, home and anchor only
- [ ] Keyboard: the sheet's focus behaviour is unchanged (rows themselves are 33). Not rechecked; the sheet's focus code is not touched
- [ ] Reduced motion on: nothing new moves. Not checked with the real setting; the chip has no motion

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (read after reloading All bookings and Account details)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload (the phone header at 390; desktop by the stored setting)
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions. Not watched
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. Not timed

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (Light desktop: Sofia Keller, 9'900 to 9'400; Dark desktop: Lena Fischer, 9'900 to 9'400; 390 Dark: Paul Schneider, 9'400 to 8'900)
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work (Mar scrolls to March in Dark)

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (snaps: 12 to 0 Light, 44 to 50 Dark, 56 to 50 at 390)
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Comfortable 16.24px, Default 14px; Typeface, Font and Paddings not re-tried)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly (Custom 11 desktop Light and Dark, Custom 01 at 390; UZ Bank clears the override each time)
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (Dark desktop, 2px solid ring)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: needs the real macOS setting

Checked on 2026-11-05 against `feature/booking-chips`, Chrome on macOS, Vite on port 5199, desktop (1420px) Light and Dark, 390px in a same-origin iframe, Light and Dark, the UZ Bank theme and Multi-color themes (Custom 01, Custom 11), by mouse and keyboard, with the admin signed in through the app's own lab sign-in. Test bookings made through `UZBankPayState`, the calls Pay and the transfer make. Not checked: reduced motion with the real macOS setting, the direction of page transitions, the status message's timing, the sheet's keyboard behaviour (unchanged code).
