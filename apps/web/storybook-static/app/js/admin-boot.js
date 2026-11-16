/**
 * Admin access — boot (runs in <head>, before paint)
 *
 * Sets html.is-admin when the lab admin is signed in, so admin-only menu entries
 * (Design system) are there from the first paint without a flash.
 * Pages that are admin-only load this file with data-guard: without admin access
 * they redirect to Profile › Admin access (profile.html#admin).
 *
 * Front-end demo only (lab app) — not real security. See js/admin.js.
 */
(function () {
  'use strict';
  var KEY = 'uzBankAdmin';
  var signedIn = false;
  try { signedIn = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if (signedIn) document.documentElement.classList.add('is-admin');

  try {
    /* Collapsed unless the user has explicitly expanded it. */
    if (localStorage.getItem('uzBankSidebar') !== 'extended') {
      document.documentElement.classList.add('sidebar-compressed');
    }
  } catch (e) {
    document.documentElement.classList.add('sidebar-compressed');
  }

  var me = document.currentScript;
  if (!signedIn && me && me.hasAttribute('data-guard')) {
    location.replace('profile.html#admin');
  }
})();
