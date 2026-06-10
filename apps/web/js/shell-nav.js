/**
 * Multi-page shell — root tab highlighting + hierarchical page transitions.
 */
(function (global) {
  'use strict';

  var PREV_PATH_KEY = 'uzShellNavPrevPath';
  var ENTER_DIR_KEY = 'uzShellNavEnterDir';
  var EXIT_MS = 380;
  var REVEAL_MS = 320;

  /** Root tab screens only; child/detail screens leave all tabs inactive. */
  var ROOT_TAB_BY_SCREEN = {
    overview: 'overview',
    payments: 'payments',
    profile: 'profile',
    'account-details': null,
    'investment-product-details': null,
    'details-of-position': null,
    'all-bookings': null,
    components: null
  };

  var NAV_DEPTH = {
    'overview.html': 0,
    'payments.html': 0,
    'profile.html': 0,
    'account-details.html': 1,
    'investment-product-details.html': 1,
    'all-bookings-and-payments.html': 2,
    'details-of-position.html': 2
  };

  (function markPendingEnter() {
    try {
      var dir = sessionStorage.getItem(ENTER_DIR_KEY);
      if (dir === 'forward' || dir === 'back') {
        document.documentElement.classList.add('shell-nav-pending', 'shell-nav-pending--' + dir);
      }
    } catch (err) {
      /* ignore */
    }
  })();

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function normalizePath(pathOrUrl) {
    var path = pathOrUrl || '';
    try {
      if (/^https?:\/\//i.test(path)) {
        path = new URL(path).pathname;
      }
    } catch (err) {
      /* keep raw path */
    }
    var name = path.split('/').pop() || 'overview.html';
    if (!/\.html$/i.test(name)) name = 'overview.html';
    return name.split('?')[0].split('#')[0].toLowerCase();
  }

  function currentPath() {
    return normalizePath(global.location.pathname);
  }

  function getDepth(path) {
    var key = normalizePath(path);
    return Object.prototype.hasOwnProperty.call(NAV_DEPTH, key) ? NAV_DEPTH[key] : 0;
  }

  function tabFromHref(href) {
    var path = normalizePath(href);
    if (path === 'overview.html') return 'overview';
    if (path === 'payments.html') return 'payments';
    if (path === 'profile.html') return 'profile';
    return null;
  }

  function resolveRootTab() {
    var screen = document.body.getAttribute('data-screen') || '';
    if (Object.prototype.hasOwnProperty.call(ROOT_TAB_BY_SCREEN, screen)) {
      return ROOT_TAB_BY_SCREEN[screen];
    }
    var path = currentPath();
    if (path === 'overview.html') return 'overview';
    if (path === 'payments.html') return 'payments';
    if (path === 'profile.html') return 'profile';
    return null;
  }

  function getTransitionSurface() {
    return document.querySelector('.view.view--active') || document.querySelector('.main-content__inner');
  }

  function clearPendingEnterClasses() {
    document.documentElement.classList.remove(
      'shell-nav-pending',
      'shell-nav-pending--forward',
      'shell-nav-pending--back'
    );
  }

  function clearTransitionClasses(surface) {
    if (!surface) return;
    surface.classList.remove(
      'shell-view--enter-forward',
      'shell-view--enter-back',
      'shell-view--exit-forward',
      'shell-view--exit-back'
    );
  }

  function isShellAnimation(event, surface) {
    if (!surface || event.target !== surface) return false;
    return typeof event.animationName === 'string' && event.animationName.indexOf('shell-view-') === 0;
  }

  function syncShellNav() {
    var activeTab = resolveRootTab();

    document.querySelectorAll('.sidebar__nav-item').forEach(function (item) {
      var tab = tabFromHref(item.getAttribute('href') || '');
      var isActive = tab !== null && tab === activeTab;
      item.classList.toggle('sidebar__nav-item--active', isActive);
      if (isActive) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });

    document.querySelectorAll('.tab-bar__item').forEach(function (item) {
      var tab = tabFromHref(item.getAttribute('href') || '');
      var isActive = tab !== null && tab === activeTab;
      var iconWrap = item.querySelector('.tab-bar__icon-wrap');
      item.classList.toggle('tab-bar__item--active', isActive);
      if (iconWrap) iconWrap.classList.toggle('tab-bar__icon-wrap--active', isActive);
      if (isActive) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  function inferEnterDirection() {
    var stored = sessionStorage.getItem(ENTER_DIR_KEY);
    if (stored === 'forward' || stored === 'back') {
      sessionStorage.removeItem(ENTER_DIR_KEY);
      return stored;
    }

    var prev = sessionStorage.getItem(PREV_PATH_KEY);
    var cur = currentPath();
    if (!prev || prev === cur) return null;

    var prevDepth = getDepth(prev);
    var curDepth = getDepth(cur);
    if (curDepth > prevDepth) return 'forward';
    if (curDepth < prevDepth) return 'back';
    return null;
  }

  function markViewEntered(surface) {
    if (surface) surface.classList.add('shell-view--entered');
    try {
      global.dispatchEvent(new CustomEvent('uz:shell-view-entered'));
    } catch (err) {
      /* ignore */
    }
  }

  function playEnterTransition() {
    var surface = getTransitionSurface();

    if (prefersReducedMotion()) {
      clearPendingEnterClasses();
      markViewEntered(surface);
      return;
    }

    var direction = inferEnterDirection();
    if (!direction) {
      clearPendingEnterClasses();
      markViewEntered(surface);
      return;
    }

    var main = document.querySelector('.main-content');
    if (!surface) {
      clearPendingEnterClasses();
      markViewEntered(surface);
      return;
    }

    if (main) main.classList.add('main-content--page-transition');
    clearTransitionClasses(surface);

    global.requestAnimationFrame(function () {
      surface.classList.add('shell-view--enter-' + direction);
      clearPendingEnterClasses();
    });

    function cleanup() {
      clearTransitionClasses(surface);
      if (main) main.classList.remove('main-content--page-transition');
      markViewEntered(surface);
    }

    surface.addEventListener('animationend', function onEnd(event) {
      if (!isShellAnimation(event, surface)) return;
      surface.removeEventListener('animationend', onEnd);
      cleanup();
    });

    global.setTimeout(cleanup, EXIT_MS + 80);
  }

  function isShellPageLink(anchor) {
    if (!anchor || anchor.tagName !== 'A') return false;
    if (anchor.hasAttribute('download')) return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('data-no-shell-nav')) return false;

    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;

    try {
      var url = new URL(href, global.location.href);
      if (url.origin !== global.location.origin) return false;
      return /\.html$/i.test(url.pathname.split('/').pop() || '');
    } catch (err) {
      return false;
    }
  }

  function navigateWithTransition(url) {
    var targetPath = normalizePath(url);
    var fromPath = currentPath();
    var targetDepth = getDepth(targetPath);
    var fromDepth = getDepth(fromPath);
    var direction = null;

    if (targetPath !== fromPath) {
      if (targetDepth > fromDepth) direction = 'forward';
      else if (targetDepth < fromDepth) direction = 'back';
    }

    sessionStorage.setItem(PREV_PATH_KEY, fromPath);
    if (direction) sessionStorage.setItem(ENTER_DIR_KEY, direction);

    if (!direction || prefersReducedMotion()) {
      global.location.href = url;
      return;
    }

    var surface = getTransitionSurface();
    var main = document.querySelector('.main-content');
    if (!surface) {
      global.location.href = url;
      return;
    }

    document.body.classList.add('shell-nav-transitioning');
    if (main) main.classList.add('main-content--page-transition');
    clearTransitionClasses(surface);
    surface.classList.add('shell-view--exit-' + direction);

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      global.location.href = url;
    }

    surface.addEventListener('animationend', function onEnd(event) {
      if (!isShellAnimation(event, surface)) return;
      surface.removeEventListener('animationend', onEnd);
      finish();
    });

    global.setTimeout(finish, EXIT_MS + 100);
  }

  function bindShellNavLinks() {
    document.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var anchor = event.target.closest('a[href]');
      if (!isShellPageLink(anchor)) return;

      var href = anchor.href;
      var targetPath = normalizePath(href);
      if (targetPath === currentPath()) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigateWithTransition(href);
    });
  }

  function init() {
    syncShellNav();
    playEnterTransition();
    sessionStorage.setItem(PREV_PATH_KEY, currentPath());
    bindShellNavLinks();
  }

  if (typeof global.onDocumentReady === 'function') {
    global.onDocumentReady(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
