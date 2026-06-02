/**
 * E-Banking WebApp 11 — DOM renderer for payment state
 *
 * Reads from window.UZBankPayState.getState() and updates every place in
 * the DOM that displays state-driven values:
 *
 *   • Household balance — overview product-item, account-details carousel,
 *     every .debit-account__amount inside the payment modal
 *   • Sum-of-all-accounts on overview ("Accounts & investment" total)
 *   • Bookings list — injects executed payments into the "Today" group
 *     on account-details (newest at top, above static mock rows)
 *
 * Runs on DOMContentLoaded (initial paint) and on every
 * `uzbank:state-changed` event so navigating between pages or finishing
 * a new payment refreshes immediately. Each render fully reconciles the
 * DOM (clears its own injected rows then re-renders) so it's idempotent.
 *
 * Conventions:
 *   - Dynamic rows carry data-source="state" so they can be located + removed
   *   - Static mock rows ([data-mock-booking="static"]) stay in HTML; only
   *     day headers and [data-source="state"] rows are updated
 */
(function () {
  'use strict';

  if (!window.UZBankPayState) return;
  var fmt = window.UZBankPayState.formatMoney;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Household balance — appears in 4-5 places per page ─────────── */

  function renderHouseholdBalance(state) {
    var formatted = fmt(state.household);

    // overview.html: <a class="product-item" data-account="household">…<span class="product-item__value">10'000.00</span></a>
    document.querySelectorAll('[data-account="household"] .product-item__value').forEach(function (el) {
      el.textContent = formatted;
    });

    // account-details.html: first carousel slide is Household
    var firstSlide = document.querySelector('.carousel__slides .carousel__slide:first-child .list-item__value');
    if (firstSlide) firstSlide.textContent = formatted;

    // Payment modal: debit-account rows (not IAT — those are painted by iat-overlay.js)
    var paymentRoot = document.querySelector('.modal-overlay:not(#uz-iat-overlay) .modal--payment-flow');
    if (paymentRoot) {
      paymentRoot.querySelectorAll('.debit-account__amount').forEach(function (el) {
        var cur = el.querySelector('.debit-account__amount-currency');
        var val = el.querySelector('.debit-account__amount-value');
        if (cur && val) {
          cur.textContent = 'CHF';
          val.textContent = formatted;
          return;
        }
        el.textContent = 'CHF ' + formatted;
      });
    }
  }

  /* ── Account-sum headers ─────────────────────────────────────────
   * Two pages display a sum:
   *   • overview.html "Accounts & investment" → all 4 accounts
   *   • account-details.html "All accounts"   → Household + Savings only
   *
   * The first .section-card__value on each page is the relevant one
   * (the bookings card on account-details uses its own
   * .bookings-card__pending-value class, so it's not matched).
   * ──────────────────────────────────────────────────────────────── */

  function renderAccountSum(state) {
    var page = (document.body && document.body.dataset && document.body.dataset.page) || '';
    var el = document.querySelector('.section-card__value');
    if (!el) return;
    if (page === 'overview') {
      el.textContent = fmt(state.overviewAccountsTotal);
    } else if (page === 'account-details') {
      el.textContent = fmt(state.accountDetailsAccountsTotal);
    }
  }

  /* ── Bookings list (Today group on account-details) ─────────────── */

  function buildBookingRow(b) {
    var row = document.createElement('div');
    row.className = 'booking-row';
    row.setAttribute('data-source', 'state');
    row.setAttribute('data-booking-id', b.id);
    var iconId = b.icon || 'i-corner-up-right';
    var isCredit = b.direction === 'in';
    var sign = isCredit ? '+' : '-';
    row.innerHTML =
      '<svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#' + escapeHtml(iconId) + '"/></svg>' +
      '<span class="booking-row__name">' + escapeHtml(b.recipientName) + '</span>' +
      '<span class="booking-row__amount">' +
        '<span class="booking-row__currency">' + escapeHtml(b.currency) + '</span>' +
        '<span class="booking-row__value">' + sign + fmt(b.amount) + '</span>' +
      '</span>';
    return row;
  }

  function renderBookingsForAccount(state, accountKey) {
    var panel = document.querySelector('[data-account-bookings="' + accountKey + '"]');
    if (!panel) return;
    var group = panel.querySelector('.booking-group[data-day="today"]');
    if (!group) return;

    group.querySelectorAll('[data-source="state"]').forEach(function (n) { n.remove(); });

    var accountBookings = (state.bookings || []).filter(function (b) {
      return (b.accountKey || 'household') === accountKey;
    });
    if (accountBookings.length === 0) return;

    var header = group.querySelector('.booking-group__header');
    var insertAfter = header || group.firstChild;
    for (var i = accountBookings.length - 1; i >= 0; i--) {
      var row = buildBookingRow(accountBookings[i]);
      if (insertAfter && insertAfter.parentNode) {
        insertAfter.parentNode.insertBefore(row, insertAfter.nextSibling);
        insertAfter = row;
      } else {
        group.appendChild(row);
        insertAfter = row;
      }
    }
  }

  function renderBookings(state) {
    ['household', 'savings', 'deposit'].forEach(function (accountKey) {
      renderBookingsForAccount(state, accountKey);
    });
  }

  /* ── Day-end balance shown in each booking-group header ─────────── */

  function renderDayBalances(state) {
    var todayEl = document.querySelector('[data-day-balance="today"]');
    var yesterdayEl = document.querySelector('[data-day-balance="yesterday"]');
    if (todayEl) todayEl.textContent = fmt(state.todayBalance);
    if (yesterdayEl) yesterdayEl.textContent = fmt(state.yesterdayBalance);
  }

  /* ── Render entrypoint ──────────────────────────────────────────── */

  function renderAll() {
    var state = window.UZBankPayState.getState();
    renderHouseholdBalance(state);
    renderAccountSum(state);
    renderBookings(state);
    renderDayBalances(state);
  }

  document.addEventListener('DOMContentLoaded', renderAll);
  document.addEventListener('uzbank:state-changed', renderAll);
})();
