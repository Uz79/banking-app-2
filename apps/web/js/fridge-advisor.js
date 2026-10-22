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

const backBtn = document.querySelector('[data-fridge-back]');
const stage = document.querySelector('[data-fridge-stage]');
const panel = document.querySelector('[data-fridge-panel]');
const live = document.querySelector('[data-fridge-live]');

const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
/* `?reduced` forces the still version, for testing where the system setting cannot be flipped. */
const forceReduced = new URLSearchParams(window.location.search).has('reduced');
const reduced = () => forceReduced || reduceMQ.matches;

/* The sheet is wide (two columns) from a 1024px viewport; the page asks the viewport that decides it. */
function syncLayout() {
  let wide = false;
  try { wide = (framed ? window.parent : window).matchMedia('(min-width: 1024px)').matches; } catch (e) { /* stacked */ }
  document.documentElement.classList.toggle('fridge--wide', wide);
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
createFridgeScene(stage, CONFIG, { reduced })
  .then((s) => {
    scene = s;
    window.__fridge = scene; /* dev: look at the scene from the console */
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

/* ── Values (D8: in memory only, all zero on every visit) ─────────── */
const values = { salary: 0, left: 0, assets: 0, unplanned: 0, bigger: 0 };
const TRACK = 1000; /* positions on the native range; the value comes from the position, never the other way round */

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
function updateFood() {
  if (!scene) return;
  const share = shares();
  /* Round to the nearest item, but any value above 0 shows at least one. */
  Object.keys(share).forEach((key) => {
    const n = Math.round(share[key] * scene.capacity(key));
    scene.setFill(key, share[key] > 0 ? Math.max(1, n) : 0);
  });
}

/* ── Steps ─────────────────────────────────────────────────────────── */
let index = 0;
const TOTAL = 8; /* the screens in D4; the later ones arrive with the sliders and the result */

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
  next.textContent = 'Next';
  next.hidden = last; /* the result screens arrive in a later group */
  next.addEventListener('click', () => go(index + 1));
  /* Step 5 needs a salary: everything else is measured against it (D4). */
  function gate() {
    const blocked = step.id === 'main-sliders' && values.salary <= 0;
    next.disabled = blocked;
    hint.textContent = blocked ? 'Set your monthly salary to continue.' : '';
    hint.hidden = !blocked;
  }
  actions.append(hint, next);
  panel.append(caption, heading, text, form, actions);
  refreshAll();
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
