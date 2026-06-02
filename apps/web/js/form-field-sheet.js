/**
 * Design-system menus (menu-countries / menu-accounts / menu-details-more-functions)
 * for payment modal pickers and main-view contextual actions (refs under ../../../designs/components/menu/).
 * - All <select class="form-field__select"> (select fields)
 * - Amount field currency (.amount-input__currency)
 * - Debit account (.debit-account)
 * - Main view “More functions” ([data-more-functions-trigger] on Overview / Account details)
 *
 * Uses <dialog> + ::backdrop (`--color-overlay-scrim`, same as modals). Backdrop and bottom sheet animate together on open (~0.45s);
 * close exits in ~0.28s ease-in before `dialog.close()`.
 * Esc uses the `cancel` event (preventDefault + animated close). Reduces to instant close when
 * `prefers-reduced-motion: reduce`.
 *
 * Layout: ≥1280px — anchored pop-up: width matches trigger, opens below or above from
 * available space, slides into place. <1280px — bottom sheet spanning the padded dialog width.
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

  /**
   * designs/components/menu/menu-details-more-functions
   * + designs/screens/flows/main-view-contextual-menu-navigation-flow.png (journey reference).
   */
  var MORE_FUNCTIONS_ITEMS = [
    { icon: 'i-repeat', label: 'Internal account transfer', action: 'internal-account-transfer' },
    { icon: 'i-edit-2', label: 'Change category', action: 'change-category' },
    { icon: 'i-eye', label: 'Show account information', action: 'show-account-information' }
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
  var sheetAnimatingClose = false;
  /** Fallback if `animationend` does not fire (mirrors payment-overlay closeModal). */
  var sheetCloseFallbackTimer = null;
  /** Sync list `overflow-y` when viewport height/max-height changes. */
  var formSheetOverflowListenersBound = false;

  var LAYOUT_DESKTOP_MQ = '(min-width: 1280px)';
  var SHEET_VIEWPORT_MARGIN = 8;
  var SHEET_GAP = 8;

  function customMenusEnabled() {
    return typeof HTMLDialogElement !== 'undefined';
  }

  function getPaymentModal() {
    var overlays = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < overlays.length; i++) {
      if (overlays[i].id === 'uz-iat-overlay') continue;
      if (overlays[i].querySelector('.modal--payment-flow')) return overlays[i];
    }
    return document.querySelector('.modal-overlay');
  }

  function getIatOverlay() {
    return document.getElementById('uz-iat-overlay');
  }

  function getModal() {
    return getPaymentModal();
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

  function clearSheetCloseTimers() {
    if (sheetCloseFallbackTimer !== null) {
      clearTimeout(sheetCloseFallbackTimer);
      sheetCloseFallbackTimer = null;
    }
  }

  /** Escape uses `cancel`; must preventDefault until close animation finishes (`closeSheet`). */
  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_e) {
      return false;
    }
  }

  function closeSheet() {
    if (!dialog || !dialog.open || sheetAnimatingClose) return;
    clearSheetCloseTimers();
    if (prefersReducedMotion()) {
      dialog.classList.remove('form-sheet--closing');
      dialog.close();
      return;
    }
    var panel = dialog.querySelector('.form-sheet__panel');
    if (!panel) {
      dialog.close();
      return;
    }

    sheetAnimatingClose = true;
    dialog.classList.add('form-sheet--closing');

    var finalized = false;
    function finalize() {
      if (finalized) return;
      finalized = true;
      clearSheetCloseTimers();
      panel.removeEventListener('animationend', onPanelAnimEnd);
      sheetAnimatingClose = false;
      dialog.classList.remove('form-sheet--closing');
      dialog.close();
    }

    function onPanelAnimEnd(e) {
      if (e.target !== panel) return;
      var n = String(e.animationName || '');
      if (n.indexOf('form-sheet-panel-out') === -1) return;
      finalize();
    }

    panel.addEventListener('animationend', onPanelAnimEnd);
    sheetCloseFallbackTimer = window.setTimeout(finalize, 420);
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
      '<div id="form-sheet-list" class="form-sheet__list" role="listbox" data-fs-scroll="off"></div>' +
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
        closeSheet();
      });
    }
    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeSheet();
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeSheet();
    });
    dialog.addEventListener('close', function () {
      clearSheetCloseTimers();
      sheetAnimatingClose = false;
      dialog.classList.remove('form-sheet--closing');
      uninstallSheetLayoutListeners();
      clearAnchoredSheetLayout();
      sheetAnchor = null;
      uninstallFormSheetOverflowListeners();
      if (listEl) listEl.innerHTML = '';
      clearPreview();
      document.querySelectorAll('[data-more-functions-trigger][aria-expanded="true"]').forEach(function (el) {
        el.setAttribute('aria-expanded', 'false');
      });
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
    onFormSheetOverflowExternalEvent();
  }

  function syncFormSheetListOverflow() {
    if (!listEl || !dialog || !dialog.open) return;
    var fudgePixels = 2;
    listEl.dataset.fsScroll =
      listEl.scrollHeight > listEl.clientHeight + fudgePixels ? 'on' : 'off';
  }

  function onFormSheetOverflowExternalEvent() {
    window.requestAnimationFrame(syncFormSheetListOverflow);
  }

  function installFormSheetOverflowListeners() {
    if (formSheetOverflowListenersBound) return;
    formSheetOverflowListenersBound = true;
    window.addEventListener('resize', onFormSheetOverflowExternalEvent);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onFormSheetOverflowExternalEvent);
      window.visualViewport.addEventListener('scroll', onFormSheetOverflowExternalEvent);
    }
  }

  function uninstallFormSheetOverflowListeners() {
    if (!formSheetOverflowListenersBound) return;
    formSheetOverflowListenersBound = false;
    window.removeEventListener('resize', onFormSheetOverflowExternalEvent);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', onFormSheetOverflowExternalEvent);
      window.visualViewport.removeEventListener('scroll', onFormSheetOverflowExternalEvent);
    }
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
    clearSheetCloseTimers();
    sheetAnimatingClose = false;
    dialog.classList.remove('form-sheet--closing');
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
        installFormSheetOverflowListeners();
        if (dialog.getAttribute('data-form-sheet-anchored') === 'true') {
          installSheetLayoutListeners();
        } else if (sheetLayoutListenersInstalled) {
          uninstallSheetLayoutListeners();
        }
        /* One extra frame so max-height/layout from positionFormSheet is committed before comparing scroll metrics. */
        window.requestAnimationFrame(function () {
          syncFormSheetListOverflow();
          var first = listEl.querySelector('button');
          if (first) first.focus();
        });
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
        closeSheet();
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
    var cur = el.querySelector('.debit-account__amount-currency');
    var val = el.querySelector('.debit-account__amount-value');
    if (cur && val) {
      cur.textContent = acc.sheetCur;
      val.textContent = acc.sheetVal;
      return;
    }
    var amt = el.querySelector('.debit-account__amount');
    if (amt) amt.textContent = acc.amount;
  }

  function openDebitSheet(cardEl) {
    if (!customMenusEnabled() || !cardEl) return;
    openAccountPickerSheet(cardEl, {
      title: 'Debit account',
      accounts: ACCOUNTS,
      onSelect: function (acc) {
        var modal = getModal();
        if (modal) {
          modal.querySelectorAll('.debit-account').forEach(function (row) {
            stampDebitAccount(row, acc);
          });
        }
      }
    });
  }

  /**
   * Generic account picker (menu-accounts pattern).
   * @param {HTMLElement} anchorEl
   * @param {{ title?: string, accounts?: Array, excludeKey?: string, onSelect?: function }} options
   * Accounts may include optional `key` for IAT filtering.
   */
  function openAccountPickerSheet(anchorEl, options) {
    if (!customMenusEnabled() || !anchorEl) return;
    options = options || {};
    var accounts = options.accounts || ACCOUNTS;
    var title = options.title || 'Select account';
    var excludeKey = options.excludeKey || null;
    var onSelect = typeof options.onSelect === 'function' ? options.onSelect : null;

    ensureDialog();
    listEl.innerHTML = '';
    accounts.forEach(function (acc) {
      if (excludeKey && acc.key === excludeKey) return;
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
        if (onSelect) onSelect(acc);
        closeSheet();
      });
      listEl.appendChild(btn);
    });
    clearPreview();
    openDialog(title, anchorEl, { sheetType: 'account' });
  }

  function openMoreFunctionsSheet(triggerBtn) {
    if (!customMenusEnabled() || !triggerBtn) return;
    var hostView =
      triggerBtn.closest &&
      triggerBtn.closest('.view--overview, .view--account-details');
    var sourceView = hostView && hostView.dataset ? hostView.dataset.view || '' : '';

    ensureDialog();
    listEl.innerHTML = '';
    MORE_FUNCTIONS_ITEMS.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'form-sheet__row form-sheet__row--more-function';
      btn.setAttribute('role', 'option');
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'form-sheet__more-icon');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#' + item.icon);
      svg.appendChild(use);
      var lab = document.createElement('span');
      lab.className = 'form-sheet__more-label';
      lab.textContent = item.label;
      btn.appendChild(svg);
      btn.appendChild(lab);
      btn.addEventListener('click', function () {
        closeSheet();
        try {
          document.dispatchEvent(
            new CustomEvent('uz:more-functions-action', {
              bubbles: true,
              detail: { action: item.action, sourceView: sourceView }
            })
          );
        } catch (err) { /* ignore */ }
      });
      listEl.appendChild(btn);
    });
    clearPreview();
    /* Anchor to the whole control — .action-button__circle is ~icon-sized and makes the
       desktop anchored sheet far too narrow (“More functions” unreadable). */
    var anchor = triggerBtn;
    triggerBtn.setAttribute('aria-expanded', 'true');
    openDialog('More functions', anchor, { sheetType: 'more-functions' });
  }

  function moreFunctionsTriggerFromTarget(target) {
    return target && target.closest && target.closest('[data-more-functions-trigger]');
  }

  function shouldOpenMoreFunctionsSheet(trigger) {
    if (!trigger) return false;
    var modal = getModal();
    if (modal && modal.contains(trigger)) return false;
    var view =
      trigger.closest &&
      trigger.closest('.view--overview.view--active, .view--account-details.view--active');
    return !!view;
  }

  function bindMoreFunctionsSheet() {
    if (!customMenusEnabled()) return;
    if (document.documentElement.dataset.uzMoreFunctionsSheetBound) return;
    document.documentElement.dataset.uzMoreFunctionsSheetBound = '1';

    document.addEventListener(
      'click',
      function (e) {
        var trig = moreFunctionsTriggerFromTarget(e.target);
        if (!trig || !shouldOpenMoreFunctionsSheet(trig)) return;
        e.preventDefault();
        e.stopPropagation();
        openMoreFunctionsSheet(trig);
      },
      false
    );

    document.addEventListener(
      'keydown',
      function (e) {
        var trig =
          document.activeElement &&
          document.activeElement.closest &&
          document.activeElement.closest('[data-more-functions-trigger]');
        if (!trig || !shouldOpenMoreFunctionsSheet(trig)) return;
        var k = e.key;
        if (k !== 'Enter' && k !== ' ' && k !== 'ArrowDown') return;
        e.preventDefault();
        openMoreFunctionsSheet(trig);
      },
      true
    );
  }

  function openCurrencySheet(root) {
    if (!customMenusEnabled() || !root) return;
    ensureDialog();
    listEl.innerHTML = '';
    var current = 'CHF';
    var curEl = root.querySelector('.amount-input__currency span');
    if (curEl && curEl.textContent) {
      current = curEl.textContent.trim().split(/\s+/)[0] || 'CHF';
    }
    CURRENCIES.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'form-sheet__row form-sheet__row--country';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', c.code === current ? 'true' : 'false');
      btn.textContent = c.label;
      btn.addEventListener('click', function () {
        root.querySelectorAll('.amount-input__currency span').forEach(function (sp) {
          sp.textContent = c.code;
        });
        root.dispatchEvent(
          new CustomEvent('uz:payment-currency-change', {
            bubbles: true,
            detail: { currency: c.code }
          })
        );
        closeSheet();
      });
      listEl.appendChild(btn);
    });
    clearPreview();
    var amountRow = root.querySelector('.amount-input');
    openDialog('Currency', amountRow || root.querySelector('.amount-input__currency'), {
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

  function closeSheetIfOpen() {
    if (dialog && dialog.open) closeSheet();
  }

  function onPaymentOverlayClassChange(modal) {
    if (modal.classList.contains('modal-overlay--active')) return;
    closeSheetIfOpen();
  }

  function bindAmountCurrencyPicker(root) {
    if (!root) return;
    var cur = root.querySelector('.amount-input__currency');
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
        openCurrencySheet(root);
      }
    });
  }

  function onOverlayClick(e) {
    if (!customMenusEnabled()) return;
    var root = e.currentTarget;

    var currency = e.target.closest && e.target.closest('.amount-input__currency');
    if (currency && root.contains(currency)) {
      e.preventDefault();
      e.stopPropagation();
      openCurrencySheet(root);
      return;
    }

    var card = e.target.closest && e.target.closest('.debit-account');
    if (!card || !root.contains(card)) return;
    if (root.id === 'uz-iat-overlay') return;
    e.preventDefault();
    e.stopPropagation();
    openDebitSheet(card);
  }

  function initOverlay(root) {
    if (!root) return;
    refreshSelectTriggers(root);
    bindAllSelectNativeBlocks(root);
    bindAmountCurrencyPicker(root);
    root.addEventListener('click', onOverlayClick);

    if (typeof MutationObserver !== 'undefined') {
      var mo = new MutationObserver(function () {
        onPaymentOverlayClassChange(root);
      });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function init() {
    initOverlay(getPaymentModal());
    initOverlay(getIatOverlay());
  }

  bindMoreFunctionsSheet();

  window.UZBankFormSheet = {
    openAccountPickerSheet: openAccountPickerSheet
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
