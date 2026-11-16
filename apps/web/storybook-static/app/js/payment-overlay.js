/**
 * Payment flow as modal overlay + URL sync (HTML5 history / hash).
 * Keeps the user on the current page (dark scrim, underlying context) while updating
 * location.hash to #pay/<step> so paths stay trackable (Maze, GA, etc.).
 *
 * Hash segments: #pay/recipient-search | recipient | amount | schedule | summary | confirmation
 * (Screen manifests live under ../../../designs/screens/payment-flow-* — e.g. Type Ahead Search, Time Schedule.)
 *
 * Depends on js/payment-state.js (window.UZBankPayState.getRecipients) being loaded before this script
 * on every page that includes the payment modal.
 */
(window.onDocumentReady || function (fn) {
  document.addEventListener('DOMContentLoaded', fn);
})(function () {
  var modalOverlay = document.querySelector('.modal-overlay');
  if (!modalOverlay) return;

  var modalCard = modalOverlay.querySelector('.modal');

  var modalShell = document.querySelector('.modal-shell');
  var modalTitle = document.querySelector('.modal__title');
  var modalBack = document.querySelector('.modal__back');
  var modalClose = document.querySelector('.modal__close');
  /* Scope to payment steps only — IAT uses .modal__step[data-iat-step] in #uz-iat-overlay */
  var modalSteps = modalOverlay.querySelectorAll('.modal__step[data-step]');
  var modalFooter = document.querySelector('.modal__footer');
  var modalConfirmBtn = modalFooter ? modalFooter.querySelector('[data-payment-confirm]') : null;
  var confirmationOverlay = document.querySelector('.confirmation-overlay');

  var paymentScrollChrome =
    modalCard && window.UZBankScrollEdgeChrome
      ? window.UZBankScrollEdgeChrome.bind(modalCard, {
          getScrollEl: function (root) {
            var active = root.querySelector('.modal__step--active');
            if (!active) return null;
            if (active.getAttribute('data-step') === 'recipient-search') {
              return active.querySelector('.recipient-search__list') || active;
            }
            return active;
          }
        })
      : null;

  function refreshPaymentScrollChrome() {
    if (!paymentScrollChrome) return;
    requestAnimationFrame(function () {
      paymentScrollChrome.update();
    });
  }

  var STEPS = ['recipient-search', 'recipient', 'amount', 'schedule', 'summary'];
  var STEP_TITLES = {
    'recipient-search': 'Type Ahead Search',
    recipient: 'Recipient',
    amount: 'Amount',
    schedule: 'Time Schedule',
    summary: 'Summary'
  };

  var currentStep = 0;
  var prevStepIndexForTransition = null;
  var paymentFlowClosing = false;
  /** Set when Execute records the payment; Pay's history entries from before it then close the flow
   *  instead of reopening a step, so Back can't record it again (roadmap 41, D4) */
  var flowConfirmed = false;
  /** Avoid pushing history while applying popstate/hash sync */
  var syncingRoute = false;
  /** Set to a booking ID when the flow was opened via an edit button;
   *  null for brand-new payments. Controls commit vs. update on execute. */
  var editingBookingId  = null;
  /** The id of the built-in row an edit replaces once committed (roadmap 42, D4). */
  var editingStaticRow  = null;
  var editingInstance   = null; /* a standing order's next payment: { ruleId, occurrence } (roadmap 47, D10) */
  var droppedEdits      = [];   /* dates of the edited next payments an edit of the standing order replaced (roadmap 68, D4) */

  /* ── DATA WIRING (added in _10) ─────────────────────────────────────
   * Each modal__step block is templated HTML. We track the "live" payment
   * data here and stamp it into the appropriate step DOM whenever a step
   * becomes active (or before commit). Single source of truth lives in
   * window.UZBankPayState which also persists bookings + the running
   * Household balance.
   * ──────────────────────────────────────────────────────────────── */

  var DEFAULT_AMOUNT  = 500.00;
  var DEFAULT_CURRENCY = 'CHF';

  function formatTodayDate() {
    var d = new Date();
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var yyyy = String(d.getFullYear());
    return dd + '.' + mm + '.' + yyyy;
  }

  /* The toggle's own date: the next working day (roadmap 40, D2) */
  function asapLabel() {
    var picker = window.UZBankDatePicker;
    return picker ? picker.asapLabel(false) : formatTodayDate();
  }

  var live = {
    recipient: null,
    amount: DEFAULT_AMOUNT,
    currency: DEFAULT_CURRENCY,
    dateLabel: asapLabel(),  // default execute-on = the next working day (toggle ON, roadmap 40, D2)
    debitKey: 'household'         // the account it books from: Household, or an edited row's own (roadmap 59, D4)
  };

  /* The accounts Pay can book from (roadmap 59, D6): the card shows what gets booked */
  var DEBIT_ACCOUNTS = {
    household: { name: 'Household', iban: 'CH35 0900 0000 2470 2920 1', icon: '#i-home' },
    savings:   { name: 'Savings account', iban: 'CH35 0900 0000 2470 2920 2', icon: '#i-anchor' }
  };

  function debitAccount() {
    return DEBIT_ACCOUNTS[live.debitKey] || DEBIT_ACCOUNTS.household;
  }

  /* Every Debit account card in Pay names live.debitKey; data-render.js paints its balance from data-debit-key */
  function paintDebitAccount() {
    var acc = debitAccount();
    var balance = debitBalance();
    modalOverlay.querySelectorAll('.modal--payment-flow .debit-account').forEach(function (el) {
      el.setAttribute('data-debit-key', DEBIT_ACCOUNTS[live.debitKey] ? live.debitKey : 'household');
      var use = el.querySelector('.debit-account__icon use');
      if (use) use.setAttribute('href', acc.icon);
      var name = el.querySelector('.debit-account__name');
      if (name) name.textContent = acc.name;
      var iban = el.querySelector('.debit-account__iban');
      if (iban) iban.textContent = acc.iban;
      var val = el.querySelector('.debit-account__amount-value');
      if (val && balance !== null) val.textContent = fmt(balance);
    });
  }

  function fmt(n) {
    if (window.UZBankPayState && window.UZBankPayState.formatMoney) {
      return window.UZBankPayState.formatMoney(n);
    }
    return Number(n).toFixed(2);
  }

  function $step(name) {
    var sel = '.modal__step[data-step="' + name + '"]';
    var scoped = modalOverlay.querySelector(sel);
    return scoped || document.querySelector(sel);
  }

  function syncAmountCurrencyDisplay() {
    var step = $step('amount');
    if (!step) return;
    var curEl = step.querySelector('.amount-input__currency span');
    if (curEl) curEl.textContent = live.currency;
  }

  document.addEventListener('uz:payment-currency-change', function (e) {
    if (!e.detail || typeof e.detail.currency !== 'string') return;
    var c = e.detail.currency.trim().toUpperCase();
    if (!c) return;
    live.currency = c;
    syncAmountCurrencyDisplay();
    paintSummaryStep();
    paintConfirmationDialog();
  });

  /** Search field lives in .modal__nav (Type Ahead Search step), not inside the step panel. */
  function recipientSearchInput() {
    return modalOverlay.querySelector('.recipient-search__input');
  }

  function recipientSearchFieldWrap() {
    return modalOverlay.querySelector('.recipient-search__field-wrap');
  }

  function fieldInStep(step, idx) {
    if (!step) return null;
    return step.querySelectorAll('.form-field')[idx] || null;
  }

  /** What the schedule step chose: a recurring or standing order, a later payment
   *  ("as soon as possible" off) or one that runs now. */
  function scheduleStatus() {
    var step = $step('schedule');
    if (!step) return 'executed';
    var active = step.querySelector('.segmented__option--active');
    var mode = active ? active.textContent.trim() : 'Single';
    if (mode !== 'Single') return 'recurring';
    var toggle = step.querySelector('.toggle');
    return toggle && !toggle.classList.contains('toggle--active') ? 'pending' : 'executed';
  }

  function resetPaymentDefaults() {
    live.amount = DEFAULT_AMOUNT;
    live.currency = DEFAULT_CURRENCY;
    live.dateLabel = asapLabel();
    live.debitKey = 'household';
    resetScheduleToggleOn();
    var firstMode = $step('schedule') && $step('schedule').querySelectorAll('.segmented__option');
    if (firstMode) firstMode.forEach(function (b, i) { b.classList.toggle('segmented__option--active', i === 0); });
  }

  /** Recipient step — fills IBAN, Bank, Name, Street, City, Country */
  function paintRecipientStep() {
    var step = $step('recipient'); if (!step || !live.recipient) return;
    var fields = step.querySelectorAll('.form-field');
    var v0 = fields[0] && fields[0].querySelector('.form-field__value');
    var v1 = fields[1] && fields[1].querySelector('.form-field__value');
    var inName = fields[2] && fields[2].querySelector('.form-field__input');
    var inStreet = fields[3] && fields[3].querySelector('.form-field__input');
    var inCity = fields[4] && fields[4].querySelector('.form-field__input');
    var sel = step.querySelector('#recipient-country');
    if (v0) v0.textContent = live.recipient.iban;
    if (v1) v1.textContent = live.recipient.bank;
    if (inName) inName.value = live.recipient.name;
    if (inStreet) inStreet.value = live.recipient.street;
    if (inCity) inCity.value = live.recipient.city;
    if (sel) {
      var match = Array.prototype.find.call(sel.options, function (o) { return o.value === live.recipient.country; });
      sel.value = match ? live.recipient.country : sel.value;
    }
  }

  /** Amount step — recipient name + amount input value */
  function paintAmountStep() {
    var step = $step('amount'); if (!step) return;
    var fields = step.querySelectorAll('.form-field');
    var recipName = fields[0] && fields[0].querySelector('.form-field__value');
    var amtInput = step.querySelector('.amount-input__value');
    if (recipName && live.recipient) recipName.textContent = live.recipient.name;
    if (amtInput) amtInput.value = fmt(live.amount);
    paintDebitAccount();
    recheckAmount(); /* a shown error follows a schedule changed since (roadmap 54, D10) */
    syncAmountCurrencyDisplay();
    syncAmountInputClearVisibility();
  }

  /** Schedule step: the chosen recipient's name (roadmap 29). The toggle and the Execute on field follow each other
   *  (roadmap 40): with "as soon as possible" on, the field shows the next working day; off, the later date (the one
   *  picked or carried in, else the next day that differs). The field always opens the calendar. The displayed date
   *  is also propagated into live.dateLabel so summary + confirmation pick it up. */
  function paintScheduleStep() {
    var step = $step('schedule'); if (!step) return;
    var recipName = step.querySelector('.form-field .form-field__value');
    if (recipName && live.recipient) recipName.textContent = live.recipient.name;
    var toggle = step.querySelector('.toggle');
    var isAsap = toggle ? toggle.classList.contains('toggle--active') : true;
    var picker = window.UZBankDatePicker;
    if (isAsap) live.dateLabel = asapLabel();
    else if (picker) live.dateLabel = picker.laterLabel(live.dateLabel, false);
    if (toggle) {
      toggle.setAttribute('role', 'switch');
      toggle.setAttribute('aria-checked', isAsap ? 'true' : 'false');
      toggle.setAttribute('aria-label', 'As soon as possible');
    }
    var dateBtn = step.querySelector('[data-execute-on]');
    var dateValue = dateBtn && dateBtn.querySelector('.form-field__value');
    if (dateValue) dateValue.textContent = live.dateLabel;
    if (picker) picker.syncField(dateBtn, live.dateLabel);
  }

  /** Say the toggle's state and date to a screen reader (roadmap 40, D7). Called on a change, not on first paint. */
  function announceSchedule() {
    var step = $step('schedule'); if (!step) return;
    var toggle = step.querySelector('.toggle');
    var row = toggle && toggle.closest('.toggle-row');
    if (!row) return;
    var live_ = step.querySelector('[data-schedule-live]');
    if (!live_) {
      live_ = document.createElement('p');
      live_.className = 'visually-hidden';
      live_.setAttribute('aria-live', 'polite');
      live_.setAttribute('data-schedule-live', '');
      row.insertAdjacentElement('afterend', live_);
    }
    var on = toggle.classList.contains('toggle--active');
    live_.textContent = 'As soon as possible ' + (on ? 'on' : 'off') + ', executes on ' + live.dateLabel;
  }

  /** Force the schedule step's "as soon as possible" toggle into the ON
   *  state. Called when a brand-new payment flow opens so each session
   *  starts in the default state regardless of where the user left it. */
  function resetScheduleToggleOn() {
    var step = $step('schedule'); if (!step) return;
    var toggle = step.querySelector('.toggle');
    var thumb = step.querySelector('.toggle__thumb');
    if (toggle && !toggle.classList.contains('toggle--active')) toggle.classList.add('toggle--active');
    if (thumb && !thumb.classList.contains('toggle__thumb--active')) thumb.classList.add('toggle__thumb--active');
  }

  /** Set the schedule step to an edited booking's schedule (roadmap 23, D3, D4): pending opens on Single with
   *  "as soon as possible" off and its date, recurring on Recurring (the booking doesn't store Standing order);
   *  anything else on the defaults. */
  function seedScheduleFromBooking(status, executeOn) {
    var step = $step('schedule'); if (!step) return;
    var later = status === 'pending' || status === 'recurring';
    var modeIdx = status === 'recurring' ? 1 : 0;
    step.querySelectorAll('.segmented__option').forEach(function (b, i) {
      b.classList.toggle('segmented__option--active', i === modeIdx);
    });
    var toggle = step.querySelector('.toggle');
    var thumb = step.querySelector('.toggle__thumb');
    if (toggle) toggle.classList.toggle('toggle--active', !later);
    if (thumb) thumb.classList.toggle('toggle__thumb--active', !later);
    live.dateLabel = later && executeOn ? executeOn : asapLabel();
  }

  /** Summary step — amount, date, recipient, debit account (its balance also follows data-render.js) */
  function paintSummaryStep() {
    var step = $step('summary'); if (!step) return;
    var fields = step.querySelectorAll('.form-field');
    var amt = fields[0] && fields[0].querySelector('.form-field__value');
    var date = fields[1] && fields[1].querySelector('.form-field__value');
    var rec = fields[2] && fields[2].querySelector('.form-field__value');
    if (amt) amt.textContent = live.currency + '  ' + fmt(live.amount);
    if (date) date.textContent = live.dateLabel;
    if (rec && live.recipient) rec.textContent = live.recipient.name;
    paintDebitAccount();
  }

  /** Confirmation dialog: what happened in one sentence, then the amount */
  function paintConfirmationDialog() {
    var dlg = confirmationOverlay && confirmationOverlay.querySelector('.confirmation-dialog');
    if (!dlg) return;
    var sum = dlg.querySelector('.confirmation-dialog__sum');
    var cur = dlg.querySelector('.confirmation-dialog__currency');
    var message = dlg.querySelector('.confirmation-dialog__message');
    if (sum) sum.textContent = fmt(live.amount);
    if (cur) cur.textContent = live.currency;
    /* Done now, made on a later date, or recurring from a date (roadmap 15), with the date in the sentence (roadmap 41,
     * D11). The schedule step names Recurring and Standing order apart, so the sentence does too. */
    var status = scheduleStatus();
    var step = $step('schedule');
    var active = step && step.querySelector('.segmented__option--active');
    var mode = active ? active.textContent.trim() : 'Single';
    var to = live.recipient && live.recipient.name ? ' to ' + live.recipient.name : '';
    if (message) {
      message.textContent = status === 'executed' ? 'Your payment' + to + ' will be executed on ' + live.dateLabel + '.'
        : status === 'recurring'
          ? (mode === 'Standing order' ? 'Your standing order' : 'Your recurring payment') + to + ' starts on ' + live.dateLabel + '.'
          : 'Your payment' + to + ' will be made on ' + live.dateLabel + '.';
    }
    /* An edit of a standing order replaces its edited next payments; say so (roadmap 68, D4) */
    var note = dlg.querySelector('.confirmation-dialog__note');
    if (note) {
      var dates = droppedEdits.filter(Boolean);
      note.textContent = dates.length ? 'The earlier change to the payment on ' + dates.join(', ') + ' was replaced.' : '';
      note.hidden = !dates.length;
    }
  }

  function pickRecipientForNewFlow() {
    if (window.UZBankPayState && window.UZBankPayState.pickRandomRecipient) {
      live.recipient = window.UZBankPayState.pickRandomRecipient();
    }
    resetPaymentDefaults();
  }

  function normalizeIban(s) {
    return String(s || '')
      .replace(/[\s\u00a0\u202f]+/g, '')
      .toLowerCase();
  }

  function alnumKey(s) {
    return String(s || '')
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase();
  }

  /** Visible + logical trim for `<input type="search">` (strip ZW chars / BOM). */
  function normalizeRecipientSearchInput(s) {
    return String(s || '')
      .replace(/[\u200b\u200c\u200d\ufeff\u00ad]/g, '')
      .trim();
  }

  /** Whitespace-only is treated as empty (avoids wiping SSR rows). */
  function recipientSearchWasTyped(query) {
    return /\S/.test(normalizeRecipientSearchInput(query));
  }

  /** PayState first, preload catalog optional, canonical export fallback. */
  function recipientCatalogRows() {
    try {
      if (window.UZBankPayState && typeof window.UZBankPayState.getRecipients === 'function') {
        var pr = window.UZBankPayState.getRecipients();
        if (Array.isArray(pr) && pr.length > 0) return pr.slice();
      }
    } catch (_e) {}
    try {
      var c = window.UZ_BANK_RECIPIENT_CATALOG;
      if (Array.isArray(c) && c.length > 0) return c.slice();
    } catch (_e2) {}
    try {
      var canon = window.__UZ_CANONICAL_RECIPIENT_ROWS__;
      if (Array.isArray(canon) && canon.length > 0) return canon.slice();
    } catch (_e3) {}
    return [];
  }

  function iconHrefForRecipient(r) {
    if (r && (r.id === 'anna-ricci' || r.country === 'IT')) return '#i-sunrise-logo';
    return '#i-user';
  }

  function filterRecipients(query) {
    var raw = normalizeRecipientSearchInput(query);
    var all = recipientCatalogRows();
    if (!recipientSearchWasTyped(query)) return all.slice();
    var q = raw.toLowerCase();
    var needle = alnumKey(q);
    if (!needle) return all.slice();
    return all.filter(function (r) {
      var name = (r.name || '').toLowerCase();
      var iban = normalizeIban(r.iban);
      var ibanFlat = alnumKey(r.iban);
      var bank = (r.bank || '').toLowerCase();
      var country = (r.country || '').toLowerCase();
      var rid = (r.id || '').toLowerCase();
      if (name.indexOf(q) >= 0) return true;
      if (country.indexOf(q) >= 0) return true;
      if (bank.indexOf(q) >= 0) return true;
      if (rid.indexOf(q) >= 0) return true;
      return iban.indexOf(needle) >= 0 || ibanFlat.indexOf(needle) >= 0;
    });
  }

  function paintRecipientSearchList() {
    var step = $step('recipient-search');
    if (!step) return;
    var list = step.querySelector('.recipient-search__list');
    var empty = step.querySelector('.recipient-search__empty');
    var input = recipientSearchInput();
    if (!list) return;
    var qRaw = input ? input.value : '';
    var rows = [];
    try {
      rows = filterRecipients(qRaw);
    } catch (_paintFilterErr) {
      rows = recipientCatalogRows();
    }
    var hasTyped = recipientSearchWasTyped(qRaw);
    if (rows.length === 0 && !hasTyped && list.querySelector('.recipient-search__result[data-recipient-id]')) {
      if (empty) empty.classList.add('recipient-search__empty--hidden');
      return;
    }
    list.innerHTML = '';
    rows.forEach(function (r) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'recipient-search__result';
      btn.setAttribute('data-recipient-id', r.id);
      btn.setAttribute('role', 'option');
      var svgNs = 'http://www.w3.org/2000/svg';
      var icon = document.createElementNS(svgNs, 'svg');
      icon.setAttribute('class', 'recipient-search__result-icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      var use = document.createElementNS(svgNs, 'use');
      var ih = iconHrefForRecipient(r);
      use.setAttribute('href', ih);
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', ih);
      icon.appendChild(use);
      var body = document.createElement('span');
      body.className = 'recipient-search__result-body';
      var nm = document.createElement('span');
      nm.className = 'recipient-search__result-name';
      nm.textContent = r.name;
      var ib = document.createElement('span');
      ib.className = 'recipient-search__result-iban';
      ib.textContent = r.iban;
      body.appendChild(nm);
      body.appendChild(ib);
      var chev = document.createElementNS(svgNs, 'svg');
      chev.setAttribute('class', 'recipient-search__result-chevron');
      chev.setAttribute('aria-hidden', 'true');
      var uc = document.createElementNS(svgNs, 'use');
      uc.setAttribute('href', '#i-chevron-right');
      uc.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#i-chevron-right');
      chev.appendChild(uc);
      btn.appendChild(icon);
      btn.appendChild(body);
      btn.appendChild(chev);
      list.appendChild(btn);
    });
    if (empty) {
      if (rows.length === 0 && hasTyped) empty.classList.remove('recipient-search__empty--hidden');
      else empty.classList.add('recipient-search__empty--hidden');
    }
  }

  function syncRecipientSearchClearVisibility() {
    var input = recipientSearchInput();
    var clearBtn = modalOverlay.querySelector('.recipient-search__clear');
    var wrap = recipientSearchFieldWrap();
    if (!input || !clearBtn || !wrap) return;
    var focused = wrap.contains(document.activeElement);
    if (focused && input.value.length > 0) clearBtn.classList.remove('recipient-search__clear--hidden');
    else clearBtn.classList.add('recipient-search__clear--hidden');
  }

  function syncOneRecipientDetailClear(wrap) {
    if (!wrap || !wrap.classList.contains('form-field__text-wrap')) return;
    var input = wrap.querySelector('.form-field__input');
    var btn = wrap.querySelector('.form-field__clear');
    if (!input || !btn) return;
    var focused = wrap.contains(document.activeElement);
    if (focused && input.value.length > 0) btn.classList.remove('form-field__clear--hidden');
    else btn.classList.add('form-field__clear--hidden');
  }

  function syncRecipientDetailClears(step) {
    if (!step || step.getAttribute('data-step') !== 'recipient') return;
    step.querySelectorAll('.form-field__text-wrap').forEach(syncOneRecipientDetailClear);
  }

  function syncAmountInputClearVisibility() {
    var step = $step('amount');
    if (!step) return;
    var wrap = step.querySelector('.amount-input');
    var input = step.querySelector('.amount-input__value');
    var btn = step.querySelector('.amount-input__clear');
    if (!wrap || !input || !btn) return;
    var focused = wrap.contains(document.activeElement);
    if (focused && input.value.length > 0) btn.classList.remove('amount-input__clear--hidden');
    else btn.classList.add('amount-input__clear--hidden');
  }

  /* ── Amount errors (roadmap 54) ───────────────────────────────────
   * The amount is checked when focus leaves it after typing (D4), live once
   * its error shows, and on Confirm (D5). The balance is checked at Execute for
   * a payment that runs now; from then on the amount step checks it too (D10).
   * Leaving the field by pressing close, back or an edit link checks nothing (D6). */

  var amountTyped = false;
  var amountBalanceChecked = false;
  var amountLeavePressed = false;

  function amountParts() {
    var step = $step('amount');
    var input = step && step.querySelector('.amount-input__value');
    return input ? { step: step, input: input, field: input.closest('.form-field') } : null;
  }

  /* The running balance of the account Pay books from (roadmap 59, D7) */
  function debitBalance() {
    var pay = window.UZBankPayState;
    if (!pay || typeof pay.getState !== 'function') return null;
    var amount = (pay.getState().accountBalances || {})[DEBIT_ACCOUNTS[live.debitKey] ? live.debitKey : 'household'];
    return typeof amount === 'number' ? amount : null;
  }

  /* D7, D8, D10, D14 */
  function amountProblem(p, withBalance) {
    var trimmed = String(p.input.value || '').trim();
    if (!trimmed) return 'Enter an amount.';
    var n = parseFloat(trimmed.replace(/[^0-9.,-]/g, '').replace(',', '.'));
    if (isNaN(n) || n <= 0) return 'Enter an amount above 0.';
    if (withBalance && scheduleStatus() === 'executed') {
      var balance = debitBalance();
      if (balance !== null && n > balance) return 'You have CHF ' + fmt(balance) + ' in ' + debitAccount().name + '.';
    }
    return null;
  }

  function checkAmount(focus) {
    var p = amountParts();
    var fe = window.UZBankFieldError;
    if (!p || !p.field || !fe) return true;
    var msg = amountProblem(p, amountBalanceChecked);
    if (msg) fe.show(p.field, p.input, msg);
    else fe.clear(p.field, p.input);
    if (msg && focus) {
      try { p.input.focus(); } catch (err) { /* ignore */ }
    }
    return !msg;
  }

  function recheckAmount() {
    var p = amountParts();
    if (p && p.field && window.UZBankFieldError && window.UZBankFieldError.isShown(p.field)) checkAmount(false);
  }

  function clearAmountError() {
    amountTyped = false;
    amountBalanceChecked = false;
    var p = amountParts();
    if (p && p.field && window.UZBankFieldError) window.UZBankFieldError.clear(p.field, p.input);
  }

  /* Execute of a payment that runs now and is over the balance: back to the amount step (D10) */
  function amountOverBalanceAtExecute() {
    var p = amountParts();
    if (!p || scheduleStatus() !== 'executed') return false;
    var balance = debitBalance();
    if (balance === null || !(live.amount > balance)) return false;
    amountBalanceChecked = true;
    currentStep = STEPS.indexOf('amount');
    pushPayUrl('amount');
    showStep();
    checkAmount(true);
    return true;
  }

  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest || !modalOverlay.contains(e.target)) return;
    if (!e.target.closest('.modal__close, .modal__back, [data-payment-nav]')) return;
    amountLeavePressed = true;
    window.setTimeout(function () { amountLeavePressed = false; }, 400);
  });

  document.addEventListener('focusout', function (e) {
    var wrap = e.target.closest && e.target.closest('.modal__step[data-step="amount"] .amount-input');
    if (!wrap || !amountTyped) return;
    var to = e.relatedTarget;
    if (to && (wrap.contains(to) || to === modalClose || to === modalBack)) return;
    requestAnimationFrame(function () {
      if (amountLeavePressed || paymentFlowClosing || !modalOverlay.classList.contains('modal-overlay--active')) return;
      if (STEPS[currentStep] !== 'amount' || wrap.contains(document.activeElement)) return;
      checkAmount(false);
    });
  });

  function ensureFlowSeeded() {
    var stepName = STEPS[currentStep];
    if (stepName === 'recipient-search') return;
    var rIdx = STEPS.indexOf('recipient');
    if (rIdx >= 0 && STEPS.indexOf(stepName) >= rIdx && !live.recipient) {
      pickRecipientForNewFlow();
    }
  }

  // Listen on amount input (delegated, since steps are reused across pages)
  document.addEventListener('input', function (e) {
    if (e.target.classList && e.target.classList.contains('recipient-search__input') && e.target.closest('.modal-overlay')) {
      paintRecipientSearchList();
      syncRecipientSearchClearVisibility();
      return;
    }
    var recipientStep = e.target.closest && e.target.closest('.modal__step[data-step="recipient"]');
    if (recipientStep && e.target.classList && e.target.classList.contains('form-field__input')) {
      var wrap = e.target.closest('.form-field__text-wrap');
      if (wrap) syncOneRecipientDetailClear(wrap);
      return;
    }
    var step = e.target.closest && e.target.closest('.modal__step[data-step="amount"]');
    if (!step) return;
    if (!e.target.classList || !e.target.classList.contains('amount-input__value')) return;
    var trimmed = String(e.target.value).trim();
    if (trimmed.length === 0) {
      live.amount = 0;
    } else {
      var raw = trimmed.replace(/[^0-9.,-]/g, '').replace(',', '.');
      var n = parseFloat(raw);
      if (!isNaN(n) && n >= 0) live.amount = n;
    }
    amountTyped = true;
    recheckAmount();
    syncAmountInputClearVisibility();
  });

  document.addEventListener('click', function (e) {
    var clearBtn = e.target.closest && e.target.closest('.recipient-search__clear');
    if (!clearBtn) return;
    if (!clearBtn.closest('.modal-overlay')) return;
    var searchStep = $step('recipient-search');
    if (!searchStep || !searchStep.classList.contains('modal__step--active')) return;
    e.preventDefault();
    var input = recipientSearchInput();
    if (input) input.value = '';
    syncRecipientSearchClearVisibility();
    paintRecipientSearchList();
    if (input) input.focus();
  });

  document.addEventListener('click', function (e) {
    var clearBtn = e.target.closest && e.target.closest('.form-field__clear');
    if (!clearBtn) return;
    var wrap = clearBtn.closest('.form-field__text-wrap');
    var step = clearBtn.closest('.modal__step[data-step="recipient"]');
    if (!wrap || !step) return;
    e.preventDefault();
    var input = wrap.querySelector('.form-field__input');
    if (input) {
      input.value = '';
      input.focus();
    }
    syncOneRecipientDetailClear(wrap);
  });

  document.addEventListener('click', function (e) {
    var amtClear = e.target.closest && e.target.closest('.amount-input__clear');
    if (!amtClear) return;
    var wrap = amtClear.closest('.amount-input');
    var step = amtClear.closest('.modal__step[data-step="amount"]');
    if (!wrap || !step) return;
    e.preventDefault();
    var input = wrap.querySelector('.amount-input__value');
    if (input) {
      input.value = '';
      live.amount = 0;
      amountTyped = true;
      recheckAmount();
      input.focus();
    }
    syncAmountInputClearVisibility();
  });

  document.addEventListener('focusin', function (e) {
    if (e.target.closest && e.target.closest('.recipient-search__field-wrap')) {
      syncRecipientSearchClearVisibility();
    }
    var wrap = e.target.closest && e.target.closest('.modal__step[data-step="recipient"] .form-field__text-wrap');
    if (wrap) syncOneRecipientDetailClear(wrap);
    if (e.target.closest && e.target.closest('.modal__step[data-step="amount"] .amount-input')) {
      syncAmountInputClearVisibility();
    }
  });

  document.addEventListener('focusout', function (e) {
    if (e.target.closest && e.target.closest('.recipient-search__field-wrap')) {
      setTimeout(syncRecipientSearchClearVisibility, 0);
    }
    var wrap = e.target.closest && e.target.closest('.modal__step[data-step="recipient"] .form-field__text-wrap');
    if (wrap) setTimeout(function () { syncOneRecipientDetailClear(wrap); }, 0);
    if (e.target.closest && e.target.closest('.modal__step[data-step="amount"] .amount-input')) {
      setTimeout(syncAmountInputClearVisibility, 0);
    }
  });

  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('.recipient-search__result');
    if (!row) return;
    var step = row.closest('.modal__step[data-step="recipient-search"]');
    if (!step) return;
    e.preventDefault();
    var rid = row.getAttribute('data-recipient-id');
    var all = recipientCatalogRows();
    var found = null;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === rid) { found = all[i]; break; }
    }
    if (!found) return;
    live.recipient = found;
    var nextIdx = STEPS.indexOf('recipient');
    if (nextIdx < 0) return;
    currentStep = nextIdx;
    pushPayUrl(STEPS[currentStep]);
    showStep();
  });

  /** Schedule step's "As soon as possible" toggle — when flipped, repaint
   *  the Execute on field. We defer with setTimeout(0) so the generic
   *  toggle handler in app-mp.js (which adds/removes .toggle--active) has
   *  finished updating the class before we read it. */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest && e.target.closest('.toggle');
    if (!toggle) return;
    var step = toggle.closest('.modal__step[data-step="schedule"]');
    if (!step) return;
    setTimeout(function () { paintScheduleStep(); announceSchedule(); }, 0);
  });

  /** "Execute on" opens the calendar for a later payment (roadmap 28, D1, D4). */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.modal__step[data-step="schedule"] [data-execute-on]');
    if (!btn || btn.disabled || !window.UZBankFormSheet || !window.UZBankFormSheet.openDateSheet) return;
    window.UZBankFormSheet.openDateSheet(btn, {
      selected: window.UZBankDatePicker.parseLabel(live.dateLabel),
      onPick: function (date) {
        /* The toggle's own date keeps it on, any other turns it off (roadmap 40, D4) */
        var picker = window.UZBankDatePicker;
        var label = picker.formatLabel(date);
        var step = $step('schedule');
        var toggle = step && step.querySelector('.toggle');
        var thumb = step && step.querySelector('.toggle__thumb');
        var on = label === picker.asapLabel(false);
        if (toggle) toggle.classList.toggle('toggle--active', on);
        if (thumb) thumb.classList.toggle('toggle__thumb--active', on);
        live.dateLabel = label;
        paintScheduleStep();
        announceSchedule();
      }
    });
  });

  /** Explicit payment navigation from edit buttons. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.form-field__edit[data-payment-nav]');
    if (!btn) return;
    var seg = btn.getAttribute('data-payment-nav');
    if (!seg) return;
    var idx = STEPS.indexOf(seg);
    if (idx < 0) return;
    e.preventDefault();
    currentStep = idx;
    pushPayUrl(STEPS[currentStep]);
    showStep();
    setTimeout(function () {
      if (seg === 'recipient-search') {
        var inp = recipientSearchInput();
        if (inp) inp.focus();
      } else if (seg === 'recipient') {
        var stepEl = $step('recipient');
        var nameInp = stepEl && stepEl.querySelector('.form-field__input');
        if (nameInp) nameInp.focus();
      }
    }, 30);
  });

  /** Summary step — each trailing edit returns to the step where that value
   *  is edited: Amount → amount, Execute on → schedule, Recipient → recipient. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.form-field__edit');
    if (!btn) return;
    var summary = btn.closest('.modal__step[data-step="summary"]');
    if (!summary) return;
    var hostField = btn.closest('.form-field');
    if (!hostField) return;
    var fields = summary.querySelectorAll('.form-field');
    var fieldIdx = -1;
    for (var i = 0; i < fields.length; i++) {
      if (fields[i] === hostField) {
        fieldIdx = i;
        break;
      }
    }
    var targetSeg = null;
    if (fieldIdx === 0) targetSeg = 'amount';
    else if (fieldIdx === 1) targetSeg = 'schedule';
    else if (fieldIdx === 2) targetSeg = 'recipient';
    else return;
    e.preventDefault();
    var stepIdx = STEPS.indexOf(targetSeg);
    if (stepIdx < 0) return;
    currentStep = stepIdx;
    pushPayUrl(targetSeg);
    showStep();
    setTimeout(function () {
      var stepEl = $step(targetSeg);
      if (!stepEl) return;
      if (targetSeg === 'amount') {
        var amt = stepEl.querySelector('.amount-input__value');
        if (amt) {
          amt.focus();
          if (amt.select) amt.select();
        }
      } else if (targetSeg === 'schedule') {
        /* "Execute on" while it opens the calendar, else the toggle that makes it (roadmap 28) */
        var dateRow = stepEl.querySelector('[data-execute-on]');
        var target = dateRow && !dateRow.disabled ? dateRow : stepEl.querySelector('.toggle');
        if (target) target.focus();
      } else if (targetSeg === 'recipient') {
        var nameInp = stepEl.querySelector('.form-field__input');
        if (nameInp) nameInp.focus();
      }
    }, 30);
  });

  function parsePaySegment() {
    var m = (location.hash || '').match(/^#pay\/(.+)/);
    return m ? m[1] : null;
  }

  function pushPayUrl(segment) {
    var url = location.pathname + location.search + '#pay/' + segment;
    history.pushState({ uzBankPay: true, segment: segment }, '', url);
    notifyScreen();
  }

  function replaceCleanUrl() {
    var clean = location.pathname + location.search;
    history.replaceState(history.state, '', clean);
  }

  function notifyScreen() {
    if (window.UZBankAnalytics && typeof window.UZBankAnalytics.screen === 'function') {
      window.UZBankAnalytics.screen();
    }
  }

  function openModalVisual() {
    if (!modalOverlay.classList.contains('modal-overlay--active')) {
      prevStepIndexForTransition = null;
      hideConfirmationVisual();
      if (modalShell) {
        modalShell.classList.remove('modal-shell--closing');
        modalShell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
      }
      modalOverlay.classList.add('modal-overlay--active');
      document.body.classList.add('body--payment-open');
      if (window.UZBankSheetFocus) window.UZBankSheetFocus.open(modalOverlay);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (!modalShell) return;
          modalShell.classList.remove('modal-shell--no-transition');
          modalShell.offsetHeight;
          modalShell.classList.remove('modal-shell--offscreen');
          refreshPaymentScrollChrome();
        });
      });
    }
  }

  function finishClose() {
    paymentFlowClosing = false;
    currentStep = 0;
    prevStepIndexForTransition = null;
    editingBookingId = null;
    editingStaticRow = null;
    editingInstance = null;
    clearAmountError();
    showStep();
    modalOverlay.classList.remove('modal-overlay--active', 'modal-overlay--closing');
    document.body.classList.remove('body--payment-open');
    hideConfirmationVisual();
    if (modalFooter) modalFooter.style.display = '';
    if (modalShell) {
      modalShell.classList.remove('modal-shell--closing');
      modalShell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    }
    if (window.UZBankSheetFocus) window.UZBankSheetFocus.close(modalOverlay);
    notifyScreen();
  }

  function closeModal() {
    if (!modalOverlay || paymentFlowClosing) return;

    function runFinish() {
      replaceCleanUrl();
      finishClose();
    }

    if (!modalOverlay.classList.contains('modal-overlay--active')) {
      runFinish();
      return;
    }

    paymentFlowClosing = true;
    modalOverlay.classList.add('modal-overlay--closing');

    if (modalShell) {
      modalShell.classList.remove('modal-shell--offscreen', 'modal-shell--no-transition');
      modalShell.offsetHeight;
      modalShell.classList.add('modal-shell--closing');

      /* Ends on the slide, a fallback timer, or at once with reduced motion (roadmap 35) */
      window.UZBankAfterSheetClose(modalShell, runFinish);
    } else {
      paymentFlowClosing = false;
      runFinish();
    }
  }

  function showStep() {
    var stepName = STEPS[currentStep];
    var prev = prevStepIndexForTransition;
    var shouldAnimSteps = prev !== null && prev !== currentStep;

    modalSteps.forEach(function (step) {
      step.classList.remove('modal__step--active', 'modal__step--play-in-f', 'modal__step--play-in-b');
      if (step.dataset.step === stepName) {
        step.classList.add('modal__step--active');
        if (shouldAnimSteps) {
          var forward = currentStep > prev;
          step.offsetHeight;
          step.classList.add(forward ? 'modal__step--play-in-f' : 'modal__step--play-in-b');
          step.addEventListener('animationend', function onStepAnim(e) {
            if (e.target !== step) return;
            if (e.animationName !== 'modalStepInForward' && e.animationName !== 'modalStepInBack') return;
            step.removeEventListener('animationend', onStepAnim);
            step.classList.remove('modal__step--play-in-f', 'modal__step--play-in-b');
          });
        }
      }
    });

    prevStepIndexForTransition = currentStep;

    if (modalTitle) modalTitle.textContent = STEP_TITLES[stepName] || '';

    if (modalCard) {
      modalCard.classList.toggle('modal--recipient-search-active', stepName === 'recipient-search');
    }
    if (modalTitle) {
      if (stepName === 'recipient-search') modalTitle.setAttribute('aria-hidden', 'true');
      else modalTitle.removeAttribute('aria-hidden');
    }

    if (modalBack) {
      if (currentStep === 0) modalBack.classList.add('modal__back--hidden');
      else modalBack.classList.remove('modal__back--hidden');
    }

    if (modalConfirmBtn) {
      modalConfirmBtn.textContent = stepName === 'summary' ? 'Execute' : 'Confirm';
    }

    if (modalFooter) {
      modalFooter.style.display = stepName === 'recipient-search' ? 'none' : '';
    }

    // Refresh whichever step just became active so it reflects live data
    ensureFlowSeeded();
    if (stepName === 'recipient-search') {
      paintRecipientSearchList();
      syncRecipientSearchClearVisibility();
      requestAnimationFrame(function () {
        paintRecipientSearchList();
        syncRecipientSearchClearVisibility();
        refreshPaymentScrollChrome();
      });
    } else if (stepName === 'recipient') {
      paintRecipientStep();
      syncRecipientDetailClears($step('recipient'));
    } else if (stepName === 'amount') paintAmountStep();
    else if (stepName === 'schedule') paintScheduleStep();
    else if (stepName === 'summary') paintSummaryStep();

    refreshPaymentScrollChrome();
  }

  function showConfirmationVisual() {
    paintConfirmationDialog();
    if (!confirmationOverlay) return;
    confirmationOverlay.classList.add('confirmation-overlay--visible');
    /* The sheet behind goes inert and Done takes focus (roadmap 41, D1, D2) */
    if (window.UZBankConfirmFocus) {
      window.UZBankConfirmFocus.open(confirmationOverlay, confirmationOverlay.querySelector('[data-action="done"]'));
    }
  }

  function hideConfirmationVisual() {
    if (!confirmationOverlay) return;
    confirmationOverlay.classList.remove('confirmation-overlay--visible');
    if (window.UZBankConfirmFocus) window.UZBankConfirmFocus.close(confirmationOverlay);
  }

  function syncRouteFromLocation() {
    var seg = parsePaySegment();
    syncingRoute = true;

    try {
      if (!seg) {
        if (modalOverlay.classList.contains('modal-overlay--active')) {
          // The user navigated back out of the payment flow (back button /
          // hash cleared). If we have something worth protecting (edit mode
          // or a recipient already chosen), intercept: restore the hash so
          // the URL stays inside the flow, then ask the user what to do.
          /* After Execute nothing is left to discard (roadmap 41, D4) */
          var worthProtecting = !flowConfirmed && !!(editingBookingId || editingStaticRow || live.recipient);
          if (worthProtecting && !paymentFlowClosing &&
              typeof window.UZBankPaymentExitPrompt === 'function') {
            // Restore the hash so the browser URL reflects that we're still
            // inside the flow while the dialog is open.
            var restoreSeg = STEPS[currentStep] || STEPS[0];
            syncingRoute = true;
            history.pushState({ uzBankPay: true, segment: restoreSeg }, '',
              location.pathname + location.search + '#pay/' + restoreSeg);
            syncingRoute = false;
            promptExitFlow(function () {
              paymentFlowClosing = false;
              hideConfirmationVisual();
              replaceCleanUrl();
              finishClose();
            });
            return;
          }
          paymentFlowClosing = false;
          hideConfirmationVisual();
          finishClose();
        }
        return;
      }

      /* Pay's own history entry after the payment is recorded: Back (or Forward) closes, as Done does (roadmap 41, D4).
         A fresh address (the booking sheet's Edit, a typed one) has no state and opens as usual. */
      var ownEntry = !!(history.state && history.state.uzBankPay);
      if (!ownEntry || window.__UZ_PD_EDIT_CONTEXT__) flowConfirmed = false;
      if (flowConfirmed && (seg === 'confirmation' || STEPS.indexOf(seg) >= 0)) {
        hideConfirmationVisual();
        replaceCleanUrl();
        if (modalOverlay.classList.contains('modal-overlay--active')) finishClose();
        return;
      }

      if (seg === 'confirmation') {
        openModalVisual();
        currentStep = STEPS.length - 1;
        prevStepIndexForTransition = null;
        showStep();
        showConfirmationVisual();
        notifyScreen();
        return;
      }

      var idx = STEPS.indexOf(seg);
      if (idx < 0) return;

      // ── Edit context from payment-details overlay ──────────────────
      // When the user taps "Edit amount" or "Edit recipient" in the
      // payment-details sheet, payment-details.js writes this context
      // before setting the hash. Consume it here to pre-seed live.*
      // so the flow opens pre-populated instead of with defaults.
      var editCtx = window.__UZ_PD_EDIT_CONTEXT__;
      if (editCtx) {
        delete window.__UZ_PD_EDIT_CONTEXT__;
        editingBookingId = editCtx.bookingId  || null;
        editingStaticRow = editCtx.builtInId  || null; /* a built-in row's id (roadmap 42, D4) */
        editingInstance  = editCtx.ruleId && editCtx.occurrence ? { ruleId: editCtx.ruleId, occurrence: editCtx.occurrence } : null;
        /* An edit or a copy books from the row's own account (roadmap 59, D4, D5) */
        live.debitKey = DEBIT_ACCOUNTS[editCtx.accountKey] ? editCtx.accountKey : 'household';

        // Amount — parse just in case it was stored as a string
        seedScheduleFromBooking(editCtx.status, editCtx.executeOn);

        var ctxAmount = typeof editCtx.amount === 'number'
          ? editCtx.amount
          : parseFloat(String(editCtx.amount).replace(/[^0-9.]/g, '')) || DEFAULT_AMOUNT;
        live.amount   = ctxAmount > 0 ? ctxAmount : DEFAULT_AMOUNT;
        live.currency = editCtx.currency || DEFAULT_CURRENCY;

        // Recipient — use the full catalog record if available; otherwise
        // synthesise a minimal object so paintRecipientStep / paintAmountStep
        // can display the name without crashing.
        if (editCtx.recipient) {
          live.recipient = editCtx.recipient;
        } else if (editCtx.recipientName) {
          // Last-resort: look up by name ourselves
          var ctxCatalog = recipientCatalogRows();
          var ctxNeedle  = editCtx.recipientName.toLowerCase().trim();
          var ctxFound   = null;
          for (var ci = 0; ci < ctxCatalog.length; ci++) {
            if ((ctxCatalog[ci].name || '').toLowerCase().trim() === ctxNeedle) {
              ctxFound = ctxCatalog[ci]; break;
            }
          }
          live.recipient = ctxFound || {
            id: 'custom', name: editCtx.recipientName,
            iban: '', bank: '', street: '', city: '', country: 'CH'
          };
        }
      }
      // ──────────────────────────────────────────────────────────────

      hideConfirmationVisual();
      openModalVisual();
      currentStep = idx;
      prevStepIndexForTransition = null;
      showStep();
      notifyScreen();

      // When the flow opens directly at the amount step (e.g. via the
      // "Edit amount" button in the payment-details overlay), put focus
      // on the amount input and select all so the user can type immediately.
      if (seg === 'amount') {
        window.setTimeout(function () {
          var stepEl = $step('amount');
          if (!stepEl) return;
          var amtInput = stepEl.querySelector('.amount-input__value');
          if (amtInput) { amtInput.focus({ preventScroll: true }); if (amtInput.select) amtInput.select(); }
        }, 60);
      }
    } finally {
      syncingRoute = false;
    }
  }

  function advanceStep() {
    if (confirmationOverlay && confirmationOverlay.classList.contains('confirmation-overlay--visible')) {
      return;
    }

    var activeName = STEPS[currentStep];
    if (activeName === 'recipient-search') {
      return;
    }

    if (activeName === 'amount' && !checkAmount(true)) return;

    if (currentStep < STEPS.length - 1) {
      currentStep++;
      pushPayUrl(STEPS[currentStep]);
      showStep();
    } else {
      // Last step is summary → "Execute":
      //   • Editing an existing booking → update it in-place (no duplicate)
      //   • New payment → commit as a fresh booking
      if (amountOverBalanceAtExecute()) return;
      if (live.recipient) {
        var payData = {
          recipient: live.recipient,
          amount:    live.amount,
          currency:  live.currency,
          dateISO:   new Date().toISOString(),
          status:    scheduleStatus(),
          executeOn: live.dateLabel,
          accountKey: live.debitKey
        };
        droppedEdits = [];
        if (editingBookingId && window.UZBankPayState && window.UZBankPayState.updatePayment) {
          droppedEdits = window.UZBankPayState.updatePayment(editingBookingId, payData) || [];
        } else if (window.UZBankPayState && window.UZBankPayState.commitPayment) {
          /* An edit of a built-in row: the new booking replaces it, also after a reload (roadmap 42, D4) */
          if (editingStaticRow) payData.replacesBuiltIn = editingStaticRow;
          /* It stands in for that one payment of the rule; the rule stays (roadmap 47, D10) */
          if (editingInstance) {
            payData.ruleId = editingInstance.ruleId;
            payData.occurrence = editingInstance.occurrence;
          }
          droppedEdits = window.UZBankPayState.commitPayment(payData) || [];
        }
        editingBookingId = null;
        editingStaticRow = null;
        editingInstance = null;
      }
      flowConfirmed = true;
      pushPayUrl('confirmation');
      showConfirmationVisual();
      notifyScreen();
    }
  }

  document.addEventListener('click', function (e) {
    var payBtn = e.target.closest('[data-action="pay"]');
    if (!payBtn) return;
    e.preventDefault();
    live.recipient = null;
    editingBookingId = null; // always a fresh payment from the pay button
    flowConfirmed = false;
    resetPaymentDefaults();
    clearAmountError();
    currentStep = 0;
    prevStepIndexForTransition = null;
    hideConfirmationVisual();
    var rs = $step('recipient-search');
    if (rs) {
      var inp = recipientSearchInput();
      if (inp) inp.value = '';
      var clr = modalOverlay.querySelector('.recipient-search__clear');
      if (clr) clr.classList.add('recipient-search__clear--hidden');
    }
    pushPayUrl(STEPS[0]);
    openModalVisual();
    showStep();
  });

  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', function () {
      advanceStep();
    });
  }

  if (modalBack) {
    modalBack.addEventListener('click', function () {
      if (confirmationOverlay && confirmationOverlay.classList.contains('confirmation-overlay--visible')) {
        history.back();
        return;
      }
      history.back();
    });
  }

  /** Show the exit-confirmation dialog with copy appropriate for the current
   *  mode (new payment vs. editing an existing one), then call exitFn only
   *  if the user chooses to leave. Falls back to immediate exit when the
   *  dialog helper is not available (e.g. script load order issue). */
  function promptExitFlow(exitFn) {
    if (typeof window.UZBankPaymentExitPrompt !== 'function') {
      exitFn();
      return;
    }
    var isEdit = !!(editingBookingId || editingStaticRow || editingInstance);
    /* Each prompt names its own task; the dialog's defaults are neutral (roadmap 30) */
    window.UZBankPaymentExitPrompt(exitFn, isEdit ? {
      title:      'Discard changes?',
      message:    'Your pending edits will not be saved if you exit now.',
      leaveLabel: 'Discard',
      stayLabel:  'Continue editing',
      escapeStays: true
    } : {
      title:      'Discard payment?',
      message:    'You have not finished this payment. If you exit now your entries will not be submitted.',
      leaveLabel: 'Discard',
      stayLabel:  'Continue payment',
      escapeStays: true
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', function (e) {
      e.preventDefault();
      function runExitFromFlow() {
        hideConfirmationVisual();
        closeModal();
      }
      // Recipient search is a pre-flow step: nothing has been chosen yet, so there
      // is nothing to discard — close straight away (edit mode never starts here).
      if (STEPS[currentStep] === 'recipient-search' && !editingBookingId && !editingStaticRow && !editingInstance) {
        runExitFromFlow();
        return;
      }
      promptExitFlow(runExitFromFlow);
    });
  }

  /* Escape does what the close button does; on the confirmation after Execute, what Done does (roadmap 49, D1, D4) */
  if (window.UZBankSheetFocus && window.UZBankSheetFocus.onEscape) {
    window.UZBankSheetFocus.onEscape(modalOverlay, function () {
      var done = confirmationOverlay && confirmationOverlay.classList.contains('confirmation-overlay--visible')
        ? confirmationOverlay.querySelector('[data-action="done"]') : null;
      if (done) done.click();
      else if (modalClose) modalClose.click();
    });
  }

  document.addEventListener('click', function (e) {
    var doneBtn = e.target.closest('[data-action="done"]');
    if (!doneBtn) return;
    hideConfirmationVisual();
    closeModal();
  });

  /* Do not close on scrim tap — exit via × (with confirm), Back, or Done only. */

  window.addEventListener('popstate', syncRouteFromLocation);
  window.addEventListener('hashchange', syncRouteFromLocation);

  window.addEventListener('pageshow', function (ev) {
    if (!ev.persisted) return;
    if (!modalOverlay.classList.contains('modal-overlay--active')) return;
    if (parsePaySegment() !== 'recipient-search') return;
    requestAnimationFrame(function () {
      paintRecipientSearchList();
      syncRecipientSearchClearVisibility();
    });
  });

  syncRouteFromLocation();
});
