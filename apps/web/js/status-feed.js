/**
 * Demo message feed — stands in for what the bank's backend would deliver.
 * Loaded on the main views (Overview, Payments, Profile, Account details) after js/status-message.js.
 * The message appears 12 s after a main view has landed, then stays on every main view
 * until it's tapped (= dismissed); 8 s later it drops in again. Test the states with ?status=error | warning | info
 */
(function () {
  'use strict';
  if (!window.UZStatusMessage) return;
  window.UZStatusMessage.feed({
    id: 'open-bill-2026-10-04',
    state: 'error',
    icon: 'bell',
    title: 'Open payment!',
    text: "There's an unpaid bill on this account. Pay it now to avoid reminder fees.",
    since: '04.10.2026',
    delay: 12000,          /* 3x the earlier 4 s */
    reappearAfter: 8000,   /* tapped away → back after 8 s (demo) */
    variants: {
      warning: { icon: 'alert-triangle', title: 'Card expires soon', text: 'Your debit card expires on 31.10.2026. Your new card is on its way.', since: '01.10.2026' },
      info: { icon: 'info', title: 'New statement available', text: 'Your September statement for this account is ready to view.', since: '05.10.2026' }
    }
  });
})();
