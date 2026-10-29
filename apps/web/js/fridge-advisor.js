/**
 * Fridge advisor ("How much should I invest?"): page script.
 * Opened as a sheet from Overview (js/fridge-advisor-sheet.js), where the sheet draws the header
 * (Back, title, close) and this page lives in its body. This script tells the sheet what it needs
 * (can go back, has entries) and answers its Back. Opened on its own, the page shows its own header.
 */
import { CONFIG, STEPS, FIELDS } from './fridge-advisor-config.js';
import { createFridgeScene } from './fridge-advisor-scene.js';

const framed = window.self !== window.top;
const send = (message) => { if (framed) window.parent.postMessage(message, window.location.origin); };
/* The sheet is wide for the fridge; the opening narrows it, so coming back from there ("Start over") widens it again (9a D2). */
send({ type: 'uzbank:sheet-layout', wide: true });
send({ type: 'uzbank:sheet-title', title: 'How much should I invest?' });

const backBtn = document.querySelector('[data-fridge-back]');
const stage = document.querySelector('[data-fridge-stage]');
const panel = document.querySelector('[data-fridge-panel]');
const live = document.querySelector('[data-fridge-live]');

const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
/* `?reduced` forces the still version, for testing where the system setting cannot be flipped. */
const forceReduced = new URLSearchParams(window.location.search).has('reduced');
const reduced = () => forceReduced || reduceMQ.matches;

/* The panel floats on the right from a 640px wide page (the 960 sheet, a tablet) and is docked at the
   bottom of a phone (8d D3, D4). The page's own width is the sheet's, framed or not. */
function syncLayout() {
  const wide = window.matchMedia('(min-width: 640px)').matches;
  document.documentElement.classList.toggle('fridge--wide', wide);
  if (panel) panel.classList.toggle('float-panel--docked', !wide);
}
syncLayout();
window.addEventListener('resize', syncLayout);

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

/* The camera frames each step in the part of the stage the panel leaves free: left of the floating panel,
   above the docked one (8d D8). */
function syncFree() {
  if (!scene) return;
  const s = stage.getBoundingClientRect();
  const p = panel.getBoundingClientRect();
  scene.setFree(panel.classList.contains('float-panel--docked')
    ? { x: 0, y: 0, w: s.width, h: p.top - s.top }
    : { x: 0, y: 0, w: p.left - s.left, h: s.height });
}
createFridgeScene(stage, CONFIG, { reduced })
  .then((s) => {
    scene = s;
    window.__fridge = scene; /* dev: look at the scene from the console */
    syncFree();
    const observer = new ResizeObserver(syncFree);
    observer.observe(panel);
    observer.observe(stage);
    updateFood();
    /* Dev: `?open=1` shows both doors open, to look inside the kit fridge. */
    if (new URLSearchParams(window.location.search).has('open')) {
      scene.setDoor('freezer', CONFIG.doors.open);
      scene.setDoor('fridge', CONFIG.doors.open);
    } else {
      scene.goTo(STEPS[index]);
    }
  })
  .catch((err) => console.warn('[fridge-advisor] 3D failed to load', err));

/* ── Values (D8: in memory only, all zero on every visit, apart from the prefill) ── */
const values = { salary: 0, left: 0, assets: 0, unplanned: 0, bigger: 0 };
const TRACK = 1000; /* positions on the native range; the value comes from the position, never the other way round */

/* Total assets starts at the liquid accounts, Household + Savings, as every other page shows them (D28).
   Set directly, not through setValue, so it does not count as an entry (D29). */
let prefilled = false;
try {
  const balances = window.UZBankPayState.getState().accountBalances;
  const sum = Math.round((balances.household || 0) + (balances.savings || 0));
  if (Number.isFinite(sum)) {
    values.assets = Math.max(0, Math.min(FIELDS.assets.max, sum));
    prefilled = true;
  }
} catch (e) { /* no account data: start at 0 and say nothing about the accounts */ }

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const chf = (n) => 'CHF ' + fmt(n);
const maxOf = (key) => {
  const m = FIELDS[key].max;
  return typeof m === 'number' ? m : values[m.of] * m.times;
};
const clampTo = (key, v) => Math.max(0, Math.min(maxOf(key), Math.round(v)));
const curveOf = (key) => FIELDS[key].curve || 1;
/* Track position (0 to 1) of a value, and back, snapped to the step. */
const posOf = (key) => (maxOf(key) > 0 ? Math.pow(values[key] / maxOf(key), 1 / curveOf(key)) : 0);
const fromPos = (key, t) => {
  const { step } = FIELDS[key];
  return clampTo(key, Math.round(maxOf(key) * Math.pow(t, curveOf(key)) / step) * step);
};

/* Setting a value keeps the others inside their ranges (lowering the salary lowers what depends on it). */
function setValue(key, v) {
  values[key] = clampTo(key, v);
  Object.keys(values).forEach((k) => { if (values[k] > maxOf(k)) values[k] = maxOf(k); });
  publish({ dirty: true });
  updateFood();
}

/* What each compartment shows: a share (0 to 1) of its capacity (D11). The assets share follows the slider's track. */
function shares() {
  const salary = values.salary;
  return {
    salary: values.salary / FIELDS.salary.max,
    left: salary ? values.left / salary : 0,
    assets: Math.pow(values.assets / FIELDS.assets.max, 1 / curveOf('assets')),
    unplanned: salary ? Math.min(1, values.unplanned / (FIELDS.unplanned.mark * salary)) : 0,
    bigger: values.bigger / FIELDS.bigger.max,
  };
}
/* The result (D9): what can go in the freezer. One month of spending is the salary minus what is left at month end. */
function investable() {
  const month = Math.max(0, values.salary - values.left);
  return Math.max(0, values.assets - month - values.unplanned - values.bigger);
}
const onResult = () => STEPS[index].kind === 'result';

function updateFood() {
  if (!scene) return;
  const share = shares();
  /* Round to the nearest item, but any value above 0 shows at least one. */
  Object.keys(share).forEach((key) => {
    const n = Math.round(share[key] * scene.capacity(key));
    scene.setFill(key, share[key] > 0 ? Math.max(1, n) : 0);
  });
  /* The freezer holds the investable share of total assets, and only shows it once the result is on screen. */
  const frozen = values.assets > 0 ? investable() / values.assets : 0;
  const n = Math.round(frozen * scene.capacity('freezer'));
  scene.setFill('freezer', onResult() && frozen > 0 ? Math.max(1, n) : 0);
}

/* ── Steps ─────────────────────────────────────────────────────────── */
let index = 0;
const TOTAL = 7; /* the screens in D4, without the closing screen (9a D1) */

function announce(text) {
  if (!live) return;
  live.textContent = '';
  window.setTimeout(() => { live.textContent = text; }, 50);
}

/* One slider with its typable value (D10, D10b). Returns the row and a `refresh` that redraws it from `values`. */
function buildField(key, onChange) {
  const def = FIELDS[key];
  const row = document.createElement('div');
  row.className = 'fridge__field';
  const id = 'fridge-' + key;

  const head = document.createElement('div');
  head.className = 'fridge__field-head';
  const label = document.createElement('label');
  label.className = 'fridge__field-label';
  label.htmlFor = id;
  label.textContent = def.label;
  const unit = document.createElement('span');
  unit.className = 'fridge__field-value';
  const cur = document.createElement('span');
  cur.className = 'fridge__field-unit';
  cur.setAttribute('aria-hidden', 'true');
  cur.textContent = 'CHF';
  const num = document.createElement('input');
  num.type = 'text';
  num.inputMode = 'numeric';
  num.autocomplete = 'off';
  num.className = 'fridge__num';
  num.setAttribute('aria-label', def.label + ' in CHF');
  unit.append(cur, num);
  head.append(label, unit);

  const track = document.createElement('div');
  track.className = 'fridge__track';
  const range = document.createElement('input');
  range.type = 'range';
  range.id = id;
  range.min = '0';
  range.max = String(TRACK);
  range.step = '1';
  range.className = 'cc-color-slider cc-color-slider--compact';
  track.append(range);
  if (def.mark) {
    const tick = document.createElement('span');
    tick.className = 'fridge__tick';
    tick.setAttribute('aria-hidden', 'true');
    tick.style.setProperty('--tick-at', String(def.mark / def.max.times));
    track.append(tick);
  }
  row.append(head, track);
  let note = null;
  if (def.mark) {
    note = document.createElement('p');
    note.className = 'fridge__note';
    row.append(note);
  }
  /* A fixed note under the field (D30), read with the slider and the number field. */
  if (def.note) {
    const fixed = document.createElement('p');
    fixed.className = 'fridge__note';
    fixed.id = id + '-note';
    fixed.textContent = def.note + (prefilled && def.prefilledNote ? ' ' + def.prefilledNote : '');
    row.append(fixed);
    range.setAttribute('aria-describedby', fixed.id);
    num.setAttribute('aria-describedby', fixed.id);
  }

  function refresh() {
    const t = posOf(key);
    range.value = String(Math.round(t * TRACK));
    range.style.setProperty('--cc-progress', (t * 100) + '%');
    range.disabled = maxOf(key) <= 0;
    range.setAttribute('aria-valuemin', '0');
    range.setAttribute('aria-valuemax', String(maxOf(key)));
    range.setAttribute('aria-valuenow', String(values[key]));
    range.setAttribute('aria-valuetext', chf(values[key]));
    if (document.activeElement !== num) num.value = fmt(values[key]);
    if (note) note.textContent = 'The bank recommends about ' + def.mark + ' times your monthly salary: ' + chf(def.mark * values.salary);
  }
  const change = (v) => { setValue(key, v); onChange(); };

  range.addEventListener('input', () => change(fromPos(key, Number(range.value) / TRACK)));
  /* The track is not linear for every slider, so the keys are handled here: one step, ten steps, the ends. */
  range.addEventListener('keydown', (event) => {
    const { step } = def;
    const cur = values[key];
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = (Math.floor(cur / step) + 1) * step;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = (Math.ceil(cur / step) - 1) * step;
    else if (event.key === 'PageUp') next = (Math.floor(cur / step) + 10) * step;
    else if (event.key === 'PageDown') next = (Math.ceil(cur / step) - 10) * step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = maxOf(key);
    if (next === null) return;
    event.preventDefault();
    change(next);
  });

  /* The number field: digits and apostrophes; a valid value applies as it is typed, Enter or leaving the field tidies it. */
  const parse = () => {
    const digits = num.value.replace(/[^0-9]/g, '');
    return digits === '' ? null : Number(digits);
  };
  num.addEventListener('input', () => {
    num.value = num.value.replace(/[^0-9'\u2019 ]/g, '');
    const n = parse();
    if (n !== null && n <= maxOf(key)) change(n);
  });
  const settle = () => {
    const n = parse();
    if (n !== null && n <= maxOf(key) && n !== values[key]) change(n);
    num.value = fmt(values[key]);
  };
  num.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); settle(); } });
  num.addEventListener('blur', settle);
  return { row, refresh };
}

const NOTE = 'A rough guide, not financial advice.';

/* Screen 7: a ring (the investable share of total assets), the amount, the yearly amount and the note (D6, D17). */
function buildResult() {
  const amount = investable();
  const share = values.assets > 0 ? Math.min(1, amount / values.assets) : 0;
  const box = document.createElement('div');
  box.className = 'fridge__result';
  const ring = document.createElement('div');
  ring.className = 'fridge__ring';
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = '<svg viewBox="0 0 120 120" focusable="false"><circle class="fridge__ring-track" cx="60" cy="60" r="52" pathLength="100"/>'
    + '<circle class="fridge__ring-bar" cx="60" cy="60" r="52" pathLength="100" stroke-dasharray="' + (reduced() ? share * 100 : 0) + ' 100"/></svg>'
    + '<div class="fridge__ring-text"><span class="fridge__ring-label">You could invest</span><span class="fridge__ring-amount">' + chf(amount) + '</span></div>';
  if (!reduced()) {
    const bar = ring.querySelector('.fridge__ring-bar');
    requestAnimationFrame(() => requestAnimationFrame(() => bar.setAttribute('stroke-dasharray', share * 100 + ' 100')));
  }
  const sr = document.createElement('p');
  sr.className = 'fridge__sr';
  sr.textContent = 'You could invest ' + chf(amount) + '.';
  const year = document.createElement('p');
  year.className = 'fridge__year';
  year.textContent = 'Left each year: ' + chf(values.left * 12);
  const note = document.createElement('p');
  note.className = 'fridge__note';
  note.textContent = NOTE;
  box.append(ring, sr, year, note);
  return box;
}

/* "Show suitable products" (9a D1, D18): the result goes into the opening's session draft, and the opening replaces
   this page, in the sheet or on its own. The sliders themselves are still not remembered (D8). */
function showProducts() {
  try {
    window.sessionStorage.setItem('uzBankWebOpeningDraft',
      JSON.stringify({ step: 0, answers: {}, fridgeAmount: Math.round(investable()), from: 'fridge' }));
  } catch (e) { /* storage blocked: the opening starts without the amount */ }
  window.location.href = 'investment-opening.html';
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
  text.textContent = step.text || '';
  text.hidden = !step.text;
  const fields = [];
  const refreshAll = () => { fields.forEach((f) => f.refresh()); gate(); };
  const form = document.createElement('div');
  form.className = 'fridge__fields';
  (step.fields || []).forEach((key) => {
    const f = buildField(key, refreshAll);
    fields.push(f);
    form.append(f.row);
  });
  const actions = document.createElement('div');
  actions.className = 'fridge__actions';
  const hint = document.createElement('p');
  hint.className = 'fridge__note';
  const next = document.createElement('button');
  next.type = 'button';
  next.setAttribute('data-fridge-next', '');
  next.className = 'uz-btn uz-btn--primary uz-btn--md uz-btn--block';
  next.textContent = step.next || 'Next';
  next.addEventListener('click', () => (last ? showProducts() : go(index + 1)));
  /* Step 5 needs a salary: everything else is measured against it (D4). */
  function gate() {
    const blocked = step.id === 'main-sliders' && values.salary <= 0;
    next.disabled = blocked;
    hint.textContent = blocked ? 'Set your monthly salary to continue.' : '';
    hint.hidden = !blocked;
  }
  actions.append(hint, next);
  const body = step.kind === 'result' ? buildResult() : null;
  panel.append(caption, heading, text, ...(body ? [body] : []), form, actions);
  refreshAll();
  if (moveFocus) heading.focus({ preventScroll: true });
  announce(caption.textContent + '. ' + (step.kind === 'result' ? 'You could invest ' + chf(investable()) + '. ' + NOTE
    : step.title + '. ' + step.text));
  publish({ canBack: index > 0 });
  if (scene) { scene.goTo(step); updateFood(); }
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
