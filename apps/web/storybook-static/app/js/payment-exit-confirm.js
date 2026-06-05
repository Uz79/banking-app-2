/**
 * Confirmation before leaving payment flow via nav close (basic dialog pattern —
 * designs/screens/dialog-basic).
 */
(function () {
  var dialog;
  var pendingFn;

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'basic-dialog-payment-exit';
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

    dialog.addEventListener('click', function (e) {
      if (e.target !== dialog) return;
      pendingFn = null;
      dialog.close();
    });

    dialog.querySelector('[data-payment-exit-stay]').addEventListener('click', function () {
      pendingFn = null;
      dialog.close();
    });
    dialog.querySelector('[data-payment-exit-leave]').addEventListener('click', function () {
      var fn = pendingFn;
      pendingFn = null;
      dialog.close();
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
    dialog.showModal();
  }

  window.UZBankPaymentExitPrompt = prompt;
})();
