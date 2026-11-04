# Editing a pending payment keeps it pending (23): validation

Branch: `feature/edit-pending-payment`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

Set up: start from a demo reset. On Account details, make three payments in the Pay sheet: one "as soon as possible" (executed), one with "As soon as possible" off (pending), one "Recurring". Read each stored booking (`uzBankWebPaymentState`) before and after an edit.

Found in the build: Account details lists only executed bookings made in the app, so the pending and the recurring one are listed on All bookings alone, where Edit does nothing (roadmap 31). Their sheets were checked there; their edits ran on Account details by handing the Pay sheet the edit context the booking sheet writes (`window.__UZ_PD_EDIT_CONTEXT__`, then `#pay/amount`), the same path the Edit button takes.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The booking sheet (D5 to D7)

- [x] The executed payment's sheet shows "Executed" with the check, and no Edit buttons (Account details and All bookings; also Paul Schneider after an edit executed it)
- [x] The pending and the recurring payment's sheets show "Pending" with the clock, and both Edit buttons (All bookings, Pending and Recurring tabs; the recurring one was added through `commitPayment`)
- [x] The Apple sample still shows "Pending" with Edit; the executed samples (Café and the others) show "Executed" with none
- [x] A row in the yesterday group still reads "Executed" (Cafe, Pizza, Railway)
- [x] First visit (nothing in `localStorage`): Account details opens with the samples only, and their sheets read as before. After the demo reset (the payment state empty), not a cleared `localStorage`

## 3. Editing (D1 to D4, D7)

- [x] Pending, amount changed, schedule untouched: the schedule step opens with "Single", "As soon as possible" off and the booking's date; after Execute the booking is still `pending` with the same `executeOn`, `dateISO`, `accountKey`, `icon` and `direction`, the new amount, and Household is unchanged. Checked with the date today and with a later date (12.11.2026) put into the stored booking
- [x] Pending, edited to "As soon as possible": the booking becomes executed (no `status`, as a new payment), `executeOn` is gone, `dateISO` is now, and Household drops by the amount (9'400 to 9'130 for 270); its sheet then shows "Executed" with no Edit
- [x] Recurring: the schedule step opens on "Recurring" with the toggle off; after Execute the booking is still `recurring`, the confirmation reads "Your recurring payment of … starts on …"
- [x] Recurring, edited to "Single" with the toggle off: it becomes `pending`, keeping its date (01.12.2026)
- [x] The Apple sample, amount changed: the schedule step opens with "As soon as possible" off; Execute adds a `pending` booking and hides the sample row (through the sheet's real Edit button)
- [x] A new payment from the Pay button after an edit still starts at "Single", "As soon as possible" on (no schedule left over from the edit)
- [x] Keyboard: the sheet's Edit button by Enter opens the flow with focus on the amount; Tab and Enter reach the schedule step's controls, and their focus rings show (the ring seen on Recurring). The booking rows themselves can't be reached by Tab, so the sheet was opened by a click (roadmap 33)

## 4. Everywhere

- [x] Light and Dark, and a Multi-color theme: the chip and the schedule step read clearly. Light desktop, Custom 01 on the Apple sheet, Dark at 390
- [x] Phone width (390): the edit runs end to end; no sideways scroll (the Apple edit in a 390x760 frame, Dark)
- [ ] Reduced motion: the sheet and the Pay flow open and close without animation (the shared paths, unchanged). Not checked: a system setting the agent cannot change; this branch changes no animation

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (extension entries only)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop. Light desktop; Dark at 390 (tab bar)
- [x] ★ Light/Dark toggle switches instantly and survives a reload (Dark by keyboard, reloaded)
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions (forward from the right, back from the left, read from each page's entry class)
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (session keys cleared: absent at 7 s, there at 16 s; gone after a tap)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update. Desktop Light on Account details (three payments); Dark at 390 on Overview (Hans Meyer, Household 9'900 to 9'400)
- [x] Internal transfer completes (Household to Savings, CHF 500: 9'130 to 8'630, Savings 25'500)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed ("Discard order?", Discard; its stay button still reads "Continue payment", roadmap 30)
- [x] All bookings: tabs, month chips and search work (three tabs, Mar scrolled the list to March, "Rent")

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview. Desktop Light by keyboard (Power user: title, preview, hat); Dark at 390 a slider snapped 70 to 50, and all three at the end read Power user
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Compact; DM Sans; Font and Paddings moved their stored scales, the rendered size not measured; the stored setting restored after)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly. Custom 01 on Profile and Account details in Light desktop, on Overview in Dark at 390; the UZ Bank card left no colour override
- [x] Demo data reset restores the Household balance (through "Reset demo data?"; bookings 0, Overview's Household back at 9'900)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (on hover only the arrow runs `uz-arrow-nudge`)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (history back for all three)
- [x] The Character kit specimen loads and the profile buttons change the figure (Max, Power user: hat, knight, cape)

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (the first twelve stops; the ring seen on Internal Transfer and the Dark toggle)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: a system setting the agent cannot change

Checked on 2026-11-04 against `feature/edit-pending-payment` (c89804d), Chrome on the agent's server (5199), desktop 1483 wide and a 390x760 frame, Light and Dark, the UZ Bank theme and Custom 01, by hand and by script (DOM and stored-state reads before and after each edit). Not checked: reduced motion; the stored pending and recurring edits through a real Edit button (none reaches them until roadmap 31; run through the same edit context instead); a cleared `localStorage` as the first visit (the demo reset's empty payment state instead); the rendered size for Font and Paddings. Found, not fixed here: roadmap 31, 32 and 33. Test data cleared with the demo reset; legibility, Light mode, the UZ Bank theme and User Type restored.
