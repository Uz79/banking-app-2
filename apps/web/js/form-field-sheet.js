/**
 * Design-system menus (menu-countries / menu-accounts) for payment modal pickers
 * (Recipient, Amount, Time Schedule, Summary steps; refs under ../../../designs/components/menu/).
 * - All <select class="form-field__select"> (select fields)
 * - Amount field currency (.amount-input__currency)
 * - Debit account (.debit-account)
 *
 * Uses <dialog> + ::backdrop (primary @ 20%). Closes when payment overlay dismisses.
 *
 * Layout: ≥1280px — anchored pop-up: width matches trigger, opens below or above from
 * available space, slides up into place. <1280px — bottom sheet with same slide-up motion.
 */
(function () {
  var ACCOUNTS = [
    {
      icon: 'i-home',
      name: 'Household',
      iban: 'CH35 0900 0000 2470 2920 1',
      amount: "CHF 10'570.00",
      sheetCur: 'CHF',
      sheetVal: "10'570.00"
    },
    {
      icon: 'i-shield',
      name: 'Savings account',
      iban: 'CH35 0900 0000 2470 2920 2',
      amount: "CHF 25'000.00",
      sheetCur: 'CHF',
      sheetVal: "25'000.00"
    },
    {
      icon: 'i-trending-up',
      name: 'Deposit',
      iban: '123,456,78',
      amount: "CHF 20'000.00",
      sheetCur: 'CHF',
      sheetVal: "20'000.00"
    },
    {
      icon: 'i-anchor',
      name: 'Emergency account',
      iban: 'CH35 0900 0000 2470 2920 3',
      amount: "CHF 10'000.00",
      sheetCur: 'CHF',
      sheetVal: "10'000.00"
    }
  ];

  var CURRENCIES = [
    { code: 'CHF', label: 'Swiss franc (CHF)' },
    { code: 'EUR', label: 'Euro (EUR)' },
    { code: 'USD', label: 'US dollar (USD)' }
  ];

  var dialog;
  var listEl;
  var headingSrEl;
  var headingMobileEl;
  var headingDesktopEl;
  var previewWrapEl;
  var navCloseEl;
  var prevFocus;
  /** When set and viewport is desktop, menu is anchored to this element (width + flip). */
  var sheetAnchor = null;
  var sheetLayoutListenersInstalled = false;
  var sheetScrollParent = null;

  var LAYOUT_DESKTOP_MQ = '(min-width: 1280px)';
  var SHEET_VIEWPORT_MARGIN = 8;
  var SHEET_GAP = 8;

  function customMenusEnabled() {
    return typeof HTMLDialogElement !== 'undefined';
  }

  function getModal() {
    return document.querySelector('.modal-overlay');
  }

  function setSheetTitle(text) {
    var t = String(text || '').trim();
    if (headingSrEl) headingSrEl.textContent = t;
    if (headingMobileEl) headingMobileEl.textContent = t;
    if (headingDesktopEl) headingDesktopEl.textContent = t;
    dialog.setAttribute('aria-label', t);
    if (headingSrEl) listEl.setAttribute('aria-labelledby', headingSrEl.id);
  }

  function clearPreview() {
    if (!previewWrapEl) return;
    previewWrapEl.innerHTML = '';
    previewWrapEl.hidden = true;
  }

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'form-sheet';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.innerHTML =
      '<div class="form-sheet__panel">' +
      '<h2 class="form-sheet__heading-sr" id="form-sheet-heading">' +
      '</h2>' +
      '<nav class="form-sheet__nav">' +
      '<span class="form-sheet__nav-start" aria-hidden="true"></span>' +
      '<p class="form-sheet__heading-display" aria-hidden="true"></p>' +
      '<button type="button" class="form-sheet__nav-close">' +
      '<svg class="form-sheet__nav-close-icon" role="img" aria-label="Close" focusable="false">' +
      '<use href="#i-x"/></svg>' +
      '</button>' +
      '</nav>' +
      '<div class="form-sheet__masthead-desktop" aria-hidden="true">' +
      '<p class="form-sheet__heading-display-desktop"></p>' +
      '</div>' +
      '<div class="form-sheet__preview-wrap" hidden></div>' +
      '<div id="form-sheet-list" class="form-sheet__list" role="listbox"></div>' +
      '</div>';
    document.body.appendChild(dialog);
    headingSrEl = dialog.querySelector('#form-sheet-heading');
    headingMobileEl = dialog.querySelector('.form-sheet__heading-display');
    headingDesktopEl = dialog.querySelector('.form-sheet__heading-display-desktop');
    listEl = dialog.querySelector('#form-sheet-list');
    previewWrapEl = dialog.querySelector('.form-sheet__preview-wrap');
    navCloseEl = dialog.querySelector('.form-sheet__nav-close');
    if (navCloseEl) {
      navCloseEl.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dialog.close();
      });
    }
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () {
      uninstallSheetLayoutListeners();
      clearAnchoredSheetLayout();
      sheetAnchor = null;
      if (listEl) listEl.innerHTML = '';
      clearPreview();
      if (prevFocus && typeof prevFocus.focus === 'function') {
        try {
          prevFocus.focus();
        } catch (err) { /* ignore */ }
      }
      prevFocus = null;
    });
    return dialog;
  }

  function clearAnchoredSheetLayout() {
    if (!dialog) return;
    dialog.removeAttribute('data-form-sheet-anchored');
    dialog.removeAttribute('data-form-sheet-placement');
    dialog.style.removeProperty('--form-sheet-panel-left');
    dialog.style.removeProperty('--form-sheet-panel-top');
    dialog.style.removeProperty('--form-sheet-panel-bottom');
    dialog.style.removeProperty('--form-sheet-panel-width');
    dialog.style.removeProperty('--form-sheet-panel-max-height');
  }

  function positionFormSheet() {
    if (!dialog || !dialog.open) return;
    if (!window.matchMedia(LAYOUT_DESKTOP_MQ).matches) {
      if (sheetLayoutListenersInstalled) uninstallSheetLayoutListeners();
      clearAnchoredSheetLayout();
      return;
    }
    if (!sheetAnchor || typeof sheetAnchor.getBoundingClientRect !== 'function') {
      clearAnchoredSheetLayout();
      return;
    }

    var rect = sheetAnchor.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var m = SHEET_VIEWPORT_MARGIN;
    var g = SHEET_GAP;

    var width = Math.max(1, Math.round(rect.width));
    var left = Math.round(rect.left);
    if (left + width > vw - m) left = Math.max(m, vw - m - width);
    if (left < m) left = m;

    var maxHGlobal = Math.min(vh * 0.7, 32 * 16);
    var spaceBelow = vh - rect.bottom - m - g;
    var spaceAbove = rect.top - m - g;
    var placeBelow = spaceBelow >= spaceAbove;

    dialog.style.setProperty('--form-sheet-panel-width', width + 'px');
    dialog.style.setProperty('--form-sheet-panel-left', left + 'px');

    if (placeBelow) {
      var top = rect.bottom + g;
      var maxHb = Math.min(maxHGlobal, Math.max(0, vh - top - m));
      dialog.setAttribute('data-form-sheet-placement', 'below');
      dialog.style.setProperty('--form-sheet-panel-top', Math.round(top) + 'px');
      dialog.style.removeProperty('--form-sheet-panel-bottom');
      dialog.style.setProperty('--form-sheet-panel-max-height', Math.round(maxHb) + 'px');
    } else {
      var maxHt = Math.min(maxHGlobal, Math.max(0, spaceAbove));
      var bottom = vh - rect.top + g;
      dialog.setAttribute('data-form-sheet-placement', 'above');
      dialog.style.setProperty('--form-sheet-panel-bottom', Math.round(bottom) + 'px');
      dialog.style.removeProperty('--form-sheet-panel-top');
      dialog.style.setProperty('--form-sheet-panel-max-height', Math.round(maxHt) + 'px');
    }

    dialog.setAttribute('data-form-sheet-anchored', 'true');
  }

  function onSheetLayoutExternalEvent() {
    positionFormSheet();
  }

  function installSheetLayoutListeners() {
    if (sheetLayoutListenersInstalled) return;
    sheetLayoutListenersInstalled = true;
    window.addEventListener('resize', onSheetLayoutExternalEvent);
    window.addEventListener('scroll', onSheetLayoutExternalEvent, true);
    sheetScrollParent = getModal();
    if (sheetScrollParent) {
      sheetScrollParent.addEventListener('scroll', onSheetLayoutExternalEvent, true);
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onSheetLayoutExternalEvent);
      window.visualViewport.addEventListener('scroll', onSheetLayoutExternalEvent);
    }
  }

  function uninstallSheetLayoutListeners() {
    if (!sheetLayoutListenersInstalled) return;
    sheetLayoutListenersInstalled = false;
    window.removeEventListener('resize', onSheetLayoutExternalEvent);
    window.removeEventListener('scroll', onSheetLayoutExternalEvent, true);
    if (sheetScrollParent) {
      sheetScrollParent.removeEventListener('scroll', onSheetLayoutExternalEvent, true);
      sheetScrollParent = null;
    }
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', onSheetLayoutExternalEvent);
      window.visualViewport.removeEventListener('scroll', onSheetLayoutExternalEvent);
    }
  }

  function openDialog(titleText, anchorEl, sheetFlags) {
    ensureDialog();
    sheetFlags = sheetFlags || {};
    sheetAnchor = anchorEl && anchorEl.nodeType === 1 ? anchorEl : null;
    prevFocus = document.activeElement;
    setSheetTitle(titleText);
    dialog.setAttribute('data-form-sheet-type', sheetFlags.sheetType || 'generic');
    clearAnchoredSheetLayout();
    dialog.showModal();
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        positionFormSheet();
        if (dialog.getAttribute('data-form-sheet-anchored') === 'true') {
          installSheetLayoutListeners();
        } else if (sheetLayoutListenersInstalled) {
          uninstallSheetLayoutListeners();
        }
        var first = listEl.querySelector('button');
        if (first) first.focus();
      });
    });
  }

  function getTitleForSelect(sel) {
    var id = sel.getAttribute('id');
    var modal = getModal();
    if (id && modal) {
      var lab = modal.querySelector('label[for="' + id + '"]');
      if (lab && lab.textContent) return lab.textContent.trim();
    }
    var field = sel.closest('.form-field');
    if (field) {
      var plab = field.querySelector('.form-field__label');
      if (plab && plab.textContent) return plab.textContent.trim();
    }
    return 'Select';
  }

  function openSelectSheet(selectEl) {
    if (!customMenusEnabled() || !selectEl) return;
    ensureDialog();
    listEl.innerHTML = '';
    var title = getTitleForSelect(selectEl);
    var id = selectEl.getAttribute('id');
    /** designs/components/menu/menu-countries — flat list (same order as <option>). */
    var isCountry = id === 'recipient-country';

    function appendOptionRow(opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'form-sheet__row form-sheet__row--country';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
      btn.textContent = opt.textContent;
      btn.dataset.value = opt.value;
      btn.addEventListener('click', function () {
        selectEl.value = opt.value;
        selectEl.dispatchEvent(new Event('input', { bubbles: true }));
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        dialog.close();
      });
      listEl.appendChild(btn);
    }

    Array.prototype.forEach.call(selectEl.options, function (opt) {
      appendOptionRow(opt);
    });
    var wrap = selectEl.closest('.form-field__select-wrap');
    openDialog(title, wrap || selectEl, { sheetType: isCountry ? 'country' : 'select' });
  }

  function stampDebitAccount(el, acc) {
    var useIcon = el.querySelector('.debit-account__icon use');
    if (useIcon) useIcon.setAttribute('href', '#' + acc.icon);
    var name = el.querySelector('.debit-account__name');
    if (name) name.textContent = acc.name;
    var iban = el.querySelector('.debit-account__iban');
    if (iban) iban.textContent = acc.iban;
    var amt = el.querySelector('.debit-account__amount');
    if (amt) amt.textContent = acc.amount;
  }

  function openDebitSheet(cardEl) {
    if (!customMenusEnabled() || !cardEl) return;
    ensureDialog();
    listEl.innerHTML = '';
    ACCOUNTS.forEach(function (acc) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'form-sheet__row form-sheet__row--account';
      btn.setAttribute('role', 'option');
      btn.innerHTML =
        '<svg class="form-sheet__account-icon" aria-hidden="true" focusable="false"><use href="#' +
        acc.icon +
        '"/></svg>' +
        '<span class="form-sheet__account-info">' +
        '<span class="form-sheet__account-name">' +
        acc.name +
        '</span>' +
        '<span class="form-sheet__account-iban">' +
        acc.iban +
        '</span></span>' +
        '<span class="form-sheet__account-amount">' +
        '<span class="form-sheet__account-currency">' +
        acc.sheetCur +
        '</span>' +
        '<span class="form-sheet__account-value">' +
        acc.sheetVal +
        '</span></span>';
      btn.addEventListener('click', function () {
        var modal = getModal();
        if (modal) {
          modal.querySelectorAll('.debit-account').forEach(function (row) {
            stampDebitAccount(row, acc);
          });
        }
        dialog.close();
      });
      listEl.appendChild(btn);
    });
    /* No preview strip — same account appears as row 1; strip duplicated content and mismatched fills on #i-home. */
    clearPreview();
    openDialog('Debit account', cardEl, { sheetType: 'account' });
  }

  function readActiveCurrencyCode(modal) {
    var amountStep = modal.querySelector('.modal__step[data-step="amount"]');
    if (!amountStep) return 'CHF';
    var cur = amountStep.querySelector('.amount-input__currency span');
    if (!cur || !cur.textContent) return 'CHF';
    var t = cur.textContent.trim();
    return t.split(/\s+/)[0] || 'CHF';
  }

  function stampCurrencyInModal(modal, code) {
    if (!modal) return;
    modal.querySelectorAll('.amount-input__currency span').forEach(function (sp) {
      sp.textContent = code;
    });
  }

  function openCurrencySheet(modal) {
    if (!customMenusEnabled() || !modal) return;
    ensureDialog();
    listEl.innerHTML = '';
    var current = readActiveCurrencyCode(modal);
    CURRENCIES.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'form-sheet__row form-sheet__row--country';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', c.code === current ? 'true' : 'false');
      btn.textContent = c.label;
      btn.addEventListener('click', function () {
        stampCurrencyInModal(modal, c.code);
        modal.dispatchEvent(
          new CustomEvent('uz:payment-currency-change', {
            bubbles: true,
            detail: { currency: c.code }
          })
        );
        dialog.close();
      });
      listEl.appendChild(btn);
    });
    clearPreview();
    var amountRow = modal.querySelector('.modal__step[data-step="amount"] .amount-input');
    openDialog('Currency', amountRow || modal.querySelector('.amount-input__currency'), {
      sheetType: 'currency'
    });
  }

  function refreshSelectTriggers(modal) {
    if (!modal || !customMenusEnabled()) return;
    modal.querySelectorAll('select.form-field__select').forEach(function (sel) {
      var wrap = sel.closest('.form-field__select-wrap');
      if (!wrap) return;
      if (wrap.querySelector('.form-field__select-sheet-trigger')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'form-field__select-sheet-trigger';
      btn.setAttribute('aria-haspopup', 'listbox');
      btn.setAttribute('aria-label', 'Choose ' + getTitleForSelect(sel));
      wrap.appendChild(btn);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openSelectSheet(sel);
      });
    });
  }

  function bindSelectNativeBlock(sel) {
    if (!sel || !customMenusEnabled() || sel.dataset.uzFormSheetNativeBound) return;
    if (!sel.classList || !sel.classList.contains('form-field__select')) return;
    sel.dataset.uzFormSheetNativeBound = '1';
    sel.addEventListener(
      'mousedown',
      function (e) {
        e.preventDefault();
        openSelectSheet(sel);
      },
      true
    );
    sel.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
      },
      true
    );
    sel.addEventListener(
      'keydown',
      function (e) {
        var k = e.key;
        if (k === 'Enter' || k === ' ' || k === 'ArrowDown' || k === 'ArrowUp') {
          e.preventDefault();
          openSelectSheet(sel);
        }
      },
      true
    );
  }

  function bindAllSelectNativeBlocks(modal) {
    if (!modal || !customMenusEnabled()) return;
    modal.querySelectorAll('select.form-field__select').forEach(bindSelectNativeBlock);
  }

  function bindAmountCurrencyPicker(modal) {
    var cur = modal.querySelector('.modal__step[data-step="amount"] .amount-input__currency');
    if (!cur || !customMenusEnabled() || cur.dataset.uzCurrencySheet) return;
    cur.dataset.uzCurrencySheet = '1';
    cur.setAttribute('role', 'button');
    cur.setAttribute('tabindex', '0');
    cur.setAttribute('aria-haspopup', 'listbox');
    cur.setAttribute('aria-label', 'Choose currency');
    cur.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'Enter' || k === ' ' || k === 'ArrowDown') {
        e.preventDefault();
        openCurrencySheet(modal);
      }
    });
  }

  function onModalClick(e) {
    if (!customMenusEnabled()) return;
    var modal = getModal();
    if (!modal) return;

    var currency = e.target.closest && e.target.closest('.modal__step[data-step="amount"] .amount-input__currency');
    if (currency && modal.contains(currency)) {
      e.preventDefault();
      e.stopPropagation();
      openCurrencySheet(modal);
      return;
    }

    var card = e.target.closest && e.target.closest('.debit-account');
    if (!card || !modal.contains(card)) return;
    e.preventDefault();
    e.stopPropagation();
    openDebitSheet(card);
  }

  function closeSheetIfOpen() {
    if (dialog && dialog.open) dialog.close();
  }

  function onPaymentOverlayClassChange(modal) {
    if (modal.classList.contains('modal-overlay--active')) return;
    closeSheetIfOpen();
  }

  function init() {
    var modal = getModal();
    if (!modal) return;

    refreshSelectTriggers(modal);
    bindAllSelectNativeBlocks(modal);
    bindAmountCurrencyPicker(modal);
    modal.addEventListener('click', onModalClick);

    if (typeof MutationObserver !== 'undefined') {
      var mo = new MutationObserver(function () {
        onPaymentOverlayClassChange(modal);
      });
      mo.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
