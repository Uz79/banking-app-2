/**
 * The UZ Bank assistant's helper (roadmap 9b D11, D12, D18): the 3D figure on its own small stage.
 * Used by the opening assistant (loaded on the panel's first open) and by the Character kit page.
 * Its own recipe, which no User Type produces: the Mage's head and outfit from `assets/3d/kaykit/helper.glb`,
 * nothing on the head or back. Lights and colour follow the theme like the persona's stage.
 */
import { THREE, createFigure, readTheme } from './profile-persona-character.js';

export const HELPER = { outfit: 'mage', head: 'mage', headwear: 'none', back: 'none' };

/* The figure is about 2.15 high without a hat; head to waist unless the caller frames it otherwise. */
const HEAD_TO_WAIST = () => [0.6, 2.2];

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

  const figure = await createFigure({ reduced, characters: ['helper'], clipFiles: ['animGeneral', 'animHelper'] });
  const turn = new THREE.Group();
  turn.rotation.y = -0.25; /* turned a little toward the conversation on its left */
  turn.add(figure.actor);
  scene.add(turn);
  figure.setRecipe(HELPER, false);
  figure.setLoop('Idle_A');
  figure.mixer.update(0.4);

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
    figure.recolour(theme);
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

  const clock = new THREE.Clock();
  let running = false;
  function tick() {
    if (!active()) { running = false; return; }
    requestAnimationFrame(tick);
    figure.update(Math.min(clock.getDelta(), 0.05));
    renderer.render(scene, camera);
  }

  box.append(canvas);
  const helper = {
    wake() {
      if (running) return;
      running = true;
      clock.getDelta();
      resize();
      requestAnimationFrame(tick);
    },
    /* An answer arrived: the helper gestures once (open question 2: Interact, the one clip in its file). */
    wave() { figure.playOnce('Interact'); },
  };
  helper.wake();
  return helper;
}
