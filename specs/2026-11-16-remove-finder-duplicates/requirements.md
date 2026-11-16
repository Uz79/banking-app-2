Branch: `feature/remove-finder-duplicate-files`

# Remove the Finder duplicates (70): requirements

Roadmap item 70 (`specs/roadmap.md`), found while writing 63 and 64's spec (2026-11-08): `apps/web/scripts/generate-tokens-css 2.mjs` is tracked and is an accidental copy. It asked to check the other `* 2.*` files for the same. They are many: git tracks 686 Finder-style duplicates (`name 2.ext`, `name 3.ext`), left behind when files were copied in Finder. This branch removes the ones outside the tracked build output, and stops them coming back.

## Scope

**In:**

1. The duplicates under `apps/web` outside `storybook-static` (131 files: the generator copy, `js/payment-details 2.js`, 3 story copies, 126 icon copies) and under `designs/` (194 files once the six in D3 stay), 325 in all (D1, D2)
2. The sprite and the pages that embed it, regenerated so the junk symbols leave (D4)
3. A guard in `scripts/sync_icons_sprite.py` and an ignore pattern in `.gitignore` (D5, D6)

**Out (not in this branch):**

- The 355 duplicates inside `apps/web/storybook-static`, which is tracked build output (1591 files): a new roadmap item, 75, with the question of whether it should be tracked at all (D7)
- Six files that look like duplicates but are not (D3)
- `sync_icons_sprite.py`'s other steps (it also rewrites `js/storage-migrate.js` and embeds the sprite in two more pages when run): roadmap 76
- Any behaviour change. The only visible effect is a smaller sprite (D8)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Scope: `apps/web` source and `designs/`, not `storybook-static`** (interview) | Storybook's output is generated and tracked for its own reasons; its duplicates are a symptom of tracking it, so they go with that decision (D7) |
| D2 | **A duplicate is a tracked file whose name is `<name> N.<ext>` (N = 2 to 9) and that is either beside its original, or inside a `_finder-duplicates` or `finder-duplicates` folder.** Byte-identical copies (261) go. The nine that differ are each compared with the original and with git history before they go (interview): they are older or abandoned copies, and any that held work the original lacks stops the branch for a question. Git history keeps every removed file | The rule is mechanical and reviewable; the nine are the only place a copy could hold something the original does not |
| D3 | **Six files stay.** `designs/components/card/section-card/_archive/2026-06-02/variants/other-products/default 2.png`, `.../pending-payments/default 2.svg`, `designs/components/card/section-card/_archive/2026-06-09/variants/positions/default 2.png` and `default 2.svg` have no original beside them (they are the only copy of that variant), and the two `Mode 1.json` files under `designs/tokens/_NEW/260617_tokens/**/tokens/test/` are the real file name | Removing them would delete the only copy of something; `Mode 1` is not a duplicate |
| D4 | **The sprite is regenerated, not edited.** After the 126 icon copies are removed, run `python3 apps/web/scripts/sync_icons_sprite.py` (AGENTS.md: the sprite is built by that script) so `assets/icons-sprite.svg` and the 16 pages that embed it lose the symbols such as `i-crosshair 2`. The diff is read: it may remove those symbols and nothing else | The script globs `icon24-*.svg`, so each copy became a symbol with a space in its id, shipped in the sprite and inlined into 16 pages |
| D5 | **`sync_icons_sprite.py` only reads `icon24-<name>.svg` names without spaces** (interview): the glob is filtered by a pattern (lowercase letters, digits and hyphens) in its two places, so a stray Finder copy cannot reach the sprite | Deleting the files fixes today; the guard fixes the cause |
| D6 | **`.gitignore` gains `* [2-9]` and `* [2-9].*`** (interview), with a comment saying why. It does not untrack anything (git ignores the rule for tracked files), so the removal is explicit; `[2-9]` leaves names ending in ` 1` alone | A new Finder copy stays out of `git status`. The pattern only matches a name with a space before a single digit |
| D7 | **A new roadmap item, 75, for `storybook-static`** (D1): is it tracked on purpose (a hosted Storybook?), and if not, untrack and ignore it, which removes its 355 duplicates with it. Found while checking 70 | A decision about generated output, not a cleanup |
| D8 | **No behaviour change.** Nothing in the app, the build, the token generator or Storybook reads a removed file; this is checked by name before anything is deleted (plan, group 1) | The point of the item is hygiene. The tracked generator copy writes to `apps/web/public/css`, which `tokens:build` does not use |
| D9 | **The generator copy (`generate-tokens-css 2.mjs`) goes** with the rest: it is 113 lines against 694, writes to `public/css/tokens.css` (the old location), has no typography output, and nothing runs it | Item 70's own finding, confirmed by a diff against the current generator |
| D10 | **The design manifests and the stories made from them stop naming removed files.** 14 `designs/components/**/*.json` manifests list the copies as extra states (`"pressed 2": "variants/x/pressed 2.svg"` beside `"pressed"`), and 12 generated stories under `apps/web/src/stories/components/design-export` embed them as images. The manifest lines are removed (the originals sit beside them), and the matching figures are removed from the stories by hand, not by running `npm run storybook:sync`: a full regeneration also changes the slider and text-field stories and adds three new ones, which is a different change. Archive notes in `.md` files that name a removed file are left as history | Found in group 1: a removed file that a manifest still names would be a broken image in Storybook. A full regeneration would widen the diff beyond this item |

## Context

- Counts (git ls-files, 2026-11-16): 686 duplicates in all; 355 in `storybook-static`; 131 in `apps/web` outside it (126 icons, 3 stories, `js/payment-details 2.js`, the generator copy); about 200 in `designs/` (113 under `components/button`, mostly `_archive`).
- Of the 331 outside `storybook-static`, 261 are byte-identical to their original, 9 differ, and 61 have no original beside them: 55 of those sit in `_finder-duplicates` folders (the folder is itself the duplicate set), 6 are D3.
- The 9 that differ, by what they are: `js/payment-details 2.js` (474 lines against 1138, dated 2026-06-19, behind the live file by months: it has `message: 'Salary May 2026'`, the live one `'Salary'`); the generator copy; `overview.stories 2.js`, `payment-flow-recipient-search.stories 2.js` and `payments.stories 2.js`; `designs/components/dialog/variants/basic/default 2.svg`; a PNG in `investment-product-details`; `normalize_design_exports 2.py` and `3.py` (3391 bytes against 37970 for the live script, older).
- The sprite embeds in `apps/web/*.html` between `<div id="uzbank-icon-defs">` tags (`embed_sprite_inline` in the script); 16 pages carry symbols with a space in their id today.

## Open questions

- Whether `designs/scripts/generate-storybook-design-exports.mjs` or `apps/web/scripts/generate-storybook-design-exports.mjs` reads files under `designs/` by glob (so a removed copy changes its output); checked in group 1 before deleting.
