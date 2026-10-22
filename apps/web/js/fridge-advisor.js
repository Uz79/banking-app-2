/**
 * Fridge advisor ("How much should I invest?"): page script.
 * Opened as a sheet from Overview (js/fridge-advisor-sheet.js), where the sheet draws the header
 * (Back, title, close) and this page lives in its body. This script tells the sheet what it needs
 * (can go back, has entries) and answers its Back. Opened on its own, the page shows its own header.
 */
import { CONFIG, STEPS } from './fridge-advisor-config.js';
import { createFridgeScene } from './fridge-advisor-scene.js';

const framed = window.self !== window.top;
const send = (message) => { if (framed) window.parent.postMessage(message, window.location.origin); };

const backBtn = document.querySelector('[data-fridge-back]');
const stage = document.querySelector('[data-fridge-stage]');
const panel = document.querySelector('[data-fridge-panel]');
const live = document.querySelector('[data-fridge-live]');

const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
/* `?reduced` forces the still version, for testing where the system setting cannot be flipped. */
const forceReduced = new URLSearchParams(window.location.search).has('reduced');
const reduced = () => forceReduced || reduceMQ.matches;

/* What the sheet's header needs to know: whether Back is available and whether anything has been entered. */
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

/* ── The scene ─────────────────────────────────────────────────────── */
let scene = null;
createFridgeScene(stage, CONFIG, { reduced })
  .then((s) => {
    scene = s;
    window.__fridge = scene; /* dev: look at the scene from the console */
    /* Dev: `?open=1` shows both doors open, to look inside the kit fridge. */
    if (new URLSearchParams(window.location.search).has('open')) {
      scene.setDoor('freezer', CONFIG.doors.open);
      scene.setDoor('fridge', CONFIG.doors.open);
    } else {
      scene.goTo(STEPS[index]);
    }
  })
  .catch((err) => console.warn('[fridge-advisor] 3D failed to load', err));

/* ── Steps ─────────────────────────────────────────────────────────── */
let index = 0;
const TOTAL = 8; /* the screens in D4; the later ones arrive with the sliders and the result */

function announce(text) {
  if (!live) return;
  live.textContent = '';
  window.setTimeout(() => { live.textContent = text; }, 50);
}

function render(moveFocus) {
  const step = STEPS[index];
  const last = index === STEPS.length - 1;
  panel.innerHTML = '';
  const caption = document.createElement('p');
  caption.className = 'fridge__step';
  caption.textContent = 'Step ' + (index + 1) + ' of ' + TOTAL;
  const heading = document.createElement('h2');
  heading.className = 'fridge__heading';
  heading.tabIndex = -1;
  heading.textContent = step.title;
  const text = document.createElement('p');
  text.className = 'fridge__text';
  text.textContent = step.text;
  const actions = document.createElement('div');
  actions.className = 'fridge__actions';
  const next = document.createElement('button');
  next.type = 'button';
  next.setAttribute('data-fridge-next', '');
  next.className = 'uz-btn uz-btn--primary uz-btn--md uz-btn--block';
  next.textContent = 'Next';
  next.hidden = last; /* the next screens arrive with the sliders */
  next.addEventListener('click', () => go(index + 1));
  actions.append(next);
  panel.append(caption, heading, text, actions);
  if (moveFocus) heading.focus({ preventScroll: true });
  announce(caption.textContent + '. ' + step.title + '. ' + step.text);
  publish({ canBack: index > 0 });
  if (scene) scene.goTo(step);
}

function go(to) {
  if (to < 0 || to >= STEPS.length) return;
  index = to;
  render(true);
}

function goBack() {
  go(index - 1);
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin || event.source !== window.parent) return;
  if (event.data && event.data.type === 'uzbank:fridge-back') goBack();
});
if (backBtn) backBtn.addEventListener('click', goBack);

/* Escape belongs to the sheet; the iframe has the keyboard after a click, so it passes the key on. */
window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !framed) return;
  event.preventDefault();
  send({ type: 'uzbank:fridge-escape' });
});

render(false);
send({ type: 'uzbank:fridge-ready' });
