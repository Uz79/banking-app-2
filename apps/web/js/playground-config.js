/**
 * Payday run: every number that decides how it feels, in one place.
 * Change a value, reload the page, play. Starting values; tune by feel (D10).
 */
export const CONFIG = {
  /* The persona profile sets the pace. The rig has one run clip, so a faster profile plays
     it faster (timeScale) and covers more ground (speed, in units per second). */
  profiles: {
    novice: { name: 'Beat', pace: 'jogs', speed: 5.5, timeScale: 0.8 },
    standard: { name: 'Lena', pace: 'runs', speed: 7.5, timeScale: 1 },
    power: { name: 'Max', pace: 'sprints', speed: 10, timeScale: 1.25 },
  },
  fallbackProfile: 'standard',
  runClip: 'Running_A',
  idleClip: 'Idle_A',

  /* The track is a curve through these points (x is sideways, spacing is along the run). */
  track: {
    width: 7,
    edge: 0.3,
    spacing: 30,
    sway: [0, 8, 18, 10, -6, -18, -12, 4, 16, 10, -8, -16, -8, 0],
    step: 0.5,
  },

  /* Steering: sideways speed follows the input with a little smoothing. */
  steer: { speed: 6, response: 10, margin: 0.6, lean: 0.05 },

  /* Chase camera: behind and above the runner, easing toward its spot. */
  camera: { fov: 52, fovNarrow: 62, distance: 7, height: 3.6, lookAhead: 5, lookHeight: 1.2, follow: 0.5, lag: 3.5 },

  /* The world. Distances are along the track; the town is the first stretch. */
  world: {
    seed: 7,
    scale: 4.5,         /* the town models are about 1 unit; the runner is about 2 */
    buildingFacing: 0,  /* radians added to a building's turn toward the road */
    town: { from: 14, to: 250, sidewalk: 3.2, gap: [1, 3.5], lampEvery: 18, propEvery: 11 },
  },

  /* Money, in CHF. The salary lands at the start as coins on the road; collecting them is how it reaches the balance. */
  money: { salary: 6000 },
  coins: {
    count: 100,       /* the salary is split evenly over this many coins */
    from: 18, to: 232,
    spacing: 1.9, gap: 3, lateral: 2.4,
    radius: 0.55, thickness: 0.14, height: 1.3,
    spin: 2.6,        /* radians per second */
    reach: { along: 1.2, across: 1.15 },
  },
  /* Gates across the whole track: unavoidable costs, taken once when the runner passes. Amounts in CHF. */
  gates: [
    { id: 'rent', label: 'Rent', amount: 1600, at: 105 },
    { id: 'groceries', label: 'Groceries', amount: 500, at: 160 },
    { id: 'bills', label: 'Bills', amount: 700, at: 210 },
  ],
  gate: { height: 7.4, bannerHeight: 1.7, post: 0.5, outset: 0.5 },

  /* The savings chest at the end of the town: what is left in the balance is deposited when the runner passes. */
  chest: { at: 240, depth: 4, wall: 2.2, height: 4 },

  burst: { count: 36, life: 1.1, up: [6, 9], out: [2, 5], gravity: 18, size: 0.2 },

  /* Rendering. */
  maxPixelRatio: 2,
  fogNear: 40,
  fogFar: 140,
};
