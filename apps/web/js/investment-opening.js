/**
 * Investment opening ("Open asset management"): page script.
 * Loaded into the Overview sheet by the fridge advisor's "Show suitable products" (D1), or by the sheet itself
 * when a draft is resumed (D19). The sheet draws the header (Back, title, close); this page tells it how wide to be,
 * what to call itself and what it needs (can go back, has entries), and answers its Back, the same messages as the
 * fridge (D2, D3). Opened on its own, the page shows its own header.
 */
import {
  SCREENS, DRAFT_KEY, PLACEHOLDER, KNOWLEDGE, PURPOSE, HORIZON, AMOUNT, RISK, STRATEGIES, STRATEGY, SCORING,
} from './investment-opening-config.js';

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

/* ── Answer controls (D6) ────────────────────────────────────────────── */
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

/* A question label that names its option group. */
function label(text) {
  const p = el('p', 'opening__label', text);
  p.id = 'opening-label-' + (++uid);
  return p;
}

/* Single choice as option cards: a radio group of full-width buttons. Arrow keys move and choose (skipping
   unavailable options), Tab enters at the chosen one. `content(option, button)` fills a card; the default is the
   label and an optional line. `disabled(option)` makes one unavailable: it stays readable but cannot be chosen. */
function optionGroup({ labelEl, options, get, set, disabled = () => false, content }) {
  const group = el('div', 'opening-options');
  group.setAttribute('role', 'radiogroup');
  if (labelEl) group.setAttribute('aria-labelledby', labelEl.id);
  const buttons = options.map((option) => {
    const b = el('button', 'opening-option');
    b.type = 'button';
    b.setAttribute('role', 'radio');
    b.dataset.option = option.id;
    if (content) content(option, b);
    else {
      b.append(el('span', 'opening-option__label', option.label));
      if (option.line) b.append(el('span', 'opening-option__line', option.line));
    }
    b.addEventListener('click', () => {
      if (b.getAttribute('aria-disabled') === 'true') return;
      set(option.id);
    });
    group.append(b);
    return b;
  });
  const enabled = () => buttons.filter((b) => b.getAttribute('aria-disabled') !== 'true');
  group.addEventListener('keydown', (event) => {
    const list = enabled();
    const at = list.indexOf(document.activeElement);
    if (at < 0) return;
    let to = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') to = (at + 1) % list.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') to = (at - 1 + list.length) % list.length;
    else if (event.key === 'Home') to = 0;
    else if (event.key === 'End') to = list.length - 1;
    if (to === null) return;
    event.preventDefault();
    list[to].focus();
    set(list[to].dataset.option);
  });
  function refresh() {
    const value = get();
    buttons.forEach((b, i) => {
      const off = !!disabled(options[i]);
      b.setAttribute('aria-disabled', String(off));
      b.setAttribute('aria-checked', String(b.dataset.option === value));
    });
    /* One tab stop: the chosen option, or the first available one. */
    const list = enabled();
    const stop = list.find((b) => b.dataset.option === value) || list[0];
    buttons.forEach((b) => { b.tabIndex = b === stop ? 0 : -1; });
  }
  return { group, refresh };
}

/* ── The recommendation (D12) ───────────────────────────────────────── */
const rankOf = (id) => STRATEGIES.findIndex((s) => s.id === id);

function recommendation() {
  let sum = 0;
  for (const q of RISK.questions) {
    const option = q.options.find((o) => o.id === answers[q.id]);
    if (!option) return null;
    sum += option.score;
  }
  let rank = rankOf((SCORING.bands.find((b) => sum <= b.upTo) || SCORING.bands[SCORING.bands.length - 1]).strategy);
  SCORING.caps.forEach((cap) => { if (answers[cap.answer] === cap.is) rank = Math.min(rank, rankOf(cap.max)); });
  return STRATEGIES[rank].id;
}

/* A chosen strategy that is now above the profile falls back to the new recommendation, with a note (D12). */
function reconcile() {
  const rec = recommendation();
  if (rec && answers.strategy && rankOf(answers.strategy) > rankOf(rec)) {
    answers.strategy = rec;
    answers.strategyFellBack = true;
  }
}

/* The knowledge the Profile's financial knowledge slider suggests (D7), or null when it was never set. */
function profileKnowledge() {
  try {
    if (!window.UZBankPersona || window.localStorage.getItem(window.UZBankPersona.key) == null) return null;
    const v = window.UZBankPersona.read().values.knowledge;
    return KNOWLEDGE.options.filter((o) => v >= o.profileAt).pop().id;
  } catch (e) { return null; }
}

/* ── Screens 1 to 6: each returns its nodes, what is still missing (for Next) and a refresh after a change ── */
const BUILD = {
  intro() {
    const list = el('ul', 'opening__topics');
    SCREENS[0].topics.forEach((t) => list.append(el('li', null, t)));
    return { nodes: [list] };
  },

  knowledge() {
    if (!answers.knowledge) {
      const pre = profileKnowledge();
      if (pre) { answers.knowledge = pre; answers.knowledgeFrom = 'profile'; }
    }
    const note = el('p', 'opening__note', KNOWLEDGE.preselectedNote);
    const { group, refresh } = optionGroup({
      options: KNOWLEDGE.options,
      get: () => answers.knowledge,
      set: (id) => { answers.knowledge = id; delete answers.knowledgeFrom; changed(); },
    });
    group.setAttribute('aria-labelledby', 'opening-heading');
    return {
      nodes: [group, note],
      missing: () => (answers.knowledge ? '' : KNOWLEDGE.missing),
      refresh() { refresh(); note.hidden = answers.knowledgeFrom !== 'profile'; },
    };
  },

  purpose() {
    const purposeLabel = label(PURPOSE.label);
    const horizonLabel = label(HORIZON.label);
    const maxHorizon = () => {
      const p = PURPOSE.options.find((o) => o.id === answers.purpose);
      return p && p.maxHorizon ? HORIZON.options.findIndex((o) => o.id === p.maxHorizon) : HORIZON.options.length - 1;
    };
    const purpose = optionGroup({
      labelEl: purposeLabel,
      options: PURPOSE.options,
      get: () => answers.purpose,
      set: (id) => {
        answers.purpose = id;
        /* "Buy a home" limits the horizon (D8): a longer one already chosen is cleared. */
        const h = HORIZON.options.findIndex((o) => o.id === answers.horizon);
        if (h > maxHorizon()) delete answers.horizon;
        changed();
      },
    });
    const horizon = optionGroup({
      labelEl: horizonLabel,
      options: HORIZON.options,
      get: () => answers.horizon,
      set: (id) => { answers.horizon = id; changed(); },
      disabled: (o) => HORIZON.options.indexOf(o) > maxHorizon(),
    });
    const note = el('p', 'opening__note');
    note.id = 'opening-horizon-note';
    horizon.group.setAttribute('aria-describedby', note.id);
    return {
      nodes: [purposeLabel, purpose.group, horizonLabel, horizon.group, note],
      missing: () => (!answers.purpose ? PURPOSE.missing : !answers.horizon ? HORIZON.missing : ''),
      refresh() {
        purpose.refresh();
        horizon.refresh();
        const p = PURPOSE.options.find((o) => o.id === answers.purpose);
        note.textContent = p && p.note ? p.note : '';
        note.hidden = !note.textContent;
      },
    };
  },

  amount() {
    if (answers.amount === undefined && fridgeAmount > 0) answers.amount = fridgeAmount;
    const field = el('div', 'opening-amount');
    const lab = el('label', 'opening__label', AMOUNT.label);
    lab.htmlFor = 'opening-amount';
    const box = el('div', 'opening-amount__box');
    const unit = el('span', 'opening-amount__unit', 'CHF');
    unit.setAttribute('aria-hidden', 'true');
    const input = el('input', 'opening-amount__input');
    input.id = 'opening-amount';
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.value = answers.amount == null ? '' : fmt(answers.amount);
    box.append(unit, input);
    const suggestion = el('p', 'opening__note', fill(AMOUNT.suggestion, { amount: chf(fridgeAmount) }));
    suggestion.id = 'opening-amount-suggestion';
    suggestion.hidden = !(fridgeAmount > 0);
    const above = el('p', 'opening__note opening__note--check', AMOUNT.above);
    above.id = 'opening-amount-above';
    if (fridgeAmount > 0) input.setAttribute('aria-describedby', suggestion.id + ' ' + above.id);
    field.append(lab, box, suggestion, above);

    /* Digits and apostrophes; the value applies as it is typed, leaving the field tidies it. */
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9'’ ]/g, '');
      const digits = input.value.replace(/[^0-9]/g, '');
      answers.amount = digits === '' ? null : Number(digits);
      changed();
    });
    input.addEventListener('blur', () => { if (answers.amount != null) input.value = fmt(answers.amount); });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); if (answers.amount != null) input.value = fmt(answers.amount); }
    });
    return {
      nodes: [field],
      missing: () => (answers.amount == null ? AMOUNT.missing
        : answers.amount < AMOUNT.min ? fill(AMOUNT.belowMin, { min: chf(AMOUNT.min) }) : ''),
      refresh() { above.hidden = !(fridgeAmount > 0 && answers.amount > fridgeAmount); },
    };
  },

  risk() {
    const nodes = [];
    const groups = RISK.questions.map((q) => {
      const lab = label(q.label);
      const g = optionGroup({
        labelEl: lab,
        options: q.options,
        get: () => answers[q.id],
        set: (id) => { answers[q.id] = id; changed(); },
      });
      nodes.push(lab, g.group);
      return g;
    });
    return {
      nodes,
      missing: () => (RISK.questions.every((q) => answers[q.id]) ? '' : RISK.missing),
      refresh() { groups.forEach((g) => g.refresh()); },
    };
  },

  strategy() {
    const rec = recommendation();
    if (!answers.strategy && rec) answers.strategy = rec;
    const nodes = [];
    if (answers.strategyFellBack && rec) {
      nodes.push(el('p', 'opening__note opening__note--check', fill(STRATEGY.fellBack, { name: STRATEGIES[rankOf(rec)].name })));
      delete answers.strategyFellBack; /* said once */
    }
    const above = (s) => rec && rankOf(s.id) > rankOf(rec);
    const { group, refresh } = optionGroup({
      options: STRATEGIES,
      get: () => answers.strategy,
      set: (id) => { answers.strategy = id; changed(); },
      disabled: above,
      content: (s, b) => strategyCard(s, b, s.id === rec, above(s)),
    });
    group.classList.add('opening-options--cards');
    group.setAttribute('aria-labelledby', 'opening-heading');
    nodes.push(group);
    return { nodes, missing: () => (answers.strategy ? '' : STRATEGY.missing), refresh };
  },
};

/* Five steps, `n` of them filled, with the value for assistive tech. */
function meter(name, n, kind) {
  const row = el('span', 'opening-meter');
  row.append(el('span', 'opening-meter__label', name));
  const marks = el('span', 'opening-meter__marks opening-meter__marks--' + kind);
  marks.setAttribute('aria-hidden', 'true');
  for (let i = 1; i <= 5; i++) marks.append(el('span', 'opening-meter__mark' + (i <= n ? ' is-filled' : '')));
  row.append(marks, el('span', 'opening__sr', n + ' of 5'));
  return row;
}

/* A strategy card (D11): name and tag, the line, risk and return, and why it cannot be chosen. */
function strategyCard(s, b, recommended, above) {
  b.classList.add('opening-option--card');
  const head = el('span', 'opening-option__head');
  head.append(el('span', 'opening-option__label', s.name));
  if (recommended) head.append(el('span', 'opening-option__tag', STRATEGY.recommended));
  b.append(head, el('span', 'opening-option__line', s.line));
  const meters = el('span', 'opening-option__meters');
  meters.append(meter(STRATEGY.riskLabel, s.risk, 'bar'), meter(STRATEGY.returnLabel, s.ret, 'dots'));
  b.append(meters);
  if (above) b.append(el('span', 'opening-option__why', STRATEGY.unavailable));
}

/* The screen on show: its gate and refresh, called after every change. */
let current = null;

function changed() {
  reconcile();
  if (current) current.update();
  publish({ dirty: true });
  writeDraft();
}

function render(moveFocus, animate) {
  const screen = SCREENS[index];
  panel.innerHTML = '';
  const heading = el('h2', 'opening__heading', screen.title);
  heading.id = 'opening-heading';
  heading.tabIndex = -1;
  const built = BUILD[screen.id] ? BUILD[screen.id]() : { nodes: [] };
  const text = el('p', 'opening__text', screen.text || (BUILD[screen.id] ? '' : PLACEHOLDER));
  text.hidden = !text.textContent;
  const body = el('div', 'opening__body');
  body.append(...built.nodes);

  const actions = el('div', 'opening__actions');
  const hint = el('p', 'opening__note opening__hint');
  hint.id = 'opening-hint';
  const complete = screen.id === 'complete';
  const next = button(screen.next || 'Next', 'primary', () => (complete ? done() : go(index + 1)));
  next.setAttribute('aria-describedby', hint.id);
  actions.append(hint, next);
  if (screen.id === 'intro') actions.append(button('Start over', 'secondary', startOver));

  /* Next waits for the screen's answers, and a line says what is missing (D6). */
  current = {
    update() {
      if (built.refresh) built.refresh();
      const missing = built.missing ? built.missing() : '';
      next.disabled = !!missing;
      hint.textContent = missing;
      hint.hidden = !missing;
    },
  };
  current.update();

  panel.append(heading, text, body, actions);
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
