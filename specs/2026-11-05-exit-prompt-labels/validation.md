# Every exit prompt names its own task (30): validation

Branch: `feature/exit-prompt-labels`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on the pages visited below

## 2. Each prompt

Open the flow, enter something, close it. Check the title, the message and both buttons, then that the stay button keeps the flow as it was and Discard (or the leave button) closes it.

- [ ] Buy (a position page): "Discard order?", "Continue order", "Discard"
- [ ] Sell (a position page): the same
- [ ] Internal transfer (Overview): "Discard transfer?", "Continue transfer", "Discard"
- [ ] Pay, new payment (Overview, Payments, Account details): "Discard payment?", the same message as before, "Continue payment", "Discard"
- [ ] Pay, editing a pending payment (Account details): "Discard changes?", "Continue editing", "Discard"
- [ ] Unchanged: the fridge ("Leave" / "Keep going"), the Playground ("Keep playing"), Profile's reset ("Cancel" / "Reset")

## 3. Layouts, keyboard and motion

- [ ] Desktop (1440px) and 390px, Light and Dark: the longer labels fit their buttons on one line
- [ ] A Multi-color theme: the buttons take the theme as before
- [ ] Keyboard: Tab reaches both buttons with a visible ring; Enter on the stay button keeps the flow and returns focus to it; Escape still does nothing in Pay, the transfer and the trade (D5), and still means "Keep going" in the fridge
- [ ] Reduced motion on: the dialog opens and closes without its animation, and the page responds afterwards

## 4. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet run.
