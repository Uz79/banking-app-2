/**
 * Contrast audit of the theme engine (roadmap 74, D3).
 * Builds the tokens of every built-in theme in Light and Dark, with the engine bundle the app ships
 * (js/theme-engine.js), and measures each control's text colour on its own fill. Exits 1 under 4.5:1.
 * Run: npm run audit:contrast   (rebuild js/theme-engine.js first if scripts/theme-engine changed)
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIN = 4.5;

const store = {};
const sandbox = {
  localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  document: { documentElement: { getAttribute: () => null, style: { length: 0, setProperty() {}, removeProperty() {} } }, addEventListener() {} },
  console
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'js/theme-engine.js'), 'utf8'), sandbox);
const E = sandbox.UZBankThemeEngine;
if (!E) { console.error('js/theme-engine.js did not define UZBankThemeEngine'); process.exit(2); }

const themes = JSON.parse(fs.readFileSync(path.join(root, 'scripts/theme-engine/data/builtinThemes.json'), 'utf8'));

function rgba(hex) {
  const h = String(hex).replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = (i) => parseInt(f.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: f.length >= 8 ? n(6) / 255 : 1 };
}
function over(top, under) {
  const t = rgba(top); const u = rgba(under);
  const mix = (a, b) => Math.round(a * t.a + b * (1 - t.a));
  const hx = (v) => v.toString(16).padStart(2, '0');
  return '#' + hx(mix(t.r, u.r)) + hx(mix(t.g, u.g)) + hx(mix(t.b, u.b));
}

let failed = 0;
const rows = [];
for (const theme of themes) {
  const own = E.shellThemeFromPair(theme.bg, theme.fg, theme.neutral);
  for (const shell of ['light', 'dark']) {
    const pair = shell === own ? theme : E.resolveThemeChoice(shell, theme, own);
    const t = E.deriveTokens(pair.bg, pair.fg, pair.neutral, pair.kind ?? 'monochrome', { neutralSeed: pair.neutralSeed, primarySeed: pair.primarySeed });
    const page = t['color-bg'];
    const checks = [
      ['primary button', t['color-btn-primary-fg'], t['color-btn-primary-bg']],
      ['secondary button', t['color-btn-secondary-fg'], over(t['color-btn-secondary-bg'], page)],
      ['tonal button', t['color-btn-tonal-fg'], over(t['color-btn-tonal-bg'], page)],
      ['primary chip', t['color-chip-primary-fg'], t['color-chip-primary-bg']],
      ['secondary chip', t['color-chip-secondary-fg'], over(t['color-chip-secondary-bg'], page)],
      ['tonal chip', t['color-chip-filled-tonal-fg'], over(t['color-chip-filled-tonal-bg'], page)],
      ['segmented', t['segmented-foreground'], over(t['segmented-background'], page)],
      ['segmented selected', t['segmented-foreground-selected'], t['segmented-background-selected']]
    ];
    for (const [name, fg, bg] of checks) {
      const ratio = E.contrastRatio(fg, bg);
      const ok = ratio >= MIN;
      if (!ok) failed++;
      rows.push({ theme: theme.name, shell, control: name, ratio: Math.round(ratio * 100) / 100, ok });
    }
  }
}

const bad = rows.filter((r) => !r.ok);
console.log(`${themes.length} themes x 2 shells, ${rows.length} pairs, minimum ${MIN}:1`);
if (bad.length) {
  console.log('\nUnder ' + MIN + ':1:');
  bad.forEach((r) => console.log(`  ${r.theme} (${r.shell}) ${r.control}: ${r.ratio}`));
  console.log(`\n${bad.length} failing`);
  process.exit(1);
}
console.log('All pairs pass. Lowest: ' + rows.reduce((m, r) => (r.ratio < m.ratio ? r : m)).ratio);
