import type { SavedTheme } from "../lib/themeColors";
import raw from "./builtinThemes.json";

/** Built-in theme cards shipped with the app (from localhost library). */
export const BUILTIN_THEMES = raw as SavedTheme[];

/** BANKING: first-run theme is Custom 10. "UZ Bank" stays a separate card. */
export const DEFAULT_BUILTIN_THEME_ID = "t_da0fdc6c4b056_1a122a822ab";

export function getDefaultBuiltinTheme(): SavedTheme {
  return (
    BUILTIN_THEMES.find((t) => t.id === DEFAULT_BUILTIN_THEME_ID) ??
    BUILTIN_THEMES[0]!
  );
}
