/**
 * Demo message feed — stands in for what the bank's backend would deliver.
 * Loaded on the main views (Overview, Payments, Profile, Account details) after js/status-message.js.
 * The message appears 12 s after a main view has landed, then stays on every main view until the customer chooses
 * one of its two buttons (roadmap 80). "Remind me later" hides it and it drops in again 8 s later, every time.
 * "Go to payment" hides it for good (uzBankWebStatusActed, cleared by Reset demo data) and opens the open bill's
 * details. A tap on the card itself does nothing. Test the states with ?status=error | warning | info (only the
 * error card has buttons).
 */
(function () {
  'use strict';
  if (!window.UZStatusMessage) return;

  /* The open bill's details: a payment that exists only for this route, listed nowhere (roadmap 80, D6, D8) */
  var BILL_PAGE = 'account-details.html';
  var BILL_HASH = '#payment-details/domestic/open-bill-2026-10-04';
  function goToBill() {
    if (/account-details\.html$/.test(window.location.pathname)) window.location.hash = BILL_HASH;
    else window.location.assign(BILL_PAGE + BILL_HASH);
  }
  window.UZStatusMessage.feed({
    id: 'open-bill-2026-10-04',
    state: 'error',
    icon: 'bell',
    title: 'Open payment!',
    text: "There's an unpaid bill on this account. Pay it now to avoid reminder fees.",
    since: '04.10.2026',
    delay: 12000,          /* 3x the earlier 4 s */
    reappearAfter: 8000,   /* Remind me later → back after 8 s (demo) */
    actions: [
      { type: 'later', kind: 'secondary', label: 'Remind me later' },
      { type: 'act', kind: 'primary', label: 'Go to payment', run: goToBill }
    ],
    variants: {
      warning: { icon: 'alert-triangle', title: 'Card expires soon', text: 'Your debit card expires on 31.10.2026. Your new card is on its way.', since: '01.10.2026' },
      info: { icon: 'info', title: 'New statement available', text: 'Your September statement for this account is ready to view.', since: '05.10.2026' }
    }
  });

  /* Something ran on load or on return: one info message names it (roadmap 37, D8). payment-state.js loads first, so
     its own return handlers have run by the time these do. A message of its own that is not dismissed by an
     earlier one (unique id), and shown at once, replacing whatever shows, as `show` does. */
  var ranCount = 0;
  function announceRuns() {
    var pay = window.UZBankPayState;
    if (!pay || !pay.takeRunNotes) return;
    var notes = pay.takeRunNotes();
    if (!notes.length) return;
    var text;
    if (notes.length === 1) {
      var n = notes[0];
      var what = /^Transfer to /.test(n.name) ? 'transfer to ' + n.name.slice('Transfer to '.length) : 'payment to ' + n.name;
      text = 'Your ' + what + ' ran on ' + n.label + '.';
    } else {
      text = notes.length + ' payments ran.';
    }
    window.UZStatusMessage.show({
      id: 'pending-ran-' + Date.now() + '-' + (ranCount++),
      state: 'info',
      icon: 'info',
      title: 'Scheduled payment',
      text: text,
      delay: 600,
      force: true
    });
  }
  announceRuns();
  window.addEventListener('pageshow', announceRuns);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') announceRuns();
  });
})();
