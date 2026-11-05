# All bookings: the sheet's Edit buttons open Pay (31): validation

Branch: `feature/bookings-edit`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings, before, during and after an edit

## 2. Editing from All bookings

- [ ] A pending payment made in the app (Pending tab): its sheet's "Edit amount" opens Pay on the amount step with its recipient and amount
- [ ] "Edit payment" does the same
- [ ] A recurring payment made in the app (Recurring tab): Edit opens Pay with Recurring set
- [ ] A built-in pending row (e.g. Swisscom): Edit opens Pay with its recipient and amount
- [ ] Change the amount, go on to the schedule step and the summary, confirm, Done: the booking shows the new amount in All bookings, Account details agrees, and Household changes only if the edit executes it (switching to "As soon as possible")
- [ ] After Done: still on All bookings, on the same tab, with the search text and the month chip as before; no empty month band left behind (if there is one, it goes to item 42)
- [ ] Closing Pay mid-edit asks "Discard changes?" with "Continue editing": Continue keeps the edit, Discard closes it and changes nothing
- [ ] An executed booking's sheet still shows no Edit
- [ ] The first visit (nothing in `localStorage`): a built-in pending row's Edit works
- [ ] Account details: editing still works as before (the code it shares is unchanged)

## 3. Layouts, keyboard and motion

- [ ] Desktop (1440px) and 390px, Light and Dark: the Pay sheet on All bookings looks as on Account details
- [ ] A Multi-color theme: the sheet takes the theme
- [ ] Keyboard: from the open booking sheet, Tab to Edit, Enter opens Pay with focus inside it; Tab stays in Pay; after Done or Discard, focus is somewhere sensible and visible (record where, and compare with Account details)
- [ ] Reduced motion on: Pay opens and closes without sliding, and the page responds afterwards

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
