/**
 * Status · Status message (alert message)
 * Spec: Figma "Des-Sys-Test-IV" › Animations Transitions ›
 *       design-system_animation-spec_status_alert-message (node 353:11968), frames 01–04.
 *
 * Choreography (Status + Tectonics in one moment):
 *   1 · Status   — a small pill drops in from the top edge of the screen, passes over the
 *                  title bar, lands in the message slot and grows into the full card (shell).
 *   2 · Tectonic — the message slot under the sticky title bar opens and pushes the sections down.
 *   3 · Content  — icon, title, text and date come in once the card has landed.
 *                  Then the icon wiggles (shared Wiggle, js/wiggle.js) and keeps wiggling
 *                  after a short rest as long as the message is there.
 * Exit (tap = go to the detail view; in this prototype: dismiss) plays it in reverse.
 *
 * States: error (red) · warning (yellow) · information (blue).
 * Timings: --status-* custom properties in css/styles.css.
 *
 * API: UZStatusMessage.show({ id, state, title, text, since, icon, href, delay })
 *      UZStatusMessage.dismiss()
 */
(function (global) {
  'use strict';

  var root = document.documentElement;
  var DISMISSED_KEY = 'uzStatusDismissed';

  var ICONS = {
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    'alert-triangle': '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
  };
  var DEFAULT_ICON = { error: 'alert-circle', warning: 'alert-triangle', info: 'info' };
  var STATE_LABEL = { error: 'Error', warning: 'Warning', info: 'Information' };

  var slot = null;
  var current = null;   /* { opts, card, anims, phase } */

  /* ── helpers ─────────────────────────────────────────── */

  function reducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function token(name, fallback) {
    var raw = getComputedStyle(root).getPropertyValue(name).trim();
    return raw || fallback;
  }

  function ms(name, fallback) {
    var raw = token(name, '');
    var n = parseFloat(raw);
    if (isNaN(n)) return fallback;
    return /ms$/.test(raw) ? n : /s$/.test(raw) ? n * 1000 : n;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Dismissals are stored per id with a timestamp: { id: Date.now() } */
  function dismissals() {
    try {
      var raw = JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '{}');
      return Array.isArray(raw) ? {} : raw;   /* older format (plain list) → start fresh */
    } catch (e) { return {}; }
  }

  function dismissedAt(id) {
    return id ? dismissals()[id] || null : null;
  }

  function rememberDismissed(id) {
    if (!id) return;
    try {
      var all = dismissals();
      all[id] = Date.now();
      sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(all));
    } catch (e) { /* ignore */ }
  }

  function clearDismissed(id) {
    if (!id) return;
    try {
      var all = dismissals();
      if (all[id]) { delete all[id]; sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(all)); }
    } catch (e) { /* ignore */ }
  }

  var ACTIVE_KEY = 'uzStatusActive';

  /* The message stays across views until it's dismissed. */
  function rememberActive(opts) {
    try {
      var keep = {};
      ['id', 'state', 'icon', 'title', 'text', 'since', 'href', 'reappearAfter'].forEach(function (k) {
        if (opts[k] != null) keep[k] = opts[k];
      });
      sessionStorage.setItem(ACTIVE_KEY, JSON.stringify(keep));
    } catch (e) { /* ignore */ }
  }

  function activeMessage() {
    try { return JSON.parse(sessionStorage.getItem(ACTIVE_KEY) || 'null'); } catch (e) { return null; }
  }

  function forgetActive() {
    try { sessionStorage.removeItem(ACTIVE_KEY); } catch (e) { /* ignore */ }
  }

  function finishAll(anims) {
    (anims || []).forEach(function (a) { try { a.finish(); } catch (e) { /* ignore */ } });
  }

  function allFinished(anims) {
    return Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); }));
  }

  /* ── slot placement ─────────────────────────────────────
     Single column: directly under the sticky title bar (Profile: under its sticky header).
     Multi-column views: on top of the right-most column. Re-placed when the layout changes. */

  /* The sticky header container that hosts the message (title bar wrapper, or Profile's header). */
  function headerHost(view) {
    return view.querySelector('[data-status-host]');
  }

  function headerNav(host) {
    return host.querySelector(':scope > .view__nav') || host.firstElementChild;
  }

  function rightColumn(view) {
    var main = view.querySelector(':scope > .view__main');
    var side = view.querySelector(':scope > .view__sidebar');
    if (!main || !side) return null;
    var display = getComputedStyle(side).display;
    if (display === 'none') return null;
    /* Sidebar flattened into the view's grid (Overview, 3 columns): the slot becomes a grid
       item and CSS puts it on top of the right-most column. */
    if (display === 'contents') return side;
    var rm = main.getBoundingClientRect();
    var rs = side.getBoundingClientRect();
    return rs.left >= rm.right - 1 ? side : null;   /* side by side, sidebar on the right */
  }

  /* When the header bleeds to the screen edges (stuck / mobile), keep the card on the content edges. */
  function syncInset(host) {
    var cs = getComputedStyle(host);
    /* Card edges = the page's content edges: undo the header's bleed (negative margin),
       border and padding. Can be negative (the header pads more than the content). */
    var start = -(parseFloat(cs.marginLeft) || 0) - (parseFloat(cs.borderLeftWidth) || 0) - (parseFloat(cs.paddingLeft) || 0);
    var end = -(parseFloat(cs.marginRight) || 0) - (parseFloat(cs.borderRightWidth) || 0) - (parseFloat(cs.paddingRight) || 0);
    /* A header that clips its content (Profile: overflow hidden) can't show anything outside its
       padding box — keep the card inside it, or its border gets cut off on both sides. */
    /* (While the pill is in flight the host is made overflow-visible: remember its real value.) */
    if (!host.classList.contains('status-host--entering')) host._uzClips = cs.overflowX !== 'visible';
    if (host._uzClips) {
      start = Math.max(start, -(parseFloat(cs.paddingLeft) || 0));
      end = Math.max(end, -(parseFloat(cs.paddingRight) || 0));
    }
    slot.style.setProperty('--status-slot-inset-start', start + 'px');
    slot.style.setProperty('--status-slot-inset-end', end + 'px');
  }

  function placeSlot() {
    var view = document.querySelector('.view.view--active');
    if (!view || !slot) return;
    var host = headerHost(view);
    if (!host) return;
    var column = rightColumn(view);
    if (column) {
      if (column.firstElementChild !== slot) column.insertBefore(slot, column.firstElementChild);
      slot.classList.add('status-slot--column');
      slot.classList.remove('status-slot--in-header');
      slot.style.setProperty('--status-slot-top', host.offsetHeight + 'px');
    } else {
      var nav = headerNav(host);
      if (nav.nextElementSibling !== slot) nav.insertAdjacentElement('afterend', slot);
      slot.classList.add('status-slot--in-header');
      slot.classList.remove('status-slot--column');
      syncInset(host);
    }
  }

  function ensureSlot() {
    if (slot && slot.isConnected) return slot;
    var view = document.querySelector('.view.view--active');
    var host = view && headerHost(view);
    if (!host) return null;
    slot = document.createElement('div');
    slot.className = 'status-slot';
    slot.hidden = true;
    headerNav(host).insertAdjacentElement('afterend', slot);
    placeSlot();
    if (global.ResizeObserver) {
      var ro = new ResizeObserver(function () { placeSlot(); });
      ro.observe(view);
      ro.observe(host);
    } else {
      global.addEventListener('resize', placeSlot);
    }
    /* The header's bleed changes with its scroll-edge state, not always with its size. */
    if (global.MutationObserver) {
      new MutationObserver(function () { if (slot.classList.contains('status-slot--in-header')) syncInset(host); })
        .observe(host, { attributes: true, attributeFilter: ['class'] });
    }
    return slot;
  }

  function hostOf(el) {
    return (el && el.closest('[data-status-host]')) || document.createElement('div');
  }

  /* Margins for the slot's open/close: in normal flow the slot's own margin-bottom opens with it;
     as a grid item (Overview, 3 columns) the grid's row gap appears at once, so it starts at -gap. */
  function slotMargins() {
    var open = parseFloat(getComputedStyle(slot).marginBottom) || 0;
    var closed = 0;
    var parent = slot.parentElement;
    if (parent && getComputedStyle(parent).display === 'contents') {
      var grid = parent.parentElement;
      closed = -(parseFloat(getComputedStyle(grid).rowGap) || 0);
    }
    return { open: open + 'px', closed: closed + 'px' };
  }

  /* ── rendering ───────────────────────────────────────── */

  function render(opts) {
    var state = STATE_LABEL[opts.state] ? opts.state : 'info';
    var icon = ICONS[opts.icon] || ICONS[DEFAULT_ICON[state]];
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'status-message status-message--' + state;
    card.setAttribute('data-status-state', state);
    card.innerHTML =
      '<span class="status-message__shell" aria-hidden="true"></span>' +
      '<span class="status-message__icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg>' +
      '</span>' +
      '<span class="status-message__text">' +
        '<span class="status-message__title">' +
          '<span class="visually-hidden">' + STATE_LABEL[state] + ': </span>' + escapeHtml(opts.title) +
        '</span>' +
        (opts.text ? '<span class="status-message__body">' + escapeHtml(opts.text) + '</span>' : '') +
      '</span>' +
      (opts.since
        ? '<span class="status-message__meta"><span class="status-message__since">since</span> ' +
          '<span class="status-message__date">' + escapeHtml(opts.since) + '</span></span>'
        : '');
    return card;
  }

  /* ── motion ──────────────────────────────────────────── */

  function shellRect(w, h, top, left) {
    return { w: w, h: h, top: top, left: left };
  }

  /* inset() for the shell, relative to the card box (cw × ch) */
  function insetOf(r, cw, ch) {
    return r.top + 'px ' + (cw - r.left - r.w) + 'px ' + (ch - r.top - r.h) + 'px ' + r.left + 'px';
  }

  function enter(entry) {
    var card = entry.card;
    var cw = card.offsetWidth;
    var ch = card.offsetHeight;
    var cardTop = card.getBoundingClientRect().top;
    var navEl = document.querySelector('.view.view--active [data-status-host] > .view__nav');
    var navBottom = navEl ? navEl.getBoundingClientRect().bottom : cardTop;

    var dur = ms('--status-enter-duration', 600);
    var slotDur = ms('--status-slot-duration', 240);
    var contentDur = ms('--status-content-duration', 220);
    var stagger = ms('--status-content-stagger', 40);
    var easeOut = token('--status-ease-out', 'cubic-bezier(0.22, 1, 0.36, 1)');
    var easeInOut = token('--status-ease-in-out', 'cubic-bezier(0.65, 0, 0.35, 1)');

    /* Frame 01 → 04 (sizes from the Figma frames, scaled to the real card width) */
    var f1 = shellRect(cw * 0.25, 14, -cardTop + 4, (cw - cw * 0.25) / 2);               /* pill at the top edge */
    var f2 = shellRect(cw * 0.375, 21, (navBottom - cardTop) - 28, (cw - cw * 0.375) / 2); /* passing the title bar */
    var f3 = shellRect(cw * 0.5625, 32, (ch - 32) / 2, (cw - cw * 0.5625) / 2);         /* landed, still growing */
    var f4 = shellRect(cw, ch, 0, 0);                                                      /* full card */

    var shell = card.querySelector('.status-message__shell');
    /* The pill is a solid dot of status colour; it turns into the card surface as it lands. */
    var cs = getComputedStyle(card);
    var accent = cs.getPropertyValue('--status-accent').trim();
    var surface = getComputedStyle(shell).backgroundColor;
    var anims = [];

    anims.push(shell.animate([
      { inset: insetOf(f1, cw, ch), borderRadius: '999px', backgroundColor: accent, opacity: 0, offset: 0, easing: easeInOut },
      { opacity: 1, offset: 0.1 },
      { inset: insetOf(f2, cw, ch), borderRadius: '999px', backgroundColor: accent, offset: 0.35, easing: easeOut },
      { inset: insetOf(f3, cw, ch), borderRadius: '999px', backgroundColor: accent, offset: 0.65, easing: easeOut },
      { inset: insetOf(f4, cw, ch), borderRadius: 'var(--radius-regular)', backgroundColor: surface, opacity: 1, offset: 1 }
    ], { duration: dur, fill: 'backwards' }));

    /* Tectonic: the slot opens between frame 02 and frame 03, pushing the sections down */
    var m = slotMargins();
    var pad = getComputedStyle(slot).paddingBottom;
    anims.push(slot.animate([
      { height: '0px', paddingBottom: '0px', marginBottom: m.closed },
      { height: slot.offsetHeight + 'px', paddingBottom: pad, marginBottom: m.open }
    ], { duration: slotDur, delay: dur * 0.25, easing: easeInOut, fill: 'backwards' }));

    /* Content after the card has landed */
    var contentStart = dur - 40;
    var parts = card.querySelectorAll('.status-message__icon, .status-message__title, .status-message__body, .status-message__meta');
    Array.prototype.forEach.call(parts, function (el, i) {
      anims.push(el.animate([
        { opacity: 0, transform: 'translateY(-6px)' },
        { opacity: 1, transform: 'none' }
      ], { duration: contentDur, delay: contentStart + i * stagger, easing: easeOut, fill: 'backwards' }));
    });

    /* Attention: the icon wiggles once the content has landed and keeps wiggling after a
       short rest as long as the message is there (shared Wiggle, js/wiggle.js).
       A round is skipped while the card is hovered or focused. */
    if (window.UZWiggle) {
      var wiggleIcon = card.querySelector('.status-message__icon svg');
      window.UZWiggle.attend(wiggleIcon, {
        delay: contentStart + contentDur + 80,
        times: Infinity,
        skip: function () { return card.matches(':hover, :focus-within'); }
      });
    }

    slot.classList.add('status-slot--entering');
    hostOf(slot).classList.add('status-host--entering');
    entry.anims = anims;
    entry.phase = 'entering';
    allFinished(anims).then(function () {
      if (current !== entry || entry.phase !== 'entering') return;
      slot.classList.remove('status-slot--entering');
      hostOf(slot).classList.remove('status-host--entering');
      entry.phase = 'shown';
    });
  }

  function leave(entry) {
    return new Promise(function (resolve) {
      finishAll(entry.anims);
      entry.phase = 'leaving';
      slot.classList.remove('status-slot--entering');

      if (reducedMotion()) {
        resolve();
        return;
      }

      var card = entry.card;
      var cw = card.offsetWidth;
      var ch = card.offsetHeight;
      var cardTop = card.getBoundingClientRect().top;
      var dur = ms('--status-exit-duration', 420);
      var easeIn = token('--status-ease-in', 'cubic-bezier(0.4, 0, 1, 1)');
      var shell = card.querySelector('.status-message__shell');
      var accent = getComputedStyle(card).getPropertyValue('--status-accent').trim();
      var pill = shellRect(cw * 0.25, 14, -cardTop - 20, (cw - cw * 0.25) / 2);
      var mid = shellRect(cw * 0.5625, 32, (ch - 32) / 2, (cw - cw * 0.5625) / 2);
      var anims = [];

      card.querySelectorAll('.status-message__icon, .status-message__text, .status-message__meta').forEach(function (el) {
        anims.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'linear', fill: 'forwards' }));
      });
      slot.classList.add('status-slot--entering');   /* above the title bar again while it rises */
      hostOf(slot).classList.add('status-host--entering');
      anims.push(shell.animate([
        { inset: insetOf(shellRect(cw, ch, 0, 0), cw, ch), borderRadius: 'var(--radius-regular)', backgroundColor: getComputedStyle(shell).backgroundColor, opacity: 1 },
        { inset: insetOf(mid, cw, ch), borderRadius: '999px', backgroundColor: accent, opacity: 1, offset: 0.35 },
        { inset: insetOf(pill, cw, ch), borderRadius: '999px', backgroundColor: accent, opacity: 0 }
      ], { duration: dur, delay: 80, easing: easeIn, fill: 'forwards' }));
      var m = slotMargins();
      var pad = getComputedStyle(slot).paddingBottom;
      anims.push(slot.animate([
        { height: slot.offsetHeight + 'px', paddingBottom: pad, marginBottom: m.open },
        { height: '0px', paddingBottom: '0px', marginBottom: m.closed }
      ], { duration: ms('--status-slot-duration', 240), delay: 80 + dur * 0.35, easing: token('--status-ease-in-out', 'ease-in-out'), fill: 'forwards' }));

      allFinished(anims).then(function () {
        anims.forEach(function (a) { try { a.cancel(); } catch (e) { /* ignore */ } });
        resolve();
      });
    });
  }

  /* ── public API ──────────────────────────────────────── */

  function show(opts) {
    opts = opts || {};
    if (opts.id && dismissedAt(opts.id) && !opts.force) return;
    if (!ensureSlot()) return;

    var go = function () {
      if (current) {
        var old = current;
        current = null;
        leave(old).then(function () { teardown(old); mount(opts); });
      } else {
        mount(opts);
      }
    };
    whenSettled(function () {
      if (opts.delay) global.setTimeout(go, opts.delay);
      else go();
    });
  }

  function mount(opts, staticMount) {
    var card = render(opts);
    var entry = { opts: opts, card: card, anims: [], phase: 'idle' };
    current = entry;
    rememberActive(opts);
    clearDismissed(opts.id);

    /* Announce: errors interrupt, warnings and information wait their turn */
    slot.setAttribute('role', opts.state === 'error' ? 'alert' : 'status');
    slot.appendChild(card);
    slot.hidden = false;

    card.addEventListener('click', function () { activate(entry); });

    /* Restored on another view: it's already there (on root pages it builds up with the other sections). */
    if (staticMount) {
      entry.phase = 'shown';
      // Permanent attention cue also when the message is restored on another view
      if (window.UZWiggle) {
        window.UZWiggle.attend(card.querySelector('.status-message__icon svg'), {
          delay: 1200,   // after the page's own build-up
          times: Infinity,
          skip: function () { return card.matches(':hover, :focus-within'); }
        });
      }
      return;
    }

    if (reducedMotion() || typeof card.animate !== 'function') {
      entry.phase = 'shown';
      card.animate && card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
      return;
    }
    enter(entry);
  }

  function teardown(entry) {
    if (entry.card && entry.card.parentNode) entry.card.parentNode.removeChild(entry.card);
    if (!current && slot) {
      slot.hidden = true;
      slot.removeAttribute('role');
      slot.classList.remove('status-slot--entering');
      hostOf(slot).classList.remove('status-host--entering');
    }
  }

  /* Tap: go to the detail view; the message is dismissed on the way. */
  function activate(entry) {
    if (entry.phase === 'leaving') return;
    rememberDismissed(entry.opts.id);
    forgetActive();
    current = null;
    leave(entry).then(function () {
      teardown(entry);
      scheduleReappear(entry.opts, entry.opts.reappearAfter);
      if (entry.opts.href) global.location.href = entry.opts.href;
      try { global.dispatchEvent(new CustomEvent('uz:status-dismissed', { detail: { id: entry.opts.id } })); } catch (e) { /* ignore */ }
    });
  }

  /* Snooze: a dismissed message comes back after `reappearAfter` ms (if set), with the full drop. */
  var reappearTimer = null;
  function scheduleReappear(opts, wait) {
    if (!opts.reappearAfter) return;
    global.clearTimeout(reappearTimer);
    reappearTimer = global.setTimeout(function () {
      var again = {};
      Object.keys(opts).forEach(function (k) { again[k] = opts[k]; });
      again.delay = 0;
      again.force = true;
      show(again);
    }, Math.max(0, wait));
  }

  function dismiss() {
    if (current) activate(current);
  }

  /* Wait until the view has landed (page slide or section build-up), as for the close button. */
  function whenSettled(cb) {
    var view = document.querySelector('.view.view--active');
    var sliding = view && /shell-view--enter-/.test(view.className);
    var pendingSlide = root.classList.contains('shell-nav-pending');
    var building = root.classList.contains('section-build-pending') || root.classList.contains('section-build-running');
    if (sliding || pendingSlide) {
      global.addEventListener('uz:shell-view-entered', function once() {
        global.removeEventListener('uz:shell-view-entered', once);
        cb();
      });
    } else if (building) {
      global.addEventListener('uz:sections-built', function once() {
        global.removeEventListener('uz:sections-built', once);
        cb();
      });
    } else {
      cb();
    }
  }

  /* Show a message that is already active (another view showed it) — no entrance. */
  function restore(opts) {
    if (!ensureSlot()) return false;
    mount(opts, true);
    return true;
  }

  /**
   * feed(definition): what the app's message source would deliver.
   * - Already showing in this session → restored in place on every main view.
   * - Not shown yet (and not dismissed) → appears after `delay` on whichever main view is open.
   * - Testing: ?status=error|warning|info shows that state right away (ignores dismissals).
   */
  function feed(def) {
    var param = null;
    try { param = new URL(global.location.href).searchParams.get('status'); } catch (e) { /* ignore */ }
    var opts = {};
    Object.keys(def).forEach(function (k) { if (k !== 'variants') opts[k] = def[k]; });

    if (param && STATE_LABEL[param]) {
      opts.state = param;
      if (def.variants && def.variants[param]) {
        Object.keys(def.variants[param]).forEach(function (k) { opts[k] = def.variants[param][k]; });
      }
      opts.id = def.id + ':' + param;
      opts.delay = 300;
      opts.force = true;
      show(opts);
      return;
    }

    var active = activeMessage();
    if (active && !dismissedAt(active.id)) {
      restore(active);
      return;
    }

    /* Dismissed earlier: snoozed until `reappearAfter` has passed since the dismissal. */
    var at = dismissedAt(opts.id);
    if (at) {
      if (!opts.reappearAfter) return;
      whenSettled(function () {
        scheduleReappear(opts, opts.reappearAfter - (Date.now() - at));
      });
      return;
    }
    show(opts);
  }

  global.UZStatusMessage = { show: show, dismiss: dismiss, feed: feed };

  /* Declarative use: <script type="application/json" data-status-message>{…}</script> */
  function boot() {
    document.querySelectorAll('script[data-status-message]').forEach(function (el) {
      try { feed(JSON.parse(el.textContent)); } catch (e) { /* ignore */ }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(typeof window !== 'undefined' ? window : this);
