/**
 * Multi-page shell — root tab highlighting + tectonic page transitions.
 *
 * Page transitions are a carousel (Tectonics, Figma 347:8976): dashboards on the left, every
 * deeper level further right.
 *   deeper  → this page's sections leave into a stack off the LEFT edge while the next page's
 *             sections come out of a stack off the RIGHT edge (overlapping)
 *   back    → the mirror
 *   between dashboards → quick fade out, the next page's sections come in from the left
 * The motion itself lives in js/section-build-motion.js (+ js/section-build-boot.js).
 * Flow transitions (sheets, steps) are a separate topic.
 */
(function (global) {
  'use strict';

  var PREV_PATH_KEY = 'uzShellNavPrevPath';
  var ENTER_DIR_KEY = 'uzShellNavEnterDir';
  var EXIT_FADE_MS = 160;   /* = --tectonic-exit-duration */
  var EXIT_MAX_MS = 900;    /* fail-safe: navigate even if an animation never ends */

  /** Root tab screens only; child/detail screens leave all tabs inactive. */
  var ROOT_TAB_BY_SCREEN = {
    overview: 'overview',
    payments: 'payments',
    profile: 'profile',
    'account-details': null,
    'investment-product-details': null,
    'details-of-position': null,
    'all-bookings': null,
    components: 'design',            /* design system subpages keep "Design system" selected */
    'motion-specimens': 'design',
    'character-kit': 'design',
    'design-system': 'design'
  };

  var NAV_DEPTH = {
    'overview.html': 0,
    'payments.html': 0,
    'profile.html': 0,
    'account-details.html': 1,
    'investment-product-details.html': 1,
    'all-bookings-and-payments.html': 2,
    'details-of-position.html': 2,
    'design-system.html': 0,      /* admin: a dashboard of its own (4th tab) */
    'motion-specimens.html': 1,
    'components.html': 1,
    'character-kit.html': 1
  };

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
    /* Strip query and hash first: "all-bookings-and-payments.html?account=x" is still that page */
    var name = (path.split('?')[0].split('#')[0].split('/').pop() || 'overview.html').toLowerCase();
    if (!/\.html$/.test(name)) name = 'overview.html';
    return name;
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
    if (path === 'design-system.html') return 'design';
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
    if (path === 'design-system.html') return 'design';
    return null;
  }

  function getTransitionSurface() {
    return document.querySelector('.view.view--active') || document.querySelector('.main-content__inner');
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

  function directionTo(targetPath) {
    var from = getDepth(currentPath());
    var to = getDepth(targetPath);
    return to > from ? 'forward' : to < from ? 'back' : 'lateral';
  }

  function markViewEntered() {
    var surface = getTransitionSurface();
    if (surface) surface.classList.add('shell-view--entered');
    try {
      global.dispatchEvent(new CustomEvent('uz:shell-view-entered'));
    } catch (err) {
      /* ignore */
    }
  }

  /* The view counts as "entered" once its sections have built up (or straight away). */
  function settleEntry() {
    var root = document.documentElement;
    var building = root.classList.contains('section-build-pending') ||
                   root.classList.contains('section-build-running');
    if (!building) {
      markViewEntered();
      return;
    }
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      markViewEntered();
    }
    global.addEventListener('uz:sections-built', finish, { once: true });
    global.setTimeout(finish, 2500);
  }

  function fadeOut(surface) {
    return new Promise(function (resolve) {
      if (!surface) return resolve();
      surface.classList.add('shell-view--exit-fade');
      surface.addEventListener('animationend', function onEnd(event) {
        if (event.target !== surface) return;
        surface.removeEventListener('animationend', onEnd);
        resolve();
      });
      global.setTimeout(resolve, EXIT_FADE_MS + 80);
    });
  }

  var leaving = false;

  function go(url) {
    var targetPath = normalizePath(url);
    var fromPath = currentPath();
    if (leaving) return;

    var direction = targetPath === fromPath ? null : directionTo(targetPath);
    try {
      sessionStorage.setItem(PREV_PATH_KEY, fromPath);
      if (direction) sessionStorage.setItem(ENTER_DIR_KEY, direction);
      else sessionStorage.removeItem(ENTER_DIR_KEY);
    } catch (err) {
      /* ignore */
    }

    if (!direction || prefersReducedMotion()) {
      global.location.href = url;
      return;
    }

    leaving = true;
    document.body.classList.add('shell-nav-transitioning');

    var exitDone;
    if (direction === 'lateral' || !global.UZSectionBuild) {
      exitDone = fadeOut(getTransitionSurface());
    } else {
      exitDone = global.UZSectionBuild.leave(direction, targetPath);
    }

    var navigated = false;
    function navigate() {
      if (navigated) return;
      navigated = true;
      global.location.href = url;
    }
    exitDone.then(navigate);
    global.setTimeout(navigate, EXIT_MAX_MS);
  }

  /* Coming back via the browser's back/forward cache: the page is still built down — restore it. */
  function onPageShow(event) {
    if (!event.persisted) return;
    leaving = false;
    document.body.classList.remove('shell-nav-transitioning');
    var surface = getTransitionSurface();
    if (surface) surface.classList.remove('shell-view--exit-fade');
    if (global.UZSectionBuild) global.UZSectionBuild.reset();
    try { sessionStorage.setItem(PREV_PATH_KEY, currentPath()); } catch (err) { /* ignore */ }
  }

  function bindShellNavLinks() {
    document.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var anchor = event.target.closest('a[href]');
      if (!isShellPageLink(anchor)) return;

      event.preventDefault();
      if (normalizePath(anchor.href) === currentPath()) return;
      go(anchor.href);
    });
  }

  var SIDEBAR_KEY = 'uzBankSidebar';

  var COLLAPSE_ICON =
    '<svg class="sidebar__collapse-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<use href="#i-chevrons-left" width="24" height="24"/>' +
    '</svg>';

  var THEME_ICONS = {
    light:
      '<svg class="sidebar__theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<use href="#i-sun" width="24" height="24"/>' +
      '</svg>',
    dark:
      '<svg class="sidebar__theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<use href="#i-moon" width="24" height="24"/>' +
      '</svg>'
  };

  function sidebarIsCompressed() {
    return document.documentElement.classList.contains('sidebar-compressed');
  }

  function syncSidebarToggle(button) {
    if (!button) return;
    var compressed = sidebarIsCompressed();
    button.setAttribute('aria-pressed', compressed ? 'true' : 'false');
    button.setAttribute('aria-expanded', compressed ? 'false' : 'true');
    button.setAttribute('aria-label', compressed ? 'Expand sidebar' : 'Collapse sidebar');
    var icon = button.querySelector('use');
    if (icon) icon.setAttribute('href', compressed ? '#i-chevrons-right' : '#i-chevrons-left');
  }

  function setSidebarCompressed(compressed) {
    document.documentElement.classList.toggle('sidebar-compressed', compressed);
    try {
      localStorage.setItem(SIDEBAR_KEY, compressed ? 'compressed' : 'extended');
    } catch (err) {
      /* ignore */
    }
    syncSidebarToggle(document.querySelector('.sidebar__collapse'));
  }

  function wrapThemeLabel(button) {
    if (button.querySelector('.sidebar__theme-label')) return;
    var label = document.createElement('span');
    label.className = 'sidebar__theme-label';
    while (button.firstChild) label.appendChild(button.firstChild);
    button.appendChild(label);
  }

  function initSidebarCollapse() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.sidebar__collapse')) return;

    var logo = sidebar.querySelector('.sidebar__logo');
    var link = logo && logo.querySelector('a');
    if (link && !link.querySelector('.sidebar__logo-mark')) {
      var words = (link.textContent || '').trim().split(/\s+/);
      link.textContent = '';
      link.classList.add('sidebar__logo-link');
      var mark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      mark.setAttribute('class', 'sidebar__logo-mark');
      mark.setAttribute('aria-hidden', 'true');
      mark.setAttribute('focusable', 'false');
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#i-uz-logo');
      mark.appendChild(use);
      link.appendChild(mark);
      if (words.length > 1) {
        var name = document.createElement('span');
        name.className = 'sidebar__logo-name';
        name.textContent = words.slice(1).join(' ');
        link.appendChild(name);
      }
      if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', words.join(' ') || 'UZ Bank');
    }

    if (logo) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'sidebar__collapse';
      button.innerHTML = COLLAPSE_ICON;
      button.addEventListener('click', function () {
        setSidebarCompressed(!sidebarIsCompressed());
      });
      logo.appendChild(button);
      syncSidebarToggle(button);
    }

    sidebar.querySelectorAll('.sidebar__nav-item').forEach(function (item) {
      var label = item.querySelector('span');
      if (label && !item.getAttribute('title')) item.setAttribute('title', label.textContent.trim());
    });

    sidebar.querySelectorAll('[data-set-theme]').forEach(function (themeButton) {
      var mode = themeButton.getAttribute('data-set-theme');
      wrapThemeLabel(themeButton);
      if (THEME_ICONS[mode] && !themeButton.querySelector('.sidebar__theme-icon')) {
        themeButton.insertAdjacentHTML('afterbegin', THEME_ICONS[mode]);
      }
    });

    var logoutLabel = sidebar.querySelector('.sidebar__logout-btn > span');
    var logout = sidebar.querySelector('.sidebar__logout-btn');
    if (logout && logoutLabel && !logout.getAttribute('aria-label')) {
      logout.setAttribute('aria-label', logoutLabel.textContent.trim());
    }
  }

  function init() {
    syncShellNav();
    initSidebarCollapse();
    settleEntry();
    try { sessionStorage.setItem(PREV_PATH_KEY, currentPath()); } catch (err) { /* ignore */ }
    bindShellNavLinks();
    global.addEventListener('pageshow', onPageShow);
  }

  /* For script-driven navigation (e.g. "Show all bookings"): UZShellNav.go(url) */
  global.UZShellNav = { go: go };

  if (typeof global.onDocumentReady === 'function') {
    global.onDocumentReady(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
