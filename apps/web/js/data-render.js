/**
 * UZ Bank Web — DOM renderer for payment state
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
    var running = state.accountBalances && state.accountBalances.household;
    var formatted = fmt(running != null ? running : state.household);

    // overview.html: running balance after today's bookings (payments + trades)
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

  /* ── Bookings list (Today group on account-details) ─────────────── */

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

  function renderBookingsForAccount(state, accountKey) {
    var panel = document.querySelector('[data-account-bookings="' + accountKey + '"]');
    if (!panel) return;
    var group = panel.querySelector('.booking-group[data-day="today"]');
    if (!group) return;

    group.querySelectorAll('[data-source="state"]').forEach(function (n) { n.remove(); });

    var accountBookings = (state.bookings || []).filter(function (b) {
      return (b.accountKey || 'household') === accountKey && (!b.status || b.status === 'executed');
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
    ['household', 'savings'].forEach(function (accountKey) {
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
    root.querySelectorAll('.booking-group').forEach(function (g) {
      if (!g.querySelector('[data-builtin-id]') || g.querySelector('.booking-row:not([hidden])')) return;
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

  /* ── Built-in dates from today (roadmap 53) ──────────────────────────
   * A pending row is a few working days after today (data-offset-days, D12); a
   * standing order keeps its day of the month (data-day-of-month), the next one
   * after today, a weekend moved to Monday (D13). The row's data-execute-on and
   * its group label take the date, and the groups re-sort by it (D14). Once per
   * page, before any in-app row joins the list. */

  function isWeekend(d) { return d.getDay() === 0 || d.getDay() === 6; }

  function toWorkingDay(d) {
    while (isWeekend(d)) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    return d;
  }

  function dateLabel(d) {
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
  }

  function builtInDate(row, today) {
    var offset = parseInt(row.getAttribute('data-offset-days'), 10);
    if (offset > 0) {
      var d = today;
      for (var i = 0; i < offset; i++) d = toWorkingDay(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
      return d;
    }
    var day = parseInt(row.getAttribute('data-day-of-month'), 10);
    if (!(day > 0)) return null;
    var next = new Date(today.getFullYear(), today.getMonth(), day);
    if (next <= today) next = new Date(today.getFullYear(), today.getMonth() + 1, day);
    return toWorkingDay(next);
  }

  function groupKey(g) {
    var row = g.querySelector('[data-execute-on]');
    var m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(row ? row.getAttribute('data-execute-on') : '');
    return m ? m[3] + m[2] + m[1] : '';
  }

  function sortGroups(panel) {
    var groups = [], dividers = [];
    Array.prototype.forEach.call(panel.children, function (el) {
      if (el.classList.contains('booking-group')) groups.push(el);
      else if (isDivider(el)) dividers.push(el);
    });
    groups.sort(function (a, b) { return groupKey(a) < groupKey(b) ? -1 : groupKey(a) > groupKey(b) ? 1 : 0; });
    var end = panel.querySelector(':scope > [data-bookings-empty]');
    groups.forEach(function (g, i) {
      if (i > 0 && dividers[i - 1]) panel.insertBefore(dividers[i - 1], end);
      panel.insertBefore(g, end);
    });
  }

  function dateBuiltInRows(root) {
    root = root || document;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var panels = [];
    root.querySelectorAll('[data-offset-days]:not([data-dated]), [data-day-of-month]:not([data-dated])').forEach(function (row) {
      var d = builtInDate(row, today);
      row.setAttribute('data-dated', '');
      if (!d) return;
      row.setAttribute('data-execute-on', dateLabel(d));
      var group = row.closest('.booking-group');
      var label = group && group.querySelector('.booking-group__label');
      if (label && /\d{2}\.\d{2}\.\d{4}/.test(label.textContent)) {
        label.textContent = label.textContent.replace(/\d{2}\.\d{2}\.\d{4}/, dateLabel(d));
      }
      var panel = group && group.parentNode;
      if (panel && panel.hasAttribute('data-all-bookings-panel') && panels.indexOf(panel) === -1) panels.push(panel);
    });
    panels.forEach(sortGroups);
  }

  window.UZBankBuiltInRows = { sync: syncBuiltInRows, date: dateBuiltInRows };

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
    renderBookings(state);
    renderDayBalances(state);
    renderMandates(state);
    dateBuiltInRows(document);
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
