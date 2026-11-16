# Remove the Finder duplicates (70): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build and the removal

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] `git status` after group 2 shows only deletions; the count is 325 (plus the 14 manifests and 12 stories edited, D10)
- [x] The six files in D3 are still tracked
- [x] `git ls-files` outside `storybook-static` has no name matching `* [2-9]` or `* [2-9].*`, except the six in D3 (the two `Mode 1.json` do not match `[2-9]`)
- [x] No file in the repo (outside `node_modules`, `storybook-static`, `dist`) names a removed file
- [x] The nine that differ: each listed here with why it is stale (dates, size, what it lacks)
  - `js/payment-details 2.js`: 474 lines, 2026-06-19, against 1138 lines and 2026-11-13; an early version (`message: 'Salary May 2026'`), nothing the live file lacks
  - `scripts/generate-tokens-css 2.mjs`: 2026-05-17, 113 lines against 694; writes `apps/web/public/css/tokens.css` (the old location), no typography output
  - the three `*.stories 2.js`: June, older titles (`Pages/Overview`, an `Implementation` story, the old logout icon); not loaded by Storybook's glob (`*.stories.@(js|mjs)`)
  - `designs/components/dialog/variants/basic/default 2.svg` (2026-06-03, original 2026-06-30) and the `investment-product-details` archive PNG: older exports of the same design
  - `designs/scripts/normalize_design_exports 2.py` and `3.py`: 3391 bytes (2026-06-02 and 06-03) against 37970 bytes (2026-06-19); an early conservative version

## The sprite

- [x] `assets/icons-sprite.svg` has no symbol id with a space; its symbol count is the number of `icon24-*.svg` files with no space in the name
- [x] The diff of the 17 embedding pages removes symbols only (126 each; no added line)
- [x] A scripted pass over every page: each `<use href="#i-...">` has a symbol in that page's sprite
- [ ] Overview, Payments, Account details, All bookings and the Components page, in Light and Dark: every icon shows
- [ ] First visit (nothing in `localStorage`): the same pages show their icons
- [ ] Desktop and 390px: the sidebar and the tab bar icons show

## Keeping them out

- [x] A copy named `icon24-home 2.svg` is ignored by git and not read by the sprite script
- [ ] Storybook still starts (`npm run storybook:sync` and the live stories load), if it was run (note here if not)

## Baseline smoke test

Copied from `specs/baseline/validation.md`. Run desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below (not read)

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

The baseline smoke test: `npm run build` only. The pages that the sprite touches were opened (Overview and Payments, Dark desktop, icons all present) and every page's static `<use>` references were checked against its symbols (15 pages, none missing; 280 symbols, one per `icon24-<name>.svg`). Pay, the transfer, Buy, the Profile pages, the Design system hub and reduced motion were not run: this branch changes no code those use.

Not run: Light, 390px and first-visit looks of the icon pages by eye (only the scripted reference check covers them); Storybook itself (`npm run storybook` was not started, so the 26 edited manifests and stories were only parsed: `node --check` on the stories, `json.load` on the manifests); the "Open payment!" and Pay checks.

Checked on 2026-11-16 against `feature/remove-finder-duplicate-files`, Chrome on the agent's server (5199), Dark desktop (about 1500px).
