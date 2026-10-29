/**
 * Investment opening: the UZ Bank assistant (roadmap 9b).
 * "Questions?" by each screen's heading opens a panel with that screen's written questions and answers. On a wide
 * page (the sheet widens to 960) the panel is a column on the right; on a phone it is a bottom sheet over the
 * dimmed step (D3, D4). It stays open across screens and stores nothing (D5).
 */

const framed = window.self !== window.top;
const send = (message) => { if (framed) window.parent.postMessage(message, window.location.origin); };

const root = document.documentElement;
const main = document.querySelector('.view--opening .view__main');
const scrim = document.querySelector('[data-assistant-scrim]');
const aside = document.querySelector('[data-assistant]');
const title = aside.querySelector('.assistant__title');
const closeBtn = aside.querySelector('[data-assistant-close]');
const body = aside.querySelector('[data-assistant-body]');

/* The column needs a 960 sheet: framed, the parent's viewport decides it (the sheet only widens from 1024px);
   on its own, the page's width. */
const WIDE_PARENT = '(min-width: 1024px)';
const WIDE_PAGE = '(min-width: 900px)';
function wideLayout() {
  try {
    if (framed && window.parent.matchMedia(WIDE_PARENT).matches) return true;
  } catch (e) { /* the parent is not reachable: use the page */ }
  return window.matchMedia(WIDE_PAGE).matches;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || new URLSearchParams(window.location.search).has('reduced');

/* The sheet's width transition (styles.css, .modal-overlay--fridge .modal-shell) and the bottom sheet's slide. */
const MOVE_MS = 300;

let open = false;
let wide = false;
let toggle = null; /* the current screen's Questions? button */
let screenId = null;
let closing = 0;

function syncToggle() {
  if (!toggle) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.classList.toggle('uz-btn--toggled', open);
}

/* The bottom sheet is modal: everything else in the page is inert while it is up. */
function setInert(on) {
  [...main.children].forEach((el) => { if (el !== aside && el !== scrim) el.inert = on; });
}

function finish() {
  closing = 0;
  aside.hidden = true;
  scrim.hidden = true;
  aside.inert = false;
  root.classList.remove('assistant--wide', 'assistant--sheet', 'assistant--closing');
}

function show() {
  if (open) return;
  if (closing) { window.clearTimeout(closing); finish(); }
  open = true;
  wide = wideLayout();
  root.classList.toggle('assistant--wide', wide);
  root.classList.toggle('assistant--sheet', !wide);
  aside.hidden = false;
  if (wide) {
    aside.removeAttribute('role');
    aside.removeAttribute('aria-modal');
    send({ type: 'uzbank:sheet-layout', wide: true });
  } else {
    aside.setAttribute('role', 'dialog');
    aside.setAttribute('aria-modal', 'true');
    scrim.hidden = false;
    setInert(true);
    /* Start below the page, then slide up (D4). */
    if (!reduced()) {
      root.classList.add('assistant--closing');
      aside.offsetHeight; /* commit the start before the transition */
    }
  }
  root.classList.remove('assistant--closing');
  root.classList.add('assistant--open');
  syncToggle();
  title.focus({ preventScroll: true });
}

function hide(returnFocus = true) {
  if (!open) return;
  open = false;
  root.classList.remove('assistant--open');
  syncToggle();
  setInert(false);
  aside.inert = true;
  if (wide) send({ type: 'uzbank:sheet-layout', wide: false });
  /* The column stays while the sheet narrows behind it; the bottom sheet slides down. */
  if (reduced()) finish();
  else {
    root.classList.add('assistant--closing');
    closing = window.setTimeout(finish, MOVE_MS);
  }
  if (returnFocus && toggle && toggle.isConnected) toggle.focus({ preventScroll: true });
}

closeBtn.addEventListener('click', () => hide());
scrim.addEventListener('click', () => hide());

/* The bottom sheet keeps the keyboard inside it (D13). */
aside.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || wide) return;
  const items = [...aside.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.closest('[hidden]'));
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === title)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* A layout change while open (a window resized across the threshold) reopens in the right form. */
let layoutTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(layoutTimer);
  layoutTimer = window.setTimeout(() => {
    if (!open || wideLayout() === wide) return;
    hide(false);
    show();
  }, 150);
});

/* ── What the page uses ─────────────────────────────────────────────── */

/* The Questions? button for a screen's heading; the page puts it in place on every render. */
export function questionsButton() {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'uz-btn uz-btn--tonal uz-btn--sm opening__questions';
  b.textContent = 'Questions?';
  b.setAttribute('aria-controls', aside.id);
  b.addEventListener('click', () => (open ? hide() : show()));
  toggle = b;
  syncToggle();
  return b;
}

/* The page moved to another screen: the panel stays open and follows it (D5). */
export function setScreen(id) {
  screenId = id;
  body.dataset.screen = screenId;
}

export function isOpen() { return open; }
export function close(returnFocus) { hide(returnFocus); }
