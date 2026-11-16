/**
 * Payday run: sound. Two recorded one-shots (footsteps, a coin) through the Web Audio API.
 * Nothing plays until unlock() runs inside a click (browser rule). Any failure leaves the game silent.
 */
const BASE = new URL(/* @vite-ignore */ '../assets/audio/playground/', import.meta.url).href;
const FILES = {
  town: ['step-town-1', 'step-town-2', 'step-town-3', 'step-town-4'],
  forest: ['step-forest-1', 'step-forest-2', 'step-forest-3', 'step-forest-4'],
  coin: ['coin'],
};
const KEY = 'uzBankWebPlaygroundSound';

export function readSoundSetting() {
  try { return window.localStorage.getItem(KEY) !== 'off'; } catch (err) { return true; }
}
export function writeSoundSetting(on) {
  try { window.localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (err) { /* blocked storage: not remembered */ }
}

export function createAudio(config) {
  const cfg = config.sound;
  const bytes = {};
  const buffers = {};
  let ctx = null;
  let master = null;
  let muted = !readSoundSetting();
  let last = {};
  let ladder = 0;
  let lastCoinAt = -Infinity;

  /* Fetch the file bytes now; decode once the context exists (Safari wants that order). */
  const fetched = Promise.all(Object.entries(FILES).map(([group, names]) => Promise.all(names.map((n) =>
    fetch(BASE + n + '.wav').then((r) => r.arrayBuffer()).then((b) => { (bytes[group] = bytes[group] || []).push(b); })
  )))).catch(() => {});

  function applyMaster() { if (master) master.gain.value = muted ? 0 : cfg.master; }

  async function unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.connect(ctx.destination);
        applyMaster();
        await fetched;
        for (const [group, list] of Object.entries(bytes)) {
          /* callback form: older Safari has no promise-based decodeAudioData */
          buffers[group] = await Promise.all(list.map((b) => new Promise((ok, no) => ctx.decodeAudioData(b.slice(0), ok, no))));
        }
      }
      if (ctx.state === 'suspended') await ctx.resume();
    } catch (err) { ctx = null; }
  }

  function play(group, gain, rate) {
    if (!ctx || muted || ctx.state !== 'running' || !buffers[group]) return;
    const list = buffers[group];
    let i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === last[group]) i = (i + 1) % list.length;
    last[group] = i;
    const src = ctx.createBufferSource();
    src.buffer = list[i];
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g);
    g.connect(master);
    src.start();
  }

  const spread = (amount) => 1 + (Math.random() * 2 - 1) * amount;

  return {
    unlock,
    footstep(surface) {
      play(surface, cfg.footstep * (cfg.surface[surface] || 1) * spread(cfg.volumeSpread), spread(cfg.pitchSpread));
    },
    coin() {
      if (!ctx) return;
      const l = cfg.coinLadder;
      const now = ctx.currentTime;
      ladder = now - lastCoinAt <= l.window ? Math.min(ladder + 1, l.maxSteps) : 0;
      lastCoinAt = now;
      play('coin', cfg.coin, Math.pow(2, (ladder * l.stepSemitones) / 12));
    },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); },
    resume() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); },
    setMuted(value) { muted = value; applyMaster(); writeSoundSetting(!value); },
    isMuted: () => muted,
  };
}
