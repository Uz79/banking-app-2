/**
 * UZ Bank Web: Profile > Legibility (type and spacing scale, Typeface) on every page.
 * Moved out of app-mp.js so the fridge and the investment opening, which don't load the
 * shell, apply it too (roadmap 34, D1). Scales the --fs-* and --space-* tokens on <html>
 * from uzBankWebAppearance and exposes window.UZBankAppearance for Profile.
 */
(function (global) {
  'use strict';

  var APPEARANCE_KEY = 'uzBankWebAppearance';

  /* ── App-wide appearance scale (Profile > Legibility / Persona) ─── */

  var APPEARANCE_PRESETS = {
    small: { size: 'small', fontScale: 0.9, spaceScale: 0.86, persona: 'power' },
    regular: { size: 'regular', fontScale: 1, spaceScale: 1, persona: 'standard' },
    large: { size: 'large', fontScale: 1.16, spaceScale: 1.14, persona: 'novice' }
  };

  var FONT_FAMILIES = {
    'profile-pro': "'Profile Pro', sans-serif",
    'dm-sans': "'DM Sans', sans-serif",
    inter: "'Inter', sans-serif",
    'space-grotesk': "'Space Grotesk', sans-serif",
    'source-serif-4': "'Source Serif 4', serif",
    georgia: "Georgia, 'Times New Roman', serif"
  };

  var APPEARANCE_VAR_NAMES = [
    'space-1', 'space-2', 'space-3', 'space-4', 'space-5', 'space-6',
    'space-7', 'space-8', 'space-9', 'space-10', 'space-11', 'space-12',
    'fs-hero', 'fs-h1', 'fs-h2', 'fs-h3', 'fs-h4', 'fs-h5', 'fs-h6',
    'fs-text-lg', 'fs-text-md', 'fs-text-sm', 'fs-text-xs', 'fs-caption'
  ];

  function normalizeScale(raw, fallback, min, max) {
    var n = Number(raw);
    if (!isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  /* Persona profile from Profile > User Type. 'beatrice' / 'max' are the two-card
     version's values; keep reading them so stored settings carry over. */
  var PERSONA_ALIASES = { beatrice: 'novice', max: 'power', novice: 'novice', standard: 'standard', power: 'power' };

  function normalizePersona(raw) {
    return PERSONA_ALIASES[raw] || 'custom';
  }

  function normalizeFontFamily(raw) {
    var key = String(raw || '').trim();
    return FONT_FAMILIES[key] ? key : 'profile-pro';
  }

  function readAppearance() {
    try {
      var parsed = JSON.parse(global.localStorage.getItem(APPEARANCE_KEY) || '{}');
      return {
        size: parsed.size === 'small' || parsed.size === 'large' ? parsed.size : 'regular',
        fontScale: normalizeScale(parsed.fontScale, 1, 0.85, 1.25),
        spaceScale: normalizeScale(parsed.spaceScale, 1, 0.8, 1.25),
        persona: normalizePersona(parsed.persona),
        fontFamily: normalizeFontFamily(parsed.fontFamily)
      };
    } catch (err) {
      return { size: 'regular', fontScale: 1, spaceScale: 1, persona: 'custom', fontFamily: 'profile-pro' };
    }
  }

  function parseLength(value) {
    var raw = String(value || '').trim();
    var n = parseFloat(raw);
    if (!isFinite(n)) return null;
    if (raw.endsWith('px')) return n / 16;
    return n;
  }

  function rem(value) {
    return Number(value).toFixed(4).replace(/\.?0+$/, '') + 'rem';
  }

  function applyAppearance(next) {
    var current = readAppearance();
    var settings = Object.assign({}, current, next || {});
    settings.fontScale = normalizeScale(settings.fontScale, 1, 0.85, 1.25);
    settings.spaceScale = normalizeScale(settings.spaceScale, 1, 0.8, 1.25);
    settings.fontFamily = normalizeFontFamily(settings.fontFamily);
    settings.persona = normalizePersona(settings.persona);
    if (settings.fontScale < 0.96 || settings.spaceScale < 0.94) settings.size = 'small';
    else if (settings.fontScale > 1.08 || settings.spaceScale > 1.08) settings.size = 'large';
    else settings.size = 'regular';

    var style = document.documentElement.style;
    APPEARANCE_VAR_NAMES.forEach(function (name) { style.removeProperty('--' + name); });
    var cs = getComputedStyle(document.documentElement);
    APPEARANCE_VAR_NAMES.forEach(function (name) {
      var base = parseLength(cs.getPropertyValue('--' + name));
      if (base == null) return;
      var factor = name.indexOf('fs-') === 0 ? settings.fontScale : settings.spaceScale;
      style.setProperty('--' + name, rem(base * factor));
    });
    style.setProperty('--appearance-font-scale', String(settings.fontScale));
    style.setProperty('--appearance-space-scale', String(settings.spaceScale));
    style.setProperty('--font-family', FONT_FAMILIES[settings.fontFamily]);
    document.documentElement.setAttribute('data-legibility', settings.size);
    document.documentElement.setAttribute('data-persona', settings.persona || 'custom');
    document.documentElement.setAttribute('data-font-family', settings.fontFamily);

    try { global.localStorage.setItem(APPEARANCE_KEY, JSON.stringify(settings)); } catch (err2) {}
    try {
      document.dispatchEvent(new CustomEvent('uzbank:appearance-change', { bubbles: true, detail: settings }));
    } catch (err3) {}
    return settings;
  }

  function applyAppearancePreset(size, persona) {
    var preset = APPEARANCE_PRESETS[size] || APPEARANCE_PRESETS.regular;
    return applyAppearance(Object.assign({}, preset, persona ? { persona: persona } : {}));
  }

  global.UZBankAppearance = {
    key: APPEARANCE_KEY,
    presets: APPEARANCE_PRESETS,
    fonts: FONT_FAMILIES,
    read: readAppearance,
    apply: applyAppearance,
    applyPreset: applyAppearancePreset
  };

  applyAppearance(readAppearance());
})(window);
