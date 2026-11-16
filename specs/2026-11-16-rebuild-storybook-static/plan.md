# Rebuild `storybook-static` clean (75): plan

Branch: `feature/rebuild-storybook-static`. Decisions are cited as D1 to D6 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (the Storybook build is served with `npx vite preview` or `python3 -m http.server 5199` from `apps/web`, stopped when done).

## 1. Before (D3, D6)

- [x] Record the baseline: file count, size, the 355 copies, the story ids in the old `index.json`
- [x] Search the repo (outside `node_modules`, `dist`, `storybook-static`) for readers of the folder; confirm only specs and `packages/ui/.ds-sync` (a flag) name it
- [x] Check: `git status` is clean before the rebuild; `npm run tokens:build` leaves `css/tokens.css` and `css/typography.css` unchanged

## 2. Rebuild (D1, D2)

- [x] `git rm -r apps/web/storybook-static`, then `cd apps/web && npm run build-storybook` (not `storybook:sync`)
- [x] Stage the new folder; `git status` shows the old files deleted and the new ones added, and no change outside `storybook-static`
- [x] Check: the folder exists with `index.html`, `iframe.html` and `index.json`

## 3. Read the result (D3, D4)

- [x] No tracked name matches `* [2-9]` or `* [2-9].*` under `storybook-static`
- [x] `index.json` lists the current stories and none of the stories removed since July; compare the ids with the old list
- [x] Count and size against the baseline, noted in `validation.md`
- [x] Check: serve `apps/web` and open `/storybook-static/index.html`: the sidebar lists the stories and a story from Components, Pages and Design export render in Light and Dark

## 4. Roadmap (D5)

- [x] `specs/roadmap.md`: item 77 under Later (Vercel builds Storybook on deploy, then untrack and ignore), 75 links this spec and says what is left
- [x] Check: 75 and 77 read as a pair

## 5. Wrap-up

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] (run in part; unticked items are in validation.md) Every item of `validation.md`, then the baseline smoke test (copied into it)
- [x] `specs/roadmap.md`: 75 stays under Later with what was done; nothing moves to Done until 77 ends it
- [x] `specs/tech-spec.md`: the "Finder duplicates" row and any `storybook-static` mention; add how the folder is rebuilt
- [x] `apps/web/README.md`: add the rebuild command if the file names Storybook
- [x] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
