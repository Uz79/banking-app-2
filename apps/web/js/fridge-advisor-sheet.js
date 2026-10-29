/**
 * Overview: opens the fridge advisor as a sheet, the same way the payment and trade flows open.
 *
 * The sheet is a real flow sheet (.modal-overlay > .modal-shell > .modal--trade-flow) with the flows' own
 * header (Back, title, close), so it looks and moves like them. The page itself, fridge-advisor.html,
 * lives in an iframe inside the sheet body, created on open and removed after the close, so its WebGL
 * context only exists while the sheet is open. Without this script the Offers item is a plain link to the page.
 *
 * The fridge's "Show suitable products" loads the investment opening (investment-opening.html) into the same frame
 * (9a D1). Whichever page is in the frame tells the sheet how wide to be and what to call itself
 * (`uzbank:sheet-layout`, `uzbank:sheet-title`), so the sheet does not need to know the pages. With a draft past the
 * opening's intro, Investment opens straight at the opening (9a D19).
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
  var titleEl = overlay.querySelector('.modal__title');

  var FRIDGE = { src: 'fridge-advisor.html', title: 'How much should I invest?' };
  var OPENING = { src: 'investment-opening.html', title: 'Open asset management' };
  /* The exit prompt, per page: the fridge forgets its sliders, the opening keeps its draft for the tab (9a D3). */
  var PROMPTS = {
    'fridge-advisor.html': { title: 'Leave this guide?', message: 'Your entries will be lost.' },
    'investment-opening.html': { title: 'Leave the opening?', message: 'Your answers are kept until you close this tab.' }
  };

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

  /* The page in the frame names the sheet: the visible title, the dialog's name and the frame's title. */
  function setTitle(text) {
    titleEl.textContent = text;
    overlay.setAttribute('aria-label', text);
    if (frame) frame.title = text;
  }

  /* Wide (960) for the fridge; the flows' 640 at one fixed height for the opening (9a D2, D26). Both ease; see the CSS. */
  function setWide(on) {
    shell.classList.toggle('modal-shell--wide', on);
    shell.classList.toggle('modal-shell--fixed-height', !on);
  }

  /* A draft past the intro resumes the opening (9a D18, D19). Anything unreadable starts with the fridge. */
  function resumable() {
    try {
      var d = JSON.parse(window.sessionStorage.getItem('uzBankWebOpeningDraft'));
      return !!(d && typeof d === 'object' && typeof d.step === 'number' && d.step > 0);
    } catch (err) { return false; }
  }

  /* Which page the frame holds now, for the exit prompt. */
  function framePage() {
    try { return frame.contentWindow.location.pathname.split('/').pop(); } catch (err) { return ''; }
  }

  function open() {
    if (isOpen() || closing) return;
    pageState = { canBack: false, dirty: false };
    showBack(false);
    var page = resumable() ? OPENING : FRIDGE;
    setWide(page === FRIDGE);
    frame = document.createElement('iframe');
    frame.className = 'fridge-frame';
    setTitle(page.title);
    frame.src = page.src;
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
    setWide(true);
    setTitle(FRIDGE.title);
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
    var prompt = PROMPTS[framePage()] || PROMPTS[FRIDGE.src];
    window.UZBankPaymentExitPrompt(close, {
      title: prompt.title,
      message: prompt.message,
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
    } else if (data.type === 'uzbank:sheet-layout') {
      setWide(data.wide !== false);
    } else if (data.type === 'uzbank:sheet-title' && typeof data.title === 'string') {
      setTitle(data.title);
    }
  });
})();
