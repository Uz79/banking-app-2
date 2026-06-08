# Design tokens → CSS

## After a Figma export (3 steps)

1. Replace the exported JSON in this folder (`brand.json`, `alias.json`, `responsive/*`, `mapped/*`).
2. From `apps/web`, run:

   ```bash
   npm run tokens:build
   ```

3. If the build **passes** → spot-check Overview in the app and one Live story in Storybook.  
   If it **fails** → fix the JSON (see errors in the terminal). **Do not** patch generated CSS.

Commit the updated Figma JSON **and** the regenerated `apps/web/css/tokens.css` + `typography.css`.

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
