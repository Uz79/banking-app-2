/**
 * E-Banking WebApp 11 — payment state
 *
 * Single source of truth for everything the payment flow + dashboard
 * shares: 8 recipients, the running list of booked payments (max 5, FIFO),
 * and the live Household account balance.
 *
 * Persistence:
 *   localStorage key  uzBankWebApp11PaymentState
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

  var STORAGE_KEY  = 'uzBankWebApp11PaymentState';
  var MAX_BOOKINGS = 5;

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

  function defaultState() {
    return {
      schemaVersion: 1,
      household: INITIAL_HOUSEHOLD,
      bookings: []   // { id, recipientName, currency, amount (positive number), dateISO }
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.schemaVersion !== 1) return defaultState();
      // The registered yesterday-end balance is a CONSTANT in this prototype.
      // We deliberately ignore any `household` value that may have been
      // persisted by an older version of this module (which decremented it
      // on commit) — bookings are the only thing worth restoring.
      var b = Array.isArray(parsed.bookings) ? parsed.bookings : [];
      return { schemaVersion: 1, household: INITIAL_HOUSEHOLD, bookings: b.slice(-MAX_BOOKINGS) };
    } catch (e) {
      return defaultState();
    }
  }

  function saveState(state) {
    // Only persist bookings — household is constant, recomputed at load.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        schemaVersion: 1,
        bookings: state.bookings
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

  function getState() {
    // Sum of all dynamic (state-driven) bookings — these are all "today"
    // since the prototype doesn't simulate day rollover.
    var dynamicTodayOutflow = state.bookings.reduce(function (sum, b) {
      return sum + (typeof b.amount === 'number' ? b.amount : 0);
    }, 0);
    var todayBalance = state.household - STATIC_TODAY_OUTFLOW - dynamicTodayOutflow;

    // Return a defensive shallow clone so external code can't mutate the
    // internal store directly.
    return {
      household: state.household,
      yesterdayBalance: YESTERDAY_BALANCE,
      todayBalance: Math.round(todayBalance * 100) / 100,
      staticTodayOutflow: STATIC_TODAY_OUTFLOW,
      // Page-specific sums of "registered" balances. They reflect the
      // settled (yesterday-end) state and don't shift with today's bookings.
      overviewAccountsTotal:        state.household + OVERVIEW_OTHER_TOTAL,
      accountDetailsAccountsTotal:  state.household + ACCOUNT_DETAILS_OTHER_TOTAL,
      bookings: state.bookings.map(function (b) {
        return {
          id: b.id,
          recipientName: b.recipientName,
          currency: b.currency,
          amount: b.amount,
          dateISO: b.dateISO
        };
      })
    };
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
      dateISO: payment.dateISO || new Date().toISOString()
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

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state = defaultState();
    dispatchChange();
  }

  /* ── Public surface ──────────────────────────────────────────────── */

  window.UZBankPayState = {
    STORAGE_KEY:        STORAGE_KEY,
    MAX_BOOKINGS:       MAX_BOOKINGS,
    getRecipients:      getRecipients,
    pickRandomRecipient: pickRandomRecipient,
    getState:           getState,
    commitPayment:      commitPayment,
    reset:              reset,
    formatMoney:        formatMoney
  };
})();
