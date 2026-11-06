/**
 * UZ Bank Web — the built-in bookings (roadmap 62, specs/2026-11-06-demo-data-dates/)
 *
 * Every example booking of Household and Savings in one list, dated from
 * today (D1, D3): All bookings and Account details draw their rows from it.
 *
 *   • A standing item falls on its own day of the month, a weekend moved to
 *     Monday (Rent the 1st, Netflix and Internet & Phone the 5th, Salary the
 *     25th); its occurrences up to today are executed bookings
 *   • A one-off is { monthsAgo, day } or { daysAgo }; a date after today is
 *     dropped, a day past a short month's end moves to its last day
 *   • The history covers the current month and the four before it (D4)
 *   • Pending one-offs are a few working days after today (53 D12); a standing
 *     order's next execution is its first occurrence after today (53 D13)
 *
 * window.UZBankBuiltInBookings:
 *   today()                      → Date at midnight; ?today=YYYY-MM-DD on localhost and *.local only (D16)
 *   executed(account, today?)    → executed bookings, newest first
 *   pending(account, today?)     → pending one-offs, in date order
 *   standingOrders(account, today?) → the rules, with their next execution
 *   nextDate(rule, today)        → { offsetDays } or { dayOfMonth } → Date
 *   dateLabel(d)                 → 'DD.MM.YYYY'; dayKey(d) → 'YYYY-MM-DD'
 *
 * A booking: { id, account, name, amount, direction ('in' | 'out'), type
 * ('payment' | 'transfer'), icon, frequency, status, date, day, label } and,
 * for a transfer between own accounts, from and to (account keys).
 */
(function () {
  'use strict';

  var MONTHS = 5;
  var OUT = 'i-corner-up-right';
  var IN = 'i-download';

  /* Standing orders: rules in Recurring, their occurrences in Executed (D3, D5, D7) */
  var STANDING_ORDERS = [
    { id: 'allb-recurring-rent', account: 'savings', name: 'Rent', amount: 1800, dayOfMonth: 1 },
    { id: 'allb-recurring-netflix', account: 'household', name: 'Netflix', amount: 19.9, dayOfMonth: 5 },
    { id: 'allb-recurring-internet', account: 'savings', name: 'Internet & Phone', amount: 59, dayOfMonth: 5 }
  ];

  /* Money that comes every month and is no standing order of the customer's: no chip (D3, D6) */
  var MONTHLY = [
    { id: 'sv-salary', account: 'savings', name: 'Salary', amount: 5000, direction: 'in', icon: IN, dayOfMonth: 25 },
    { id: 'sv-to-household', account: 'savings', name: 'Transfer to Household', amount: 1500, type: 'transfer', icon: 'i-home', from: 'savings', to: 'household', dayOfMonth: 26 },
    { id: 'hh-from-savings', account: 'household', name: 'Transfer from Savings', amount: 1500, direction: 'in', type: 'transfer', icon: 'i-anchor', from: 'savings', to: 'household', dayOfMonth: 26 }
  ];

  /* One-offs (D6, D7). Savings' are its old rows on their old day of the month, June being month 0. */
  var ONE_OFFS = [
    /* Household */
    { id: 'hh-cafe', account: 'household', name: 'Cafe', amount: 10, daysAgo: 1 },
    { id: 'hh-pizza', account: 'household', name: 'Pizza', amount: 320, type: 'transfer', icon: 'i-anchor', daysAgo: 1 },
    { id: 'hh-railway', account: 'household', name: 'Railway', amount: 100, daysAgo: 1 },
    { id: 'hh-migros-0-2', account: 'household', name: 'Migros', amount: 64.3, monthsAgo: 0, day: 2 },
    { id: 'hh-spruengli-0-4', account: 'household', name: 'Bakery Sprüngli', amount: 18.5, monthsAgo: 0, day: 4 },
    { id: 'hh-coop-1-3', account: 'household', name: 'Coop', amount: 82.15, monthsAgo: 1, day: 3 },
    { id: 'hh-pharmacy-1-9', account: 'household', name: 'Pharmacy Zürich', amount: 27.4, monthsAgo: 1, day: 9 },
    { id: 'hh-schober-1-14', account: 'household', name: 'Café Schober', amount: 12.8, monthsAgo: 1, day: 14 },
    { id: 'hh-migros-1-19', account: 'household', name: 'Migros', amount: 96.7, monthsAgo: 1, day: 19 },
    { id: 'hh-shell-1-23', account: 'household', name: 'Shell', amount: 78, monthsAgo: 1, day: 23 },
    { id: 'hh-digitec-1-28', account: 'household', name: 'Digitec', amount: 149, monthsAgo: 1, day: 28 },
    { id: 'hh-denner-2-2', account: 'household', name: 'Denner', amount: 45.6, monthsAgo: 2, day: 2 },
    { id: 'hh-sbb-2-8', account: 'household', name: 'SBB Mobile', amount: 35, monthsAgo: 2, day: 8 },
    { id: 'hh-coop-2-12', account: 'household', name: 'Coop', amount: 71.25, monthsAgo: 2, day: 12 },
    { id: 'hh-hiltl-2-17', account: 'household', name: 'Restaurant Hiltl', amount: 64, monthsAgo: 2, day: 17 },
    { id: 'hh-migros-2-22', account: 'household', name: 'Migros', amount: 88.9, monthsAgo: 2, day: 22 },
    { id: 'hh-orell-2-29', account: 'household', name: 'Orell Füssli', amount: 32.5, monthsAgo: 2, day: 29 },
    { id: 'hh-migros-3-4', account: 'household', name: 'Migros', amount: 59.8, monthsAgo: 3, day: 4 },
    { id: 'hh-parking-3-10', account: 'household', name: 'Parking Zürich', amount: 12, monthsAgo: 3, day: 10 },
    { id: 'hh-coop-3-15', account: 'household', name: 'Coop', amount: 103.4, monthsAgo: 3, day: 15 },
    { id: 'hh-kino-3-21', account: 'household', name: 'Kino Arena', amount: 36, monthsAgo: 3, day: 21 },
    { id: 'hh-denner-3-27', account: 'household', name: 'Denner', amount: 41.7, monthsAgo: 3, day: 27 },
    { id: 'hh-coop-4-3', account: 'household', name: 'Coop', amount: 66.1, monthsAgo: 4, day: 3 },
    { id: 'hh-pharmacy-4-9', account: 'household', name: 'Pharmacy Zürich', amount: 22.6, monthsAgo: 4, day: 9 },
    { id: 'hh-migros-4-16', account: 'household', name: 'Migros', amount: 91.35, monthsAgo: 4, day: 16 },
    { id: 'hh-schober-4-24', account: 'household', name: 'Café Schober', amount: 9.8, monthsAgo: 4, day: 24 },
    { id: 'hh-sbb-4-30', account: 'household', name: 'SBB Mobile', amount: 35, monthsAgo: 4, day: 30 },
    /* Savings */
    { id: 'sv-to-household-320', account: 'savings', name: 'Transfer to Household', amount: 320, type: 'transfer', icon: 'i-home', daysAgo: 1 },
    { id: 'sv-migros-1-28', account: 'savings', name: 'Migros', amount: 100, monthsAgo: 1, day: 28 },
    { id: 'sv-coop-1-25', account: 'savings', name: 'Coop', amount: 10, monthsAgo: 1, day: 25 },
    { id: 'sv-pharmacy-1-25', account: 'savings', name: 'Pharmacy Zürich', amount: 100, monthsAgo: 1, day: 25 },
    { id: 'sv-health-1-12', account: 'savings', name: 'Health Insurance', amount: 380, monthsAgo: 1, day: 12 },
    { id: 'sv-denner-2-28', account: 'savings', name: 'Denner', amount: 42.5, monthsAgo: 2, day: 28 },
    { id: 'sv-shell-2-28', account: 'savings', name: 'Shell', amount: 85, monthsAgo: 2, day: 28 },
    { id: 'sv-sbb-2-18', account: 'savings', name: 'SBB Mobile', amount: 35, monthsAgo: 2, day: 18 },
    { id: 'sv-electricity-2-3', account: 'savings', name: 'Electricity Zürich', amount: 120, monthsAgo: 2, day: 3 },
    { id: 'sv-to-savings-2-3', account: 'savings', name: 'Transfer to Savings', amount: 500, type: 'transfer', icon: 'i-anchor', monthsAgo: 2, day: 3 },
    { id: 'sv-ikea-3-25', account: 'savings', name: 'IKEA Dietlikon', amount: 249, monthsAgo: 3, day: 25 },
    { id: 'sv-manor-3-15', account: 'savings', name: 'Manor', amount: 67.8, monthsAgo: 3, day: 15 },
    { id: 'sv-migros-3-8', account: 'savings', name: 'Migros', amount: 78.4, monthsAgo: 3, day: 8 },
    { id: 'sv-coop-3-8', account: 'savings', name: 'Coop', amount: 54.2, monthsAgo: 3, day: 8 },
    { id: 'sv-parking-3-1', account: 'savings', name: 'Parking Zürich', amount: 12, monthsAgo: 3, day: 1 },
    { id: 'sv-skipass-4-27', account: 'savings', name: 'Flumserberg Ski Pass', amount: 68, monthsAgo: 4, day: 27 },
    { id: 'sv-kronenhalle-4-14', account: 'savings', name: 'Restaurant Kronenhalle', amount: 185, monthsAgo: 4, day: 14 },
    { id: 'sv-interest-4-5', account: 'savings', name: 'Interest credit', amount: 12.5, direction: 'in', icon: IN, monthsAgo: 4, day: 5 }
  ];

  /* Pending one-offs, a few working days after today (53 D12) */
  var PENDING = [
    { id: 'ad-household-apple', account: 'household', name: 'Apple', amount: 100, offsetDays: 1 },
    { id: 'allb-pending-swisscom', account: 'household', name: 'Swisscom', amount: 89.9, offsetDays: 2 },
    { id: 'allb-pending-helvetia', account: 'household', name: 'Helvetia Insurance', amount: 245, offsetDays: 2 },
    { id: 'allb-pending-tax-office', account: 'household', name: 'Tax office Zurich', amount: 1200, offsetDays: 6 }
  ];

  /* ── Dates ─────────────────────────────────────────────────────── */

  function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }

  function isWeekend(d) { return d.getDay() === 0 || d.getDay() === 6; }

  function toWorkingDay(d) {
    while (isWeekend(d)) d = addDays(d, 1);
    return d;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function dateLabel(d) { return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear(); }

  function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* The day of a month, a day past its end moved to its last day (D3) */
  function dayInMonth(year, month, day) {
    var last = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(day, last));
  }

  /* ?today=YYYY-MM-DD on a dev host only, never on the live domain or a preview (D16) */
  function isDevHost(host) {
    return host === 'localhost' || host === '127.0.0.1' || /\.local$/.test(host);
  }

  function today() {
    try {
      if (isDevHost(window.location.hostname)) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(new URLSearchParams(window.location.search).get('today') || '');
        if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
      }
    } catch (_) {}
    return midnight(new Date());
  }

  /* A standing item's occurrence in the month that is monthsAgo before today's */
  function occurrence(dayOfMonth, t, monthsAgo) {
    return toWorkingDay(dayInMonth(t.getFullYear(), t.getMonth() - monthsAgo, dayOfMonth));
  }

  /* Pending: offsetDays working days after today; a standing order: its first occurrence after today (53 D12, D13) */
  function nextDate(rule, t) {
    t = t || today();
    var offset = rule.offsetDays;
    if (offset > 0) {
      var d = t;
      for (var i = 0; i < offset; i++) d = toWorkingDay(addDays(d, 1));
      return d;
    }
    if (!(rule.dayOfMonth > 0)) return null;
    for (var m = 0; m > -3; m--) {
      var occ = occurrence(rule.dayOfMonth, t, m);
      if (occ > t) return occ;
    }
    return null;
  }

  /* ── Bookings ──────────────────────────────────────────────────── */

  function booking(item, status, date, extra) {
    var direction = item.direction || 'out';
    return Object.assign({
      id: item.id,
      account: item.account,
      name: item.name,
      amount: item.amount,
      direction: direction,
      type: item.type || 'payment',
      icon: item.icon || (direction === 'in' ? IN : OUT),
      frequency: item.frequency || null,
      from: item.from || null,
      to: item.to || null,
      status: status,
      date: date,
      day: date ? dayKey(date) : null,
      label: date ? dateLabel(date) : null
    }, extra || {});
  }

  function executed(account, t) {
    t = t || today();
    var out = [];
    var order = 0;
    function add(item, date, extra) {
      if (!date || date > t) return;
      var b = booking(item, 'executed', date, extra);
      b.order = order++;
      out.push(b);
    }
    STANDING_ORDERS.concat(MONTHLY).forEach(function (item) {
      if (item.account !== account) return;
      var isRule = STANDING_ORDERS.indexOf(item) !== -1;
      for (var m = 0; m < MONTHS; m++) {
        var date = occurrence(item.dayOfMonth, t, m);
        /* The id names the occurrence's month, so each instance is its own row */
        add(isRule ? Object.assign({}, item, { frequency: 'monthly' }) : item, date, {
          id: (isRule ? item.id.replace(/^allb-recurring-/, account === 'savings' ? 'sv-' : 'hh-') : item.id) + '-' + date.getFullYear() + '-' + pad(date.getMonth() + 1),
          ruleId: isRule ? item.id : null
        });
      }
    });
    ONE_OFFS.forEach(function (item) {
      if (item.account !== account) return;
      var date = item.daysAgo != null
        ? addDays(t, -item.daysAgo)
        : dayInMonth(t.getFullYear(), t.getMonth() - item.monthsAgo, item.day);
      add(item, date);
    });
    /* Newest first; on one day, in the list's order */
    out.sort(function (a, b) { return b.date - a.date || a.order - b.order; });
    out.forEach(function (b) { delete b.order; });
    return out;
  }

  function pending(account, t) {
    t = t || today();
    return PENDING.filter(function (item) { return item.account === account; })
      .map(function (item) {
        return booking(item, 'pending', nextDate(item, t), { offsetDays: item.offsetDays });
      })
      .sort(function (a, b) { return a.date - b.date; });
  }

  function standingOrders(account, t) {
    t = t || today();
    return STANDING_ORDERS.filter(function (item) { return item.account === account; })
      .map(function (item) {
        return booking(Object.assign({}, item, { frequency: 'monthly' }), 'recurring', nextDate(item, t), { dayOfMonth: item.dayOfMonth });
      })
      .sort(function (a, b) { return a.date - b.date; });
  }

  window.UZBankBuiltInBookings = {
    today: today,
    executed: executed,
    pending: pending,
    standingOrders: standingOrders,
    nextDate: nextDate,
    dateLabel: dateLabel,
    dayKey: dayKey
  };
})();
