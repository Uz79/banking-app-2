# `sync_icons_sprite.py` builds only the sprite (76): plan

Branch: `feature/sprite-script-builds-only-the-sprite`. Decisions are cited as D1 to D7 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The two pages (D2, D5)

- [ ] Check first: nothing in `css/`, `js/` or the HTML selects `.uzbank-icon-defs` or relies on the bare block; each page's bare block has the same 280 symbols as `assets/icons-sprite.svg` (compare the ids)
- [ ] `fridge-advisor.html` and `investment-opening.html`: wrap the bare sprite block in `<div id="uzbank-icon-defs" aria-hidden="true" class="uzbank-icon-defs">` (one-off scratch edit, not the repo script)
- [ ] Check: the fridge and the opening show their icons (back, close, the arrows) in Light and Dark; a scripted pass: every `<use href="#i-...">` has a symbol

## 2. The script (D1, D3, D4)

- [ ] `scripts/sync_icons_sprite.py`: delete `IMG_RE`, `img_to_svg_use`, `migrate_html_files`, `bump_storage_keys`; rewrite the docstring and the closing message; `main` builds and embeds
- [ ] Run it on the branch: `git diff` is empty (the sprite, 15 pages, `js/storage-migrate.js`); run it twice to be sure
- [ ] Check: add a throwaway `icon24-zz-test.svg` copy, run the script (sprite gains one symbol, nothing else changes), then remove both and run again (back to clean)

## 3. Roadmap (D6)

- [ ] `specs/roadmap.md`: 76 back under Later with a link to this spec, 70's "Built" paragraph back under 70

## 4. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md`: 76 marked done and moved to Done in number order
- [ ] `apps/web/README.md`: the script's description (it no longer migrates `<img>` icons)
- [ ] `specs/tech-spec.md`: check the icon sprite row
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
