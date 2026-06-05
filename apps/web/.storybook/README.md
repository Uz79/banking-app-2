# Storybook (apps/web)

## Run

```bash
cd apps/web && npm run storybook
```

Default port: **6006** (Storybook picks the next free port if busy).

## Story groups

| Group | Path | Purpose |
|-------|------|---------|
| **Live** | `src/stories/live/` | Interactive — real app scripts, clicks, overlays |
| **Pages** / **Components** | `src/stories/pages/implementation/`, `src/stories/*.stories.js` | Static HTML snapshots |
| **Design export** | `src/stories/**/design-export/` | SVG reference from Figma (`npm run storybook:sync`) |

## Live pages

Live page stories fetch `overview.html`, `payments.html`, or `account-details.html` and load the same `js/*` bundle as the standalone app.

Helpers: `.storybook/mount-live-page.js`, `js/document-ready.js`.

## Theme

Use the **Theme** toolbar for light/dark on all stories.

## Live pages blank / Interactions FAIL?

Restart Storybook after pulling changes (`Ctrl+C`, then `npm run storybook` again). The running server on **6011** may have started before `/app/js` static files were configured.

Live stories bundle HTML directly; app scripts load from `/app/js/*`.
