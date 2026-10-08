/**
 * Nav button motion — close (×) and back (←)
 *
 * CLOSE · Ref: threejs-journey.com close button (Motion Specimens · No. 003)
 * Applies to every button/link whose direct icon is the shared `#i-x` symbol.
 * - Sheet opens: once the .modal-shell has slid in, the button builds up from a tinted
 *   dot while the × spins in (`.is-entering`). Spec: Figma Des-Sys-Test-IV, node 315:3433.
 * - Hover / keyboard focus: the × spins a quarter turn (CSS only, see styles.css).
 * - Click: the button collapses to a dot (`.is-dismissing`) while the sheet closes.
 *   If the view is still on screen afterwards (e.g. the "Discard?" prompt opened
 *   instead of closing), it pops back in (`.is-restoring`).
 *
 * BACK · Motion Specimens · No. 004
 * Applies to `.modal__back` (previous step in flows) and `.view__back` (page back).
 * - Hover / keyboard focus: the arrow nudges left (CSS only, see styles.css).
 * - Click: the arrow shoots out to the left and slides back in from the right
 *   (`.is-stepping-back`), since the button usually stays for the previous step.
 *
 * Uses capturing, delegated listeners, so overlays injected from partials are covered
 * and existing close handlers run unchanged.
 */
(function () {
  'use strict';

  var X_ICON = ':scope > svg > use[href="#i-x"]';
  var CHECK_AFTER_MS = 320;   // just after the 0.28s collapse / modal-shell close
  var CLOSING = '.modal-overlay--closing, .modal-shell--closing, .form-sheet--closing, .shell-view--exit';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isCloseButton(el) {
    return el && el.querySelector(X_ICON) !== null;
  }

  function isOnScreen(el) {
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({ visibilityProperty: true, opacityProperty: true });
    }
    return el.offsetParent !== null;
  }

  function settle(btn) {
    // Wait while the surrounding sheet is still animating out.
    if (btn.closest(CLOSING)) {
      btn._uzCloseTimer = setTimeout(function () { settle(btn); }, 120);
      return;
    }
    // Drop the collapsed state first (it ends at opacity 0), then check visibility.
    // Both happen before the next paint, so there is no flash.
    btn.classList.remove('is-dismissing');
    if (isOnScreen(btn) && !btn.closest('[aria-hidden="true"]')) btn.classList.add('is-restoring');
  }

  document.addEventListener('click', function (e) {
    if (reduceMotion.matches) return;
    var btn = e.target.closest && e.target.closest('button, a');
    if (!isCloseButton(btn)) return;

    clearTimeout(btn._uzCloseTimer);
    // Interruption (spec): a click mid-entrance jumps the entrance to its end
    btn.classList.remove('is-restoring', 'is-entering');
    btn.classList.add('is-dismissing');
    btn._uzCloseTimer = setTimeout(function () { settle(btn); }, CHECK_AFTER_MS);
  }, true);

  /* Back: replay the slide-through on every click, even rapid ones */
  document.addEventListener('click', function (e) {
    if (reduceMotion.matches) return;
    var btn = e.target.closest && e.target.closest('.modal__back, .view__back');
    if (!btn) return;
    btn.classList.remove('is-stepping-back');
    void btn.offsetWidth; // restart the animation
    btn.classList.add('is-stepping-back');
  }, true);

  /* Close: build up after the sheet has slid in.
     Every overlay opens by removing .modal-shell--offscreen from its shell,
     so one observer on the document covers all sheets, including partials. */
  function enterCloseButtons(shell) {
    if (reduceMotion.matches) return;
    shell.querySelectorAll('button, a').forEach(function (btn) {
      if (!isCloseButton(btn)) return;
      clearTimeout(btn._uzCloseTimer);
      btn.classList.remove('is-dismissing', 'is-restoring', 'is-entering');
      void btn.offsetWidth; // restart if reopened quickly
      btn.classList.add('is-entering');
    });
  }

  new MutationObserver(function (records) {
    records.forEach(function (r) {
      var el = r.target;
      if (!el.classList || !el.classList.contains('modal-shell')) return;
      var wasOff = (r.oldValue || '').indexOf('modal-shell--offscreen') !== -1;
      var isOff = el.classList.contains('modal-shell--offscreen');
      if (wasOff && !isOff && !el.classList.contains('modal-shell--closing')) enterCloseButtons(el);
    });
  }).observe(document.documentElement, {
    subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true
  });

  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'uz-close-restore') e.target.classList.remove('is-restoring');
    if (e.animationName === 'uz-close-enter') e.target.classList.remove('is-entering');
    if (e.animationName === 'uz-back-step') {
      var btn = e.target.closest('.is-stepping-back');
      if (btn) btn.classList.remove('is-stepping-back');
    }
  });
})();
