/**
 * The UZ Bank assistant's helper (roadmap 9b D19): the 3D figure on its own small stage.
 * Used by the opening assistant (loaded on the panel's first open) and by the Character kit page.
 * One complete model, not a persona recipe: KayKit's Lorekeeper (Mystery Monthly Series 6, CC0) from
 * `assets/3d/kaykit-lorekeeper/lorekeeper.glb`, without his tome and staff. He is on the same Rig_Medium as the
 * persona, so its clips play on him. Lights and colour follow the theme like the persona's stage.
 */
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm';
import { THREE, readTheme, preparePalette, monochromeLut, oklchToRGB } from './profile-persona-character.js';

const MODEL = new URL('../assets/3d/kaykit-lorekeeper/lorekeeper.glb', import.meta.url).href;
const CLIPS = [
  new URL('../assets/3d/kaykit/rig-medium-general.glb', import.meta.url).href, /* Idle_A, the persona's */
  new URL('../assets/3d/kaykit/rig-medium-helper.glb', import.meta.url).href, /* Interact */
];

/* His robe, (column, row) in the texture's 8×8 grid: the one accent, like the persona's cloth. */
const ROBE = [[3, 2], [3, 3]];

/* The figure is about 2.15 high, nearly half of it head; head to waist unless the caller frames it otherwise. */
const HEAD_TO_WAIST = () => [0.5, 2.3];

/* Monochrome on the theme hue, then the robe in the accent: the persona's recolour on one texture. */
function recolour(p, theme) {
  const lut = monochromeLut(theme);
  const img = new ImageData(new Uint8ClampedArray(p.orig.data), p.size, p.size);
  const d = img.data;
  for (let i = 0; i < p.L.length; i++) {
    const j = Math.max(0, Math.min(255, Math.round(p.L[i] * 255))) * 3;
    d[i * 4] = lut[j]; d[i * 4 + 1] = lut[j + 1]; d[i * 4 + 2] = lut[j + 2];
  }
  const cell = p.size / 8, w = p.size;
  let sum = 0, n = 0;
  for (const [cx, cy] of ROBE)
    for (let y = cy * cell; y < (cy + 1) * cell; y += 4)
      for (let x = cx * cell; x < (cx + 1) * cell; x += 4) { sum += p.L[y * w + x]; n++; }
  const shift = theme.anchorL - sum / n;
  for (const [cx, cy] of ROBE)
    for (let y = cy * cell; y < (cy + 1) * cell; y++)
      for (let x = cx * cell; x < (cx + 1) * cell; x++) {
        const i = y * w + x;
        const L = Math.min(0.97, Math.max(0.12, p.L[i] + shift));
        const [r, g, b] = oklchToRGB(L, 0.22 * (1 - L), theme.accentHue);
        d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b;
      }
  p.ctx.putImageData(img, 0, 0);
  p.tex.needsUpdate = true;
}

/**
 * Mounts the helper into `box` (sized by CSS) and returns `{ wake, wave }`.
 * `active()` says whether to keep drawing (the loop stops when it is false; `wake()` starts it again).
 * `frame(height)` returns the [low, high] heights in metres to fit into the box.
 */
export async function mountHelper(box, {
  reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  active = () => true,
  frame = HEAD_TO_WAIST,
} = {}) {
  const loader = new GLTFLoader();
  const [model, ...clipSets] = await Promise.all([MODEL, ...CLIPS].map((u) => loader.loadAsync(u)));

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  const canvas = renderer.domElement;
  canvas.className = 'assistant__canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(3, 5.5, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(-3, 3, -4);
  scene.add(hemi, key, rim);

  /* One texture for every part; the glasses keep their own see-through material. */
  let palette = null;
  model.scene.traverse((o) => {
    if (!o.isSkinnedMesh || !o.material.map) return;
    if (!palette) palette = preparePalette(o.material);
    else o.material.map = palette.tex;
  });
  const turn = new THREE.Group();
  turn.rotation.y = -0.25; /* turned a little toward the conversation on its left */
  turn.add(model.scene);
  scene.add(turn);

  const clips = {};
  clipSets.forEach((g) => g.animations.forEach((c) => { clips[c.name] = c; }));
  const mixer = new THREE.AnimationMixer(model.scene);
  const idle = mixer.clipAction(clips.Idle_A).play();
  mixer.update(0.4);

  /* The persona stage's light and colour, read from the theme. */
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
    recolour(palette, theme);
  }
  new MutationObserver(() => requestAnimationFrame(applyTheme))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });
  applyTheme();

  const aim = new THREE.Vector3(0.35, 0.12, 1).normalize();
  function resize() {
    const w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const [lo, hi] = frame(h);
    const dist = ((hi - lo) / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.08;
    const target = new THREE.Vector3(0, (lo + hi) / 2, 0);
    camera.position.copy(target).addScaledVector(aim, dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(box);

  /* The clip stays still with reduced motion. */
  const clock = new THREE.Clock();
  let running = false;
  function tick() {
    if (!active()) { running = false; return; }
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reduced()) mixer.update(dt);
    renderer.render(scene, camera);
  }

  /* An answer arrived: Interact once over the idle, then a cross-fade back (open question 2). */
  const once = mixer.clipAction(clips.Interact);
  once.setLoop(THREE.LoopOnce, 1);
  once.clampWhenFinished = true;
  mixer.addEventListener('finished', (e) => {
    if (e.action !== once) return;
    idle.reset().setEffectiveWeight(1).play();
    idle.crossFadeFrom(once, 0.3, false);
  });

  box.append(canvas);
  const helper = {
    wake() {
      if (running) return;
      running = true;
      clock.getDelta();
      resize();
      requestAnimationFrame(tick);
    },
    wave() {
      if (reduced() || once.isRunning()) return;
      once.reset().setEffectiveWeight(1).play();
      once.crossFadeFrom(idle, 0.2, false);
    },
  };
  helper.wake();
  return helper;
}
