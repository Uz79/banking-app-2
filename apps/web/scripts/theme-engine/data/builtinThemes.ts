import type { SavedTheme } from "../lib/themeColors";
import raw from "./builtinThemes.json";

/** Built-in theme cards shipped with the app (from localhost library). */
export const BUILTIN_THEMES = raw as SavedTheme[];

/** BANKING: first-run theme is Custom 01 (sage). "UZ Bank" stays a separate card. */
export const DEFAULT_BUILTIN_THEME_ID = "t_60e4b9e0a998e_1a0afd66790";

export function getDefaultBuiltinTheme(): SavedTheme {
  return (
    BUILTIN_THEMES.find((t) => t.id === DEFAULT_BUILTIN_THEME_ID) ??
    BUILTIN_THEMES[0]!
  );
}
