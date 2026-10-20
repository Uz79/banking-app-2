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

/* Embedded, every close link asks the hub to slide the sheet down; opened directly, they stay plain links. */
if (embedded) {
  closeLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.parent.postMessage({ type: 'uzbank:playground-close' }, window.location.origin);
    });
  });
}

/* Leave the game: the hub slides the sheet down, or a direct visit goes back to the hub. */
function closeGame() {
  if (embedded) window.parent.postMessage({ type: 'uzbank:playground-close' }, window.location.origin);
  else if (closeLinks[0]) window.location.href = closeLinks[0].href;
}

const stage = document.querySelector('[data-playground-stage]');
const overlay = document.querySelector('[data-playground-overlay]');
const hud = document.querySelector('[data-playground-hud]');

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

async function mountGame(host) {
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;

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
  function showBalance(dt) {
    const target = deposited ? saved : balance;
    shown += (target - shown) * Math.min(1, dt * 10);
    if (Math.abs(target - shown) < 0.005) shown = target;
    if (balanceEl) balanceEl.textContent = money(shown);
  }
  function setHudLabel() {
    const label = document.querySelector('.playground-balance__label');
    if (label) label.textContent = deposited ? 'Saved' : 'Balance';
  }
  function startRun() {
    balance = startMoney; saved = 0; deposited = false; shown = startMoney; collectedCount = 0;
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
    ready: { title: 'Payday run', text: touchMode ? 'Hold the left and right buttons to steer.' : 'Steer with the arrow keys or A and D. Escape pauses.', primary: 'Start' },
    paused: { title: 'Paused', text: touchMode ? '' : 'Escape again closes the game.', primary: 'Resume' },
    finished: { title: 'Finish', text: 'You made it to the end of the track.', primary: 'Play again' },
  };

  function showOverlay(name) {
    if (!overlay) return;
    const t = TEXT[name];
    overlay.hidden = !t;
    if (!t) return;
    overlay.querySelector('[data-overlay-title]').textContent = t.title;
    const text = overlay.querySelector('[data-overlay-text]');
    text.textContent = t.text;
    text.hidden = !t.text;
    const primary = overlay.querySelector('[data-overlay-primary]');
    primary.textContent = t.primary;
    primary.focus({ preventScroll: true });
  }

  function setState(next) {
    state = next;
    if (next === 'running') figure.setLoop(CONFIG.runClip, { timeScale: profile.timeScale });
    else if (next !== 'paused') figure.setLoop(CONFIG.idleClip);
    showOverlay(next);
    if (next === 'running' && document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  function reset() {
    s = startAt; x = 0; vx = 0;
    balance = 0; saved = 0; deposited = false; shown = 0; collectedCount = 0;
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
      toast(gate.label + ': -' + money(gate.amount), 'expense');
      announce(gate.label + ' paid, ' + money(gate.amount) + '. Balance ' + money(balance) + '.');
    });
    if (!deposited && chest.crossed(prevS, s)) {
      saved = Math.max(0, balance);
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
      setState('finished');
    }
  }

  /* ── Input ─────────────────────────────────────────────────────────── */
  const KEYS = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const dir = KEYS[e.key];
    if (dir) { input[dir] = true; e.preventDefault(); return; }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (state === 'running') setState('paused');
      else closeGame(); /* ready, paused or finished: Escape leaves, like the flow screens */
    }
  });
  window.addEventListener('keyup', (e) => {
    const dir = KEYS[e.key];
    if (dir) input[dir] = false;
  });
  const pause = () => { input.left = input.right = false; releaseTouch(); if (state === 'running') setState('paused'); };
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

  if (overlay) {
    overlay.querySelector('[data-overlay-primary]').addEventListener('click', () => {
      if (state === 'ready') startRun();
      else if (state === 'paused') setState('running');
      else if (state === 'finished') { reset(); startRun(); }
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
    const dt = Math.min(clock.getDelta(), 0.05);
    if (document.hidden) return;
    if (state !== 'paused') {
      step(dt);
      pose(dt, false);
      figure.update(dt);
      elapsed += dt;
      coins.update(dt, elapsed, reduced());
      forest.update(s, reduced());
      showBalance(dt);
    }
    renderer.render(scene, camera);
    if (debug && ++frames === 120) console.info('[playground] draw calls', renderer.info.render.calls, 'triangles', renderer.info.render.triangles);
  }
  let frames = 0;
  let elapsed = 0;
  const debug = new URLSearchParams(window.location.search).has('debug');
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
