# Booking sheet: a transfer shows its real type and status (32, 46): validation

Branch: `feature/transfer-status`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings and Account details, on load and with a transfer's sheet open (only the Chrome extension's own "message channel closed" messages)

## 2. The status (32)

- [x] A transfer made with "Immediately" off (Household to Savings): its sheet reads "Pending" with the clock icon, on Account details and on All bookings (Pending tab). On All bookings (22.00, executing 20.11.2026). Account details lists only executed bookings made in the app, so it has no pending row to open
- [x] A standing order transfer: its sheet reads "Pending" (D2), in the Recurring tab (33.00, stored as monthly)
- [x] An immediate transfer: its sheet reads "Executed" with the check icon (11.00, on Account details and in All bookings' Executed tab)
- [x] The in-leg on Savings ("Transfer from Household") reads the same status as the out-leg (D5): Executed, Pending and Pending in the three tabs of Savings' All bookings
- [x] No Edit button and no Edit action on a pending or recurring transfer's sheet (D6): the sheet gets `pd--pending pd--editable`, but no `[data-pd-edit]` control is visible
- [x] A pending payment's sheet is unchanged: "Pending" with its Edit; a trade's sheet still reads "Executed" (D7). Lukas Huber, 44.00: "Domestic Payment", Pending, both Edit controls. Buy AAPL: "Trade", Executed, no Edit
- [ ] The first visit (nothing in `localStorage`): the built-in transfer rows (Transfer to Household, Transfer to Savings) open as before. Not checked from an empty `localStorage`; with test bookings they open as "Internal Account Transfer", Executed, as on `main` (their path doesn't use the transfer's account list). Found: on each account's page one of them reads as a transfer to the same account, new roadmap item 50

## 3. The type on All bookings (46)

- [x] A transfer made in the app opens as "Internal Account Transfer" with its debit and credit accounts, names, IBANs and balances matching Account details' sheet of the same booking (Household CH35 … 1, CHF 8'889.00, to Savings Account CH35 … 2, CHF 25'011.00, on both pages)
- [x] The page has no transfer sheet: a typed `#iat/…` address opens nothing and leaves no error (`#iat/recipient`: no open overlay, no console error)
- [x] Opening and closing the sheet, the tabs, the month chips and search work as before

## 4. Layouts, keyboard and motion

- [x] Desktop (1440px) and 390px, Light and Dark: a pending transfer's sheet on All bookings looks as on Account details (the internal variant: both account cards, the Pending chip; desktop Light and Dark, 390 Light and Dark)
- [x] A Multi-color theme: the sheet takes the theme (Custom 01, desktop Light: the Pending chip and Confirm take the green accent)
- [x] Keyboard: the sheet's focus stays in it and goes back on close, as before (rows themselves can't be reached by keyboard, 33). Eight Tabs stayed in the sheet, on "Further options" with a 2px ring. Enter on the close button closes it; focus lands on the page body, as the row can't take focus (33). Found: Escape doesn't close it, nor Pay, the transfer, Buy or Sell, also on `main`; new roadmap item 49
- [ ] Reduced motion on (the real macOS setting): the sheet opens and closes without sliding, and the page responds afterwards. Not checked: needs the real macOS setting

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (only the Chrome extension's own messages)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop (desktop Light and Dark, 390 Light)
- [x] ★ Light/Dark toggle switches instantly and survives a reload (desktop sidebar to Dark, kept after a reload; the phone header at 390 to Dark and back)
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions. Pages reached and back works; the direction was not watched
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. It shows on every main view; the timing was not measured (about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (desktop Dark: "Sofia" finds Sofia Keller, 8'834 to 8'334; 390 Light: Paul Schneider, 9'900 to 9'400). Not run in desktop Light
- [x] Internal transfer completes (500.00 Household to Savings, desktop Dark, "Your transfer of … is done.")
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (Apple Inc.: "Discard order?" with "Continue order", Discard closes it)
- [x] All bookings: tabs, month chips and search work (Executed 30, Pending 5, Recurring 4 rows; Mar scrolls to MARCH and becomes active; "Migros" finds its two rows)

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (desktop Dark: Banking products to 50, Beat to Lena, "All-rounder"; 390 Light: Digital affinity to 50). At 390 the figure stands over the sliders and lets clicks through to them; this branch doesn't touch Profile
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Comfortable 18.56px, Default 16px for Lena's density, Compact picked; Typeface, Font and Paddings not re-tried)
- [x] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly (Custom 01 on desktop Light, Custom 11 at 390 Light; UZ Bank clears the override and `--color-fg` is back to #00157E each time). Not run in desktop Dark
- [x] Demo data reset restores the Household balance (asks first, "Demo data reset.", bookings cleared, Household back to 9'900)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (four `uz-arrow-nudge` animations, nothing else of the app's)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure (Max · Power user: hat, knight, cape, run)

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (Dark desktop, 2px solid ring)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: needs the real macOS setting

Checked on 2026-11-05 against `feature/transfer-status`, Chrome on macOS, Vite on port 5199, desktop (1440px) Light and Dark, 390px in a same-origin iframe, Light and Dark, the UZ Bank theme and Multi-color themes (Custom 01, Custom 11), by mouse and keyboard. Test transfers made through `UZBankPayState.commitInternalTransfer`, the call the transfer itself makes; one more through the transfer's own sheet in the smoke test. Not checked: reduced motion with the real macOS setting, the direction of page transitions, the status message's timing, the built-in transfer rows from an empty `localStorage`, Pay in desktop Light and a theme in desktop Dark (both run in the other mode).
