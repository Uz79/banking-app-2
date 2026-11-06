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

  /* ── Sheets (div overlays) keep focus, roadmap 27 ───────────────────────
   * While a sheet is open the page (.app) and every other sheet are inert, a
   * sheet beneath it included (D1 to D3). Focus moves into the sheet and back
   * to its opener (D5, D6). */
  var stack = [];
  var ours = new Set(); /* elements this helper made inert, so others' inert stays theirs */
  var openers = new Map(); /* overlay → the element focused when it opened */
  var byKeyboard = false;

  var lastOutsideDialog = null; /* what a picker dialog was opened from, for a sheet opened from inside it */

  document.addEventListener('keydown', function () { byKeyboard = true; }, true);
  document.addEventListener('pointerdown', function () { byKeyboard = false; }, true);
  document.addEventListener('focusin', function (e) {
    if (!e.target.closest || !e.target.closest('dialog')) lastOutsideDialog = e.target;
  }, true);

  function openDialogOf(el) {
    return el && el.closest ? el.closest('dialog[open]') : null;
  }

  /* Only the app's own layers: the page and the other sheets. Native dialogs, scripts and anything a browser
     extension adds to <body> are left alone. */
  function isLayer(el) {
    return el.classList.contains('app') || el.classList.contains('modal-overlay');
  }

  /* Recomputed from the stack, so sheets can close in any order */
  function apply() {
    var top = stack[stack.length - 1] || null;
    Array.prototype.forEach.call(document.body.children, function (el) {
      var want = !!top && el !== top && isLayer(el);
      if (want && !el.inert) {
        el.inert = true;
        ours.add(el);
      } else if (!want && ours.has(el)) {
        el.inert = false;
        ours.delete(el);
      }
    });
  }

  function canTakeFocus(el) {
    if (!el || !el.isConnected || el === document.body || el.closest('[inert]')) return false;
    if (el.disabled || el.getClientRects().length === 0) return false;
    return el.tabIndex >= 0 || el.hasAttribute('tabindex');
  }

  /* An opener inside a sheet that has since closed hands on that sheet's own opener (the booking sheet's Edit opening Pay) */
  function resolveOpener(el) {
    var seen = 0;
    while (el && seen++ < 5) {
      var host = el.closest && el.closest('.modal-overlay');
      if (!host || stack.indexOf(host) !== -1 || !openers.has(host)) return el;
      el = openers.get(host);
    }
    return el;
  }

  function openSheet(overlay) {
    if (!overlay || stack.indexOf(overlay) !== -1) return;
    var active = document.activeElement;
    /* Opened from a picker dialog (More functions): the opener is what opened the dialog, and focus moves in
       once the dialog has shut, since closing it hands focus back */
    var dlg = openDialogOf(active);
    var opener = dlg || !active || active === document.body ? lastOutsideDialog : active;
    openers.set(overlay, opener && !overlay.contains(opener) ? opener : null);
    stack.push(overlay);
    apply();
    if (dlg) dlg.addEventListener('close', function () { focusIn(overlay); }, { once: true });
    else focusIn(overlay);
  }

  /* After the sheet's own code has had its turn: Pay and the transfer focus a field themselves */
  function focusIn(overlay) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (stack[stack.length - 1] !== overlay || overlay.contains(document.activeElement)) return;
        var modal = overlay.querySelector('.modal') || overlay;
        if (!modal.hasAttribute('tabindex')) modal.setAttribute('tabindex', '-1');
        try { modal.focus({ preventScroll: true }); } catch (err) { /* ignore */ }
      });
    });
  }

  function closeSheet(overlay) {
    var i = stack.indexOf(overlay);
    if (i === -1) return;
    var wasTop = i === stack.length - 1;
    var active = document.activeElement;
    var hadFocus = overlay.contains(active);
    stack.splice(i, 1);
    apply();
    if (!wasTop && !hadFocus) return;
    /* Closed from a dialog over the sheet (Discard): that dialog gives focus back to the sheet when it shuts,
       so the opener is focused after it */
    var dlg = openDialogOf(active);
    if (dlg) {
      dlg.addEventListener('close', function () { focusOpener(overlay); }, { once: true });
      return;
    }
    focusOpener(overlay);
  }

  /* An opener that may be gone when its sheet closes names who takes focus instead (a deleted booking row, roadmap 33) */
  var handOns = new WeakMap();

  function handOn(el, pick) {
    if (el) handOns.set(el, pick);
  }

  function focusOpener(overlay) {
    if (stack.indexOf(overlay) !== -1) return; /* opened again meanwhile */
    var opener = resolveOpener(openers.get(overlay));
    if (!canTakeFocus(opener) && opener && handOns.has(opener)) opener = handOns.get(opener)();
    if (!canTakeFocus(opener)) return;
    try {
      opener.focus(byKeyboard ? { preventScroll: true } : { preventScroll: true, focusVisible: false });
    } catch (err) { /* ignore */ }
  }

  window.UZBankSheetFocus = { open: openSheet, close: closeSheet, handOn: handOn };

  /* ── A confirmation over its sheet keeps focus, roadmap 41 ─────────────
   * The dialog sits beside the sheet's .modal-shell in the same overlay. While
   * it shows, the shell is inert (D1) and focus is on Done (D2), with the ring
   * only after a keyboard action. */
  function confirmationShell(confOverlay) {
    var host = confOverlay && confOverlay.closest('.modal-overlay');
    return host ? host.querySelector(':scope > .modal-shell') : null;
  }

  function openConfirmation(confOverlay, doneBtn) {
    var shell = confirmationShell(confOverlay);
    if (shell) shell.inert = true;
    if (!doneBtn) return;
    requestAnimationFrame(function () {
      try {
        doneBtn.focus(byKeyboard ? { preventScroll: true } : { preventScroll: true, focusVisible: false });
      } catch (err) { /* ignore */ }
    });
  }

  function closeConfirmation(confOverlay) {
    var shell = confirmationShell(confOverlay);
    if (shell) shell.inert = false;
  }

  window.UZBankConfirmFocus = { open: openConfirmation, close: closeConfirmation };

  /* ── A sheet's close ends without waiting on an event, roadmap 35 ───────
   * `done` runs once: at once with reduced motion (no slide runs, D2); else on
   * the shell's own transform transitionend or after 300 ms (the slide is
   * 0.28 s), whichever comes first (D1). */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function afterSheetClose(shell, done) {
    var finished = false;
    function end(e) {
      if (e && (e.target !== shell || e.propertyName !== 'transform')) return;
      if (finished) return;
      finished = true;
      if (shell) shell.removeEventListener('transitionend', end);
      done();
    }
    if (!shell || reduceMotion.matches) { end(); return; }
    shell.addEventListener('transitionend', end);
    window.setTimeout(end, 300);
  }

  window.UZBankAfterSheetClose = afterSheetClose;

  /* ── A status line after a confirmation, roadmap 60 ────────────────────
   * While a modal <dialog> is open the rest of the page is inert, so a live
   * region changed then is never heard (D2). The region is emptied at once,
   * filled once no dialog is open, and a moment later, so the focus move
   * after a sheet's close has landed first. `html` is set as markup. */
  var ANNOUNCE_PAUSE = 250;

  function announce(region, html) {
    if (!region) return;
    region.textContent = ''; /* emptied first, so the same text is announced again */
    function fill() {
      window.setTimeout(function () {
        if (document.querySelector('dialog[open]')) { fill(); return; }
        region.innerHTML = html;
      }, ANNOUNCE_PAUSE);
    }
    var open = document.querySelector('dialog[open]');
    if (open) open.addEventListener('close', fill, { once: true });
    else fill();
  }

  window.UZBankAnnounce = announce;
})();
