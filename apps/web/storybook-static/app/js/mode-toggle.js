/**
 * Mobile Light/Dark toggle in the top bar (specs/2026-10-20-mobile-mode-toggle).
 * Same switch as the sidebar: UZBankApplyThemeChoice (js/app-mp.js). The icon is chosen in CSS
 * by html[data-theme]; this script only handles the tap and keeps the accessible name current.
 */
(function () {
  'use strict';

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function init() {
    var buttons = document.querySelectorAll('[data-mode-toggle]');
    if (!buttons.length) return;

    function syncLabels() {
      var label = current() === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode';
      buttons.forEach(function (b) { b.setAttribute('aria-label', label); });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        if (typeof window.UZBankApplyThemeChoice === 'function') {
          window.UZBankApplyThemeChoice(current() === 'light' ? 'dark' : 'light');
        }
        syncLabels();
      });
    });

    /* The mode can also change from the sidebar or Profile > Theme */
    new MutationObserver(syncLabels).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    syncLabels();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
