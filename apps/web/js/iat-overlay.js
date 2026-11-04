/**
 * Internal Account Transfer flow overlay
 * Hash: #iat/recipient | #iat/schedule | #iat/summary | #iat/confirmation
 *       #iat/fund/<mandateId> opens it prefilled to fund that mandate (roadmap 18, D10)
 *
 * Triggered by [data-action="iat"] buttons.
 * Steps live in #uz-iat-overlay .modal__step[data-iat-step="<name>"].
 */
(function () {
  'use strict';

  /* ── Account catalogue ─────────────────────────────────────────── */

  /* Household and Savings show the running balance from the shared state (the constant is the fallback). */
  function liveBalance(key, fallback) {
    var pay = window.UZBankPayState;
    if (!pay || typeof pay.getState !== 'function') return fallback;
    var amount = (pay.getState().accountBalances || {})[key];
    return amount != null ? pay.formatMoney(amount) : fallback;
  }

  var ACCOUNTS = {
    household: {
      key: 'household',
      name: 'Household',
      iban: 'CH35 0900 0000 2470 2920 1',
      get balance() { return liveBalance('household', "10'000.00"); },
      currency: 'CHF',
      icon: '#i-home'
    },
    savings: {
      key: 'savings',
      name: 'Savings Account',
      iban: 'CH35 0900 0000 2470 2920 2',
      get balance() { return liveBalance('savings', "25'000.00"); },
      currency: 'CHF',
      icon: '#i-anchor'
    },
    deposit: {
      key: 'deposit',
      name: 'Custody account',
      iban: '123,456.78',
      balance: "20'000.00",
      currency: 'CHF',
      icon: '#i-life-buoy'
    }
  };

  window.__UZ_IAT_ACCOUNTS__ = ACCOUNTS;

  /* The accounts a transfer can use. Custody account stays in the catalogue for the details of past bookings, but
     its balance is fixed, so it is no target (roadmap 18, D11). */
  var TRANSFER_KEYS = ['household', 'savings'];

  /* Each asset management mandate is a credit account, keyed by its id (roadmap 18, D1 to D3). Read from the state
     each time, so one opened in the Overview sheet is there without a reload. */
  function mandateAccounts() {
    var pay = window.UZBankPayState;
    if (!pay || typeof pay.getState !== 'function') return [];
    return (pay.getState().mandates || []).map(function (m) {
      return {
        key: m.id,
        name: 'Asset management',
        iban: m.strategyName || m.strategy,
        balance: pay.formatMoney(m.funded || 0),
        currency: 'CHF',
        icon: '#i-trending-up',
        mandate: true,
        suggestedAmount: m.amount
      };
    });
  }

  function accountFor(key) {
    if (ACCOUNTS[key]) return ACCOUNTS[key];
    return mandateAccounts().find(function (a) { return a.key === key; }) || null;
  }

  window.__UZ_IAT_ACCOUNT_FOR__ = accountFor;

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
  var modalCard     = overlay.querySelector('.modal.modal--iat-flow');
  var titleEl       = overlay.querySelector('#uz-iat-title');
  var backBtn       = overlay.querySelector('#uz-iat-back');
  var closeBtn      = overlay.querySelector('#uz-iat-close');
  var confirmBtn    = overlay.querySelector('#uz-iat-confirm-btn');
  var steps         = overlay.querySelectorAll('.modal__step[data-iat-step]');

  var iatScrollChrome =
    modalCard && window.UZBankScrollEdgeChrome
      ? window.UZBankScrollEdgeChrome.bind(modalCard, {
          getScrollEl: function (root) {
            return root.querySelector('.modal__step--active');
          }
        })
      : null;

  function refreshIatScrollChrome() {
    if (!iatScrollChrome) return;
    requestAnimationFrame(function () {
      iatScrollChrome.update();
    });
  }

  /* Step 0 – recipient */
  var amountInput   = overlay.querySelector('#uz-iat-amount-input');
  var amountClear   = overlay.querySelector('#uz-iat-amount-clear');
  var currencyLabel = overlay.querySelector('#uz-iat-currency-label');
  var fromBtn       = overlay.querySelector('#uz-iat-from-btn');
  var toBtn         = overlay.querySelector('#uz-iat-to-btn');

  /* Step 1 – schedule */
  var immediatelyToggle = overlay.querySelector('#uz-iat-immediately-toggle');
  var dateValue         = overlay.querySelector('#uz-iat-date-value');
  var executeOnField    = overlay.querySelector('#uz-iat-execute-on-field');

  /* Step 2 – summary */
  var summaryAmount      = overlay.querySelector('#uz-iat-summary-amount');
  var summaryDate        = overlay.querySelector('#uz-iat-summary-date');
  var summaryToBtn       = overlay.querySelector('[data-iat-step="summary"] [aria-label="Change recipient account"]');
  var summaryFromBtn     = overlay.querySelector('[data-iat-step="summary"] [aria-label="Change debit account"]');

  /* Confirmation dialog */
  var confOverlay    = overlay.querySelector('.confirmation-overlay');
  var confCurrency   = overlay.querySelector('#uz-iat-conf-currency');
  var confAmount     = overlay.querySelector('#uz-iat-conf-amount');
  var confRecipient  = overlay.querySelector('#uz-iat-conf-recipient');
  var confLead       = overlay.querySelector('#uz-iat-conf-lead');
  var confFooter     = overlay.querySelector('#uz-iat-conf-footer');
  var confDate       = overlay.querySelector('#uz-iat-conf-date');
  var confBtn        = overlay.querySelector('#uz-iat-conf-btn');

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
    return TRANSFER_KEYS.find(function (k) { return k !== exclude; }) || exclude;
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
    /* Mandates are credit accounts only (D1), listed after Household and Savings in the order opened (D2) */
    var list = TRANSFER_KEYS.map(function (k) { return ACCOUNTS[k]; });
    if (role === 'to') list = list.concat(mandateAccounts());
    var sheetAccounts = list.map(accountToSheet);
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
          var wasMandate = !!(accountFor(live.toKey) || {}).mandate;
          live.toKey = acc.key;
          /* Funding a mandate starts from Household; Savings can be picked after (D4) */
          if ((accountFor(live.toKey) || {}).mandate && !wasMandate) live.fromKey = 'household';
          if (live.toKey === live.fromKey) live.fromKey = pickOtherKey(live.toKey);
        }
        paintRecipientStep();
        paintSummaryStep();
      }
    });
  }

  /* What the schedule step chose: a recurring transfer, a later one ("immediately" off) or one that runs now. */
  function scheduleStatus() {
    var active = execTypeGroup && execTypeGroup.querySelector('.segmented__option--active');
    if (active && active.getAttribute('data-exec') === 'recurring') return 'recurring';
    return live.immediately ? 'executed' : 'pending';
  }

  function commitTransfer() {
    collectRecipientStep();
    if (live.fromKey === live.toKey || live.amount <= 0) return;
    var from = accountFor(live.fromKey);
    var to = accountFor(live.toKey);
    if (!from || !to || !window.UZBankPayState || !window.UZBankPayState.commitInternalTransfer) return;
    window.UZBankPayState.commitInternalTransfer({
      fromKey: live.fromKey,
      toKey: live.toKey,
      fromName: from.name,
      toName: to.name,
      amount: live.amount,
      currency: live.currency,
      dateISO: new Date().toISOString(),
      status: scheduleStatus(),
      executeOn: live.dateLabel
    });
  }

  function stampDebitAccount(btn, acc) {
    if (!btn || !acc) return;
    var useIcon = btn.querySelector('.debit-account__icon use');
    if (useIcon) useIcon.setAttribute('href', acc.icon);
    var name = btn.querySelector('.debit-account__name');
    if (name) name.textContent = acc.name;
    var iban = btn.querySelector('.debit-account__iban');
    if (iban) iban.textContent = acc.iban;
    var cur = btn.querySelector('.debit-account__amount-currency');
    var val = btn.querySelector('.debit-account__amount-value');
    if (cur) cur.textContent = acc.currency;
    if (val) val.textContent = acc.balance;
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
    var from = accountFor(live.fromKey) || ACCOUNTS.savings;
    var to   = accountFor(live.toKey)   || ACCOUNTS.household;

    if (amountInput) amountInput.value = formatAmount(live.amount);
    if (currencyLabel) currencyLabel.textContent = live.currency;
    syncIatAmountClearVisibility();

    stampDebitAccount(fromBtn, from);
    stampDebitAccount(toBtn, to);
  }

  function paintScheduleStep() {
    var picker = window.UZBankDatePicker;
    /* A later transfer runs on the next working day unless another was picked (roadmap 28, D4) */
    if (live.immediately) live.dateLabel = formatTodayDate();
    else if (picker) live.dateLabel = picker.laterLabel(live.dateLabel);
    if (dateValue) dateValue.textContent = live.dateLabel;
    if (picker) picker.syncField(executeOnField && executeOnField.querySelector('[data-execute-on]'), live.dateLabel, !live.immediately);
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
    var from = accountFor(live.fromKey) || ACCOUNTS.savings;
    var to   = accountFor(live.toKey)   || ACCOUNTS.household;

    if (summaryAmount) summaryAmount.textContent = live.currency + '  ' + formatAmount(live.amount);
    if (summaryDate)   summaryDate.textContent    = live.dateLabel || formatTodayDate();

    stampDebitAccount(summaryToBtn, to);
    stampDebitAccount(summaryFromBtn, from);
  }

  function paintConfirmationDialog() {
    var to = accountFor(live.toKey) || ACCOUNTS.household;
    if (confCurrency)  confCurrency.textContent  = live.currency;
    if (confAmount)    confAmount.textContent     = formatAmount(live.amount);
    if (confRecipient) confRecipient.textContent  = to.name;
    /* Say what happened: done now, made on a later date, or recurring from a date (roadmap 15). */
    var status = scheduleStatus();
    if (confLead)   confLead.textContent   = status === 'recurring' ? 'Your recurring transfer of' : 'Your transfer of';
    if (confFooter) confFooter.textContent = status === 'executed' ? 'is done.' : (status === 'recurring' ? 'starts on' : 'will be made on');
    if (confDate) {
      confDate.textContent = live.dateLabel || formatTodayDate();
      confDate.hidden = status === 'executed';
    }
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
    refreshIatScrollChrome();

    /* History */
    if (pushState !== false) {
      history.pushState({ iat: name }, '', location.pathname + '#iat/' + name);
    }
  }

  function nextStep() {
    /* Execute stays focused behind the confirmation; a second press must not record again (D10) */
    if (confOverlay && confOverlay.classList.contains('confirmation-overlay--visible')) return;
    var current = currentStepName();
    if (current === 'recipient') {
      collectRecipientStep();
      if (live.amount <= 0 || live.fromKey === live.toKey) return;
    }
    var idx = STEPS.indexOf(current);
    if (idx < STEPS.length - 1) {
      goToStep(STEPS[idx + 1]);
    } else {
      /* Last step (summary) → Execute records the transfer, then the confirmation says so (roadmap 15, D10) */
      commitTransfer();
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

  /* prefill (optional): { toKey, fromKey, amount }, e.g. to fund a mandate (roadmap 18, D9, D10). An unknown account
     is ignored, so the transfer opens as usual. */
  function openOverlay(prefill) {
    if (!prefill || typeof prefill !== 'object' || prefill instanceof Event) prefill = null;
    /* Default debit account = currently active carousel account */
    var activeAccount = window.__UZ_ACTIVE_ACCOUNT__ || 'savings';
    /* Can't transfer to yourself — pick the next account as credit */
    live.fromKey = TRANSFER_KEYS.indexOf(activeAccount) >= 0 ? activeAccount : 'savings';
    live.toKey = pickOtherKey(live.fromKey);
    live.amount = 500.00;
    if (prefill && prefill.toKey && accountFor(prefill.toKey)) {
      live.toKey = prefill.toKey;
      live.fromKey = TRANSFER_KEYS.indexOf(prefill.fromKey) >= 0 ? prefill.fromKey : 'household';
      if (live.fromKey === live.toKey) live.fromKey = pickOtherKey(live.toKey);
      if (typeof prefill.amount === 'number' && prefill.amount > 0) live.amount = prefill.amount;
    }
    live.immediately = true;
    live.dateLabel = formatTodayDate();
    if (execTypeGroup) {
      execTypeGroup.querySelectorAll('.segmented__option').forEach(function (b) {
        b.classList.toggle('segmented__option--active', b.getAttribute('data-exec') === 'single');
      });
    }

    /* Reset to first step; goToStep reads the amount back from the field, so the field shows it first */
    if (amountInput) amountInput.value = formatAmount(live.amount);
    goToStep('recipient', false);

    /* Slide in */
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('modal-overlay--active');
    shell.classList.remove('modal-shell--closing');
    shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    document.body.classList.add('body--iat-open');
    if (window.UZBankSheetFocus) window.UZBankSheetFocus.open(overlay);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        shell.classList.remove('modal-shell--offscreen', 'modal-shell--no-transition');
        refreshIatScrollChrome();
      });
    });

    history.pushState({ iat: 'recipient' }, '', location.pathname + '#iat/recipient');
  }

  function closeOverlay(replaceState) {
    /* At the start of the slide: the end waits for a transition that reduced motion may not run */
    if (window.UZBankSheetFocus) window.UZBankSheetFocus.close(overlay);
    overlay.classList.add('modal-overlay--closing');
    shell.classList.add('modal-shell--closing');
    /* Ends on the slide, a fallback timer, or at once with reduced motion (roadmap 35) */
    window.UZBankAfterSheetClose(shell, function () {
      shell.classList.remove('modal-shell--closing');
      shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('modal-overlay--active', 'modal-overlay--closing');
      document.body.classList.remove('body--iat-open');
    });

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

  /* Confirmation dialog: Done closes (the transfer was recorded on Execute) */
  if (confBtn) confBtn.addEventListener('click', function () {
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

  /* "Execute on" opens the calendar (roadmap 28, D1) */
  var executeOnBtn = executeOnField && executeOnField.querySelector('[data-execute-on]');
  if (executeOnBtn) {
    executeOnBtn.addEventListener('click', function () {
      if (executeOnBtn.disabled || !window.UZBankFormSheet || !window.UZBankFormSheet.openDateSheet) return;
      window.UZBankFormSheet.openDateSheet(executeOnBtn, {
        selected: window.UZBankDatePicker.parseLabel(live.dateLabel),
        onPick: function (date) {
          live.dateLabel = window.UZBankDatePicker.formatLabel(date);
          paintScheduleStep();
        }
      });
    });
  }

  /* Segmented control: Single / Recurring execution */
  var execTypeGroup = overlay.querySelector('#uz-iat-exec-type');
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

  /* Hash on page load (deep link) — after payment overlay init so step active state is not cleared */
  function tryOpenFromHash() {
    var hash = location.hash;
    /* #iat/fund/<mandateId>: from Household to that mandate, its amount (D10); the hash is replaced, so back does
       not open it again */
    var fund = hash.match(/^#iat\/fund\/([\w-]+)$/);
    if (fund) {
      history.replaceState(null, '', location.pathname + location.search);
      var mandate = accountFor(fund[1]);
      openOverlay(mandate && mandate.mandate
        ? { toKey: mandate.key, fromKey: 'household', amount: mandate.suggestedAmount }
        : null);
      return;
    }
    var m = hash.match(/^#iat\/(\w+)$/);
    if (m && STEPS.indexOf(m[1]) >= 0) {
      openOverlay();
      goToStep(m[1], false);
    }
  }

  (window.onDocumentReady || function (fn) {
    document.addEventListener('DOMContentLoaded', fn);
  })(tryOpenFromHash);

  /* The fund link can also arrive on a page already open */
  window.addEventListener('hashchange', function () {
    if (/^#iat\/fund\//.test(location.hash)) tryOpenFromHash();
  });

})();
