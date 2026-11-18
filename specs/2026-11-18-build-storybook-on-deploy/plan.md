# Vercel builds Storybook on deploy (77, closes 75): plan

Branch: `feature/build-storybook-on-deploy`. Decisions are cited as D1 to D7 from `requirements.md`.

## 1. The deploy builds Storybook (D1, D3, D4, D7)

- [ ] `apps/web/vercel.json`: add `buildCommand` and the two rewrites (keep the three existing ones)
- [ ] Locally: `npm run build && npm run build-storybook` from `apps/web` succeeds (then `dist` is removed as the deploy does)
- [ ] Check: JSON is valid; the rewrites are emulated locally (a small static server, or `npx vercel dev` if available) and `/designs/...` and `/app/js/theme-boot.js` resolve through `/storybook-static/`

## 2. Untrack the folder (D2)

- [ ] `.gitignore`: `apps/web/storybook-static/` with a one-line comment (deploy output, 77)
- [ ] `git rm -r --cached apps/web/storybook-static`; the folder stays on disk
- [ ] Check: `git status` shows only deletions from the index plus `.gitignore`; `git ls-files apps/web/storybook-static` is empty; the 355 old copies are gone from git with it

## 3. The preview (D5)

- [ ] Klaudiusz pushes the branch (GitHub Desktop); Vercel builds a preview
- [ ] On the preview: `/storybook-static/` loads, a Design export story shows its figures, the Overview live-page story mounts, the console has no error beyond the extension's, and the app's own pages work
- [ ] Check: the build log shows the Storybook step and no size or time limit hit

## 4. Wrap-up

- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md`: 77 and 75 marked done and moved to Done in number order
- [ ] `specs/tech-spec.md`: the "Deploy" row (the build command, Storybook built on deploy, the rewrites) and the Finder duplicates row
- [ ] `apps/web/README.md`: how Storybook is built and where it is served
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
