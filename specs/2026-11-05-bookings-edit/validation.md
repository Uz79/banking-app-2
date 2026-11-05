# All bookings: the sheet's Edit buttons open Pay (31): validation

Branch: `feature/bookings-edit`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings, before, during and after an edit (only the Chrome extension's own "message channel closed" messages)

## 2. Editing from All bookings

- [x] A pending payment made in the app (Pending tab): its sheet's "Edit amount" opens Pay on the amount step with its recipient and amount (Lukas Huber, 120.00, on Household's All bookings)
- [x] "Edit payment" does the same
- [x] A recurring payment made in the app (Recurring tab): Edit opens Pay with Recurring set (Anna Ricci, 75.00)
- [ ] A built-in pending row (e.g. Swisscom): Edit opens Pay with its recipient and amount. Not possible: built-in rows open as "Executed" with no Edit, on `main` too (item 43)
- [x] Change the amount, go on to the schedule step and the summary, confirm, Done: the booking shows the new amount in All bookings, Account details agrees, and Household changes only if the edit executes it (switching to "As soon as possible"). 120 to 150: the schedule step opened with "As soon as possible" off and 20.11.2026, the confirmation read "will be made on 20.11.2026", the stored booking became 150 and stayed pending, no duplicate. Account details lists no pending rows, so there is nothing there to agree; switching to "As soon as possible" was not tried (that path is 23's, unchanged)
- [x] After Done: still on All bookings, on the same tab, with the search text and the month chip as before; no empty month band left behind (if there is one, it goes to item 42). Stayed on Pending with the row showing 150.00. The empty band case needs a built-in row (43)
- [x] Closing Pay mid-edit asks "Discard changes?" with "Continue editing": Continue keeps the edit, Discard closes it and changes nothing
- [x] An executed booking's sheet still shows no Edit (Klaus Vogel)
- [ ] The first visit (nothing in `localStorage`): a built-in pending row's Edit works. Not possible (item 43); with no payments made in the app there is nothing on All bookings to edit
- [ ] Account details: editing still works as before (the code it shares is unchanged). Not rechecked: Account details lists no pending payments to edit. This branch changes only `all-bookings-and-payments.html`; no JS or other page is touched

## 3. Layouts, keyboard and motion

- [x] Desktop (1440px) and 390px, Light and Dark: the Pay sheet on All bookings looks as on Account details (desktop Light: the amount step; desktop Dark: the schedule step, compared with Account details' Pay in Dark; 390 Light: the amount step full screen)
- [x] A Multi-color theme: the sheet takes the theme (Custom 01 at 390 Dark: the Confirm button and the selected segment take the green accent)
- [x] Keyboard: from the open booking sheet, Tab to Edit, Enter opens Pay with focus inside it; Tab stays in Pay; after Done or Discard, focus is somewhere sensible and visible (record where, and compare with Account details). Enter on "Edit payment" opened Pay with focus in the amount; twelve Tabs stayed in Pay, the back button with a visible ring. After Enter on Done, focus is on the page itself and the next Tab starts at the top (the opener sat in the closed booking sheet); left as it is, item 41 covers focus around the confirmation. Not compared with Account details (no pending edit there)
- [ ] Reduced motion on: Pay opens and closes without sliding, and the page responds afterwards. Not checked: needs the real macOS setting

## 4. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload (desktop sidebar, and the phone header at 390)
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions. Pages reached and back works; the direction was not watched
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. It shows on every main view; the timing was not measured (2026-11-05 note in `specs/2026-11-05-exit-prompt-labels/validation.md`: 12 s first, 8 s after a dismissal)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (Light desktop: Sofia Keller, 8'900 to 8'400; Dark desktop: Lena Fischer, 9'900 to 9'400; 390 Dark: Paul Schneider, 9'400 to 8'900)
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (Apple Inc.: "Discard order?" with "Continue order", Discard closes it)
- [x] All bookings: tabs, month chips and search work (Mar scrolls to MARCH and becomes active; "Migros" finds its rows)

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (snaps: 8 to 0 desktop Light, 42 to 50 Dark, 58 to 50 at 390; at 100 the figure turns into Max with the hat)
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Compact 12.6px, Comfortable 16.24px, Default 14px; Typeface, Font and Paddings not re-tried)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly (Custom 11 on desktop Light and Dark, Custom 01 at 390; UZ Bank clears the override each time)
- [x] Demo data reset restores the Household balance (asks first, "Demo data reset.", bookings cleared, Household back to 9'900)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure (Max · Power user)

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (Dark desktop, 2px solid ring)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: needs the real macOS setting

Checked on 2026-11-05 against `feature/bookings-edit`, Chrome on macOS, Vite on port 5199, desktop (1440px) Light and Dark, 390px in a same-origin iframe, Light and Dark, the UZ Bank theme and Multi-color themes (Custom 01, Custom 11), by mouse and keyboard. Test bookings made through `UZBankPayState.commitPayment`, the call Pay itself makes. Not checked: reduced motion with the real macOS setting, the direction of page transitions, the status message's timing, editing a built-in row (item 43), editing on Account details (no pending rows there).
