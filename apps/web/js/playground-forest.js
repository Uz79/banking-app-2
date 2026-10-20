/**
 * Payday run: the forest. After the savings chest the track runs between trees that are one size
 * up in every stretch (a "year"), and each tree grows from a seedling as the runner closes in.
 * KayKit Forest Nature Pack (CC0), one InstancedMesh per model and one shared, theme-recoloured
 * material (D12, D13). Growth is a function of the runner's distance, so it needs no timers and
 * runs backwards too; with reduced motion every tree is simply full size.
 */
import { THREE, preparePalette, monochromeLut } from './profile-persona-character.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm';
import { seeded } from './playground-track.js';

/* A folder of glTF files with their sidecars, resolved at runtime (the app is served as source, not from dist). */
const FOREST_DIR = new URL(/* @vite-ignore */ '../assets/3d/playground/forest/', import.meta.url).href;
const SUFFIX = '_Color1';
const MAIN = ['Tree_2_A', 'Tree_2_B', 'Tree_2_C', 'Tree_2_D', 'Tree_2_E']; /* one per stage */
const BROAD = ['Tree_1_A', 'Tree_1_A', 'Tree_1_B', 'Tree_1_B', 'Tree_1_C'];
const GROUND = ['Bush_1_A', 'Bush_2_A', 'Rock_1_A', 'Bush_2_A'];
const MODELS = [...new Set([...MAIN, ...BROAD, ...GROUND, 'Tree_4_A', 'Tree_Bare_1_A'])];

const smooth = (t) => t * t * (3 - 2 * t);

export async function createForest(track, cfg) {
  const f = cfg.forest;
  const rand = seeded(cfg.world.seed + 303);
  const range = (lo, hi) => lo + (hi - lo) * rand();
  const half = track.width / 2 + cfg.track.edge;
  const end = track.length - f.finishMargin;
  const stageLength = (end - f.from) / f.stages;
  const stageStarts = Array.from({ length: f.stages }, (_, k) => f.from + k * stageLength);

  /* ── Models ───────────────────────────────────────────────────────── */
  const loader = new GLTFLoader();
  const gltfs = await Promise.all(MODELS.map((n) => loader.loadAsync(FOREST_DIR + n + SUFFIX + '.gltf')));
  let material = null;
  gltfs[0].scene.traverse((o) => { if (o.isMesh && !material) material = o.material; });
  const palette = preparePalette(material);
  material.roughness = 0.95;

  const models = {};
  MODELS.forEach((name, i) => {
    const root = gltfs[i].scene;
    root.updateMatrixWorld(true);
    let mesh = null;
    root.traverse((o) => { if (o.isMesh && !mesh) mesh = o; });
    models[name] = { geometry: mesh.geometry, local: mesh.matrixWorld.clone(), entries: [] };
  });

  /* ── Placement ────────────────────────────────────────────────────── */
  const o = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
  const add = (name, s, lateral, scale, grows) => {
    track.at(s, o);
    models[name].entries.push({
      s, grows, scale,
      x: o.p.x + o.r.x * lateral, z: o.p.z + o.r.z * lateral,
      yaw: rand() * Math.PI * 2,
      g: -1,
    });
  };
  const stageOf = (s) => Math.min(f.stages - 1, Math.max(0, Math.floor((s - f.from) / stageLength)));

  for (const side of [-1, 1]) {
    f.rows.forEach((row, ri) => {
      for (let s = f.from - 6 + rand() * row.every; s < end + 8; s += row.every * range(0.75, 1.3)) {
        const stage = stageOf(s);
        const lateral = side * (half + range(row.near, row.far));
        /* The near row is the Tree_2 series; the far row mixes the broad series with a few tall ones. */
        const name = ri === 0 ? MAIN[stage] : (rand() < 0.25 ? 'Tree_4_A' : BROAD[stage]);
        add(s < f.from ? 'Tree_Bare_1_A' : name, s, lateral, f.scale * range(0.9, 1.1), true);
      }
    });
    /* Ground cover close to the track. */
    for (let s = f.from - 10; s < end + 6; s += range(3.5, 7)) {
      add(GROUND[Math.floor(rand() * GROUND.length)], s, side * (half + range(0.8, 3.2)), f.groundScale * range(0.8, 1.25), false);
    }
  }

  /* ── Instanced meshes ─────────────────────────────────────────────── */
  const group = new THREE.Group();
  const dummy = new THREE.Object3D();
  const meshes = [];
  Object.values(models).forEach((m) => {
    if (!m.entries.length) return;
    const mesh = new THREE.InstancedMesh(m.geometry, material, m.entries.length);
    mesh.frustumCulled = false;
    meshes.push({ mesh, m });
    group.add(mesh);
  });

  function write(entry, k, mesh, local) {
    const sc = entry.scale * (entry.grows ? f.seedling + (1 - f.seedling) * entry.g : 1);
    dummy.position.set(entry.x, 0, entry.z);
    dummy.rotation.set(0, entry.yaw, 0);
    dummy.scale.setScalar(sc);
    dummy.updateMatrix();
    mesh.setMatrixAt(k, dummy.matrix.clone().multiply(local));
  }

  /* Growth follows the runner: a tree is a seedling until the runner is `growFrom` units away, full size at `growTo`. */
  function update(runnerS, still) {
    meshes.forEach(({ mesh, m }) => {
      let dirty = false;
      m.entries.forEach((e, k) => {
        const g = still || !e.grows ? 1 : smooth(Math.min(1, Math.max(0, (f.growFrom - (e.s - runnerS)) / (f.growFrom - f.growTo))));
        if (Math.abs(g - e.g) < 0.002) return;
        e.g = g;
        write(e, k, mesh, m.local);
        dirty = true;
      });
      if (dirty) mesh.instanceMatrix.needsUpdate = true;
    });
  }

  /* Ground under the trees, so they stand on something. */
  const groundMat = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
  const wide = half + 30;
  const ground = new THREE.Group();
  [[-wide, -half], [half, wide]].forEach(([a, b]) => {
    ground.add(new THREE.Mesh(track.ribbon(a, b, 0.015, f.from - 14, track.length, 4), groundMat));
  });
  group.add(ground);

  function recolour(theme, groundColour) {
    const lut = monochromeLut(theme);
    const img = new ImageData(new Uint8ClampedArray(palette.orig.data), palette.size, palette.size);
    const d = img.data;
    for (let i = 0; i < palette.L.length; i++) {
      const j = Math.max(0, Math.min(255, Math.round(palette.L[i] * 255))) * 3;
      d[i * 4] = lut[j]; d[i * 4 + 1] = lut[j + 1]; d[i * 4 + 2] = lut[j + 2];
    }
    palette.ctx.putImageData(img, 0, 0);
    palette.tex.needsUpdate = true;
    groundMat.color.copy(groundColour);
  }

  /* Stages entered between the previous and the current distance (0 is the first stretch). */
  const entered = (prevS, s) => stageStarts.map((st, k) => (prevS < st && s >= st ? k : -1)).filter((k) => k >= 0);

  update(0, false);
  return { group, update, recolour, entered, stageStarts, stages: f.stages, rate: f.rate };
}
