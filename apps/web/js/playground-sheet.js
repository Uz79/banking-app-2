/**
 * Design system hub: opens the Payday run as a flow-style sheet.
 *
 * Same motion as the payment flow (js/payment-overlay.js): the sheet slides up from below,
 * the scrim fades in, and on close it slides down and fades out. The page itself is
 * playground.html in an iframe, created on open and removed after the close, so the game
 * (and its WebGL context) only exists while the sheet is open. The page asks to close with
 * a `uzbank:playground-close` message (js/playground.js).
 */
(function () {
  'use strict';

  var overlay = document.querySelector('[data-playground-overlay]');
  var card = document.querySelector('a.ds-hub__card[href="playground.html"]');
  var app = document.querySelector('.app');
  if (!overlay || !card) return;
  var shell = overlay.querySelector('.modal-shell');

  var frame = null;
  var closing = false;

  function isOpen() {
    return overlay.classList.contains('modal-overlay--active');
  }

  function open() {
    if (isOpen() || closing) return;
    frame = document.createElement('iframe');
    frame.className = 'playground-frame';
    frame.title = 'Payday run';
    frame.src = 'playground.html';
    frame.addEventListener('load', function () {
      try { frame.contentWindow.focus(); } catch (err) { /* ignore */ }
    });
    shell.appendChild(frame);

    shell.classList.remove('modal-shell--closing');
    shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    overlay.classList.add('modal-overlay--active');
    document.body.classList.add('body--payment-open');
    if (app) app.inert = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        shell.classList.remove('modal-shell--no-transition');
        shell.offsetHeight; /* commit the parked position before sliding */
        shell.classList.remove('modal-shell--offscreen');
      });
    });
  }

  function finish() {
    closing = false;
    overlay.classList.remove('modal-overlay--active', 'modal-overlay--closing');
    document.body.classList.remove('body--payment-open');
    shell.classList.remove('modal-shell--closing');
    shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    if (frame) { frame.remove(); frame = null; }
    if (app) app.inert = false;
    card.focus();
  }

  function close() {
    if (!isOpen() || closing) return;
    closing = true;
    overlay.classList.add('modal-overlay--closing');
    shell.classList.remove('modal-shell--offscreen', 'modal-shell--no-transition');
    shell.offsetHeight;
    shell.classList.add('modal-shell--closing');

    var done = false;
    function end(e) {
      if (e && (e.target !== shell || e.propertyName !== 'transform')) return;
      if (done) return;
      done = true;
      shell.removeEventListener('transitionend', end);
      finish();
    }
    shell.addEventListener('transitionend', end);
    window.setTimeout(end, 300);
  }

  /* Escape closes the sheet when the page itself does not have the keyboard (for example after a click outside it). */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) { event.preventDefault(); close(); }
  });

  card.addEventListener('click', function (event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open();
  });

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin || !frame || event.source !== frame.contentWindow) return;
    if (event.data && event.data.type === 'uzbank:playground-close') close();
  });
})();
