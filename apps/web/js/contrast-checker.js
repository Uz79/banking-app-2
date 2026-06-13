/**
 * UZ Bank Web — embedded colour-contrast checker with token derivation
 *
 * Lives only on profile.html.
 *
 * What changed vs _06: the picker no longer overrides only --color-bg /
 * --color-fg. From a single (BG, FG) pair we derive ALL ~16 colour roles the
 * app reads from tokens.css — bg-secondary, fg-secondary, separator,
 * fg-disabled, button bg/fg/hover, scrims, etc. — so a custom palette swaps
 * the entire UI coherently in one shot.
 *
 * Persistence:
 *   - localStorage key uzBankWebColorOverride stores just { bg, fg }
 *   - All other tokens are recomputed at load + on every change
 *   - The same derivation function runs in the boot script (inlined) so
 *     navigating to other pages re-derives + applies before paint.
 */
(function () {
  'use strict';

  var root = document.getElementById('contrastChecker');
  if (!root) return;

  var STORAGE_KEY = 'uzBankWebColorOverride';
  var THEMES_KEY = 'uzBankWebSavedColorThemes';

  /** Canonical BG/FG for sidebar Light / Dark (matches tokens.css). */
  var CANONICAL = {
    light: { bg: '#ffffff', fg: '#00157e' },
    dark: { bg: '#00157e', fg: '#ffffff' }
  };

  /** Same rule as deriveTokens(): darker background → dark shell / icon pipeline. */
  function shellThemeFromPair(bH, fH) {
    var bg = hexToRgb(bH);
    var fg = hexToRgb(fH);
    if (!bg || !fg) return 'dark';
    return relLuminance(bg) < relLuminance(fg) ? 'dark' : 'light';
  }

  var WCAG = { AA_LARGE: 3, AAA_LARGE: 4.5, AA_NORMAL: 4.5, AAA_NORMAL: 7 };

  /* ── Color math ─────────────────────────────────────────────────── */

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function (x) { return Math.round(x).toString(16).padStart(2, '0'); }).join('');
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        default: h = ((r - g) / d + 4) / 6;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    if (s === 0) { var v = Math.round(l * 255); return { r: v, g: v, b: v }; }
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    };
  }
  function relLuminance(rgb) {
    function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
  }
  function contrastRatio(hex1, hex2) {
    var a = hexToRgb(hex1), b = hexToRgb(hex2);
    if (!a || !b) return 1;
    var L1 = relLuminance(a), L2 = relLuminance(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
  function normalizeHex(raw) {
    var hex = raw.replace(/^#/, '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    return hex.length === 6 && /^[a-f\d]{6}$/i.test(hex) ? '#' + hex.toLowerCase() : null;
  }

  /* ── Token derivation ──────────────────────────────────────────────
   * Single source of truth for the derivation rule set. The same logic is
   * mirrored (in compact form) into each page's inline boot script so
   * navigation doesn't lose tokens.
   *
   * Mental model:
   *   - BG/FG are the seed pair the user picks.
   *   - "Secondary" surfaces lift toward the opposite extreme: bg-secondary
   *     mixes BG → FG, fg-secondary mixes FG → BG. The amount differs in
   *     dark vs light mode to mirror the original tokens.css design choices.
   *   - Alpha-derived tokens (separator, disabled, hover) are FG at fixed
   *     alpha — they auto-adapt to whatever surface they sit on.
   *   - Buttons swap the BG/FG roles (filled primary inverts).
   *   - Scrims use brand colour (FG on light shells, BG on dark) at theme-tuned alphas.
   * ────────────────────────────────────────────────────────────────── */

  function deriveTokens(bgHex, fgHex) {
    var bg = hexToRgb(bgHex), fg = hexToRgb(fgHex);
    if (!bg || !fg) return {};

    // BG darker than FG → "dark-mode-style". Drives elevation amounts.
    var isDark = relLuminance(bg) < relLuminance(fg);

    function mix(a, b, t) {
      return rgbToHex(
        a.r + (b.r - a.r) * t,
        a.g + (b.g - a.g) * t,
        a.b + (b.b - a.b) * t
      );
    }
    function fgAlpha(a) { return 'rgba(' + fg.r + ', ' + fg.g + ', ' + fg.b + ', ' + a + ')'; }
    function rgbAlpha(c, a) { return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + a + ')'; }
    function blackAlpha(a) { return 'rgba(0, 0, 0, ' + a + ')'; }

    var bgElev = isDark ? 0.22 : 0.07;
    var fgElev = isDark ? 0.06 : 0.22;

    return {
      // Surfaces
      'color-bg':           bgHex,
      'color-bg-secondary': mix(bg, fg, bgElev),
      'color-bg-sidebar':   bgHex,

      // Foregrounds
      'color-fg':           fgHex,
      'color-fg-secondary': mix(fg, bg, fgElev),
      'color-fg-label':     fgAlpha(0.7),
      'color-fg-disabled':  fgAlpha(0.4),

      // Alpha-derived (semi-transparent FG)
      'color-separator':          fgAlpha(0.10),
      'color-show-all-bg':        fgAlpha(0.10),
      'color-nav-item-active-bg': fgAlpha(0.10),
      'color-segmented-track-bg': fgAlpha(0.05),

      // Inputs — same semantics as tokens.css (stroke @ 70% FG; focus = solid FG)
      'color-input-stroke':       fgAlpha(0.7),
      'color-input-stroke-focus': fgHex,

      // Icon
      'color-icon-circle-fill': fgHex,

      // Buttons — primary inverts the BG/FG roles
      'color-btn-primary-bg':    fgHex,
      'color-btn-primary-fg':    bgHex,
      'color-btn-primary-hover': mix(fg, bg, fgElev),
      'color-btn-primary-pressed': mix(fg, bg, Math.min(0.45, fgElev * 1.75)),

      // Buttons — secondary (outline) + tonal (filled tint)
      'color-btn-secondary-bg':     'transparent',
      'color-btn-secondary-border': fgHex,
      'color-btn-secondary-fg':     fgHex,
      'color-btn-secondary-hover':  fgAlpha(0.1),
      'color-btn-secondary-pressed': fgAlpha(0.2),

      'color-btn-tonal-bg':     mix(bg, fg, isDark ? 0.28 : 0.08),
      'color-btn-tonal-border': mix(bg, fg, isDark ? 0.28 : 0.08),
      'color-btn-tonal-fg':     fgHex,
      'color-btn-tonal-hover':  mix(bg, fg, isDark ? 0.38 : 0.14),
      'color-btn-tonal-pressed': mix(bg, fg, isDark ? 0.48 : 0.22),

      // Elevation — brand-tinted scrim; neutral shadows
      'color-overlay-tint':         fgHex,
      'color-nav-elevated-shadow':   blackAlpha(isDark ? 0.35 : 0.06),
      'color-modal-elevated-shadow': blackAlpha(isDark ? 0.45 : 0.12),

      // Interaction overlays (lists, nav chips, circular actions — styles.css)
      'color-surface-state-hover':    fgAlpha(0.1),
      'color-surface-state-pressed':  fgAlpha(0.2),
      'color-action-circle-state-hover': isDark
        ? 'rgba(0, 21, 126, 0.1)'
        : 'rgba(255, 255, 255, 0.12)',
      'color-action-circle-state-pressed': isDark
        ? 'rgba(0, 21, 126, 0.2)'
        : 'rgba(255, 255, 255, 0.22)'
    };
  }

  // List of CSS custom-property names deriveTokens() writes — used by
  // clearOverrideOnDocument() so we only remove what we set.
  var DERIVED_NAMES = [
    'color-bg', 'color-bg-secondary', 'color-bg-sidebar',
    'color-fg', 'color-fg-secondary', 'color-fg-label', 'color-fg-disabled',
    'color-separator', 'color-show-all-bg', 'color-nav-item-active-bg', 'color-segmented-track-bg',
    'color-input-stroke', 'color-input-stroke-focus',
    'color-icon-circle-fill',
    'color-btn-primary-bg', 'color-btn-primary-fg', 'color-btn-primary-hover', 'color-btn-primary-pressed',
    'color-btn-secondary-bg', 'color-btn-secondary-border', 'color-btn-secondary-fg',
    'color-btn-secondary-hover', 'color-btn-secondary-pressed',
    'color-btn-tonal-bg', 'color-btn-tonal-border', 'color-btn-tonal-fg',
    'color-btn-tonal-hover', 'color-btn-tonal-pressed',
    'color-overlay-tint', 'color-nav-elevated-shadow', 'color-modal-elevated-shadow',
    'color-surface-state-hover', 'color-surface-state-pressed',
    'color-action-circle-state-hover', 'color-action-circle-state-pressed'
  ];

  /* ── State ──────────────────────────────────────────────────────── */

  function readDefaultsFromTheme() {
    var cs = getComputedStyle(document.documentElement);
    var bg = normalizeHex(cs.getPropertyValue('--color-bg').trim()) || '#00157e';
    var fg = normalizeHex(cs.getPropertyValue('--color-fg').trim()) || '#ffffff';
    return { bg: bg, fg: fg };
  }

  function readSavedOverride() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      var bg = normalizeHex(parsed.bg || '');
      var fg = normalizeHex(parsed.fg || '');
      return (bg && fg) ? { bg: bg, fg: fg } : null;
    } catch (e) { return null; }
  }

  /* ── Saved themes (multiple) ─────────────────────────────────────── */

  function readSavedThemes() {
    try {
      var raw = localStorage.getItem(THEMES_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(function (t) {
          var bg = normalizeHex(String(t && t.bg || ''));
          var fg = normalizeHex(String(t && t.fg || ''));
          if (!bg || !fg) return null;
          return {
            id: String(t.id || ''),
            name: String(t.name || 'Custom'),
            bg: bg,
            fg: fg,
            createdAt: Number(t.createdAt || Date.now())
          };
        })
        .filter(Boolean);
    } catch (e) { return []; }
  }

  function writeSavedThemes(list) {
    try { localStorage.setItem(THEMES_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function nextThemeName(existing) {
    var used = {};
    existing.forEach(function (t) { used[t.name] = true; });
    for (var i = 1; i < 100; i += 1) {
      var name = 'Custom ' + String(i).padStart(2, '0');
      if (!used[name]) return name;
    }
    return 'Custom';
  }

  function makeId() {
    return 't_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
  }

  // Seed picker from saved override OR — if none — from theme defaults. To
  // get clean theme defaults we need to read computed style BEFORE we apply
  // any inline overrides. The boot script may have already applied them, so
  // strip first, then read.
  function readDefaultsByStrippingOverride() {
    var prior = {};
    var style = document.documentElement.style;
    DERIVED_NAMES.forEach(function (name) {
      prior[name] = style.getPropertyValue('--' + name);
      style.removeProperty('--' + name);
    });
    var d = readDefaultsFromTheme();
    Object.keys(prior).forEach(function (name) {
      if (prior[name]) style.setProperty('--' + name, prior[name]);
    });
    return d;
  }

  var saved = readSavedOverride();
  var defaults = saved ? null : readDefaultsByStrippingOverride();
  var bgHex = saved ? saved.bg : defaults.bg;
  var fgHex = saved ? saved.fg : defaults.fg;

  /* ── DOM refs ───────────────────────────────────────────────────── */

  var $ = function (id) { return document.getElementById(id); };
  var contrastRatioEl = $('ccContrastRatio');
  var bgHexInput = $('ccBgHex');
  var fgHexInput = $('ccFgHex');
  var bgHexClear = root.querySelector('[data-cc-clear="bg"]');
  var fgHexClear = root.querySelector('[data-cc-clear="fg"]');
  var bgRgb = { r: $('ccBgR'), g: $('ccBgG'), b: $('ccBgB') };
  var fgRgb = { r: $('ccFgR'), g: $('ccFgG'), b: $('ccFgB') };
  var bgHsl = { h: $('ccBgH'), s: $('ccBgS'), l: $('ccBgL') };
  var fgHsl = { h: $('ccFgH'), s: $('ccFgS'), l: $('ccFgL') };
  var vals = {
    bg: { r: $('ccBgRVal'), g: $('ccBgGVal'), b: $('ccBgBVal'), h: $('ccBgHVal'), s: $('ccBgSVal'), l: $('ccBgLVal') },
    fg: { r: $('ccFgRVal'), g: $('ccFgGVal'), b: $('ccFgBVal'), h: $('ccFgHVal'), s: $('ccFgSVal'), l: $('ccFgLVal') }
  };

  var savedGrid = $('ccSavedGrid');
  var savedThemes = readSavedThemes();

  /* ── Apply / clear / persist ────────────────────────────────────── */

  function applyDerivedTokens() {
    var derived = deriveTokens(bgHex, fgHex);
    var style = document.documentElement.style;
    Object.keys(derived).forEach(function (name) {
      style.setProperty('--' + name, derived[name]);
    });
  }

  function clearOverrideOnDocument() {
    var style = document.documentElement.style;
    DERIVED_NAMES.forEach(function (name) { style.removeProperty('--' + name); });
  }

  function saveOverride() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ bg: bgHex, fg: fgHex })); } catch (e) {}
  }
  function clearSavedOverride() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* ── UI sync ────────────────────────────────────────────────────── */

  function syncSlidersFromHex(who) {
    var hex = who === 'bg' ? bgHex : fgHex;
    var rgb = hexToRgb(hex);
    if (!rgb) return;
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    var s = who === 'bg' ? bgRgb : fgRgb;
    var h = who === 'bg' ? bgHsl : fgHsl;
    s.r.value = rgb.r; s.g.value = rgb.g; s.b.value = rgb.b;
    h.h.value = hsl.h; h.s.value = hsl.s; h.l.value = hsl.l;
    showValues(who);
  }
  function hexFromRgbSliders(who) {
    var s = who === 'bg' ? bgRgb : fgRgb;
    var hex = rgbToHex(+s.r.value, +s.g.value, +s.b.value);
    if (who === 'bg') { bgHex = hex; bgHexInput.value = hex; }
    else              { fgHex = hex; fgHexInput.value = hex; }
    var hsl = rgbToHsl(+s.r.value, +s.g.value, +s.b.value);
    var h = who === 'bg' ? bgHsl : fgHsl;
    h.h.value = hsl.h; h.s.value = hsl.s; h.l.value = hsl.l;
    showValues(who);
  }
  function hexFromHslSliders(who) {
    var h = who === 'bg' ? bgHsl : fgHsl;
    var rgb = hslToRgb(+h.h.value, +h.s.value, +h.l.value);
    var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    if (who === 'bg') { bgHex = hex; bgHexInput.value = hex; }
    else              { fgHex = hex; fgHexInput.value = hex; }
    var s = who === 'bg' ? bgRgb : fgRgb;
    s.r.value = rgb.r; s.g.value = rgb.g; s.b.value = rgb.b;
    showValues(who);
  }
  function showValues(who) {
    var s = who === 'bg' ? bgRgb : fgRgb;
    var h = who === 'bg' ? bgHsl : fgHsl;
    var v = vals[who];
    v.r.textContent = s.r.value; v.g.textContent = s.g.value; v.b.textContent = s.b.value;
    v.h.textContent = h.h.value; v.s.textContent = h.s.value; v.l.textContent = h.l.value;
  }
  function updateHexClearButton(who) {
    var input = who === 'bg' ? bgHexInput : fgHexInput;
    var btn = who === 'bg' ? bgHexClear : fgHexClear;
    if (!input || !btn) return;
    var shouldShow = document.activeElement === input && input.value.length > 1;
    btn.classList.toggle('form-field__clear--hidden', !shouldShow);
  }
  function updateHexClearButtons() {
    updateHexClearButton('bg');
    updateHexClearButton('fg');
  }
  function updateBadge(id, passes) {
    var el = $(id); if (!el) return;
    el.querySelector('.cc-badge-text').textContent = passes ? 'Pass' : 'Fail';
    el.classList.toggle('cc-badge--pass', passes);
    el.classList.toggle('cc-badge--fail', !passes);
  }

  /* ── Main ───────────────────────────────────────────────────────── */

  function refresh(saveAfter) {
    var ratio = contrastRatio(bgHex, fgHex);
    contrastRatioEl.textContent = ratio.toFixed(2);
    applyDerivedTokens();
    if (saveAfter !== false) saveOverride();
    updateBadge('ccBadgeAALarge',   ratio >= WCAG.AA_LARGE);
    updateBadge('ccBadgeAAALarge',  ratio >= WCAG.AAA_LARGE);
    updateBadge('ccBadgeAANormal',  ratio >= WCAG.AA_NORMAL);
    updateBadge('ccBadgeAAANormal', ratio >= WCAG.AAA_NORMAL);
  }

  function refreshNoSave() {
    var ratio = contrastRatio(bgHex, fgHex);
    contrastRatioEl.textContent = ratio.toFixed(2);
    updateBadge('ccBadgeAALarge',   ratio >= WCAG.AA_LARGE);
    updateBadge('ccBadgeAAALarge',  ratio >= WCAG.AAA_LARGE);
    updateBadge('ccBadgeAANormal',  ratio >= WCAG.AA_NORMAL);
    updateBadge('ccBadgeAAANormal', ratio >= WCAG.AAA_NORMAL);
  }

  function updateSliderProgress(slider) {
    var min = +slider.min, max = +slider.max, val = +slider.value;
    var pct = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--cc-progress', pct + '%');
  }
  function updateAllSliderProgress() {
    root.querySelectorAll('.cc-color-slider').forEach(updateSliderProgress);
  }

  /* ── Event wiring ───────────────────────────────────────────────── */

  ['r', 'g', 'b'].forEach(function (ch) {
    bgRgb[ch].addEventListener('input', function () { hexFromRgbSliders('bg'); refresh(); updateAllSliderProgress(); });
    fgRgb[ch].addEventListener('input', function () { hexFromRgbSliders('fg'); refresh(); updateAllSliderProgress(); });
  });
  ['h', 's', 'l'].forEach(function (ch) {
    bgHsl[ch].addEventListener('input', function () { hexFromHslSliders('bg'); refresh(); updateAllSliderProgress(); });
    fgHsl[ch].addEventListener('input', function () { hexFromHslSliders('fg'); refresh(); updateAllSliderProgress(); });
  });

  bgHexInput.addEventListener('input', function () {
    var h = normalizeHex(bgHexInput.value);
    if (h) { bgHex = h; syncSlidersFromHex('bg'); refresh(); updateAllSliderProgress(); }
    updateHexClearButton('bg');
  });
  bgHexInput.addEventListener('focus', function () { updateHexClearButton('bg'); });
  bgHexInput.addEventListener('blur', function () {
    setTimeout(function () { updateHexClearButton('bg'); }, 0);
  });
  bgHexInput.addEventListener('change', function () {
    var h = normalizeHex(bgHexInput.value);
    bgHexInput.value = h || bgHex;
    updateHexClearButton('bg');
  });
  fgHexInput.addEventListener('input', function () {
    var h = normalizeHex(fgHexInput.value);
    if (h) { fgHex = h; syncSlidersFromHex('fg'); refresh(); updateAllSliderProgress(); }
    updateHexClearButton('fg');
  });
  fgHexInput.addEventListener('focus', function () { updateHexClearButton('fg'); });
  fgHexInput.addEventListener('blur', function () {
    setTimeout(function () { updateHexClearButton('fg'); }, 0);
  });
  fgHexInput.addEventListener('change', function () {
    var h = normalizeHex(fgHexInput.value);
    fgHexInput.value = h || fgHex;
    updateHexClearButton('fg');
  });

  [bgHexClear, fgHexClear].forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener('mousedown', function (ev) {
      ev.preventDefault();
    });
    btn.addEventListener('click', function () {
      var who = btn.getAttribute('data-cc-clear');
      var input = who === 'bg' ? bgHexInput : fgHexInput;
      if (!input) return;
      input.value = '#';
      input.focus();
      if (input.setSelectionRange) input.setSelectionRange(1, 1);
      updateHexClearButton(who);
    });
  });

  root.querySelectorAll('.cc-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var parts = tab.dataset.ccTab.split('-');
      var who = parts[0], mode = parts[1];
      var group = tab.closest('.cc-tab-control');
      group.querySelectorAll('.cc-tab').forEach(function (t) { t.classList.remove('cc-tab--active'); });
      tab.classList.add('cc-tab--active');
      var prefix = who === 'bg' ? 'ccBg' : 'ccFg';
      $(prefix + 'RgbPanel').classList.toggle('cc-tab-body--active', mode === 'rgb');
      $(prefix + 'HslPanel').classList.toggle('cc-tab-body--active', mode === 'hsl');
    });
  });

  $('ccReverseBtn').addEventListener('click', function () {
    var tmp = bgHex; bgHex = fgHex; fgHex = tmp;
    bgHexInput.value = bgHex; fgHexInput.value = fgHex;
    syncSlidersFromHex('bg'); syncSlidersFromHex('fg');
    refresh(); updateAllSliderProgress();
    var shellT = shellThemeFromPair(bgHex, fgHex);
    function applyShellTheme() {
      if (typeof window.UZBankApplyTheme === 'function') {
        window.UZBankApplyTheme(shellT);
      }
    }
    applyShellTheme();
    requestAnimationFrame(function () {
      applyShellTheme();
    });
  });

  $('ccResetBtn').addEventListener('click', function () {
    clearSavedOverride();
    clearOverrideOnDocument();
    var d = readDefaultsFromTheme();
    bgHex = d.bg; fgHex = d.fg;
    bgHexInput.value = bgHex; fgHexInput.value = fgHex;
    syncSlidersFromHex('bg'); syncSlidersFromHex('fg');
    refreshNoSave();
    updateAllSliderProgress();
    if (typeof window.UZBankApplyTheme === 'function') {
      window.UZBankApplyTheme(shellThemeFromPair(bgHex, fgHex));
    }
  });

  document.addEventListener('uzbank:picker-sync', function (ev) {
    var d = ev.detail;
    if (!d) return;
    var nb = normalizeHex(String(d.bg || ''));
    var nf = normalizeHex(String(d.fg || ''));
    if (nb) bgHex = nb;
    if (nf) fgHex = nf;
    bgHexInput.value = bgHex;
    fgHexInput.value = fgHex;
    syncSlidersFromHex('bg');
    syncSlidersFromHex('fg');
    refresh();
    updateAllSliderProgress();
    updateHexClearButtons();
  });

  function isSelectedTheme(theme) {
    return theme && theme.bg === bgHex && theme.fg === fgHex;
  }

  function renderSavedThemes() {
    if (!savedGrid) return;
    savedGrid.innerHTML = '';

    // Add Theme card
    var addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'cc-theme-card cc-theme-card--add';
    addBtn.setAttribute('role', 'listitem');
    addBtn.innerHTML =
      '<span class="cc-theme-card__plus" aria-hidden="true">' +
        '<svg class="cc-theme-card__icon" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>' +
      '</span>' +
      '<span class="cc-theme-card__label">Add theme</span>';
    addBtn.addEventListener('click', function () {
      var list = readSavedThemes();
      var theme = {
        id: makeId(),
        name: nextThemeName(list),
        bg: bgHex,
        fg: fgHex,
        createdAt: Date.now()
      };
      list.unshift(theme);
      writeSavedThemes(list);
      savedThemes = list;
      renderSavedThemes();
    });
    savedGrid.appendChild(addBtn);

    // Saved cards
    savedThemes.forEach(function (t) {
      var card = document.createElement('div');
      card.className = 'cc-theme-card' + (isSelectedTheme(t) ? ' cc-theme-card--selected' : '');
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', isSelectedTheme(t) ? 'true' : 'false');

      var fgCircle = '<span class="cc-theme-card__swatch cc-theme-card__swatch--fg" style="background:' + t.fg + '"></span>';
      var bgCircle = '<span class="cc-theme-card__swatch cc-theme-card__swatch--bg" style="background:' + t.bg + '"></span>';

      card.innerHTML =
        '<span class="cc-theme-card__header">' +
          '<span class="cc-theme-card__title">' + escapeHtml(t.name) + '</span>' +
          '<span class="cc-theme-card__actions">' +
            '<button type="button" class="cc-theme-card__trash" aria-label="Delete ' + escapeAttr(t.name) + '" data-theme-trash="' + escapeAttr(t.id) + '">' +
              '<svg class="cc-theme-card__trash-icon" aria-hidden="true" focusable="false"><use href="#i-trash"/></svg>' +
            '</button>' +
          '</span>' +
        '</span>' +
        '<span class="cc-theme-card__row">' + fgCircle + '<span class="cc-theme-card__row-label">Foreground</span></span>' +
        '<span class="cc-theme-card__row">' + bgCircle + '<span class="cc-theme-card__row-label">Background</span></span>';

      function applySavedTheme() {
        bgHex = t.bg;
        fgHex = t.fg;
        bgHexInput.value = bgHex;
        fgHexInput.value = fgHex;
        syncSlidersFromHex('bg');
        syncSlidersFromHex('fg');
        refresh();
        updateAllSliderProgress();
        if (typeof window.UZBankApplyTheme === 'function') {
          window.UZBankApplyTheme(shellThemeFromPair(bgHex, fgHex));
        }
        renderSavedThemes();
      }

      card.addEventListener('click', function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest('.cc-theme-card__trash')) return;
        applySavedTheme();
      });

      card.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        if (ev.target && ev.target.closest && ev.target.closest('.cc-theme-card__trash')) return;
        ev.preventDefault();
        applySavedTheme();
      });

      savedGrid.appendChild(card);
    });

    // Trash handlers (event delegation)
    savedGrid.querySelectorAll('[data-theme-trash]').forEach(function (trashBtn) {
      trashBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var id = trashBtn.getAttribute('data-theme-trash');
        var list = readSavedThemes().filter(function (t) { return t.id !== id; });
        writeSavedThemes(list);
        savedThemes = list;
        renderSavedThemes();
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>\"]/g, function (c) {
      return c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;';
    });
  }
  function escapeAttr(s) {
    return String(s).replace(/\"/g, '&quot;');
  }

  /* ── Init ───────────────────────────────────────────────────────── */

  bgHexInput.value = bgHex;
  fgHexInput.value = fgHex;
  syncSlidersFromHex('bg');
  syncSlidersFromHex('fg');
  refresh();
  updateAllSliderProgress();
  updateHexClearButtons();
  if (typeof window.UZBankApplyTheme === 'function') {
    window.UZBankApplyTheme(shellThemeFromPair(bgHex, fgHex));
  }

  renderSavedThemes();
})();
