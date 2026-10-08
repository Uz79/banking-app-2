import type { SavedTheme } from "../lib/themeColors";
import raw from "./builtinThemes.json";

/** Built-in theme cards shipped with the app (from localhost library). */
export const BUILTIN_THEMES = raw as SavedTheme[];

/** BANKING: default card is "UZ Bank" — the untouched tokens.css look (no override). */
export const DEFAULT_BUILTIN_THEME_ID = "uzbank-default";

export function getDefaultBuiltinTheme(): SavedTheme {
  return (
    BUILTIN_THEMES.find((t) => t.id === DEFAULT_BUILTIN_THEME_ID) ??
    BUILTIN_THEMES[0]!
  );
}
