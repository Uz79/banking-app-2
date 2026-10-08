/**
 * Wiggle — attention cue (Components)
 *
 * One shared motion for "look here": the whole 24 × 24 icon swings a few degrees
 * left and right around its centre and settles. Keyframes: css/styles.css › Wiggle.
 *
 * Attention rule:
 *  - plays shortly after the element has arrived on screen,
 *  - repeats after a short rest (--wiggle-rest, 1.5 s of stillness) while nobody reacts,
 *    at most 3 times in total, and stops for good on interaction —
 *    except the status message, which keeps wiggling as long as it is there,
 *  - several icons in one place play one at a time, in a random order each round.
 *
 * Used by:
 *  - Payment recipient search: the magnifier (stops on focus or typing).
 *  - Status message: the bell / state icon, permanently (js/status-message.js;
 *    skips a round while the card is hovered or focused).
 *  - Payment and internal account transfer flows: the edit pencils of the read-only
 *    fields on every step, and the pencil next to the amount in the booking details (stops on any tap or key press in the sheet; starts again
 *    on the next step).
 *
 * API: UZWiggle.play(el)
 *      UZWiggle.attend(el | [el, …], { delay, rest, times, gap, shuffle, skip }) → stop()
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function tokenMs(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!v) return fallback;
    var n = parseFloat(v);
    return /ms$/.test(v) ? n : n * 1000;
  }

  function play(el) {
    if (!el || reduceMotion.matches) return;
    el.classList.remove('uz-wiggle');
    void el.getBoundingClientRect();            // restart if it is already playing
    el.classList.add('uz-wiggle');
  }

  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'uz-wiggle') e.target.classList.remove('uz-wiggle');
  }, true);

  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function attend(target, opts) {
    var list = Array.isArray(target) ? target : [target];
    var o = opts || {};
    var gap = o.gap != null ? o.gap : tokenMs('--wiggle-duration', 720) + tokenMs('--wiggle-sequence-gap', 120);
    var delay = o.delay != null ? o.delay : 600;
    var dur = tokenMs('--wiggle-duration', 720);
    var rest = o.rest != null ? o.rest : tokenMs('--wiggle-rest', 1500);   // still time after the last icon settled
    var times = o.times != null ? o.times : 3;          // Infinity = permanent
    var shuffle = o.shuffle !== false;
    var played = 0, timer = 0, stopped = false, seqTimers = [];

    function visible(el) {
      return el.isConnected && !document.hidden &&
        (typeof el.checkVisibility !== 'function' || el.checkVisibility({ opacityProperty: true, visibilityProperty: true }));
    }
    function tick() {
      if (stopped) return;
      if (!list[0].isConnected) { stop(); return; }
      seqTimers = [];
      if (visible(list[0]) && !(o.skip && o.skip())) {
        // One at a time, random order: the next starts once the previous has settled
        (shuffle ? shuffled(list) : list).forEach(function (item, i) {
          if (i === 0) play(item);
          else seqTimers.push(setTimeout(function () { if (!stopped) play(item); }, i * gap));
        });
        played++;
      }
      if (played < times) timer = setTimeout(tick, (list.length - 1) * gap + dur + rest);
    }
    function stop() {
      stopped = true;
      clearTimeout(timer);
      seqTimers.forEach(clearTimeout);
    }
    if (!reduceMotion.matches) timer = setTimeout(tick, delay);
    return stop;
  }

  window.UZWiggle = { play: play, attend: attend };

  /* Shared: is this sheet on screen? */
  function sheetOnScreen(modal) {
    var shell = modal.closest('.modal-shell');
    var overlay = modal.closest('.modal-overlay');
    return (!shell || !shell.classList.contains('modal-shell--offscreen')) &&
      (!overlay || overlay.classList.contains('modal-overlay--active'));
  }

  /* Shared: one batched check per frame on class changes of the sheet (ignoring wiggles) */
  function observeSheet(modal, check) {
    var frame = 0;
    var mo = new MutationObserver(function (records) {
      var relevant = records.some(function (r) {
        return !(r.target.classList && r.target.classList.contains('uz-wiggle')) &&
               !(r.oldValue && /\buz-wiggle\b/.test(r.oldValue));
      });
      if (!relevant || frame) return;
      frame = requestAnimationFrame(function () { frame = 0; check(); });
    });
    [modal, modal.closest('.modal-shell'), modal.closest('.modal-overlay')].forEach(function (t) {
      if (t) mo.observe(t, { attributes: true, attributeFilter: ['class'], attributeOldValue: true, subtree: t === modal });
    });
  }

  /* ---------- Payment · recipient search: the magnifier ---------- */
  function watchSearch(modal) {
    if (modal._uzWiggleSearch) return;
    modal._uzWiggleSearch = true;
    var step = modal.querySelector('.modal__step[data-step="recipient-search"]');
    var icon = modal.querySelector('.recipient-search__icon-svg');
    var input = modal.querySelector('.recipient-search__input');
    if (!step || !icon) return;
    var stop = null;

    function onScreen() { return step.classList.contains('modal__step--active') && sheetOnScreen(modal); }
    function halt() { if (stop) { stop(); stop = null; } }
    function check() {
      if (onScreen()) {
        if (!stop && !(input && (input.value || document.activeElement === input))) {
          stop = attend(icon, { delay: tokenMs('--wiggle-search-delay', 700) });
        }
      } else {
        halt();
      }
    }
    if (input) {
      input.addEventListener('focus', halt);
      input.addEventListener('input', halt);
    }
    observeSheet(modal, check);
    check();
  }

  /* ---------- Flow steps: the edit pencils, one at a time, random order ---------- */
  var FLOWS = [
    { modal: '.modal--payment-flow', attr: 'data-step' },
    { modal: '.modal--iat-flow',     attr: 'data-iat-step' },
    { modal: '.modal--payment-details', attr: null }   // booking details: one screen, no steps
  ];
  var PENCILS = '.form-field__edit-icon, .payment-details__edit-icon';

  function watchPencils(modal, cfg) {
    if (modal._uzWigglePencils) return;
    modal._uzWigglePencils = true;
    var stop = null, shownStep = null;

    function halt() { if (stop) { stop(); stop = null; } }
    function check() {
      var step = !sheetOnScreen(modal) ? null
        : cfg.attr ? modal.querySelector('.modal__step--active[' + cfg.attr + ']') : modal;
      if (step === shownStep) return;
      halt();
      shownStep = step;
      if (!step) return;
      var pencils = [].slice.call(step.querySelectorAll(PENCILS)).filter(function (p) { return p.getClientRects().length; });
      if (pencils.length) stop = attend(pencils, { delay: tokenMs('--wiggle-step-delay', 500) });
    }
    // Any reaction inside the sheet ends the cue for this step
    modal.addEventListener('pointerdown', halt, true);
    modal.addEventListener('keydown', halt, true);
    observeSheet(modal, check);
    check();
  }

  function scan(root) {
    if (root.matches && root.matches('.modal--payment-flow')) watchSearch(root);
    if (root.querySelectorAll) root.querySelectorAll('.modal--payment-flow').forEach(watchSearch);
    FLOWS.forEach(function (cfg) {
      if (root.matches && root.matches(cfg.modal)) watchPencils(root, cfg);
      if (root.querySelectorAll) root.querySelectorAll(cfg.modal).forEach(function (m) { watchPencils(m, cfg); });
    });
  }
  function start() {
    scan(document);
    new MutationObserver(function (records) {
      records.forEach(function (r) { r.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); }); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
