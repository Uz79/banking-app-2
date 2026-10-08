/**
 * Profile > User Type — 3D persona character (three.js, KayKit Adventurers, CC0).
 *
 * Replaces the Spline cards. Every part is skinned to KayKit's shared 23-bone rig
 * (Rig_Medium), so heads, headwear, outfits and backs from different characters
 * mix on one skeleton and every animation clip plays on every mix.
 *
 * Colour follows the app, not the asset:
 *   - Monochrome: each texture pixel keeps its lightness and takes the theme's hue
 *     (from whichever of --color-fg / --color-bg carries chroma) at neutralTint 0.25.
 *   - One accent: dyeable cloth swatches take the same hue on the ds4 ramp law
 *     (C = 0.22 × (1 − L)), so the figure reads as UI, with colour spent in one place.
 *   - Stage is transparent; the floor only catches the shadow. The shadow uses
 *     --color-overlay-tint like the content-indication shadow; on a dark background
 *     a white spotlight (25 %, the app's Dark content-indication strength) makes the
 *     shadow visible again.
 *
 * Driven by `uzbank:persona-change` from js/profile-persona.js.
 * Runtime from jsDelivr (+esm keeps three.js a single instance for GLTFLoader).
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm';

const ASSETS = {
  knight: new URL('../assets/3d/kaykit/knight.glb', import.meta.url).href,
  mage: new URL('../assets/3d/kaykit/mage.glb', import.meta.url).href,
  rogue: new URL('../assets/3d/kaykit/rogue.glb', import.meta.url).href,
  barbarian: new URL('../assets/3d/kaykit/barbarian.glb', import.meta.url).href,
  ranger: new URL('../assets/3d/kaykit/ranger.glb', import.meta.url).href,
  animGeneral: new URL('../assets/3d/kaykit/rig-medium-general.glb', import.meta.url).href,
  animMove: new URL('../assets/3d/kaykit/rig-medium-movement.glb', import.meta.url).href,
};
const CHARACTERS = ['knight', 'mage', 'rogue', 'barbarian', 'ranger'];

/* Slot option → [source character, mesh parts]. null = slot empty. */
const OUTFIT_PARTS = ['Body', 'ArmLeft', 'ArmRight', 'LegLeft', 'LegRight'];
const SLOTS = {
  outfit: { barbarian: ['barbarian', OUTFIT_PARTS], ranger: ['ranger', OUTFIT_PARTS], knight: ['knight', OUTFIT_PARTS] },
  head: { rogue: ['rogue', ['Head']] }, /* one face for every profile */
  headwear: { none: null, helmet: ['knight', ['Helmet']], hat: ['mage', ['Hat']] },
  back: { none: null, quiver: ['ranger', ['Quiver']], cape: ['knight', ['Cape']] },
};

/* Dyeable cloth cells, (column, row) in KayKit's 8×8 palette texture grid,
   found by sampling each mesh's UVs. Barbarian and Rogue (head only) have none. */
const CLOTH = {
  knight: [[0, 2], [0, 3], [2, 4], [2, 5]],
  mage: [[0, 2], [0, 3], [1, 2], [1, 3], [7, 2], [7, 3]],
  ranger: [[0, 2], [0, 3], [1, 4], [1, 5]],
  rogue: [],
  barbarian: [],
};

/* Extra accent per mesh part, on cells that other parts share (the helmet's metal is
   also the armour's), so these parts get their own texture copy:
   knight helmet → metal swatches, rogue head → hair swatches (used bare-headed only, see syncHairAccent). */
const PART_ACCENT = {
  'knight:Helmet': [[3, 0], [3, 1], [7, 0]],
  'rogue:Head': [[1, 0], [1, 1]],
};

const NEUTRAL_TINT = 0.25; /* ds4 neutralTint as shipped */
const FALLBACK_HUE = 264;  /* brand blue */
const DUR = { enter: 0.42, exit: 0.28 };

/* ── Colour maths (OKLab / OKLCH) ─────────────────────────────────────── */
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
function toOklab(r, g, b) {
  r = lin(r / 255); g = lin(g / 255); b = lin(b / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function toOklch(rgb) {
  const [L, a, b] = toOklab(rgb[0], rgb[1], rgb[2]);
  return { L, C: Math.hypot(a, b), h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}
function oklchToRGB(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const f = (v) => Math.round(gam(Math.min(1, Math.max(0, v))) * 255);
  return [
    f(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    f(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    f(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
const rgbCss = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

function cssColor(name) {
  const probe = document.createElement('span');
  probe.style.color = `var(${name})`;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const s = getComputedStyle(probe).color;
  probe.remove();
  const m = s.replace(/^color\(srgb/, '').match(/[\d.]+/g) || [0, 0, 0];
  const k = s.startsWith('color(srgb') ? 255 : 1;
  return [Number(m[0]) * k, Number(m[1]) * k, Number(m[2]) * k];
}

/* Everything the scene takes from the app theme, in one place. */
function readTheme() {
  const bg = cssColor('--color-bg');
  const fg = cssColor('--color-fg');
  const tint = cssColor('--color-overlay-tint');
  /* Multi-color themes set --color-fg-interactive to the primary accent. */
  const ink = cssColor('--color-fg-interactive');
  const bgL = toOklch(bg), fgL = toOklch(fg), inkL = toOklch(ink);
  const dark = bgL.L < 0.5;
  const hued = bgL.C > fgL.C ? bgL : fgL;
  const hue = hued.C >= 0.03 ? hued.h : FALLBACK_HUE;
  const tintAmount = hued.C >= 0.03 ? NEUTRAL_TINT : 0;
  return {
    key: [bg, fg, tint, ink].join('|'),
    dark,
    hue,
    accentHue: inkL.C >= 0.03 ? inkL.h : hue,
    tintAmount,
    range: dark ? [0.24, 0.86] : [0.32, 0.97],
    anchorL: dark ? 0.6035 : 0.521, /* accent step: 600 on dark, 700 on light */
    shadowColor: dark ? 'rgb(0, 0, 0)' : rgbCss(tint),
    shadowOpacity: dark ? 0.55 : 0.2,
    glowColor: rgbCss(tint),
    glowOpacity: dark ? 0.25 : 0,
    light: dark ? { key: 1.8, fill: 0.85, rim: 2.2 } : { key: 2.2, fill: 1.15, rim: 0 },
    sky: dark ? '#9AA3B8' : '#FFFFFF',
  };
}

/* ── Easing (ds4 motion curves) ───────────────────────────────────────── */
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) { const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= (sx(t) - x) / d; }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
const EASE = { enter: bezier(0.22, 1, 0.36, 1), exit: bezier(0.4, 0, 1, 1) };

/* ── Stage ────────────────────────────────────────────────────────────── */
/* interactive: drag-to-turn + hover cursor (Profile only; elsewhere the figure is decoration). */
async function mountStage(stage, { interactive = true } = {}) {
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;
  const fallback = stage.querySelector('.profile-persona-stage__fallback');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 'profile-persona-stage__canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(2.9, 2.2, 6.6);
  camera.lookAt(0, 1.1, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(3, 5.5, 4); /* from the right: the shadow falls back-left, onto the page */
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3.5, bottom: -2 });
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(-3, 3, -4);
  scene.add(hemi, key, rim);

  /* Floor: shadow catcher + spotlight pool, both see-through. */
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.2 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(7, 64), shadowMat);
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
  glow.scale.set(1.8, 1.45, 1); /* fades out well inside the canvas edges */
  glow.renderOrder = -1;
  scene.add(floor, glow);

  const turntable = new THREE.Group();
  const actor = new THREE.Group();
  turntable.add(actor);
  scene.add(turntable);

  /* Load everything in parallel. */
  const loader = new GLTFLoader();
  const [chars, general, move] = await Promise.all([
    Promise.all(CHARACTERS.map((k) => loader.loadAsync(ASSETS[k]))),
    loader.loadAsync(ASSETS.animGeneral),
    loader.loadAsync(ASSETS.animMove),
  ]);

  const parts = {};
  const palettes = {};
  const partPalettes = {}; /* 'char:Part' → own texture for PART_ACCENT */
  chars.forEach((gltf, i) => {
    const k = CHARACTERS[i];
    parts[k] = {};
    const meshes = [];
    gltf.scene.traverse((o) => { if (o.isSkinnedMesh) meshes.push(o); });
    meshes.forEach((o) => {
      const name = (o.name.includes('_') ? o.name : o.parent.name).split('_').slice(1).join('_');
      parts[k][name] = o;
      if (!palettes[k]) palettes[k] = preparePalette(o.material);
      else o.material.map = palettes[k].tex;
    });
    meshes.forEach((o) => {
      const name = (o.name.includes('_') ? o.name : o.parent.name).split('_').slice(1).join('_');
      const key = k + ':' + name;
      if (!PART_ACCENT[key]) return;
      const base = palettes[k];
      const c = document.createElement('canvas');
      c.width = c.height = base.size;
      const tex = new THREE.CanvasTexture(c);
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.magFilter = THREE.NearestFilter;
      o.material = o.material.clone();
      o.material.map = tex;
      partPalettes[key] = { ctx: c.getContext('2d'), tex, char: k, cells: PART_ACCENT[key] };
    });
  });

  /* The knight's skeleton is the shared rig; its own meshes are only part sources. */
  const rig = chars[0].scene;
  const rigBones = {};
  const sources = [];
  rig.traverse((o) => { if (o.isBone) rigBones[o.name] = o; if (o.isSkinnedMesh) sources.push(o); });
  sources.forEach((o) => o.parent.remove(o));
  const rigRoot = rig.getObjectByName('Rig_Medium') || rig;
  actor.add(rig);

  const clips = {};
  [...general.animations, ...move.animations].forEach((c) => { clips[c.name] = c; });
  const mixer = new THREE.AnimationMixer(rig);

  function preparePalette(material) {
    const img = material.map.image;
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const orig = ctx.getImageData(0, 0, c.width, c.height);
    const L = new Float32Array(c.width * c.height);
    for (let i = 0, d = orig.data; i < L.length; i++) L[i] = toOklab(d[i * 4], d[i * 4 + 1], d[i * 4 + 2])[0];
    const tex = new THREE.CanvasTexture(c);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    material.map = tex;
    material.roughness = 0.9;
    material.metalness = 0;
    material.needsUpdate = true;
    return { ctx, orig, L, tex, size: c.width };
  }

  /* Monochrome on the theme hue, then one accent on the cloth swatches. */
  function recolour(theme) {
    const [lo, hi] = theme.range;
    const lut = new Uint8Array(256 * 3);
    for (let v = 0; v < 256; v++) {
      const src = Math.min(1, Math.max(0, (v / 255 - 0.08) / 0.9));
      const L = lo + src * (hi - lo);
      lut.set(oklchToRGB(L, theme.tintAmount * 0.09 * (1 - L), theme.hue), v * 3);
    }
    for (const k of CHARACTERS) {
      const p = palettes[k];
      const img = new ImageData(new Uint8ClampedArray(p.orig.data), p.size, p.size);
      const d = img.data;
      for (let i = 0; i < p.L.length; i++) {
        const j = Math.max(0, Math.min(255, Math.round(p.L[i] * 255))) * 3;
        d[i * 4] = lut[j]; d[i * 4 + 1] = lut[j + 1]; d[i * 4 + 2] = lut[j + 2];
      }
      dyeCells(p, CLOTH[k], theme, d);
      p.ctx.putImageData(img, 0, 0);
      p.tex.needsUpdate = true;
      Object.values(partPalettes).filter((pp) => pp.char === k).forEach((pp) => {
        const own = new ImageData(new Uint8ClampedArray(d), p.size, p.size);
        dyeCells(p, pp.cells, theme, own.data);
        pp.ctx.putImageData(own, 0, 0);
        pp.tex.needsUpdate = true;
      });
    }
  }

  function dyeCells(p, cells, theme, out) {
    if (!cells.length) return;
    const cell = p.size / 8, w = p.size;
    let sum = 0, n = 0;
    for (const [cx, cy] of cells)
      for (let y = cy * cell; y < (cy + 1) * cell; y += 4)
        for (let x = cx * cell; x < (cx + 1) * cell; x += 4) { sum += p.L[y * w + x]; n++; }
    const shift = theme.anchorL - sum / n;
    for (const [cx, cy] of cells)
      for (let y = cy * cell; y < (cy + 1) * cell; y++)
        for (let x = cx * cell; x < (cx + 1) * cell; x++) {
          const i = y * w + x;
          const L = Math.min(0.97, Math.max(0.12, p.L[i] + shift));
          const [r, g, b] = oklchToRGB(L, 0.22 * (1 - L), theme.accentHue);
          out[i * 4] = r; out[i * 4 + 1] = g; out[i * 4 + 2] = b;
        }
  }

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
    shadowMat.color.set(theme.shadowColor);
    shadowMat.opacity = theme.shadowOpacity;
    glowMat.color.set(theme.glowColor);
    glowMat.opacity = theme.glowOpacity;
    recolour(theme);
  }

  /* Parts on the shared rig. */
  const mounted = { outfit: [], head: [], headwear: [], back: [] };
  const recipe = {};
  function mount(slot, option) {
    mounted[slot].forEach((m) => rigRoot.remove(m));
    mounted[slot] = [];
    recipe[slot] = option;
    const spec = SLOTS[slot][option];
    if (!spec) return;
    const [charKey, names] = spec;
    for (const name of names) {
      const src = parts[charKey][name];
      if (!src) continue;
      const m = src.clone();
      const bones = src.skeleton.bones.map((b) => rigBones[b.name]);
      m.bind(new THREE.Skeleton(bones, src.skeleton.boneInverses), src.bindMatrix);
      m.castShadow = true;
      m.receiveShadow = true;
      m.frustumCulled = false;
      rigRoot.add(m);
      mounted[slot].push(m);
    }
  }

  /* Small tween runner for the swap squash. */
  const tweens = [];
  function tween(dur, ease, onUpdate, onDone) {
    if (reduced()) { onUpdate(1); if (onDone) onDone(); return; }
    tweens.push({ t: 0, dur, ease, onUpdate, onDone });
  }

  /* The hair takes the accent only bare-headed (the newbie); under a helmet or hat it
     stays grey, so the headwear carries the accent and the two don't merge. */
  function syncHairAccent() {
    const head = parts.rogue && parts.rogue.Head;
    const own = partPalettes['rogue:Head'];
    if (!head || !own) return;
    head.material.map = recipe.headwear === 'none' ? own.tex : palettes.rogue.tex;
  }

  /* Slider drags fire many changes; while a swap runs, only the latest recipe waits. */
  let pending = null;
  let swapping = false;
  function setRecipe(next, animate) {
    const changed = Object.keys(SLOTS).filter((s) => next[s] && next[s] !== recipe[s]);
    if (!changed.length) return;
    if (!animate) { changed.forEach((s) => mount(s, next[s])); syncHairAccent(); return; }
    pending = next;
    if (swapping) return;
    swapping = true;
    /* Skinned vertices ignore a mesh's own scale, so the whole actor squashes. */
    tween(DUR.exit * 0.6, EASE.exit, (p) => actor.scale.set(1 + 0.06 * p, 1 - 0.08 * p, 1 + 0.06 * p), () => {
      const r = pending;
      pending = null;
      Object.keys(SLOTS).forEach((s) => { if (r[s] && r[s] !== recipe[s]) mount(s, r[s]); });
      syncHairAccent();
      tween(DUR.enter, EASE.enter, (p) => actor.scale.set(1.06 - 0.06 * p, 0.92 + 0.08 * p, 1.06 - 0.06 * p), () => {
        swapping = false;
        if (pending) { const p = pending; pending = null; setRecipe(p, true); }
      });
    });
  }

  let loopAction = null;
  function setLoop(name) {
    if (!clips[name]) return;
    const next = mixer.clipAction(clips[name]);
    if (next === loopAction) return;
    next.reset().setLoop(THREE.LoopRepeat, Infinity).setEffectiveWeight(1).play();
    if (loopAction) next.crossFadeFrom(loopAction, reduced() ? 0 : DUR.exit, false);
    loopAction = next;
    if (reduced()) mixer.update(0.4);
  }

  /* Drag to turn. The canvas is click-through (it floats over the page), so the
     character is hit-tested against an invisible capsule instead. */
  /* Rest pose turned 30° further toward the viewer's left, so the figure heads for the bottom centre of the screen. */
  let dragging = false, lastX = 0, vel = 0, yaw = 0.35 - Math.PI / 6;
  const canvas = renderer.domElement;
  const proxy = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.7, 12), new THREE.MeshBasicMaterial({ visible: false }));
  proxy.position.y = 1.35;
  turntable.add(proxy);
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const INTERACTIVE = 'a, button, input, select, textarea, label, [role="slider"], [tabindex]';
  function hitsCharacter(e) {
    if (stage.offsetParent === null) return false;
    const r = canvas.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return false;
    if (e.target && e.target.closest && e.target.closest(INTERACTIVE)) return false;
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObject(proxy).length > 0;
  }
  let hovering = false;
  if (interactive) {
  document.addEventListener('pointerdown', (e) => {
    if (!hitsCharacter(e)) return;
    dragging = true; lastX = e.clientX; vel = 0;
    document.body.classList.add('persona-character--dragging');
    e.preventDefault();
  }, true);
  window.addEventListener('pointermove', (e) => {
    if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; vel = dx * 0.01; yaw += vel; return; }
    if (e.pointerType !== 'mouse') return;
    const h = hitsCharacter(e);
    if (h !== hovering) { hovering = h; document.body.classList.toggle('persona-character--hover', h); }
  }, { passive: true });
  const endDrag = () => { dragging = false; document.body.classList.remove('persona-character--dragging'); };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  }

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.55 ? 38 : 30;
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
    /* Floating (desktop): the canvas runs to the viewport edges; shift the view so
       the figure itself (not its shadow) keeps the --persona-stage-margin (64dp) to
       the right and bottom edges. Bounds: one fixed capsule (2.65 m tall, 0.8 m radius) for every outfit, so the figure stands on the same spot whatever it wears. */
    if (getComputedStyle(stage).position === 'fixed') {
      const margin = parseFloat(getComputedStyle(stage).getPropertyValue('--persona-figure-margin')) *
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 64;
      const r = 0.8; /* fixed for every mix, so the figure never shifts; wide enough for the wizard hat's brim */
      camera.updateMatrixWorld();
      let maxX = -Infinity, maxY = -Infinity;
      const v = new THREE.Vector3();
      for (let a = 0; a < 16; a++) {
        const ang = (a / 16) * Math.PI * 2;
        for (const y of [0, 2.65]) {
          v.set(Math.cos(ang) * r, y, Math.sin(ang) * r).project(camera);
          maxX = Math.max(maxX, ((v.x + 1) / 2) * w);
          maxY = Math.max(maxY, ((1 - v.y) / 2) * h);
        }
      }
      camera.setViewOffset(w, h, maxX - (w - margin), maxY - (h - margin), w, h);
    }
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  /* Scroll turns the figure slowly: about 7° per 100 px, tied to the scroll position
     (scrolling back up turns it back), eased so it follows rather than jumps.
     Off with reduced motion. */
  const SCROLL_TURN = 0.0012; /* radians per px */
  const scroller = document.querySelector('.main-content') || document.scrollingElement;
  let scrollTarget = 0, scrollYaw = 0;
  const readScroll = () => { scrollTarget = (scroller ? scroller.scrollTop : window.scrollY) * SCROLL_TURN; };
  (scroller === document.scrollingElement ? window : scroller).addEventListener('scroll', readScroll, { passive: true });
  readScroll();
  scrollYaw = scrollTarget;

  /* Render only while visible. */
  let visible = true;
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) clock.getDelta(); })
    .observe(stage);
  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      tw.t += dt;
      const p = Math.min(1, tw.t / tw.dur);
      tw.onUpdate(tw.ease(p));
      if (p >= 1) { tweens.splice(i, 1); if (tw.onDone) tw.onDone(); }
    }
    if (!dragging && !reduced()) { vel *= 0.92; yaw += vel; }
    if (!reduced()) scrollYaw += (scrollTarget - scrollYaw) * Math.min(1, dt * 6);
    turntable.rotation.y = yaw + (reduced() ? 0 : scrollYaw);
    if (!reduced()) mixer.update(dt);
    renderer.render(scene, camera);
  }

  /* Theme changes: data-theme, colour overrides (inline style on <html>). */
  new MutationObserver(() => requestAnimationFrame(() => applyTheme(false)))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });

  const initial = (window.UZBankPersona && window.UZBankPersona.read()) || null;
  const r0 = (initial && initial.recipe) || { outfit: 'barbarian', head: 'rogue', headwear: 'none', back: 'none', loop: 'Idle_A' };
  setRecipe(r0, false);
  applyTheme(true);
  setLoop(r0.loop);
  mixer.update(0.4);
  requestAnimationFrame(frame);

  document.addEventListener('uzbank:persona-change', (ev) => {
    const r = ev.detail && ev.detail.recipe;
    if (!r) return;
    setRecipe(r, true);
    setLoop(r.loop);
  });

  stage.classList.add('profile-persona-stage--ready');
  if (fallback) fallback.hidden = true;
}

/* Main views and the account / custody account / position detail views show the same character, smaller (1× vs Profile's 1.5×),
   in the same corner. It reads the saved recipe; it cannot be edited there. */
const AMBIENT_SCREENS = ['overview', 'payments', 'account-details', 'investment-product-details', 'details-of-position'];

function mountAmbient() {
  const main = document.querySelector('.main-content');
  if (!main || !window.UZBankPersona) return;
  const stage = document.createElement('div');
  stage.className = 'profile-persona-stage profile-persona-stage--ambient';
  stage.setAttribute('aria-hidden', 'true');
  main.appendChild(stage);
  if (getComputedStyle(stage).display === 'none') { stage.remove(); return; } /* mobile: no room */
  /* Load after the page has settled; the figure is decoration here. */
  const go = () => mountStage(stage, { interactive: false }).catch((err) => {
    console.warn('[profile-persona-character] 3D failed to load', err);
    stage.remove();
  });
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 1500 });
  else setTimeout(go, 300);
}

function init() {
  const panel = document.getElementById('profilePanelPersona');
  const stage = panel && panel.querySelector('[data-persona-stage]');
  if (!stage) {
    if (AMBIENT_SCREENS.includes(document.body.getAttribute('data-screen'))) mountAmbient();
    return;
  }

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    /* Two frames so the panel has a size before the canvas mounts. */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mountStage(stage).catch((err) => {
        console.warn('[profile-persona-character] 3D failed to load', err);
        stage.classList.add('profile-persona-stage--error');
        const fb = stage.querySelector('.profile-persona-stage__fallback');
        if (fb) fb.textContent = '3D unavailable';
      });
    }));
  };

  if (!panel.hidden) { start(); return; }
  const observer = new MutationObserver(() => {
    if (!panel.hidden) { start(); observer.disconnect(); }
  });
  observer.observe(panel, { attributes: true, attributeFilter: ['hidden', 'class'] });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
