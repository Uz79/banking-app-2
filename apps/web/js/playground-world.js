/**
 * Payday run: the world. The town (KayKit City Builder Bits, CC0) is placed along the track,
 * one InstancedMesh per model part and one shared material, so the whole town is a few dozen
 * draw calls (D12). The shared texture goes through the theme's monochrome ramp (D13).
 * Placement is seeded, so the town is the same every run.
 */
import { THREE, preparePalette, monochromeLut } from './profile-persona-character.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm';

/* A folder of glTF files with their sidecars, resolved at runtime (the app is served as source, not from dist). */
const TOWN_DIR = new URL(/* @vite-ignore */ '../assets/3d/playground/town/', import.meta.url).href;
const BUILDINGS = ['building_A', 'building_B', 'building_C', 'building_D', 'building_E', 'building_F', 'building_G', 'building_H']
  .map((n) => n + '_withoutBase');
const MODELS = [...BUILDINGS, 'streetlight', 'bench', 'bush', 'firehydrant', 'trash_A', 'trafficlight_A', 'watertower', 'car_taxi', 'car_sedan'];
const STREET_PROPS = ['bench', 'firehydrant', 'bush', 'trash_A', 'bush'];

function seeded(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The turn about Y that takes a model's local axis (x, z) onto the direction (x, z). */
const angleOf = (x, z) => Math.atan2(x, z);
const yawFor = (axis, dir) => angleOf(dir.x, dir.z) - angleOf(axis[0], axis[1]);

export async function createTown(track, cfg) {
  const { scale, buildingFacing, town } = cfg.world;
  const rand = seeded(cfg.world.seed);
  const range = (lo, hi) => lo + (hi - lo) * rand();
  const half = track.width / 2 + cfg.track.edge;

  /* ── Models ───────────────────────────────────────────────────────── */
  const loader = new GLTFLoader();
  const gltfs = await Promise.all(MODELS.map((n) => loader.loadAsync(TOWN_DIR + n + '.gltf')));
  const material = (() => {
    let first = null;
    gltfs[0].scene.traverse((o) => { if (o.isMesh && !first) first = o.material; });
    return first;
  })();
  const palette = preparePalette(material);
  material.roughness = 0.95;

  const models = {};
  MODELS.forEach((name, i) => {
    const root = gltfs[i].scene;
    root.updateMatrixWorld(true);
    const parts = [];
    const box = new THREE.Box3();
    root.traverse((o) => {
      if (!o.isMesh) return;
      parts.push({ geometry: o.geometry, local: o.matrixWorld.clone() });
      box.expandByObject(o);
    });
    models[name] = { parts, size: box.getSize(new THREE.Vector3()), minY: box.min.y, placements: [] };
  });

  /* ── Placement ────────────────────────────────────────────────────── */
  const o = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
  const toRoad = new THREE.Vector3();
  const place = (name, s, lateral, yaw, lift = 0) => {
    track.at(s, o);
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(o.p.x + o.r.x * lateral, lift - models[name].minY * scale, o.p.z + o.r.z * lateral),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw),
      new THREE.Vector3(scale, scale, scale),
    );
    models[name].placements.push(m);
  };
  /* Yaw that turns a model's front (local axis) toward the road from the given side (-1 left, 1 right). */
  const faceRoad = (side, axis, extra = 0) => {
    toRoad.set(-side * o.r.x, 0, -side * o.r.z);
    return yawFor(axis, toRoad) + extra;
  };

  const kerb = half + town.sidewalk;
  for (const side of [-1, 1]) {
    /* Buildings, side by side behind the sidewalk. */
    let s = town.from + rand() * 3;
    while (s < town.to) {
      const name = BUILDINGS[Math.floor(rand() * BUILDINGS.length)];
      const { size } = models[name];
      const w = size.x * scale;
      const d = size.z * scale;
      const centre = s + w / 2;
      track.at(centre, o);
      place(name, centre, side * (kerb + 0.6 + d / 2), faceRoad(side, [0, 1], buildingFacing));
      s += w + range(town.gap[0], town.gap[1]);
    }
    /* Streetlights, arm over the road. */
    for (let ls = town.from + 6 + (side > 0 ? town.lampEvery / 2 : 0); ls < town.to; ls += town.lampEvery) {
      track.at(ls, o);
      place('streetlight', ls, side * (half + 0.7), faceRoad(side, [-1, 0]));
    }
    /* Street furniture on the sidewalk. */
    for (let ps = town.from + 3 + rand() * 4; ps < town.to; ps += town.propEvery * range(0.7, 1.4)) {
      const name = STREET_PROPS[Math.floor(rand() * STREET_PROPS.length)];
      track.at(ps, o);
      place(name, ps, side * (half + range(1.2, town.sidewalk - 0.8)), name === 'bench' ? faceRoad(side, [0, 1]) : rand() * Math.PI * 2);
    }
    /* A parked car now and then, along the kerb. */
    for (let cs = town.from + 20 + rand() * 20; cs < town.to - 10; cs += range(34, 60)) {
      track.at(cs, o);
      const yaw = angleOf(o.t.x, o.t.z) + (rand() < 0.5 ? 0 : Math.PI);
      place(rand() < 0.5 ? 'car_taxi' : 'car_sedan', cs, side * (half + 1.7), yaw);
    }
  }
  /* Traffic lights where the town starts, a water tower near its end. */
  for (const side of [-1, 1]) {
    track.at(town.from - 4, o);
    place('trafficlight_A', town.from - 4, side * (half + 0.8), faceRoad(side, [0, 1]));
  }
  track.at(town.to - 14, o);
  place('watertower', town.to - 14, -(kerb + 9), 0);

  /* ── Instanced meshes ─────────────────────────────────────────────── */
  const group = new THREE.Group();
  const mat = new THREE.Matrix4();
  Object.values(models).forEach(({ parts, placements }) => {
    if (!placements.length) return;
    parts.forEach(({ geometry, local }) => {
      const mesh = new THREE.InstancedMesh(geometry, material, placements.length);
      placements.forEach((p, i) => mesh.setMatrixAt(i, mat.multiplyMatrices(p, local)));
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    });
  });

  /* Sidewalks, one flat strip each side. */
  const walkMat = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
  const sidewalk = new THREE.Group();
  [[-kerb, -half], [half, kerb]].forEach(([a, b]) => {
    sidewalk.add(new THREE.Mesh(track.ribbon(a, b, 0.02, town.from - 8, Math.min(track.length, town.to + 8), 2), walkMat));
  });
  group.add(sidewalk);

  /* The shared texture through the theme's monochrome ramp. */
  function recolour(theme, ground) {
    const lut = monochromeLut(theme);
    const img = new ImageData(new Uint8ClampedArray(palette.orig.data), palette.size, palette.size);
    const d = img.data;
    for (let i = 0; i < palette.L.length; i++) {
      const j = Math.max(0, Math.min(255, Math.round(palette.L[i] * 255))) * 3;
      d[i * 4] = lut[j]; d[i * 4 + 1] = lut[j + 1]; d[i * 4 + 2] = lut[j + 2];
    }
    palette.ctx.putImageData(img, 0, 0);
    palette.tex.needsUpdate = true;
    walkMat.color.copy(ground);
  }

  return { group, recolour };
}
