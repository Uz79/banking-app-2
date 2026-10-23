/**
 * Fridge advisor: the 3D scene. The kit fridge (Kenney Furniture Kit, CC0) with its two doors, the
 * persona beside it, in the active theme (D5). Shelves, drawers and food are added by later task groups.
 * The theme comes from the same helpers the Playground world uses; the scene only draws when something moved.
 */
import { THREE, createFigure, readTheme, cssColor, preparePalette, monochromeLut } from './profile-persona-character.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm';

const FRIDGE_URL = new URL(/* @vite-ignore */ '../assets/3d/fridge/furniture/kitchenFridge.glb', import.meta.url).href;
const FOOD_DIR = new URL(/* @vite-ignore */ '../assets/3d/fridge/food/', import.meta.url).href;

export async function createFridgeScene(host, cfg, { reduced }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  let dirty = true; /* something changed that a still frame has to show */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(cfg.camera.fov, 1, 0.1, 100);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(0.8, 7, 2.5); /* high, so the shadows stay small and under the fridge */
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -1, near: 0.5, far: 14 });
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(-3, 3, -4);
  scene.add(hemi, key, rim);

  /* A floor that only catches the shadows of the fridge and the figure. */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.25 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ── The fridge ───────────────────────────────────────────────────── */
  const loader = new GLTFLoader();
  const foodNames = [...new Set(Object.values(cfg.food.shelves).flatMap((sh) => [...sh.tall, ...sh.low]))];
  const [gltf, ...foodGltfs] = await Promise.all([
    loader.loadAsync(FRIDGE_URL),
    ...foodNames.map((n) => loader.loadAsync(FOOD_DIR + n + '.glb').catch((err) => { console.warn('[fridge-advisor] food model failed', n, err); return null; })),
  ]);
  const fridge = new THREE.Group();
  const model = gltf.scene.children[0];
  model.position.set(-0.215, 0, 0); /* centre the body on x = 0 */
  const doors = { freezer: model.getObjectByName('doorFreezer'), fridge: model.getObjectByName('doorFridge') };
  const mats = {};
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    mats[o.material.name] = o.material;
  });
  /* Shelves and drawers: simple boxes in the theme colours, in the kit's own units, so they sit in its cavity (D13). */
  const boxMats = { board: new THREE.MeshStandardMaterial({ roughness: 0.9 }) };
  /* The active compartment takes an accent tint (D26), so its shelves, drawers and inner wall panels have materials of their own. */
  const mk = () => new THREE.MeshStandardMaterial({ roughness: 0.9 });
  const tintMats = { main: { shelf: mk(), wall: mk() }, reserve: { drawer: mk() }, freezer: { wall: mk() } };
  tintMats.main.wall.transparent = true; tintMats.freezer.wall.transparent = true;
  const interior = new THREE.Group();
  /* The drawers (and what is in them) stand out while the fridge door is open and slide in when it shuts. */
  const drawerGroup = new THREE.Group();
  const box = (mat, x0, x1, y0, y1, z0, z1, parent = interior) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
  };
  {
    const { x: [x0, x1], z: [z0, z1], main, freezer, board, drawers } = cfg.interior;
    const shelf = (y) => box(boxMats.board, x0, x1, y - board, y, z0, z1);
    const shelfM = (y) => box(tintMats.main.shelf, x0, x1, y - board, y, z0, z1);
    main.boards.forEach(shelfM);
    freezer.boards.forEach(shelf);
    shelfM(main.drawerTop);
    /* Inner wall panels (back and sides), a hair inside the kit's cavity: its walls share one material with the fridge body. */
    const t = 0.002;
    const walls = (mat, y0, y1) => {
      box(mat, x0, x1, y0, y1, z0, z0 + t); box(mat, x0, x0 + t, y0, y1, z0, z1); box(mat, x1 - t, x1, y0, y1, z0, z1);
    };
    walls(tintMats.main.wall, main.y[0], main.y[1]);
    walls(tintMats.freezer.wall, freezer.y[0], freezer.y[1]);
    /* Two drawers side by side under the lowest shelf: an open tray each (floor, back, sides, a low front). */
    const half = (x1 - x0 - drawers.gap) / 2;
    [[x0, x0 + half], [x1 - half, x1]].forEach(([a, b]) => {
      const bottom = main.y[0], top = main.drawerTop - board, w = drawers.wall, p = drawers.pull;
      box(tintMats.reserve.drawer, a, b, bottom, bottom + w, z0 + p, z1 + p, drawerGroup);
      box(tintMats.reserve.drawer, a, b, bottom, top, z0 + p, z0 + p + w, drawerGroup);
      box(tintMats.reserve.drawer, a, a + w, bottom, top, z0 + p, z1 + p, drawerGroup);
      box(tintMats.reserve.drawer, b - w, b, bottom, top, z0 + p, z1 + p, drawerGroup);
      box(tintMats.reserve.drawer, a, b, bottom, bottom + drawers.front, z1 + p - w, z1 + p, drawerGroup);
    });
  }
  model.add(interior, drawerGroup);

  /* ── Food: fixed slots, each with a model fitted to it (D11, D12) ──── */
  /* All food models share one texture (the kit's colour map), recoloured to the theme's ramp like the Playground world. */
  const foodModels = {};
  foodNames.forEach((n, i) => { if (foodGltfs[i]) foodModels[n] = foodGltfs[i].scene; });
  let foodMaterial = null;
  Object.values(foodModels).forEach((root) => root.traverse((o) => { if (o.isMesh && !foodMaterial) foodMaterial = o.material; }));
  const foodPalette = foodMaterial ? preparePalette(foodMaterial) : null;
  Object.values(foodModels).forEach((root) => root.traverse((o) => { if (o.isMesh) { o.material = foodMaterial; o.castShadow = true; o.receiveShadow = true; } }));

  /* The floor of a compartment: x and z range, the board's height and the free height above it. */
  function areaOf(spec) {
    const { x: [x0, x1], z: [z0, z1], main, freezer, board, drawers } = cfg.interior;
    if (spec.drawer !== undefined) {
      const half = (x1 - x0 - drawers.gap) / 2, wall = drawers.wall;
      const a = spec.drawer === 0 ? x0 : x1 - half;
      const y = main.y[0] + wall;
      return { x0: a + wall, x1: a + half - wall, z0: z0 + wall + drawers.pull, z1: z1 - wall + drawers.pull, y, h: main.drawerTop - board - y };
    }
    if (spec.freezer) return { x0: x0 + 0.005, x1: x1 - 0.005, z0: z0 + 0.01, z1: z1 - 0.01, y: freezer.y[0], h: freezer.y[1] - freezer.y[0] - 0.005 };
    return { x0, x1, z0: z0 + 0.01, z1: z1 - 0.01, y: spec.surface, h: spec.h };
  }

  /* Small seeded random numbers: the same arrangement on every visit. */
  function seeded(text) {
    let h = 1779033703 ^ text.length;
    for (let i = 0; i < text.length; i++) { h = Math.imul(h ^ text.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    let a = h >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  /* A model for a row: the orientation that would grow largest in the compartment's `ref` slot, at that size, shrunk only
     to the row's depth and height. Returns the object with its footprint (width, depth, height). */
  const orient = {};
  function makeItem(name, ref, capD, capH) {
    const obj = foodModels[name].clone(true);
    if (!orient[name]) {
      const tries = [[0, 0, 0], [0, Math.PI / 2, 0]];
      if (cfg.food.lay.includes(name)) tries.push([0, 0, Math.PI / 2], [0, Math.PI / 2, Math.PI / 2]);
      const box = new THREE.Box3();
      orient[name] = tries.map((r) => {
        obj.rotation.set(...r); obj.scale.setScalar(1); obj.updateMatrixWorld(true);
        return { r, size: box.setFromObject(obj).getSize(new THREE.Vector3()) };
      });
    }
    let best = null;
    orient[name].forEach((o) => {
      const fit = Math.min(ref.w * 0.92 / o.size.x, ref.d * 0.92 / o.size.z, ref.h / o.size.y);
      if (!best || fit > best.fit) best = { o, fit };
    });
    const { o } = best;
    const scale = Math.min(best.fit, capD / o.size.z, capH / o.size.y);
    obj.rotation.set(...o.r);
    obj.scale.setScalar(scale);
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj);
    obj.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
    const holder = new THREE.Group();
    holder.add(obj);
    return { holder, w: o.size.x * scale, d: o.size.z * scale, h: o.size.y * scale };
  }

  /* Pack a compartment: rows from back to front, each filled left to right with items that fit, tight but not touching. */
  function pack(key, spec) {
    const area = areaOf(spec), rand = seeded(key), f = cfg.food;
    const pitch = (area.z1 - area.z0) / spec.rows;
    const items = [];
    for (let r = 0; r < spec.rows; r++) {
      const front = spec.rows > 1 ? r / (spec.rows - 1) : 0;
      const capH = area.h * (1 - f.heightByRow * front);
      const pool = (r === 0 ? spec.tall : r === spec.rows - 1 ? spec.low : [...spec.low, ...spec.tall]).filter((n) => foodModels[n]);
      if (!pool.length) continue;
      /* A seeded shuffle, so neighbours differ. */
      const order = pool.map((n) => [rand(), n]).sort((a, b) => a[0] - b[0]).map((e) => e[1]);
      const row = [];
      let x = area.x0, k = 0, misses = 0;
      while (misses < order.length) {
        const it = makeItem(order[k++ % order.length], spec.ref, pitch * 1.3, capH);
        if (x + it.w > area.x1) { misses++; continue; }
        misses = 0;
        row.push({ ...it, x: x + it.w / 2 });
        x += it.w + f.gap;
      }
      if (!row.length) continue;
      const slack = Math.max(0, area.x1 - x + f.gap) / 2; /* centre the row */
      row.forEach((it) => {
        const holder = it.holder;
        holder.position.set(it.x + slack + (rand() - 0.5) * 2 * f.jitterX, area.y, area.z0 + pitch * (r + 0.5) + (rand() - 0.5) * 2 * f.jitterZ);
        holder.rotation.y = (rand() - 0.5) * 2 * f.jitterYaw;
        holder.scale.setScalar(0.0001);
        holder.visible = false;
        (spec.drawer !== undefined ? drawerGroup : model).add(holder);
        items.push({ holder, on: false, tw: null });
      });
    }
    return items;
  }

  const fills = {};
  Object.entries(cfg.food.shelves).forEach(([key, spec]) => { fills[key] = pack(key, spec); });

  /* Show `count` items of a compartment, always the first ones, so adding never reshuffles (D11). */
  function setFill(key, count) {
    (fills[key] || []).forEach((item, i) => {
      const on = i < count;
      if (on === item.on) return;
      item.on = on;
      cancel(item.tw);
      const start = item.holder.scale.x, end = on ? 1 : 0.0001;
      if (on) item.holder.visible = true;
      item.tw = tween(cfg.food.appear, (k) => { item.holder.scale.setScalar(start + (end - start) * k); },
        () => { if (!item.on) item.holder.visible = false; });
      if (!item.tw && !on) item.holder.visible = false;
    });
    dirty = true;
  }
  const capacity = (key) => (fills[key] || []).length;

  /* The compartment tint (replaces the outline): how much of the accent each compartment has, 0 to 1. */
  const tintAmt = { main: 0, reserve: 0, freezer: 0 };
  let tintBase = {}, tintColour = new THREE.Color();
  function paintTint() {
    const mix = (m, base, amt) => m.color.copy(base).lerp(tintColour, amt);
    mix(tintMats.main.shelf, tintBase.board, tintAmt.main);
    mix(tintMats.reserve.drawer, tintBase.drawer, tintAmt.reserve);
    tintMats.main.wall.color.copy(tintColour); tintMats.main.wall.opacity = tintAmt.main;
    tintMats.freezer.wall.color.copy(tintColour); tintMats.freezer.wall.opacity = tintAmt.freezer;
    tintMats.main.wall.visible = tintAmt.main > 0.001; tintMats.freezer.wall.visible = tintAmt.freezer > 0.001;
    dirty = true;
  }
  /* The frost veil of the cooling moment: a faint sheet over the closed doors (D5, D7). */
  const frostMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const frost = new THREE.Mesh(new THREE.PlaneGeometry(0.43, 0.92), frostMat);
  frost.position.set(0.215, 0.46, 0.02);
  model.add(frost);
  /* The fridge light: the cavity would otherwise sit in the shadow of its own shell. */
  const fridgeLight = new THREE.PointLight(0xffffff, cfg.light.intensity, 0, 2);
  fridgeLight.position.set(...cfg.light.main);
  model.add(fridgeLight);
  const freezerLight = new THREE.PointLight(0xffffff, cfg.light.intensity * 0.6, 0, 2);
  freezerLight.position.set(...cfg.light.freezer);
  model.add(freezerLight);
  fridge.add(model);
  fridge.scale.setScalar(cfg.fridge.scale);
  fridge.position.set(cfg.fridge.x, 0, 0);
  scene.add(fridge);

  /* Doors swing about the vertical axis through their hinge (the door node's origin). */
  const angle = { freezer: 0, fridge: 0 };
  drawerGroup.position.z = -cfg.interior.drawers.pull; /* the fridge starts shut */
  function setDoor(name, value) {
    angle[name] = value;
    doors[name].rotation.y = -value;
    if (name === 'fridge') drawerGroup.position.z = -cfg.interior.drawers.pull * (1 - value / cfg.doors.open);
    dirty = true;
  }

  /* ── The persona, standing beside the fridge ──────────────────────── */
  const figure = await createFigure({ reduced });
  const persona = (window.UZBankPersona && window.UZBankPersona.read()) || null;
  figure.setRecipe((persona && persona.recipe) || { outfit: 'barbarian', head: 'rogue', headwear: 'none', back: 'none' }, false);
  figure.actor.position.set(cfg.figure.x, 0, cfg.figure.z);
  figure.actor.rotation.y = cfg.figure.yaw;
  scene.add(figure.actor);
  figure.setLoop(cfg.figure.idle);
  figure.mixer.update(0.4);

  /* ── Theme ────────────────────────────────────────────────────────── */
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
    const fg = colour('--color-fg');
    const mix = (amount) => bg.clone().lerp(fg, amount);
    /* The kit's four materials, mapped to the theme's neutrals. */
    if (mats.metalLight) mats.metalLight.color.copy(mix(theme.dark ? 0.3 : 0.15));
    if (mats.metalDark) mats.metalDark.color.copy(mix(theme.dark ? 0.22 : 0.3));
    if (mats.metal) mats.metal.color.copy(mix(0.45));
    if (mats.glass) mats.glass.color.copy(mix(0.3));
    tintColour = bg.clone().lerp(colour('--color-fg-interactive'), cfg.tint[theme.dark ? 'dark' : 'light']);
    frostMat.color.copy(fg);
    boxMats.board.color.copy(mix(theme.dark ? 0.55 : 0.45));
    tintBase = { board: mix(theme.dark ? 0.55 : 0.45), drawer: mix(theme.dark ? 0.4 : 0.3) };
    paintTint();
    figure.recolour(theme);
    if (foodPalette) {
      const lut = monochromeLut(theme);
      const img = new ImageData(new Uint8ClampedArray(foodPalette.orig.data), foodPalette.size, foodPalette.size);
      const d = img.data;
      for (let i = 0; i < foodPalette.L.length; i++) {
        const j = Math.max(0, Math.min(255, Math.round(foodPalette.L[i] * 255))) * 3;
        d[i * 4] = lut[j]; d[i * 4 + 1] = lut[j + 1]; d[i * 4 + 2] = lut[j + 2];
      }
      foodPalette.ctx.putImageData(img, 0, 0);
      foodPalette.tex.needsUpdate = true;
    }
  }
  applyTheme(true);
  new MutationObserver(() => requestAnimationFrame(() => applyTheme(false)))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });

  /* ── Camera ───────────────────────────────────────────────────────── */
  const look = new THREE.Vector3();
  const cam = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  let pose = cfg.camera.pose.intro;
  /* The pose, backed away along the line of sight until its `width` fits the stage. */
  function target(p, out) {
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    out.look.set(...p.look);
    out.pos.set(...p.pos).sub(out.look);
    const fit = Math.max(p.width / (2 * tanHalf * camera.aspect), p.height ? p.height / (2 * tanHalf) : 0);
    out.pos.setLength(p.fill ? fit : Math.max(out.pos.length(), fit)).add(out.look);
    return out;
  }
  function applyCamera() {
    camera.position.copy(cam.pos);
    look.copy(cam.look);
    camera.lookAt(look);
    dirty = true;
  }

  /* ── Motion: one small tween list (camera glide, door swing, tint fade) ── */
  /* easeOutQuart stands in for the app's ease-out curve; everything is instant with reduced motion (D15). */
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  const tweens = [];
  /* Returns the running tween (or null when it ran at once), so a newer one can replace it. */
  function tween(duration, apply, done) {
    if (reduced() || duration <= 0) { apply(1); dirty = true; if (done) done(); return null; }
    const tw = { t: 0, duration, apply, done };
    tweens.push(tw);
    return tw;
  }
  function cancel(tw) {
    const i = tw ? tweens.indexOf(tw) : -1;
    if (i >= 0) tweens.splice(i, 1);
  }
  function runTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      tw.t += dt;
      const p = Math.min(1, tw.t / tw.duration);
      tw.apply(ease(p));
      dirty = true;
      if (p >= 1) { tweens.splice(tweens.indexOf(tw), 1); if (tw.done) tw.done(); }
    }
  }

  const from = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  const to = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  let cameraTween = null;
  function glideTo(name) {
    pose = cfg.camera.pose[name];
    cancel(cameraTween);
    from.pos.copy(cam.pos); from.look.copy(cam.look);
    target(pose, to);
    cameraTween = tween(cfg.motion.glide, (k) => {
      cam.pos.lerpVectors(from.pos, to.pos, k);
      cam.look.lerpVectors(from.look, to.look, k);
      applyCamera();
    });
  }

  const doorTween = { fridge: null, freezer: null };
  function swingDoor(name, open, done) {
    const end = open ? cfg.doors.open : 0;
    cancel(doorTween[name]);
    const start = angle[name];
    if (start === end) { if (done) done(); return; }
    doorTween[name] = tween(cfg.doors.swing, (k) => setDoor(name, start + (end - start) * k), done);
  }

  /* The cooling moment: a frost veil rises and fades, then `done`. */
  let coolTween = null;
  function cool(done) {
    cancel(coolTween);
    coolTween = tween(cfg.motion.cool, (k) => { frostMat.opacity = Math.sin(Math.PI * k) * cfg.motion.frost; }, () => { frostMat.opacity = 0; if (done) done(); });
  }

  let outlineName = null;
  let outlineTween = null;
  function setOutline(name) {
    if (name === outlineName) return;
    outlineName = name;
    cancel(outlineTween);
    const start = { ...tintAmt };
    outlineTween = tween(cfg.motion.outline, (k) => {
      Object.keys(tintAmt).forEach((c) => { tintAmt[c] = start[c] + ((c === name ? 1 : 0) - start[c]) * k; });
      paintTint();
    });
  }

  /* Go to a stage: the camera glides, doors swing, the tint moves. */
  /* The persona stands next to the closed fridge on the intro; on the tour and the sliders the fridge fills the stage and it steps out. */
  let figureTween = null;
  function showFigure(on) {
    cancel(figureTween);
    if (on) { figure.actor.visible = true; dirty = true; return; }
    figureTween = tween(cfg.motion.glide, () => {}, () => { figure.actor.visible = false; dirty = true; });
    if (!figureTween) figure.actor.visible = false;
  }

  /* `seq` lets a newer stage cancel what an older one still had queued (the cooling sequence). */
  let seq = 0;
  function goTo(step) {
    const mine = ++seq;
    showFigure(step.stage === 'intro');
    glideTo(step.stage);
    /* Arriving at the result with the fridge open: the door shuts, a short cooling moment, then the freezer opens (D4, D15). */
    if (step.cool && angle.fridge > 0 && !reduced()) {
      setOutline(null);
      swingDoor('fridge', false, () => {
        if (mine !== seq) return;
        cool(() => {
          if (mine !== seq) return;
          swingDoor('freezer', true);
          setOutline(step.outline);
        });
      });
      return;
    }
    cancel(coolTween);
    frostMat.opacity = 0;
    ['fridge', 'freezer'].forEach((d) => swingDoor(d, step.doors.includes(d)));
    setOutline(step.outline);
  }

  /* ── Size and loop ────────────────────────────────────────────────── */
  function resize() {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.9 ? cfg.camera.fovNarrow : cfg.camera.fov;
    camera.updateProjectionMatrix();
    if (!tweens.length) { target(pose, cam); applyCamera(); }
  }
  new ResizeObserver(resize).observe(host);
  resize();
  target(pose, cam);
  applyCamera();

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (document.hidden) return;
    figure.update(dt);
    runTweens(dt);
    if (dirty || !reduced()) {
      dirty = false;
      renderer.render(scene, camera);
    }
  }
  requestAnimationFrame(frame);

  window.addEventListener('pagehide', (e) => {
    if (e.persisted) return;
    renderer.dispose();
    renderer.forceContextLoss();
  });

  return { setDoor, goTo, setFill, capacity, scene, camera, fridge, figure, doors, redraw: () => { dirty = true; } };
}
