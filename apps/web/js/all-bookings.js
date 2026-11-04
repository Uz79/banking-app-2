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
      /* Back on Executed at the top: its first month is active again, scroll event or not (D6) */
      if (status === 'executed' && root.__syncMonthSpy) root.__syncMonthSpy();
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

  /* Space between the docked header and a month's separator after a chip's scroll. */
  var MONTH_SCROLL_GAP_PX = 8;
  /* A chip's own scroll is running: the scroll doesn't move the active chip meanwhile (D6). */
  var chipScrolling = false;
  /* Where a chip's scroll ended; the scroll moves the active chip again once the list leaves it. */
  var chipHoldTop = null;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function scrollToMonth(root, monthKey) {
    var anchor = monthAnchors[monthKey] || root.querySelector('[data-bookings-month-start="' + monthKey + '"]');
    var scrollEl = document.querySelector('.main-content');
    if (!anchor || !scrollEl) return;

    /* Before the chips dock, the header is shorter by the dock; the pass at the end corrects the rest. */
    var navHeader = root.querySelector('[data-all-bookings-sticky-header]');
    var dockBar = root.querySelector('.all-bookings__month-bar--docked');
    var merged = document.body.classList.contains('all-bookings--month-merged');
    var stickyOffset = getStickyOffset(root) + (!merged && dockBar ? dockBar.scrollHeight : 0);
    var scrollRect = scrollEl.getBoundingClientRect();
    var anchorRect = anchor.getBoundingClientRect();
    var targetTop =
      scrollEl.scrollTop + anchorRect.top - scrollRect.top - stickyOffset - MONTH_SCROLL_GAP_PX;

    chipScrolling = true;
    var done = false;
    var quiet = null;
    /* Settles once the scroll has been still for longer than the chips take to dock (MERGE_OUT_MS, then the
       0.2s grow): the growing header shifts the list after an instant scroll, so scrollend comes too early. */
    function wait() {
      clearTimeout(quiet);
      quiet = window.setTimeout(settle, 350);
    }
    function settle() {
      if (done) return;
      done = true;
      clearTimeout(quiet);
      scrollEl.removeEventListener('scroll', wait);
      /* Measure against the header as it now sits (docked, with its own top margin) */
      if (navHeader) {
        var delta = anchor.getBoundingClientRect().top - navHeader.getBoundingClientRect().bottom - MONTH_SCROLL_GAP_PX;
        if (Math.abs(delta) > 1) scrollEl.scrollTo({ top: Math.max(0, scrollEl.scrollTop + delta), behavior: 'instant' });
      }
      requestAnimationFrame(function () {
        chipHoldTop = scrollEl.scrollTop;
        chipScrolling = false;
      });
    }
    scrollEl.addEventListener('scroll', wait, { passive: true });
    wait();

    scrollEl.scrollTo({
      top: Math.max(0, targetTop),
      /* Instant under reduced motion (D10) */
      behavior: reducedMotion() ? 'auto' : 'smooth',
    });
  }

  /* The active chip follows the scroll on Executed (D6): the last month whose separator has reached the header.
     The last months may not be able to rise that far before the list ends, so over that last stretch of scrolling
     the line slides down by as much, and the last month is active at the end of the list. */
  function bindMonthSpy(root) {
    var scrollEl = document.querySelector('.main-content');
    var navHeader = root.querySelector('[data-all-bookings-sticky-header]');
    var panel = root.querySelector('[data-all-bookings-panel="executed"]');
    if (!scrollEl || !navHeader || !panel) return;
    var queued = false;

    function update() {
      queued = false;
      if (chipScrolling || panel.hidden) return;
      /* After a chip's scroll its month holds until the list is scrolled again */
      if (chipHoldTop !== null) {
        if (Math.abs(scrollEl.scrollTop - chipHoldTop) < 2) return;
        chipHoldTop = null;
      }
      var seps = Array.prototype.filter.call(panel.querySelectorAll('[data-month-separator]'), function (s) {
        return !s.classList.contains('is-search-hidden');
      });
      if (!seps.length) return;
      var base = navHeader.getBoundingClientRect().bottom + MONTH_SCROLL_GAP_PX + 4;
      var remaining = scrollEl.scrollHeight - scrollEl.clientHeight - scrollEl.scrollTop;
      /* A pixel short of the end (zoom, a growing dock) counts as the end */
      if (remaining <= 1) remaining = 0;
      /* How far below the line the last separator still is when the list ends */
      var overflow = Math.max(0, seps[seps.length - 1].getBoundingClientRect().top - remaining - base);
      var line = base + (overflow ? overflow * Math.min(1, Math.max(0, 1 - remaining / overflow)) : 0);
      var key = seps[0].getAttribute('data-month-key');
      if (scrollEl.scrollTop > 1) {
        seps.forEach(function (s) {
          if (s.getBoundingClientRect().top <= line) key = s.getAttribute('data-month-key');
        });
      }
      var current = root.querySelector('.all-bookings__month-chip--active');
      if (!current || current.getAttribute('data-bookings-month') !== key) setActiveMonth(root, key);
    }

    scrollEl.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }, { passive: true });
    root.__syncMonthSpy = function () {
      chipHoldTop = null;
      update();
    };
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

    /* Focus on a chip in the bar being hidden moves to the same month's chip in the one being shown (D8) */
    var leaving = merged ? flowBar : dockBar;
    var showing = merged ? dockBar : flowBar;
    var focused = document.activeElement;
    var focusKey = focused && leaving.contains(focused) ? focused.getAttribute('data-bookings-month') : null;

    dock.setAttribute('aria-hidden', merged ? 'false' : 'true');
    flowBar.setAttribute('aria-hidden', merged ? 'true' : 'false');

    flowBar.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
      chip.tabIndex = merged ? -1 : 0;
    });
    dockBar.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
      chip.tabIndex = merged ? 0 : -1;
    });

    if (focusKey) {
      var target = showing.querySelector('[data-bookings-month="' + focusKey + '"]');
      if (target) target.focus({ preventScroll: true });
    }
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
    var separators = {};

    function setHidden(el, hide) {
      el.classList.toggle('is-search-hidden', hide);
    }

    /* Read the rows of a panel (again after the list is rendered anew). */
    function index(nextPanel) {
      if (nextPanel) panel = nextPanel;
      groups = [];
      rows = [];
      separators = {};
      if (!panel) return;
      Array.prototype.forEach.call(panel.querySelectorAll('.booking-group'), function (g) {
        groups.push({ el: g, month: g.getAttribute('data-month-key') });
      });
      Array.prototype.forEach.call(panel.querySelectorAll('[data-month-separator]'), function (s) {
        separators[s.getAttribute('data-month-key')] = s;
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
            /* A chip scrolls to its month's separator (D5) */
            monthAnchors[g.month] = separators[g.month] || g.el;
          }
        }
      });
      /* A month with no match loses its separator (D7) */
      Object.keys(separators).forEach(function (key) {
        var sep = separators[key];
        setHidden(sep, !!query && !seen[key]);
        /* ...and no divider stands right above a separator once the groups between are hidden */
        if (!query || !seen[key]) return;
        var prev = sep.previousElementSibling;
        while (prev && prev.classList.contains('is-search-hidden')) prev = prev.previousElementSibling;
        if (prev && prev.classList.contains('divider')) setHidden(prev, true);
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

  /* In-app bookings (D10): the payments, transfers and trades of the viewed account, from the shared state.
     Executed ones go into the Today group (newest first), pending and recurring ones into their tab under a date label. */
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function buildRow(pay, b) {
    var row = document.createElement('div');
    row.className = 'booking-row';
    row.setAttribute('data-source', 'state');
    row.setAttribute('data-booking-id', b.id);
    row.setAttribute('data-status', b.status || 'executed');
    var sign = b.direction === 'in' ? '+' : '-';
    row.innerHTML =
      '<svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#' + escapeHtml(b.icon || 'i-corner-up-right') + '"/></svg>' +
      '<span class="booking-row__name">' + escapeHtml(b.recipientName) + '</span>' +
      '<span class="booking-row__amount">' +
        '<span class="booking-row__currency">' + escapeHtml(b.currency) + '</span>' +
        '<span class="booking-row__value">' + sign + pay.formatMoney(b.amount) + '</span>' +
      '</span>';
    return row;
  }

  function dateSortKey(label) {
    var m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(label || '');
    return m ? m[3] + m[2] + m[1] : '';
  }

  /* The yyyymmdd of a Pending or Recurring group, read from its label ("Execute on 03.11.2026"). */
  function groupDateKey(group) {
    var label = group.querySelector('.booking-group__label');
    var m = /(\d{2})\.(\d{2})\.(\d{4})/.exec(label ? label.textContent : '');
    return m ? m[3] + m[2] + m[1] : '';
  }

  /* Month separators (roadmap 24, D1 to D4): an h2 before each month's first group, in every tab. Executed groups
     take their month from data-bookings-month-start, carried down; Pending and Recurring ones from their date.
     The divider before a separator is hidden (is-month-break); the year shows when a tab crosses one. */
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function renderMonthSeparators(root) {
    root.querySelectorAll('[data-all-bookings-panel]').forEach(function (panel) {
      panel.querySelectorAll('[data-month-separator]').forEach(function (n) { n.remove(); });
      panel.querySelectorAll('.is-month-break').forEach(function (n) { n.classList.remove('is-month-break'); });
      var executed = panel.getAttribute('data-all-bookings-panel') === 'executed';
      var month = null;
      var starts = [];
      panel.querySelectorAll('.booking-group').forEach(function (g) {
        var key = executed ? g.getAttribute('data-bookings-month-start') || month : groupDateKey(g).slice(0, 6).replace(/^(\d{4})(\d{2})$/, '$1-$2');
        if (!key) return;
        g.setAttribute('data-month-key', key);
        if (key !== month) starts.push(g);
        month = key;
      });
      var years = {};
      starts.forEach(function (g) { years[g.getAttribute('data-month-key').slice(0, 4)] = true; });
      var crossesYear = Object.keys(years).length > 1;
      starts.forEach(function (g) {
        var key = g.getAttribute('data-month-key');
        var sep = document.createElement('h2');
        sep.className = 'all-bookings__month';
        sep.setAttribute('data-month-separator', '');
        sep.setAttribute('data-month-key', key);
        sep.textContent = MONTH_NAMES[parseInt(key.slice(5, 7), 10) - 1] + (crossesYear ? ' ' + key.slice(0, 4) : '');
        var prev = g.previousElementSibling;
        if (prev && prev.classList.contains('divider')) prev.classList.add('is-month-break');
        g.parentNode.insertBefore(sep, g);
      });
    });
  }

  function renderBookings(root, accountKey) {
    var pay = window.UZBankPayState;
    if (!pay || typeof pay.getState !== 'function') return;
    root.querySelectorAll('[data-source="state"]').forEach(function (n) { n.remove(); });

    var mine = (pay.getState().bookings || []).filter(function (b) {
      return (b.accountKey || 'household') === accountKey;
    });

    var today = root.querySelector('[data-all-bookings-panel="executed"] .booking-group[data-day="today"]');
    if (today) {
      var header = today.querySelector('.booking-group__header');
      var executed = mine.filter(function (b) { return (b.status || 'executed') === 'executed'; });
      var after = header;
      for (var i = executed.length - 1; i >= 0; i--) {
        var row = buildRow(pay, executed[i]);
        after.parentNode.insertBefore(row, after.nextSibling);
        after = row;
      }
      /* The Today header follows the bookings: its static figure plus what moved today. */
      var value = today.querySelector('.booking-group__balance-value');
      if (value) {
        if (!value.hasAttribute('data-base')) value.setAttribute('data-base', value.textContent.replace(/'/g, ''));
        /* Plus what the bookings dropped by the limit had moved (roadmap 14 D10). */
        var carried = (pay.getState().carried || {})[accountKey] || 0;
        var net = executed.reduce(function (sum, b) { return sum + (b.direction === 'in' ? b.amount : -b.amount); }, carried);
        value.textContent = pay.formatMoney(Math.round((parseFloat(value.getAttribute('data-base')) + net) * 100) / 100);
      }
    }

    [['pending', 'Execute on '], ['recurring', 'Next on ']].forEach(function (def) {
      var panel = root.querySelector('[data-all-bookings-panel="' + def[0] + '"]');
      if (!panel) return;
      var list = mine.filter(function (b) { return b.status === def[0]; });
      var dates = [];
      list.forEach(function (b) { if (dates.indexOf(b.executeOn) === -1) dates.push(b.executeOn); });
      dates.sort(function (a, b) { return dateSortKey(a) < dateSortKey(b) ? -1 : 1; });
      dates.forEach(function (date) {
        /* In date order among the static groups (roadmap 24, D12) */
        var anchor = null;
        Array.prototype.some.call(panel.querySelectorAll('.booking-group'), function (g) {
          if (groupDateKey(g) > dateSortKey(date)) { anchor = g; return true; }
          return false;
        });
        var group = document.createElement('div');
        group.className = 'booking-group';
        group.setAttribute('data-source', 'state');
        group.innerHTML = '<header class="booking-group__header"><span class="booking-group__label">' + escapeHtml(def[1] + (date || '')) + '</span></header>';
        list.filter(function (b) { return b.executeOn === date; }).reverse().forEach(function (b) {
          group.appendChild(buildRow(pay, b));
        });
        var divider = document.createElement('div');
        divider.className = 'divider';
        divider.setAttribute('data-source', 'state');
        if (anchor) {
          panel.insertBefore(group, anchor);
          panel.insertBefore(divider, anchor);
        } else {
          /* Last in the list: the divider goes above it, as the last group has none below */
          if (panel.querySelector('.booking-group')) panel.appendChild(divider);
          panel.appendChild(group);
        }
      });
    });
  }

  function init() {
    var root = document.querySelector('[data-view="all-bookings"]');
    if (!root) return;

    var key = accountKeyFromQuery();
    applyAccount(root, key);
    document.addEventListener('uzbank:state-changed', function () { applyAccount(root, key); });
    window.__UZ_ACTIVE_ACCOUNT__ = key;
    bindMonthChips(root);
    var search = bindSearch(root);
    bindTabs(root, search);
    function refreshBookings() {
      renderBookings(root, key);
      renderMonthSeparators(root);
      if (search) {
        search.index();
        search.filter();
      }
    }
    refreshBookings();
    document.addEventListener('uzbank:state-changed', refreshBookings);
    bindStickyHeights(root);
    bindMonthMerge(root);
    bindMonthSpy(root);

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
