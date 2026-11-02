/**
 * Investment opening: the UZ Bank assistant (roadmap 9b).
 * "Questions?" by each screen's heading opens a panel with that screen's written questions and answers. On a wide
 * page (the sheet widens to 960) the panel is a column on the right; on a phone it is a bottom sheet over the
 * dimmed step (D3, D4). It stays open across screens and stores nothing (D5).
 */

import { ASSISTANT, CHIPS } from './opening-assistant-config.js';

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
  if (helper) helper.wake();
  else startHelper();
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

/* ── The helper (D11, D12) ──────────────────────────────────────────── */
const figureBox = aside.querySelector('[data-assistant-figure]');
let helper = null;
let helperStarted = false;

/* three.js and the models load on the first open only, so the opening stays as fast as it was. If loading fails,
   the panel works without the figure. */
function startHelper() {
  if (helperStarted) return;
  helperStarted = true;
  import('./opening-assistant-helper.js')
    .then(({ mountHelper }) => mountHelper(figureBox, {
      reduced,
      active: () => open,
      /* The phone's round portrait shows head and shoulders; the column head to waist, and head to chest once it
         has made room for the answers, so the arm of the gesture stays in view. */
      frame: (h) => (root.classList.contains('assistant--sheet') ? [1.1, 2.2] : h < 90 ? [0.85, 2.2] : [0.6, 2.2]),
    }))
    .then((h) => {
      helper = h;
      figureBox.classList.add('assistant__figure--ready');
      if (open) helper.wake();
    })
    .catch((err) => {
      console.warn('[opening-assistant] the helper did not load', err);
      figureBox.hidden = true;
      aside.classList.add('assistant--no-figure');
    });
}

/* ── The conversation (D6 to D10) ───────────────────────────────────── */

/* Per screen, in memory only (D5): the lines so far and the questions asked. */
const talks = new Map();
let values = () => ({});
let log = null;
let chipsRow = null;

function talk() {
  if (!talks.has(screenId)) talks.set(screenId, { lines: [], asked: new Set() });
  return talks.get(screenId);
}

/* Answer length by User Type (D9): Newbie everything, All-rounder short with More, Power user short. Nothing chosen
   yet in Profile counts as All-rounder. */
function level() {
  const persona = window.UZBankPersona;
  if (!persona) return 'standard';
  try {
    if (window.localStorage.getItem(persona.key) == null) return 'standard';
  } catch (e) { return 'standard'; }
  return persona.read().profile;
}

const fill = (text) => {
  const v = values();
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
};

/* The chips still to ask: the screen's own, then the follow-ups of what was asked, minus what was asked. */
function openChips() {
  const set = CHIPS[screenId] || { chips: [] };
  const t = talk();
  const all = [...set.chips];
  set.chips.forEach((c) => { if (t.asked.has(c.q) && c.then) all.push(...c.then); });
  const list = all.filter((c) => !t.asked.has(c.q));
  const advisor = !t.asked.has(ASSISTANT.advisor.q) ? ASSISTANT.advisor : null;
  return { list, advisor, advisorAsChip: !!set.advisor };
}

function lineNode(line, animate) {
  const item = document.createElement('div');
  item.className = 'assistant-line assistant-line--' + (line.from === 'you' ? 'customer' : 'bank')
    + (animate ? ' assistant-line--new' : '');
  const p = document.createElement('p');
  p.className = 'assistant-line__text';
  p.textContent = line.text;
  item.append(p);
  if (line.from === 'bank' && line.more) {
    const lvl = level();
    if (lvl === 'novice' || line.expanded) item.append(moreText(line.more));
    else if (lvl === 'standard') {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'uz-btn uz-btn--tonal uz-btn--sm assistant-line__more';
      b.textContent = ASSISTANT.more;
      b.addEventListener('click', () => {
        line.expanded = true;
        const extra = moreText(line.more);
        extra.tabIndex = -1;
        b.replaceWith(extra);
        extra.focus({ preventScroll: true });
        extra.scrollIntoView({ block: 'nearest' });
      });
      item.append(b);
    }
  }
  return item;
}

function moreText(text) {
  const p = document.createElement('p');
  p.className = 'assistant-line__text assistant-line__extra';
  p.textContent = text;
  return p;
}

function chipButton(chip, className) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.textContent = chip.q;
  b.addEventListener('click', () => ask(chip));
  return b;
}

/* The chips row and the quiet advisor button; `focusAt` keeps the keyboard in place after a chip is used. */
function renderChips(focusAt) {
  const { list, advisor, advisorAsChip } = openChips();
  const buttons = list.map((c) => chipButton(c, 'uz-btn uz-btn--secondary uz-btn--sm assistant__chip'));
  if (advisor && advisorAsChip) buttons.push(chipButton(advisor, 'uz-btn uz-btn--secondary uz-btn--sm assistant__chip'));
  chipsRow.replaceChildren(...buttons);
  chipsRow.hidden = !buttons.length;
  const quiet = aside.querySelector('.assistant__advisor');
  if (quiet) quiet.remove();
  let quietBtn = null;
  if (advisor && !advisorAsChip) {
    quietBtn = chipButton(advisor, 'assistant__advisor');
    chipsRow.after(quietBtn);
  }
  if (focusAt === undefined) return;
  const target = buttons[Math.min(focusAt, buttons.length - 1)] || quietBtn || title;
  target.focus({ preventScroll: true });
}

function ask(chip) {
  const t = talk();
  const focusAt = [...chipsRow.children].findIndex((b) => b.textContent === chip.q);
  t.asked.add(chip.q);
  const q = { from: 'you', text: chip.q };
  const a = { from: 'bank', text: fill(chip.short), more: chip.more ? fill(chip.more) : '' };
  t.lines.push(q, a);
  aside.querySelector('.assistant__prompt').hidden = true;
  /* Open question 1: under the full figure a Newbie's first answer already scrolls at a 640 sheet, so the figure
     makes room once the conversation starts, and stays small until the sheet closes. */
  aside.classList.add('assistant--talking');
  const answer = lineNode(a, !reduced());
  log.append(lineNode(q, !reduced()), answer);
  renderChips(focusAt < 0 ? 0 : focusAt);
  if (helper) helper.wave();
  answer.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
}

/* The whole panel for the current screen: a new log each time, so switching screens is not read out as new lines. */
function renderTalk() {
  const t = talk();
  const prompt = document.createElement('p');
  prompt.className = 'assistant__prompt';
  prompt.textContent = ASSISTANT.prompt;
  prompt.hidden = t.lines.length > 0;
  log = document.createElement('div');
  log.className = 'assistant__log';
  log.setAttribute('role', 'log');
  log.setAttribute('aria-label', ASSISTANT.name);
  log.append(...t.lines.map((line) => lineNode(line, false)));
  chipsRow = document.createElement('div');
  chipsRow.className = 'assistant__chips';
  chipsRow.setAttribute('role', 'group');
  chipsRow.setAttribute('aria-label', ASSISTANT.chipsLabel);
  body.replaceChildren(prompt, log, chipsRow);
  renderChips();
  body.scrollTop = body.scrollHeight;
}

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
  if (id === screenId) return;
  screenId = id;
  body.dataset.screen = screenId;
  renderTalk();
}

/* The customer's own numbers for answers that use them ({amount}, {after20}). */
export function setValues(fn) { values = fn; }

export function isOpen() { return open; }
export function close(returnFocus) { hide(returnFocus); }
