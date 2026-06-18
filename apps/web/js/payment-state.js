/**
 * UZ Bank Web — payment state
 *
 * Single source of truth for everything the payment flow + dashboard
 * shares: 8 recipients, the running list of booked payments (max 5, FIFO),
 * and the live Household account balance.
 *
 * Persistence:
 *   localStorage key  uzBankWebPaymentState
 *   shape             { schemaVersion: 1, bookings: [...], household: <number> }
 *
 * State changes dispatch a `uzbank:state-changed` CustomEvent on document
 * so the renderer (js/data-render.js) and any other listener can react
 * without polling.
 *
 * Public API (all on window.UZBankPayState):
 *   getRecipients()             → array of 8 recipient records (read-only)
 *   pickRandomRecipient()       → one recipient picked at random
 *   getState()                  → snapshot { household, bookings[], etc. }
 *   commitPayment({ recipient, amount, currency, dateISO }) → records the booking, debits balance
 *   reset()                     → wipe storage, restore initial state
 *   formatMoney(n)              → "10'000.00" Swiss style
 *   STORAGE_KEY                 → string constant (for boot-script reuse)
 */
(function () {
  'use strict';

  var STORAGE_KEY  = 'uzBankWebPaymentState';
  var MAX_BOOKINGS = 5;
  var SCHEMA_VERSION = 2;

  // Household account in CHF — this is the *registered* end-of-yesterday
  // balance, the "settled" number shown in the account list everywhere.
  // It stays fixed for the entire session: new payments add to today's
  // running ledger but do NOT change this displayed balance (only tomorrow,
  // hypothetically, would today's outflows show up here).
  // Registered Household balance = end of yesterday (start of today) in CHF.
  // Yesterday mock outflows (USD) sum to 430; 10'430 − 430 = 10'000 USD header
  // on the Yesterday group. Today opens at CHF 10'000; Apple −100 → Today
  // header CHF 9'900 (see account-details bookings card / Figma).
  var INITIAL_HOUSEHOLD = 10000.00;

  // End-of-yesterday balance shown in the Yesterday group header (USD in UI).
  var YESTERDAY_BALANCE = 10000.00;

  // Static mock outflow in HTML Today group (Apple −100 CHF) before any
  // payments the user commits in-session.
  var STATIC_TODAY_OUTFLOW = 100.00;

  // Fixed sibling account balances (not editable in this prototype).
  // The overview page shows a sum across all 4 accounts; account-details
  // shows a smaller "All accounts" sum across Household + Savings only,
  // matching the carousel on that page.
  var SAVINGS    = 25000;
  var DEPOSIT    = 20000;
  var RETIREMENT = 10000;
  var OVERVIEW_OTHER_TOTAL        = SAVINGS + DEPOSIT + RETIREMENT; // 55'000
  var ACCOUNT_DETAILS_OTHER_TOTAL = SAVINGS;                         // 25'000

  /* ── 8 recipient records ─────────────────────────────────────────
   * Mix of CH / DE / AT / FR / IT names so the random picker feels
   * varied. IBAN strings are syntactically plausible (CH35 …) but
   * not real-world valid; intended for prototype data only.
   * ────────────────────────────────────────────────────────────── */
  var RECIPIENTS = Object.freeze([
    {
      id: 'hans-meyer',
      name: 'Hans Meyer',
      iban: 'CH35 0900 0000 2560 0696 0',
      bank: 'UBS',
      street: 'Main Street 23',
      city: '8001 Zürich',
      country: 'CH'
    },
    {
      id: 'lena-fischer',
      name: 'Lena Fischer',
      iban: 'CH47 0023 0230 1234 5678 9',
      bank: 'Credit Suisse',
      street: 'Bahnhofstrasse 12',
      city: '8050 Zürich',
      country: 'CH'
    },
    {
      id: 'paul-schneider',
      name: 'Paul Schneider',
      iban: 'CH18 0079 1234 0008 8765 4',
      bank: 'ZKB',
      street: 'Seefeldstrasse 41',
      city: '8008 Zürich',
      country: 'CH'
    },
    {
      id: 'anna-ricci',
      name: 'Anna Ricci',
      iban: 'IT60 X054 2811 1010 0000 0123 456',
      bank: 'Intesa Sanpaolo',
      street: 'Via Garibaldi 8',
      city: '20121 Milano',
      country: 'IT'
    },
    {
      id: 'klaus-vogel',
      name: 'Klaus Vogel',
      iban: 'DE89 3704 0044 0532 0130 00',
      bank: 'Commerzbank',
      street: 'Hauptstrasse 7',
      city: '50667 Köln',
      country: 'DE'
    },
    {
      id: 'marie-dupont',
      name: 'Marie Dupont',
      iban: 'FR14 2004 1010 0505 0001 3M02 606',
      bank: 'BNP Paribas',
      street: 'Rue Lafayette 18',
      city: '75009 Paris',
      country: 'FR'
    },
    {
      id: 'lukas-huber',
      name: 'Lukas Huber',
      iban: 'AT61 1904 3002 3457 3201',
      bank: 'Erste Bank',
      street: 'Mariahilfer Strasse 3',
      city: '1060 Wien',
      country: 'AT'
    },
    {
      id: 'sofia-keller',
      name: 'Sofia Keller',
      iban: 'CH51 0078 4000 1234 5678 9',
      bank: 'Raiffeisen',
      street: 'Marktgasse 22',
      city: '3011 Bern',
      country: 'CH'
    }
  ]);

  try {
    if (typeof window !== 'undefined') {
      window.__UZ_CANONICAL_RECIPIENT_ROWS__ = RECIPIENTS.map(function (r) {
        return Object.assign({}, r);
      });
    }
  } catch (_) {}

  /* ── Persistence ─────────────────────────────────────────────────── */

  function seedQuantityForSymbol(symbol) {
    var sum = 0;
    for (var i = 0; i < symbol.length; i++) {
      sum += symbol.charCodeAt(i);
    }
    return 5 + (sum % 46);
  }

  function defaultPositions() {
    return {
      ABB: {
        symbol: 'ABB',
        name: 'ABB Ltd',
        isin: 'CH0012221711',
        exchange: 'SWX',
        quantity: 5
      },
      AAPL: { symbol: 'AAPL', name: 'Apple Inc.', quantity: seedQuantityForSymbol('AAPL') },
      MSFT: { symbol: 'MSFT', name: 'Microsoft Corporation', quantity: seedQuantityForSymbol('MSFT') },
      NVDA: { symbol: 'NVDA', name: 'NVIDIA Corporation', quantity: seedQuantityForSymbol('NVDA') },
      SAP: { symbol: 'SAP', name: 'SAP SE', quantity: seedQuantityForSymbol('SAP') },
      TM: { symbol: 'TM', name: 'Toyota Motor Corporation', quantity: seedQuantityForSymbol('TM') }
    };
  }

  function defaultState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      household: INITIAL_HOUSEHOLD,
      bookings: [],
      positions: defaultPositions()
    };
  }

  function normalizePositions(raw) {
    var base = defaultPositions();
    if (!raw || typeof raw !== 'object') return base;
    Object.keys(base).forEach(function (symbol) {
      if (raw[symbol] && typeof raw[symbol].quantity === 'number') {
        base[symbol].quantity = raw[symbol].quantity;
      }
      if (raw[symbol] && raw[symbol].name) {
        base[symbol].name = raw[symbol].name;
      }
    });
    Object.keys(raw).forEach(function (symbol) {
      if (base[symbol]) return;
      var entry = raw[symbol];
      if (!entry || typeof entry.quantity !== 'number') return;
      base[symbol] = {
        symbol: symbol,
        name: entry.name || symbol,
        isin: entry.isin || '',
        exchange: entry.exchange || '',
        quantity: entry.quantity
      };
    });
    return base;
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      if (!parsed) return defaultState();
      var b = Array.isArray(parsed.bookings) ? parsed.bookings : [];
      var cap = MAX_BOOKINGS * 4;
      if (parsed.schemaVersion === SCHEMA_VERSION) {
        return {
          schemaVersion: SCHEMA_VERSION,
          household: INITIAL_HOUSEHOLD,
          bookings: b.slice(-cap),
          positions: normalizePositions(parsed.positions)
        };
      }
      if (parsed.schemaVersion === 1) {
        return {
          schemaVersion: SCHEMA_VERSION,
          household: INITIAL_HOUSEHOLD,
          bookings: b.slice(-cap),
          positions: defaultPositions()
        };
      }
      return defaultState();
    } catch (e) {
      return defaultState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        bookings: state.bookings,
        positions: state.positions
      }));
    } catch (e) {}
  }

  /* ── Money formatting (Swiss style, 10'000.00) ──────────────────── */

  function formatMoney(n) {
    if (typeof n !== 'number' || isNaN(n)) return '0.00';
    var sign = n < 0 ? '-' : '';
    var absStr = Math.abs(n).toFixed(2);
    var parts = absStr.split('.');
    var intPart = parts[0];
    var decPart = parts[1];
    // Insert ' as Swiss thousand separator
    var withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return sign + withSeparator + '.' + decPart;
  }

  /* ── State live cache + change events ────────────────────────────── */

  var state = loadState();

  function dispatchChange() {
    saveState(state);
    try {
      document.dispatchEvent(new CustomEvent('uzbank:state-changed', {
        detail: getState()
      }));
    } catch (e) { /* ignore in environments without CustomEvent */ }
  }

  function accountRunningBalance(accountKey) {
    var key = accountKey || 'household';
    var base = key === 'savings' ? SAVINGS : INITIAL_HOUSEHOLD;
    if (key === 'household') {
      base -= STATIC_TODAY_OUTFLOW;
    }
    state.bookings.forEach(function (b) {
      if ((b.accountKey || 'household') !== key) return;
      var amt = typeof b.amount === 'number' ? b.amount : 0;
      if (b.direction === 'in') base += amt;
      else base -= amt;
    });
    return Math.round(base * 100) / 100;
  }

  function clonePositions(positions) {
    var out = {};
    Object.keys(positions || {}).forEach(function (symbol) {
      out[symbol] = Object.assign({}, positions[symbol]);
    });
    return out;
  }

  function getState() {
    // Sum of all dynamic (state-driven) bookings — these are all "today"
    // since the prototype doesn't simulate day rollover.
    var dynamicTodayOutflow = state.bookings.reduce(function (sum, b) {
      if ((b.accountKey || 'household') !== 'household') return sum;
      if (b.direction === 'in') return sum;
      return sum + (typeof b.amount === 'number' ? b.amount : 0);
    }, 0);
    var todayBalance = state.household - STATIC_TODAY_OUTFLOW - dynamicTodayOutflow;
    var householdRunning = accountRunningBalance('household');
    var savingsRunning = accountRunningBalance('savings');

    // Return a defensive shallow clone so external code can't mutate the
    // internal store directly.
    return {
      household: state.household,
      yesterdayBalance: YESTERDAY_BALANCE,
      todayBalance: Math.round(todayBalance * 100) / 100,
      staticTodayOutflow: STATIC_TODAY_OUTFLOW,
      accountBalances: {
        household: householdRunning,
        savings: savingsRunning
      },
      // Page-specific sums of "registered" balances. They reflect the
      // settled (yesterday-end) state and don't shift with today's bookings.
      overviewAccountsTotal:        state.household + OVERVIEW_OTHER_TOTAL,
      accountDetailsAccountsTotal:  state.household + ACCOUNT_DETAILS_OTHER_TOTAL,
      positions: clonePositions(state.positions),
      bookings: state.bookings.map(function (b) {
        var row = {
          id: b.id,
          recipientName: b.recipientName,
          currency: b.currency,
          amount: b.amount,
          dateISO: b.dateISO,
          accountKey: b.accountKey || 'household',
          icon: b.icon || 'i-corner-up-right',
          direction: b.direction || 'out'
        };
        if (b.kind) row.kind = b.kind;
        if (b.fromKey) row.fromKey = b.fromKey;
        if (b.toKey) row.toKey = b.toKey;
        if (b.fromName) row.fromName = b.fromName;
        if (b.toName) row.toName = b.toName;
        if (b.symbol) row.symbol = b.symbol;
        if (b.quantity != null) row.quantity = b.quantity;
        return row;
      })
    };
  }

  function getPosition(symbol) {
    if (!symbol) return null;
    var pos = state.positions && state.positions[symbol];
    return pos ? Object.assign({}, pos) : null;
  }

  /* ── Recipient picker ────────────────────────────────────────────── */

  var lastPickedId = null;

  function pickRandomRecipient() {
    if (RECIPIENTS.length === 0) return null;
    if (RECIPIENTS.length === 1) return RECIPIENTS[0];
    // Pick one that isn't the same as the previous (when possible) so the
    // user doesn't think the randomizer is broken.
    var pool = RECIPIENTS.filter(function (r) { return r.id !== lastPickedId; });
    var pick = pool[Math.floor(Math.random() * pool.length)];
    lastPickedId = pick.id;
    return pick;
  }

  function getRecipients() {
    return RECIPIENTS.slice();
  }

  /* ── Commit / reset ──────────────────────────────────────────────── */

  function commitPayment(payment) {
    if (!payment || typeof payment.amount !== 'number' || payment.amount <= 0) return;

    var booking = {
      id: 'bk_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      recipientName: payment.recipient && payment.recipient.name ? payment.recipient.name : 'Unknown',
      currency: payment.currency || 'CHF',
      amount: payment.amount,
      dateISO: payment.dateISO || new Date().toISOString(),
      accountKey: 'household',
      icon: 'i-corner-up-right',
      direction: 'out'
    };

    state.bookings.push(booking);
    if (state.bookings.length > MAX_BOOKINGS) {
      state.bookings.splice(0, state.bookings.length - MAX_BOOKINGS); // drop oldest
    }
    // NOTE: We deliberately do NOT decrement state.household here.
    // The Household amount shown in the account list represents the
    // "registered" end-of-yesterday balance and stays fixed for the
    // session. Today's running balance is derived in getState() instead.
    dispatchChange();
  }

  /**
   * Record an internal account transfer in the bookings ledger (debit + credit rows).
   */
  function commitInternalTransfer(transfer) {
    if (!transfer || typeof transfer.amount !== 'number' || transfer.amount <= 0) return;
    if (!transfer.fromKey || !transfer.toKey || transfer.fromKey === transfer.toKey) return;

    var ts = transfer.dateISO || new Date().toISOString();
    var suffix = Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    state.bookings.push({
      id: 'iat_out_' + suffix,
      recipientName: 'Transfer to ' + (transfer.toName || 'Account'),
      currency: transfer.currency || 'CHF',
      amount: transfer.amount,
      dateISO: ts,
      accountKey: transfer.fromKey,
      icon: 'i-repeat',
      direction: 'out',
      kind: 'iat',
      fromKey: transfer.fromKey,
      toKey: transfer.toKey,
      fromName: transfer.fromName,
      toName: transfer.toName
    });

    state.bookings.push({
      id: 'iat_in_' + suffix,
      recipientName: 'Transfer from ' + (transfer.fromName || 'Account'),
      currency: transfer.currency || 'CHF',
      amount: transfer.amount,
      dateISO: ts,
      accountKey: transfer.toKey,
      icon: 'i-download',
      direction: 'in',
      kind: 'iat',
      fromKey: transfer.fromKey,
      toKey: transfer.toKey,
      fromName: transfer.fromName,
      toName: transfer.toName
    });

    var cap = MAX_BOOKINGS * 4;
    if (state.bookings.length > cap) {
      state.bookings.splice(0, state.bookings.length - cap);
    }
    dispatchChange();
  }

  /**
   * Update an existing booking in-place (used by the edit flow so
   * re-submitting a pending payment replaces it rather than duplicating it).
   * Only the fields provided in `updates` are overwritten.
   */
  function updatePayment(id, updates) {
    if (!id || !updates) return;
    var idx = -1;
    for (var i = 0; i < state.bookings.length; i++) {
      if (state.bookings[i].id === id) { idx = i; break; }
    }
    if (idx < 0) return; // booking not found — no-op
    var existing = state.bookings[idx];
    state.bookings[idx] = {
      id:            existing.id,
      recipientName: (updates.recipient && updates.recipient.name)
                       ? updates.recipient.name
                       : existing.recipientName,
      currency:      updates.currency  || existing.currency,
      amount:        (typeof updates.amount === 'number' && updates.amount > 0)
                       ? updates.amount
                       : existing.amount,
      dateISO:       updates.dateISO   || existing.dateISO
    };
    dispatchChange();
  }

  /**
   * Record a buy/sell trade: debits/credits debtor account via bookings ledger
   * and updates Custody account position quantity.
   */
  function commitTradeOrder(order) {
    if (!order || typeof order.totalAmount !== 'number' || order.totalAmount <= 0) return;
    if (typeof order.quantity !== 'number' || order.quantity <= 0) return;
    if (!order.symbol) return;

    var side = order.side === 'sell' ? 'sell' : 'buy';
    var debtorKey = order.debtorKey || 'household';
    var ts = order.dateISO || new Date().toISOString();
    var suffix = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    var label = (side === 'sell' ? 'Sell ' : 'Buy ') + order.symbol;

    state.bookings.push({
      id: 'trade_' + suffix,
      recipientName: label,
      currency: order.currency || 'CHF',
      amount: order.totalAmount,
      dateISO: ts,
      accountKey: debtorKey,
      icon: side === 'sell' ? 'i-minus' : 'i-plus',
      direction: side === 'sell' ? 'in' : 'out',
      kind: 'trade',
      symbol: order.symbol,
      quantity: order.quantity
    });

    var cap = MAX_BOOKINGS * 4;
    if (state.bookings.length > cap) {
      state.bookings.splice(0, state.bookings.length - cap);
    }

    if (!state.positions) state.positions = defaultPositions();
    var existing = state.positions[order.symbol] || {
      symbol: order.symbol,
      name: order.name || order.symbol,
      isin: order.isin || '',
      exchange: order.exchange || '',
      quantity: 0
    };
    if (order.name) existing.name = order.name;
    if (order.isin) existing.isin = order.isin;
    if (order.exchange) existing.exchange = order.exchange;
    existing.quantity = side === 'sell'
      ? Math.max(0, (existing.quantity || 0) - order.quantity)
      : (existing.quantity || 0) + order.quantity;
    state.positions[order.symbol] = existing;

    dispatchChange();
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state = defaultState();
    dispatchChange();
  }

  /* ── Public surface ──────────────────────────────────────────────── */

  window.UZBankPayState = {
    STORAGE_KEY:         STORAGE_KEY,
    MAX_BOOKINGS:        MAX_BOOKINGS,
    getRecipients:       getRecipients,
    pickRandomRecipient: pickRandomRecipient,
    getState:            getState,
    getPosition:         getPosition,
    commitPayment:       commitPayment,
    commitInternalTransfer: commitInternalTransfer,
    commitTradeOrder:    commitTradeOrder,
    updatePayment:       updatePayment,
    reset:               reset,
    formatMoney:         formatMoney
  };
})();
