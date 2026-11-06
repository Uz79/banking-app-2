/**
 * UZ Bank Web — DOM renderer for payment state
 *
 * Reads from window.UZBankPayState.getState() and updates every place in
 * the DOM that displays state-driven values:
 *
 *   • Household balance — overview product-item, account-details carousel,
 *     every .debit-account__amount inside the payment modal
 *   • Sum-of-all-accounts on overview ("Accounts & investment" total)
 *   • Bookings list — each account's two newest days on account-details,
 *     drawn from js/built-in-bookings.js with the payments made in the app,
 *     and its "Pending payments" line (roadmap 62, D14, D15)
 *
 * Runs on DOMContentLoaded (initial paint) and on every
 * `uzbank:state-changed` event so navigating between pages or finishing
 * a new payment refreshes immediately. Each render fully reconciles the
 * DOM (clears its own injected rows then re-renders) so it's idempotent.
 *
 * Conventions:
 *   - Dynamic rows carry data-source="state" so they can be located + removed
   *   - Built-in rows ([data-mock-booking="static"]) are drawn by the same
   *     render, from the built-in list
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
    var running = state.accountBalances && state.accountBalances.household;
    var formatted = fmt(running != null ? running : state.household);

    // overview.html: the running balance, the booked one: pending payments count nowhere (roadmap 69, D10)
    document.querySelectorAll('[data-account="household"] .product-item__value').forEach(function (el) {
      el.textContent = running != null ? fmt(running) : formatted;
    });

    // account-details.html: the carousel slides (Household, Savings) show the running balances
    var balances = state.accountBalances || {};
    document.querySelectorAll('.carousel__slides .carousel__slide[data-account-key]').forEach(function (slide) {
      var amount = balances[slide.getAttribute('data-account-key')];
      var value = slide.querySelector('.list-item__value');
      if (value && amount != null) value.textContent = fmt(amount);
    });

    // Payment modal: debit-account rows (not IAT — those are painted by iat-overlay.js)
    var paymentRoot = document.querySelector('.modal-overlay:not(#uz-iat-overlay) .modal--payment-flow');
    if (paymentRoot) {
      paymentRoot.querySelectorAll('.debit-account__amount').forEach(function (el) {
        /* The account the card names: Household, or Savings for an edit of a Savings row (roadmap 59, D6) */
        var card = el.closest('.debit-account');
        var key = card && card.getAttribute('data-debit-key');
        var shown = key && key !== 'household' && balances[key] != null ? fmt(balances[key]) : formatted;
        var cur = el.querySelector('.debit-account__amount-currency');
        var val = el.querySelector('.debit-account__amount-value');
        if (cur && val) {
          cur.textContent = 'CHF';
          val.textContent = shown;
          return;
        }
        el.textContent = 'CHF ' + shown;
      });
    }

    var savingsRunning = state.accountBalances && state.accountBalances.savings;
    if (savingsRunning != null) {
      document.querySelectorAll('[data-account="savings"] .product-item__value').forEach(function (el) {
        el.textContent = fmt(savingsRunning);
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

  /* ── Bookings list (account-details, roadmap 62, D14, D15) ───────────
   * Each account's two newest days with bookings, labelled Today, Yesterday
   * or the date, each with its worked-out balance (D8), the payments made in
   * the app on their own day (D12); above them the "Pending payments" line,
   * what the account's Pending tab on All bookings lists, hidden when none.
   * Pending payments are not listed under a day (D11). */

  var ACCOUNT_DAYS = 2;

  function buildBookingRow(b) {
    var row = document.createElement('button');
    row.type = 'button';
    row.className = 'booking-row';
    row.setAttribute('data-source', 'state');
    row.setAttribute('data-booking-id', b.id);
    var look = window.UZBankPayState.bookingRowLook(b);
    row.setAttribute('data-type', look.type);
    var isCredit = b.direction === 'in';
    var sign = isCredit ? '+' : '-';
    row.innerHTML =
      '<svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#' + escapeHtml(look.icon) + '"/></svg>' +
      '<span class="booking-row__name">' + escapeHtml(b.recipientName) + '</span>' +
      (look.chip ? '<span class="chip chip--sm chip--tonal booking-row__chip">' + escapeHtml(look.chip) + '</span>' : '') +
      '<span class="booking-row__amount">' +
        '<span class="booking-row__currency">' + escapeHtml(b.currency) + '</span>' +
        '<span class="booking-row__value">' + sign + fmt(b.amount) + '</span>' +
      '</span>';
    return row;
  }

  function renderAccountBookings(accountKey) {
    var panel = document.querySelector('[data-account-bookings="' + accountKey + '"]');
    var list = window.UZBankBuiltInBookings;
    if (!panel || !list) return;
    var t = list.today();

    var line = panel.querySelector('[data-pending-line]');
    if (line) {
      var total = list.pendingTotal(accountKey, t);
      line.hidden = !(total !== 0);
      var value = line.querySelector('[data-pending-value]');
      if (value) value.textContent = fmt(Math.abs(total));
      var lineDivider = panel.querySelector('[data-pending-divider]');
      if (lineDivider) lineDivider.hidden = line.hidden;
    }

    panel.querySelectorAll('[data-source="days"]').forEach(function (n) { n.remove(); });
    var end = panel.querySelector('.show-all-btn');
    list.days(accountKey, t).slice(0, ACCOUNT_DAYS).forEach(function (d, i) {
      if (i > 0) {
        var divider = document.createElement('div');
        divider.className = 'divider';
        divider.setAttribute('data-source', 'days');
        panel.insertBefore(divider, end);
      }
      var label = list.dayLabel(d.date, t);
      var group = document.createElement('div');
      group.className = 'booking-group';
      group.setAttribute('data-source', 'days');
      group.setAttribute('data-day', label === 'Today' ? 'today' : label === 'Yesterday' ? 'yesterday' : d.day);
      group.innerHTML = '<header class="booking-group__header">' +
        '<span class="booking-group__label">' + escapeHtml(label) + '</span>' +
        '<span class="booking-group__balance">' +
          '<span class="booking-group__balance-currency">CHF</span>' +
          '<span class="booking-group__balance-value">' + escapeHtml(fmt(d.balance)) + '</span>' +
        '</span></header>';
      d.stored.forEach(function (b) { group.appendChild(buildBookingRow(b)); });
      d.builtIn.forEach(function (b) { group.appendChild(list.row(b)); });
      panel.insertBefore(group, end);
    });
  }

  function renderBookings() {
    ['household', 'savings'].forEach(renderAccountBookings);
  }

  /* ── Built-in rows an edit replaced or a delete removed (roadmap 42) ──
   * Hidden from the list in the state, shown again once it no longer has
   * them (after the reset), on every page that lists bookings (D3). A group
   * left with no row hides with one divider next to it, and a tab with no
   * group left shows its empty line (D5). */

  function isDivider(el) {
    return !!el && el.classList.contains('divider');
  }

  /* The nearest sibling that is not a month band or already hidden */
  function siblingDivider(el, dir) {
    var n = el[dir];
    while (n && (n.hasAttribute('data-month-separator') || n.hidden)) n = n[dir];
    return isDivider(n) ? n : null;
  }

  function syncBuiltInRows(root) {
    root = root || document;
    var removed = window.UZBankPayState.getState().removedBuiltIns || [];
    root.querySelectorAll('[data-builtin-id]').forEach(function (row) {
      row.hidden = removed.indexOf(row.getAttribute('data-builtin-id')) !== -1;
    });
    root.querySelectorAll('[data-builtin-emptied]').forEach(function (el) {
      el.hidden = false;
      el.removeAttribute('data-builtin-emptied');
    });
    /* A group with no row shown is hidden, whatever emptied it: a Delete, or Household's Today before any payment
       made in the app (roadmap 61, D1) */
    root.querySelectorAll('.booking-group').forEach(function (g) {
      if (g.querySelector('.booking-row:not([hidden])')) return;
      g.hidden = true;
      g.setAttribute('data-builtin-emptied', '');
      var divider = siblingDivider(g, 'nextElementSibling') || siblingDivider(g, 'previousElementSibling');
      if (divider) {
        divider.hidden = true;
        divider.setAttribute('data-builtin-emptied', '');
      }
    });
    root.querySelectorAll('[data-bookings-empty]').forEach(function (line) {
      var panel = line.parentNode;
      line.hidden = !!(panel && panel.querySelector('.booking-group:not([hidden])'));
    });
  }

  window.UZBankBuiltInRows = { sync: syncBuiltInRows };

  /* ── Asset management mandates (Overview, 9a D21) ───────────────────
   * One row per mandate after Retirement savings 3a: pending until a transfer funds it, so the amount is in the
   * secondary style and the Accounts & investment total does not count it; once funded, the balance in the regular
   * style, as the rows above (roadmap 18, D7). */

  function renderMandates(state) {
    var host = document.querySelector('[data-mandates]');
    if (!host) return;
    host.innerHTML = (state.mandates || []).map(function (m) {
      return '<div class="divider"></div>' +
        '<div class="product-item" data-source="state">' +
          '<svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>' +
          '<div class="product-item__info type-stack-tight">' +
            '<span class="product-item__name type-sm type-trim">Asset management</span>' +
            '<span class="product-item__iban type-xs type-trim">' + escapeHtml(m.strategyName || m.strategy) + '</span>' +
          '</div>' +
          (m.funded > 0
            ? '<span class="product-item__amount">' +
                '<span class="product-item__currency">CHF</span>' +
                '<span class="product-item__value">' + escapeHtml(fmt(m.funded)) + '</span>' +
              '</span>'
            : '<span class="product-item__amount product-item__amount--pending">' +
                'Pending: CHF ' + escapeHtml(fmt(m.amount).replace(/\.00$/, '')) +
              '</span>') +
        '</div>';
    }).join('');
  }

  /* ── Render entrypoint ──────────────────────────────────────────── */

  function renderAll() {
    var state = window.UZBankPayState.getState();
    renderHouseholdBalance(state);
    renderAccountSum(state);
    renderBookings();
    renderMandates(state);
    syncBuiltInRows(document);
  }

  function onDocumentReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onDocumentReady(renderAll);
  document.addEventListener('uzbank:state-changed', renderAll);
})();
