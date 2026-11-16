/**
 * Components · Proceed button (multi-step flows)
 * The primary button that moves a multi-step flow on:
 *   - payment flow ........... [data-payment-confirm]  (Confirm on the steps, Execute on the last)
 *   - internal transfer ...... #uz-iat-confirm-btn     (Confirm on the steps, Execute on the last)
 *   - buy & sell ............. #uz-trade-confirm       (one step — it executes the order)
 * Steps in between → .uz-btn--proceed-next: the trailing arrow-right travels and snaps back.
 * Last step (executes the whole flow) → .uz-btn--proceed-final: the button pulses, no arrow.
 * This script marks the buttons, adds the trailing icon (label in a <span>, the component's icon
 * pattern) and switches the class when the flow relabels the button. The motion itself is pure
 * CSS ("Proceed button" block in css/styles.css, --proceed-* values).
 * The flows rewrite the label with textContent, which removes the icon — it is put back.
 */
(function () {
  'use strict';

  var SELECTOR = '[data-payment-confirm], #uz-iat-confirm-btn, #uz-trade-confirm';
  /* Buttons that always execute (single-step flows) */
  var ALWAYS_FINAL = '#uz-trade-confirm';

  /* Last step = the button executes the whole flow */
  function isFinal(btn) {
    return btn.matches(ALWAYS_FINAL) || /^\s*execute\b/i.test(btn.textContent);
  }

  function mark(btn) {
    var final = isFinal(btn);
    btn.classList.toggle('uz-btn--proceed-final', final);
    btn.classList.toggle('uz-btn--proceed-next', !final);
  }
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function arrowIcon() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'uz-btn__icon uz-btn__icon--trailing');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-arrow-right');
    svg.appendChild(use);
    return svg;
  }

  /* Label in a span + trailing icon; returns true if it changed anything */
  function shape(btn) {
    if (btn.querySelector(':scope > .uz-btn__icon--trailing') &&
        btn.querySelector(':scope > .uz-btn__label')) return false;
    var label = btn.textContent.trim();
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    var span = document.createElement('span');
    span.className = 'uz-btn__label';
    span.textContent = label;
    btn.appendChild(span);
    btn.appendChild(arrowIcon());
    return true;
  }

  function setup(btn) {
    if (btn.__uzProceed) return;
    btn.__uzProceed = true;
    btn.classList.add('uz-btn--proceed');
    shape(btn);
    mark(btn);
    /* The flow sets a new label with textContent → re-shape (guarded against our own changes) */
    var busy = false;
    new MutationObserver(function () {
      if (busy) return;
      busy = true;
      shape(btn);
      mark(btn);
      busy = false;
    }).observe(btn, { childList: true, characterData: true, subtree: true });
  }

  function scan() {
    document.querySelectorAll(SELECTOR).forEach(setup);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
  /* Flow partials can arrive later */
  window.addEventListener('load', scan);
  if (window.MutationObserver) {
    var queued = false;
    new MutationObserver(function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; scan(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
