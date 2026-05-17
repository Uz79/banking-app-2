# E-Banking_WebApp_11

Fork of **WebApp_10** with the same multi-page shell, tokens, and **eight static recipients** from `js/payment-state.js`. **New:** opening **Pay** starts the **Type Ahead Search** step (`#pay/recipient-search`; see **`../../designs/screens`** (`payment-flow-*` folders)): search by name or IBAN, pick a row, then continue through the recipient form → amount → time schedule → summary.

Multi-page shell (same UX as _07) with **centralised SVG icons**: one sprite file plus `<use>` references so strokes follow `var(--color-fg)` via `currentColor`.

## Icons workflow

1. **Add or edit** a source file under `assets/icons/` named `icon24-{name}.svg` (24×24 viewBox, brand strokes/fills as `#00157E` is fine—the build rewrites to `currentColor`).
2. **Regenerate the sprite** from this folder:

   ```bash
   cd E-Banking_WebApp_11
   python3 scripts/sync_icons_sprite.py
   ```

   That rebuilds `assets/icons-sprite.svg` from every `assets/icons/icon24-*.svg`. (The same script can migrate legacy `<img>` markup and bump storage keys when pointed at an older tree; on _09 the HTML is already migrated.)

3. **Markup**: each shell page includes an inline **sprite block** right after `<body>` (`#uzbank-icon-defs`). Icons use **same-document** references only:

   ```html
   <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false">
     <use href="#i-home"/>
   </svg>
   ```

   Do **not** point `<use>` at `icons-sprite.svg#…` alone: external fragments are unreliable under `file://` and in WebKit. Re-run `sync_icons_sprite.py` to refresh the inline block after editing the sprite.

   **Why not `hidden` / `display:none` on the sprite?** That prevents same-document `<use>` from painting in Safari; the sprite root uses a zero-sized absolutely positioned SVG instead (`styles.css` clips the host div).

4. **Styles**: BEM classes on the host `<svg>` set size; `css/styles.css` sets `color: var(--color-fg)` (or `var(--color-btn-primary-fg)` for action circles / logout). No per-theme `filter` stack on these icons.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/sync_icons_sprite.py` | Build `icons-sprite.svg`, migrate legacy `<img>` if present, **embed** the sprite into each shell HTML page after `<body>`, rewrite `<use>` to `href="#i-…"`. Re-run after adding icons. |
| `scripts/generate_mp_pages.py` | One-off generator from `spa-source.html` slices; uses `svg_icon()` for sidebar/tab bar. Regenerating overwrites shell pages—keep the inline colour boot in sync manually if you use it. |

## Storage keys

- Theme: `uzBankWebApp11Theme`
- Colour override: `uzBankWebApp11ColorOverride` (`{ bg, fg }` only; extended derivation includes button pressed + tonal roles — see `js/contrast-checker.js` and shell boot scripts.)

## Source layout

- `spa-source.html` — wide SPA-style source; boot uses `uzBankWebApp11Theme` (colour override boot lives on shell pages such as `overview.html`).
- `components.html` — **Button** design-system gallery (primary, secondary, tonal; hover / pressed / static “pressed” demo).
- `css/tokens.css` — resolved from repo root `tokens4_website-UZ.json` (mapped light/dark + responsive type scale). Includes `--color-surface-state-hover` / `--color-surface-state-pressed` (aliases of secondary button overlays) for list rows, nav, inputs, and other non-button surfaces.
- Individual `assets/icons/icon24-*.svg` remain the **authoring** copies; the sprite is generated output.
