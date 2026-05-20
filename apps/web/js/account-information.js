(function () {
  'use strict';

  /** Account information — `.modal-overlay` on account-details (same shell sizing + motion as payment). */

  function getOverlay() {
    return document.getElementById('uz-account-information-overlay');
  }

  function getShell() {
    var ov = getOverlay();
    return ov ? ov.querySelector('.modal-shell') : null;
  }

  /** Mirror payment-overlay.js: avoid stacked close animations */
  var accountInformationClosing = false;

  function isPaymentFlowOpen() {
    var overlays = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < overlays.length; i++) {
      var el = overlays[i];
      if (el.id === 'uz-account-information-overlay' || el.id === 'uz-share-information-overlay') continue;
      if (el.classList.contains('modal-overlay--active')) return true;
    }
    return false;
  }

  function syncDocumentScrollLock() {
    var ov = getOverlay();
    var aiOpen = ov && ov.classList.contains('modal-overlay--active');
    if (isPaymentFlowOpen() || aiOpen) document.body.classList.add('body--payment-open');
    else document.body.classList.remove('body--payment-open');
  }

  function parkShellInstant(shell) {
    if (!shell) return;
    shell.classList.remove('modal-shell--closing');
    shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
  }

  function clearRouteIfStale() {
    try {
      if ((location.hash || '') !== '#account-information') return;
      var path = window.location.pathname + window.location.search;
      history.replaceState(history.state || null, '', path);
    } catch (_e) {}
  }

  /** Same choreography as payment-overlay.openModalVisual(), scoped to the AI overlay. */
  function openAccountInformationVisual() {
    var ov = getOverlay();
    var shell = getShell();
    if (!ov) return;

    if (ov.classList.contains('modal-overlay--active')) return;

    accountInformationClosing = false;

    if (shell) {
      shell.classList.remove('modal-shell--closing');
      shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    }

    ov.classList.add('modal-overlay--active');
    ov.removeAttribute('aria-hidden');
    syncDocumentScrollLock();

    if (!shell) return;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        shell.classList.remove('modal-shell--no-transition');
        shell.offsetHeight;
        shell.classList.remove('modal-shell--offscreen');
      });
    });
  }

  /**
   * @param {boolean} forceInstant - e.g. when switching straight into #pay/… (stacking/z-index).
   * @param {(() => void) | null} [onDone]
   */
  function closeAccountInformationAnimated(forceInstant, onDone) {
    var ov = getOverlay();
    var shell = getShell();
    if (!ov) return;

    function finish() {
      accountInformationClosing = false;
      ov.classList.remove('modal-overlay--active');
      ov.setAttribute('aria-hidden', 'true');
      parkShellInstant(shell);
      syncDocumentScrollLock();
      if (onDone) onDone();
    }

    if (!ov.classList.contains('modal-overlay--active')) {
      parkShellInstant(shell);
      syncDocumentScrollLock();
      if (onDone) onDone();
      return;
    }

    if (forceInstant || !shell) {
      accountInformationClosing = false;
      finish();
      return;
    }

    if (accountInformationClosing) return;

    accountInformationClosing = true;

    shell.classList.remove('modal-shell--offscreen', 'modal-shell--no-transition');
    shell.offsetHeight;
    shell.classList.add('modal-shell--closing');

    var resolved = false;
    function onShellCloseEnd(e) {
      if (e.target !== shell || e.propertyName !== 'transform') return;
      if (resolved) return;
      resolved = true;
      shell.removeEventListener('transitionend', onShellCloseEnd);
      finish();
    }
    shell.addEventListener('transitionend', onShellCloseEnd);
    window.setTimeout(function () {
      if (resolved) return;
      resolved = true;
      shell.removeEventListener('transitionend', onShellCloseEnd);
      finish();
    }, 300);
  }

  /** Keep overlay DOM in sync with `location.hash` (and coexist with `#pay/*`). */
  function applyAccountInformationRoute() {
    var ov = getOverlay();
    if (!ov) return;

    var h = location.hash || '';

    if (/^#pay\//.test(h)) {
      closeAccountInformationAnimated(true);
      return;
    }

    if (/^#account-information$/.test(h) || /^#share-information$/.test(h)) {
      if (isPaymentFlowOpen()) return;
      openAccountInformationVisual();
      return;
    }

    closeAccountInformationAnimated(false);
  }

  function openAccountInformationOverlay() {
    var ov = getOverlay();
    if (!ov) return false;
    if (isPaymentFlowOpen()) return false;
    try {
      if ((location.hash || '') !== '#account-information') history.pushState(null, '', '#account-information');
    } catch (_e) {
      location.hash = 'account-information';
    }
    applyAccountInformationRoute();
    return true;
  }

  function closeAccountInformationOverlay() {
    var ov = getOverlay();
    if (!ov) return false;
    closeAccountInformationAnimated(false, function () {
      clearRouteIfStale();
    });
    return true;
  }

  function bindOverlay(rootEl) {
    if (!rootEl || rootEl.dataset.uzAccountInformationBound) return;
    rootEl.dataset.uzAccountInformationBound = '1';

    var tabs = rootEl.querySelectorAll('.account-information__tabs [data-ai-tab]');
    var panels = rootEl.querySelectorAll('[data-ai-panel]');

    function setTab(name) {
      tabs.forEach(function (tab) {
        var active = tab.getAttribute('data-ai-tab') === name;
        tab.classList.toggle('segmented__option--active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        var active = panel.getAttribute('data-ai-panel') === name;
        panel.classList.toggle('account-information__panel--active', active);
        if (active) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        setTab(tab.getAttribute('data-ai-tab'));
      });
    });

    rootEl.querySelectorAll('[data-copy-text]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy-text') || '';
        if (!text) return;
        function fallback() {
          try {
            window.prompt('Copy:', text);
          } catch (_e3) {}
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(fallback);
        else fallback();
      });
    });

    rootEl.querySelectorAll('.uz-account-information-share').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.UZBankOpenShareInformationOverlay) {
          window.UZBankOpenShareInformationOverlay();
          return;
        }
        try {
          document.dispatchEvent(
            new CustomEvent('uz:share-information', {
              bubbles: true,
              detail: { source: 'account-information' }
            })
          );
        } catch (_e5) {}
      });
    });

    rootEl.querySelectorAll('.uz-account-information-confirm,#accountInformationConfirm').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeAccountInformationOverlay();
      });
    });

    function dismissViaHistory() {
      if ((location.hash || '') === '#account-information') {
        try {
          history.back();
          return;
        } catch (_e4) {}
      }
      closeAccountInformationOverlay();
    }

    rootEl.querySelectorAll('.uz-account-information-close').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        dismissViaHistory();
      });
    });

    setTab('information');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var ov = getOverlay();

    if (ov) {
      parkShellInstant(getShell());
      bindOverlay(ov);
    }

    var viewAi = document.querySelector('.view--account-information');
    if (viewAi) bindOverlay(viewAi);

    if (!ov && !viewAi) return;

    applyAccountInformationRoute();
    window.addEventListener('popstate', applyAccountInformationRoute);
    window.addEventListener('hashchange', applyAccountInformationRoute);
  });

  window.UZBankOpenAccountInformationOverlay = openAccountInformationOverlay;
  window.UZBankCloseAccountInformationOverlay = closeAccountInformationOverlay;
})();
