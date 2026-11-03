/**
 * Investment opening: the UZ Bank assistant (roadmap 9b).
 * Desktop (the sheet is 960 from 1024px): a column next to the step that never closes. Every step starts with the
 * invitation, the helper large with "Yes, help me"; a yes shows that step's questions and answers, and "I can do it
 * myself" goes back to the invitation (D24 to D27). Phone: "Help?" next to the step's main button opens the
 * conversation full screen; "I can do it myself" closes it (D28, D29). Help starts over on every step. Nothing is
 * stored (D5).
 */

import { ASSISTANT, CHIPS, NUDGES, HANDOFF } from './opening-assistant-config.js';

const framed = window.self !== window.top;

const root = document.documentElement;
const main = document.querySelector('.view--opening .view__main');
const aside = document.querySelector('[data-assistant]');
const title = aside.querySelector('.assistant__title');
const nameLine = aside.querySelector('.assistant__name');
const body = aside.querySelector('[data-assistant-body]');
const foot = aside.querySelector('[data-assistant-foot]');
const selfBtn = aside.querySelector('[data-assistant-self]');
const bar = aside.querySelector('[data-assistant-bar]');
const heading = aside.querySelector('.assistant__heading');

/* Desktop is a 1024px viewport: framed, the parent's (where the sheet is 960); on its own, the page's. */
const WIDE = '(min-width: 1024px)';
function wideLayout() {
  try {
    if (framed) return window.parent.matchMedia(WIDE).matches;
  } catch (e) { /* the parent is not reachable: use the page */ }
  return window.matchMedia(WIDE).matches;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || new URLSearchParams(window.location.search).has('reduced');

let wide = false;
let open = false; /* the phone's full-screen conversation */
let inviting = true; /* desktop: the invitation, until "Yes, help me" (D25) */
let screenId = null;
let nudging = null; /* desktop: the invitation shows the step's question (9f D7): { chip, advisor } */

/* ── The two layouts ────────────────────────────────────────────────── */

/* The full-screen conversation is modal: everything else in the page is inert while it is up. */
function setInert(on) {
  [...main.children].forEach((el) => { if (el !== aside) el.inert = on; });
}

/* The sheet hides its own header while the layer is open, so only the layer's X closes anything (phone polish D2). */
function tellSheet(on) {
  if (framed) window.parent.postMessage({ type: 'uzbank:sheet-chat', open: on }, window.location.origin);
}

function applyLayout() {
  wide = wideLayout();
  nudging = null;
  removeBubble(false);
  root.classList.toggle('assistant--wide', wide);
  root.classList.toggle('assistant--full', !wide);
  /* The title heads the column on desktop and the layer's bar on a phone (phone polish D2). */
  if (wide) heading.prepend(title);
  else bar.prepend(title);
  bar.hidden = wide;
  if (wide) {
    if (open) { open = false; setInert(false); tellSheet(false); }
    aside.hidden = false;
    aside.removeAttribute('role');
    aside.removeAttribute('aria-modal');
    inviting = true;
    renderPanel();
    startHelper();
  } else {
    aside.hidden = !open;
    aside.setAttribute('role', 'dialog');
    aside.setAttribute('aria-modal', 'true');
    inviting = false;
    renderPanel();
    startHead();
  }
}

/* Phone: "Help?" opens the step's conversation full screen (D29). */
function showFull() {
  if (wide || open) return;
  removeBubble(false);
  open = true;
  aside.hidden = false;
  setInert(true);
  tellSheet(true);
  renderPanel();
  title.focus({ preventScroll: true });
  startHelper();
  if (helper) helper.wake();
}

function hideFull(returnFocus = true) {
  if (!open) return;
  open = false;
  aside.hidden = true;
  setInert(false);
  tellSheet(false);
  if (returnFocus && helpBtn.isConnected) helpBtn.focus({ preventScroll: true });
}

/* The layer's own X closes only the layer (phone polish D2). */
aside.querySelector('[data-assistant-close]').addEventListener('click', () => hideFull());

/* "I can do it myself": back to the invitation on desktop, closed on the phone (D27, D29). */
selfBtn.addEventListener('click', () => {
  if (!wide) { hideFull(); return; }
  inviting = true;
  renderPanel();
  aside.querySelector('.assistant__yes').focus({ preventScroll: true });
});

/* The phone's conversation keeps the keyboard inside it (D13). */
aside.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || wide) return;
  const items = [...aside.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.closest('[hidden]'));
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === title)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* A window resized across 1024px switches the layout. */
let layoutTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(layoutTimer);
  layoutTimer = window.setTimeout(() => { if (wideLayout() !== wide) applyLayout(); }, 150);
});

/* ── The helper (D11, D19) ──────────────────────────────────────────── */
const figureBox = aside.querySelector('[data-assistant-figure]');
let helper = null;
let helperStarted = false;

/* three.js and the model load when the panel is first on screen: at once on desktop, on the first "Help?" on a
   phone. If loading fails, the panel works without the figure. */
function startHelper() {
  if (helperStarted) return;
  helperStarted = true;
  import('./opening-assistant-helper.js')
    .then(({ mountHelper }) => mountHelper(figureBox, {
      reduced,
      active: () => !aside.hidden && !document.hidden,
      /* The invitation shows the whole figure; the conversation head to waist, and head to chest once it has made
         room for the answers, so the arm of the gesture stays in view. */
      frame: (h) => (h > 200 ? [-0.05, 2.3] : h < 90 ? [0.8, 2.3] : [0.5, 2.3]),
    }))
    .then((h) => {
      helper = h;
      figureBox.classList.add('assistant__figure--ready');
      helper.wake();
    })
    .catch((err) => {
      console.warn('[opening-assistant] the helper did not load', err);
      figureBox.hidden = true;
      aside.classList.add('assistant--no-figure');
    });
}
document.addEventListener('visibilitychange', () => { if (helper && !document.hidden) helper.wake(); });

/* ── "Help?" on the phone (D28) ─────────────────────────────────────── */

/* One button for the whole visit, moved into each step's bottom bar, so the head is drawn once. */
const helpBtn = document.createElement('button');
helpBtn.type = 'button';
helpBtn.className = 'uz-btn uz-btn--tonal uz-btn--md opening-help';
helpBtn.setAttribute('aria-label', ASSISTANT.helpLabel);
helpBtn.setAttribute('aria-haspopup', 'dialog');
helpBtn.setAttribute('aria-controls', aside.id);
const helpHead = document.createElement('span');
helpHead.className = 'opening-help__head';
helpHead.setAttribute('aria-hidden', 'true');
const helpText = document.createElement('span');
helpText.textContent = ASSISTANT.help;
helpBtn.append(helpHead, helpText);
helpBtn.addEventListener('click', showFull);

let headStarted = false;
function startHead() {
  if (headStarted) return;
  headStarted = true;
  import('./opening-assistant-helper.js')
    .then(({ mountHelper }) => mountHelper(helpHead, { still: true, frame: () => [1.0, 2.25] }))
    .then(() => helpHead.classList.add('opening-help__head--ready'))
    .catch(() => { helpHead.hidden = true; });
}

/* ── The conversation (D6 to D10) ───────────────────────────────────── */

/* Per screen, in memory only (D5): the lines so far and the questions asked. */
const talks = new Map();
let values = () => ({});
let log = null;
let chipsRow = null;

function talk() {
  if (!talks.has(screenId)) talks.set(screenId, { lines: [], asked: new Set() });
  return talks.get(screenId);
}

/* Answer length by User Type (D9): Newbie everything, All-rounder short with More, Power user short. Nothing chosen
   yet in Profile counts as All-rounder. */
function level() {
  const persona = window.UZBankPersona;
  if (!persona) return 'standard';
  try {
    if (window.localStorage.getItem(persona.key) == null) return 'standard';
  } catch (e) { return 'standard'; }
  return persona.read().profile;
}

const fill = (text) => {
  const v = values();
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
};

/* ── The handoff to a person (9f D12 to D16) ─────────────────────────────
   "Talk to an advisor" leads through a callback or a video meeting, three times and a confirmation. While it runs,
   its choices take the chips row. The page keeps the booking in its draft (`setBooking`). */
let booking = { get: () => null, set: () => {} };

const pad = (n) => String(n).padStart(2, '0');
const clock = (d) => d.getHours() + ':' + pad(d.getMinutes());
const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const working = (d) => d.getDay() !== 0 && d.getDay() !== 6;

/* "today", "tomorrow" or "on Thursday" (or "Today", "Tomorrow", "Thursday" for a chip). */
function dayName(d, now, chip) {
  const days = Math.round((dayStart(d) - dayStart(now)) / 86400000);
  if (days === 0) return chip ? HANDOFF.today : HANDOFF.today.toLowerCase();
  if (days === 1) return chip ? HANDOFF.tomorrow : HANDOFF.tomorrow.toLowerCase();
  return (chip ? '' : 'on ') + HANDOFF.days[d.getDay()];
}

/* The booking's day and time as words: { when: 'today', time: '15:00 to 16:00' }. */
export function describeBooking(b, now = new Date()) {
  const start = new Date(b.slot);
  const end = new Date(start.getTime() + HANDOFF[b.kind].minutes * 60000);
  return { when: dayName(start, now, false), time: clock(start) + ' to ' + clock(end) };
}

/* Three times on working days within office hours (D13): the first from the full hour after next, then the next two
   working days at `laterAt`. */
export function slotsFor(kind, now = new Date()) {
  const minutes = HANDOFF[kind].minutes;
  const fits = (d) => working(d) && d.getHours() >= HANDOFF.opens
    && d.getHours() * 60 + d.getMinutes() + minutes <= HANDOFF.closes * 60;
  const nextDay = (d, hour) => {
    const n = dayStart(d);
    do n.setDate(n.getDate() + 1); while (!working(n));
    n.setHours(hour);
    return n;
  };
  let start = new Date(now);
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 2);
  for (;;) {
    if (working(start) && start.getHours() < HANDOFF.opens) start.setHours(HANDOFF.opens);
    if (fits(start)) break;
    start = nextDay(start, HANDOFF.opens);
  }
  const second = nextDay(start, HANDOFF.laterAt[0]);
  const third = nextDay(second, HANDOFF.laterAt[1]);
  return [start, second, third];
}

function bookingLine(b, call, meeting) {
  return (b.kind === 'call' ? call : meeting).replace(/\{(\w+)\}/g, (m, k) => describeBooking(b)[k] || m);
}

/* The handoff's chips for the step it is at; each answers with its own line and moves the handoff on. */
function handoffChips(t) {
  const reply = (q, text, next, act) => ({ q, handoff: 'step', reply: () => { if (act) act(); t.handoff = next; return text; } });
  if (t.handoff === 'choose') {
    return ['call', 'meeting'].map((kind) => reply(HANDOFF[kind].q, HANDOFF[kind].ask, kind, () => { t.slots = slotsFor(kind); }));
  }
  if (t.handoff === 'call' || t.handoff === 'meeting') {
    const kind = t.handoff;
    const now = new Date();
    return t.slots.map((d) => {
      const end = new Date(d.getTime() + HANDOFF[kind].minutes * 60000);
      const b = { kind, slot: d.toISOString() };
      return {
        q: dayName(d, now, true) + ', ' + clock(d) + ' to ' + clock(end),
        handoff: 'step',
        reply: () => {
          booking.set(b);
          t.handoff = null;
          return bookingLine(b, HANDOFF.bookedCall, HANDOFF.bookedMeeting) + ' ' + HANDOFF.kept;
        },
      };
    });
  }
  if (t.handoff === 'booked') {
    return [
      reply(HANDOFF.other, HANDOFF.start, 'choose'),
      reply(HANDOFF.cancel, HANDOFF.cancelled, null, () => booking.set(null)),
    ];
  }
  return [];
}

/* The chips still to ask: the screen's own, then the follow-ups of what was asked, minus what was asked. */
function openChips() {
  const set = CHIPS[screenId] || { chips: [] };
  const t = talk();
  if (t.handoff) return { list: handoffChips(t), advisor: null, advisorAsChip: false };
  const all = [...set.chips];
  set.chips.forEach((c) => { if (t.asked.has(c.q) && c.then) all.push(...c.then); });
  const list = all.filter((c) => !t.asked.has(c.q));
  const advisor = !t.asked.has(ASSISTANT.advisor.q) ? ASSISTANT.advisor : null;
  return { list, advisor, advisorAsChip: !!set.advisor };
}

function lineNode(line, animate) {
  const item = document.createElement('div');
  item.className = 'assistant-line assistant-line--' + (line.from === 'you' ? 'customer' : 'bank')
    + (animate ? ' assistant-line--new' : '');
  const p = document.createElement('p');
  p.className = 'assistant-line__text';
  p.textContent = line.text;
  item.append(p);
  if (line.from === 'bank' && line.more) {
    const lvl = level();
    if (lvl === 'novice' || line.expanded) item.append(moreText(line.more));
    else if (lvl === 'standard') {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'uz-btn uz-btn--tonal uz-btn--sm assistant-line__more';
      b.textContent = ASSISTANT.more;
      b.addEventListener('click', () => {
        line.expanded = true;
        const extra = moreText(line.more);
        extra.tabIndex = -1;
        b.replaceWith(extra);
        extra.focus({ preventScroll: true });
        extra.scrollIntoView({ block: 'nearest' });
      });
      item.append(b);
    }
  }
  return item;
}

function moreText(text) {
  const p = document.createElement('p');
  p.className = 'assistant-line__text assistant-line__extra';
  p.textContent = text;
  return p;
}

function chipButton(chip, className) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.textContent = chip.q;
  b.addEventListener('click', () => ask(chip));
  return b;
}

/* The chips row and the quiet advisor button; `focusAt` keeps the keyboard in place after a chip is used. */
function renderChips(focusAt) {
  const { list, advisor, advisorAsChip } = openChips();
  const buttons = list.map((c) => chipButton(c, 'uz-btn uz-btn--secondary uz-btn--sm assistant__chip'));
  if (advisor && advisorAsChip) buttons.push(chipButton(advisor, 'uz-btn uz-btn--secondary uz-btn--sm assistant__chip'));
  chipsRow.replaceChildren(...buttons);
  chipsRow.hidden = !buttons.length;
  const quiet = aside.querySelector('.assistant__advisor');
  if (quiet) quiet.remove();
  let quietBtn = null;
  if (advisor && !advisorAsChip) {
    quietBtn = chipButton(advisor, 'assistant__advisor');
    chipsRow.after(quietBtn);
  }
  if (focusAt === undefined) return;
  const target = buttons[Math.min(focusAt, buttons.length - 1)] || quietBtn || title;
  target.focus({ preventScroll: true });
}

function ask(chip) {
  const t = talk();
  const focusAt = [...chipsRow.children].findIndex((b) => b.textContent === chip.q);
  if (chip.handoff !== 'step') t.asked.add(chip.q);
  const q = { from: 'you', text: chip.q };
  let a;
  if (chip.handoff === 'step') {
    a = { from: 'bank', text: chip.reply(), more: '' };
    /* Once booked or cancelled, "Talk to an advisor" is offered again, so the booking can be changed (D15). */
    if (!t.handoff) t.asked.delete(ASSISTANT.advisor.q);
  }
  else if (chip.handoff) {
    /* "Talk to an advisor": what is booked, or the two ways to a person (D12, D15). */
    const b = booking.get();
    t.handoff = b ? 'booked' : 'choose';
    a = { from: 'bank', text: b ? bookingLine(b, HANDOFF.hasCall, HANDOFF.hasMeeting) : HANDOFF.start, more: '' };
  } else a = { from: 'bank', text: fill(chip.short), more: chip.more ? fill(chip.more) : '' };
  t.lines.push(q, a);
  aside.querySelector('.assistant__prompt').hidden = true;
  /* Open question 1: the figure makes room for the answers once the conversation starts. */
  aside.classList.add('assistant--talking');
  const answer = lineNode(a, !reduced());
  log.append(lineNode(q, !reduced()), answer);
  renderChips(focusAt < 0 ? 0 : focusAt);
  if (helper) helper.wave();
  answer.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
}

/* The invitation (D25): the helper large, the question and "Yes, help me". */
function renderInvite() {
  const yes = document.createElement('button');
  yes.type = 'button';
  yes.className = 'uz-btn uz-btn--primary uz-btn--md assistant__yes';
  if (!nudging) {
    yes.textContent = ASSISTANT.yes;
    yes.addEventListener('click', () => {
      inviting = false;
      renderPanel();
      title.focus({ preventScroll: true });
    });
    body.replaceChildren(yes);
    return;
  }
  /* The nudge (9f D7, D10): "Show me" asks the step's question, "No, thanks" brings the plain invitation back. */
  const { chip, advisor } = nudging;
  yes.textContent = NUDGES.show;
  yes.addEventListener('click', () => answerNudge(chip));
  const no = quietButton(NUDGES.dismiss, () => {
    nudging = null;
    renderPanel();
    aside.querySelector('.assistant__yes').focus({ preventScroll: true });
  });
  body.replaceChildren(yes, no);
  if (advisor) no.before(quietButton(NUDGES.advisor, () => answerNudge(ASSISTANT.advisor)));
}

function quietButton(text, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'assistant__advisor assistant__quiet';
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}

/* "Show me" (or the advisor beside it): the conversation opens with that question asked (9f D7, D8). */
function answerNudge(chip) {
  nudging = null;
  removeBubble(false);
  if (wide) {
    inviting = false;
    renderPanel();
  } else showFull();
  ask(chip);
  title.focus({ preventScroll: true });
}

/* ── The phone's bubble above Help? (9f D8) ─────────────────────────── */
let bubble = null;

function removeBubble(returnFocus) {
  if (!bubble) return;
  const had = bubble.contains(document.activeElement);
  bubble.remove();
  bubble = null;
  if (returnFocus && had && helpBtn.isConnected) helpBtn.focus({ preventScroll: true });
}

function showBubble(chip, advisor) {
  removeBubble(false);
  bubble = document.createElement('div');
  bubble.className = 'opening-nudge';
  bubble.setAttribute('role', 'group');
  bubble.setAttribute('aria-label', ASSISTANT.name);
  const text = document.createElement('div');
  text.className = 'opening-nudge__text';
  const q = document.createElement('button');
  q.type = 'button';
  q.className = 'opening-nudge__ask';
  q.textContent = chip.q;
  q.addEventListener('click', () => answerNudge(chip));
  text.append(q);
  if (advisor) {
    const a = document.createElement('button');
    a.type = 'button';
    a.className = 'opening-nudge__advisor';
    a.textContent = NUDGES.orAdvisor;
    a.addEventListener('click', () => answerNudge(ASSISTANT.advisor));
    text.append(a);
  }
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'opening-nudge__close';
  x.setAttribute('aria-label', NUDGES.dismiss);
  x.innerHTML = '<svg aria-hidden="true" focusable="false"><use href="#i-x"/></svg>';
  x.addEventListener('click', () => removeBubble(true));
  bubble.append(text, x);
  /* Before Help? in the reading and Tab order: the question, then the help it points at. */
  helpBtn.before(bubble);
}

/* The whole panel for the current screen and state: a new log each time, so switching is not read out as new lines. */
function renderPanel() {
  aside.classList.toggle('assistant--inviting', inviting);
  aside.classList.toggle('assistant--nudge', inviting && !!nudging);
  title.textContent = inviting ? (nudging ? nudging.chip.q : ASSISTANT.invite) : ASSISTANT.title;
  nameLine.hidden = inviting;
  foot.hidden = inviting;
  if (inviting) {
    aside.classList.remove('assistant--talking');
    renderInvite();
    return;
  }
  const t = talk();
  aside.classList.toggle('assistant--talking', t.lines.length > 0);
  const prompt = document.createElement('p');
  prompt.className = 'assistant__prompt';
  prompt.textContent = ASSISTANT.prompt;
  prompt.hidden = t.lines.length > 0;
  log = document.createElement('div');
  log.className = 'assistant__log';
  log.setAttribute('role', 'log');
  log.setAttribute('aria-label', ASSISTANT.name);
  log.append(...t.lines.map((line) => lineNode(line, false)));
  chipsRow = document.createElement('div');
  chipsRow.className = 'assistant__chips';
  chipsRow.setAttribute('role', 'group');
  chipsRow.setAttribute('aria-label', ASSISTANT.chipsLabel);
  body.replaceChildren(prompt, log, chipsRow);
  renderChips();
  body.scrollTop = body.scrollHeight;
}

/* ── What the page uses ─────────────────────────────────────────────── */

/* The phone's "Help?" for the step's bottom bar (hidden on desktop by the layout). */
export function helpButton() { return helpBtn; }

/* The page moved to another screen: help starts over with it (D26, D29). */
export function setScreen(id) {
  if (id === screenId) return;
  screenId = id;
  body.dataset.screen = screenId;
  nudging = null;
  removeBubble(false);
  hideFull(false);
  inviting = wide;
  renderPanel();
}

/* The customer's own numbers for answers that use them ({amount}). */
export function setValues(fn) { values = fn; }

/* Offer the step's question (9f D6 to D8): in the desktop invitation, or as the bubble above the phone's Help?. False
   when it cannot be shown now (another step, help already open, no such chip), so the step has not nudged. */
export function nudge(id, { advisor = false } = {}) {
  const set = CHIPS[id];
  const chip = set && set.chips.find((c) => c.q === NUDGES.screens[id].q);
  if (id !== screenId || !chip || isHelping()) return false;
  if (wide) {
    nudging = { chip, advisor };
    renderPanel();
  } else {
    if (!helpBtn.isConnected) return false;
    showBubble(chip, advisor);
  }
  if (helper) helper.wave();
  return true;
}

/* The page keeps the booking (9f D11, D15): `{ get(), set(booking or null) }`. */
export function setBooking(store) { booking = store; }

/* The exit screen's "Book an appointment" opens the handoff (9f D16). */
export function startHandoff() { answerNudge(ASSISTANT.advisor); }

/* The User Type as the answers read it (D9), for the nudges' thresholds (9f D5). */
export { level };

/* The customer is in help on this step: past "Yes, help me" on desktop, the layer open on a phone (9f D2). */
export function isHelping() { return wide ? !inviting : open; }

/* Whether a question was asked on a screen in this visit (9f D6). */
export function wasAsked(id, q) { return talks.has(id) && talks.get(id).asked.has(q); }

/* The phone's conversation is open (it takes the first Escape). */
export function isOpen() { return open; }
export function close(returnFocus) { hideFull(returnFocus); }

applyLayout();
