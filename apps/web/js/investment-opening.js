/**
 * Investment opening ("Open asset management"): page script.
 * Loaded into the Overview sheet by the fridge advisor's "Show suitable products" (D1), or by the sheet itself
 * when a draft is resumed (D19). The sheet draws the header (Back, title, close); this page tells it how wide to be,
 * what to call itself and what it needs (can go back, has entries), and answers its Back, the same messages as the
 * fridge (D2, D3). Opened on its own, the page shows its own header.
 */
import {
  SCREENS, DRAFT_KEY, KNOWLEDGE, PURPOSE, HORIZON, AMOUNT, RISK, STRATEGIES, STRATEGY, SCORING,
  ESG, TAX, INELIGIBLE, DOCUMENTS, SUMMARY, COMPLETE,
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
   label and an optional line. `disabled(option)` makes one unavailable: it stays readable but cannot be chosen.
   `set(id, how)` says how it was chosen: 'click' (pointer, Space, Enter) or 'key' (arrows, which only move). */
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
      set(option.id, 'click');
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
    set(list[to].dataset.option, 'key');
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
  /* Focus the group's tab stop (the chosen option, or the first available one). */
  const focus = () => { const stop = buttons.find((b) => b.tabIndex === 0); if (stop) stop.focus(); };
  return { group, refresh, focus };
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
    /* Short labels: two columns, so the screen fits the sheet without scrolling (D27). */
    purpose.group.classList.add('opening-options--grid');
    horizon.group.classList.add('opening-options--grid');
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

  /* Three questions on one screen, one open at a time (D27): an answered question folds into a line with its answer
     and Change, and the next open one follows. Arrow keys only move within the open question; choosing with a click,
     Space or Enter folds it and moves on. */
  risk() {
    const firstOpen = () => (RISK.questions.find((q) => !answers[q.id]) || {}).id || null;
    let open = firstOpen();
    const nodes = [];
    const parts = RISK.questions.map((q, i) => {
      const box = el('div', 'opening-question');
      const lab = label((i + 1) + '. ' + q.label);
      const g = optionGroup({
        labelEl: lab,
        options: q.options,
        get: () => answers[q.id],
        set: (id, how) => {
          answers[q.id] = id;
          if (how === 'click') {
            open = firstOpen();
            changed();
            const next = parts.find((p) => p.q.id === open);
            if (next) next.g.focus();
            else nextButton().focus();
          } else changed();
        },
      });
      const done = el('div', 'opening-question__done');
      const doneText = el('p', 'opening-question__answer');
      const change = el('button', 'uz-btn uz-btn--secondary uz-btn--sm opening-question__change', 'Change');
      change.type = 'button';
      change.setAttribute('aria-label', 'Change: ' + q.label);
      change.addEventListener('click', () => { open = q.id; current.update(); g.focus(); });
      done.append(doneText, change);
      box.append(lab, g.group, done);
      nodes.push(box);
      return { q, g, box, lab, done, doneText };
    });
    return {
      nodes,
      missing: () => (RISK.questions.every((q) => answers[q.id]) ? '' : RISK.missing),
      refresh() {
        parts.forEach(({ q, g, box, done, doneText }) => {
          g.refresh();
          const option = q.options.find((o) => o.id === answers[q.id]);
          const state = q.id === open ? 'open' : option ? 'done' : 'waiting';
          box.dataset.state = state;
          g.group.hidden = state !== 'open';
          done.hidden = state !== 'done';
          doneText.textContent = option ? option.label : '';
        });
      },
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
    /* The unavailable cards are the riskiest, so they come last: one line above them says why (D11, D27). */
    const firstAbove = STRATEGIES.find(above);
    if (firstAbove) {
      const why = el('p', 'opening-options__why', STRATEGY.unavailable);
      why.id = 'opening-strategy-above';
      group.querySelector('[data-option="' + firstAbove.id + '"]').before(why);
    }
    nodes.push(group);
    return { nodes, missing: () => (answers.strategy ? '' : STRATEGY.missing), refresh };
  },

  esg() {
    const lab = label(ESG.label);
    const { group, refresh } = optionGroup({
      labelEl: lab,
      options: ESG.options,
      get: () => answers.esg,
      set: (id) => { answers.esg = id; changed(); },
    });
    return { nodes: [lab, group], missing: () => (answers.esg ? '' : ESG.missing), refresh };
  },

  /* Two questions; the US criteria wait behind "What counts?" (D14, D27). */
  tax() {
    const nodes = [];
    const groups = TAX.questions.map((q) => {
      const lab = label(q.label);
      const g = optionGroup({
        labelEl: lab,
        options: q.options,
        get: () => answers[q.id],
        set: (id) => { answers[q.id] = id; changed(); },
      });
      g.group.classList.add('opening-options--grid');
      nodes.push(lab);
      if (q.more) {
        const more = el('details', 'opening-more');
        more.append(el('summary', 'opening-more__summary', q.more.label), el('p', 'opening-more__text', q.more.text));
        nodes.push(more);
      }
      nodes.push(g.group);
      return g;
    });
    return {
      nodes,
      missing: () => (TAX.questions.every((q) => answers[q.id]) ? '' : TAX.missing),
      refresh() { groups.forEach((g) => g.refresh()); },
    };
  },

  /* The exit (D15): an appointment (simulated) or back to the tax answers. The draft is kept. */
  ineligible() {
    if (booked) {
      return {
        nodes: [el('p', 'opening__note opening__note--check', INELIGIBLE.booked), el('p', 'opening__note', INELIGIBLE.kept)],
        actions: [button(INELIGIBLE.done, 'primary', leave)],
        dirty: false,
      };
    }
    return {
      nodes: [el('p', 'opening__note', INELIGIBLE.kept)],
      actions: [
        button(INELIGIBLE.book, 'primary', () => { booked = true; render(true, false); }),
        button(INELIGIBLE.change, 'secondary', () => go(indexOf('tax'))),
      ],
    };
  },

  /* The contracts listed; the information sheets behind one row that opens their list in place (D16, D27). */
  documents() {
    const main = el('div', 'opening-docs');
    main.append(label(DOCUMENTS.contractsLabel), docList(DOCUMENTS.contracts));
    const row = el('button', 'opening-docs__row');
    row.type = 'button';
    row.innerHTML = '<svg class="opening-docs__icon" aria-hidden="true" focusable="false"><use href="#i-file-text"/></svg>';
    const rowText = el('span', 'opening-docs__row-text');
    rowText.append(el('span', 'opening-docs__name', DOCUMENTS.sheetsLabel),
      el('span', 'opening-docs__count', fill(DOCUMENTS.sheetsCount, { n: DOCUMENTS.sheets.length })));
    row.append(rowText);
    row.insertAdjacentHTML('beforeend', '<svg class="opening-docs__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>');
    const check = el('label', 'opening-check');
    const box = el('input', 'opening-check__input');
    box.type = 'checkbox';
    box.checked = !!answers.documents;
    box.addEventListener('change', () => { answers.documents = box.checked; changed(); });
    check.append(box, el('span', 'opening-check__text', DOCUMENTS.accept));
    main.append(row, el('p', 'opening__note', DOCUMENTS.note), check);

    const sheets = el('div', 'opening-docs');
    sheets.hidden = true;
    const back = button(DOCUMENTS.sheetsBack, 'secondary', () => show(false));
    back.className = 'uz-btn uz-btn--secondary uz-btn--sm opening-docs__back';
    const sheetsLabel = label(DOCUMENTS.sheetsLabel);
    sheets.append(back, sheetsLabel, docList(DOCUMENTS.sheets, true));
    function show(open) {
      main.hidden = open;
      sheets.hidden = !open;
      (open ? back : row).focus();
    }
    row.addEventListener('click', () => show(true));
    return { nodes: [main, sheets], missing: () => (answers.documents ? '' : DOCUMENTS.missing) };
  },

  /* Grouped sections, one Edit each (D17, D27). */
  summary() {
    const nodes = [];
    if (recChangedTo) nodes.push(el('p', 'opening__note opening__note--check', fill(SUMMARY.changed, { name: recChangedTo })));
    const rec = recommendation();
    const s = STRATEGIES[rankOf(answers.strategy)] || STRATEGIES[rankOf(rec)];
    SUMMARY.sections.forEach((section) => {
      const box = el('section', 'opening-summary__section opening-summary__section--' + section.id);
      const head = el('div', 'opening-summary__head');
      const title = el('h3', 'opening-summary__label', section.label);
      title.id = 'opening-summary-' + section.id;
      const edit = button(SUMMARY.edit, 'secondary', () => startEdit(section));
      edit.className = 'uz-btn uz-btn--secondary uz-btn--sm';
      edit.setAttribute('aria-describedby', title.id);
      head.append(title);
      if (section.id === 'amount') head.append(el('span', 'opening-summary__value', chf(answers.amount || 0)));
      head.append(edit);
      box.append(head);
      if (section.id === 'strategy' && s) {
        const card = el('div', 'opening-summary__strategy');
        const name = el('p', 'opening-summary__name');
        name.append(el('span', 'opening-option__label', s.name));
        if (s.id === rec) name.append(el('span', 'opening-option__tag', STRATEGY.recommended));
        const meters = el('div', 'opening-option__meters');
        meters.append(meter(STRATEGY.riskLabel, s.risk, 'bar'), meter(STRATEGY.returnLabel, s.ret, 'dots'));
        card.append(name, el('p', 'opening__note', s.line), meters);
        box.append(card);
      }
      if (section.id === 'answers') box.append(answerList(rec));
      nodes.push(box);
    });
    return { nodes };
  },

  /* Completion (D20): the strategy, the amount and the next step in words; the mandate is already stored. */
  complete() {
    const s = STRATEGIES[rankOf(answers.strategy)];
    const card = el('dl', 'opening-summary__answers opening-summary__answers--done');
    [['Strategy', s ? s.name : ''], ['Amount', chf(answers.amount || 0)]].forEach(([k, v]) => {
      card.append(el('dt', null, k), el('dd', null, v));
    });
    return { nodes: [card, el('p', 'opening__text', fill(COMPLETE.next, { amount: chf(answers.amount || 0) }))] };
  },
};

/* A list of document names (no links: there are no files, D16). */
function docList(names, compact) {
  const list = el('ul', 'opening-docs__list' + (compact ? ' opening-docs__list--compact' : ''));
  names.forEach((name) => {
    const li = el('li', 'opening-docs__item');
    li.innerHTML = '<svg class="opening-docs__icon" aria-hidden="true" focusable="false"><use href="#i-file-text"/></svg>';
    li.append(el('span', 'opening-docs__name', name));
    list.append(li);
  });
  return list;
}

/* The answers as label and value, for the summary. */
function answerList(rec) {
  const find = (list, id) => (list.find((o) => o.id === id) || {}).label || '';
  const taxOk = TAX.questions.every((q) => answers[q.id] === q.eligible);
  const rows = [
    [SUMMARY.rows.knowledge, find(KNOWLEDGE.options, answers.knowledge)],
    [SUMMARY.rows.purpose, find(PURPOSE.options, answers.purpose)],
    [SUMMARY.rows.horizon, find(HORIZON.options, answers.horizon)],
    [SUMMARY.rows.risk, rec ? STRATEGIES[rankOf(rec)].name : ''],
    [ESG.summary, find(ESG.options, answers.esg)],
    [TAX.summary, taxOk ? TAX.eligibleSummary : ''],
  ];
  const list = el('dl', 'opening-summary__answers');
  rows.forEach(([k, v]) => list.append(el('dt', null, k), el('dd', null, v)));
  return list;
}

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

/* A strategy card (D11): one row with the name, the tag and risk and return, then the line. The line shows on the
   chosen card only, so five cards fit the sheet (D27); every card is still described by it, and an unavailable one
   also by the "Above your risk profile" line over the unavailable cards (see the strategy screen). */
function strategyCard(s, b, recommended, above) {
  b.classList.add('opening-option--card');
  const head = el('span', 'opening-option__head');
  const name = el('span', 'opening-option__name');
  name.append(el('span', 'opening-option__label', s.name));
  if (recommended) name.append(el('span', 'opening-option__tag', STRATEGY.recommended));
  const meters = el('span', 'opening-option__meters');
  meters.append(meter(STRATEGY.riskLabel, s.risk, 'bar'), meter(STRATEGY.returnLabel, s.ret, 'dots'));
  head.append(name, meters);
  const line = el('span', 'opening-option__line opening-option__line--chosen', s.line);
  line.id = 'opening-strategy-' + s.id;
  b.setAttribute('aria-describedby', line.id + (above ? ' opening-strategy-above' : ''));
  b.append(head, line);
}

/* The screen on show: its gate and refresh, called after every change. */
let current = null;
const nextButton = () => panel.querySelector('.opening__actions .uz-btn--primary');
const indexOf = (id) => SCREENS.findIndex((x) => x.id === id);

/* Editing from the summary (D17, D27): the screens of one section, and the recommendation before the edit. */
let edit = null;
let recChangedTo = null;
let booked = false;

function startEdit(section) {
  edit = { screens: section.screens, before: recommendation() };
  go(indexOf(section.screens[0]));
}

function backToSummary() {
  const now = recommendation();
  recChangedTo = edit && now && now !== edit.before ? STRATEGIES[rankOf(now)].name : null;
  edit = null;
  go(indexOf('summary'), true);
}

const eligible = () => TAX.questions.every((q) => answers[q.id] === q.eligible);

/* Next: the tax answers can lead to the exit (D15); the summary opens the mandate (D21); an edit returns. */
function forward() {
  const id = SCREENS[index].id;
  if (id === 'complete') { done(); return; }
  if (id === 'summary') { openMandate(); return; }
  if (id === 'tax' && !eligible()) { edit = null; booked = false; go(indexOf('ineligible')); return; }
  if (edit && edit.screens.includes(id)) { backToSummary(); return; }
  go(index + 1);
}

/* Completing writes the mandate into the payment state, where Overview shows it as pending (D21). */
function openMandate() {
  const s = STRATEGIES[rankOf(answers.strategy)];
  if (window.UZBankPayState && typeof window.UZBankPayState.commitMandate === 'function') {
    window.UZBankPayState.commitMandate({ strategy: s.id, strategyName: s.name, amount: answers.amount });
  }
  go(indexOf('complete'));
}

function changed() {
  reconcile();
  if (current) current.update();
  publish({ dirty: true });
  writeDraft();
}

function render(moveFocus, animate, back) {
  const screen = SCREENS[index];
  panel.innerHTML = '';
  const heading = el('h2', 'opening__heading', screen.title);
  heading.id = 'opening-heading';
  heading.tabIndex = -1;
  const built = BUILD[screen.id]();
  const text = el('p', 'opening__text', screen.text || '');
  text.hidden = !text.textContent;
  const body = el('div', 'opening__body');
  body.append(...built.nodes);
  /* The screen slides in like the payment flow's steps; the buttons stay put (D24). */
  const content = el('div', 'opening__screen' + (animate ? ' opening__screen--in-' + (back ? 'b' : 'f') : ''));
  content.append(heading, text, body);

  const actions = el('div', 'opening__actions');
  const hint = el('p', 'opening__note opening__hint');
  hint.id = 'opening-hint';
  const buttons = [];
  const gated = []; /* the buttons that wait for the screen's answers */
  if (built.actions) buttons.push(...built.actions);
  else {
    const editing = edit && edit.screens.includes(screen.id);
    const next = button(editing ? SUMMARY.backToSummary : screen.next || 'Next', 'primary', forward);
    next.setAttribute('aria-describedby', hint.id);
    buttons.push(next);
    gated.push(next);
    /* While editing, the section's next screen is one step away; the last one only returns. */
    const after = editing ? edit.screens[edit.screens.indexOf(screen.id) + 1] : null;
    if (after) {
      const more = button(SUMMARY.nextInSection, 'secondary', () => go(indexOf(after)));
      buttons.push(more);
      gated.push(more);
    }
    if (screen.id === 'intro') buttons.push(button('Start over', 'secondary', startOver));
  }
  actions.append(hint, ...buttons);

  /* Next waits for the screen's answers, and a line says what is missing (D6). */
  current = {
    update() {
      if (built.refresh) built.refresh();
      const missing = built.missing ? built.missing() : '';
      gated.forEach((b) => { b.disabled = !!missing; });
      hint.textContent = missing;
      hint.hidden = !missing;
    },
  };
  current.update();

  panel.append(content, actions);
  panel.scrollTop = 0;
  showStep(animate);
  if (moveFocus) heading.focus({ preventScroll: true });

  const n = COUNTED.indexOf(screen);
  announce((n >= 0 ? 'Step ' + (n + 1) + ' of ' + TOTAL + ', ' : '') + screen.title);
  /* Nothing to lose on completion or after booking; everywhere else the exit asks first, and says the answers are kept (D3). */
  const complete = screen.id === 'complete';
  publish({
    canBack: index > 0 && !complete,
    dirty: built.dirty !== false && !complete && (index > 0 || Object.keys(answers).length > 0),
  });
  if (complete) clearDraft();
  else writeDraft();
}

function done() {
  clearDraft();
  leave();
}

function go(to, back) {
  if (to < 0 || to >= SCREENS.length) return;
  const dir = back === undefined ? to < index : back;
  if (SCREENS[to].id !== 'summary') recChangedTo = null;
  index = to;
  render(true, true, dir);
}

/* Back walks the counted screens. From the exit it returns to the tax screen that led there (D15); while editing,
   it walks the section back and then returns to the summary. */
function goBack() {
  const id = SCREENS[index].id;
  if (id === 'ineligible') { go(indexOf('tax'), true); return; }
  if (edit && edit.screens.includes(id)) {
    const at = edit.screens.indexOf(id);
    if (at > 0) go(indexOf(edit.screens[at - 1]), true);
    else backToSummary();
    return;
  }
  if (index > 0) go(index - 1, true);
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

/* A draft is checked against the rules once more, so a stored strategy is never above the profile (D12). */
reconcile();
/* Framed, the page replaced the fridge in the sheet: the heading takes focus so a screen reader starts here. */
render(framed, false);
send({ type: 'uzbank:fridge-ready' });
