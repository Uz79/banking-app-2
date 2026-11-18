/**
 * Overview: "Cash loses value" (roadmap 79) and its calculator (roadmap 82).
 * Closed: the customer's idle cash, the Household and Savings running balances, over a few years at a placeholder rate
 * of inflation: a falling line for what the money buys, a flat dashed line for today's amount. Open (the expander):
 * three sliders, duration, amount and strategy, and the good, expected and unfavourable investment curves are drawn
 * into the same chart, on the same axes, with the cash line for the slider's amount and duration. Inline SVG, no
 * library, no animation (a change redraws at once). The SVG is decoration: the sentence, the results list and a live
 * region say everything it shows. Re-read when the payment state changes. Hidden below `minIdle`.
 */
import { AMOUNT, STRATEGIES, CALCULATOR } from './investment-opening-config.js';

/* Flagged: placeholders for the bank's numbers (79 D2, 82 D6). An example, not a forecast. */
const CONFIG = {
  rate: CALCULATOR.inflation, /* inflation a year */
  years: 10,
  minIdle: 1000,              /* below this the tile is hidden (79 D3) */
  samples: 40,
  sentence: 'Left on an account, your {now} buys what {later} buys today in {years} years.',
  when: 'In {years} years',
  note: 'An example at {rate}% a year, not a forecast.',
};

const tile = document.querySelector('[data-inflation-tile]');
if (tile) init(tile);

function init(tile) {
  const NS = 'http://www.w3.org/2000/svg';
  const plot = tile.querySelector('[data-inflation-plot]');
  const q = (name) => tile.querySelector('[data-calc-' + name + ']');
  const toggle = q('toggle');
  const panel = q('panel');
  const yearsRange = q('years');
  const amountRange = q('amount');
  const strategyRange = q('strategy');
  const yearsNum = q('years-num');
  const amountNum = q('amount-num');
  const results = q('results');
  const live = q('live');
  const C = CALCULATOR;

  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  const chf = (n) => 'CHF ' + fmt(n);
  const fill = (text, values) => text.replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const sign = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n) + '%';

  function shape(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
    return node;
  }

  function idleCash() {
    const pay = window.UZBankPayState;
    if (!pay || !pay.getState) return 0;
    const b = pay.getState().accountBalances || {};
    return Math.max(0, (b.household || 0) + (b.savings || 0));
  }

  /* ── Static copy and slider limits ── */
  q('toggle-label').textContent = C.copy.open;
  q('years-label').textContent = C.copy.years;
  q('amount-label').textContent = C.copy.amount;
  q('strategy-label').textContent = C.copy.strategy;
  q('safe').textContent = C.copy.safe;
  q('risky').textContent = C.copy.risky;
  q('disclaimer').textContent = C.copy.disclaimer + ' ' + C.copy.beforeInflation;
  q('years-min').textContent = C.years.min;
  q('years-max').textContent = C.years.max;
  q('amount-min').textContent = fmt(AMOUNT.min);
  q('amount-max').textContent = fmt(C.amount.max);
  Object.assign(yearsRange, { min: C.years.min, max: C.years.max, step: 1 });
  Object.assign(amountRange, { min: AMOUNT.min, max: C.amount.max, step: C.amount.step });
  Object.assign(strategyRange, { min: 0, max: STRATEGIES.length - 1, step: 1 });
  /* A field is named by the same label as its slider */
  q('years-label').id = 'inflation-calc-years-label';
  q('amount-label').id = 'inflation-calc-amount-label';
  yearsNum.setAttribute('aria-labelledby', 'inflation-calc-years-label');
  amountNum.setAttribute('aria-labelledby', 'inflation-calc-amount-label');

  /* ── State ── */
  let idle = 0;
  let open = false;
  const calc = { years: C.years.start, amount: AMOUNT.min, strategy: 0 };

  /* From the customer's own numbers each time it opens (82 D3) */
  function startValues() {
    calc.years = C.years.start;
    calc.amount = clamp(Math.round(idle / C.amount.step) * C.amount.step, AMOUNT.min, C.amount.max);
    calc.strategy = Math.max(0, STRATEGIES.findIndex((s) => s.id === C.strategy.start));
  }

  /* Closed: idle cash over 10 years. Open: the sliders' amount and duration, so the comparison is like for like (82 D2). */
  const shown = () => (open ? { amount: calc.amount, years: calc.years } : { amount: idle, years: CONFIG.years });

  /* ── Curves, as percent of the amount (82 D8) ── */
  const cashAt = (t) => 100 / Math.pow(1 + CONFIG.rate, t);
  function curve(k) {
    const { r, s } = C.mix[STRATEGIES[calc.strategy].id];
    return (t) => 100 * Math.exp(r * t + k * C.z * s * Math.sqrt(t));
  }
  const LINES = [['good', 1], ['expected', 0], ['bad', -1]];

  function sample(fn, years) {
    const out = [];
    for (let i = 0; i <= CONFIG.samples; i++) {
      const t = (years * i) / CONFIG.samples;
      out.push([t, fn(t)]);
    }
    return out;
  }

  function draw() {
    const W = plot.clientWidth;
    const H = plot.clientHeight;
    const { amount, years } = shown();
    if (!W || !H || !amount) return;
    plot.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (plot.firstChild) plot.removeChild(plot.firstChild);
    const m = 2;
    const x = (t) => (t / years) * W;
    const path = (list, y) => list.map(([t, v], i) => (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
    const cash = sample(cashAt, years);

    if (!open) {
      /* As in 79: the cash line over the flat line, the band between them is what is lost */
      const lo = cashAt(years);
      const pad = (100 - lo) * 0.12;
      const y = (v) => m + (H - 2 * m) * (1 - (v - (lo - pad)) / (100 + pad - (lo - pad)));
      const line = path(cash, y);
      const flat = y(100).toFixed(1);
      plot.appendChild(shape('path', { class: 'inflation-tile__loss', d: line + ' L' + W + ' ' + flat + ' L0 ' + flat + ' Z' }));
      plot.appendChild(shape('line', { class: 'inflation-tile__flat', x1: 0, x2: W, y1: flat, y2: flat }));
      plot.appendChild(shape('path', { class: 'inflation-tile__line inflation-tile__line--cash', d: line }));
      return;
    }

    const data = {};
    LINES.forEach(([id, k]) => { data[id] = sample(curve(k), years); });
    /* From the lowest point of the unfavourable line (or the cash line's end) to the good line's end, snapped outward
       to 25 points, so the range moves in steps and not with every pixel of a drag (82 D8) */
    const lo = Math.min(100, cashAt(years), ...data.bad.map((p) => p[1]));
    const hi = Math.max(100, data.good[CONFIG.samples][1]);
    const y0 = Math.floor(lo / 25) * 25;
    const y1 = Math.ceil(hi / 25) * 25;
    const y = (v) => m + (H - 2 * m) * (1 - (v - y0) / (y1 - y0));
    const band = path(data.good, y) + ' ' + path([...data.bad].reverse(), y).replace(/^M/, 'L') + ' Z';
    const flat = y(100).toFixed(1);
    plot.appendChild(shape('path', { class: 'inflation-tile__band', d: band }));
    plot.appendChild(shape('line', { class: 'inflation-tile__flat', x1: 0, x2: W, y1: flat, y2: flat }));
    plot.appendChild(shape('path', { class: 'inflation-tile__line inflation-tile__line--cash', d: path(cash, y) }));
    LINES.forEach(([id]) => {
      plot.appendChild(shape('path', { class: 'inflation-tile__line inflation-tile__line--' + id, d: path(data[id], y) }));
    });
  }

  /* The end values, rounded to CHF 100, with the change against the amount */
  function endValues() {
    const { amount, years } = shown();
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
      li.append(key, name, amountEl, change);
      results.appendChild(li);
    });
  }

  function progress(range) {
    range.style.setProperty('--cc-progress', ((range.value - range.min) / (range.max - range.min)) * 100 + '%');
  }

  function renderControls() {
    yearsRange.value = calc.years;
    amountRange.value = calc.amount;
    strategyRange.value = calc.strategy;
    if (document.activeElement !== yearsNum) yearsNum.value = calc.years;
    if (document.activeElement !== amountNum) amountNum.value = fmt(calc.amount);
    const name = STRATEGIES[calc.strategy].name;
    q('strategy-name').textContent = name;
    strategyRange.setAttribute('aria-valuetext', name);
    [yearsRange, amountRange, strategyRange].forEach(progress);
  }

  function renderText() {
    const { amount, years } = shown();
    const later = Math.round(amount / Math.pow(1 + CONFIG.rate, years) / 100) * 100;
    const values = { now: chf(amount), later: chf(later), years, rate: Math.round(CONFIG.rate * 1000) / 10 };
    tile.querySelector('[data-inflation-sentence]').textContent = fill(CONFIG.sentence, values);
    tile.querySelector('[data-inflation-today]').textContent = values.now;
    tile.querySelector('[data-inflation-when]').textContent = fill(CONFIG.when, values);
    tile.querySelector('[data-inflation-later]').textContent = values.later;
    tile.querySelector('[data-inflation-note]').textContent = fill(CONFIG.note, values);
  }

  function render() {
    if (idle < CONFIG.minIdle) { tile.hidden = true; return; }
    renderText();
    if (open) { renderControls(); drawResults(endValues()); }
    tile.hidden = false;
    draw();
  }

  function setOpen(on) {
    open = on;
    if (on) startValues();
    toggle.setAttribute('aria-expanded', String(on));
    panel.hidden = !on;
    tile.classList.toggle('is-calculating', on);
    render();
  }

  /* ── Events ── */
  toggle.addEventListener('click', () => setOpen(!open));

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
    if (!open) return;
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

  function reread() {
    idle = idleCash();
    render();
  }

  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(plot);
  document.addEventListener('uzbank:state-changed', reread);
  reread();
}
