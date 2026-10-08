/**
 * Banking adapter around the Cartography Lab theme engine.
 *
 * - Only Profile loads this file. Every save stores the finished --color-* tokens
 *   for BOTH shells in localStorage (uzBankWebColorTokens), so the boot script on
 *   every page and the sidebar Light/Dark toggle just apply them: no colour maths
 *   anywhere else.
 * - "UZ Bank" (id uzbank-default) is the untouched tokens.css look: choosing it,
 *   or "Reset to theme", removes the override instead of writing one.
 */
import * as tc from "./lib/themeColors";
import type { ColorPair, ThemeMode } from "./lib/themeColors";
import { DEFAULT_BUILTIN_THEME_ID } from "./data/builtinThemes";

export * from "./lib/themeColors";
export { DEFAULT_BUILTIN_THEME_ID } from "./data/builtinThemes";

export const TOKEN_CACHE_KEY = "uzBankWebColorTokens";
export const UZBANK_THEME_ID = DEFAULT_BUILTIN_THEME_ID;

/** The banking CSS reads --color-* roles only; the v4/map tokens stay out. */
export function bankingTokens(pair: ColorPair): Record<string, string> {
  const all = tc.deriveTokens(pair.bg, pair.fg, pair.neutral, pair.kind ?? "monochrome", {
    neutralSeed: pair.neutralSeed,
    primarySeed: pair.primarySeed,
  });
  const out: Record<string, string> = {};
  for (const k of Object.keys(all)) if (k.startsWith("color-")) out[k] = all[k];
  return out;
}

export function currentShell(): ThemeMode {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function clearInlineColorTokens(): void {
  const style = document.documentElement.style;
  const names: string[] = [];
  for (let i = 0; i < style.length; i++) {
    const n = style[i];
    if (n.startsWith("--color-")) names.push(n);
  }
  names.forEach((n) => style.removeProperty(n));
}

export function applyTokenMap(map: Record<string, string> | null | undefined): void {
  clearInlineColorTokens();
  if (!map) return;
  const style = document.documentElement.style;
  for (const k of Object.keys(map)) style.setProperty(`--${k}`, map[k]);
}

/**
 * Save a committed pair for `shell`: work out the other shell the same way the
 * Light/Dark switch does in Cartography (resolveThemeChoice), store the override
 * with both shells' contrast/primary indices, cache both token sets, apply.
 */
export function persistPair(pair: ColorPair, shell: ThemeMode): ColorPair {
  const other: ThemeMode = shell === "light" ? "dark" : "light";
  const otherPair = tc.resolveThemeChoice(other, pair, shell);
  const stored: ColorPair = {
    ...pair,
    ...(otherPair.contrastByShell ? { contrastByShell: otherPair.contrastByShell } : {}),
    ...(otherPair.primaryByShell ? { primaryByShell: otherPair.primaryByShell } : {}),
  };
  tc.saveOverride(stored);
  const cache: Record<string, Record<string, string>> = {};
  cache[shell] = bankingTokens(pair);
  cache[other] = bankingTokens(otherPair);
  try {
    localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota */
  }
  applyTokenMap(cache[shell]);
  return stored;
}

/** Back to the UZ Bank look: no override, no cache, tokens.css applies. */
export function clearToBankDefault(): void {
  tc.clearSavedOverride();
  try {
    localStorage.removeItem(TOKEN_CACHE_KEY);
  } catch {
    /* ignore */
  }
  clearInlineColorTokens();
}

/** Apply the cached tokens for a shell (used on load, after the sidebar toggle). */
export function applyCachedShell(shell: ThemeMode): void {
  try {
    const raw = localStorage.getItem(TOKEN_CACHE_KEY);
    const all = raw ? JSON.parse(raw) : null;
    applyTokenMap(all && all[shell]);
  } catch {
    applyTokenMap(null);
  }
}

/** Is the UZ Bank default active (no override stored)? */
export function isBankDefault(): boolean {
  return tc.readSavedOverride() == null;
}
