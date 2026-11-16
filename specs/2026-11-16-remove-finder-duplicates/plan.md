# Remove the Finder duplicates (70): plan

Branch: `feature/remove-finder-duplicate-files`. Decisions are cited as D1 to D9 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. List and check (D2, D3, D8)

- [ ] A script in the scratchpad (not the repo) lists every tracked duplicate by the rule in D2, outside `storybook-static`, and writes the list to the scratchpad; the six in D3 are excluded
- [ ] For each of the nine that differ: diff against the original, read `git log` for both, and note in `validation.md` why the copy is stale; stop and ask before removing any that holds something the original lacks
- [ ] Search the repo (outside `node_modules`, `storybook-static`, `dist`) for each removed name (the whole name, with its space) and for `generate-storybook-design-exports.mjs` reading `designs/` by glob; nothing may read a removed file
- [ ] Check: the list's counts match `requirements.md` (325); no reference found

## 2. Remove the duplicates (D1, D2, D9)

- [ ] `git rm` the listed files under `apps/web` (outside `storybook-static`) and under `designs/`; empty `_finder-duplicates` folders disappear with them
- [ ] Check: `git status` shows only deletions; the six in D3 are still there; `npm run build` in `apps/web` still succeeds

## 3. The sprite and its guard (D4, D5)

- [ ] `apps/web/scripts/sync_icons_sprite.py`: only names that match `icon24-[a-z0-9-]+\.svg` are read, in both places that glob the icons
- [ ] Run `python3 apps/web/scripts/sync_icons_sprite.py`; read the diff of `assets/icons-sprite.svg` and the 16 pages: only symbols with a space in their id go, and nothing else changes
- [ ] Check: Overview, Payments, Account details, All bookings and the Components page in Dark and Light show every icon as before (a scripted pass lists any `<use href="#i-...">` that has no symbol)

## 4. Keep them out (D6, D7)

- [ ] `.gitignore`: `* [2-9]` and `* [2-9].*` with a one-line comment
- [ ] `specs/roadmap.md`: item 75 under Later for `storybook-static` (tracked output with 355 duplicates)
- [ ] Check: copy an icon in Finder terms (`cp icon24-home.svg "icon24-home 2.svg"`), run the sprite script (no symbol is added) and `git status` (the file is ignored), then delete the test file

## 5. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [ ] `specs/roadmap.md`: 70 marked done and moved to Done in number order, with what was found; 75 stays under Later
- [ ] `specs/tech-spec.md`: check; add a line to the icon sprite row if it names how the sprite is built
- [ ] `apps/web/README.md`: no storage key change; check the icon notes
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
