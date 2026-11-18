# Status message: Remind me later and Go to payment (80): validation

Branch: `feature/status-message-actions`. Test the message with `?status=error` (shows at once) or wait 12 s on a main view.

## Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings

## The card (D2 to D4, D12)

- [ ] The "Open payment!" card shows "Remind me later" and "Go to payment"; the since date and the icon are there; the drop-in plays as before
- [ ] A tap on the card body, its title or its text does nothing
- [ ] Both labels sit on one line at 1440, 768 and 390px; at 390px the buttons stack full width, "Remind me later" above "Go to payment"; with Large legibility a label ellipsizes and never wraps
- [ ] Light and Dark, and a Multi-color theme: both buttons and the card keep their contrast
- [ ] Keyboard: Tab goes title and text, Remind me later, Go to payment; Enter and Space work; the focus ring is visible; the card does not take focus when it appears
- [ ] Screen reader: the error is announced once as an alert with its title and text; the buttons are named by their labels
- [ ] Reduced motion: no drop, the card and buttons are there at once, nothing is stuck mid-animation
- [ ] The `warning` and `info` variants (`?status=warning`, `?status=info`) and a "Scheduled payment" message still dismiss on a tap and have no buttons (D1)

## Remind me later (D5)

- [ ] It hides the card with the leave motion and the card drops in again after about 8 s; repeat three times
- [ ] The card returns on a view change inside the 8 s window as the same card, not a second one

## Go to payment (D6, D7)

- [ ] From Overview, Payments and Profile it goes to Account details with the bill's sheet open; from Account details it opens the sheet in place
- [ ] The card is gone on every main view and does not return after a reload, a new tab, or 12 s
- [ ] Reset demo data (Profile) brings the card back after its 12 s delay
- [ ] `uzBankWebStatusActed` holds the id and a time; it is listed in `apps/web/README.md`

## The bill and its route (D8 to D10)

- [ ] The sheet shows "Open", the recipient, the amount, the date (04.10.2026) and a message; no Edit, Delete or Copy; closing clears the hash
- [ ] A fresh tab on `account-details.html#payment-details/domestic/open-bill-2026-10-04` opens the sheet on a first load; Back and forward sync it
- [ ] A made-up id (`#payment-details/domestic/nope`) opens nothing and the hash is cleared, as before
- [ ] The bill is in no list: Household and Private on Account details, All bookings (tabs, month chips, search)
- [ ] The console shows `uzbank:screen` with `account-details/payment-details/domestic/open-bill-2026-10-04` on a card visit
- [ ] Recorded, not checkable before merge: what Vercel lists for the route on production (D11)

## Baseline smoke test

Copy from `specs/baseline/validation.md` and run; line 17 is reworded to the two buttons (D13).

- [ ] `npm run build` succeeds with no new warnings; no console errors on any page visited
- [ ] Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview, Account details, All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; its two buttons work (above)
- [ ] Pay: recipient search to confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account, a position, Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work
- [ ] User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance
- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure
- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet run.
