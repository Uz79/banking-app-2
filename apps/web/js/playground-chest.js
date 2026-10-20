/**
 * Payday run: the savings chest. The track runs through it: two walls and a curved lid make a
 * chest you pass under. When the runner passes its distance, what is left in the balance is
 * deposited (D9). Simple geometry in the accent colour, no model.
 */
import { THREE } from './profile-persona-character.js';

export function createChest(track, cfg) {
  const c = cfg.chest;
  const half = track.width / 2 + cfg.track.edge + 0.5;
  const o = { p: new THREE.Vector3(), t: new THREE.Vector3(), r: new THREE.Vector3() };
  track.at(c.at, o);

  /* Local frame: +z along the track, -x to the runner's right (like the gates). */
  const chest = new THREE.Group();
  chest.position.copy(o.p);
  chest.rotation.y = Math.atan2(o.t.x, o.t.z);

  const body = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, side: THREE.DoubleSide });
  const lockMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0 });

  const radius = c.depth / 2;
  [-1, 1].forEach((sgn) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(c.wall, c.height, c.depth), body);
    wall.position.set(sgn * (half + c.wall / 2), c.height / 2, 0);
    chest.add(wall);
  });
  const lidLength = (half + c.wall) * 2;
  const lidGeo = new THREE.CylinderGeometry(radius, radius, lidLength, 32, 1, false, 0, Math.PI);
  lidGeo.rotateZ(Math.PI / 2);
  const lid = new THREE.Mesh(lidGeo, body);
  lid.position.set(0, c.height, 0);
  chest.add(lid);

  const lock = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.3), lockMat);
  lock.position.set(0, c.height + 0.5, -radius + 0.05);
  chest.add(lock);

  /* "Savings" banner above the lid, facing the runner. */
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 192;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.25), new THREE.MeshBasicMaterial({ map: tex }));
  banner.position.set(0, c.height + radius + 1.1, 0);
  banner.rotation.y = Math.PI;
  chest.add(banner);

  function draw(ink, bg, family) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = ink;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bg;
    ctx.font = `500 ${Math.round(canvas.height * 0.5)}px ${family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Savings', canvas.width / 2, canvas.height / 2 + 4);
    tex.needsUpdate = true;
  }

  function recolour(inkColor, bgColor) {
    body.color.copy(inkColor);
    lockMat.color.copy(bgColor);
    const css = (col) => '#' + col.getHexString(THREE.SRGBColorSpace);
    const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
    draw(css(inkColor), css(bgColor), family);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => draw(css(inkColor), css(bgColor), family));
  }

  const crossed = (prevS, s) => prevS < c.at && s >= c.at;
  return { group: chest, crossed, recolour };
}
