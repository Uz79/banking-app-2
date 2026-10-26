# Retire GitHub Pages: validation

Branch: `feature/retire-github-pages`. Sections 1 and 2 are checked by the agent in the repo. Sections 3 and 4 need Vercel and GitHub and are checked by Klaudiusz, who reports the result; the agent records it as their report and says so.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build and repo

- [ ] `npm run build` in `apps/web` succeeds, and `git status` is clean after it (nothing tracked changed)
- [ ] `.github/` no longer exists
- [ ] `grep -rniE "github pages|deploy.yml" . --exclude-dir=node_modules --exclude-dir=.git` lists only `CHANGELOG.md:15`, the finished web-analytics spec files and this spec
- [ ] `specs/tech-spec.md` lines 10 and 88, `AGENTS.md` 17 and `CHANGELOG.md` 52 say Vercel; the `Unreleased` entry exists; the `analytics.js:37` comment no longer says GitHub Pages and the file's behaviour is untouched (the diff is the comment only)
- [ ] No em dashes in the new or changed user-facing and doc text

## 2. The app is unchanged (reduced baseline)

Only a comment changed in app code, so only the starred baseline items are run, on 5199, and the line below says so.

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [ ] The browser console shows no errors on those pages

## 3. The Vercel build gate (D5 to D8), by Klaudiusz, on the branch's preview

- [ ] The settings of plan group 2 are in place (the Install Command override is off, Node 22.x, source files outside the root directory included)
- [ ] The build log of the branch's deployment shows the install, `tokens:build`, `vite build` and the cleanup, and the deployment is Ready
- [ ] The preview serves the app: Overview, a payment flow, Profile and its 3D character load; the three source paths (`/from-cv`, `/from-portfolio`, `/from-linkedin`) still serve the Overview; an unknown path gives 404
- [ ] `/dist/overview.html` and `/node_modules/` on the preview give 404 (the cleanup worked, D6)
- [ ] A runtime-loaded asset works (the Playground or the fridge advisor loads its 3D models and sound), which is what "deploy is source" protects
- [ ] The gate: a deliberately failing build (for example a syntax error in `scripts/generate-tokens-css.mjs` on a throwaway branch, never on this one) gives a deployment in the Error state and does not change the production site. Optional, and done on a throwaway branch only

## 4. After the merge and push, by Klaudiusz

- [ ] No GitHub Actions run starts for the push (the Actions tab shows nothing new)
- [ ] The Vercel production deployment for the merge commit is Ready, and `banking-app-2-bay.vercel.app` serves the app
- [ ] After Klaudiusz unpublishes Pages (GitHub Settings, Pages): the `github.io` address no longer serves the app

Checked on: not run yet. When it is, a dated line goes here saying when, where and how, and what was not checked.
