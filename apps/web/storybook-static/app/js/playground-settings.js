/**
 * Payday run: the settings dialog's values (roadmap item 7).
 * Four visual parameters kept in one localStorage key; anything missing or unknown falls back to its default.
 * Sound has its own key (js/playground-audio.js); Light and Dark is remembered by the app.
 */
const KEY = 'uzBankWebPlaygroundSettings';

export const DEFAULTS = { quality: 'high', camera: 'default', effects: true, fog: 'default' };
export const CHOICES = {
  quality: ['low', 'medium', 'high'],
  camera: ['close', 'default', 'far'],
  fog: ['near', 'default', 'far'],
};

export function readSettings() {
  const out = { ...DEFAULTS };
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    if (v && typeof v === 'object') {
      Object.keys(CHOICES).forEach((k) => { if (CHOICES[k].includes(v[k])) out[k] = v[k]; });
      if (typeof v.effects === 'boolean') out.effects = v.effects;
    }
  } catch (err) { /* bad JSON or blocked storage: defaults */ }
  return out;
}

export function writeSettings(values) {
  try { window.localStorage.setItem(KEY, JSON.stringify(values)); } catch (err) { /* blocked storage: not remembered */ }
}

/* Light and Dark, the way the sidebar toggle does it (UZBankApplyThemeChoice in js/app-mp.js, which this page does not load):
   save the mode, apply the cached colour tokens of that mode, set data-theme. The page's MutationObserver recolours the world. */
export function currentMode() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}
export function setMode(mode) {
  if (mode !== 'light' && mode !== 'dark') return;
  const style = document.documentElement.style;
  const names = [];
  for (let i = 0; i < style.length; i++) if (style[i].indexOf('--color-') === 0) names.push(style[i]);
  names.forEach((n) => style.removeProperty(n));
  try {
    const all = JSON.parse(window.localStorage.getItem('uzBankWebColorTokens') || 'null');
    const map = all && all[mode];
    if (map) for (const k in map) style.setProperty('--' + k, map[k]);
  } catch (err) { /* no cache: tokens.css */ }
  try { window.localStorage.setItem('uzBankWebTheme', mode); } catch (err) { /* ignore */ }
  document.documentElement.setAttribute('data-theme', mode);
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute('content', mode === 'light' ? 'light dark' : 'dark light');
}
