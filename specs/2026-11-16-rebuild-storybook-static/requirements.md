Branch: `feature/rebuild-storybook-static`

# Rebuild `storybook-static` clean (75): requirements

Roadmap item 75 (`specs/roadmap.md`), found while writing 70's spec: `apps/web/storybook-static` is tracked build output (1591 files, 28 MB, last committed 2026-07-09) and holds 355 Finder duplicates (`name 2.ext`). Interview answer: it stays tracked for now, because it is live at `banking-app-2-bay.vercel.app/storybook-static/` (Vercel serves `apps/web` as it is, `tech-spec.md` "Deploy"). So it is rebuilt from a clean state, which drops the copies and brings it up to date with the current stories.

## Scope

**In:**

1. Delete the tracked `apps/web/storybook-static` and rebuild it with `npm run build-storybook` (D1, D2)
2. Check what the rebuild changed beyond the 355 copies, and that the hosted Storybook still works (D3, D4)
3. A new roadmap item, 77, for the longer fix: Vercel builds Storybook on deploy and the folder is untracked (D5)

**Out (not in this branch):**

- Untracking or ignoring `storybook-static`, and any change to the Vercel project or its build command: roadmap 77
- Any change to a story, a design manifest or `designs/` (the hand edits from 70 stay; `npm run storybook:sync` is not run, D2)
- Any change to the app itself

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Keep `storybook-static` tracked, rebuilt clean** (interview) | It is served live as part of the deploy; untracking it would take the hosted Storybook down until Vercel builds it (77) |
| D2 | **Remove the folder, then run `npm run build-storybook` in `apps/web`; do not run `npm run storybook:sync`** | Building over the old folder would keep every stale file. `build-storybook` is `tokens:build` then `storybook build`; the stories were hand-pruned in 70, and `storybook:sync` would add unrelated drift (slider, text-field, three new stories) |
| D3 | **Build from a clean tree and check the source did not move**: `tokens:build` must leave `css/tokens.css` and `css/typography.css` unchanged, and the Finder copies in `designs/` and `js/` are already gone (70), so none can be copied in by the `staticDirs` | Otherwise the new output would carry a changed token file or a copy |
| D4 | **The rebuilt folder has no name matching `* [2-9]` or `* [2-9].*`, and the story list is the current one** (`index.json` lists the stories in `src/stories`, none of the removed ones) | The point of the item; the old output still lists a story that was removed |
| D5 | **A new roadmap item, 77**: Vercel builds Storybook on deploy (`build-storybook` into the deploy output, or a Vercel project of its own), then `storybook-static` is untracked and gitignored; 75 stays under Later until then | Interview answer. Tracked output goes stale again and re-collects copies; a deploy-time build does not |
| D6 | **Check what depends on the URL before and after**: `/storybook-static/index.html` and `/storybook-static/iframe.html` resolve on the dev server and in the built folder, and the repo's other readers of the folder (`packages/ui/.ds-sync`, which takes `--storybook-static` as an argument) are not changed | Nothing live may break; the only consumer of the path found is the hosted Storybook itself and the tooling in `packages/ui/.ds-sync`, which takes the path as a flag |

## Context

- Tracked today: 1591 files, 355 of them copies (`app 2`, `assets 2`, `designs 3`, `fonts 2`, `images 2`, `sb-addons 2` and the files inside them). By folder: `designs` 979, `icons` 404, `assets` 156, `app` 20.
- Last commit to the folder: 2026-07-09; the stories moved on since (the latest on 2026-11-16), so the hosted Storybook is behind the source.
- `.storybook/main.js` `staticDirs`: `../assets`, `designs/` as `/designs`, `js/` as `/app/js`, and four page files as `/app/*.html`.
- A rebuild rewrites hashed file names, so the diff is large (adds and deletes); it is read by counts and by the checks above, not line by line.
- `vite.config.js` does not build it: the output only reaches visitors because Vercel serves `apps/web` as-is.

## Open questions

- Does `build-storybook` run on this machine without a network (Storybook may try telemetry or a version check)? If it needs a flag, record it in `validation.md`.
- Whether the rebuilt size changes noticeably (28 MB now); noted, no limit set.
