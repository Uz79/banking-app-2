/**
 * Payday run: the gates for rent, groceries and bills. Each spans the whole track and takes its
 * amount once, when the runner passes its distance (D9); no collision, just a distance check.
 * The frames of all gates are one InstancedMesh; each banner is its own plane with a canvas label.
 */
import { THREE } from './profile-persona-character.js';

export function createGates(track, cfg, format) {
  const g = cfg.gate;
  const gates = cfg.gates.map((d) => ({ ...d }));
  const half = track.width / 2 + cfg.track.edge;
  const group = new THREE.Group();

  /* Frames: two posts and a bar per gate, from one unit box. */
  const frameMat = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 });
  const frames = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), frameMat, gates.length * 3);
  frames.frustumCulled = false;
  const o = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();

  const bannerMat = [];
  gates.forEach((gate, i) => {
    track.at(gate.at, o);
    const yaw = Math.atan2(o.t.x, o.t.z);
    q.setFromAxisAngle(up, yaw);
    const side = half + g.outset;
    [-1, 1].forEach((sgn, k) => {
      pos.set(o.p.x + o.r.x * sgn * side, g.height / 2, o.p.z + o.r.z * sgn * side);
      frames.setMatrixAt(i * 3 + k, m.compose(pos, q, scl.set(g.post, g.height, g.post)));
    });
    pos.set(o.p.x, g.height, o.p.z);
    frames.setMatrixAt(i * 3 + 2, m.compose(pos, q, scl.set(side * 2 + g.post, g.post, g.post)));

    /* Banner under the bar, facing the runner (the plane's front looks back along the track). */
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.round(1024 * (g.bannerHeight / track.width));
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(track.width, g.bannerHeight), mat);
    banner.position.set(o.p.x, g.height - g.post / 2 - g.bannerHeight / 2, o.p.z);
    banner.rotation.y = yaw + Math.PI;
    banner.frustumCulled = false;
    group.add(banner);
    bannerMat.push({ canvas, tex, gate });
  });
  frames.instanceMatrix.needsUpdate = true;
  group.add(frames);

  function draw(ink, bg, family) {
    bannerMat.forEach(({ canvas, tex, gate }) => {
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = bg;
      ctx.textBaseline = 'middle';
      ctx.font = `500 ${Math.round(h * 0.44)}px ${family}`;
      ctx.textAlign = 'left';
      ctx.fillText(gate.label, w * 0.06, h / 2 + 4);
      ctx.textAlign = 'right';
      ctx.fillText('-' + format(gate.amount), w * 0.94, h / 2 + 4);
      tex.needsUpdate = true;
    });
  }

  /* Gates passed between the previous and the current distance, in order. */
  function crossed(prevS, s) {
    return gates.filter((gate) => prevS < gate.at && s >= gate.at);
  }

  function recolour(inkColor, bgColor) {
    frameMat.color.copy(inkColor);
    const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
    const css = (c) => '#' + c.getHexString(THREE.SRGBColorSpace);
    draw(css(inkColor), css(bgColor), family);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => draw(css(inkColor), css(bgColor), family));
  }

  return { group, crossed, recolour };
}
