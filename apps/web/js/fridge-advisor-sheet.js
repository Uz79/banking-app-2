/**
 * Overview: opens the fridge advisor as a sheet, the same way the payment and trade flows open.
 *
 * The sheet is a real flow sheet (.modal-overlay > .modal-shell > .modal--trade-flow) with the flows' own
 * header (Back, title, close), so it looks and moves like them. The page itself, fridge-advisor.html,
 * lives in an iframe inside the sheet body, created on open and removed after the close, so its WebGL
 * context only exists while the sheet is open. Without this script the Offers item is a plain link to the page.
 */
(function () {
  'use strict';

  var overlay = document.querySelector('[data-fridge-overlay]');
  var opener = document.querySelector('a.list-item[href="fridge-advisor.html"]');
  var app = document.querySelector('.app');
  if (!overlay || !opener) return;

  var shell = overlay.querySelector('.modal-shell');
  var body = overlay.querySelector('[data-fridge-body]');
  var backBtn = overlay.querySelector('[data-fridge-back]');
  var closeBtn = overlay.querySelector('[data-fridge-close]');

  var frame = null;
  var closing = false;
  var pageState = { canBack: false, dirty: false };

  function isOpen() {
    return overlay.classList.contains('modal-overlay--active');
  }

  function showBack(on) {
    backBtn.classList.toggle('modal__back--hidden', !on);
    backBtn.toggleAttribute('aria-hidden', !on);
    backBtn.tabIndex = on ? 0 : -1;
  }

  function open() {
    if (isOpen() || closing) return;
    pageState = { canBack: false, dirty: false };
    showBack(false);
    frame = document.createElement('iframe');
    frame.className = 'fridge-frame';
    frame.title = 'How much should I invest?';
    frame.src = 'fridge-advisor.html';
    frame.addEventListener('load', function () {
      try { frame.contentWindow.focus(); } catch (err) { /* ignore */ }
    });
    body.appendChild(frame);

    overlay.removeAttribute('aria-hidden');
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
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body--payment-open');
    shell.classList.remove('modal-shell--closing');
    shell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    if (frame) { frame.remove(); frame = null; }
    if (app) app.inert = false;
    opener.focus();
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

  /* Close, Escape and the header's X: leave straight away, or ask first once something has been entered. */
  function requestClose() {
    if (!isOpen() || closing) return;
    if (!pageState.dirty || typeof window.UZBankPaymentExitPrompt !== 'function') { close(); return; }
    window.UZBankPaymentExitPrompt(close, {
      title: 'Leave this guide?',
      message: 'Your entries will be lost.',
      leaveLabel: 'Leave',
      stayLabel: 'Keep going',
      escapeStays: true
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen() && !document.querySelector('dialog[open]')) { event.preventDefault(); requestClose(); }
  });

  opener.addEventListener('click', function (event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open();
  });

  closeBtn.addEventListener('click', requestClose);
  backBtn.addEventListener('click', function () {
    if (frame && frame.contentWindow) frame.contentWindow.postMessage({ type: 'uzbank:fridge-back' }, window.location.origin);
  });

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin || !frame || event.source !== frame.contentWindow) return;
    var data = event.data || {};
    if (data.type === 'uzbank:fridge-state') {
      pageState = { canBack: !!data.canBack, dirty: !!data.dirty };
      showBack(pageState.canBack);
    } else if (data.type === 'uzbank:fridge-escape') {
      requestClose();
    } else if (data.type === 'uzbank:fridge-close') {
      close();
    }
  });
})();
