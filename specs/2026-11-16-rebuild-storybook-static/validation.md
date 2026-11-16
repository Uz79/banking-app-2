# Rebuild `storybook-static` clean (75): validation

Setup: `cd apps/web`, rebuild with `npm run build-storybook`, then serve the folder (`python3 -m http.server 5199` from `apps/web`) and open `http://localhost:5199/storybook-static/index.html`. Stop the server when done.

## Build and the rebuild

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] `npm run build-storybook` succeeds; any warning is recorded here
- [ ] `git status` shows changes only under `apps/web/storybook-static` (plus the specs and roadmap)
- [ ] `css/tokens.css` and `css/typography.css` are unchanged by the build
- [ ] No tracked name under `storybook-static` matches `* [2-9]` or `* [2-9].*`
- [ ] The file count and size, before (1591, 28 MB) and after, are written here
- [ ] `index.json` lists the current stories; the stories removed since July are gone

## The hosted Storybook (served locally)

- [ ] `/storybook-static/index.html` loads with the sidebar, and `/storybook-static/iframe.html?id=<a story id>&viewMode=story` renders
- [ ] A Components story, a Pages story and a Design export story each render, in Light and Dark
- [ ] A story with an image from `designs/` (a variant figure) shows the image
- [ ] The Docs tab of one story opens
- [ ] The browser console shows no error beyond the ones the old build also had
- [ ] Phone width (390px): the Storybook manager loads and a story renders

## Roadmap

- [ ] 75 and 77 are in `specs/roadmap.md` under Later and describe the same plan

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
