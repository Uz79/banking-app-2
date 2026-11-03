/**
 * Investment opening ("Open asset management"): page script.
 * Loaded into the Overview sheet by the fridge advisor's "Show suitable products" (D1), or by the sheet itself
 * when a draft is resumed (D19). The sheet draws the header (Back, title, close); this page tells it how wide to be,
 * what to call itself and what it needs (can go back, has entries), and answers its Back, the same messages as the
 * fridge (D2, D3). Opened on its own, the page shows its own header.
 */
import {
  SCREENS, DRAFT_KEY, KNOWLEDGE, PURPOSE, HORIZON, AMOUNT, RISK, STRATEGIES, STRATEGY, SCORING, VEHICLE_STAGE,
  ESG, TAX, INELIGIBLE, DOCUMENTS, SUMMARY, COMPLETE,
} from './investment-opening-config.js';
import * as assistant from './opening-assistant.js';

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
/* The sheet stays 960 for the opening too: the assistant's column is beside the step (9b D24). */
send({ type: 'uzbank:sheet-layout', wide: true });
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
  assistant.close(false);
  if (framed) send({ type: 'uzbank:fridge-close' });
  else window.location.href = 'overview.html';
}

/* Start over (D19): forget the draft and go back to the fridge. */
function startOver() {
  clearDraft();
  window.location.href = 'fridge-advisor.html';
}

/* ── Answer controls (D6) ────────────────────────────────────────────── */
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const chf = (n) => 'CHF ' + fmt(n);
/* The assistant's risk answer uses the customer's own amount (9b D7); an example amount until there is one. */
assistant.setValues(() => {
  const amount = answers.amount || 10000;
  return { amount: chf(amount), after20: chf(amount * 0.8) };
});
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
  const stop = () => buttons.find((b) => b.tabIndex === 0);
  const focus = () => { if (stop()) stop().focus(); };
  return { group, refresh, focus, stop };
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

/* ── The vehicles (9d) ──────────────────────────────────────────────────
   The module and the models load on the risk screen (or on arrival, D3) into a holder that is never shown, so they
   stay for the session. The screen on show hosts the canvas: the strategy carousel in its current card, with the
   other cards as stills from the same renderer (D19), and the summary in its Strategy section (9d D20). Without 3D the
   host drops its figures (D4). */
const vehicles = { holder: document.createElement('div'), stage: null, failed: false, loading: false, on: false, shots: {}, shotsKey: '', host: null };
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadVehicles() {
  if (vehicles.loading || vehicles.failed) return;
  vehicles.loading = true;
  import('./character-vehicles.js')
    .then(({ mountVehicles }) => mountVehicles(vehicles.holder, {
      reduced: reducedMotion,
      active: () => vehicles.on && !document.hidden,
      strategy: answers.strategy || recommendation() || 'balanced',
      /* The customer's own persona (D5); the pose, not the profile's loop, decides the clip. */
      recipe: () => {
        const { loop, ...parts } = window.UZBankPersona.read().recipe;
        return parts;
      },
      /* A new theme recolours the stage, so the stills are taken again. */
      onTheme: () => { vehicles.shotsKey = ''; placeVehicles(); },
    }))
    .then((stage) => {
      vehicles.stage = stage;
      placeVehicles();
    })
    .catch((err) => {
      vehicles.failed = true;
      if (vehicles.host) vehicles.host.root.classList.add('is-flat');
      console.warn('[opening] the vehicles did not load', err);
    });
}

/* The canvas goes into the host's figure. A host with stills (the carousel) gets them again when its figure's size
   changes. */
function placeVehicles() {
  const c = vehicles.host;
  if (!vehicles.stage || !c || !c.root.isConnected) return;
  const figure = c.figure();
  if (!figure.clientWidth || !figure.clientHeight) return;
  const id = c.id();
  if (c.stills) {
    const key = figure.clientWidth + 'x' + figure.clientHeight;
    if (key !== vehicles.shotsKey) {
      vehicles.stage.attach(figure, id);
      STRATEGIES.forEach((s) => { vehicles.shots[s.id] = vehicles.stage.snapshot(s.id); });
      vehicles.shotsKey = key;
    }
    c.stills(vehicles.shots);
  }
  vehicles.stage.attach(figure, id);
  c.root.classList.add('is-ready');
  if (vehicles.on) vehicles.stage.wake();
}

/* Drawing only while the strategy screen or the summary is on show and the page is visible (9d D11, D20). */
function vehiclesOn(on) {
  vehicles.on = on;
  vehicles.host = null;
  if (on && vehicles.stage) vehicles.stage.wake();
}
document.addEventListener('visibilitychange', () => { if (vehicles.on && !document.hidden && vehicles.stage) vehicles.stage.wake(); });

/* The models' credits as one short paragraph (D9): "Tricycle and Parachute by Poly by Google, …, CC BY 3.0. Tent by
   Quaternius, CC0. All from Poly Pizza." */
function vehicleCredits() {
  const link = (text, href) => {
    const a = el('a', 'opening-vehicles__link', text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  };
  const text = el('p', 'opening-vehicles__credits-text');
  const licences = [...new Set(VEHICLE_STAGE.credits.map((c) => c.licence))];
  licences.forEach((licence, i) => {
    const ofLicence = VEHICLE_STAGE.credits.filter((c) => c.licence === licence);
    const authors = [...new Set(ofLicence.map((c) => c.by))];
    if (i) text.append(' ');
    authors.forEach((by, j) => {
      if (j) text.append(', ');
      ofLicence.filter((c) => c.by === by).forEach((c, k, all) => {
        if (k) text.append(k === all.length - 1 ? ' and ' : ', ');
        text.append(link(c.name, c.url));
      });
      text.append(' by ' + by);
    });
    text.append(', ', link(licence, ofLicence[0].licenceUrl), '.');
  });
  text.append(' ' + VEHICLE_STAGE.creditsSource);
  return text;
}

/* ── The strategy carousel (9d D16 to D18) ──────────────────────────────
   Five cards in a horizontal scroller with scroll snap (swipe and trackpad for free); the arrows, the markers and the
   arrow keys call `go`. Only the current card is in the Tab order and the accessibility tree; a click on a peeking
   card moves to it. Choosing is the card's own button (D18). */
function strategyCarousel(rec) {
  const above = (s) => !!rec && rankOf(s.id) > rankOf(rec);
  const total = STRATEGIES.length;
  /* "Balanced, 3 of 5, recommended" (D17). */
  const nameOf = (s) => [
    s.name,
    fill(STRATEGY.position, { n: rankOf(s.id) + 1, total }),
    s.id === rec ? STRATEGY.recommended.toLowerCase() : above(s) ? STRATEGY.unavailable.toLowerCase() : '',
  ].filter(Boolean).join(', ');
  const start = Math.max(0, rankOf(answers.strategy || rec || STRATEGIES[0].id));
  let at = start;

  const root = el('div', 'opening-carousel' + (vehicles.failed ? ' is-flat' : ''));
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carousel');
  root.setAttribute('aria-label', STRATEGY.carousel);
  const frame = el('div', 'opening-carousel__frame');
  const track = el('div', 'opening-carousel__track');

  const cards = STRATEGIES.map((s, i) => {
    const card = el('div', 'opening-carousel__card');
    card.dataset.option = s.id;
    card.tabIndex = -1;
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', nameOf(s));
    if (above(s)) card.dataset.above = '';
    /* The picture: the figure, named by its caption (D8), and "Model credits" in its corner (D9). */
    const pic = el('div', 'opening-carousel__pic');
    const figure = el('div', 'opening-carousel__figure');
    figure.setAttribute('role', 'img');
    figure.setAttribute('aria-label', VEHICLE_STAGE.captions[s.id]);
    const still = el('img', 'opening-carousel__still');
    still.alt = '';
    still.hidden = true;
    figure.append(still);
    const credit = el('button', 'opening-vehicles__link opening-carousel__credit', VEHICLE_STAGE.creditsLink);
    credit.type = 'button';
    credit.setAttribute('aria-expanded', 'false');
    credit.setAttribute('aria-controls', 'opening-vehicle-credits');
    credit.addEventListener('click', () => showCredits(true));
    pic.append(figure, credit);
    const head = el('p', 'opening-carousel__name');
    head.append(el('span', 'opening-carousel__label', s.name));
    if (s.id === rec) head.append(el('span', 'opening-option__tag', STRATEGY.recommended));
    else if (above(s)) head.append(el('span', 'opening-carousel__above', STRATEGY.unavailable));
    const meters = el('p', 'opening-carousel__meters');
    meters.append(meter(STRATEGY.riskLabel, s.risk, 'bar'), meter(STRATEGY.returnLabel, s.ret, 'dots'));
    let action;
    if (above(s)) action = el('p', 'opening-carousel__reason', STRATEGY.reason);
    else {
      action = button(STRATEGY.choose, 'secondary', () => { answers.strategy = s.id; changed(); });
      action.classList.add('opening-carousel__choose');
    }
    card.append(pic, head, el('p', 'opening-carousel__line', s.short), meters, action);
    /* A peeking card is a way to it, not to its button. */
    card.addEventListener('click', (event) => {
      if (i === at) return;
      event.preventDefault();
      event.stopPropagation();
      go(i);
    }, true);
    track.append(card);
    return { card, figure, still, action, credit };
  });

  const arrow = (dir) => {
    const b = el('button', 'carousel__arrow opening-carousel__arrow opening-carousel__arrow--' + dir);
    b.type = 'button';
    b.setAttribute('aria-label', dir === 'prev' ? STRATEGY.previous : STRATEGY.next);
    b.innerHTML = '<svg class="carousel__arrow-icon" aria-hidden="true" focusable="false"><use href="#i-chevron-'
      + (dir === 'prev' ? 'left' : 'right') + '"/></svg>';
    b.addEventListener('click', () => go(at + (dir === 'prev' ? -1 : 1)));
    return b;
  };
  const prev = arrow('prev');
  const next = arrow('next');
  frame.append(track, prev, next);

  /* The markers (D17): where you are, a jump to each card, one tab stop with the arrow keys. */
  const markers = el('div', 'opening-carousel__markers');
  markers.setAttribute('role', 'group');
  markers.setAttribute('aria-label', STRATEGY.carousel);
  const marks = STRATEGIES.map((s, i) => {
    const m = el('button', 'opening-carousel__marker');
    m.type = 'button';
    m.setAttribute('aria-label', nameOf(s));
    if (s.id === rec) m.dataset.recommended = '';
    if (above(s)) m.dataset.above = '';
    m.append(el('span', 'opening-carousel__marker-bar'), el('span', 'opening-carousel__marker-label', s.name));
    m.addEventListener('click', () => go(i));
    markers.append(m);
    return m;
  });

  /* The credits take the cards' place, so the step keeps its height (D9). */
  const credits = el('div', 'opening-vehicles__credits opening-carousel__credits');
  credits.id = 'opening-vehicle-credits';
  credits.hidden = true;
  const back = el('button', 'opening-vehicles__link opening-vehicles__toggle', VEHICLE_STAGE.backLink);
  back.type = 'button';
  back.addEventListener('click', () => showCredits(false));
  credits.append(vehicleCredits(), back);
  /* The focus follows: to "Back to the vehicles", then to the card's "Model credits" again. */
  function showCredits(open) {
    credits.hidden = !open;
    frame.hidden = open;
    cards.forEach(({ credit }) => credit.setAttribute('aria-expanded', String(open)));
    if (open) back.focus();
    else {
      centre(false);
      placeVehicles();
      if (credits.contains(document.activeElement) || document.activeElement === document.body) cards[at].credit.focus();
    }
  }
  root.append(frame, credits, markers);

  /* The current card: in the Tab order and the tree, its marker current, the arrows stop at the ends. */
  function mark(i) {
    cards.forEach(({ card, action, credit }, j) => {
      card.classList.toggle('is-current', j === i);
      card.toggleAttribute('aria-hidden', j !== i);
      credit.tabIndex = j === i ? 0 : -1;
      if (action.tagName === 'BUTTON') action.tabIndex = j === i ? 0 : -1;
    });
    marks.forEach((m, j) => {
      m.tabIndex = j === i ? 0 : -1;
      if (j === i) m.setAttribute('aria-current', 'true');
      else m.removeAttribute('aria-current');
    });
    prev.setAttribute('aria-disabled', String(i === 0));
    next.setAttribute('aria-disabled', String(i === total - 1));
  }

  function centre(smooth) {
    const c = cards[at].card;
    const left = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
    track.scrollTo({ left, behavior: smooth && !reducedMotion() ? 'smooth' : 'instant' });
  }

  /* A new card: the stage moves into it and its name is announced (D17). */
  function settle(i) {
    if (i === at) return;
    at = i;
    mark(at);
    placeVehicles();
    announce(nameOf(STRATEGIES[at]));
  }

  function go(i, focus) {
    const to = Math.max(0, Math.min(total - 1, i));
    if (!credits.hidden) showCredits(false);
    settle(to);
    centre(true);
    if (focus === 'card') (cards[at].action.tagName === 'BUTTON' ? cards[at].action : cards[at].card).focus({ preventScroll: true });
    if (focus === 'marker') marks[at].focus();
  }

  /* Swipes and the trackpad: the card nearest the middle once the scrolling stops. */
  const nearest = () => {
    const middle = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    cards.forEach(({ card }, j) => {
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
      if (d < Math.abs(cards[best].card.offsetLeft + cards[best].card.offsetWidth / 2 - middle)) best = j;
    });
    return best;
  };
  let settling = 0;
  track.addEventListener('scroll', () => {
    window.clearTimeout(settling);
    settling = window.setTimeout(() => settle(nearest()), 120);
  }, { passive: true });

  /* The arrow keys move a card from anywhere in the carousel; on the markers also Home and End. */
  root.addEventListener('keydown', (event) => {
    const onMarker = marks.includes(event.target);
    let to = null;
    if (event.key === 'ArrowRight') to = at + 1;
    else if (event.key === 'ArrowLeft') to = at - 1;
    else if (onMarker && event.key === 'Home') to = 0;
    else if (onMarker && event.key === 'End') to = total - 1;
    if (to === null || event.target.closest('.opening-carousel__credits')) return;
    event.preventDefault();
    go(to, onMarker ? 'marker' : track.contains(event.target) ? 'card' : null);
  });

  /* Keep the current card in the middle when the sheet changes size. */
  new ResizeObserver(() => { if (frame.hidden) return; centre(false); placeVehicles(); }).observe(track);

  mark(at);
  return {
    root,
    id: () => STRATEGIES[at].id,
    figure: () => cards[at].figure,
    stills(shots) {
      cards.forEach(({ still }, j) => {
        const src = shots[STRATEGIES[j].id];
        if (src && still.getAttribute('src') !== src) still.src = src;
        still.hidden = !src;
      });
    },
    /* Placed once the screen is in the page: the starting card in the middle at once. */
    mounted() { centre(false); placeVehicles(); },
    /* Next with nothing chosen (phone polish D5): the message under the cards, the focus on the current card's
       button; from a card above the profile the carousel first moves to the recommended one. */
    need(move) {
      if (move && cards[at].action.tagName !== 'BUTTON') go(Math.max(0, rankOf(rec)));
      return { after: frame, target: cards[at].action.tagName === 'BUTTON' ? cards[at].action : null };
    },
    refresh() {
      cards.forEach(({ card, action }, j) => {
        const chosen = STRATEGIES[j].id === answers.strategy;
        card.classList.toggle('is-chosen', chosen);
        if (action.tagName !== 'BUTTON') return;
        action.textContent = chosen ? STRATEGY.chosen : STRATEGY.choose;
        action.setAttribute('aria-pressed', String(chosen));
      });
    },
  };
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
    const { group, refresh, stop } = optionGroup({
      options: KNOWLEDGE.options,
      get: () => answers.knowledge,
      set: (id) => { answers.knowledge = id; delete answers.knowledgeFrom; changed(); },
    });
    group.setAttribute('aria-labelledby', 'opening-heading');
    return {
      nodes: [group, note],
      missing: () => (answers.knowledge ? '' : KNOWLEDGE.missing),
      need: () => ({ after: group, target: stop() }),
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
      need: () => {
        const g = !answers.purpose ? purpose : horizon;
        return { after: g.group, target: g.stop() };
      },
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
      need: () => ({ after: box, target: input }),
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
      /* The first unanswered question opens, the message under it. */
      need(move) {
        if (move) open = firstOpen();
        const part = parts.find((p) => p.q.id === open) || parts.find((p) => !answers[p.q.id]);
        return part ? { after: part.g.group, target: part.g.stop() } : null;
      },
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
    const nodes = [];
    if (answers.strategyFellBack && rec) {
      nodes.push(el('p', 'opening__note opening__note--check', fill(STRATEGY.fellBack, { name: STRATEGIES[rankOf(rec)].name })));
      delete answers.strategyFellBack; /* said once */
    }
    /* One card at a time, chosen explicitly (D16 to D18): nothing is chosen on arrival. */
    const carousel = strategyCarousel(rec);
    vehicles.host = carousel;
    nodes.push(carousel.root);
    const chosen = () => STRATEGIES[rankOf(answers.strategy)];
    return {
      nodes,
      missing: () => (answers.strategy ? '' : STRATEGY.missing),
      need: carousel.need,
      next: () => (answers.strategy ? fill(STRATEGY.continueWith, { name: chosen().name }) : null),
      refresh: carousel.refresh,
      mounted: carousel.mounted,
    };
  },

  esg() {
    const lab = label(ESG.label);
    const { group, refresh, stop } = optionGroup({
      labelEl: lab,
      options: ESG.options,
      get: () => answers.esg,
      set: (id) => { answers.esg = id; changed(); },
    });
    return {
      nodes: [lab, group],
      missing: () => (answers.esg ? '' : ESG.missing),
      need: () => ({ after: group, target: stop() }),
      refresh,
    };
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
      need: () => {
        const g = groups[TAX.questions.findIndex((q) => !answers[q.id])];
        return g ? { after: g.group, target: g.stop() } : null;
      },
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
    return {
      nodes: [main, sheets],
      missing: () => (answers.documents ? '' : DOCUMENTS.missing),
      need(move) {
        if (move && main.hidden) { main.hidden = false; sheets.hidden = true; }
        return { after: check, target: box };
      },
    };
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
        /* A small carousel card (9d D20): the persona with the chosen vehicle on the left, decorative, since the name
           says it; the live stage moves here and only idles. */
        const card = el('div', 'opening-summary__strategy' + (vehicles.failed ? ' is-flat' : ''));
        const figure = el('div', 'opening-summary__figure');
        figure.setAttribute('aria-hidden', 'true');
        const text = el('div', 'opening-summary__strategy-text');
        const name = el('p', 'opening-summary__name');
        name.append(el('span', 'opening-option__label', s.name));
        if (s.id === rec) name.append(el('span', 'opening-option__tag', STRATEGY.recommended));
        const meters = el('div', 'opening-option__meters');
        meters.append(meter(STRATEGY.riskLabel, s.risk, 'bar'), meter(STRATEGY.returnLabel, s.ret, 'dots'));
        text.append(name, el('p', 'opening__note', s.line), meters);
        card.append(figure, text);
        box.append(card);
        vehicles.host = { root: card, id: () => s.id, figure: () => figure };
      }
      if (section.id === 'answers') box.append(answerList(rec));
      nodes.push(box);
    });
    return { nodes, mounted: placeVehicles };
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
  /* The vehicles load one screen ahead and draw on the strategy screen and the summary only (9d D3, D11, D20). */
  if (['risk', 'strategy', 'summary'].includes(screen.id)) loadVehicles();
  vehiclesOn(screen.id === 'strategy' || screen.id === 'summary');
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
  /* The assistant starts over with every screen (9b D26, D29). */
  assistant.setScreen(screen.id);
  content.append(heading, text, body);

  const actions = el('div', 'opening__actions');
  const buttons = [];
  let named = null; /* Next, when the screen names it after the answer (the strategy's "Continue with", 9d D18) */
  if (built.actions) buttons.push(...built.actions);
  else {
    const editing = edit && edit.screens.includes(screen.id);
    const next = button(editing ? SUMMARY.backToSummary : screen.next || 'Next', 'primary', () => { if (!showNeed()) forward(); });
    if (built.next && !editing) named = next;
    buttons.push(next);
    /* While editing, the section's next screen is one step away; the last one only returns. */
    const after = editing ? edit.screens[edit.screens.indexOf(screen.id) + 1] : null;
    if (after) {
      const more = button(SUMMARY.nextInSection, 'secondary', () => { if (!showNeed()) go(indexOf(after)); });
      buttons.push(more);
    }
    if (screen.id === 'intro') buttons.push(button('Start over', 'secondary', startOver));
  }
  /* On a phone, Help? sits left of the main button in one row (9b D28); the layout hides it on desktop. */
  const row = el('div', 'opening__action-row');
  if (buttons.length) row.append(assistant.helpButton(), buttons.shift());
  else row.append(assistant.helpButton());
  actions.append(row, ...buttons);

  /* Next is never disabled (phone polish D4, D5): a tap with something missing puts the screen's message under the
     first missing question, tied to it, and moves the focus there. The message follows the answers until none is
     missing. */
  const need = el('p', 'opening__note opening__note--check opening__need');
  need.id = 'opening-need';
  let needOn = false;
  let needTarget = null;
  const describe = (node, on) => {
    if (!node) return;
    const ids = (node.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== need.id);
    if (on) ids.push(need.id);
    if (ids.length) node.setAttribute('aria-describedby', ids.join(' '));
    else node.removeAttribute('aria-describedby');
  };
  function placeNeed(missing) {
    describe(needTarget, false);
    needTarget = null;
    if (!missing) needOn = false;
    if (!needOn) { need.remove(); return; }
    need.textContent = missing;
    const spot = built.need ? built.need(false) : null;
    if (spot && spot.after) spot.after.after(need);
    else actions.prepend(need);
    needTarget = spot ? spot.target : null;
    describe(needTarget, true);
  }
  function showNeed() {
    if (!built.missing || !built.missing()) return false;
    needOn = true;
    if (built.need) built.need(true);
    current.update();
    if (needTarget) needTarget.focus({ preventScroll: true });
    return true;
  }
  current = {
    update() {
      if (built.refresh) built.refresh();
      if (named) named.textContent = built.next() || screen.next || 'Next';
      placeNeed(built.missing ? built.missing() : '');
    },
  };
  current.update();

  panel.append(content, actions);
  if (built.mounted) built.mounted();
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
  if (event.key !== 'Escape') return;
  /* The phone's open assistant takes the first Escape (9b D29). */
  if (assistant.isOpen()) {
    event.preventDefault();
    assistant.close();
    return;
  }
  if (!framed) return;
  event.preventDefault();
  send({ type: 'uzbank:fridge-escape' });
});

/* A draft is checked against the rules once more, so a stored strategy is never above the profile (D12). */
reconcile();
/* Framed, the page replaced the fridge in the sheet: the heading takes focus so a screen reader starts here. */
render(framed, false);
send({ type: 'uzbank:fridge-ready' });
