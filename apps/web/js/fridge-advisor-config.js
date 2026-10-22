/**
 * Fridge advisor: the numbers that decide how it looks and feels, in one place.
 * Change a value, reload the page, look. Starting values; tune by eye (D7, D10, D11, D14).
 * Fridge units: the kit's fridge is 0.43 wide, 0.92 tall, 0.26 deep, its front at z = -0.02.
 */
export const CONFIG = {
  maxPixelRatio: 2,

  /* The fridge is scaled up so the persona reads as standing beside it. */
  fridge: { scale: 2.4, x: -0.75 },

  /* The persona: beside the fridge on the viewer's right, turned a little toward it. */
  figure: { x: 1.2, z: 0.35, yaw: -0.4, idle: 'Idle_A' },

  /* The camera looks at `look` from `pos` (world units, after the fridge scale). `width` is the width that must stay in view:
     on a narrow stage the camera backs away along its line of sight until it fits. */
  camera: {
    fov: 36,
    fovNarrow: 44,
    pose: {
      intro: { pos: [0.3, 1.3, 6.0], look: [0.3, 1.0, 0], width: 3.9 },
    },
  },

  /* The kit's fridge is hollow (checked in a render, D13): a cavity 0.274 wide and 0.2 deep, a main compartment
     (y 0.087 to 0.616) and a freezer above it (y 0.717 to 0.893). The kit has no shelves or drawers, so they are
     boxes. All in the kit's own units, measured in the fridge's frame (x from the left edge of the body, z toward the doors). */
  interior: {
    x: [0.078, 0.352], z: [-0.25, -0.05],
    main: { y: [0.087, 0.616], boards: [0.33, 0.47], drawerTop: 0.19 }, /* shelves rest on the boards, the drawers are below `drawerTop` */
    freezer: { y: [0.717, 0.893], boards: [0.8] },
    board: 0.008,
    drawers: { gap: 0.012, wall: 0.006, front: 0.045 },
  },

  /* The light inside (position in the kit's units, intensity in three.js units). */
  light: { intensity: 0.45, main: [0.215, 0.6, -0.03], freezer: [0.215, 0.88, -0.03] },

  /* Doors swing about their left edge. Angles in radians, durations in seconds. */
  doors: { open: 1.75, swing: 0.6 },
};
