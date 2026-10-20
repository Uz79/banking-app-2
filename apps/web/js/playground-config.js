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

  /* Rendering. */
  maxPixelRatio: 2,
  fogNear: 40,
  fogFar: 140,
};
