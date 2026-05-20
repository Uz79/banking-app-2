(function () {
  'use strict';

  /** Share information — stacked modal above account information on account-details. */

  function getOverlay() {
    return document.getElementById('uz-share-information-overlay');
  }

  function getShell() {
    var ov = getOverlay();
    return ov ? ov.querySelector('.modal-shell') : null;
  }

  var shareInformationClosing = false;

  function isPaymentFlowOpen() {
    var overlays = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < overlays.length; i++) {
      var el = overlays[i];
      if (el.id === 'uz-share-information-overlay' || el.id === 'uz-account-information-overlay') continue;
      if (el.classList.contains('modal-overlay--active')) return true;
    }
    return false;
  }

  function syncDocumentScrollLock() {
    var ov = getOverlay();
    var aiOv = document.getElementById('uz-account-information-overlay');
    var shareOpen = ov && ov.classList.contains('modal-overlay--active');
    var aiOpen = aiOv && aiOv.classList.contains('modal-overlay--active');
    if (isPaymentFlowOpen() || shareOpen || aiOpen) document.body.classList.add('body--payment-open');
    else document.body.classList.remove('body--payment-open');
  }

  function parkShellInstant(shell) {
    if (!shell) return;
    shell.classList.remove('modal-shell--closing');
    shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
  }

  function clearRouteIfStale() {
    try {
      if ((location.hash || '') !== '#share-information') return;
      var path = window.location.pathname + window.location.search;
      history.replaceState(history.state || null, '', path);
    } catch (_e) {}
  }

  function openShareInformationVisual() {
    var ov = getOverlay();
    var shell = getShell();
    if (!ov) return;

    if (ov.classList.contains('modal-overlay--active')) return;

    shareInformationClosing = false;

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

  function closeShareInformationAnimated(forceInstant, onDone) {
    var ov = getOverlay();
    var shell = getShell();
    if (!ov) return;

    function finish() {
      shareInformationClosing = false;
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
      shareInformationClosing = false;
      finish();
      return;
    }

    if (shareInformationClosing) return;

    shareInformationClosing = true;

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

  function applyShareInformationRoute() {
    var ov = getOverlay();
    if (!ov) return;

    var h = location.hash || '';

    if (/^#pay\//.test(h)) {
      closeShareInformationAnimated(true);
      return;
    }

    if (/^#share-information$/.test(h)) {
      if (isPaymentFlowOpen()) return;
      openShareInformationVisual();
      return;
    }

    closeShareInformationAnimated(false);
  }

  function openShareInformationOverlay() {
    var ov = getOverlay();
    if (!ov) return false;
    if (isPaymentFlowOpen()) return false;
    try {
      if ((location.hash || '') !== '#share-information') history.pushState(null, '', '#share-information');
    } catch (_e) {
      location.hash = 'share-information';
    }
    applyShareInformationRoute();
    return true;
  }

  function closeShareInformationOverlay() {
    var ov = getOverlay();
    if (!ov) return false;
    closeShareInformationAnimated(false, function () {
      clearRouteIfStale();
    });
    return true;
  }

  function bindOverlay(rootEl) {
    if (!rootEl || rootEl.dataset.uzShareInformationBound) return;
    rootEl.dataset.uzShareInformationBound = '1';

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

    rootEl.querySelectorAll('.uz-share-information-share').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (navigator.share) {
          navigator
            .share({
              title: 'Account information',
              text: 'CH35 0900 0000 2470 2920 1 — Beatrice Müller'
            })
            .catch(function () {});
        }
      });
    });

    function dismissViaHistory() {
      if ((location.hash || '') === '#share-information') {
        try {
          history.back();
          return;
        } catch (_e4) {}
      }
      closeShareInformationOverlay();
    }

    rootEl.querySelectorAll('.uz-share-information-back,.uz-share-information-close').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        dismissViaHistory();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var ov = getOverlay();

    if (ov) {
      parkShellInstant(getShell());
      bindOverlay(ov);
    }

    if (!ov) return;

    applyShareInformationRoute();
    window.addEventListener('popstate', applyShareInformationRoute);
    window.addEventListener('hashchange', applyShareInformationRoute);

    document.addEventListener('uz:share-information', function () {
      if ((location.hash || '') === '#share-information') {
        applyShareInformationRoute();
        return;
      }
      openShareInformationOverlay();
    });
  });

  window.UZBankOpenShareInformationOverlay = openShareInformationOverlay;
  window.UZBankCloseShareInformationOverlay = closeShareInformationOverlay;
})();
