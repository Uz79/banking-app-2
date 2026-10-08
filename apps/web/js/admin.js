/**
 * Admin access — Profile › Admin access (lab app)
 *
 * Sign in with username + password to unlock the Design system entry in the menu
 * (sidebar on desktop, 4th tab on mobile). Signed in until "Sign out admin".
 *
 * FRONT-END DEMO ONLY: the credentials below live in the browser and the flag in
 * localStorage. Fine for a lab/prototype, not real security — a real admin login
 * needs a server.
 */
(function () {
  'use strict';

  var KEY = 'uzBankAdmin';
  var CREDENTIALS = { username: 'admin', password: 'uzbank-lab' };   // change for your lab

  function isAdmin() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function setAdmin(on) {
    try { on ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) {}
    document.documentElement.classList.toggle('is-admin', on);
    document.dispatchEvent(new CustomEvent('uz:admin-change', { detail: { admin: on } }));
  }

  var dialog = null;

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'basic-dialog-payment-exit admin-login';
    dialog.setAttribute('aria-labelledby', 'admin-login-title');
    dialog.setAttribute('aria-describedby', 'admin-login-msg');
    dialog.innerHTML =
      '<form class="basic-dialog-payment-exit__surface admin-login__surface" method="dialog" novalidate>' +
        '<h2 class="basic-dialog-payment-exit__title" id="admin-login-title">Admin sign-in</h2>' +
        '<p class="basic-dialog-payment-exit__message" id="admin-login-msg">Unlocks the design system in the menu. Lab access only.</p>' +
        '<div class="admin-login__fields">' +
          '<div class="form-field">' +
            '<label class="form-field__label" for="admin-login-user">Username</label>' +
            '<div class="form-field__text-wrap"><input class="form-field__input" id="admin-login-user" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required /></div>' +
          '</div>' +
          '<div class="form-field">' +
            '<label class="form-field__label" for="admin-login-pass">Password</label>' +
            '<div class="form-field__text-wrap"><input class="form-field__input" id="admin-login-pass" name="password" type="password" autocomplete="current-password" required /></div>' +
          '</div>' +
          '<p class="admin-login__error" id="admin-login-error" role="alert" hidden>Username or password is not correct.</p>' +
        '</div>' +
        '<div class="basic-dialog-payment-exit__actions">' +
          '<button type="button" class="uz-btn uz-btn--secondary uz-btn--md uz-btn--block" data-admin-cancel>Cancel</button>' +
          '<button type="submit" class="uz-btn uz-btn--primary uz-btn--md uz-btn--block">Sign in</button>' +
        '</div>' +
      '</form>';

    var form = dialog.querySelector('form');
    var user = dialog.querySelector('#admin-login-user');
    var pass = dialog.querySelector('#admin-login-pass');
    var error = dialog.querySelector('#admin-login-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (user.value.trim() === CREDENTIALS.username && pass.value === CREDENTIALS.password) {
        setAdmin(true);
        close();
      } else {
        error.hidden = false;
        pass.value = '';
        pass.focus();
      }
    });
    [user, pass].forEach(function (i) { i.addEventListener('input', function () { error.hidden = true; }); });
    dialog.querySelector('[data-admin-cancel]').addEventListener('click', close);
    dialog.addEventListener('close', function () { form.reset(); error.hidden = true; });

    document.body.appendChild(dialog);
    return dialog;
  }

  function open() {
    ensureDialog().showModal();
    dialog.querySelector('#admin-login-user').focus();
  }
  function close() {
    if (dialog && dialog.open) dialog.close();
  }

  function init() {
    var section = document.getElementById('admin');
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-admin-signin]')) { e.preventDefault(); open(); }
      if (e.target.closest('[data-admin-signout]')) { e.preventDefault(); setAdmin(false); }
    });
    // Came here from an admin-only page without access: show the section and ask to sign in
    if (section && location.hash === '#admin' && !isAdmin()) {
      section.scrollIntoView({ block: 'center' });
      open();
    }
  }

  window.UZAdmin = { isAdmin: isAdmin, signIn: open, signOut: function () { setAdmin(false); } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
