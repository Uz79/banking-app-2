/**
 * The strategy vehicles (roadmap 9c): the numbers that decide how each one looks, in one place.
 * Change a value, reload the Character kit page, look. Tuned by eye (9c D4).
 * Units are the persona's: the figure is about 2.4 high. Every model is turned by `rotate` (radians, x y z), then scaled so
 * its height is `height`, stood on the floor and centred, then moved by `at` and turned by `yaw`. `figure.at` is where the
 * persona's feet are (raised for a seat or for flying).
 */
export const VEHICLES = {
  income: {
    label: 'Income', vehicle: 'tent', file: 'tent.glb', height: 1.7, rotate: [0, 0, 0], at: [-0.9, 0, -0.6], yaw: 0.5,
    pose: 'stand', figure: { at: [0.9, 0, 0.4], yaw: -0.35 }, idle: 'none',
    view: { look: [-0.1, 1.0, 0], height: 3.2, width: 5.4 },
  },
  conservative: {
    label: 'Conservative', vehicle: 'tricycle', file: 'tricycle.glb', height: 1.35, rotate: [0, 0, 0], at: [0, 0, 0], yaw: 0,
    pose: 'sit', figure: { at: [0, 0.5, -0.25], yaw: 0 }, idle: 'none',
    view: { look: [0, 1.4, 0], height: 3.7, width: 3.4 },
  },
  balanced: {
    label: 'Balanced', vehicle: 'vespa', file: 'vespa.glb', height: 1.45, rotate: [0, 0, 0], at: [0, 0, 0], yaw: 0,
    pose: 'sit', figure: { at: [0, 0.38, -0.38], yaw: 0 }, idle: 'none',
    view: { look: [0, 1.4, 0], height: 3.7, width: 3.4 },
  },
  /* The lines meet just above the head; the canopy's lowest point is the lines' end. */
  growth: {
    label: 'Growth', vehicle: 'parachute', file: 'parachute.glb', height: 2.6, rotate: [0, 0, 0], at: [0, 2.9, 0], yaw: 0,
    pose: 'fly', figure: { at: [0, 1.0, 0], yaw: 0 }, idle: 'sway',
    view: { look: [0, 2.85, 0], height: 6.0, width: 4.6 },
  },
  /* Worn on the back, so this one is seen from the side (`view.turn`): from the front the hair hides it. */
  dynamic: {
    label: 'Dynamic', vehicle: 'jetpack', file: 'jetpack.glb', height: 1.25, rotate: [0, 0, 0], at: [0, 1.1, -0.8], yaw: 0,
    pose: 'fly', figure: { at: [0, 0.9, 0], yaw: 0 }, idle: 'hover',
    view: { look: [-0.15, 2.0, 0], height: 4.0, width: 3.6, turn: 1.25 },
  },
};

/* The persona's poses (D5, D6). `stand` and `fly` are clips; `sit` bends the legs (radians about each bone's own x axis)
   on top of the idle, after the clip has played each frame; `arms` reach forward for the handlebars. */
export const POSES = {
  stand: { clip: 'Idle_A' },
  fly: { clip: 'Jump_Idle' },
  sit: { clip: 'Idle_A', upperLeg: -1.25, lowerLeg: 0.9, upperArm: 0.9, lowerArm: 0 }, /* thighs forward, shins down, hands on the bars */
};

/* The small idles (D7): `hover` moves the whole group up and down, `sway` rocks it about the canopy. */
export const IDLE = {
  hover: { amount: 0.14, period: 2.0 },
  sway: { angle: 0.07, period: 3.0, pivot: 4.6 }, /* `pivot`: the canopy's height, what it rocks about */
};

/* The stage (D10): seen from the front-right, 30 degrees toward the viewer's left like the persona's rest pose, unless a
   strategy's `view.turn` says otherwise. Each `view` keeps `height` and `width` in frame around `look`. */
export const STAGE = { fov: 30, turn: 0.35 - Math.PI / 6, aim: [0.32, 0.22, 1] };
