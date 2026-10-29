/**
 * Investment opening ("Open asset management"): page script.
 * Loaded into the Overview sheet by the fridge advisor's "Show suitable products" (D1), or by the sheet itself
 * when a draft is resumed (D19). The sheet draws the header (Back, title, close); this page tells it how wide to be,
 * what to call itself and what it needs (can go back, has entries), and answers its Back, the same messages as the
 * fridge (D2, D3). Opened on its own, the page shows its own header.
 */
import { SCREENS, DRAFT_KEY, PLACEHOLDER } from './investment-opening-config.js';

const framed = window.self !== window.top;
const send = (message) => { if (framed) window.parent.postMessage(message, window.location.origin); };

const backBtn = document.querySelector('[data-opening-back]');
const panel = document.querySelector('[data-opening-panel]');
const live = document.querySelector('[data-opening-live]');

const TITLE = 'Open asset management';
const COUNTED = SCREENS.filter((s) => s.counted !== false);
const TOTAL = COUNTED.length;

/* ── The draft (D18): one sessionStorage entry for the browser session, written on every change ── */
function readDraft() {
  try {
    const d = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY));
    if (!d || typeof d !== 'object' || !Number.isInteger(d.step) || typeof d.answers !== 'object' || !d.answers) return null;
    return d;
  } catch (e) { return null; }
}
function writeDraft() {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step: index, answers, fridgeAmount, from }));
  } catch (e) { /* storage blocked: the flow still works, it just does not resume */ }
}
function clearDraft() {
  try { window.sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
}

const draft = readDraft();
let answers = draft ? draft.answers : {};
const fridgeAmount = draft && Number.isFinite(draft.fridgeAmount) ? Math.max(0, Math.round(draft.fridgeAmount)) : 0;
const from = draft && typeof draft.from === 'string' ? draft.from : 'direct';
/* A resumed draft never lands on completion: that screen only follows the summary. */
let index = draft && draft.step >= 0 && draft.step < SCREENS.length && SCREENS[draft.step].id !== 'complete' ? draft.step : 0;

/* ── The sheet (D2, D3) ─────────────────────────────────────────────── */
send({ type: 'uzbank:sheet-layout', wide: false });
send({ type: 'uzbank:sheet-title', title: TITLE });

let state = { canBack: false, dirty: false };
function publish(next) {
  state = { ...state, ...next };
  send({ type: 'uzbank:fridge-state', canBack: state.canBack, dirty: state.dirty });
  if (backBtn) {
    backBtn.classList.toggle('modal__back--hidden', !state.canBack);
    backBtn.toggleAttribute('aria-hidden', !state.canBack);
    backBtn.tabIndex = state.canBack ? 0 : -1;
  }
}

function announce(text) {
  if (!live) return;
  live.textContent = '';
  window.setTimeout(() => { live.textContent = text; }, 50);
}

/* ── The step indicator (D5): the payment flow's segments, built here because the sheet's header is in the parent ── */
const indicator = document.createElement('div');
indicator.className = 'step-indicator step-indicator--instant opening__steps';
indicator.setAttribute('role', 'progressbar');
indicator.setAttribute('aria-valuemin', '1');
indicator.setAttribute('aria-valuemax', String(TOTAL));
for (let i = 0; i < TOTAL; i++) {
  const seg = document.createElement('span');
  seg.className = 'step-indicator__seg';
  seg.setAttribute('aria-hidden', 'true');
  indicator.append(seg);
}
panel.before(indicator);
let shown = -1;

function showStep(animate) {
  const n = COUNTED.indexOf(SCREENS[index]);
  indicator.classList.toggle('step-indicator--hidden', n < 0);
  if (n < 0) return;
  if (!animate) indicator.classList.add('step-indicator--instant');
  indicator.classList.toggle('step-indicator--back', n < shown);
  [...indicator.children].forEach((seg, i) => seg.classList.toggle('is-filled', i <= n));
  shown = n;
  indicator.setAttribute('aria-valuenow', String(n + 1));
  indicator.setAttribute('aria-valuetext', 'Step ' + (n + 1) + ' of ' + TOTAL + ': ' + SCREENS[index].title);
  if (indicator.classList.contains('step-indicator--instant')) {
    indicator.offsetWidth; /* commit the jump before the transitions come back */
    requestAnimationFrame(() => requestAnimationFrame(() => indicator.classList.remove('step-indicator--instant')));
  }
}

/* ── Screens ─────────────────────────────────────────────────────────── */
function button(label, kind, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'uz-btn uz-btn--' + kind + ' uz-btn--md uz-btn--block';
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

/* Done on completion: close the sheet, or go home when the page is on its own. */
function leave() {
  if (framed) send({ type: 'uzbank:fridge-close' });
  else window.location.href = 'overview.html';
}

/* Start over (D19): forget the draft and go back to the fridge, which makes the sheet wide again. */
function startOver() {
  clearDraft();
  window.location.href = 'fridge-advisor.html';
}

function render(moveFocus, animate) {
  const screen = SCREENS[index];
  panel.innerHTML = '';
  const heading = document.createElement('h2');
  heading.className = 'opening__heading';
  heading.tabIndex = -1;
  heading.textContent = screen.title;
  const text = document.createElement('p');
  text.className = 'opening__text';
  text.textContent = screen.text || PLACEHOLDER;

  const actions = document.createElement('div');
  actions.className = 'opening__actions';
  const complete = screen.id === 'complete';
  actions.append(button(screen.next || 'Next', 'primary', () => (complete ? done() : go(index + 1))));
  if (screen.id === 'intro') actions.append(button('Start over', 'secondary', startOver));

  panel.append(heading, text, actions);
  panel.scrollTop = 0;
  showStep(animate);
  if (moveFocus) heading.focus({ preventScroll: true });

  const n = COUNTED.indexOf(screen);
  announce((n >= 0 ? 'Step ' + (n + 1) + ' of ' + TOTAL + ', ' : '') + screen.title);
  /* Nothing to lose on completion; everywhere else the exit asks first, and says the answers are kept (D3). */
  publish({ canBack: index > 0 && !complete, dirty: !complete && (index > 0 || Object.keys(answers).length > 0) });
  if (complete) clearDraft();
  else writeDraft();
}

function done() {
  clearDraft();
  leave();
}

function go(to) {
  if (to < 0 || to >= SCREENS.length) return;
  index = to;
  render(true, true);
}

/* Back walks the counted screens; from the ineligible exit it returns to the tax screen that led there (D15). */
const TAX = SCREENS.findIndex((s) => s.id === 'tax');
function goBack() {
  if (SCREENS[index].id === 'ineligible') go(TAX);
  else if (index > 0) go(index - 1);
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin || event.source !== window.parent) return;
  if (event.data && event.data.type === 'uzbank:fridge-back') goBack();
});
if (backBtn) backBtn.addEventListener('click', goBack);

/* Escape belongs to the sheet; the iframe has the keyboard, so it passes the key on. */
window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !framed) return;
  event.preventDefault();
  send({ type: 'uzbank:fridge-escape' });
});

/* Framed, the page replaced the fridge in the sheet: the heading takes focus so a screen reader starts here. */
render(framed, false);
send({ type: 'uzbank:fridge-ready' });
