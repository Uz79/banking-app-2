# Amount errors: an invalid amount shows where the error is (54): validation

Branch: `feature/amount-errors`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (the new script gets the same "can't be bundled without type=module" notice as every classic script)
- [x] No console errors on Overview, Payments, Account details, All bookings and a position's page, with each error shown and cleared (read on Account details, the position page and Overview at 390px)

## 2. Buy and Sell (D4 to D10)

- [x] Amount emptied, focus leaves: "Enter an amount.", the field outlined, "Stock split 1" hidden; typing 3 clears it at once and the info row returns
- [x] Amount 0: "Enter at least 1 share."
- [x] Sell more than held: "You hold 5 shares." (and "You hold 1 share." with one): 5 checked, 1 not
- [x] Buy a total over Household's balance: "You have CHF 9'900.00 in Household."; picking Savings as the debit account clears it
- [ ] Limit price emptied: "Enter a limit price."; 0: "Enter a limit price above 0."; Market hides the field and its error: empty checked; 0 and Market not
- [ ] Tab through the fields without typing: no error. Confirm then marks every invalid field and focuses the first; nothing is recorded: Confirm checked (focus to the limit, nothing recorded); Tab without typing not
- [x] Typing an invalid amount, then pressing X: no error flashes; "Discard order?" asks as before
- [ ] Opening Sell after a Buy with an error: no error left

## 3. Pay and the transfer (D4 to D8, D10, D13)

- [x] Pay, amount emptied or 0: the error on blur and on Confirm; the flow doesn't go on
- [x] Pay over Household's balance, As soon as possible: Execute goes back to the amount step with "You have CHF … in Household.", focus in the field; nothing recorded
- [x] Pay over the balance, a later date or Recurring: no error, recorded as pending
- [x] Transfer, amount emptied: Confirm shows "Enter an amount." (no longer goes on with CHF 500); 0 the same as Pay
- [x] Transfer over the debit account's balance, now: back to its first step with the error; later: no error
- [x] From Overview, Payments, Account details and All bookings (each page's copy; All bookings through Edit, it has no Pay button)

## 4. "share" and "shares" (D12)

- [ ] Trade sheet: "In Custody account 5 shares"; the position page's Quantity "5 shares"; the Custody account list; a trade booking's message "12 shares", "1 share": all but the booking's message, which is in code only
- [x] No "pcs." left in the app

## 5. Look and access

- [x] Desktop (1440px) and 390px, Light and Dark: the error row and outline in each flow (desktop: Pay Light and Dark, Buy Dark, the transfer Light; 390px: the transfer Light and Dark)
- [ ] A Multi-color theme: the error keeps its colour and the field stays legible
- [ ] Keyboard: Confirm with errors moves focus to the first, visibly: focus moves (checked); the ring not looked at
- [ ] VoiceOver (Klaudiusz switches it on): the error is read once when it appears after a blur, and with the field when Confirm moves focus into it
- [ ] Reduced motion: nothing in this branch moves; the sheets as before

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-11-05 and 2026-11-06 against `feature/amount-errors`, Chrome (Claude in Chrome) on the agent's server (port 5199), desktop 1483px and 390px (a same-origin iframe), Light and Dark (set through `UZBankApplyThemeChoice`); typing and focus through scripts and real Tab and clicks. Not checked: VoiceOver and the real macOS Reduce motion setting (for Klaudiusz), a Multi-color theme, the focus ring on Confirm's focus move, the limit price at 0 and Market, Tab past the fields without typing, Sell over a holding of 1, Opening Sell after a Buy with an error, a trade booking's message in its sheet, and in the baseline the Light/Dark toggle by click, page transitions, the status message, User Type, Legibility, Theme, the Design system pages and Tab through Overview.
