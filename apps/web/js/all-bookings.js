(function () {
  'use strict';

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
      title: 'Deposit',
      iban: '123,456.78',
      icon: 'i-life-buoy',
      currency: 'CHF',
      balance: "20'000.00",
    },
  };

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

  function scrollToMonth(root, monthKey) {
    var anchor = root.querySelector('[data-bookings-month-start="' + monthKey + '"]');
    var scrollEl = document.querySelector('.main-content');
    if (!anchor || !scrollEl) return;

    var stickyHeader = root.querySelector('[data-all-bookings-sticky-header]');
    var stickyOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height : 0;

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
        var bar = btn.closest('.all-bookings__month-bar');
        if (!bar) return;
        bar.querySelectorAll('[data-bookings-month]').forEach(function (chip) {
          chip.classList.remove('all-bookings__month-chip--active');
          chip.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('all-bookings__month-chip--active');
        btn.setAttribute('aria-pressed', 'true');
        scrollToMonth(root, btn.getAttribute('data-bookings-month'));
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
    if (value) value.textContent = data.balance;
    if (icon) icon.setAttribute('href', '#' + data.icon);
    summary.setAttribute('aria-label', data.title);
  }

  function syncStickyHeaderHeight(root) {
    var header = root.querySelector('[data-all-bookings-sticky-header]');
    if (!header) return;
    document.documentElement.style.setProperty(
      '--all-bookings-sticky-header-height',
      header.offsetHeight + 'px'
    );
  }

  function bindStickyHeaderHeight(root) {
    var header = root.querySelector('[data-all-bookings-sticky-header]');
    if (!header) return;

    function update() {
      syncStickyHeaderHeight(root);
    }

    window.addEventListener('resize', update);
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(update);
      ro.observe(header);
    }
    update();
  }

  function init() {
    var root = document.querySelector('[data-view="all-bookings"]');
    if (!root) return;

    var key = accountKeyFromQuery();
    applyAccount(root, key);
    window.__UZ_ACTIVE_ACCOUNT__ = key;
    bindSegmented(root, 'data-bookings-status');
    bindMonthChips(root);
    bindStickyHeaderHeight(root);

    var scrollEdgeChrome = null;
    if (window.UZBankScrollEdgeChrome) {
      scrollEdgeChrome = window.UZBankScrollEdgeChrome.bind(root, {
        nav: '[data-all-bookings-sticky-header]',
        getScrollEl: function () {
          return document.querySelector('.main-content');
        },
        stickyAfter: '[data-all-bookings-sticky-header]',
        isStickyAfterAtEdge: function () {
          var scrollEl = document.querySelector('.main-content');
          var intro = root.querySelector('.all-bookings__intro');
          var header = root.querySelector('[data-all-bookings-sticky-header]');
          if (!scrollEl || !intro || !header || scrollEl.scrollTop <= 1) return false;
          return intro.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom + 1;
        },
        onStickyAfterChange: function (stuck) {
          document.body.classList.toggle('all-bookings--header-stuck', stuck);
          syncStickyHeaderHeight(root);
          if (scrollEdgeChrome) {
            requestAnimationFrame(function () {
              scrollEdgeChrome.update();
            });
          }
        },
      });
    }

    if (scrollEdgeChrome) {
      var header = root.querySelector('[data-all-bookings-sticky-header]');
      if (header && typeof ResizeObserver !== 'undefined') {
        var chromeRo = new ResizeObserver(function () {
          syncStickyHeaderHeight(root);
          scrollEdgeChrome.update();
        });
        chromeRo.observe(header);
      }
    }
  }

  if (window.onDocumentReady) {
    window.onDocumentReady(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
