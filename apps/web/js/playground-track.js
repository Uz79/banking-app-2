/**
 * Payday run: the track. A curve through a few control points, sampled once into a lookup
 * table by distance, so the runner is just (distance s, sideways x). No physics, no raycasts
 * (D11). `at(s)` gives the centre point, heading and right-hand side at distance s.
 */
import { THREE } from './profile-persona-character.js';

/* A small seeded random generator, so placement is the same every run. */
export function seeded(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createTrack(cfg) {
  const { width, spacing, sway, step } = cfg;
  const points = sway.map((x, i) => new THREE.Vector3(x, 0, -i * spacing));
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  curve.arcLengthDivisions = 2000;
  const length = curve.getLength();
  const n = Math.ceil(length / step) + 1;

  const pos = new Float32Array(n * 3);
  const tan = new Float32Array(n * 3);
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const u = Math.min(1, (i * step) / length);
    curve.getPointAt(u, p);
    curve.getTangentAt(u, t);
    t.y = 0;
    t.normalize();
    pos.set([p.x, 0, p.z], i * 3);
    tan.set([t.x, 0, t.z], i * 3);
  }

  const UP = new THREE.Vector3(0, 1, 0);
  const out = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };

  /* Centre point, heading and right-hand side at distance s (clamped to the track). */
  function at(s, o = out) {
    const f = Math.min(Math.max(s, 0), length) / step;
    const i = Math.min(Math.floor(f), n - 2);
    const k = f - i;
    const a = i * 3, b = a + 3;
    o.p.set(pos[a] + (pos[b] - pos[a]) * k, 0, pos[a + 2] + (pos[b + 2] - pos[a + 2]) * k);
    o.t.set(tan[a] + (tan[b] - tan[a]) * k, 0, tan[a + 2] + (tan[b + 2] - tan[a + 2]) * k).normalize();
    o.r.crossVectors(o.t, UP).normalize();
    return o;
  }

  /* A flat strip along the track between two sideways offsets, from distance s0 to s1. */
  function ribbon(left, right, y, s0 = 0, s1 = length, stride = 1) {
    const count = Math.max(2, Math.ceil((s1 - s0) / stride) + 1);
    const verts = new Float32Array(count * 6);
    const idx = [];
    const o = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
    for (let i = 0; i < count; i++) {
      at(s0 + ((s1 - s0) * i) / (count - 1), o);
      verts.set([o.p.x + o.r.x * left, y, o.p.z + o.r.z * left, o.p.x + o.r.x * right, y, o.p.z + o.r.z * right], i * 6);
      if (i < count - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }

  return { length, width, at, ribbon };
}
