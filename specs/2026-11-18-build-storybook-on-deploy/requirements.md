Branch: `feature/build-storybook-on-deploy`

# Vercel builds Storybook on deploy (77, closes 75): requirements

Roadmap item 77 (`specs/roadmap.md`), added while closing 75. `apps/web/storybook-static` is tracked build output (1707 files, about 74 MB on disk) that goes stale and collects Finder copies. It is live at `banking-app-2-bay.vercel.app/storybook-static/` only because Vercel serves `apps/web` as it is (`tech-spec.md`, "Deploy"). This branch makes the deploy build it, so the folder can leave git, and fixes the root-path problem found in 75.

## Scope

**In:**

1. `apps/web/vercel.json`: a `buildCommand` that also builds Storybook, and two rewrites for the root paths Storybook's stories use (D1, D3)
2. `git rm -r --cached` of `apps/web/storybook-static`, and a `.gitignore` entry for it (D2)
3. A check on a Vercel preview of the branch (D5)
4. Docs: `tech-spec.md` ("Deploy" and the Finder duplicates rows), `CHANGELOG.md`, `apps/web/README.md` (how Storybook is built and where it lives)

**Out (not in this branch):**

- A separate Vercel project for Storybook (D1); making the stories base-aware (D3)
- Changes to any story, to the Storybook config, to the app, or to `vite.config.js`
- `packages/ui/.ds-sync`, which takes a `--storybook-static` path as an argument and tracks nothing here

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Same project, built in the deploy** (interview): `buildCommand` in `apps/web/vercel.json` is `npm run build && npm run build-storybook && rm -rf dist node_modules`. The only difference from today's gate (`npm run build && rm -rf dist node_modules`, per `tech-spec.md`) is the Storybook step | Keeps the live URL and gives preview deploys a Storybook; `vercel.json` takes precedence over the dashboard's build command, so the command is reviewed in git. `rm -rf dist node_modules` stays last, so neither is published. A failing Storybook build fails the deploy, as a failing app build does |
| D2 | **`storybook-static` is untracked and ignored** (`git rm -r --cached`, then `apps/web/storybook-static/` in `.gitignore`); the folder on disk stays for local use | The deploy now makes it; tracked output goes stale and re-collects Finder copies (75). Closes 75 |
| D3 | **Two rewrites in `apps/web/vercel.json`** (interview): `/designs/:path*` to `/storybook-static/designs/:path*` and `/app/:path*` to `/storybook-static/app/:path*` | Stories use root paths (310 uses of `/designs/`, 8 of `/app/`) that only resolve at the site root, so under `/storybook-static/` the figures 404 and the live-page stories fail to load `/app/js/...`. A Vercel rewrite applies only when no file exists at the path, and `apps/web` has no `designs/` or `app/` folder, so the app is unaffected. Needs no story change |
| D4 | **The build does not run `storybook:sync`** (as in 75, D2), and the checked-in stories under `src/stories` are what is built | `storybook:sync` regenerates stories from `designs/` and would add unrelated changes |
| D5 | **The gate includes the branch's Vercel preview** (interview): the branch is pushed by Klaudiusz (GitHub Desktop), and `/storybook-static/` on its preview is checked: figures load, a live-page story mounts, no console error beyond the extension's own. No merge before that | A deploy-time build and Vercel rewrites cannot be seen locally; `main` deploys |
| D6 | **Rollback is `git revert` of the merge** (the folder returns as tracked output) | One commit to undo, no data involved |
| D7 | **No dependency, no storage key, no new page** | Storybook is already a devDependency in `apps/web/package.json`; Vercel installs devDependencies |

## Context

- Today's `apps/web/vercel.json` holds only three rewrites (`/from-cv`, `/from-portfolio`, `/from-linkedin`).
- `build-storybook` is `npm run tokens:build && storybook build`; output goes to `apps/web/storybook-static`.
- The build has to finish inside Vercel's limits (time, memory); a local build takes under a minute. The preview shows this.
- The one-line build command in the dashboard is not changed by this branch (the file overrides it); the dashboard still shows the old value.

## Open questions

- Does the dashboard setting block `vercel.json`'s `buildCommand` (it should not)? The preview shows it.
- The deploy output grows by about 74 MB; whether a limit is hit shows on the preview.
