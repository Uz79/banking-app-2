# Vercel builds Storybook on deploy (77, closes 75): validation

Setup: local checks in `apps/web`; the real check is the branch's Vercel preview (D5).

## Build and the repo

- [x] `npm run build` and `npm run build-storybook` in `apps/web` succeed with no new warnings (both succeeded; no warning in the output tail)
- [x] `apps/web/vercel.json` is valid JSON; its three old rewrites are unchanged (re-indented to two spaces, same entries)
- [x] `git ls-files apps/web/storybook-static` is empty; `git check-ignore apps/web/storybook-static` names the new `.gitignore` line
- [x] `git status` shows no change outside `vercel.json`, `.gitignore`, the docs and the removal from the index (the branch commits touch only those; five story files were changed in the working tree by Klaudiusz's `npm run storybook` and left out)

## Rewrites (D3)

- [x] Locally emulated: `/designs/<a figure path>` and `/app/js/theme-boot.js` resolve through `/storybook-static/` (a small server applying `vercel.json`'s rewrites when no file exists: both 200)
- [x] A path that exists at the root (an app page, `/css/styles.css`) is not rewritten
- [x] The app is unaffected: `/overview.html` and `/payments.html` load on the preview (both 200 on the preview)

## The preview (D5)

- [x] The deployment succeeded, so the build, `build-storybook` included, finished inside the limits (the log itself was not read; GitHub reports "Deployment has completed")
- [x] `/storybook-static/` loads with the sidebar (preview `banking-app-2-2n4ptdj11`, deployment state success)
- [x] A Design export story shows its figures (no 404 on `/designs/...`) (Account details 3 of 3, circular button 11 of 11 load)
- [x] The Overview and Payments live-page stories mount (no `Failed to load /app/js/...`) (both mount and load 11 `/app/js/` scripts)
- [x] The console shows no error beyond the browser extension's own (only the extension's "message channel closed" exceptions)
- [x] The three `/from-*` rewrites still land on Overview (`/from-cv` returns 200 with the Overview page; the other two share the rule, not fetched)
- [x] `dist` and `node_modules` are not published (`/dist/` and `/node_modules/` return 404) (both 404)
- [x] Light and Dark in one story (the Overview live-page story switched to Dark and rendered)
- [ ] Phone width (390px) loads the Storybook manager: not run (the window cannot be resized here)

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

Local results, 2026-11-18: with the rewrites emulated, the Account details and circular-button design export stories show all their figures (3 and 11, none broken; before, all were), and the Overview and Payments live-page stories mount and load their 11 `/app/js/` scripts; `/from-cv` lands on Overview; `/dist/` and `/node_modules/` return 404; the console shows no failed load.

Preview results, 2026-11-18, `https://banking-app-2-2n4ptdj11-uz79-s-projects.vercel.app` (built from `f238b65`): `/storybook-static/index.json` 200, `/designs/...` and `/app/js/theme-boot.js` 200 through the rewrites, `/from-cv` 200, `/css/styles.css` 200, `/dist/index.html` and `/node_modules/x` 404.

Checked on 2026-11-18 against `feature/build-storybook-on-deploy`: locally (Chrome, desktop) and on the Vercel preview above (Chrome, desktop, signed in to Vercel; curl is redirected by deployment protection). Not checked: 390px, the build log itself and its duration, the baseline smoke test beyond `npm run build` and the preview's page loads, and the dashboard build command (the `vercel.json` one was used, as the build included Storybook).