/**
 * Internal Account Transfer flow overlay
 * Hash: #iat/recipient | #iat/schedule | #iat/summary | #iat/confirmation
 *
 * Triggered by [data-action="iat"] buttons.
 * Steps live in #uz-iat-overlay .modal__step[data-iat-step="<name>"].
 */
(function () {
  'use strict';

  /* ── Account catalogue ─────────────────────────────────────────── */

  var ACCOUNTS = {
    household: {
      key: 'household',
      name: 'Household',
      iban: 'CH35 0900 0000 2470 2920 1',
      balance: "10'000.00",
      currency: 'CHF',
      icon: '#i-home'
    },
    savings: {
      key: 'savings',
      name: 'Savings Account',
      iban: 'CH35 0900 0000 2470 2920 2',
      balance: "25'000.00",
      currency: 'CHF',
      icon: '#i-anchor'
    },
    deposit: {
      key: 'deposit',
      name: 'Deposit',
      iban: '123,456.78',
      balance: "20'000.00",
      currency: 'CHF',
      icon: '#i-life-buoy'
    }
  };

  window.__UZ_IAT_ACCOUNTS__ = ACCOUNTS;

  /* ── Step order ────────────────────────────────────────────────── */

  var STEPS = ['recipient', 'schedule', 'summary'];
  var STEP_TITLES = {
    recipient: 'Amount & recipient',
    schedule: 'Time schedule',
    summary: 'Summary'
  };

  /* ── DOM refs ──────────────────────────────────────────────────── */

  var overlay = document.getElementById('uz-iat-overlay');
  if (!overlay) return;

  var shell         = overlay.querySelector('.modal-shell');
  var titleEl       = document.getElementById('uz-iat-title');
  var backBtn       = document.getElementById('uz-iat-back');
  var closeBtn      = document.getElementById('uz-iat-close');
  var confirmBtn    = document.getElementById('uz-iat-confirm-btn');
  var steps         = overlay.querySelectorAll('.modal__step[data-iat-step]');

  /* Step 0 – recipient */
  var amountInput   = document.getElementById('uz-iat-amount-input');
  var amountClear   = document.getElementById('uz-iat-amount-clear');
  var currencyLabel = document.getElementById('uz-iat-currency-label');
  var fromIcon      = overlay.querySelector('#uz-iat-from-icon use');
  var fromName      = document.getElementById('uz-iat-from-name');
  var fromIban      = document.getElementById('uz-iat-from-iban');
  var fromCurrency  = document.getElementById('uz-iat-from-currency');
  var fromBalance   = document.getElementById('uz-iat-from-balance');

  var toIcon        = overlay.querySelector('#uz-iat-to-icon use');
  var toName        = document.getElementById('uz-iat-to-name');
  var toIban        = document.getElementById('uz-iat-to-iban');
  var toCurrency    = document.getElementById('uz-iat-to-currency');
  var toBalance     = document.getElementById('uz-iat-to-balance');

  /* Step 1 – schedule */
  var immediatelyToggle = document.getElementById('uz-iat-immediately-toggle');
  var dateValue         = document.getElementById('uz-iat-date-value');
  var executeOnField    = document.getElementById('uz-iat-execute-on-field');

  /* Step 2 – summary */
  var summaryAmount      = document.getElementById('uz-iat-summary-amount');
  var summaryDate        = document.getElementById('uz-iat-summary-date');
  var summaryToIcon      = overlay.querySelector('#uz-iat-summary-to-icon use');
  var summaryToName      = document.getElementById('uz-iat-summary-to-name');
  var summaryToIban      = document.getElementById('uz-iat-summary-to-iban');
  var summaryToCurrency  = document.getElementById('uz-iat-summary-to-currency');
  var summaryToBalance   = document.getElementById('uz-iat-summary-to-balance');
  var summaryFromIcon    = overlay.querySelector('#uz-iat-summary-from-icon use');
  var summaryFromName    = document.getElementById('uz-iat-summary-from-name');
  var summaryFromIban    = document.getElementById('uz-iat-summary-from-iban');
  var summaryFromCurrency = document.getElementById('uz-iat-summary-from-currency');
  var summaryFromBalance  = document.getElementById('uz-iat-summary-from-balance');

  /* Confirmation dialog */
  var confOverlay    = overlay.querySelector('.confirmation-overlay');
  var confCurrency   = document.getElementById('uz-iat-conf-currency');
  var confAmount     = document.getElementById('uz-iat-conf-amount');
  var confRecipient  = document.getElementById('uz-iat-conf-recipient');
  var confBtn        = document.getElementById('uz-iat-conf-btn');

  var fromBtn        = document.getElementById('uz-iat-from-btn');
  var toBtn          = document.getElementById('uz-iat-to-btn');

  /* ── Live state ────────────────────────────────────────────────── */

  var live = {
    currency: 'CHF',
    amount: 500.00,
    fromKey: 'savings',
    toKey: 'household',
    immediately: true,
    dateLabel: ''
  };

  /* ── Helpers ───────────────────────────────────────────────────── */

  function formatAmount(n) {
    return Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  function formatTodayDate() {
    var d = new Date();
    return String(d.getDate()).padStart(2, '0') + '.' +
           String(d.getMonth() + 1).padStart(2, '0') + '.' +
           d.getFullYear();
  }

  function activeStep() {
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].classList.contains('modal__step--active')) return steps[i];
    }
    return null;
  }

  function currentStepName() {
    var s = activeStep();
    return s ? s.getAttribute('data-iat-step') : null;
  }

  function pickOtherKey(exclude) {
    return Object.keys(ACCOUNTS).find(function (k) { return k !== exclude; }) || exclude;
  }

  function accountToSheet(acc) {
    return {
      key: acc.key,
      icon: String(acc.icon || '').replace(/^#/, ''),
      name: acc.name,
      iban: acc.iban,
      sheetCur: acc.currency,
      sheetVal: acc.balance
    };
  }

  function openAccountPicker(role, triggerEl) {
    if (!window.UZBankFormSheet || !window.UZBankFormSheet.openAccountPickerSheet || !triggerEl) return;
    var sheetAccounts = Object.keys(ACCOUNTS).map(function (k) {
      return accountToSheet(ACCOUNTS[k]);
    });
    window.UZBankFormSheet.openAccountPickerSheet(triggerEl, {
      title: role === 'from' ? 'Debit account' : 'Credit account',
      accounts: sheetAccounts,
      excludeKey: role === 'to' ? live.fromKey : null,
      onSelect: function (acc) {
        if (!acc || !acc.key) return;
        if (role === 'from') {
          live.fromKey = acc.key;
          if (live.fromKey === live.toKey) live.toKey = pickOtherKey(live.fromKey);
        } else {
          live.toKey = acc.key;
          if (live.toKey === live.fromKey) live.fromKey = pickOtherKey(live.toKey);
        }
        paintRecipientStep();
        paintSummaryStep();
      }
    });
  }

  function commitTransfer() {
    collectRecipientStep();
    if (live.fromKey === live.toKey || live.amount <= 0) return;
    var from = ACCOUNTS[live.fromKey];
    var to = ACCOUNTS[live.toKey];
    if (!from || !to || !window.UZBankPayState || !window.UZBankPayState.commitInternalTransfer) return;
    window.UZBankPayState.commitInternalTransfer({
      fromKey: live.fromKey,
      toKey: live.toKey,
      fromName: from.name,
      toName: to.name,
      amount: live.amount,
      currency: live.currency,
      dateISO: new Date().toISOString()
    });
  }

  /* ── Paint functions ───────────────────────────────────────────── */

  function syncIatAmountClearVisibility() {
    if (!amountInput || !amountClear) return;
    var focused = document.activeElement === amountInput;
    if (focused && amountInput.value.length > 0) {
      amountClear.classList.remove('amount-input__clear--hidden');
    } else {
      amountClear.classList.add('amount-input__clear--hidden');
    }
  }

  function paintRecipientStep() {
    var from = ACCOUNTS[live.fromKey] || ACCOUNTS.savings;
    var to   = ACCOUNTS[live.toKey]   || ACCOUNTS.household;

    if (amountInput) amountInput.value = formatAmount(live.amount);
    if (currencyLabel) currencyLabel.textContent = live.currency;
    syncIatAmountClearVisibility();

    if (fromIcon)    fromIcon.setAttribute('href', from.icon);
    if (fromName)    fromName.textContent  = from.name;
    if (fromIban)    fromIban.textContent  = from.iban;
    if (fromCurrency) fromCurrency.textContent = from.currency;
    if (fromBalance) fromBalance.textContent   = from.balance;

    if (toIcon)     toIcon.setAttribute('href', to.icon);
    if (toName)     toName.textContent    = to.name;
    if (toIban)     toIban.textContent    = to.iban;
    if (toCurrency) toCurrency.textContent = to.currency;
    if (toBalance)  toBalance.textContent  = to.balance;
  }

  function paintScheduleStep() {
    if (live.immediately) live.dateLabel = formatTodayDate();
    if (dateValue) dateValue.textContent = live.dateLabel;
    /* Sync toggle visual */
    if (immediatelyToggle) {
      immediatelyToggle.classList.toggle('toggle--active', live.immediately);
      immediatelyToggle.setAttribute('aria-checked', live.immediately ? 'true' : 'false');
      var thumb = immediatelyToggle.querySelector('.toggle__thumb');
      if (thumb) thumb.classList.toggle('toggle__thumb--active', live.immediately);
    }
    /* Date field: show/hide based on immediately */
    if (executeOnField) executeOnField.hidden = live.immediately;
  }

  function paintSummaryStep() {
    var from = ACCOUNTS[live.fromKey] || ACCOUNTS.savings;
    var to   = ACCOUNTS[live.toKey]   || ACCOUNTS.household;

    if (summaryAmount) summaryAmount.textContent = live.currency + '  ' + formatAmount(live.amount);
    if (summaryDate)   summaryDate.textContent    = live.dateLabel || formatTodayDate();

    if (summaryToIcon)     summaryToIcon.setAttribute('href', to.icon);
    if (summaryToName)     summaryToName.textContent     = to.name;
    if (summaryToIban)     summaryToIban.textContent     = to.iban;
    if (summaryToCurrency) summaryToCurrency.textContent = to.currency;
    if (summaryToBalance)  summaryToBalance.textContent  = to.balance;

    if (summaryFromIcon)     summaryFromIcon.setAttribute('href', from.icon);
    if (summaryFromName)     summaryFromName.textContent     = from.name;
    if (summaryFromIban)     summaryFromIban.textContent     = from.iban;
    if (summaryFromCurrency) summaryFromCurrency.textContent = from.currency;
    if (summaryFromBalance)  summaryFromBalance.textContent  = from.balance;
  }

  function paintConfirmationDialog() {
    var to = ACCOUNTS[live.toKey] || ACCOUNTS.household;
    if (confCurrency)  confCurrency.textContent  = live.currency;
    if (confAmount)    confAmount.textContent     = formatAmount(live.amount);
    if (confRecipient) confRecipient.textContent  = to.name;
  }

  function paintStep(name) {
    if (name === 'recipient') paintRecipientStep();
    if (name === 'schedule')  paintScheduleStep();
    if (name === 'summary')   paintSummaryStep();
  }

  /* ── Step navigation ───────────────────────────────────────────── */

  function collectRecipientStep() {
    if (amountInput) {
      var v = parseFloat(String(amountInput.value).replace(/'/g, ''));
      if (!isNaN(v) && v > 0) live.amount = v;
    }
  }

  function goToStep(name, pushState) {
    /* Collect from current step before leaving */
    var current = currentStepName();
    if (current === 'recipient') collectRecipientStep();

    /* Switch active step */
    steps.forEach(function (s) {
      s.classList.toggle('modal__step--active', s.getAttribute('data-iat-step') === name);
    });

    /* Update nav */
    if (titleEl) titleEl.textContent = STEP_TITLES[name] || name;
    var stepIndex = STEPS.indexOf(name);
    if (backBtn) backBtn.classList.toggle('modal__back--hidden', stepIndex <= 0);

    /* Confirm button label */
    if (confirmBtn) {
      confirmBtn.textContent = name === 'summary' ? 'Execute' : 'Confirm';
    }

    /* Paint the step */
    paintStep(name);

    /* History */
    if (pushState !== false) {
      history.pushState({ iat: name }, '', location.pathname + '#iat/' + name);
    }
  }

  function nextStep() {
    var current = currentStepName();
    if (current === 'recipient') {
      collectRecipientStep();
      if (live.amount <= 0 || live.fromKey === live.toKey) return;
    }
    var idx = STEPS.indexOf(current);
    if (idx < STEPS.length - 1) {
      goToStep(STEPS[idx + 1]);
    } else {
      /* Last step (summary) → show confirmation */
      showConfirmation();
    }
  }

  function prevStep() {
    var current = currentStepName();
    var idx = STEPS.indexOf(current);
    if (idx > 0) {
      goToStep(STEPS[idx - 1]);
    } else {
      closeOverlay();
    }
  }

  /* ── Open / close ──────────────────────────────────────────────── */

  function openOverlay() {
    /* Default debit account = currently active carousel account */
    var activeAccount = window.__UZ_ACTIVE_ACCOUNT__ || 'savings';
    /* Can't transfer to yourself — pick the next account as credit */
    var allKeys = Object.keys(ACCOUNTS);
    live.fromKey = allKeys.indexOf(activeAccount) >= 0 ? activeAccount : 'savings';
    live.toKey = allKeys.find(function (k) { return k !== live.fromKey; }) || 'household';
    live.amount = 500.00;
    live.immediately = true;
    live.dateLabel = formatTodayDate();

    /* Reset to first step */
    goToStep('recipient', false);

    /* Slide in */
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('modal-overlay--active');
    shell.classList.remove('modal-shell--closing');
    shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    document.body.classList.add('body--iat-open');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        shell.classList.remove('modal-shell--offscreen', 'modal-shell--no-transition');
      });
    });

    history.pushState({ iat: 'recipient' }, '', location.pathname + '#iat/recipient');
  }

  function closeOverlay(replaceState) {
    shell.classList.add('modal-shell--closing');
    shell.addEventListener('transitionend', function onEnd() {
      shell.removeEventListener('transitionend', onEnd);
      shell.classList.remove('modal-shell--closing');
      shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('modal-overlay--active');
      document.body.classList.remove('body--iat-open');
    }, { once: true });

    if (replaceState !== false) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  /* ── Confirmation dialog ───────────────────────────────────────── */

  function showConfirmation() {
    paintConfirmationDialog();
    if (confOverlay) {
      confOverlay.setAttribute('aria-hidden', 'false');
      confOverlay.classList.add('confirmation-overlay--visible');
    }
  }

  function hideConfirmation() {
    if (confOverlay) {
      confOverlay.classList.remove('confirmation-overlay--visible');
      confOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  /* ── Event listeners ───────────────────────────────────────────── */

  /* Expose for programmatic triggers (e.g. More functions contextual menu) */
  window.__UZ_IAT_OPEN = openOverlay;

  /* Trigger button(s) */
  document.querySelectorAll('[data-action="iat"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openOverlay();
    });
  });

  /* Back */
  if (backBtn) backBtn.addEventListener('click', prevStep);

  /* Close — ask for confirmation before discarding the flow */
  function promptExit() {
    if (typeof window.UZBankPaymentExitPrompt === 'function') {
      window.UZBankPaymentExitPrompt(function () { closeOverlay(); }, {
        title: 'Discard transfer?',
        message: 'You have not finished this transfer. If you exit now your entries will not be submitted.',
        leaveLabel: 'Discard'
      });
    } else {
      closeOverlay();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', promptExit);

  /* Confirm / Execute / Next */
  if (confirmBtn) confirmBtn.addEventListener('click', nextStep);

  /* Confirmation dialog: Confirm records transfer + closes */
  if (confBtn) confBtn.addEventListener('click', function () {
    commitTransfer();
    hideConfirmation();
    closeOverlay();
  });

  /* Account pickers — menu-accounts sheet (form-field-sheet.js) */
  if (fromBtn) {
    fromBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openAccountPicker('from', fromBtn);
    });
  }
  if (toBtn) {
    toBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openAccountPicker('to', toBtn);
    });
  }

  /* Immediately toggle */
  if (immediatelyToggle) {
    immediatelyToggle.addEventListener('click', function () {
      live.immediately = !live.immediately;
      paintScheduleStep();
    });
  }

  /* Segmented control: Single / Recurring execution */
  var execTypeGroup = document.getElementById('uz-iat-exec-type');
  if (execTypeGroup) {
    execTypeGroup.addEventListener('click', function (e) {
      var btn = e.target.closest('.segmented__option');
      if (!btn) return;
      execTypeGroup.querySelectorAll('.segmented__option').forEach(function (b) {
        b.classList.remove('segmented__option--active');
      });
      btn.classList.add('segmented__option--active');
    });
  }

  /* Summary edit buttons: data-iat-nav="<step>" */
  overlay.addEventListener('click', function (e) {
    var navBtn = e.target.closest('[data-iat-nav]');
    if (!navBtn) return;
    var target = navBtn.getAttribute('data-iat-nav');
    if (STEPS.indexOf(target) >= 0) goToStep(target);
  });

  /* Amount input — clear button visibility (matches payment flow) */
  if (amountInput) {
    amountInput.addEventListener('focus', syncIatAmountClearVisibility);
    amountInput.addEventListener('blur', function () {
      setTimeout(syncIatAmountClearVisibility, 0);
    });
    amountInput.addEventListener('input', syncIatAmountClearVisibility);
  }
  if (amountClear && amountInput) {
    amountClear.addEventListener('click', function (e) {
      e.preventDefault();
      amountInput.value = '';
      live.amount = 0;
      amountInput.focus();
      syncIatAmountClearVisibility();
    });
  }

  overlay.addEventListener('uz:payment-currency-change', function (e) {
    if (!e.detail || typeof e.detail.currency !== 'string') return;
    live.currency = e.detail.currency.trim().toUpperCase() || live.currency;
    if (currencyLabel) currencyLabel.textContent = live.currency;
    paintRecipientStep();
    paintSummaryStep();
  });

  /* Browser back button */
  window.addEventListener('popstate', function (e) {
    if (!e.state || !e.state.iat) {
      if (overlay.getAttribute('aria-hidden') !== 'true') closeOverlay(false);
      return;
    }
    var step = e.state.iat;
    if (STEPS.indexOf(step) >= 0) goToStep(step, false);
  });

  /* Hash on page load (deep link) */
  (function () {
    var hash = location.hash;
    var m = hash.match(/^#iat\/(\w+)$/);
    if (m && STEPS.indexOf(m[1]) >= 0) {
      openOverlay();
      goToStep(m[1], false);
    }
  })();

})();
