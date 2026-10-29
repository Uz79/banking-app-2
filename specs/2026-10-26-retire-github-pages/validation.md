# Retire GitHub Pages: validation

Branch: `feature/retire-github-pages`. Sections 1 and 2 are checked by the agent in the repo. Sections 3 and 4 need Vercel and GitHub and are checked by Klaudiusz, who reports the result; the agent records it as their report and says so.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build and repo

- [x] `npm run build` in `apps/web` succeeds, and `git status` is clean after it (nothing tracked changed)
- [x] `.github/` no longer exists
- [x] `grep -rniE "github pages|deploy.yml" . --exclude-dir=node_modules --exclude-dir=.git` lists only history: `CHANGELOG.md` (line 15 and the new entry), `specs/roadmap.md`, the fridge advisor D25, the finished web-analytics spec files, and this spec
- [x] `specs/tech-spec.md` lines 10 and 88, `AGENTS.md` 17 and `CHANGELOG.md` 52 say Vercel; the `Unreleased` entry exists; the `analytics.js:37` comment no longer says GitHub Pages and the file's behaviour is untouched (the diff is the comment only)
- [x] No em dashes in the new or changed user-facing and doc text

## 2. The app is unchanged (reduced baseline)

Only a comment changed in app code, so only the starred baseline items are run, on 5199, and the line below says so.

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop (desktop only; the phone tab bar was not checked)
- [x] ★ Light/Dark toggle switches instantly and survives a reload (Dark stayed after a reload and was saved in `uzBankWebTheme`; "instantly" was seen, not timed)
- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (Household 9'900 to 9'400, "-500.00" under Today on Account details; searching "Lena" filtered the list to one match. In the run that was counted the booking went to Hans Meyer, not Lena Fischer, and I did not find out why. The first run typed into the prefilled 500.00 amount and booked 500'500.00; that was my input, and demo data was reset before the counted run)
- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (moved with the Home key: title All-rounder to Newbie, character Lena to Beat, preview changed; a mouse drag did not move the slider through the browser tool, not investigated; restored with End)
- [x] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly (Custom 06: `--color-fg-interactive` became #e06900, and Overview, Profile, the sidebar and the character took the accent; the UZ Bank card gave #00157E for both fg and interactive and a screenshot matching the first load, but I did not read the colour values before the test, so "exactly" is by eye)
- [x] The browser console shows no errors on those pages (read on Overview after the loads; not read separately on Profile and Account details)

## 3. The Vercel build gate (D5 to D8), by Klaudiusz, on the branch's preview

- [x] The settings of plan group 2 are in place (the Install Command override is off, Node 22.x, source files outside the root directory included). Klaudiusz's report that they made the group 2 changes; the individual values were not read back
- [x] The build log of the branch's deployment shows the install, `tokens:build`, `vite build` and the cleanup, and the deployment is Ready. Completed on 2026-10-29 with the production build log of `7b8cfc1` (same settings, on `main`, not the branch): `npm install`, `tokens:build` and `vite build` are in it (reported by Klaudiusz, not seen by this agent). The `rm -rf` cleanup line was not reported; its effect is shown by the 404s below. Earlier, on the branch: the build ran (304 log lines, `vite build` "built in 1.47s", Build Completed after 9 s, not a static deploy) and the deployment served; the top of the log (the install and `tokens:build`) was not seen, and the cleanup step itself is not in the seen part of the log (its effect is checked below). The deployment still holds 2,303 files, the same as the source-only deploy (reported by Klaudiusz from a separate Claude in Chrome check, not seen by this agent)
- [x] The preview serves the app: Overview, a payment flow, Profile and its 3D character load; the three source paths (`/from-cv`, `/from-portfolio`, `/from-linkedin`) still serve the Overview; an unknown path gives 404 (Overview with the 3D character, the Pay flow up to the recipient list, Profile with the character and sliders; the three paths return 200 and serve the Overview; reported by Klaudiusz from a separate Claude in Chrome check, not seen by this agent)
- [x] `/dist/overview.html` and `/node_modules/` on the preview give 404 (the cleanup worked, D6) (reported by Klaudiusz from a separate Claude in Chrome check, not seen by this agent)
- [x] A runtime-loaded asset works (the Playground or the fridge advisor loads its 3D models and sound), which is what "deploy is source" protects (the fridge advisor opens with the fridge and the character, and the fridge and food models return 200; sound not checked; no console errors seen; reported by Klaudiusz from a separate Claude in Chrome check, not seen by this agent)
- [ ] The gate: a deliberately failing build (for example a syntax error in `scripts/generate-tokens-css.mjs` on a throwaway branch, never on this one) gives a deployment in the Error state and does not change the production site. Optional, and done on a throwaway branch only. Not done

## 4. After the merge and push, by Klaudiusz

- [x] No GitHub Actions run starts for the push (the Actions tab shows nothing new) (reported by Klaudiusz on 2026-10-29, not seen by this agent)
- [x] The Vercel production deployment for the merge commit is Ready, and `banking-app-2-bay.vercel.app` serves the app (merge commit `ea07822`; reported by Klaudiusz on 2026-10-29, not seen by this agent)
- [x] After Klaudiusz unpublishes Pages (GitHub Settings, Pages): the `github.io` address no longer serves the app (reported by Klaudiusz on 2026-10-29, not seen by this agent)

Checked on 2026-10-28 against `feature/retire-github-pages`, Chrome, vite on 5199, desktop (about 2391px wide), by script plus screenshots: sections 1 and 2 only. Not checked: the phone width and dark repeats of the baseline items, the rest of the baseline (this is the reduced run, see section 2), sections 3 and 4 (the Vercel settings, the preview, the merge and the Pages unpublish), which are Klaudiusz's and still open. Section 3 on 2026-10-28: reported by Klaudiusz from a separate Claude in Chrome check, not seen by this agent, on the branch preview after the group 2 settings; the optional failing-build check is not covered (the top of the build log was later checked on `7b8cfc1`, see section 3). Section 4 on 2026-10-29: reported by Klaudiusz on 2026-10-29, not seen by this agent, after the merge and the Pages unpublish.
