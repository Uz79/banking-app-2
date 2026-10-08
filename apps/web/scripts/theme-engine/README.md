# Theme engine (Profile > Theme)

Colour maths for the Profile > Theme panel, ported from cartography-lab-app
(`apps/web/src/lib/themeColors.ts` + `data/builtinThemes.*`). Edits for banking are
marked `BANKING:` in `lib/themeColors.ts`.

- `lib/themeColors.ts`: ramps, contrast checks, token derivation (Cartography, adapted)
- `data/builtinThemes.json`: built-in cards; "UZ Bank" (`uzbank-default`) comes first
- `banking.ts`: adapter. Saves the finished `--color-*` tokens for Light and Dark in
  `uzBankWebColorTokens`, so the boot script and the sidebar toggle just apply them.

The browser bundle is `js/theme-engine.js` (global `UZBankThemeEngine`). Rebuild after editing:

```sh
npx esbuild scripts/theme-engine/banking.ts --bundle --format=iife \
  --global-name=UZBankThemeEngine --target=es2018 --legal-comments=none \
  --outfile=js/theme-engine.js
```

(run from `apps/web`). The UI lives in `js/theme-panel.js`.

## localStorage keys

| Key | What |
| --- | --- |
| `uzBankWebColorOverride_v2` | committed theme + per-shell contrast and primary steps |
| `uzBankWebSavedColorThemes_v2` | saved theme cards |
| `uzBankWebBuiltinThemesSeeded_v1` | built-in cards seeded once |
| `uzBankWebColorTokens` | finished tokens `{ light: {...}, dark: {...} }` read on every page |

No override = the UZ Bank look from `css/tokens.css`.
