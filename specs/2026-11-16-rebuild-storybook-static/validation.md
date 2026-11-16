# Rebuild `storybook-static` clean (75): validation

Setup: `cd apps/web`, rebuild with `npm run build-storybook`, then serve the folder (`python3 -m http.server 5199` from `apps/web`) and open `http://localhost:5199/storybook-static/index.html`. Stop the server when done.

## Build and the rebuild

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] `npm run build-storybook` succeeds; any warning is recorded here (no warning in the tail of the output)
- [x] `git status` shows changes only under `apps/web/storybook-static` (plus the specs and roadmap)
- [x] `css/tokens.css` and `css/typography.css` are unchanged by the build
- [x] No tracked name under `storybook-static` matches `* [2-9]` or `* [2-9].*` (0 tracked; 33 copies exist on disk, from `designs/` folders such as `variants 2`, and `.gitignore` keeps them out)
- [x] The file count and size, before (1591, 28 MB) and after, are written here: after, 1707 tracked files, 74 MB on disk (53 MB `designs`, 6.8 MB new `3d`, and the ignored copies). Larger than before because `staticDirs` now also carries `assets/3d` and `audio`
- [x] `index.json` lists the current stories; the stories removed since July are gone: 135 stories (122 before); 3 removed (the Overview, Payment flow and Payments `--implementation` stories), 16 added (Chip, Tile, Expander, Form field and more)

## The hosted Storybook (served locally)

- [x] `/storybook-static/index.html` loads with the sidebar, and `/storybook-static/iframe.html?id=<a story id>&viewMode=story` renders
- [x] A Components story, a Pages story and a Design export story each render, in Light and Dark (scripted: the Chip, Overview, account-details and circular-button design export stories render with no error display)
- [ ] A story with an image from `designs/` (a variant figure) shows the image
- [ ] The Docs tab of one story opens
- [ ] The browser console shows no error beyond the ones the old build also had
- [ ] Phone width (390px): the Storybook manager loads and a story renders

## Roadmap

- [x] 75 and 77 are in `specs/roadmap.md` under Later and describe the same plan

## Baseline smoke test

Copied from `specs/baseline/validation.md`. Setup: `cd apps/web && npm run build`, then `npm run dev` and open `http://localhost:5175/overview.html`.

- [x] `npm run build` succeeds with no new warnings
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

Findings: under `/storybook-static/` the design export figures (`/designs/...`) return 404 and the live pages fail to load `/app/js/document-ready.js` (console errors); the files exist under the prefix, the July build used the same root paths, and a root-served Storybook is fine. Recorded in roadmap 77.

Checked on 2026-11-16 against `feature/rebuild-storybook-static`, Chrome (Claude in Chrome), the folder served by `python3 -m http.server 5199`, desktop width, Light and Dark by script. Not checked: the story images by eye (the Chip story was seen), the Docs tab, 390px, the first visit, `npm run storybook` (dev), and the baseline smoke test except `npm run build` (nothing it covers is touched: only `storybook-static` and docs changed).
