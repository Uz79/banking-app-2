# Every exit prompt names its own task (30): validation

Branch: `feature/exit-prompt-labels`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on the pages visited below (only the Chrome extension's own "message channel closed" messages, which are not from the app)

## 2. Each prompt

Open the flow, enter something, close it. Check the title, the message and both buttons, then that the stay button keeps the flow as it was and Discard (or the leave button) closes it.

- [x] Buy (a position page): "Discard order?", "Continue order", "Discard"
- [x] Sell (a position page): the same
- [x] Internal transfer (Overview): "Discard transfer?", "Continue transfer", "Discard"
- [x] Pay, new payment (Overview, Payments, Account details): "Discard payment?", the same message as before, "Continue payment", "Discard"
- [x] Pay, editing a pending payment (Account details, Lukas Huber): "Discard changes?", "Continue editing", "Discard"
- [x] Unchanged: the fridge ("Leave for now?", "Leave" / "Keep going"), the Playground ("Quit run" / "Keep playing"), Profile's reset ("Cancel" / "Reset")

In every flow the stay button kept the flow open with its entries, and Discard closed it.

## 3. Layouts, keyboard and motion

- [x] Desktop (1440px) and 390px, Light and Dark: the longer labels fit their buttons on one line (desktop Light: the edit prompt; desktop Dark: Sell; 390 Light: Buy; 390 Dark: the transfer)
- [x] A Multi-color theme: the buttons take the theme as before (the transfer prompt at 390 Dark)
- [x] Keyboard: Tab reaches both buttons with a visible ring; Enter on the stay button keeps the flow and returns focus to it; Escape still does nothing in Pay, the transfer and the trade (D5), and still means "Keep going" in the fridge. Checked on the transfer: focus opens on "Continue transfer", Tab reaches Discard, Escape does nothing, Enter on "Continue transfer" keeps the flow with focus back on its close button and a ring
- [x] Reduced motion on: the dialog opens and closes without its animation, and the page responds afterwards. Checked by Klaudiusz with the real macOS setting: Buy, close, "Discard order?" with "Continue order"; both buttons close it at once and the page responds

## 4. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload (desktop, and the phone header's toggle at 390)
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions. Checked by Klaudiusz: Household and Custody account, and the back arrow
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. Measured by Klaudiusz: it comes back about 8 s after it is dismissed, not 12 s. That matches the code (`reappearAfter: 8000` in `js/status-feed.js`) and `specs/tech-spec.md` ("back 8 s after dismissal"); the baseline line only names the first appearance (12 s, `delay: 12000`), which was not timed. A gap in the baseline's wording, not a change by this branch

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (Light desktop: Sofia Keller, 9'400 to 8'900; Dark desktop: Marie Dupont, 9'900 to 9'400; 390 Dark: Klaus Vogel, 9'400 to 8'900)
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (desktop: Power user / Max; 390: the slider snapped from 40 to 50)
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Comfortable gives 16.24px on Overview against 14px for Default)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly (desktop: Custom 11 recoloured Payments; 390: Multi-color stored, then UZ Bank cleared the override)
- [x] Demo data reset restores the Household balance (asks first, then "Demo data reset.")

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure (Beat)

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (Dark desktop, up to the sidebar's Light button with a 2px solid ring)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: needs the real macOS setting

Checked on 2026-11-05 against `feature/exit-prompt-labels`, Chrome on macOS, Vite on port 5199, desktop (1440px) Light and Dark, 390px in a same-origin iframe, Light and Dark, the UZ Bank theme and a Multi-color theme, by mouse and keyboard. Then by Klaudiusz on 2026-11-05: the exit prompt with the real macOS Reduce motion, the page transitions, and the status message's reappearance (about 8 s). Not checked: the baseline's reduced-motion pass over page transitions and the character, and the status message's first appearance (12 s).
