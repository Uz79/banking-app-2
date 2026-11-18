# Vercel builds Storybook on deploy (77, closes 75): validation

Setup: local checks in `apps/web`; the real check is the branch's Vercel preview (D5).

## Build and the repo

- [ ] `npm run build` and `npm run build-storybook` in `apps/web` succeed with no new warnings
- [ ] `apps/web/vercel.json` is valid JSON; its three old rewrites are unchanged
- [ ] `git ls-files apps/web/storybook-static` is empty; `git check-ignore apps/web/storybook-static` names the new `.gitignore` line
- [ ] `git status` shows no change outside `vercel.json`, `.gitignore`, the docs and the removal from the index

## Rewrites (D3)

- [ ] Locally emulated: `/designs/<a figure path>` and `/app/js/theme-boot.js` resolve through `/storybook-static/`
- [ ] A path that exists at the root (an app page, `/css/styles.css`) is not rewritten
- [ ] The app is unaffected: `/overview.html` and `/payments.html` load on the preview

## The preview (D5)

- [ ] The build log shows `build-storybook` ran, and finished inside the limits
- [ ] `/storybook-static/` loads with the sidebar
- [ ] A Design export story shows its figures (no 404 on `/designs/...`)
- [ ] The Overview and Payments live-page stories mount (no `Failed to load /app/js/...`)
- [ ] The console shows no error beyond the browser extension's own
- [ ] The three `/from-*` rewrites still land on Overview
- [ ] `dist` and `node_modules` are not published (`/dist/` and `/node_modules/` return 404)
- [ ] Light and Dark in one story; phone width (390px) loads the Storybook manager

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
