/**
 * Investment opening: the risk step's chart (roadmap 9e D1 to D5, D11, D13, D14).
 * The customer's amount over their horizon as three lines, good, expected and unfavourable, with the band between
 * good and unfavourable. Inline SVG, no library, drawn at its real size (a ResizeObserver) so strokes and the
 * draw-in stay even. The SVG is decoration: the line above it, the end values and the footnote are text and say
 * everything it shows. "How is this worked out?" shows the footnote in place of the plot (D11), so the step fits.
 * `highlight(part)` marks what the open question is about: 'bad' (the unfavourable line), 'band' (good and
 * unfavourable together) or 'expected'; null for none.
 */
const NS = 'http://www.w3.org/2000/svg';
const SAMPLES = 48;
const LINES = [['good', 1], ['expected', 0], ['bad', -1]];

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const chf = (n) => 'CHF ' + fmt(n);
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
let uid = 0;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function svg(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

export function riskChart({ amount, years, config }) {
  const { r, s, z } = config;
  const value = (t, k) => amount * Math.exp(r * t + k * z * s * Math.sqrt(t));
  const points = {};
  LINES.forEach(([id, k]) => {
    points[id] = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const t = (years * i) / SAMPLES;
      return [t, value(t, k)];
    });
  });
  /* The y range: from the lowest point of the unfavourable line to the good line's end, with a little air. */
  const lo = Math.min(...points.bad.map((p) => p[1]));
  const hi = points.good[SAMPLES][1];
  const pad = (hi - lo) * 0.08;
  const y0 = lo - pad;
  const y1 = hi + pad;

  const root = el('div', 'opening-chart');
  const intro = el('p', 'opening-chart__intro', fill(config.intro, { amount: chf(amount), years }));

  const plot = svg('svg', { class: 'opening-chart__plot', 'aria-hidden': 'true', focusable: 'false' });
  const band = svg('path', { class: 'opening-chart__band' });
  const start = svg('line', { class: 'opening-chart__start' });
  const lines = {};
  plot.append(band, start);
  LINES.forEach(([id]) => {
    lines[id] = svg('path', { class: 'opening-chart__line opening-chart__line--' + id, pathLength: 1 });
    plot.append(lines[id]);
  });

  function draw() {
    const W = plot.clientWidth;
    const H = plot.clientHeight;
    if (!W || !H) return;
    plot.setAttribute('viewBox', `0 0 ${W} ${H}`);
    /* A stroke's width of room at the top and bottom, so the heavier highlight is not cut. */
    const m = 2;
    const x = (t) => (t / years) * W;
    const y = (v) => m + (H - 2 * m) * (1 - (v - y0) / (y1 - y0));
    const d = (list) => list.map(([t, v], i) => (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
    band.setAttribute('d', d(points.good) + ' ' + d([...points.bad].reverse()).replace(/^M/, 'L') + ' Z');
    ['x1', 'x2'].forEach((k, i) => start.setAttribute(k, i * W));
    ['y1', 'y2'].forEach((k) => start.setAttribute(k, y(amount).toFixed(1)));
    LINES.forEach(([id]) => lines[id].setAttribute('d', d(points[id])));
  }
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(plot);

  /* The end values, rounded to CHF 100, with the change in percent. */
  const list = el('ul', 'opening-chart__values');
  LINES.forEach(([id]) => {
    const end = Math.round(points[id][SAMPLES][1] / 100) * 100;
    const change = Math.round((end / amount - 1) * 100);
    const item = el('li', 'opening-chart__value opening-chart__value--' + id);
    const name = el('span', 'opening-chart__name', config.lines[id]);
    const key = el('span', 'opening-chart__key');
    key.setAttribute('aria-hidden', 'true');
    name.prepend(key);
    item.append(
      name,
      el('span', 'opening-chart__amount', chf(end)),
      el('span', 'opening-chart__change', (change > 0 ? '+' : change < 0 ? '−' : '') + Math.abs(change) + '%'),
    );
    list.append(item);
  });

  const note = el('p', 'opening-chart__note', config.footnote);
  note.id = 'opening-chart-note-' + (++uid);
  note.hidden = true;
  const toggle = el('button', 'opening-chart__toggle', config.how);
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', note.id);
  toggle.addEventListener('click', () => {
    const on = note.hidden;
    note.hidden = !on;
    root.classList.toggle('is-explained', on);
    toggle.setAttribute('aria-expanded', String(on));
    toggle.textContent = on ? config.back : config.how;
  });

  const side = el('div', 'opening-chart__side');
  side.append(intro, list, note, toggle);
  root.append(plot, side);

  return {
    root,
    highlight(part) {
      if (part) root.dataset.part = part;
      else delete root.dataset.part;
    },
  };
}
