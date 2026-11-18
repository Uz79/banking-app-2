/**
 * Investment calculator (roadmap 82): page script.
 * Opened as a sheet from the "Cash loses value" tile on Overview (js/fridge-advisor-sheet.js), where the sheet draws the
 * header (title, close) and this page lives in its body. Three sliders, duration, amount and strategy, and one chart:
 * the cash line after inflation and the good, expected and unfavourable investment curves, on the same axes. Inline
 * SVG, no library, no animation (a change redraws at once). The SVG is decoration: the results list and a live region
 * say everything it shows. The calculator keeps nothing: each open starts from the account balances (D25).
 * "See how much to invest" ends it and loads the fridge advisor into the same sheet, with nothing carried over.
 */
import { AMOUNT, STRATEGIES, CALCULATOR } from './investment-opening-config.js';

const C = CALCULATOR;
const INFLATION = C.inflation; /* flagged: a placeholder (79 D2) */
const SAMPLES = 40;
const NS = 'http://www.w3.org/2000/svg';

const framed = window.self !== window.top;
const send = (message) => { if (framed) window.parent.postMessage(message, window.location.origin); };
send({ type: 'uzbank:sheet-layout', wide: true });
send({ type: 'uzbank:sheet-title', title: C.copy.title });
/* Nothing is entered that is not recomputed at once, so closing never asks (D24) */
send({ type: 'uzbank:fridge-state', canBack: false, dirty: false });

const q = (name) => document.querySelector('[data-calc-' + name + ']');
const plot = document.querySelector('[data-inflation-plot]');
const yearsRange = q('years');
const amountRange = q('amount');
const strategyRange = q('strategy');
const yearsNum = q('years-num');
const amountNum = q('amount-num');
const results = q('results');
const live = q('live');

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const chf = (n) => 'CHF ' + fmt(n);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const sign = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n) + '%';

function shape(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
  return node;
}

/* The idle cash the tile uses: the Household and Savings running balances */
function idleCash() {
  const pay = window.UZBankPayState;
  if (!pay || !pay.getState) return 0;
  const b = pay.getState().accountBalances || {};
  return Math.max(0, (b.household || 0) + (b.savings || 0));
}

/* ── Static copy and slider limits ── */
q('intro').textContent = C.copy.intro;
q('years-label').textContent = C.copy.years;
q('amount-label').textContent = C.copy.amount;
q('strategy-label').textContent = C.copy.strategy;
q('safe').textContent = C.copy.safe;
q('risky').textContent = C.copy.risky;
q('disclaimer').textContent = C.copy.note + ' ' + C.copy.disclaimer + ' ' + C.copy.beforeInflation;
q('years-min').textContent = C.years.min;
q('years-max').textContent = C.years.max;
q('amount-min').textContent = fmt(AMOUNT.min);
q('amount-max').textContent = fmt(C.amount.max);
Object.assign(yearsRange, { min: C.years.min, max: C.years.max, step: 1 });
Object.assign(amountRange, { min: AMOUNT.min, max: C.amount.max, step: C.amount.step });
Object.assign(strategyRange, { min: 0, max: STRATEGIES.length - 1, step: 1 });
/* A field is named by the same label as its slider */
q('years-label').id = 'calc-years-label';
q('amount-label').id = 'calc-amount-label';
yearsNum.setAttribute('aria-labelledby', 'calc-years-label');
amountNum.setAttribute('aria-labelledby', 'calc-amount-label');

/* ── State: from the customer's own numbers, every time (82 D3, D25) ── */
const calc = {
  years: C.years.start,
  amount: clamp(Math.round(idleCash() / C.amount.step) * C.amount.step, AMOUNT.min, C.amount.max),
  strategy: Math.max(0, STRATEGIES.findIndex((s) => s.id === C.strategy.start)),
};

/* ── Curves, as percent of the amount (82 D8) ── */
const cashAt = (t) => 100 / Math.pow(1 + INFLATION, t);
function curve(k) {
  const { r, s } = C.mix[STRATEGIES[calc.strategy].id];
  return (t) => 100 * Math.exp(r * t + k * C.z * s * Math.sqrt(t));
}
const LINES = [['good', 1], ['expected', 0], ['bad', -1]];

function sample(fn, years) {
  const out = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = (years * i) / SAMPLES;
    out.push([t, fn(t)]);
  }
  return out;
}

function draw() {
  const W = plot.clientWidth;
  const H = plot.clientHeight;
  const years = calc.years;
  if (!W || !H) return;
  plot.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  while (plot.firstChild) plot.removeChild(plot.firstChild);
  const m = 2;
  const x = (t) => (t / years) * W;
  const path = (list, y) => list.map(([t, v], i) => (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  const data = {};
  LINES.forEach(([id, k]) => { data[id] = sample(curve(k), years); });
  /* One scale for all five strategies at this duration, so choosing a riskier one shows a steeper good line and
     choosing a safer one a flatter one, not the same picture refitted. From the lowest point of any unfavourable
     line (or the cash line's end) to the highest good line's end, snapped outward to 25 points, so the range moves
     in steps and not with every pixel of a drag (82 D8, D34) */
  const mixes = STRATEGIES.map((st) => C.mix[st.id]);
  const at = (m2, k, t) => 100 * Math.exp(m2.r * t + k * C.z * m2.s * Math.sqrt(t));
  const lo = Math.min(100, cashAt(years), ...mixes.map((m2) => Math.min(...sample((t) => at(m2, -1, t), years).map((p) => p[1]))));
  const hi = Math.max(100, ...mixes.map((m2) => at(m2, 1, years)));
  const y0 = Math.floor(lo / 25) * 25;
  const y1 = Math.ceil(hi / 25) * 25;
  const y = (v) => m + (H - 2 * m) * (1 - (v - y0) / (y1 - y0));
  const band = path(data.good, y) + ' ' + path([...data.bad].reverse(), y).replace(/^M/, 'L') + ' Z';
  const flat = y(100).toFixed(1);
  plot.appendChild(shape('path', { class: 'inflation-tile__band', d: band }));
  plot.appendChild(shape('line', { class: 'inflation-tile__flat', x1: 0, x2: W, y1: flat, y2: flat }));
  plot.appendChild(shape('path', { class: 'inflation-tile__line inflation-tile__line--cash', d: path(sample(cashAt, years), y) }));
  LINES.forEach(([id]) => {
    plot.appendChild(shape('path', { class: 'inflation-tile__line inflation-tile__line--' + id, d: path(data[id], y) }));
  });
}

/* The end values, rounded to CHF 100, with the change against the amount */
function endValues() {
  const { amount, years } = calc;
  const row = (pct) => {
    const end = Math.round((amount * pct) / 100 / 100) * 100;
    return { end, change: Math.round((end / amount - 1) * 100) };
  };
  return {
    good: row(curve(1)(years)),
    expected: row(curve(0)(years)),
    bad: row(curve(-1)(years)),
    cash: row(cashAt(years)),
  };
}

function drawResults(values) {
  results.textContent = '';
  ['good', 'expected', 'bad', 'cash'].forEach((id) => {
    const li = document.createElement('li');
    li.className = 'inflation-calc__result';
    const key = shape('svg', { class: 'inflation-calc__key', 'aria-hidden': 'true', focusable: 'false', viewBox: '0 0 24 4' });
    key.appendChild(shape('line', { class: 'inflation-tile__line inflation-tile__line--' + id, x1: 0, x2: 24, y1: 2, y2: 2 }));
    const name = document.createElement('span');
    name.className = 'inflation-calc__name';
    name.textContent = C.copy.lines[id];
    const amountEl = document.createElement('span');
    amountEl.className = 'inflation-calc__amount';
    amountEl.textContent = chf(values[id].end);
    const change = document.createElement('span');
    change.className = 'inflation-calc__change';
    change.textContent = sign(values[id].change);
    li.append(key, name, change, amountEl);
    results.appendChild(li);
  });
}

function progress(range) {
  range.style.setProperty('--cc-progress', ((range.value - range.min) / (range.max - range.min)) * 100 + '%');
}

function render() {
  yearsRange.value = calc.years;
  amountRange.value = calc.amount;
  strategyRange.value = calc.strategy;
  if (document.activeElement !== yearsNum) yearsNum.value = calc.years;
  if (document.activeElement !== amountNum) amountNum.value = fmt(calc.amount);
  const name = STRATEGIES[calc.strategy].name;
  q('strategy-name').textContent = name;
  strategyRange.setAttribute('aria-valuetext', name);
  [yearsRange, amountRange, strategyRange].forEach(progress);
  drawResults(endValues());
  draw();
}

/* ── Events ── */
yearsRange.addEventListener('input', () => { calc.years = +yearsRange.value; render(); });
amountRange.addEventListener('input', () => { calc.amount = +amountRange.value; render(); });
strategyRange.addEventListener('input', () => { calc.strategy = +strategyRange.value; render(); });

/* The result is said once a slider is released or a field committed, not on every step of a drag (82 D10) */
function say() {
  const v = endValues();
  const l = C.copy.lines;
  live.textContent = [l.good + ' ' + chf(v.good.end), l.expected + ' ' + chf(v.expected.end), l.bad + ' ' + chf(v.bad.end), l.cash + ' ' + chf(v.cash.end)].join(', ');
}
[yearsRange, amountRange, strategyRange].forEach((r) => r.addEventListener('change', say));

/* A typed value is clamped, and the amount rounded to the step, on Enter or blur; nothing is forced while typing (82 D4) */
function commit(field, kind) {
  const n = parseInt(field.value.replace(/\D/g, ''), 10);
  if (Number.isFinite(n)) {
    if (kind === 'years') calc.years = clamp(n, C.years.min, C.years.max);
    else calc.amount = clamp(Math.round(n / C.amount.step) * C.amount.step, AMOUNT.min, C.amount.max);
  }
  field.value = kind === 'years' ? calc.years : fmt(calc.amount);
  render();
  say();
}
[[yearsNum, 'years'], [amountNum, 'amount']].forEach(([field, kind]) => {
  field.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(field, kind); } });
  field.addEventListener('blur', () => commit(field, kind));
});

/* "See how much to invest": the fridge advisor replaces this page in the sheet, as if opened from Offers (D25) */
q('continue').addEventListener('click', () => { window.location.href = 'fridge-advisor.html'; });

/* Escape belongs to the sheet; the iframe has the keyboard after a click, so it passes the key on. */
window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !framed) return;
  event.preventDefault();
  send({ type: 'uzbank:fridge-escape' });
});

if ('ResizeObserver' in window) new ResizeObserver(draw).observe(plot);
render();
send({ type: 'uzbank:fridge-ready' });
