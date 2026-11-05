# Confirmation dialogs: modal, one layout, plain words (41): validation

Branch: `feature/confirmation-dialogs`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on Overview, Payments, Account details, All bookings and a position's page, with each dialog opened and closed

## 2. Focus and modality (D1 to D6)

For each flow (Pay, the transfer, Buy, Sell):

- [x] After confirm, focus is on Done; with the keyboard it shows the ring, after a click it doesn't
- [x] Tab and Shift+Tab stay on Done; the sheet's Confirm or Execute can't be reached
- [x] A click on the sheet behind the dialog does nothing
- [x] Enter on Done closes the dialog and the sheet; focus goes back to the button that opened the flow
- [x] Browser Back from the dialog closes the flow with no "Discard …?" prompt; exactly one booking or order is recorded (Pay: one booking; the transfer: its two legs; the trade: one order). Back again does not reopen it. The trade already closed without a prompt before this branch. Back into a `#pay/summary` entry from an earlier page load opens Pay at the summary with fresh defaults, like any deep link; it is not the earlier payment
- [x] Editing a pending payment from a booking's sheet: the dialog says the new schedule, Done closes it, one booking, no duplicate

## 3. Content and layout (D7 to D15)

- [x] Pay, now: "Your payment to <name> is done." with the amount, no secondary line
- [x] Pay, later: "… will be made on <date>."
- [x] Pay, Recurring: "Your recurring payment to <name> starts on <date>."; Standing order: "Your standing order to <name> starts on <date>."
- [x] Transfer, now, later and recurring: "Your transfer to <account> is done." and the other two
- [x] Buy and Sell: "Your order to buy 1 <name> share has been placed." and "… 12 <name> shares …"; the secondary line shows the limit and how long it runs, or "At the market price"
- [x] The amount: "CHF" small and close before the sum, on one baseline, centred (baselines equal, 8px gap, centred to the pixel)
- [x] No row is off-centre; nothing says "pcs."; no em dashes
- [x] A long recipient (a recipient name typed long on the recipient step, or the longest in the list) and a long instrument (Toyota Motor Corporation, 12 shares): the sentence wraps, nothing overflows or scrolls sideways
- [x] Desktop (1440px) and 390px, Light and Dark: all four dialogs
- [x] A Multi-color theme: the dialog takes the theme

## 4. Screen reader and motion (D3, D16)

- [ ] VoiceOver (macOS, Klaudiusz switches it on): when each dialog opens, it reads the dialog and its sentence, then Done; the sheet behind is not reachable with VoiceOver's own navigation
- [ ] Reduced motion on (the real macOS setting): each dialog appears and closes without sliding, and the page responds afterwards

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Compact 14.4px, Default 16px, Comfortable 18.56px)
- [x] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move. Seen: two hub descriptions use an em dash ("Tectonics and Status — 9 specimens", "Buttons — primary"), already on `main`
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-11-05 against `feature/confirmation-dialogs`, Chrome (Claude in Chrome) on the agent's server (port 5199), desktop 1483px and 390px (a same-origin iframe), Light, Dark and Custom 01; keyboard for focus. Not checked: VoiceOver (section 4) and the real macOS Reduce motion setting (section 4 and baseline 6), both waiting for Klaudiusz; the status message timing (baseline 2, not ticked); page transition directions were seen, not measured. The "Open payment!" timing and "pcs." in the trade form's "In Custody account" line are outside this spec.
