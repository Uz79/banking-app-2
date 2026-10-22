/**
 * Fridge advisor ("How much should I invest?"): page script.
 * Opened as a sheet from Overview (js/fridge-advisor-sheet.js), where the sheet draws the header
 * (Back, title, close) and this page lives in its body. This script tells the sheet what it needs
 * (can go back, has entries) and answers its Back. Opened on its own, the page shows its own header.
 */
const framed = window.self !== window.top;
const send = (message) => { if (framed) window.parent.postMessage(message, window.location.origin); };

const backBtn = document.querySelector('[data-fridge-back]');
const live = document.querySelector('[data-fridge-live]');

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

function goBack() {
  /* The steps arrive with the next task groups. */
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

publish({});
send({ type: 'uzbank:fridge-ready' });
if (live) live.textContent = '';
