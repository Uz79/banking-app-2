/**
 * Payday run: the coins. The salary is split over a fixed number of coins laid out along the
 * town in short lines, waves and zigzags; running through one collects it (distance and sideways
 * offset against a flat array, no physics, D11). One InstancedMesh for the coins on the road and
 * one for the burst at the start (D12).
 */
import { THREE } from './profile-persona-character.js';
import { seeded } from './playground-track.js';

export function createCoins(track, cfg) {
  const c = cfg.coins;
  const rand = seeded(cfg.world.seed + 101);

  /* Layout: runs of 8 to 11 coins, a short gap between runs, until the count is reached. */
  const items = [];
  let s = c.from;
  while (items.length < c.count && s < c.to) {
    const n = 8 + Math.floor(rand() * 4);
    const kind = Math.floor(rand() * 3);
    const base = (rand() * 2 - 1) * c.lateral * 0.5;
    const phase = rand() * Math.PI * 2;
    for (let i = 0; i < n && items.length < c.count && s < c.to; i++, s += c.spacing) {
      const x = kind === 0 ? base : kind === 1 ? Math.sin(i * 0.7 + phase) * c.lateral : (i % 4 < 2 ? -1 : 1) * c.lateral * 0.75;
      items.push({ s, x });
    }
    s += c.gap;
  }
  const count = items.length;
  const value = cfg.money.salary / count;

  const geometry = new THREE.CylinderGeometry(c.radius, c.radius, c.thickness, 24);
  geometry.rotateX(Math.PI / 2); /* the face looks along the track */
  const material = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;

  const o = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
  const base = items.map((it) => {
    track.at(it.s, o);
    return { x: o.p.x + o.r.x * it.x, z: o.p.z + o.r.z * it.x, yaw: Math.atan2(o.t.x, o.t.z) };
  });
  const collected = new Array(count).fill(false);
  const dummy = new THREE.Object3D();

  function write(time, still) {
    for (let i = 0; i < count; i++) {
      if (collected[i]) { dummy.scale.setScalar(0); dummy.position.set(0, -50, 0); }
      else {
        const b = base[i];
        dummy.scale.setScalar(1);
        dummy.position.set(b.x, c.height + (still ? 0 : Math.sin(time * 3 + i) * 0.12), b.z);
        dummy.rotation.set(0, b.yaw + (still ? 0 : time * c.spin + i * 0.5), 0);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  /* Collect every coin within reach of the runner (distance s, sideways offset x). Returns how many. */
  function collect(rs, rx) {
    let got = 0;
    for (let i = 0; i < count; i++) {
      if (collected[i]) continue;
      if (Math.abs(items[i].s - rs) < c.reach.along && Math.abs(items[i].x - rx) < c.reach.across) {
        collected[i] = true;
        got++;
      }
    }
    return got;
  }

  /* ── The burst at the start: decoration only ─────────────────────── */
  const b = cfg.burst;
  const burstMesh = new THREE.InstancedMesh(geometry, material, b.count);
  burstMesh.frustumCulled = false;
  burstMesh.visible = false;
  const parts = Array.from({ length: b.count }, () => ({ pos: new THREE.Vector3(), vel: new THREE.Vector3(), spin: 0 }));
  let burstT = -1;

  function burst(origin, tangent, right) {
    parts.forEach((p) => {
      const forward = b.out[0] + Math.random() * (b.out[1] - b.out[0]);
      const side = (Math.random() - 0.5) * (b.out[1] + b.out[0]);
      p.pos.set(origin.x, 1.3, origin.z);
      p.vel.set(
        tangent.x * forward + right.x * side,
        b.up[0] + Math.random() * (b.up[1] - b.up[0]),
        tangent.z * forward + right.z * side,
      );
      p.spin = (Math.random() - 0.5) * 14;
    });
    burstT = 0;
    burstMesh.visible = true;
  }

  function update(dt, time, still) {
    write(time, still);
    if (burstT < 0) return;
    burstT += dt;
    if (burstT >= b.life) { burstT = -1; burstMesh.visible = false; return; }
    const fade = Math.min(1, (b.life - burstT) / (b.life * 0.3));
    parts.forEach((p, i) => {
      p.vel.y -= b.gravity * dt;
      p.pos.addScaledVector(p.vel, dt);
      dummy.position.copy(p.pos);
      dummy.rotation.set(burstT * p.spin, burstT * p.spin * 0.7, 0);
      dummy.scale.setScalar(b.size / c.radius * fade);
      dummy.updateMatrix();
      burstMesh.setMatrixAt(i, dummy.matrix);
    });
    burstMesh.instanceMatrix.needsUpdate = true;
  }

  function reset() {
    collected.fill(false);
    burstT = -1;
    burstMesh.visible = false;
  }

  function recolour(colour) {
    material.color.copy(colour);
    material.emissive.copy(colour);
    material.emissiveIntensity = 0.22;
  }

  const group = new THREE.Group();
  group.add(mesh, burstMesh);
  return { group, count, value, collect, update, burst, reset, recolour };
}
