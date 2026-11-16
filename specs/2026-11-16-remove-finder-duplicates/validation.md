# Remove the Finder duplicates (70): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build and the removal

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] `git status` after group 2 shows only deletions; the count is 325
- [ ] The six files in D3 are still tracked
- [ ] `git ls-files` outside `storybook-static` has no name matching `* [2-9]` or `* [2-9].*`, except the six in D3 (the two `Mode 1.json` do not match `[2-9]`)
- [ ] No file in the repo (outside `node_modules`, `storybook-static`, `dist`) names a removed file
- [ ] The nine that differ: each listed here with why it is stale (dates, size, what it lacks)

## The sprite

- [ ] `assets/icons-sprite.svg` has no symbol id with a space; its symbol count is the number of `icon24-*.svg` files with no space in the name
- [ ] The diff of the 16 embedding pages removes symbols only (nothing else in them changed)
- [ ] A scripted pass over every page: each `<use href="#i-...">` has a symbol in that page's sprite
- [ ] Overview, Payments, Account details, All bookings and the Components page, in Light and Dark: every icon shows
- [ ] First visit (nothing in `localStorage`): the same pages show their icons
- [ ] Desktop and 390px: the sidebar and the tab bar icons show

## Keeping them out

- [ ] A copy named `icon24-home 2.svg` is ignored by git and not read by the sprite script
- [ ] Storybook still starts (`npm run storybook:sync` and the live stories load), if it was run (note here if not)

## Baseline smoke test

Copied from `specs/baseline/validation.md`. Run desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

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

Checked on: not run yet.
