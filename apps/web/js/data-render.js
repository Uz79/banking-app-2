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
 *   - Other static content (Yesterday group, dummy Apple/Cafe rows) is
 *     untouched — those represent historical mock data
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
    var firstSlide = document.querySelector('.carousel__slides .carousel__slide:first-child .carousel__slide-value');
    if (firstSlide) firstSlide.textContent = formatted;

    // Payment modal: every .debit-account__amount across the inlined modal__step blocks
    document.querySelectorAll('.debit-account__amount').forEach(function (el) {
      el.textContent = 'CHF ' + formatted;
    });
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

  function findGroupByDay(day) {
    return document.querySelector('.booking-group[data-day="' + day + '"]');
  }

  function buildBookingRow(b) {
    var row = document.createElement('div');
    row.className = 'booking-row';
    row.setAttribute('data-source', 'state');
    row.setAttribute('data-booking-id', b.id);
    row.innerHTML =
      '<svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>' +
      '<span class="booking-row__name">' + escapeHtml(b.recipientName) + '</span>' +
      '<span class="booking-row__amount">' +
        '<span class="booking-row__currency">' + escapeHtml(b.currency) + '</span>' +
        '<span class="booking-row__value">-' + fmt(b.amount) + '</span>' +
      '</span>';
    return row;
  }

  function renderBookings(state) {
    var group = findGroupByDay('today');
    if (!group) return;

    // Remove only previously-injected rows; never touch static mock rows
    group.querySelectorAll('[data-source="state"]').forEach(function (n) { n.remove(); });

    if (!state.bookings || state.bookings.length === 0) return;

    var header = group.querySelector('.booking-group__header');

    // Newest first: state.bookings is chronological (oldest → newest). Iterate
    // from the end (newest) and chain each insert after the previous so we
    // don't keep reusing header.nextSibling (that would reverse order).
    var insertAfter = header || group.firstChild;
    for (var i = state.bookings.length - 1; i >= 0; i--) {
      var row = buildBookingRow(state.bookings[i]);
      if (insertAfter && insertAfter.parentNode) {
        insertAfter.parentNode.insertBefore(row, insertAfter.nextSibling);
        insertAfter = row;
      } else {
        group.appendChild(row);
        insertAfter = row;
      }
    }
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
