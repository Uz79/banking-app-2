# Retire GitHub Pages: plan

Branch: `feature/retire-github-pages`. Decisions are cited as D1 to D12 from `requirements.md`. Two groups and a wrap-up. Nothing is built until Klaudiusz says go; the Vercel settings and the Pages unpublish are Klaudiusz's (D7, D9).

## 1. Remove the workflow and fix the docs (D2, D3, D11, D12)

What you see: no `.github` folder; `grep -rn "GitHub Pages"` finds only history (`CHANGELOG.md:15`, the finished spec files) and this spec.

- [ ] Delete `.github/workflows/deploy.yml` (`git rm`), which leaves no `.github` folder
- [ ] `specs/tech-spec.md`: line 10 (deployed to Vercel on every push to `main`) and line 88 (the "Deploy" Decisions row: Vercel serves `apps/web` as it is, with the settings of D4 and D5)
- [ ] `AGENTS.md`: line 17 (`main` deploys to Vercel on every push, branches get a preview URL, no workflow path) and the build-check wording of D12 under "Checking work"
- [ ] `CHANGELOG.md`: line 52 says Vercel; a `Changed` entry under `Unreleased` (GitHub Pages retired, Vercel is the only host, the build runs on Vercel as a gate)
- [ ] `apps/web/js/analytics.js`: the comment at line 37 only, "GitHub Pages" dropped
- [ ] Check: `grep -rniE "github pages|deploy.yml" . --exclude-dir=node_modules --exclude-dir=.git` lists only the allowed history

## 2. The Vercel settings (D4 to D8), by Klaudiusz

What you see: a preview deployment of the branch that built with `npm run build`, serves the source tree, and has no `/dist/` or `/node_modules/`.

- [ ] Klaudiusz sets, in Vercel, Settings, Build and Deployment (root `apps/web`):
  - Framework Preset: **Other** (unchanged)
  - Build Command, Override on: `npm run build && rm -rf dist node_modules`
  - Install Command: **Override off** (default, `npm install`)
  - Output Directory, Override on: `.` (unchanged)
  - Root Directory: `apps/web` (unchanged); "Include source files outside of the Root Directory" **on**
  - Node.js Version: **22.x** (needs `^20.19.0 || >=22.12.0`)
- [ ] Redeploy the branch and read the build log: install runs, `tokens:build` and `vite build` run, the cleanup runs, the deployment is Ready
- [ ] Preview checks of `validation.md` section 3
- [ ] If the log or the checks show a problem that is more than a setting value (D10): stop and take the fallback decision to Klaudiusz, with the log

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), the starred baseline items, the dated "Checked on" line filled in
- [ ] `specs/roadmap.md`: item 17 marked done with the spec link (set when the branch is closed)
- [ ] `CHANGELOG.md` through `/changelog` at close-out, tidied
- [ ] After the merge and push (Klaudiusz): no GitHub Actions run starts, the Vercel production deploy is Ready, then Klaudiusz unpublishes Pages and the `github.io` check is done (validation section 4)
