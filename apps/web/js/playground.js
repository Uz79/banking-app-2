/**
 * Payday run: page script.
 *
 * The page is opened as a sheet on the Design system hub (js/playground-sheet.js puts it in an
 * iframe and slides it up like the flow screens). Embedded, the close button asks the hub to
 * slide it down again; opened directly, it is a plain link back to the hub.
 */
import { THREE, createFigure, readTheme } from './profile-persona-character.js';

const embedded = window.parent !== window;
const closeButton = document.querySelector('[data-playground-close]');

if (embedded && closeButton) {
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.parent.postMessage({ type: 'uzbank:playground-close' }, window.location.origin);
  });
}

/* ── Stage: the persona character on a themed stage ───────────────────────────
   Group 2 of the plan: the figure idles in its own scene. The track, camera and
   game come in the next groups. The character comes from js/profile-persona-character.js
   (createFigure), the recipe from User Type (UZBankPersona, js/profile-persona.js). */

const stage = document.querySelector('[data-playground-stage]');

async function mountStage(host) {
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(2.9, 2.2, 6.6);
  camera.lookAt(0, 1.1, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(3, 5.5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3.5, bottom: -2 });
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(-3, 3, -4);
  scene.add(hemi, key, rim);

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.2 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(7, 64), shadowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const figure = await createFigure({ reduced });
  figure.actor.rotation.y = 0.35 - Math.PI / 6;
  scene.add(figure.actor);

  const persona = (window.UZBankPersona && window.UZBankPersona.read()) || null;
  const recipe = (persona && persona.recipe) || { outfit: 'barbarian', head: 'rogue', headwear: 'none', back: 'none' };
  figure.setRecipe(recipe, false);
  figure.setLoop('Idle_A');
  figure.mixer.update(0.4);

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
    figure.recolour(theme);
  }
  applyTheme(true);
  new MutationObserver(() => requestAnimationFrame(() => applyTheme(false)))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.55 ? 38 : 30;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) { clock.getDelta(); return; }
    figure.update(Math.min(clock.getDelta(), 0.05));
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

if (stage) {
  mountStage(stage).catch((err) => console.warn('[playground] 3D failed to load', err));
}
