/**
 * Avoid visible focus rings when <dialog>.showModal() opens on touch (iOS Safari).
 * Keyboard users on desktop still get normal dialog focus behaviour.
 */
(function () {
  'use strict';

  function prefersKeyboardFocus() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function suppressInitialFocus(dialogEl) {
    if (!dialogEl || prefersKeyboardFocus()) return;
    window.requestAnimationFrame(function () {
      if (!dialogEl.hasAttribute('tabindex')) {
        dialogEl.setAttribute('tabindex', '-1');
      }
      try {
        dialogEl.focus({ preventScroll: true });
      } catch (err) { /* ignore */ }
    });
  }

  window.UZBankDialogFocus = {
    suppressInitialFocus: suppressInitialFocus,
    prefersKeyboardFocus: prefersKeyboardFocus
  };
})();
