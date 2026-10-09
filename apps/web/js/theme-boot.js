/**
 * Theme boot — runs in <head> before CSS.
 * No saved colour tokens: apply Custom 10 and remember it.
 * uzBankWebPreferBankDefault=1: the user chose the UZ Bank card, so tokens.css stays.
 *
 * Tonal wash (filled-tonal, segmented track, nav active, show-all): 5% neutral ink (#…0d).
 * Hover / pressed state layers: 10% / 20% (#…1a / #…33).
 */
(function () {
  var TOKENS_KEY = 'uzBankWebColorTokens';
  var OVERRIDE_KEY = 'uzBankWebColorOverride_v2';
  var PREFER_BANK_KEY = 'uzBankWebPreferBankDefault';
  var TONAL_WASH_VER = 'uzBankWebTonalWash_v05';
  var ACTION_CIRCLE_VER = 'uzBankWebActionCircleWash_v1';
  /* Custom 10 — tonal fills at 5% (0d), hover 10% (1a), pressed 20% (33). */
  var DEFAULT_TOKENS = {"light":{"color-bg":"#ffffff","color-bg-secondary":"#f5f6f4","color-bg-sidebar":"#ffffff","color-fg":"#414e4d","color-fg-interactive":"#6b7e63","color-fg-secondary":"#414e4db3","color-fg-label":"#414e4db3","color-fg-disabled":"rgba(8, 10, 16, 0.4)","color-separator":"#414e4d24","color-show-all-bg":"#414e4d0d","color-nav-item-active-bg":"#414e4d0d","color-segmented-track-bg":"#414e4d0d","color-input-stroke":"#414e4db3","color-input-stroke-focus":"#6b7e63","color-input-surface":"#ffffff","color-icon-circle-fill":"#6b7e63","color-btn-primary-bg":"#6b7e63","color-btn-primary-fg":"#ffffff","color-btn-primary-hover":"#8c9a85","color-btn-primary-pressed":"#a4b09f","color-btn-secondary-bg":"#ffffff","color-btn-secondary-border":"#414e4d","color-btn-secondary-fg":"#414e4d","color-btn-secondary-hover":"#414e4d1a","color-btn-secondary-pressed":"#414e4d33","color-btn-tonal-bg":"#414e4d0d","color-btn-tonal-border":"#414e4d0d","color-btn-tonal-fg":"#414e4d","color-btn-tonal-hover":"#414e4d1a","color-btn-tonal-pressed":"#414e4d33","color-overlay-tint":"#414e4d","color-nav-elevated-shadow":"rgba(0, 0, 0, 0.06)","color-modal-elevated-shadow":"rgba(0, 0, 0, 0.12)","color-surface-state-hover":"#414e4d1a","color-surface-state-pressed":"#414e4d33","color-action-circle-state-hover":"#ffffff1f","color-action-circle-state-pressed":"#ffffff38"},"dark":{"color-bg":"#252c2f","color-bg-secondary":"#39433f","color-bg-sidebar":"#252c2f","color-fg":"#eaeeee","color-fg-interactive":"#7f9376","color-fg-secondary":"#eaeeeeb3","color-fg-label":"#eaeeeeb3","color-fg-disabled":"rgba(255, 255, 255, 0.4)","color-separator":"#eaeeee1a","color-show-all-bg":"#eaeeee0d","color-nav-item-active-bg":"#eaeeee0d","color-segmented-track-bg":"#eaeeee0d","color-input-stroke":"#eaeeeeb3","color-input-stroke-focus":"#7f9376","color-input-surface":"#252c2f","color-icon-circle-fill":"#7f9376","color-btn-primary-bg":"#7f9376","color-btn-primary-fg":"#ffffff","color-btn-primary-hover":"#7a8d72","color-btn-primary-pressed":"#76886f","color-btn-secondary-bg":"#252c2f","color-btn-secondary-border":"#eaeeee","color-btn-secondary-fg":"#eaeeee","color-btn-secondary-hover":"#eaeeee1a","color-btn-secondary-pressed":"#eaeeee33","color-btn-tonal-bg":"#eaeeee0d","color-btn-tonal-border":"#eaeeee0d","color-btn-tonal-fg":"#eaeeee","color-btn-tonal-hover":"#eaeeee1a","color-btn-tonal-pressed":"#eaeeee33","color-overlay-tint":"#eaeeee","color-nav-elevated-shadow":"rgba(0, 0, 0, 0.35)","color-modal-elevated-shadow":"rgba(0, 0, 0, 0.45)","color-surface-state-hover":"#eaeeee1a","color-surface-state-pressed":"#eaeeee33","color-action-circle-state-hover":"#ffffff1f","color-action-circle-state-pressed":"#ffffff38"}};
  var DEFAULT_OVERRIDE = {"bg":"#ffffff","fg":"#6b7e63","neutral":"#414e4d","kind":"multicolor","neutralSeed":"#465453","primarySeed":"#a5b39f","bgIndex":0,"fgIndex":9,"primaryIndex":7,"contrastByShell":{"light":{"bgIndex":0,"fgIndex":9},"dark":{"bgIndex":3,"fgIndex":4}},"primaryByShell":{"light":7,"dark":6},"activeSavedThemeId":"t_da0fdc6c4b056_1a122a822ab"};

  var TONAL_FILL_KEYS = {
    'color-btn-tonal-bg': 1,
    'color-btn-tonal-border': 1,
    'color-nav-item-active-bg': 1,
    'color-segmented-track-bg': 1,
    'color-show-all-bg': 1
  };

  function apply(tokens) {
    if (!tokens) return;
    var s = document.documentElement.style;
    for (var k in tokens) s.setProperty('--' + k, tokens[k]);
  }

  /** Rewrite cached 10% tonal washes (#…1a) → 5% (#…0d); hover/pressed → 10%/20%. */
  function migrateShellTokens(tokens) {
    if (!tokens) return tokens;
    var out = {};
    for (var k in tokens) {
      if (!Object.prototype.hasOwnProperty.call(tokens, k)) continue;
      var v = tokens[k];
      if (typeof v === 'string' && /^#[0-9a-fA-F]{8}$/.test(v)) {
        var rgb = v.slice(0, 7);
        var a = v.slice(7).toLowerCase();
        if (TONAL_FILL_KEYS[k] && a === '1a') {
          out[k] = rgb + '0d';
          continue;
        }
        if (k === 'color-btn-tonal-hover' && a === '24') {
          out[k] = rgb + '1a';
          continue;
        }
        if (k === 'color-btn-tonal-pressed' && a === '38') {
          out[k] = rgb + '33';
          continue;
        }
      }
      out[k] = v;
    }
    return out;
  }

  function migrateTokenCache(all) {
    if (!all || typeof all !== 'object') return all;
    return {
      light: migrateShellTokens(all.light),
      dark: migrateShellTokens(all.dark)
    };
  }

  /** Filled action circles need a white state wash; accent@alpha is invisible on accent fill. */
  function migrateActionCircleStates(all) {
    if (!all || typeof all !== 'object') return all;
    var HOVER = '#ffffff1f';
    var PRESSED = '#ffffff38';
    function shell(tokens) {
      if (!tokens) return tokens;
      var out = {};
      for (var k in tokens) {
        if (!Object.prototype.hasOwnProperty.call(tokens, k)) continue;
        out[k] = tokens[k];
      }
      out['color-action-circle-state-hover'] = HOVER;
      out['color-action-circle-state-pressed'] = PRESSED;
      return out;
    }
    return { light: shell(all.light), dark: shell(all.dark) };
  }


  try {
    var t = localStorage.getItem('uzBankWebTheme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    var raw = localStorage.getItem(TOKENS_KEY);
    if (!raw && localStorage.getItem(PREFER_BANK_KEY) !== '1') {
      raw = JSON.stringify(DEFAULT_TOKENS);
      localStorage.setItem(TOKENS_KEY, raw);
      if (!localStorage.getItem(OVERRIDE_KEY)) {
        localStorage.setItem(OVERRIDE_KEY, JSON.stringify(DEFAULT_OVERRIDE));
      }
      localStorage.setItem(TONAL_WASH_VER, '1');
      localStorage.setItem(ACTION_CIRCLE_VER, '1');
    }
    if (!raw) return;
    var all = JSON.parse(raw);
    if (localStorage.getItem(TONAL_WASH_VER) !== '1') {
      all = migrateTokenCache(all);
      localStorage.setItem(TOKENS_KEY, JSON.stringify(all));
      localStorage.setItem(TONAL_WASH_VER, '1');
      localStorage.setItem(ACTION_CIRCLE_VER, '1');
    }
    if (localStorage.getItem(ACTION_CIRCLE_VER) !== '1') {
      all = migrateActionCircleStates(all);
      localStorage.setItem(TOKENS_KEY, JSON.stringify(all));
      localStorage.setItem(ACTION_CIRCLE_VER, '1');
    }
    var shell = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    apply(all && all[shell]);
  } catch (e) {}
})();
