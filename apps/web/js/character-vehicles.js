/**
 * The strategy vehicles (roadmap 9c): the persona with each investment strategy's way of travelling, on its own small
 * stage. Used by the Character kit page; built so the opening's strategy screen (9d) can reuse it.
 * Models in `assets/3d/vehicles/` (credits in its CREDITS.md), recoloured to the theme's monochrome ramp like the fridge
 * (D8). The persona comes from `createFigure()` and follows the page's recipe (`uzbank:persona-change`). Every number is in
 * `js/character-vehicles-config.js`.
 */
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm';
import { THREE, createFigure, readTheme, preparePalette, monochromeLut, toOklab, EASE } from './profile-persona-character.js';
import { VEHICLES, POSES, IDLE, STAGE } from './character-vehicles-config.js';

const RIDE = new URL('../assets/3d/kaykit/rig-medium-ride.glb', import.meta.url).href;
const SWAP = { out: 0.168, back: 0.42 }; /* the kit's part swap (Motion table) */

/* A flat colour's lightness on the theme's ramp, as the fridge's food: keep L, take the theme hue. */
function rampColour(lut, L) {
  const j = Math.max(0, Math.min(255, Math.round(L * 255))) * 3;
  return new THREE.Color().setRGB(lut[j] / 255, lut[j + 1] / 255, lut[j + 2] / 255, THREE.SRGBColorSpace);
}

/* Each material keeps what it needs to be recoloured again: its original lightness, or its texture's palette. */
function prepareVehicle(root) {
  const flats = [], textures = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => {
      m.roughness = 0.9;
      m.metalness = 0;
      if (m.map) { if (!textures.some((t) => t.material === m)) textures.push({ material: m, palette: preparePalette(m) }); return; }
      const [r, g, b] = m.color.getStyle(THREE.SRGBColorSpace).match(/[\d.]+/g).map(Number);
      flats.push({ material: m, L: toOklab(r, g, b)[0] });
    });
  });
  return function recolour(theme) {
    const lut = monochromeLut(theme);
    flats.forEach((f) => f.material.color.copy(rampColour(lut, f.L)));
    textures.forEach(({ palette: p }) => {
      const img = new ImageData(new Uint8ClampedArray(p.orig.data), p.size, p.size);
      const d = img.data;
      for (let i = 0; i < p.L.length; i++) {
        const j = Math.max(0, Math.min(255, Math.round(p.L[i] * 255))) * 3;
        d[i * 4] = lut[j]; d[i * 4 + 1] = lut[j + 1]; d[i * 4 + 2] = lut[j + 2];
      }
      p.ctx.putImageData(img, 0, 0);
      p.tex.needsUpdate = true;
    });
  };
}

/* Turned, scaled to its height, stood on the floor and centred, then placed (config). */
function placeVehicle(scene, cfg) {
  const inner = new THREE.Group();
  inner.add(scene);
  scene.rotation.set(...cfg.rotate);
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const k = cfg.height / size.y;
  scene.scale.multiplyScalar(k);
  scene.position.set(-(box.min.x + size.x / 2) * k, -box.min.y * k, -(box.min.z + size.z / 2) * k);
  const outer = new THREE.Group();
  outer.add(inner);
  outer.position.set(...cfg.at);
  outer.rotation.y = cfg.yaw;
  return outer;
}

/**
 * Mounts the stage into `box` (sized by CSS) and returns `{ show(strategy), wake() }`.
 * `active()` says whether to keep drawing; `wake()` starts the loop again.
 */
export async function mountVehicles(box, {
  reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  active = () => true,
  strategy: first = 'income',
} = {}) {
  const loader = new GLTFLoader();
  const keys = Object.keys(VEHICLES);
  const [figure, ride, ...models] = await Promise.all([
    createFigure({ reduced }),
    loader.loadAsync(RIDE),
    ...keys.map((k) => loader.loadAsync(new URL('../assets/3d/vehicles/' + VEHICLES[k].file, import.meta.url).href)),
  ]);
  figure.addClips(ride.animations);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'ck-vehicles__canvas';
  canvas.setAttribute('aria-hidden', 'true');

  /* The persona stage's lights, shadow and (Dark) spotlight pool. */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(STAGE.fov, 1, 0.1, 100);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(3, 7, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 6, bottom: -3, far: 30 });
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(-3, 3, -4);
  scene.add(hemi, key, rim);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.2 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(8, 64), shadowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.renderOrder = 1;
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 256;
  const gctx = glowCanvas.getContext('2d');
  const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  [[0, 1], [0.35, 0.62], [0.65, 0.22], [1, 0]].forEach(([o, a]) => grad.addColorStop(o, `rgba(255,255,255,${a})`));
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 256, 256);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0 });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.002;
  glow.scale.set(2.2, 1.8, 1);
  glow.renderOrder = -1;
  scene.add(floor, glow);

  /* turn: the fixed three-quarter view (D10); group: what squashes, hovers and sways; rig: the persona's place. */
  const turn = new THREE.Group();
  turn.rotation.y = STAGE.turn;
  const group = new THREE.Group();
  const rig = new THREE.Group();
  rig.add(figure.actor);
  group.add(rig);
  turn.add(group);
  scene.add(turn);

  const vehicles = {};
  const recolours = [];
  keys.forEach((k, i) => {
    recolours.push(prepareVehicle(models[i].scene));
    vehicles[k] = placeVehicle(models[i].scene, VEHICLES[k]);
    vehicles[k].visible = false;
    group.add(vehicles[k]);
  });

  /* Sit (D5): the legs bent, the arms forward, on top of whatever the clip set this frame. three.js drops the dot from
     the rig's bone names (`upperleg.l` is `upperlegl`). */
  const bones = {};
  figure.actor.traverse((o) => { if (o.isBone) bones[o.name] = o; });
  const q = new THREE.Quaternion(), X = new THREE.Vector3(1, 0, 0);
  function bend(name, angle) {
    const b = bones[name];
    if (b && angle) b.quaternion.multiply(q.setFromAxisAngle(X, angle));
  }
  let current = null;
  function applyPose() {
    const p = POSES[VEHICLES[current].pose];
    if (!p.upperLeg) return;
    ['l', 'r'].forEach((s) => {
      bend('upperleg' + s, p.upperLeg);
      bend('lowerleg' + s, p.lowerLeg);
      bend('upperarm' + s, p.upperArm);
      bend('lowerarm' + s, p.lowerArm);
    });
  }

  function place(k) {
    current = k;
    const c = VEHICLES[k];
    keys.forEach((v) => { vehicles[v].visible = v === k; });
    rig.position.set(...c.figure.at);
    rig.rotation.y = c.figure.yaw;
    turn.rotation.y = c.view.turn == null ? STAGE.turn : c.view.turn;
    figure.setLoop(POSES[c.pose].clip);
    group.position.set(0, 0, 0);
    group.rotation.z = 0;
    figure.mixer.update(0);
    applyPose();
    frameCamera();
  }

  /* Recipe from the page's pickers (the live specimen); the pose, not the specimen's loop, decides the clip. */
  figure.setRecipe({ head: 'rogue', headwear: 'none', outfit: 'barbarian', back: 'none' }, false);
  document.addEventListener('uzbank:persona-change', (e) => {
    const r = e.detail && e.detail.recipe;
    if (!r) return;
    const { loop, ...parts } = r;
    figure.setRecipe(parts, false);
    if (reduced()) render();
  });

  let themeKey = '';
  function applyTheme() {
    const theme = readTheme();
    if (theme.key === themeKey) return;
    themeKey = theme.key;
    hemi.color.set(theme.sky);
    hemi.groundColor.set(theme.dark ? '#1E2026' : '#DCDEE3');
    hemi.intensity = theme.light.fill;
    key.intensity = theme.light.key;
    rim.intensity = theme.light.rim;
    shadowMat.color.set(theme.shadowColor);
    shadowMat.opacity = theme.shadowOpacity;
    glowMat.color.set(theme.glowColor);
    glowMat.opacity = theme.glowOpacity;
    figure.recolour(theme);
    recolours.forEach((fn) => fn(theme));
    render();
  }
  new MutationObserver(() => requestAnimationFrame(applyTheme))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });

  /* Fit the strategy's view: its height, or its width on a narrow stage. */
  const aim = new THREE.Vector3(...STAGE.aim).normalize();
  function frameCamera() {
    const w = box.clientWidth, h = box.clientHeight;
    if (!w || !h || !current) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const v = VEHICLES[current].view;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = Math.max(v.height, v.width / camera.aspect);
    const target = new THREE.Vector3(...v.look);
    camera.position.copy(target).addScaledVector(aim, (fit / 2) / tan);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(() => { frameCamera(); render(); }).observe(box);

  function render() { renderer.render(scene, camera); }

  /* The swap (D9): squash out, change, spring back; only the latest pick waits. */
  let swap = null, pending = null, t = 0;
  function show(k) {
    if (!VEHICLES[k] || (k === current && !swap)) return;
    if (reduced()) { swap = null; pending = null; group.scale.set(1, 1, 1); place(k); render(); return; }
    pending = k;
    if (!swap) swap = { phase: 'out', t: 0 };
    helper.wake();
  }
  function stepSwap(dt) {
    if (!swap) return;
    swap.t += dt;
    if (swap.phase === 'out') {
      const p = EASE.exit(Math.min(1, swap.t / SWAP.out));
      group.scale.set(1 + 0.06 * p, 1 - 0.08 * p, 1 + 0.06 * p);
      if (swap.t >= SWAP.out) { place(pending); pending = null; swap = { phase: 'back', t: 0 }; }
    } else {
      const p = EASE.enter(Math.min(1, swap.t / SWAP.back));
      group.scale.set(1.06 - 0.06 * p, 0.92 + 0.08 * p, 1.06 - 0.06 * p);
      if (swap.t >= SWAP.back) swap = pending ? { phase: 'out', t: SWAP.out } : null;
    }
  }

  /* The small idles (D7); nothing moves with reduced motion. */
  function stepIdle() {
    const idle = VEHICLES[current].idle;
    if (idle === 'hover') group.position.y = Math.sin((t / IDLE.hover.period) * Math.PI * 2) * IDLE.hover.amount;
    if (idle === 'sway') {
      /* About the canopy, not the floor: turn, then shift back so the pivot stays put. */
      const a = Math.sin((t / IDLE.sway.period) * Math.PI * 2) * IDLE.sway.angle;
      group.rotation.z = a;
      group.position.x = IDLE.sway.pivot * Math.sin(a);
    }
  }

  const clock = new THREE.Clock();
  let running = false;
  function tick() {
    if (!active()) { running = false; return; }
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reduced()) {
      t += dt;
      stepSwap(dt);
      figure.update(dt);
      applyPose();
      stepIdle();
    }
    render();
  }

  box.append(canvas);
  place(VEHICLES[first] ? first : 'income');
  applyTheme();
  const helper = {
    show,
    wake() {
      if (running) return;
      running = true;
      clock.getDelta();
      frameCamera();
      requestAnimationFrame(tick);
    },
  };
  helper.wake();
  return helper;
}
