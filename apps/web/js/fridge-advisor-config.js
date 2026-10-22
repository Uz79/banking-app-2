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
      intro: { pos: [0.3, 1.2, 5.2], look: [0.3, 1.05, 0], width: 3.5 },
      /* The fridge's body is centred on x = fridge.x; its front is at about z = -0.05. */
      main: { pos: [-0.9, 1.0, 3.5], look: [-0.9, 0.85, -0.1], width: 2.4 },
      reserve: { pos: [-0.9, 1.0, 2.3], look: [-0.9, 0.36, 0.05], width: 1.5 },
      freezer: { pos: [-0.9, 1.95, 2.1], look: [-0.9, 1.85, -0.1], width: 1.8 },
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
    drawers: { gap: 0.012, wall: 0.006, front: 0.02, pull: 0.07 }, /* `pull`: how far the drawers stand out, so the camera can look into them */
  },

  /* The light inside (position in the kit's units, intensity in three.js units). */
  light: { intensity: 0.45, main: [0.215, 0.6, -0.03], freezer: [0.215, 0.88, -0.03] },

  /* Doors swing about their left edge. Angles in radians, durations in seconds. `glide` is the camera's move
     between stages; `outline` is the accent frame fading in on the compartment being explained or filled. */
  doors: { open: 1.75, swing: 0.6 },
  motion: { glide: 0.8, outline: 0.25 },
  outline: { bar: 0.007 },

  /* Food: where it stands and what it is. Slots are in the kit's units; `surface` is the height of the board an item
     stands on, `h` the free height above it. A shelf is a row of slots across; a drawer is a grid (cols x rows).
     `models` repeat in order where a compartment has more slots than distinct items (D11, D12). `lay` lets a tall
     model lie on its side to fit a low shelf. */
  food: {
    appear: 0.16,
    shelves: {
      salary: { surface: 0.47, h: 0.12, cols: 4, rows: 1, models: ['carton', 'cheese', 'egg', 'loaf'] },
      left: { surface: 0.33, h: 0.12, cols: 4, rows: 1, models: ['sausage', 'pot-stew', 'pie', 'soda-bottle'] },
      assets: { surface: 0.19, h: 0.12, cols: 4, rows: 1, models: ['apple', 'banana', 'grapes', 'cabbage'] },
      unplanned: { drawer: 0, cols: 2, rows: 2, models: ['meat-raw', 'fish', 'cabbage', 'apple'] },
      bigger: { drawer: 1, cols: 2, rows: 2, models: ['pie', 'cheese', 'banana', 'loaf'] },
      freezer: { surfaces: [0.717, 0.8], hs: [0.07, 0.085], cols: 4, rows: 1,
        models: ['popsicle', 'fish', 'meat-raw', 'pie', 'sausage', 'popsicle', 'fish', 'meat-raw'] },
    },
    lay: ['popsicle'],
    /* Slot count of a compartment is round(share x capacity); the compartments and their sliders are in FIELDS. */
  },
};

/**
 * The sliders (D10). `max` is a number, or `{ of: 'salary', times: 6 }` for a range that follows another value.
 * `curve` bends the track: value = max x t^curve (the assets track is easier to set at the low end).
 */
export const FIELDS = {
  salary: { label: 'Monthly salary', max: 20000, step: 100 },
  left: { label: 'Left at month end', max: { of: 'salary', times: 1 }, step: 100 },
  assets: { label: 'Total assets', max: 500000, step: 1000, curve: 2 },
  unplanned: { label: 'Reserve for the unplanned', max: { of: 'salary', times: 6 }, step: 1000, mark: 3 },
  bigger: { label: 'Reserve for bigger purchases', max: 100000, step: 1000 },
};

/**
 * The screens, in order (D4). `stage` is the camera pose, `doors` which doors stand open, `outline` the compartment
 * marked with the accent. Copy is English, short and plain, with no em dashes (D17). Steps 7 and 8 arrive with the
 * result. `fields` are the sliders shown on a screen.
 */
export const STEPS = [
  {
    id: 'intro', stage: 'intro', doors: [], outline: null,
    title: 'Let\'s look at your finances',
    text: 'The fridge helps you look at your financial situation. Each compartment stands for a different part of your wealth.',
  },
  {
    id: 'tour-main', stage: 'main', doors: ['fridge'], outline: 'main',
    title: 'The main compartment',
    text: 'This is the money for your daily needs.',
  },
  {
    id: 'tour-reserve', stage: 'reserve', doors: ['fridge'], outline: 'reserve',
    title: 'The reserve drawers',
    text: 'These hold money you have set aside for unplanned expenses or a bigger goal, like a new car.',
  },
  {
    id: 'tour-freezer', stage: 'freezer', doors: ['freezer'], outline: 'freezer',
    title: 'The freezer',
    text: 'This is money you will not need for now, and which should be invested.',
  },
  {
    id: 'main-sliders', stage: 'main', doors: ['fridge'], outline: 'main', fields: ['salary', 'left', 'assets'],
    title: 'Your main compartment',
    text: 'Set your monthly salary, what is left at month end and your total assets. The shelves fill as you go.',
  },
  {
    id: 'reserve-sliders', stage: 'reserve', doors: ['fridge'], outline: 'reserve', fields: ['unplanned', 'bigger'],
    title: 'Your reserves',
    text: 'Set aside money for the unplanned and for bigger purchases. The drawers fill as you go.',
  },
];
