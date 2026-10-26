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

  /* Vercel Web Analytics (roadmap item 13): counted on the production host only, never on localhost, previews or GitHub Pages.
     ?analytics=off stores a flag that keeps the script from loading in this browser; ?analytics=on clears it. */
  var COUNTED_HOST = 'banking-app-2-bay.vercel.app';
  var OPT_OUT_KEY = 'uzBankWebAnalyticsOff';

  function isCountedHost(hostname) {
    return hostname === COUNTED_HOST;
  }

  function applyOptOutParam() {
    try {
      var params = new URLSearchParams(window.location.search);
      var v = params.get('analytics');
      if (v !== 'off' && v !== 'on') return;
      try {
        if (v === 'off') window.localStorage.setItem(OPT_OUT_KEY, '1');
        else window.localStorage.removeItem(OPT_OUT_KEY);
      } catch (e) {}
      params.delete('analytics');
      var q = params.toString();
      window.history.replaceState(window.history.state, '', window.location.pathname + (q ? '?' + q : '') + window.location.hash);
    } catch (e) {}
  }

  function optedOut() {
    try {
      return window.localStorage.getItem(OPT_OUT_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function loadVercelAnalytics() {
    try {
      applyOptOutParam();
      if (optedOut() || !isCountedHost(window.location.hostname)) return;
      window.va = window.va || function () {
        (window.vaq = window.vaq || []).push(arguments);
      };
      var el = document.createElement('script');
      el.defer = true;
      el.src = '/_vercel/insights/script.js';
      document.head.appendChild(el);
    } catch (e) {}
  }

  loadVercelAnalytics();

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
    isCountedHost: isCountedHost,
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
