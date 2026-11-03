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
  var nav = overlay.querySelector('.modal__nav');

  var FRIDGE = { src: 'fridge-advisor.html', title: 'How much should I invest?' };
  var OPENING = { src: 'investment-opening.html', title: 'Open asset management' };
  /* One exit prompt for both pages: both keep their progress for the session (phone polish D10, D11). */
  var PROMPT = { title: 'Leave for now?', message: 'Your progress is kept for this session, so you can continue where you left off.' };

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

  /* 960 for the whole flow, the fridge and the opening with its assistant column (9b D24); the CSS widens it from a
     1024px window only. One fixed height (9a D26). */
  /* The opening's assistant on a phone is a layer over the whole sheet with its own X: the sheet's header steps
     aside while it is open (phone polish D2). */
  function setChat(on) {
    shell.classList.toggle('modal-shell--chat', on);
    nav.inert = on;
  }

  function setWide(on) {
    shell.classList.toggle('modal-shell--wide', on);
    /* The fridge and the opening share one sheet height (8d D1); only the width changes at the hand-over. */
    shell.classList.add('modal-shell--fixed-height');
  }

  /* Investment reopens where the customer left (phone polish D12): the draft's page, the fridge or the opening. A draft
     without a page (from before) resumes the opening past its intro, as in 9a D19. Anything unreadable starts with
     the fridge. */
  function resumePage() {
    try {
      var d = JSON.parse(window.sessionStorage.getItem('uzBankWebOpeningDraft'));
      if (!d || typeof d !== 'object') return FRIDGE;
      if (d.page === 'opening') return OPENING;
      if (d.page === 'fridge') return FRIDGE;
      return typeof d.step === 'number' && d.step > 0 ? OPENING : FRIDGE;
    } catch (err) { return FRIDGE; }
  }

  /* The focus ring on Investment after a close shows only when the close came from the keyboard (phone polish D9).
     Keys and pointers in this page set it here; the page in the frame says how its own closes came. */
  var byKeyboard = false;
  document.addEventListener('keydown', function () { byKeyboard = true; }, true);
  document.addEventListener('pointerdown', function () { byKeyboard = false; }, true);
  function focusOpener() {
    opener.classList.toggle('is-quiet-focus', !byKeyboard);
    opener.focus(byKeyboard ? undefined : { focusVisible: false });
  }
  /* The quiet focus lasts until the keyboard is used or the focus moves on. */
  function speakUp() { opener.classList.remove('is-quiet-focus'); }
  opener.addEventListener('keydown', speakUp);
  opener.addEventListener('blur', speakUp);

  function open() {
    if (isOpen() || closing) return;
    pageState = { canBack: false, dirty: false };
    showBack(false);
    var page = resumePage();
    setWide(true);
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
    setChat(false);
    setWide(true);
    setTitle(FRIDGE.title);
    if (app) app.inert = false;
    focusOpener();
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
    /* What had the keyboard inside the sheet before the prompt: the header's X or Back, or a control in the page. */
    var before = document.activeElement;
    var inner = null;
    try { if (before === frame) inner = frame.contentDocument.activeElement; } catch (err) { /* ignore */ }
    /* The prompt hands focus back to what had it before it opened when it closes, which can be after the sheet has
       gone, so both answers set focus again once it has closed. */
    function afterPrompt(fn) {
      var dialog = document.querySelector('dialog.basic-dialog-payment-exit');
      if (dialog) dialog.addEventListener('close', fn, { once: true });
    }
    window.UZBankPaymentExitPrompt(function () {
      /* Leave: back on Investment, unless the sheet is still closing (then finish() does it). */
      afterPrompt(function () { if (!isOpen()) focusOpener(); });
      close();
    }, {
      title: PROMPT.title,
      message: PROMPT.message,
      /* Keep going: focus returns to what had it before (falling back to the page in the frame). */
      onStay: function () {
        afterPrompt(function () {
          if (!frame) return;
          if (before && before !== frame && before !== document.body && overlay.contains(before)) { before.focus(); return; }
          try {
            frame.contentWindow.focus();
            if (inner && inner.isConnected && inner !== frame.contentDocument.body) inner.focus();
          } catch (err) { frame.focus(); }
        });
      },
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
      byKeyboard = true;
      requestClose();
    } else if (data.type === 'uzbank:fridge-close') {
      byKeyboard = !!data.keyboard;
      close();
    } else if (data.type === 'uzbank:sheet-chat') {
      setChat(!!data.open);
    } else if (data.type === 'uzbank:sheet-layout') {
      setWide(data.wide !== false);
    } else if (data.type === 'uzbank:sheet-title' && typeof data.title === 'string') {
      setTitle(data.title);
    }
  });
})();
