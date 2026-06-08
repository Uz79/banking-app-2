# Design tokens → CSS

## After a Figma export

1. Replace the exported JSON under this folder (`brand.json`, `alias.json`, `responsive/*`, `mapped/*`).
2. **Do not delete** `extensions.json` — it re-applies font-metrics, trim aliases, and stack gaps that Figma does not export.
3. From `apps/web`, run:

```bash
npm run tokens:build
```

4. Commit **both** the updated Figma JSON and the regenerated `apps/web/css/tokens.css` + `typography.css`.

## What not to hand-edit

| File | Edit via |
|------|----------|
| `apps/web/css/tokens.css` | `npm run tokens:build` only |
| `apps/web/css/typography.css` | `npm run tokens:build` only |
| `apps/web/css/styles.css` | Manual — component layout, not token primitives |

If trim or row spacing breaks after a build, fix **`extensions.json`** or **`scripts/generate-tokens-css.mjs`**, then rebuild — never patch the generated CSS.

## `extensions.json`

Merged on top of Figma exports. Keeps:

- `brand.font-metrics.profile-pro` (Profile Pro cap / ascender / descender for leading trim)
- `alias.trim.*` including `stack-row-gap` → `{space.1}` (8dp between trimmed title + subtitle)
- `alias.component.list-row` → `--list-row-pad-y`, `--list-row-pad-x`, `--list-row-gap` (Figma account row: space/3 = 16dp)

## Validation

`tokens:build` fails if font-metrics are missing or trim values compute to `0px`, so a bad Figma import cannot silently wipe leading trim again.
