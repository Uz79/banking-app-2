/**
 * Investment opening: noticing hesitation (roadmap 9f D1 to D5).
 * The page reports the step on show and what the customer does on it; this module decides, once per step, when the
 * assistant should offer the step's question. Time counts only while the step is on screen, the tab is visible and
 * the assistant is not already open on it (D2). The other signals count as the intervention map lists them per step
 * (`NUDGES.screens[id].signals`). The User Type sets how long to wait and on which steps (D5). Nothing leaves the
 * browser and nothing is stored here: the page keeps which steps have nudged in its draft (D11).
 *
 * `createHesitation({ level, helping, skip, onNudge })`:
 *   level()    'novice', 'standard' or 'power' (the assistant's reading of the User Type)
 *   helping()  true while the assistant is open on the step
 *   skip(id)   true when the step must not nudge (it already did in this opening, or its question was asked)
 *   onNudge(id) called at most once per visit to a step
 * Returns `{ step(id, back), signal(kind) }`.
 */
import { NUDGES } from './opening-assistant-config.js';

const TICK = 250;

/* `?nudge=fast` on the page or, framed, on the page that holds the sheet (D4). */
function fast() {
  const has = (w) => new URLSearchParams(w.location.search).get('nudge') === 'fast';
  try {
    if (window.self !== window.top && has(window.parent)) return true;
  } catch (e) { /* the parent is not reachable */ }
  return has(window);
}

export function createHesitation({ level, helping, skip, onNudge }) {
  const speed = fast() ? NUDGES.fastFactor : 1;
  const backs = new Map(); /* returns to a step, for the whole visit to the opening (D1) */
  let id = null;
  let screen = null;
  let rule = null;
  let counts = {};
  let lastSwitch = -Infinity;
  let elapsed = 0;
  let last = 0;
  let timer = 0;
  let fired = false;

  function stop() {
    window.clearInterval(timer);
    timer = 0;
  }

  function live() {
    return !!(screen && rule && !fired && (rule.steps === 'all' || screen.high) && !skip(id));
  }

  function fire() {
    if (!live()) return;
    fired = true;
    stop();
    onNudge(id);
  }

  function tick() {
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (document.hidden || helping()) return;
    elapsed += dt;
    if (elapsed >= (screen.read * rule.factor * 1000) / speed) fire();
  }

  /* A new step on show; `back` when the customer came back to it (Back, or a summary edit returning). */
  function step(next, back) {
    stop();
    id = next;
    screen = NUDGES.screens[id] || null;
    rule = NUDGES.levels[level()] || null;
    counts = {};
    lastSwitch = -Infinity;
    elapsed = 0;
    fired = false;
    if (!live()) return;
    last = performance.now();
    timer = window.setInterval(tick, TICK);
    if (back) {
      backs.set(id, (backs.get(id) || 0) + 1);
      if (screen.signals.includes('back') && backs.get(id) >= NUDGES.counts.back) fire();
    }
  }

  /* Something the customer did on the step (D1). */
  function signal(kind) {
    if (!screen || !screen.signals.includes(kind) || kind === 'back') return;
    if (kind === 'switch') {
      const now = performance.now();
      const merged = now - lastSwitch < NUDGES.switchGap;
      lastSwitch = now;
      if (merged) return;
    }
    counts[kind] = (counts[kind] || 0) + 1;
    if (counts[kind] >= NUDGES.counts[kind]) fire();
  }

  return { step, signal };
}
