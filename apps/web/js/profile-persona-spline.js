/**
 * Profile persona cards — Spline 3D characters
 * Same scene + clips as spline-persona-v2-dark:
 *   few  / Beat → "Kneeling Pointing"
 *   many / Max  → "Bboy Uprock Start"
 *
 * The scene Start event always plays kneeling. We must wait for that,
 * then force the card's target clip and re-assert briefly so Start
 * cannot leave both cards on the same pose.
 */
import { Application } from '@splinetool/runtime';

const SCENE_URL = 'https://prod.spline.design/OIHKF-gR8HScan6O/scene.splinecode';

const CLIP_NAMES = {
  few: 'Kneeling Pointing',
  many: 'Bboy Uprock Start',
};

const THREE_LOOP_REPEAT = 2201;

function getAnimationControls(app) {
  return (
    app?._animationControls ||
    app?._eventManager?.animationControls ||
    app?._controls?.eventManager?.animationControls ||
    null
  );
}

function findAction(ac, clipName) {
  if (!ac?.clipIdToAction) return null;
  const exact = Object.values(ac.clipIdToAction).find((a) => a?._clip?.name === clipName);
  if (exact) return exact;
  const needle = String(clipName).toLowerCase();
  return (
    Object.values(ac.clipIdToAction).find((a) =>
      String(a?._clip?.name || '')
        .toLowerCase()
        .includes(needle.split(' ')[0])
    ) || null
  );
}

function isClipRunning(ac, clipName) {
  const action = findAction(ac, clipName);
  return !!(action && typeof action.isRunning === 'function' && action.isRunning());
}

function triggerPose(app, pose) {
  const clipName = CLIP_NAMES[pose];
  if (!clipName) return false;

  try {
    const ac = getAnimationControls(app);
    if (!ac?.mixer) return false;

    const target = findAction(ac, clipName);
    if (!target) return false;

    ac.mixer.stopAllAction();
    target.enabled = true;
    target.paused = false;
    target.weight = 1;
    if (typeof target.setEffectiveWeight === 'function') target.setEffectiveWeight(1);
    if (typeof target.setLoop === 'function') target.setLoop(THREE_LOOP_REPEAT, Infinity);
    else {
      target.loop = THREE_LOOP_REPEAT;
      target.repetitions = Infinity;
    }
    target.reset().play();
    ac.needsUpdate = true;
    if (typeof ac.requestRender === 'function') ac.requestRender();
    return isClipRunning(ac, clipName) || true;
  } catch {
    return false;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForObjects(app) {
  for (let i = 0; i < 80; i++) {
    if (app.disposed) return false;
    if (app.getAllObjects().length > 0) return true;
    await wait(i < 20 ? 50 : 100);
  }
  return false;
}

async function waitForClips(app) {
  for (let i = 0; i < 80; i++) {
    if (app.disposed) return null;
    const ac = getAnimationControls(app);
    if (ac && Object.keys(ac.clipIdToAction || {}).length > 0) return ac;
    await wait(i < 20 ? 50 : 100);
  }
  return null;
}

/**
 * Wait until the scene Start handler has begun (kneeling running),
 * or until a short timeout — then apply the card pose.
 */
async function waitForStartThenPose(app, pose) {
  const ac = await waitForClips(app);
  if (!ac) return false;

  // Start event plays kneeling; give it a moment to latch.
  for (let i = 0; i < 30; i++) {
    if (app.disposed) return false;
    if (isClipRunning(getAnimationControls(app), CLIP_NAMES.few)) break;
    await wait(50);
  }
  // Extra beat so Start finishes asserting before we override.
  await wait(150);

  let ok = triggerPose(app, pose);

  // Re-assert: Start / event graph can briefly steal the mixer back.
  const gaps = [200, 200, 300, 400, 500, 800];
  for (const gap of gaps) {
    await wait(gap);
    if (app.disposed) return ok;
    const current = getAnimationControls(app);
    if (!isClipRunning(current, CLIP_NAMES[pose])) {
      ok = triggerPose(app, pose) || ok;
    }
  }

  return ok;
}

async function mountCard(card) {
  if (card.dataset.splineMounted === 'true') return;

  const pose = card.getAttribute('data-persona-pose');
  const stage = card.querySelector('[data-persona-stage]');
  if (!pose || !stage || !CLIP_NAMES[pose]) return;

  card.dataset.splineMounted = 'true';
  stage.classList.add('profile-persona-card__stage--loading');

  const canvas = document.createElement('canvas');
  canvas.className = 'profile-persona-card__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.appendChild(canvas);

  try {
    const app = new Application(canvas);
    card._splineApp = app;
    await app.load(SCENE_URL);
    const ready = await waitForObjects(app);
    if (ready) {
      const ok = await waitForStartThenPose(app, pose);
      if (!ok) {
        console.warn('[profile-persona-spline] failed to lock pose', pose);
      }
    }
  } catch (err) {
    console.warn('[profile-persona-spline] failed to load scene', err);
    const fallback = stage.querySelector('.profile-persona-card__stage-fallback');
    if (fallback) fallback.textContent = '3D unavailable';
    stage.classList.add('profile-persona-card__stage--error');
  } finally {
    stage.classList.remove('profile-persona-card__stage--loading');
  }
}

function mountAll() {
  document.querySelectorAll('.profile-persona-card[data-persona-pose]').forEach((card) => {
    void mountCard(card);
  });
}

function init() {
  const panel = document.getElementById('profilePanelPersona');
  if (!panel) return;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    // Defer one frame so the panel is laid out (canvas has non-zero size).
    requestAnimationFrame(() => {
      requestAnimationFrame(mountAll);
    });
  };

  if (!panel.hidden) {
    start();
    return;
  }

  const observer = new MutationObserver(() => {
    if (!panel.hidden) {
      start();
      observer.disconnect();
    }
  });
  observer.observe(panel, { attributes: true, attributeFilter: ['hidden', 'class'] });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
