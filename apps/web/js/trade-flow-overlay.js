/**
 * Trade flow step 1 — buy/sell order entry modal
 * Hash: #trade/buy | #trade/sell
 * Trigger: [data-trade-action="buy|sell"] on details-of-position
 */
(function () {
  'use strict';

  var DEPOT_ACCOUNTS = {
    depot1: {
      key: 'depot1',
      name: 'Custody account',
      iban: '123.456.78',
      balance: "20'000.00",
      currency: 'CHF',
      icon: '#i-life-buoy'
    }
  };

  var DEBTOR_ACCOUNTS = {
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
    }
  };

  var overlay = document.getElementById('uz-trade-overlay');
  if (!overlay) return;

  var shell = overlay.querySelector('.modal-shell');
  var modal = overlay.querySelector('.modal--trade-flow');
  var titleEl = document.getElementById('uz-trade-title');
  var metaEl = document.getElementById('uz-trade-meta');
  var amountInput = document.getElementById('uz-trade-amount');
  var limitInput = document.getElementById('uz-trade-limit');
  var limitField = document.getElementById('uz-trade-limit-field');
  var orderRow = document.getElementById('uz-trade-order-row');
  var orderTypeSelect = document.getElementById('uz-trade-order-type');
  var priceEl = document.getElementById('uz-trade-price');
  var totalEl = document.getElementById('uz-trade-total');
  var availableEl = document.getElementById('uz-trade-available');
  var inDepotEl = document.getElementById('uz-trade-in-depot');
  var durationGroup = document.getElementById('uz-trade-duration');
  var untilField = document.getElementById('uz-trade-until-field');
  var untilDateEl = document.getElementById('uz-trade-until-date');
  var depotBtn = document.getElementById('uz-trade-depot-btn');
  var debtorBtn = document.getElementById('uz-trade-debtor-btn');
  var closeBtn = document.getElementById('uz-trade-close');
  var confirmBtn = document.getElementById('uz-trade-confirm');
  var confOverlay = document.getElementById('uz-trade-confirmation');
  var confLeadEl = document.getElementById('uz-trade-conf-lead');
  var confAmountEl = document.getElementById('uz-trade-conf-amount');
  var confCurrencyEl = document.getElementById('uz-trade-conf-currency');
  var confDetailEl = document.getElementById('uz-trade-conf-detail');
  var confBtn = document.getElementById('uz-trade-conf-btn');

  var live = {
    side: 'buy',
    depotKey: 'depot1',
    debtorKey: 'household',
    duration: 'daily',
    untilDateLabel: '',
    marketPrice: 1008.5,
    heldQuantity: 5
  };

  var isClosing = false;

  var scrollChrome =
    modal && window.UZBankScrollEdgeChrome
      ? window.UZBankScrollEdgeChrome.bind(modal, {
          getScrollEl: function (root) {
            return root.querySelector('.modal__body');
          },
          footer: '.modal__footer'
        })
      : null;

  function refreshScrollChrome() {
    if (!scrollChrome) return;
    requestAnimationFrame(function () {
      scrollChrome.update();
    });
  }

  function formatMoney(n) {
    if (window.UZBankPayState && window.UZBankPayState.formatMoney) {
      return window.UZBankPayState.formatMoney(n);
    }
    if (typeof n !== 'number' || isNaN(n)) return '0.00';
    var sign = n < 0 ? '-' : '';
    var absStr = Math.abs(n).toFixed(2);
    var parts = absStr.split('.');
    return sign + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '.' + parts[1];
  }

  function parseQuantity(str) {
    var n = parseInt(String(str || '').replace(/[^\d]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  function parseMoneyInput(str) {
    var n = parseFloat(String(str || '').replace(/[^\d.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function formatTodayDate() {
    var d = new Date();
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var yyyy = String(d.getFullYear());
    return dd + '.' + mm + '.' + yyyy;
  }

  function paintOrderTypeLayout() {
    var isLimit = orderTypeSelect && orderTypeSelect.value === 'limit';
    if (limitField) limitField.hidden = !isLimit;
    if (orderRow) orderRow.classList.toggle('trade-flow__order-row--single', !isLimit);
  }

  function paintDurationLayout() {
    var showUntil = live.duration === 'until';
    if (untilField) untilField.hidden = !showUntil;
    if (showUntil && untilDateEl && !live.untilDateLabel) {
      live.untilDateLabel = formatTodayDate();
    }
    if (untilDateEl && live.untilDateLabel) {
      untilDateEl.textContent = live.untilDateLabel;
    }
  }

  function positionSnapshot() {
    var pos = window.__UZ_POSITION__;
    if (!pos) return null;
    return {
      symbol: pos.symbol || 'ABB',
      name: pos.name || 'ABB Ltd',
      isin: pos.isin || 'CH0012221711',
      exchange: pos.exchange || 'SWX',
      price: typeof pos.price === 'number' ? pos.price : live.marketPrice,
      quantity: typeof pos.quantity === 'number' ? pos.quantity : live.heldQuantity
    };
  }

  function positionMetaLine(pos) {
    return pos.name + ' | ' + pos.isin + ' | ' + pos.exchange;
  }

  function debtorAccountWithBalance(key) {
    var acc = DEBTOR_ACCOUNTS[key] || DEBTOR_ACCOUNTS.household;
    var copy = Object.assign({}, acc);
    if (window.UZBankPayState && typeof window.UZBankPayState.getState === 'function') {
      var state = window.UZBankPayState.getState();
      var balances = state.accountBalances || {};
      if (balances[key] != null) {
        copy.balance = formatMoney(balances[key]);
      }
    }
    return copy;
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

  function effectiveLimitPrice() {
    if (orderTypeSelect && orderTypeSelect.value === 'market') {
      return live.marketPrice;
    }
    var limit = parseMoneyInput(limitInput && limitInput.value);
    return limit > 0 ? limit : live.marketPrice;
  }

  function orderTotals() {
    var qty = parseQuantity(amountInput && amountInput.value);
    var unitPrice = effectiveLimitPrice();
    return {
      quantity: qty,
      unitPrice: unitPrice,
      total: qty * unitPrice
    };
  }

  function syncAmountClearVisibility(wrap) {
    if (!wrap) return;
    var input = wrap.querySelector('.amount-input__value');
    var btn = wrap.querySelector('.amount-input__clear');
    if (!input || !btn) return;
    var focused = wrap.contains(document.activeElement);
    if (focused && input.value.length > 0) btn.classList.remove('amount-input__clear--hidden');
    else btn.classList.add('amount-input__clear--hidden');
  }

  function syncTradeAmountClears() {
    overlay.querySelectorAll('.amount-input').forEach(syncAmountClearVisibility);
  }

  function paintSummary() {
    var pos = positionSnapshot();
    if (pos) {
      live.marketPrice = pos.price;
      live.heldQuantity = pos.quantity;
    }

    var totals = orderTotals();

    if (priceEl) priceEl.textContent = 'CHF ' + formatMoney(totals.unitPrice);
    if (totalEl) totalEl.textContent = 'CHF ' + formatMoney(totals.total);

    var debtor = debtorAccountWithBalance(live.debtorKey);
    if (availableEl) availableEl.textContent = debtor.currency + ' ' + debtor.balance;
    if (inDepotEl) inDepotEl.textContent = 'pcs. ' + live.heldQuantity;
  }

  function paintAccounts() {
    stampDebitAccount(depotBtn, DEPOT_ACCOUNTS[live.depotKey] || DEPOT_ACCOUNTS.depot1);
    stampDebitAccount(debtorBtn, debtorAccountWithBalance(live.debtorKey));
    paintSummary();
  }

  function paintForm() {
    var pos = positionSnapshot();
    var sideLabel = live.side === 'sell' ? 'Sell' : 'Buy';

    if (titleEl) titleEl.textContent = sideLabel;
    if (metaEl && pos) metaEl.textContent = positionMetaLine(pos);

    if (limitInput && pos) {
      limitInput.value = formatMoney(pos.price);
    }

    paintOrderTypeLayout();
    paintDurationLayout();
    paintAccounts();
  }

  function resetForm(side) {
    live.side = side === 'sell' ? 'sell' : 'buy';
    live.depotKey = 'depot1';
    live.debtorKey = 'household';
    live.duration = 'daily';
    live.untilDateLabel = formatTodayDate();

    if (amountInput) amountInput.value = '100';
    if (orderTypeSelect) orderTypeSelect.value = 'limit';

    if (durationGroup) {
      durationGroup.querySelectorAll('.segmented__option').forEach(function (btn) {
        var active = btn.getAttribute('data-duration') === 'daily';
        btn.classList.toggle('segmented__option--active', active);
      });
    }

    hideConfirmation();
    paintForm();
  }

  function paintConfirmationDialog() {
    var pos = positionSnapshot();
    var totals = orderTotals();
    if (confLeadEl) {
      confLeadEl.textContent = live.side === 'sell' ? 'Your order to sell' : 'Your order to buy';
    }
    if (confCurrencyEl) confCurrencyEl.textContent = 'CHF';
    if (confAmountEl) confAmountEl.textContent = formatMoney(totals.total);
    if (confDetailEl && pos) {
      confDetailEl.textContent = totals.quantity + ' pcs. ' + pos.name;
    }
  }

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

  function commitOrder() {
    var pos = positionSnapshot();
    if (!pos) return;
    var totals = orderTotals();
    if (totals.quantity <= 0 || totals.total <= 0) return;
    if (!window.UZBankPayState || typeof window.UZBankPayState.commitTradeOrder !== 'function') return;

    window.UZBankPayState.commitTradeOrder({
      side: live.side,
      symbol: pos.symbol,
      name: pos.name,
      isin: pos.isin,
      exchange: pos.exchange,
      quantity: totals.quantity,
      totalAmount: totals.total,
      debtorKey: live.debtorKey,
      currency: 'CHF'
    });

    if (window.UZBankAnalytics && typeof window.UZBankAnalytics.track === 'function') {
      window.UZBankAnalytics.track('trade_flow_confirm', {
        side: live.side,
        quantity: totals.quantity,
        total: totals.total,
        orderType: orderTypeSelect ? orderTypeSelect.value : 'limit',
        duration: live.duration
      });
    }
  }

  function parseTradeRoute() {
    var h = location.hash || '';
    var m = h.match(/^#trade\/(buy|sell)$/);
    return m ? m[1] : null;
  }

  function tradeHash(side) {
    return '#trade/' + (side === 'sell' ? 'sell' : 'buy');
  }

  function notifyScreen() {
    if (window.UZBankAnalytics && typeof window.UZBankAnalytics.screen === 'function') {
      window.UZBankAnalytics.screen();
    }
  }

  function isOtherFlowOpen() {
    var overlays = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < overlays.length; i++) {
      var el = overlays[i];
      if (el === overlay) continue;
      if (el.classList.contains('modal-overlay--active')) return true;
    }
    return false;
  }

  function openOverlay(side, opts) {
    opts = opts || {};
    isClosing = false;
    resetForm(side);

    var modalBody = modal ? modal.querySelector('.modal__body') : null;
    if (modalBody) modalBody.scrollTop = 0;

    if (shell) {
      shell.classList.remove('modal-shell--closing');
      shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    }
    overlay.classList.remove('modal-overlay--closing');
    overlay.classList.add('modal-overlay--active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body--trade-open');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!shell) return;
        shell.classList.remove('modal-shell--no-transition');
        shell.offsetHeight;
        shell.classList.remove('modal-shell--offscreen');
        refreshScrollChrome();
      });
    });

    refreshScrollChrome();

    if (!opts.skipRoute) {
      var expected = tradeHash(live.side);
      if ((location.hash || '') !== expected) {
        try {
          history.pushState({ uzTrade: true, side: live.side }, '', location.pathname + location.search + expected);
        } catch (_e) {
          location.hash = expected.slice(1);
        }
        notifyScreen();
      }
    }
  }

  function finishClose(fromRoute) {
    fromRoute = fromRoute === true;
    isClosing = false;
    hideConfirmation();
    overlay.classList.remove('modal-overlay--active', 'modal-overlay--closing');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body--trade-open');
    if (shell) {
      shell.classList.remove('modal-shell--closing');
      shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    }
    if (!fromRoute) {
      try {
        history.replaceState(history.state || null, '', location.pathname + location.search);
      } catch (_e) {}
      notifyScreen();
    }
  }

  function closeOverlay(fromRoute) {
    fromRoute = fromRoute === true;
    if (isClosing || !overlay.classList.contains('modal-overlay--active')) {
      finishClose(fromRoute);
      return;
    }
    isClosing = true;
    overlay.classList.add('modal-overlay--closing');

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
        finishClose(fromRoute);
      }
      shell.addEventListener('transitionend', onTransitionEnd);
      window.setTimeout(function () {
        if (resolved) return;
        resolved = true;
        shell.removeEventListener('transitionend', onTransitionEnd);
        finishClose(fromRoute);
      }, 300);
    } else {
      finishClose(fromRoute);
    }
  }

  function promptExit() {
    if (typeof window.UZBankPaymentExitPrompt === 'function') {
      window.UZBankPaymentExitPrompt(function () { closeOverlay(); }, {
        title: 'Discard order?',
        message: 'You have not finished this order. If you exit now your entries will not be submitted.',
        leaveLabel: 'Discard'
      });
    } else {
      closeOverlay();
    }
  }

  function openAccountPicker(role, triggerEl) {
    if (!window.UZBankFormSheet || !window.UZBankFormSheet.openAccountPickerSheet || !triggerEl) return;
    var catalogue = role === 'depot' ? DEPOT_ACCOUNTS : DEBTOR_ACCOUNTS;
    var sheetAccounts = Object.keys(catalogue).map(function (k) {
      var acc = role === 'depot' ? catalogue[k] : debtorAccountWithBalance(k);
      return accountToSheet(acc);
    });
    window.UZBankFormSheet.openAccountPickerSheet(triggerEl, {
      title: role === 'depot' ? 'Custody account' : 'Debit account',
      accounts: sheetAccounts,
      onSelect: function (acc) {
        if (!acc || !acc.key) return;
        if (role === 'depot') live.depotKey = acc.key;
        else live.debtorKey = acc.key;
        paintAccounts();
      }
    });
  }

  function applyTradeRoute() {
    var side = parseTradeRoute();
    if (/^#pay\//.test(location.hash || '') || /^#iat\//.test(location.hash || '')) {
      if (overlay.classList.contains('modal-overlay--active') && !isClosing) closeOverlay(true);
      return;
    }
    if (/^#payment-details\//.test(location.hash || '')) {
      if (overlay.classList.contains('modal-overlay--active') && !isClosing) closeOverlay(true);
      return;
    }

    if (side) {
      if (isOtherFlowOpen()) return;
      if (!overlay.classList.contains('modal-overlay--active')) {
        openOverlay(side, { skipRoute: true });
      }
      return;
    }

    if (overlay.classList.contains('modal-overlay--active') && !isClosing) {
      closeOverlay(true);
    }
  }

  window.__UZ_TRADE_OPEN = function (side) {
    openOverlay(side === 'sell' ? 'sell' : 'buy');
  };

  document.querySelectorAll('[data-trade-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openOverlay(btn.getAttribute('data-trade-action'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', promptExit);

  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      var totals = orderTotals();
      if (totals.quantity <= 0 || totals.total <= 0) return;
      showConfirmation();
    });
  }

  if (confBtn) {
    confBtn.addEventListener('click', function () {
      commitOrder();
      hideConfirmation();
      closeOverlay();
    });
  }

  if (amountInput) {
    amountInput.addEventListener('input', function () {
      paintSummary();
      syncAmountClearVisibility(amountInput.closest('.amount-input'));
    });
  }

  if (limitInput) {
    limitInput.addEventListener('input', function () {
      paintSummary();
      syncAmountClearVisibility(limitInput.closest('.amount-input'));
    });
  }

  overlay.addEventListener('focusin', function (e) {
    var wrap = e.target.closest && e.target.closest('.amount-input');
    if (!wrap || !overlay.contains(wrap)) return;
    syncAmountClearVisibility(wrap);
  });

  overlay.addEventListener('focusout', function (e) {
    var wrap = e.target.closest && e.target.closest('.amount-input');
    if (!wrap || !overlay.contains(wrap)) return;
    setTimeout(function () { syncAmountClearVisibility(wrap); }, 0);
  });

  overlay.addEventListener('click', function (e) {
    var clearBtn = e.target.closest && e.target.closest('.amount-input__clear');
    if (!clearBtn || !overlay.contains(clearBtn)) return;
    var wrap = clearBtn.closest('.amount-input');
    var input = wrap && wrap.querySelector('.amount-input__value');
    if (!input) return;
    e.preventDefault();
    input.value = '';
    input.focus();
    paintSummary();
    syncAmountClearVisibility(wrap);
  });

  if (orderTypeSelect) {
    orderTypeSelect.addEventListener('change', function () {
      paintOrderTypeLayout();
      paintSummary();
    });
  }

  if (durationGroup) {
    durationGroup.addEventListener('click', function (e) {
      var btn = e.target.closest('.segmented__option');
      if (!btn || !durationGroup.contains(btn)) return;
      live.duration = btn.getAttribute('data-duration') || 'daily';
      durationGroup.querySelectorAll('.segmented__option').forEach(function (opt) {
        opt.classList.toggle('segmented__option--active', opt === btn);
      });
      paintDurationLayout();
      refreshScrollChrome();
    });
  }

  if (depotBtn) {
    depotBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openAccountPicker('depot', depotBtn);
    });
  }
  if (debtorBtn) {
    debtorBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openAccountPicker('debtor', debtorBtn);
    });
  }

  document.addEventListener('uzbank:state-changed', function () {
    if (!overlay.classList.contains('modal-overlay--active')) return;
    paintAccounts();
  });

  window.addEventListener('hashchange', applyTradeRoute);
  window.addEventListener('popstate', applyTradeRoute);

  if (parseTradeRoute()) applyTradeRoute();
})();
