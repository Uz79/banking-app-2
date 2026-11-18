Branch: `feature/sprite-script-builds-only-the-sprite`

# `sync_icons_sprite.py` builds only the sprite (76): requirements

Roadmap item 76 (`specs/roadmap.md`), found while building 70. `apps/web/scripts/sync_icons_sprite.py` does four things; two of them are one-offs with nothing left to do, and run today it damages three files. Measured on 2026-11-18 in a scratch copy of `apps/web` (not in the repo): on the 13 pages that carry the sprite in `<div id="uzbank-icon-defs">` it changes nothing; it rewrites `js/storage-migrate.js` so its legacy key table maps keys to themselves; and it doubles the sprite (280 to 560 symbols) in `fridge-advisor.html` and `investment-opening.html`, which carry it as a bare leading `<svg>` block instead of in that wrapper.

## Scope

**In:**

1. `scripts/sync_icons_sprite.py` reduced to its two jobs: build `assets/icons-sprite.svg` and embed it into the pages (D1)
2. `fridge-advisor.html` and `investment-opening.html` carry the sprite in the standard `uzbank-icon-defs` wrapper, like the other 13 pages (D2)
3. A check that the script is idempotent: run on the branch, `git diff` is empty (D3)
4. `apps/web/README.md` (the script's description), `CHANGELOG.md`, `specs/roadmap.md`

**Out (not in this branch):**

- `js/storage-migrate.js` and the legacy key table in it (D4)
- The sprite's content, the icon files, the guard from 70 (`icon_files()`), and any page's markup apart from the wrapper (D5)
- Storybook's own sprite in `.storybook/preview.js`, which is a separate copy
- Any visible change

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The script builds the sprite and embeds it, nothing else** (interview). `migrate_html_files`, `img_to_svg_use`, `IMG_RE` and `bump_storage_keys` are deleted; the docstring and the closing message are rewritten | `migrate_html_files` migrated `<img src="assets/icons/icon24-...">` to `<use>`; it finds 0 icons today. `bump_storage_keys` rewrites legacy `uzBankWebApp1x...` names and "WebApp 10/11" strings across `.html/.js/.py/.json/.md` files, and run again it turns `storage-migrate.js`'s legacy keys into the new ones, which breaks the migration it exists for. Both are finished one-offs; git history keeps them |
| D2 | **The two pages switch to the standard wrapper** (interview): their bare sprite block is wrapped in `<div id="uzbank-icon-defs" aria-hidden="true" class="uzbank-icon-defs">`, by a one-off edit (a scratch script, not the repo script), after checking it holds the same 280 symbols as `assets/icons-sprite.svg` | Then `embed_sprite_inline` treats all 15 pages the same and never doubles; the wrapper is what `AGENTS.md`, the README and the other pages already use. Whether a CSS rule targets `.uzbank-icon-defs` is checked first (the bare block has `style="position:absolute..."` itself) |
| D3 | **Idempotence is the test** (interview): after the change, `python3 apps/web/scripts/sync_icons_sprite.py` on a clean tree leaves `git diff` empty, for the sprite, the 15 pages and `js/storage-migrate.js` | The bug was that a run changed files that should not change. The script is then safe to run after adding an icon |
| D4 | **`js/storage-migrate.js` is left alone** (interview) | It is live behaviour for visitors who still hold old keys; retiring it is a separate decision. This branch only stops the script rewriting it |
| D5 | **No behaviour change**: the sprite file is byte-identical before and after, and each page's symbols are the same 280 | Hygiene only |
| D6 | **Roadmap 76's entry is corrected**: it sat in the Done region with item 70's "Built" paragraph orphaned beneath it (a misplaced edit made while building 70). 76 goes back under Later with a link to this spec, and the paragraph goes back under 70 | Found while reading the roadmap for this spec |
| D7 | **Item 78's work (`feature/opening-mobile-review`, `specs/2026-11-18-opening-mobile-review/`) is not touched** and not staged here. It needs the `#i-edit-2` symbol in `investment-opening.html`'s sprite, so this branch goes first | Klaudiusz's note from another session |

## Context

- `icon_files()` and `ICON_NAME` (roadmap 70) stay as they are.
- The pages that embed it: `account-details`, `all-bookings-and-payments`, `character-kit`, `components`, `design-system`, `details-of-position`, `fridge-advisor`, `investment-opening`, `investment-product-details`, `motion-specimens`, `overview`, `payments`, `playground`, `profile`, `spa-source` (15). `index.html` and `account-information.html` carry none.
- `embed_sprite_inline` only touches a page that contains `icons-sprite.svg#` or `href="#i-`; it replaces an existing `#uzbank-icon-defs` wrapper in place (inserting after `<body>`), so the wrapper form is the one it understands.

## Open questions

- Does any CSS or script select `.uzbank-icon-defs` or the bare block (D2)? Checked in plan group 1.
