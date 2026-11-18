/**
 * Overview: "Cash loses value" (roadmap 79).
 * The customer's idle cash, the Household and Savings running balances, over a few years at a placeholder rate of
 * inflation: a falling line for what the money buys, a flat dashed line for today's amount. Inline SVG, no library, no
 * animation. The SVG is decoration: the sentence and the two figures say everything it shows. Re-read when the
 * payment state changes. Hidden below `minIdle`, when there is nothing to lose.
 */
(function () {
  'use strict';

  /* Flagged: placeholders for the bank's numbers (79 D2). An example, not a forecast. */
  var CONFIG = {
    rate: 0.02,        /* inflation a year */
    years: 10,
    minIdle: 1000,     /* below this the tile is hidden (D3) */
    samples: 40,
    sentence: 'Left on an account, your {now} buys what {later} buys today in {years} years.',
    when: 'In {years} years',
    note: 'An example at {rate}% a year, not a forecast.'
  };

  var tile = document.querySelector('[data-inflation-tile]');
  if (!tile) return;
  var plot = tile.querySelector('[data-inflation-plot]');
  var NS = 'http://www.w3.org/2000/svg';

  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "'"); };
  var chf = function (n) { return 'CHF ' + fmt(n); };
  var fill = function (text, values) { return text.replace(/\{(\w+)\}/g, function (m, k) { return k in values ? values[k] : m; }); };

  function shape(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function idleCash() {
    var pay = window.UZBankPayState;
    if (!pay || !pay.getState) return 0;
    var b = pay.getState().accountBalances || {};
    return Math.max(0, (b.household || 0) + (b.savings || 0));
  }

  var amount = 0;
  var later = 0;

  function draw() {
    var W = plot.clientWidth;
    var H = plot.clientHeight;
    if (!W || !H || !amount) return;
    plot.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (plot.firstChild) plot.removeChild(plot.firstChild);
    var m = 2;
    var pad = (amount - later) * 0.12;
    var y0 = later - pad;
    var y1 = amount + pad;
    var x = function (t) { return (t / CONFIG.years) * W; };
    var y = function (v) { return m + (H - 2 * m) * (1 - (v - y0) / (y1 - y0)); };
    var pts = [];
    for (var i = 0; i <= CONFIG.samples; i++) {
      var t = (CONFIG.years * i) / CONFIG.samples;
      pts.push([x(t), y(amount / Math.pow(1 + CONFIG.rate, t))]);
    }
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var flat = y(amount).toFixed(1);
    /* What is lost: the band between today's amount and the falling line */
    plot.appendChild(shape('path', { class: 'inflation-tile__loss', d: line + ' L' + W + ' ' + flat + ' L0 ' + flat + ' Z' }));
    plot.appendChild(shape('line', { class: 'inflation-tile__flat', x1: 0, x2: W, y1: flat, y2: flat }));
    plot.appendChild(shape('path', { class: 'inflation-tile__line', d: line }));
  }

  function render() {
    amount = idleCash();
    if (amount < CONFIG.minIdle) { tile.hidden = true; return; }
    later = Math.round(amount / Math.pow(1 + CONFIG.rate, CONFIG.years) / 100) * 100;
    var values = { now: chf(amount), later: chf(later), years: CONFIG.years, rate: Math.round(CONFIG.rate * 1000) / 10 };
    tile.querySelector('[data-inflation-sentence]').textContent = fill(CONFIG.sentence, values);
    tile.querySelector('[data-inflation-today]').textContent = values.now;
    tile.querySelector('[data-inflation-when]').textContent = fill(CONFIG.when, values);
    tile.querySelector('[data-inflation-later]').textContent = values.later;
    tile.querySelector('[data-inflation-note]').textContent = fill(CONFIG.note, values);
    tile.hidden = false;
    draw();
  }

  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(plot);
  document.addEventListener('uzbank:state-changed', render);
  render();
})();
