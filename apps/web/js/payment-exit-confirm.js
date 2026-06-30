/**
 * Confirmation before leaving payment flow via nav close (basic dialog pattern —
 * designs/screens/dialog-basic).
 */
(function () {
  var dialog;
  var pendingFn;
  var closeFallbackTimer = null;
  var animatingClose = false;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_e) {
      return false;
    }
  }

  function clearCloseTimers() {
    if (closeFallbackTimer !== null) {
      clearTimeout(closeFallbackTimer);
      closeFallbackTimer = null;
    }
  }

  function closeDialogAnimated() {
    if (!dialog || !dialog.open || animatingClose) return;
    clearCloseTimers();
    if (prefersReducedMotion()) {
      dialog.classList.remove('basic-dialog-payment-exit--closing');
      dialog.close();
      return;
    }
    var surface = dialog.querySelector('.basic-dialog-payment-exit__surface');
    if (!surface) {
      dialog.close();
      return;
    }

    animatingClose = true;
    dialog.classList.add('basic-dialog-payment-exit--closing');

    var finalized = false;
    function finalize() {
      if (finalized) return;
      finalized = true;
      clearCloseTimers();
      surface.removeEventListener('animationend', onSurfaceAnimEnd);
      animatingClose = false;
      dialog.classList.remove('basic-dialog-payment-exit--closing');
      dialog.close();
    }

    function onSurfaceAnimEnd(e) {
      if (e.target !== surface) return;
      var n = String(e.animationName || '');
      if (n.indexOf('form-sheet-panel-out') === -1 && n.indexOf('basic-dialog-surface-out') === -1) return;
      finalize();
    }

    surface.addEventListener('animationend', onSurfaceAnimEnd);
    closeFallbackTimer = window.setTimeout(finalize, 420);
  }

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'basic-dialog-payment-exit';
    dialog.setAttribute('tabindex', '-1');
    dialog.setAttribute('role', 'alertdialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'basic-dialog-payment-exit-title');
    dialog.setAttribute('aria-describedby', 'basic-dialog-payment-exit-msg');
    dialog.innerHTML =
      '<div class="basic-dialog-payment-exit__surface">' +
      '<h2 class="basic-dialog-payment-exit__title" id="basic-dialog-payment-exit-title">' +
      'Discard payment?' +
      '</h2>' +
      '<p class="basic-dialog-payment-exit__message" id="basic-dialog-payment-exit-msg">' +
      'You have not finished this payment. If you exit now your entries will not be submitted.' +
      '</p>' +
      '<div class="basic-dialog-payment-exit__actions">' +
      '<button type="button" class="uz-btn uz-btn--secondary uz-btn--md uz-btn--block" data-payment-exit-stay>Continue payment</button>' +
      '<button type="button" class="uz-btn uz-btn--primary uz-btn--md uz-btn--block" data-payment-exit-leave>Discard</button>' +
      '</div></div>';

    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
    });

    dialog.querySelector('[data-payment-exit-stay]').addEventListener('click', function () {
      pendingFn = null;
      closeDialogAnimated();
    });
    dialog.querySelector('[data-payment-exit-leave]').addEventListener('click', function () {
      var fn = pendingFn;
      pendingFn = null;
      closeDialogAnimated();
      if (typeof fn === 'function') fn();
    });

    document.body.appendChild(dialog);
    return dialog;
  }

  /**
   * @param {function(): void} exitFn  called only when user chooses Discard.
   * @param {{ title?: string, message?: string, leaveLabel?: string }} [opts]
   *   Optional copy overrides — used for edit-mode ("Discard changes?" etc.)
   */
  function prompt(exitFn, opts) {
    pendingFn = typeof exitFn === 'function' ? exitFn : null;
    ensureDialog();
    var o = opts || {};
    dialog.querySelector('#basic-dialog-payment-exit-title').textContent =
      o.title   || 'Discard payment?';
    dialog.querySelector('#basic-dialog-payment-exit-msg').textContent =
      o.message || 'You have not finished this payment. If you exit now your entries will not be submitted.';
    dialog.querySelector('[data-payment-exit-leave]').textContent =
      o.leaveLabel || 'Discard';
    dialog.classList.remove('basic-dialog-payment-exit--closing');
    dialog.showModal();
    if (window.UZBankDialogFocus) {
      window.UZBankDialogFocus.suppressInitialFocus(dialog);
    }
  }

  window.UZBankPaymentExitPrompt = prompt;
})();
