/**
 * UZ Bank Web — analytics / instrumentation shim for UX tools (e.g. Maze,
 * Hotjar, GA4). Uses page paths plus optional hash routes (#pay/…, #payment-details/…) for modal flows.
 *
 * Screen IDs combine body data-screen with optional hash routes (e.g. account-details/payment-details/domestic/lena-fischer).
 *
 * Integrators can listen for CustomEvents on document:
 *   uzbank:screen   detail: { screenId, path, title }
 *   uzbank:event    detail: { name, category, screenId, payload }
 *
 * Or assign window.UZ_BANK_ANALYTICS_HOOK before load:
 *   window.UZ_BANK_ANALYTICS_HOOK = function (kind, payload) { ... };
 */
(function () {
  'use strict';

  function hook(kind, payload) {
    if (typeof window.UZ_BANK_ANALYTICS_HOOK === 'function') {
      try {
        window.UZ_BANK_ANALYTICS_HOOK(kind, payload);
      } catch (e) {}
    }
    try {
      document.dispatchEvent(
        new CustomEvent(kind === 'screen' ? 'uzbank:screen' : 'uzbank:event', {
          bubbles: true,
          detail: payload
        })
      );
    } catch (e) {}

    if (window.console && typeof window.console.debug === 'function') {
      window.console.debug('[UZ analytics]', kind, payload);
    }
  }

  function currentScreenId() {
    var b = document.body;
    return (b && b.getAttribute('data-screen')) || '';
  }

  function emitScreen() {
    var base = currentScreenId();
    var rawHash = (location.hash || '').replace(/^#\/?/, '');
    var screenId = rawHash ? base + '/' + rawHash : base;
    var path =
      (window.location.pathname || '') +
      (window.location.search || '') +
      (window.location.hash || '');
    var title = document.title || '';
    hook('screen', { screenId: screenId, path: path, title: title });
  }

  window.UZBankAnalytics = {
    screen: emitScreen,
    /**
     * Track named interactions (clicks, submits, flow steps).
     * @param {string} name — e.g. 'pay_cta', 'payment_confirm'
     * @param {string} [category] — e.g. 'navigation', 'payment'
     * @param {object} [payload] — extra serializable data
     */
    track: function (name, category, payload) {
      var base = currentScreenId();
      var rawHash = (location.hash || '').replace(/^#\/?/, '');
      var screenId = rawHash ? base + '/' + rawHash : base;
      var path =
        (window.location.pathname || '') +
        (window.location.search || '') +
        (window.location.hash || '');
      hook('event', {
        name: name,
        category: category || 'interaction',
        screenId: screenId,
        path: path,
        payload: payload || {}
      });
    }
  };

  (window.onDocumentReady || function (fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  })(emitScreen);

  /* Hash-only steps (#pay/…, #iat/…) do not reload the page; emit virtual screens for tools that listen. */
  window.addEventListener('hashchange', emitScreen);
})();
