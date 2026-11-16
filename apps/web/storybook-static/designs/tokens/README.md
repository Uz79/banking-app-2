# Design tokens → CSS

## After a Figma export (3 steps)

1. Paste the export under `designs/tokens/_NEW/<YYMMDD>_tokens/` (inbox only — build does not read `_NEW/`).
2. From `apps/web`, validate (optional preview) then promote:

   ```bash
   npm run tokens:validate -- <folder>   # preview — will fail if Figma omitted engineering tokens
   npm run tokens:promote -- <folder>    # archive live → merge engineering tokens → build
   ```

   Example: `npm run tokens:promote -- 260609_tokens`

   `tokens:promote` archives the current live tokens to `designs/tokens/_archive/`, copies the export into this folder, carries forward any missing engineering tokens from the archive (see manifest), runs `tokens:build`, and rolls back on failure.

3. Spot-check Overview in the app and one Live story in Storybook.  
   If promote **fails** → fix the JSON or re-export from Figma. **Do not** patch generated CSS.

Commit the updated Figma JSON **and** the regenerated `apps/web/css/tokens.css` + `typography.css`.

### Engineering tokens (required-manifest.json)

Figma may omit tokens the CSS generator needs. `required-manifest.json` lists them. `tokens:validate` reports missing tokens; `tokens:promote` merges them from the last live export when absent. Update the manifest when `generate-tokens-css.mjs` gains new hard dependencies.

## What not to hand-edit

| File | Edit via |
|------|----------|
| `apps/web/css/tokens.css` | `npm run tokens:build` only |
| `apps/web/css/typography.css` | `npm run tokens:build` only |
| `apps/web/css/styles.css` | Manual — component layout; use `var(--*)` from generated files |

## Build validation

`tokens:build` fails when a bad import would silently break typography:

- `brand.font-metrics.profile-pro` missing or incomplete
- Leading trim for `text-sm` / `text-xs` computes to `0`
- `paragraph.md` is not `16px` on mobile

Fix the source JSON, then rebuild. Never "fix" trim by editing generated CSS.

## App ↔ Storybook parity

Both load the same files in the same order:

1. `tokens.css`
2. `typography.css`
3. `styles.css`

Storybook runs `tokens:build` before `npm run storybook` so Live stories always match the app.
