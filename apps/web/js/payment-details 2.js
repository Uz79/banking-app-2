/**
 * UZ Bank Web — payment details overlay
 *
 * Opens a "Domestic Payment" or "Internal Account Transfer" detail sheet
 * when the user taps any .booking-row in the bookings card.
 *
 * Variants are driven by data attributes on the row, or a static lookup
 * table for the four mock bookings (Apple / Café / Pizza / Railway).
 *
 * Edit flow integration:
 *   When the user taps an edit button (amount or recipient) on a pending
 *   payment, this module writes window.__UZ_PD_EDIT_CONTEXT__ before
 *   navigating to #pay/<step>. payment-overlay.js reads that context on
 *   open to pre-populate live.amount / live.recipient instead of defaults.
 *
 * Public surface: none — fully self-contained IIFE.
 */
(function () {
  'use strict';

  /* ── Static booking data ─────────────────────────────────────── */

  var BOOKING_MAP_HOUSEHOLD = {
    'apple': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '-100.00',
      currency: 'CHF',
      to: 'Apple\nRennweg 43\n8001 Zürich',
      status: 'pending',
      message: null
    },
    'cafe': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '-10.00',
      currency: 'CHF',
      to: 'Café\nBahnhofstrasse 12\n8001 Zürich',
      status: 'executed',
      message: null
    },
    'pizza': {
      type: 'internal',
      title: 'Internal Account Transfer',
      amount: '320.00',
      currency: 'CHF',
      debit: {
        name: 'Savings account',
        iban: 'CH35 0900 0000 2470 2920 2',
        balance: "CHF 25'000.00",
        icon: '#i-anchor'
      },
      credit: {
        name: 'Private account',
        iban: 'CH35 0900 0000 2470 2920 1',
        balance: "CHF 10'000.00",
        icon: '#i-scissors'
      },
      status: 'executed',
      message: 'Pizza'
    },
    'railway': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '-100.00',
      currency: 'CHF',
      to: 'SBB\nBahnhofplatz 1\n3011 Bern',
      status: 'executed',
      message: null
    }
  };

  var BOOKING_MAP_SAVINGS = {
    'salary': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '+5\'000.00',
      currency: 'CHF',
      to: 'Employer AG\nTechnikumstrasse 1\n8401 Winterthur',
      status: 'executed',
      message: 'Salary May 2026'
    },
    'rent': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '-1\'800.00',
      currency: 'CHF',
      to: 'Immobilien AG\nStadthausstrasse 10\n8400 Winterthur',
      status: 'executed',
      message: null
    },
    'transfer to household': {
      type: 'internal',
      title: 'Internal Account Transfer',
      amount: '-320.00',
      currency: 'CHF',
      debit: {
        name: 'Savings account',
        iban: 'CH35 0900 0000 2470 2920 2',
        balance: "CHF 25'000.00",
        icon: '#i-anchor'
      },
      credit: {
        name: 'Household account',
        iban: 'CH35 0900 0000 2470 2920 3',
        balance: "CHF 10'000.00",
        icon: '#i-scissors'
      },
      status: 'executed',
      message: 'Monthly budget'
    },
    'health insurance': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '-380.00',
      currency: 'CHF',
      to: 'Concordia\nGenferstrasse 3\n1002 Lausanne',
      status: 'executed',
      message: null
    },
    'internet & phone': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '-60.00',
      currency: 'CHF',
      to: 'Swisscom AG\nWorkshopstrasse 1\n3050 Bern',
      status: 'executed',
      message: null
    }
  };

  var BOOKING_MAP_DEPOSIT = {
    'interest credit': {
      type: 'domestic',
      title: 'Domestic Payment',
      amount: '+125.00',
      currency: 'CHF',
      to: 'UZ Bank AG\nBahnhofstrasse 1\n8001 Zürich',
      status: 'executed',
      message: 'Interest credit Q2 2026'
    },
    'custody account top-up': {
      type: 'internal',
      title: 'Internal Account Transfer',
      amount: '+5\'000.00',
      currency: 'CHF',
      debit: {
        name: 'Savings account',
        iban: 'CH35 0900 0000 2470 2920 2',
        balance: "CHF 25'000.00",
        icon: '#i-anchor'
      },
      credit: {
        name: 'Custody account',
        iban: '123,456.78',
        balance: "CHF 20'000.00",
        icon: '#i-life-buoy'
      },
      status: 'executed',
      message: 'Monthly Custody account top-up'
    }
  };

  function getBookingMap() {
    var account = window.__UZ_ACTIVE_ACCOUNT__ || 'household';
    if (account === 'savings') return BOOKING_MAP_SAVINGS;
    if (account === 'deposit') return BOOKING_MAP_DEPOSIT;
    return BOOKING_MAP_HOUSEHOLD;
  }

  /* ── DOM refs ───────────────────────────────────────────────── */

  var overlay       = document.getElementById('uz-payment-details-overlay');
  if (!overlay) return;

  var shell         = overlay.querySelector('.modal-shell');
  var modal         = overlay.querySelector('.modal--payment-details');
  var titleEl       = document.getElementById('uz-pd-title');
  var amountEl      = document.getElementById('uz-pd-amount');
  var currencyEl    = document.getElementById('uz-pd-currency');
  var toValueEl     = document.getElementById('uz-pd-to-value');

  var debitNameEl      = document.getElementById('uz-pd-debit-name');
  var debitIbanEl      = document.getElementById('uz-pd-debit-iban');
  var debitBalCurrEl   = document.getElementById('uz-pd-debit-balance-currency');
  var debitBalValueEl  = document.getElementById('uz-pd-debit-balance-value');
  var debitIconUse     = overlay.querySelector('#uz-pd-debit-icon use');

  var creditNameEl     = document.getElementById('uz-pd-credit-name');
  var creditIbanEl     = document.getElementById('uz-pd-credit-iban');
  var creditBalCurrEl  = document.getElementById('uz-pd-credit-balance-currency');
  var creditBalValueEl = document.getElementById('uz-pd-credit-balance-value');
  var creditIconUse    = overlay.querySelector('#uz-pd-credit-icon use');

  var statusIconUse = overlay.querySelector('#uz-pd-status-icon use');
  var statusTextEl  = document.getElementById('uz-pd-status-text');

  var furtherToggle  = document.getElementById('uz-pd-further-toggle');
  var furtherContent = document.getElementById('uz-pd-further-content');
  var messageValEl   = document.getElementById('uz-pd-message-value');

  var closeBtn    = overlay.querySelector('.uz-pd-close');
  var confirmBtn  = overlay.querySelector('.uz-pd-confirm');

  var isClosing = false;
  var pendingEditStep = null;
  var currentPaymentData = null; /* snapshot of the last openOverlay() call */
  var currentBookingId   = null; /* data-booking-id of the tapped row, or null for static mocks */
  var currentRow         = null; /* the actual .booking-row DOM node that was tapped */

  /* ── Balance string helpers ──────────────────────────────────── */

  /**
   * Splits "CHF 25'000.00" → { currency: 'CHF', value: "25'000.00" }.
   * Falls back gracefully if the string doesn't start with a 3-letter code.
   */
  function splitBalance(bal) {
    if (!bal) return { currency: '', value: '' };
    var parts = bal.trim().split(/\s+/);
    if (parts.length >= 2 && /^[A-Z]{3}$/.test(parts[0])) {
      return { currency: parts[0], value: parts.slice(1).join(' ') };
    }
    return { currency: '', value: bal };
  }

  /* ── Recipient catalog lookup ────────────────────────────────── */

  /**
   * Try to find a full recipient object by display name.
   * Searches window.__UZ_CANONICAL_RECIPIENT_ROWS__ (exported by payment-state.js).
   * Returns null when no match is found.
   */
  function findRecipientByName(name) {
    var catalog = window.__UZ_CANONICAL_RECIPIENT_ROWS__;
    if (!Array.isArray(catalog) || !name) return null;
    var needle = name.toLowerCase().trim();
    for (var i = 0; i < catalog.length; i++) {
      if ((catalog[i].name || '').toLowerCase().trim() === needle) return catalog[i];
    }
    return null;
  }

  /* ── Open / close ─────────────────────────────────────────────── */

  function openOverlay(data) {
    isClosing = false;
    currentPaymentData = data; // remember for edit-context export

    // Title
    if (titleEl) titleEl.textContent = data.title || 'Payment details';

    // Amount + currency
    if (amountEl)   amountEl.textContent   = data.amount   || '';
    if (currencyEl) currencyEl.textContent = data.currency || 'CHF';

    // Variant class (controls which sections are visible via CSS)
    if (modal) {
      modal.classList.remove('pd--domestic', 'pd--internal');
      modal.classList.add(data.type === 'internal' ? 'pd--internal' : 'pd--domestic');
    }

    // Domestic: "to" value
    if (toValueEl && data.to) {
      toValueEl.innerHTML = data.to.replace(/\n/g, '<br>');
    }

    // Internal: debit / credit account rows
    if (data.type === 'internal' && data.debit && data.credit) {
      if (debitNameEl)  debitNameEl.textContent  = data.debit.name;
      if (debitIbanEl)  debitIbanEl.textContent  = data.debit.iban;
      if (debitIconUse) debitIconUse.setAttribute('href', data.debit.icon);
      var debitParts = splitBalance(data.debit.balance);
      if (debitBalCurrEl)  debitBalCurrEl.textContent  = debitParts.currency;
      if (debitBalValueEl) debitBalValueEl.textContent = debitParts.value;

      if (creditNameEl)  creditNameEl.textContent  = data.credit.name;
      if (creditIbanEl)  creditIbanEl.textContent  = data.credit.iban;
      if (creditIconUse) creditIconUse.setAttribute('href', data.credit.icon);
      var creditParts = splitBalance(data.credit.balance);
      if (creditBalCurrEl)  creditBalCurrEl.textContent  = creditParts.currency;
      if (creditBalValueEl) creditBalValueEl.textContent = creditParts.value;
    }

    // Status chip
    var isPending = data.status !== 'executed';
    if (statusIconUse) statusIconUse.setAttribute('href', isPending ? '#i-clock' : '#i-check');
    if (statusTextEl)  statusTextEl.textContent = isPending ? 'Pending' : 'Executed';

    // Show edit buttons only for pending payments
    if (modal) modal.classList.toggle('pd--pending', isPending);

    // Further options / message — always starts collapsed per design
    if (furtherToggle)  furtherToggle.setAttribute('aria-expanded', 'false');
    if (furtherContent) furtherContent.hidden = true;
    if (messageValEl)   messageValEl.textContent = data.message || '';

    // Slide overlay in
    if (shell) {
      shell.classList.remove('modal-shell--closing');
      shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    }
    overlay.classList.add('modal-overlay--active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body--payment-open');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!shell) return;
        shell.classList.remove('modal-shell--no-transition');
        shell.offsetHeight; // force reflow
        shell.classList.remove('modal-shell--offscreen');
      });
    });
  }

  function closeOverlay() {
    if (isClosing || !overlay.classList.contains('modal-overlay--active')) {
      finishClose(); return;
    }
    isClosing = true;

    if (shell) {
      shell.classList.remove('modal-shell--offscreen', 'modal-shell--no-transition');
      shell.offsetHeight;
      shell.classList.add('modal-shell--closing');

      var resolved = false;
      function onTransitionEnd(e) {
        if (e.target !== shell || e.propertyName !== 'transform') return;
        if (resolved) return;
        resolved = true;
        shell.removeEventListener('transitionend', onTransitionEnd);
        finishClose();
      }
      shell.addEventListener('transitionend', onTransitionEnd);
      // Fallback in case transitionend doesn't fire
      window.setTimeout(function () {
        if (resolved) return;
        resolved = true;
        shell.removeEventListener('transitionend', onTransitionEnd);
        finishClose();
      }, 300);
    } else {
      isClosing = false;
      finishClose();
    }
  }

  function finishClose() {
    isClosing = false;
    overlay.classList.remove('modal-overlay--active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body--payment-open');
    if (shell) {
      shell.classList.remove('modal-shell--closing');
      shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    }
    // If an edit button triggered the close, write edit context then open
    // the payment flow at the correct step.
    if (pendingEditStep) {
      var step = pendingEditStep;
      pendingEditStep = null;

      // Export current payment data so payment-overlay.js can pre-seed live.*
      if (currentPaymentData) {
        var d = currentPaymentData;
        // Parse absolute amount value (strip sign, apostrophes, spaces)
        var amtStr = String(d.amount || '').replace(/[^0-9.]/g, '');
        var amtNum = parseFloat(amtStr) || 0;
        // Recipient name is the first line of the "to" field
        var recipientName = d.type === 'domestic' && d.to
          ? d.to.split('\n')[0].trim()
          : '';
        // Try to find the full recipient record from the catalog
        var fullRecipient = findRecipientByName(recipientName);

        window.__UZ_PD_EDIT_CONTEXT__ = {
          bookingId:     currentBookingId,       // null for static mocks
          staticRow:     currentBookingId ? null : currentRow, // hide after commit
          recipientName: recipientName,
          recipient:     fullRecipient || null,  // full catalog record if found
          amount:        amtNum,
          currency:      d.currency || 'CHF',
          targetStep:    step
        };
      }

      window.setTimeout(function () {
        location.hash = '#pay/' + step;
      }, 0);
    }
  }

  /* ── Expander toggle ─────────────────────────────────────────── */

  if (furtherToggle && furtherContent) {
    furtherToggle.addEventListener('click', function () {
      var expanded = furtherToggle.getAttribute('aria-expanded') === 'true';
      furtherToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      furtherContent.hidden = expanded;
    });
  }

  /* ── Close / Confirm buttons ─────────────────────────────────── */

  if (closeBtn)   closeBtn.addEventListener('click',   closeOverlay);
  if (confirmBtn) confirmBtn.addEventListener('click', closeOverlay);

  /* ── Edit buttons → open payment flow ───────────────────────── */

  document.addEventListener('click', function (e) {
    var editBtn = e.target.closest('[data-pd-edit]');
    if (!editBtn) return;
    if (!overlay.classList.contains('modal-overlay--active')) return;
    pendingEditStep = editBtn.getAttribute('data-pd-edit');
    closeOverlay();
  });

  /* ── Tap a booking row to open the overlay ───────────────────── */

  document.addEventListener('click', function (e) {
    var row = e.target.closest('.booking-row');
    if (!row) return;

    // Don't open if any other overlay is already active
    if (document.body.classList.contains('body--payment-open')) return;

    var nameEl = row.querySelector('.booking-row__name');
    var name   = nameEl ? nameEl.textContent.trim().toLowerCase() : '';

    // Track the row and booking ID so the edit flow can update in-place
    // (or hide this static row after a new booking is committed)
    currentRow       = row;
    currentBookingId = row.getAttribute('data-booking-id') || null;

    // Dynamic rows (data-booking-id present) always use live DOM values — never
    // the static BOOKING_MAP, even if the recipient name happens to match a key
    // (e.g. a dynamically-committed "Apple" payment after editing the mock row).
    var data = currentBookingId ? null : getBookingMap()[name];

    if (!data) {
      // Fallback: dynamic booking row (added by data-render.js after a payment)
      var curEl  = row.querySelector('.booking-row__currency');
      var valEl  = row.querySelector('.booking-row__value');
      var recipientName = nameEl ? nameEl.textContent.trim() : '';

      // Enrich with full address from the recipient catalog if available
      var fullRecipient = findRecipientByName(recipientName);
      var toStr = fullRecipient
        ? fullRecipient.name + '\n' + fullRecipient.street + '\n' + fullRecipient.city
        : recipientName;

      data = {
        type:     'domestic',
        title:    'Domestic Payment',
        amount:   valEl  ? valEl.textContent.trim()  : '',
        currency: curEl  ? curEl.textContent.trim()  : 'CHF',
        to:       toStr,
        status:   'pending',
        message:  null
      };
    }

    // Dynamic override: "yesterday" group → always executed
    var group = row.closest('.booking-group');
    var day   = group ? group.getAttribute('data-day') : null;
    if (day === 'yesterday' && data.status !== 'executed') {
      data = Object.assign({}, data, { status: 'executed' });
    }

    openOverlay(data);
  });

})();
