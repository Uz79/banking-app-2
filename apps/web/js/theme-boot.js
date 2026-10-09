/**
 * Theme boot — runs in <head> before CSS.
 * No saved colour tokens: apply Custom 01 (sage) and remember it.
 * uzBankWebPreferBankDefault=1: the user chose the UZ Bank card, so tokens.css stays.
 */
(function () {
  var TOKENS_KEY = 'uzBankWebColorTokens';
  var OVERRIDE_KEY = 'uzBankWebColorOverride_v2';
  var PREFER_BANK_KEY = 'uzBankWebPreferBankDefault';
  var DEFAULT_TOKENS = {"light":{"color-bg":"#ffffff","color-bg-secondary":"#f6f7f5","color-bg-sidebar":"#ffffff","color-fg":"#546463","color-fg-interactive":"#7f9376","color-fg-secondary":"#546463b3","color-fg-label":"#546463b3","color-fg-disabled":"rgba(8, 10, 16, 0.4)","color-separator":"#54646324","color-show-all-bg":"#5464631a","color-nav-item-active-bg":"#5464631a","color-segmented-track-bg":"#5464631a","color-input-stroke":"#546463b3","color-input-stroke-focus":"#7f9376","color-input-surface":"#ffffff","color-icon-circle-fill":"#7f9376","color-btn-primary-bg":"#7f9376","color-btn-primary-fg":"#ffffff","color-btn-primary-hover":"#9bab94","color-btn-primary-pressed":"#b0bdab","color-btn-secondary-bg":"#ffffff","color-btn-secondary-border":"#546463","color-btn-secondary-fg":"#546463","color-btn-secondary-hover":"#5464631a","color-btn-secondary-pressed":"#54646333","color-btn-tonal-bg":"#5464631a","color-btn-tonal-border":"#5464631a","color-btn-tonal-fg":"#546463","color-btn-tonal-hover":"#54646324","color-btn-tonal-pressed":"#54646338","color-overlay-tint":"#546463","color-nav-elevated-shadow":"rgba(0, 0, 0, 0.06)","color-modal-elevated-shadow":"rgba(0, 0, 0, 0.12)","color-surface-state-hover":"#5464631a","color-surface-state-pressed":"#54646333","color-action-circle-state-hover":"#7f93761a","color-action-circle-state-pressed":"#7f937633"},"dark":{"color-bg":"#252c2f","color-bg-secondary":"#39433f","color-bg-sidebar":"#252c2f","color-fg":"#eaeeee","color-fg-interactive":"#7f9376","color-fg-secondary":"#eaeeeeb3","color-fg-label":"#eaeeeeb3","color-fg-disabled":"rgba(255, 255, 255, 0.4)","color-separator":"#eaeeee1a","color-show-all-bg":"#eaeeee1a","color-nav-item-active-bg":"#eaeeee1a","color-segmented-track-bg":"#eaeeee1a","color-input-stroke":"#eaeeeeb3","color-input-stroke-focus":"#7f9376","color-input-surface":"#252c2f","color-icon-circle-fill":"#7f9376","color-btn-primary-bg":"#7f9376","color-btn-primary-fg":"#ffffff","color-btn-primary-hover":"#7a8d72","color-btn-primary-pressed":"#76886f","color-btn-secondary-bg":"#252c2f","color-btn-secondary-border":"#eaeeee","color-btn-secondary-fg":"#eaeeee","color-btn-secondary-hover":"#eaeeee1a","color-btn-secondary-pressed":"#eaeeee33","color-btn-tonal-bg":"#eaeeee1a","color-btn-tonal-border":"#eaeeee1a","color-btn-tonal-fg":"#eaeeee","color-btn-tonal-hover":"#eaeeee24","color-btn-tonal-pressed":"#eaeeee38","color-overlay-tint":"#eaeeee","color-nav-elevated-shadow":"rgba(0, 0, 0, 0.35)","color-modal-elevated-shadow":"rgba(0, 0, 0, 0.45)","color-surface-state-hover":"#eaeeee1a","color-surface-state-pressed":"#eaeeee33","color-action-circle-state-hover":"#7f93761a","color-action-circle-state-pressed":"#7f937633"}};
  var DEFAULT_OVERRIDE = {"bg":"#ffffff","fg":"#7f9376","neutral":"#546463","kind":"multicolor","neutralSeed":"#465453","primarySeed":"#a5b39f","bgIndex":0,"fgIndex":8,"primaryIndex":6,"contrastByShell":{"light":{"bgIndex":0,"fgIndex":8},"dark":{"bgIndex":3,"fgIndex":4}},"primaryByShell":{"light":6,"dark":6},"activeSavedThemeId":"t_60e4b9e0a998e_1a0afd66790"};

  function apply(tokens) {
    if (!tokens) return;
    var s = document.documentElement.style;
    for (var k in tokens) s.setProperty('--' + k, tokens[k]);
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
    }
    if (!raw) return;
    var all = JSON.parse(raw);
    var shell = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    apply(all && all[shell]);
  } catch (e) {}
})();
