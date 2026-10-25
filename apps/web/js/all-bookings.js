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

  /* Tabs (D5, D6): one list per status; the month bar and dock belong to Executed only. */
  function bindTabs(root, search) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-bookings-status]'));
    var panels = {};
    root.querySelectorAll('[data-all-bookings-panel]').forEach(function (p) {
      panels[p.getAttribute('data-all-bookings-panel')] = p;
    });

    function select(status) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-bookings-status') === status;
        tab.classList.toggle('segmented__option--active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      Object.keys(panels).forEach(function (key) {
        panels[key].hidden = key !== status;
      });
      document.body.classList.toggle('all-bookings--no-months', status !== 'executed');
      if (status !== 'executed' && root.__cancelMerge) root.__cancelMerge();
      var scrollEl = document.querySelector('.main-content');
      if (scrollEl) scrollEl.scrollTo({ top: 0 });
      if (search) {
        search.index(panels[status]);
        search.filter();
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        select(tab.getAttribute('data-bookings-status'));
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
    var anchor = monthAnchors[monthKey] || root.querySelector('[data-bookings-month-start="' + monthKey + '"]');
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
        if (btn.getAttribute('tabindex') === '-1' || btn.getAttribute('aria-disabled') === 'true') return;
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
      if (document.body.classList.contains('all-bookings--no-months')) return;
      if (shouldMerge()) {
        if (!merged && !merging) beginMerge();
      } else if (shouldUnmerge() && (merged || merging)) {
        cancelMerge();
      }
    }

    root.__cancelMerge = cancelMerge;
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* Search (D1 to D4): an always-visible field that filters the active tab's rows by name or amount.
     The month chips follow the filtered list: a month with no match is dimmed, the others jump to their first visible group. */
  var monthAnchors = {};

  function bindSearch(root) {
    var bar = root.querySelector('[data-all-bookings-search]');
    var input = root.querySelector('[data-all-bookings-search-input]');
    var clear = root.querySelector('[data-all-bookings-search-clear]');
    var empty = root.querySelector('[data-all-bookings-search-empty]');
    var status = root.querySelector('[data-all-bookings-search-status]');
    if (!bar || !input) return null;

    var panel = null;
    var groups = [];
    var rows = [];

    function setHidden(el, hide) {
      el.classList.toggle('is-search-hidden', hide);
    }

    /* Read the rows of a panel (again after the list is rendered anew). */
    function index(nextPanel) {
      if (nextPanel) panel = nextPanel;
      groups = [];
      rows = [];
      if (!panel) return;
      var month = null;
      Array.prototype.forEach.call(panel.querySelectorAll('.booking-group'), function (g) {
        month = g.getAttribute('data-bookings-month-start') || month;
        groups.push({ el: g, month: month });
      });
      Array.prototype.forEach.call(panel.querySelectorAll('.booking-row'), function (row) {
        var name = (row.querySelector('.booking-row__name') || {}).textContent || '';
        var amount = (row.querySelector('.booking-row__value') || {}).textContent || '';
        rows.push({ el: row, text: (name + ' ' + amount + ' ' + amount.replace(/'/g, '')).toLowerCase() });
      });
    }

    function filter() {
      var query = input.value.trim().toLowerCase();
      var matches = 0;
      rows.forEach(function (r) {
        var show = !query || r.text.indexOf(query) !== -1;
        setHidden(r.el, !show);
        if (show) matches += 1;
      });
      var shown = [];
      var seen = {};
      monthAnchors = {};
      groups.forEach(function (g) {
        var any = !query || g.el.querySelector('.booking-row:not(.is-search-hidden)');
        setHidden(g.el, !any);
        /* The divider after a hidden group goes with it. */
        var next = g.el.nextElementSibling;
        if (next && next.classList.contains('divider')) setHidden(next, !any);
        if (any) {
          shown.push(g.el);
          if (g.month && !seen[g.month]) {
            seen[g.month] = true;
            monthAnchors[g.month] = g.el;
          }
        }
      });
      /* No divider under the last visible group. */
      if (query) {
        var last = shown[shown.length - 1];
        var tail = last && last.nextElementSibling;
        if (tail && tail.classList.contains('divider')) setHidden(tail, true);
      }
      root.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
        var key = chip.getAttribute('data-bookings-month');
        var none = !!query && !seen[key];
        chip.classList.toggle('is-search-empty', none);
        if (none) chip.setAttribute('aria-disabled', 'true');
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

    input.addEventListener('input', filter);
    clear.addEventListener('click', function () {
      input.value = '';
      filter();
      input.focus();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && input.value) {
        e.preventDefault();
        input.value = '';
        filter();
      }
    });

    index(root.querySelector('.all-bookings__list'));
    return { index: index, filter: filter };
  }

  function init() {
    var root = document.querySelector('[data-view="all-bookings"]');
    if (!root) return;

    var key = accountKeyFromQuery();
    applyAccount(root, key);
    document.addEventListener('uzbank:state-changed', function () { applyAccount(root, key); });
    window.__UZ_ACTIVE_ACCOUNT__ = key;
    bindMonthChips(root);
    bindTabs(root, bindSearch(root));
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
