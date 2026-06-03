/**
 * Load app IIFE scripts sequentially (for Live page stories).
 * Scripts are served from the Storybook / Vite root (apps/web).
 */

const DEFAULT_BASE = '/js/';

function scriptUrl(path) {
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return DEFAULT_BASE + path;
}

export function loadAppScript(path) {
  const src = scriptUrl(path);
  const existing = document.querySelector(`script[data-sb-app-script="${src}"]`);
  if (existing) {
    return existing.dataset.sbLoaded === '1'
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
        });
  }

  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.dataset.sbAppScript = src;
    el.onload = () => {
      el.dataset.sbLoaded = '1';
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

export async function loadAppScripts(paths) {
  for (const p of paths) {
    await loadAppScript(p);
  }
}

/** After scripts load, refresh state-driven DOM (data-render listens for this). */
export function refreshPayStateDom() {
  if (!window.UZBankPayState) return;
  try {
    document.dispatchEvent(
      new CustomEvent('uzbank:state-changed', {
        detail: window.UZBankPayState.getState(),
      }),
    );
  } catch (e) {
    /* ignore */
  }
}
