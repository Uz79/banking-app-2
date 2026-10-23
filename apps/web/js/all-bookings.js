(function () {
  'use strict';

  var MERGE_LEAD_PX = 14;
  var MERGE_HYSTERESIS_PX = 10;
  var MERGE_OUT_MS = 100;

  var ACCOUNTS = {
    household: {
      title: 'Household',
      iban: 'CH35 0900 0000 2470 2920 1',
      icon: 'i-home',
      currency: 'CHF',
      balance: "10'000.00",
    },
    savings: {
      title: 'Savings account',
      iban: 'CH35 0900 0000 2470 2920 2',
      icon: 'i-anchor',
      currency: 'CHF',
      balance: "25'000.00",
    },
    deposit: {
      title: 'Custody account',
      iban: '123,456.78',
      icon: 'i-life-buoy',
      currency: 'CHF',
      balance: "20'000.00",
    },
  };

  /* Household and Savings show the running balance from the shared state; the table above is the fallback. */
  function balanceFor(key) {
    var pay = window.UZBankPayState;
    if (pay && typeof pay.getState === 'function') {
      var amount = (pay.getState().accountBalances || {})[key];
      if (amount != null) return pay.formatMoney(amount);
    }
    return ACCOUNTS[key].balance;
  }

  function accountKeyFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var key = params.get('account') || 'savings';
    return ACCOUNTS[key] ? key : 'savings';
  }

  function bindSegmented(root, attr) {
    root.querySelectorAll('[' + attr + ']').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('[role="tablist"], .segmented');
        if (!group) return;
        group.querySelectorAll('.segmented__option').forEach(function (opt) {
          opt.classList.remove('segmented__option--active');
          opt.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('segmented__option--active');
        btn.setAttribute('aria-selected', 'true');
      });
    });
  }

  function setActiveMonth(root, monthKey) {
    root.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
      var isActive = chip.getAttribute('data-bookings-month') === monthKey;
      chip.classList.toggle('all-bookings__month-chip--active', isActive);
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function getStickyOffset(root) {
    var navHeader = root.querySelector('[data-all-bookings-sticky-header]');
    if (!navHeader) return 0;
    return navHeader.offsetHeight;
  }

  function scrollToMonth(root, monthKey) {
    var anchor = root.querySelector('[data-bookings-month-start="' + monthKey + '"]');
    var scrollEl = document.querySelector('.main-content');
    if (!anchor || !scrollEl) return;

    var stickyOffset = getStickyOffset(root);
    var scrollRect = scrollEl.getBoundingClientRect();
    var anchorRect = anchor.getBoundingClientRect();
    var targetTop =
      scrollEl.scrollTop + anchorRect.top - scrollRect.top - stickyOffset;

    scrollEl.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  }

  function bindMonthChips(root) {
    root.querySelectorAll('[data-bookings-month]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('tabindex') === '-1') return;
        var monthKey = btn.getAttribute('data-bookings-month');
        setActiveMonth(root, monthKey);
        scrollToMonth(root, monthKey);
      });
    });
  }

  function applyAccount(root, key) {
    var data = ACCOUNTS[key];
    if (!data) return;
    var summary = root.querySelector('[data-all-bookings-summary]');
    if (!summary) return;
    var title = summary.querySelector('.list-item__title');
    var subtitle = summary.querySelector('.list-item__subtitle');
    var currency = summary.querySelector('.list-item__currency');
    var value = summary.querySelector('.list-item__value');
    var icon = summary.querySelector('.list-item__icon use');
    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.iban;
    if (currency) currency.textContent = data.currency;
    if (value) value.textContent = balanceFor(key);
    if (icon) icon.setAttribute('href', '#' + data.icon);
    summary.setAttribute('aria-label', data.title);
  }

  function syncStickyHeights(root) {
    var navHeader = root.querySelector('[data-all-bookings-sticky-header]');
    var monthBar = root.querySelector('[data-all-bookings-month-bar]');
    var monthDock = root.querySelector('[data-all-bookings-month-dock]');
    if (!navHeader) return;

    var navStyle = window.getComputedStyle(navHeader);
    var navTop = parseFloat(navStyle.top) || 0;
    var navOnly = navHeader.querySelector('.view__nav');
    var navHeight = navOnly ? navOnly.offsetHeight : navHeader.offsetHeight;
    var headerHeight = navHeader.offsetHeight;
    var monthHeight = monthBar ? monthBar.offsetHeight : 0;

    document.documentElement.style.setProperty('--all-bookings-nav-height', navHeight + 'px');
    document.documentElement.style.setProperty(
      '--all-bookings-month-dock-height',
      monthDock ? monthDock.scrollHeight + 'px' : '0px'
    );
    document.documentElement.style.setProperty(
      '--all-bookings-sticky-header-height',
      headerHeight + 'px'
    );
    document.documentElement.style.setProperty(
      '--all-bookings-month-bar-height',
      monthHeight + 'px'
    );
  }

  function bindStickyHeights(root) {
    var navHeader = root.querySelector('[data-all-bookings-sticky-header]');
    var monthBar = root.querySelector('[data-all-bookings-month-bar]');
    var monthDock = root.querySelector('[data-all-bookings-month-dock]');
    if (!navHeader) return;

    function update() {
      syncStickyHeights(root);
    }

    window.addEventListener('resize', update);
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(update);
      ro.observe(navHeader);
      if (monthBar) ro.observe(monthBar);
      if (monthDock) ro.observe(monthDock);
    }
    update();
  }

  function syncDockA11y(root, merged) {
    var flowBar = root.querySelector('[data-all-bookings-month-bar]');
    var dock = root.querySelector('[data-all-bookings-month-dock]');
    var dockBar = dock ? dock.querySelector('.all-bookings__month-bar--docked') : null;
    if (!flowBar || !dock || !dockBar) return;

    dock.setAttribute('aria-hidden', merged ? 'false' : 'true');
    flowBar.setAttribute('aria-hidden', merged ? 'true' : 'false');

    flowBar.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
      chip.tabIndex = merged ? -1 : 0;
    });
    dockBar.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
      chip.tabIndex = merged ? 0 : -1;
    });
  }

  function bindMonthMerge(root) {
    var scrollEl = document.querySelector('.main-content');
    var navHeader = root.querySelector('[data-all-bookings-sticky-header]');
    var monthBar = root.querySelector('[data-all-bookings-month-bar]');
    if (!scrollEl || !navHeader || !monthBar) return;

    var merged = false;
    var merging = false;
    var mergeTimer = null;

    function mergeGap() {
      var navRect = navHeader.getBoundingClientRect();
      var monthRect = monthBar.getBoundingClientRect();
      return monthRect.top - navRect.bottom;
    }

    function shouldMerge() {
      if (scrollEl.scrollTop <= 1) return false;
      return mergeGap() <= MERGE_LEAD_PX;
    }

    function setMerged(next) {
      if (merged === next) return;
      merged = next;
      document.body.classList.toggle('all-bookings--month-merged', next);
      document.body.classList.toggle('all-bookings--header-stuck', next);
      syncDockA11y(root, next);
      requestAnimationFrame(function () {
        syncStickyHeights(root);
      });
    }

    function beginMerge() {
      if (merged || merging) return;
      merging = true;
      document.body.classList.add('all-bookings--month-merging');
      clearTimeout(mergeTimer);
      mergeTimer = setTimeout(function () {
        merging = false;
        document.body.classList.remove('all-bookings--month-merging');
        setMerged(true);
      }, MERGE_OUT_MS);
    }

    function cancelMerge() {
      clearTimeout(mergeTimer);
      merging = false;
      document.body.classList.remove('all-bookings--month-merging');
      setMerged(false);
    }

    function shouldUnmerge() {
      return mergeGap() > MERGE_LEAD_PX + MERGE_HYSTERESIS_PX;
    }

    function onScroll() {
      if (shouldMerge()) {
        if (!merged && !merging) beginMerge();
      } else if (shouldUnmerge() && (merged || merging)) {
        cancelMerge();
      }
    }

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* Search (D5 to D10): an inline bar under the toolbar that filters the static rows by name or amount. */
  function bindSearch(root) {
    var toggle = root.querySelector('[data-all-bookings-search-toggle]');
    var bar = root.querySelector('[data-all-bookings-search]');
    var input = root.querySelector('[data-all-bookings-search-input]');
    var clear = root.querySelector('[data-all-bookings-search-clear]');
    var empty = root.querySelector('[data-all-bookings-search-empty]');
    var status = root.querySelector('[data-all-bookings-search-status]');
    var list = root.querySelector('.all-bookings__list');
    var page = root.querySelector('.all-bookings');
    if (!toggle || !bar || !input || !list) return;

    var groups = Array.prototype.slice.call(list.querySelectorAll('.booking-group'));
    var rows = Array.prototype.slice.call(list.querySelectorAll('.booking-row')).map(function (row) {
      var name = (row.querySelector('.booking-row__name') || {}).textContent || '';
      var amount = (row.querySelector('.booking-row__value') || {}).textContent || '';
      return { el: row, text: (name + ' ' + amount + ' ' + amount.replace(/'/g, '')).toLowerCase() };
    });

    function reducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function setHidden(el, hide) {
      el.classList.toggle('is-search-hidden', hide);
    }

    function filter() {
      var query = input.value.trim().toLowerCase();
      var matches = 0;
      rows.forEach(function (r) {
        var show = !query || r.text.indexOf(query) !== -1;
        setHidden(r.el, !show);
        if (show) matches += 1;
      });
      groups.forEach(function (g) {
        var any = !query || g.querySelector('.booking-row:not(.is-search-hidden)');
        setHidden(g, !any);
        /* The divider after a hidden group goes with it. */
        var next = g.nextElementSibling;
        if (next && next.classList.contains('divider')) setHidden(next, !any);
      });
      /* No divider under the last visible group. */
      if (query) {
        var shown = groups.filter(function (g) { return !g.classList.contains('is-search-hidden'); });
        var last = shown[shown.length - 1];
        var tail = last && last.nextElementSibling;
        if (tail && tail.classList.contains('divider')) setHidden(tail, true);
      }
      page.classList.toggle('all-bookings--searching', !!query);
      root.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
        if (query) chip.setAttribute('aria-disabled', 'true');
        else chip.removeAttribute('aria-disabled');
      });
      clear.classList.toggle('recipient-search__clear--hidden', !input.value);
      if (empty) {
        empty.hidden = !(query && matches === 0);
        empty.textContent = query ? 'No bookings match \u201c' + input.value.trim() + '\u201d' : 'No bookings match';
      }
      if (status) {
        status.textContent = query ? (matches === 0 ? 'No bookings match' : matches + (matches === 1 ? ' booking' : ' bookings')) : '';
      }
    }

    function setOpen(open, focusTarget) {
      bar.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) {
        input.value = '';
        filter();
        if (focusTarget !== false) toggle.focus();
      } else {
        /* Focus after the bar is visible; at once with reduced motion. */
        window.setTimeout(function () { input.focus(); }, reducedMotion() ? 0 : 30);
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!bar.classList.contains('is-open'));
    });
    input.addEventListener('input', filter);
    clear.addEventListener('click', function () {
      input.value = '';
      filter();
      input.focus();
    });
    bar.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bar.classList.contains('is-open')) {
        e.preventDefault();
        setOpen(false);
      }
    });
    root.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        if (chip.getAttribute('aria-disabled') === 'true') e.stopImmediatePropagation();
      }, true);
    });
  }

  function init() {
    var root = document.querySelector('[data-view="all-bookings"]');
    if (!root) return;

    var key = accountKeyFromQuery();
    applyAccount(root, key);
    document.addEventListener('uzbank:state-changed', function () { applyAccount(root, key); });
    window.__UZ_ACTIVE_ACCOUNT__ = key;
    bindSegmented(root, 'data-bookings-status');
    bindMonthChips(root);
    bindSearch(root);
    bindStickyHeights(root);
    bindMonthMerge(root);

    if (window.UZBankScrollEdgeChrome) {
      window.UZBankScrollEdgeChrome.bind(root, {
        nav: '[data-all-bookings-sticky-header]',
        getScrollEl: function () {
          return document.querySelector('.main-content');
        },
        isStickyAfterAtEdge: function () {
          return document.body.classList.contains('all-bookings--month-merged');
        },
        onStickyAfterChange: function (stuck) {
          if (!document.body.classList.contains('all-bookings--month-merged')) {
            document.body.classList.toggle('all-bookings--header-stuck', stuck);
          }
        },
      });
    }
  }

  if (window.onDocumentReady) {
    window.onDocumentReady(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
