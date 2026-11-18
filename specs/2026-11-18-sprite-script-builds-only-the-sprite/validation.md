# `sync_icons_sprite.py` builds only the sprite (76): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build and the script

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] `python3 apps/web/scripts/sync_icons_sprite.py` on the branch leaves `git diff` empty (the sprite, the 15 pages, `js/storage-migrate.js`); a second run too
- [ ] The script has no `migrate_html_files`, `bump_storage_keys` or `IMG_RE`; its docstring says what it does
- [ ] `assets/icons-sprite.svg` is byte-identical to `main`'s
- [ ] `js/storage-migrate.js` is byte-identical to `main`'s
- [ ] A throwaway icon copy: the sprite gains one symbol and nothing else changes; after removing it and running again, the tree is clean
- [ ] Each of the 15 pages has exactly one `id="uzbank-icon-defs"` and 280 symbols; `fridge-advisor.html` and `investment-opening.html` no longer carry a bare sprite block

## The two pages

- [ ] The fridge advisor: back and close icons show, in Light and Dark
- [ ] The investment opening: back, close and the arrows show, in Light and Dark
- [ ] A scripted pass over all 15 pages: every `<use href="#i-...">` has a symbol in that page
- [ ] First visit (nothing in `localStorage`): the fridge and the opening show their icons
- [ ] Desktop and 390px: the same icons show
- [ ] The browser console shows no new error on either page

## Roadmap

- [ ] 76 is under Later with this spec's link until done, then under Done in number order; 70 has its "Built" paragraph again

## Baseline smoke test

Copied from `specs/baseline/validation.md`. Setup: `cd apps/web && npm run build`, then `npm run dev` and open `http://localhost:5175/overview.html`.

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below
- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it
- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work
- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance
- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure
- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet run.
