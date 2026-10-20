/**
 * Payday run: page script.
 *
 * The page is opened as a sheet on the Design system hub (js/playground-sheet.js puts it in an
 * iframe and slides it up like the flow screens). Embedded, the close button asks the hub to
 * slide it down again; opened directly, it is a plain link back to the hub.
 *
 * The runner is the persona character (createFigure from js/profile-persona-character.js),
 * its recipe from User Type (UZBankPersona) and its pace from the profile (js/playground-config.js).
 * It runs along a curve (js/playground-track.js) as (distance, sideways offset); a chase camera
 * follows. Plan group 3: track, camera and keyboard steering. The story comes in the next groups.
 */
import { THREE, createFigure, readTheme, cssColor } from './profile-persona-character.js';
import { CONFIG } from './playground-config.js';
import { createTrack } from './playground-track.js';
import { createTown } from './playground-world.js';
import { createCoins } from './playground-coins.js';
import { createGates } from './playground-gates.js';
import { createChest } from './playground-chest.js';
import { createForest } from './playground-forest.js';

const embedded = window.parent !== window;
const closeLinks = [...document.querySelectorAll('[data-playground-close]')]; /* the X button and the dialog's Close */

/* The close buttons ask first while a run is in progress. The game sets `requestClose` once it is built;
   until then, and on the start and result screens, they leave straight away. */
let requestClose = () => closeGame();

closeLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!embedded && !link.matches('.playground__close')) return; /* opened directly: the dialog's Close stays a plain link */
    event.preventDefault();
    if (link.matches('.playground__close')) requestClose();
    else closeGame();
  });
});

/* Leave the game: the hub slides the sheet down, or a direct visit goes back to the hub. */
function closeGame() {
  if (embedded) window.parent.postMessage({ type: 'uzbank:playground-close' }, window.location.origin);
  else if (closeLinks[0]) window.location.href = closeLinks[0].href;
}

const stage = document.querySelector('[data-playground-stage]');
const overlay = document.querySelector('[data-playground-overlay]');
const hud = document.querySelector('[data-playground-hud]');

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* The best run is the only thing the game keeps: { balance, date } in localStorage (D2, listed in README.md). */
const BEST_KEY = 'uzBankWebPlaygroundBest';
function readBest() {
  try {
    const v = JSON.parse(window.localStorage.getItem(BEST_KEY) || 'null');
    return v && typeof v.balance === 'number' && Number.isFinite(v.balance) ? v : null;
  } catch (err) {
    return null;
  }
}
function writeBest(balance) {
  try {
    window.localStorage.setItem(BEST_KEY, JSON.stringify({ balance: Math.round(balance * 100) / 100, date: new Date().toISOString().slice(0, 10) }));
  } catch (err) { /* private mode or blocked storage: the game still works */ }
}

async function mountGame(host) {
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  /* `?reduced` forces the still version, for testing where the system setting cannot be flipped. */
  const forceReduced = new URLSearchParams(window.location.search).has('reduced');
  const reduced = () => forceReduced || reduceMQ.matches;
  let dirty = true; /* something changed that a still frame has to show (paused and still scenes only redraw when it is set) */

  const persona = (window.UZBankPersona && window.UZBankPersona.read()) || null;
  const profile = CONFIG.profiles[persona && persona.profile] || CONFIG.profiles[CONFIG.fallbackProfile];
  const recipe = (persona && persona.recipe) || { outfit: 'barbarian', head: 'rogue', headwear: 'none', back: 'none' };
  if (hud) {
    hud.querySelector('[data-hud-name]').textContent = profile.name;
    hud.querySelector('[data-hud-pace]').textContent = profile.pace;
  }

  /* CHF in the app's Swiss format (formatMoney from js/payment-state.js). */
  const money = (n) => 'CHF ' + ((window.UZBankPayState && window.UZBankPayState.formatMoney) ? window.UZBankPayState.formatMoney(n) : n.toFixed(2));

  /* ── Scene ─────────────────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, CONFIG.fogNear, CONFIG.fogFar);
  const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, 1, 0.1, 400);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(-3, 3, -4);
  scene.add(hemi, key, key.target, rim);

  /* ── Track ─────────────────────────────────────────────────────────── */
  const track = createTrack(CONFIG.track);
  const edge = CONFIG.track.edge;
  const half = track.width / 2;
  const trackMat = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0 });
  const accentMat = new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0 });
  const road = new THREE.Mesh(track.ribbon(-half, half, 0), trackMat);
  road.receiveShadow = true;
  const edges = new THREE.Mesh(mergeGeometries([
    track.ribbon(-half - edge, -half, 0.01),
    track.ribbon(half, half + edge, 0.01),
    track.ribbon(-half, half, 0.012, 0, 1.2, 0.6),
    track.ribbon(-half, half, 0.012, track.length - 1.2, track.length, 0.6),
  ]), accentMat);
  scene.add(road, edges);
  const town = await createTown(track, CONFIG);
  scene.add(town.group);
  const coins = createCoins(track, CONFIG);
  scene.add(coins.group);
  const gates = createGates(track, CONFIG, (n) => money(n).replace(/\.00$/, ''));
  scene.add(gates.group);
  const chest = createChest(track, CONFIG);
  scene.add(chest.group);
  const forest = await createForest(track, CONFIG);
  scene.add(forest.group);

  /* ── Runner ────────────────────────────────────────────────────────── */
  const figure = await createFigure({ reduced });
  figure.setRecipe(recipe, false);
  scene.add(figure.actor);

  let themeKey = '';
  function applyTheme(force) {
    const theme = readTheme();
    if (!force && theme.key === themeKey) return;
    themeKey = theme.key;
    dirty = true;
    hemi.color.set(theme.sky);
    hemi.groundColor.set(theme.dark ? '#1E2026' : '#DCDEE3');
    hemi.intensity = theme.light.fill;
    key.intensity = theme.light.key;
    rim.intensity = theme.light.rim;
    const colour = (name) => new THREE.Color().setRGB(...cssColor(name).map((v) => v / 255), THREE.SRGBColorSpace);
    const bg = colour('--color-bg');
    scene.fog.color.copy(bg);
    trackMat.color.copy(bg).lerp(colour('--color-fg'), 0.14);
    accentMat.color.copy(colour('--color-fg-interactive'));
    coins.recolour(colour('--color-fg-interactive'));
    gates.recolour(colour('--color-fg-interactive'), bg);
    chest.recolour(colour('--color-fg-interactive'), bg);
    const ground = bg.clone().lerp(colour('--color-fg'), 0.07);
    town.recolour(theme, ground);
    forest.recolour(theme, ground);
    figure.recolour(theme);
  }
  applyTheme(true);
  new MutationObserver(() => requestAnimationFrame(() => applyTheme(false)))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });

  /* ── Game state ────────────────────────────────────────────────────── */
  const input = { left: false, right: false };
  /* Money: the balance counts up as coins are collected and down at the gates. */
  const balanceEl = document.querySelector('[data-balance-value]');
  const toastEl = document.querySelector('[data-playground-toast]');
  const liveEl = document.querySelector('[data-playground-live]');
  let balance = 0;
  let saved = 0;
  let deposited = false; /* after the chest the HUD shows what is saved */
  let shown = 0;
  let collectedCount = 0;
  let gatesPaid = [];     /* for the result breakdown */
  let depositAmount = 0;
  let toastTimer = 0;
  const announce = (text) => { if (liveEl) liveEl.textContent = text; };
  function toast(text, kind = 'income') {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.toggle('playground-toast--expense', kind === 'expense');
    toastEl.hidden = false;
    toastEl.classList.remove('is-showing');
    void toastEl.offsetWidth; /* restart the fade */
    toastEl.classList.add('is-showing');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2600);
  }
  /* The finish: the breakdown, the final balance and the best run. */
  const signed = (n) => (n < 0 ? '-' : '+') + money(Math.abs(n));
  let result = null;
  function finishRun() {
    const final = saved;
    const best = readBest();
    const isBest = final > 0 && (!best || final > best.balance);
    if (isBest) writeBest(final);
    result = { final, isBest, previous: best };
    announce('Run finished. Final balance ' + money(final) + (isBest ? '. New best.' : '.'));
    setState('finished');
  }
  function renderResult(el) {
    if (!result) return;
    const rows = [['Salary collected', signed(collectedCount * coins.value)]];
    gatesPaid.forEach((g) => rows.push([g.label, signed(-g.amount)]));
    rows.push(['Deposited in savings', money(depositAmount)]);
    rows.push(['Growth in the forest', signed(saved - depositAmount)]);
    const list = el.querySelector('[data-result-rows]');
    list.textContent = '';
    rows.forEach(([label, value]) => {
      const li = document.createElement('li');
      const a = document.createElement('span');
      const b = document.createElement('span');
      a.textContent = label;
      b.textContent = value;
      li.append(a, b);
      list.appendChild(li);
    });
    el.querySelector('[data-result-total]').textContent = money(result.final);
    el.querySelector('[data-result-badge]').hidden = !result.isBest;
    const bestEl = el.querySelector('[data-result-best]');
    const kept = result.isBest ? result.previous : readBest();
    bestEl.textContent = result.isBest
      ? (kept ? 'Previous best: ' + money(kept.balance) : 'Your first best run.')
      : (kept ? 'Best so far: ' + money(kept.balance) : '');
    bestEl.hidden = !bestEl.textContent;
  }
  function showBalance(dt) {
    const target = deposited ? saved : balance;
    shown = reduced() ? target : shown + (target - shown) * Math.min(1, dt * 10);
    if (Math.abs(target - shown) < 0.005) shown = target;
    if (balanceEl) balanceEl.textContent = money(shown);
  }
  function setHudLabel() {
    const label = document.querySelector('.playground-balance__label');
    if (label) label.textContent = deposited ? 'Saved' : 'Balance';
  }
  function startRun() {
    balance = startMoney; saved = 0; deposited = false; shown = startMoney; collectedCount = 0; gatesPaid = []; depositAmount = 0;
    if (startAt > CONFIG.chest.at) { saved = startMoney; balance = 0; deposited = true; shown = saved; } /* dev: starting past the chest */
    setHudLabel();
    coins.reset();
    if (balanceEl) balanceEl.textContent = money(deposited ? saved : startMoney);
    toast('Salary: ' + money(CONFIG.money.salary));
    announce('Payday. Salary of ' + money(CONFIG.money.salary) + ' is on the road. Collect the coins.');
    track.at(s, here);
    if (!reduced()) coins.burst(figure.actor.position, here.t, here.r);
    setState('running');
  }
  /* Touch: two on-screen buttons on touch devices (D4). `?touch` shows them anywhere, for testing. */
  const touchMode = window.matchMedia('(hover: none) and (pointer: coarse)').matches || new URLSearchParams(window.location.search).has('touch');
  document.body.classList.toggle('playground--touch', touchMode);
  let state = 'ready'; /* ready | running | paused | finished */
  /* Dev only: `?from=230` starts the run that far along the track, to look at a later stretch. */
  const startAt = Math.max(0, Number(new URLSearchParams(window.location.search).get('from')) || 0);
  const startMoney = Number(new URLSearchParams(window.location.search).get('money')) || 0; /* dev only: `?money=3000` */
  let s = startAt; /* distance along the track */
  let x = 0;           /* sideways offset from the centre line */
  let vx = 0;
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const here = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
  const back = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
  const heading = new THREE.Vector3();

  const TEXT = {
    ready: {
      title: 'Payday run',
      get text() {
        if (reduced()) return 'Reduced motion is on, so the run is a few still scenes. Press Next to move on.';
        return touchMode ? 'Hold the left and right buttons to steer.' : 'Steer with the arrow keys or A and D. Escape pauses.';
      },
      primary: 'Start',
    },
    finished: { title: 'Your result', text: '', primary: 'Play again' },
  };

  function showOverlay(name) {
    if (!overlay) return;
    const t = TEXT[name];
    overlay.classList.remove('playground-overlay--step');
    overlay.querySelector('[data-overlay-skip]').hidden = true;
    overlay.hidden = !t;
    if (!t) return;
    overlay.querySelector('[data-overlay-title]').textContent = t.title;
    const text = overlay.querySelector('[data-overlay-text]');
    text.textContent = t.text;
    text.hidden = !t.text;
    const resultEl = overlay.querySelector('[data-overlay-result]');
    resultEl.hidden = name !== 'finished';
    overlay.querySelector('.playground-panel').classList.toggle('playground-panel--result', name === 'finished');
    if (name === 'finished') renderResult(resultEl);
    const primary = overlay.querySelector('[data-overlay-primary]');
    primary.textContent = t.primary;
    primary.focus({ preventScroll: true });
  }

  function setState(next) {
    state = next;
    dirty = true;
    if (next === 'running') figure.setLoop(CONFIG.runClip, { timeScale: profile.timeScale });
    else if (next !== 'paused') figure.setLoop(CONFIG.idleClip);
    showOverlay(next);
    if (next === 'running' && document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  function reset() {
    s = startAt; x = 0; vx = 0;
    balance = 0; saved = 0; deposited = false; shown = 0; collectedCount = 0; gatesPaid = []; depositAmount = 0;
    setHudLabel();
    coins.reset();
    if (balanceEl) balanceEl.textContent = money(0);
    pose(0, true);
    setState('ready');
  }

  /* Position of the camera's anchor `distance` behind distance s (extends the track backwards at the start). */
  function behind(sRaw, o) {
    if (sRaw >= 0) return track.at(sRaw, o);
    track.at(0, o);
    o.p.addScaledVector(o.t, sRaw);
    return o;
  }

  function pose(dt, snap) {
    const c = CONFIG.camera;
    track.at(s, here);
    const px = here.p.x + here.r.x * x, pz = here.p.z + here.r.z * x;
    figure.actor.position.set(px, 0, pz);
    const speed = profile.speed;
    heading.set(here.t.x * speed + here.r.x * vx, 0, here.t.z * speed + here.r.z * vx);
    figure.actor.rotation.set(0, Math.atan2(heading.x, heading.z), vx * CONFIG.steer.lean * 0.1, 'XYZ');

    behind(s - c.distance, back);
    const wantX = back.p.x + back.r.x * x * c.follow;
    const wantY = c.height;
    const wantZ = back.p.z + back.r.z * x * c.follow;
    const lookX = px + here.t.x * c.lookAhead, lookZ = pz + here.t.z * c.lookAhead;
    const k = snap ? 1 : 1 - Math.exp(-c.lag * dt);
    camPos.x += (wantX - camPos.x) * k; camPos.y += (wantY - camPos.y) * k; camPos.z += (wantZ - camPos.z) * k;
    camLook.x += (lookX - camLook.x) * k; camLook.y += (c.lookHeight - camLook.y) * k; camLook.z += (lookZ - camLook.z) * k;
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    key.position.set(px + 3, 5.5, pz + 4);
    key.target.position.set(px, 0, pz);
  }

  function step(dt) {
    if (state !== 'running') return;
    const st = CONFIG.steer;
    const target = ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * st.speed;
    vx += (target - vx) * Math.min(1, dt * st.response);
    const limit = half - st.margin;
    x = clamp(x + vx * dt, -limit, limit);
    if (x === limit || x === -limit) vx = 0;
    const prevS = s;
    s += profile.speed * dt;
    gates.crossed(prevS, s).forEach((gate) => {
      balance -= gate.amount;
      gatesPaid.push({ label: gate.label, amount: gate.amount });
      toast(gate.label + ': -' + money(gate.amount), 'expense');
      announce(gate.label + ' paid, ' + money(gate.amount) + '. Balance ' + money(balance) + '.');
    });
    if (!deposited && chest.crossed(prevS, s)) {
      saved = Math.max(0, balance);
      depositAmount = saved;
      balance = 0;
      deposited = true;
      shown = saved;
      setHudLabel();
      toast(saved > 0 ? 'Saved: ' + money(saved) : 'Nothing left to save', saved > 0 ? 'income' : 'expense');
      announce(saved > 0 ? 'Deposited ' + money(saved) + ' in the savings chest.' : 'Nothing was left to deposit.');
    }
    if (deposited) {
      forest.entered(prevS, s).forEach((k) => {
        const gain = saved * forest.rate;
        saved += gain;
        if (gain > 0) {
          toast('Year ' + (k + 1) + ': +' + money(gain));
          announce('Year ' + (k + 1) + '. Savings grew by ' + money(gain) + ' to ' + money(saved) + '.');
        }
      });
    }
    const got = coins.collect(s, x);
    if (got && !deposited) {
      balance += got * coins.value;
      collectedCount += got;
      if (Math.floor(collectedCount / 20) !== Math.floor((collectedCount - got) / 20)) announce('Balance ' + money(balance));
    }
    if (s >= track.length) {
      s = track.length;
      finishRun();
    }
  }

  /* ── Input ─────────────────────────────────────────────────────────── */
  const KEYS = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  overlay.dataset.quiet = '';
  window.addEventListener('pointerdown', () => { overlay.dataset.quiet = ''; });
  window.addEventListener('keydown', (e) => {
    if (quitOpen) return; /* the dialog has the keyboard; its own Escape means Keep playing */
    if (e.key === 'Tab') delete overlay.dataset.quiet; /* only moving focus shows the ring, not Escape or steering */
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const dir = KEYS[e.key];
    if (dir) { input[dir] = true; e.preventDefault(); return; }
    if (e.key === 'Escape') {
      e.preventDefault();
      requestQuit();
    }
  });
  window.addEventListener('keyup', (e) => {
    const dir = KEYS[e.key];
    if (dir) input[dir] = false;
  });
  /* One dialog for Escape, the close button and an automatic pause (tab switch, rotation): the run waits while it is open. */
  let quitOpen = false;
  function requestQuit() {
    if (quitOpen) return;
    if (state !== 'running' && state !== 'stepping') { closeGame(); return; } /* nothing to lose on the start and result screens */
    input.left = input.right = false;
    releaseTouch();
    if (state === 'running') setState('paused');
    quitOpen = true;
    window.UZBankPaymentExitPrompt(closeGame, {
      title: 'Quit this run?',
      message: 'Your progress in this run will be lost. Your best run stays saved.',
      leaveLabel: 'Quit run',
      stayLabel: 'Keep playing',
      escapeStays: true,
      onStay: () => { quitOpen = false; if (state === 'paused') setState('running'); },
    });
  }
  requestClose = requestQuit;
  const pause = () => { if (state === 'running') requestQuit(); };
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.matchMedia('(orientation: portrait)').addEventListener('change', pause);

  /* Hold a button to steer. Pointer capture keeps the hold when the finger slides off the button. */
  const touchButtons = [...document.querySelectorAll('[data-touch]')];
  function releaseTouch() {
    touchButtons.forEach((b) => b.classList.remove('is-held'));
  }
  touchButtons.forEach((b) => {
    const dir = b.getAttribute('data-touch');
    const hold = (on) => { input[dir] = on; b.classList.toggle('is-held', on); };
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      hold(true);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => b.addEventListener(t, () => hold(false)));
    b.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  /* ── Reduced motion: still scenes, one Next at a time (D15) ───────── */
  const stepCfg = CONFIG.stepped;
  const collectedN = Math.round(coins.count * stepCfg.collect);
  const gatesTotal = CONFIG.gates.reduce((sum, g) => sum + g.amount, 0);
  const afterGates = collectedN * coins.value - gatesTotal;
  const depositSum = Math.max(0, afterGates);
  const finalSum = depositSum * Math.pow(1 + forest.rate, forest.stages);
  const SCENES = [
    {
      key: 'payday', title: 'Payday',
      text: () => 'Your salary of ' + money(CONFIG.money.salary) + ' lands.',
      apply: () => { balance = 0; saved = 0; deposited = false; collectedCount = 0; gatesPaid = []; depositAmount = 0; },
    },
    {
      key: 'town', title: 'The town',
      text: () => 'You pick up most of it on the way: ' + money(collectedN * coins.value) + '.',
      apply: () => { balance = collectedN * coins.value; saved = 0; deposited = false; collectedCount = collectedN; gatesPaid = []; depositAmount = 0; },
    },
    {
      key: 'gates', title: 'Rent, groceries and bills',
      text: () => CONFIG.gates.map((g) => g.label + ' ' + money(g.amount)).join(', ') + '. Left over: ' + money(afterGates) + '.',
      apply: () => { balance = afterGates; saved = 0; deposited = false; collectedCount = collectedN; gatesPaid = CONFIG.gates.map((g) => ({ label: g.label, amount: g.amount })); depositAmount = 0; },
    },
    {
      key: 'chest', title: 'The savings chest',
      text: () => money(depositSum) + ' goes into savings.',
      apply: () => { balance = 0; saved = depositSum; deposited = true; collectedCount = collectedN; gatesPaid = CONFIG.gates.map((g) => ({ label: g.label, amount: g.amount })); depositAmount = depositSum; },
    },
    {
      key: 'forest', title: 'The forest',
      text: () => forest.stages + ' years of growth at ' + Math.round(forest.rate * 100) + ' percent a year: ' + money(finalSum) + '.',
      apply: () => { balance = 0; saved = finalSum; deposited = true; collectedCount = collectedN; gatesPaid = CONFIG.gates.map((g) => ({ label: g.label, amount: g.amount })); depositAmount = depositSum; },
    },
  ];
  let stepIndex = 0;

  function showScene(i) {
    stepIndex = i;
    const sc = SCENES[i];
    sc.apply();
    setHudLabel();
    shown = deposited ? saved : balance;
    s = stepCfg.scenes[sc.key]; x = 0; vx = 0;
    pose(0, true);
    state = 'stepping';
    dirty = true;
    figure.setLoop(CONFIG.idleClip);
    const last = i === SCENES.length - 1;
    overlay.hidden = false;
    overlay.classList.add('playground-overlay--step');
    overlay.querySelector('[data-overlay-title]').textContent = sc.title;
    const text = overlay.querySelector('[data-overlay-text]');
    text.textContent = sc.text();
    text.hidden = false;
    overlay.querySelector('[data-overlay-result]').hidden = true;
    overlay.querySelector('.playground-panel').classList.remove('playground-panel--result');
    const primary = overlay.querySelector('[data-overlay-primary]');
    primary.textContent = last ? 'Show result' : 'Next';
    overlay.querySelector('[data-overlay-skip]').hidden = last;
    primary.focus({ preventScroll: true });
    announce(sc.title + '. ' + sc.text());
  }
  function startStepped() {
    coins.reset();
    showScene(0);
  }
  function skipToResult() {
    SCENES[SCENES.length - 1].apply();
    setHudLabel();
    finishRun();
  }
  function onMotionPreference() {
    document.body.classList.toggle('playground--stepped', reduced());
    if (state !== 'ready') reset(); /* switching modes mid-run starts over, so nothing is left half done */
    else showOverlay('ready');
  }
  document.body.classList.toggle('playground--stepped', reduced());
  reduceMQ.addEventListener('change', onMotionPreference);

  if (overlay) {
    overlay.querySelector('[data-overlay-skip]').addEventListener('click', skipToResult);
    overlay.querySelector('[data-overlay-primary]').addEventListener('click', () => {
      if (state === 'stepping') { if (stepIndex < SCENES.length - 1) showScene(stepIndex + 1); else skipToResult(); }
      else if (state === 'ready') { if (reduced()) startStepped(); else startRun(); }
      else if (state === 'finished') { reset(); if (reduced()) startStepped(); else startRun(); }
    });
  }

  /* ── Size and loop ─────────────────────────────────────────────────── */
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.7 ? CONFIG.camera.fovNarrow : CONFIG.camera.fov;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  new ResizeObserver(resize).observe(host);
  resize();

  pose(0, true);
  figure.setLoop(CONFIG.idleClip);
  figure.mixer.update(0.4);
  showOverlay('ready');

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const rawDt = clock.getDelta();
    const dt = Math.min(rawDt, 0.05);
    if (document.hidden) return;
    if (state === 'stepping') {
      elapsed += dt;
      coins.update(dt, elapsed, true);
      forest.update(s, true);
      showBalance(dt);
    } else if (state !== 'paused') {
      step(dt);
      pose(dt, false);
      figure.update(dt);
      elapsed += dt;
      coins.update(dt, elapsed, reduced());
      forest.update(s, reduced());
      showBalance(dt);
    }
    /* Paused and still scenes only redraw when something changed; everything else draws every frame. */
    if (state === 'running' || state === 'ready' || state === 'finished' || dirty) {
      dirty = false;
      town.cull(s, cullRange);
      forest.cull(s, cullRange);
      const t0 = debug ? performance.now() : 0;
      renderer.render(scene, camera);
      if (debug) {
        renderCpu += performance.now() - t0;
        if (++frames % 180 === 0) {
          console.info('[playground] draw calls', renderer.info.render.calls, 'triangles', renderer.info.render.triangles,
            'render cpu ms', (renderCpu / 180).toFixed(2), 'pixel ratio', pixelRatio, 's', Math.round(s));
          renderCpu = 0;
        }
      }
    }
    adaptResolution(rawDt);
  }
  let frames = 0;
  let elapsed = 0;
  let renderCpu = 0;
  const debug = new URLSearchParams(window.location.search).has('debug');
  const cullRange = CONFIG.fogFar + 15;

  /* Dynamic resolution (D16): if frames keep taking longer than about 24 ms while running, step the
     pixel ratio down by a quarter, to a floor of 1. It never goes back up during this visit. */
  let pixelRatio = renderer.getPixelRatio();
  let slow = 0;
  function adaptResolution(raw) {
    if (state !== 'running' || raw > 0.5) return;
    slow = raw > 0.024 ? slow + raw : Math.max(0, slow - raw);
    if (slow > 1 && pixelRatio > 1) {
      pixelRatio = Math.max(1, pixelRatio - 0.25);
      renderer.setPixelRatio(pixelRatio);
      resize();
      slow = 0;
      if (debug) console.info('[playground] pixel ratio lowered to', pixelRatio);
    }
  }

  window.addEventListener('pagehide', (e) => {
    if (e.persisted) return;
    renderer.dispose();
    renderer.forceContextLoss();
  });
  requestAnimationFrame(frame);
}

/* Merge a few position-only strips into one geometry (one draw call). */
function mergeGeometries(geos) {
  const positions = [];
  const index = [];
  let base = 0;
  geos.forEach((g) => {
    positions.push(...g.getAttribute('position').array);
    g.getIndex().array.forEach((i) => index.push(i + base));
    base += g.getAttribute('position').count;
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  out.setIndex(index);
  out.computeVertexNormals();
  return out;
}

if (stage) {
  mountGame(stage).catch((err) => console.warn('[playground] 3D failed to load', err));
}
