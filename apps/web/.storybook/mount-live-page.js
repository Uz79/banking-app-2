/**
 * Mount a standalone HTML page inside a Storybook canvas and load its app scripts.
 */

import overviewHtml from '../overview.html?raw';
import paymentsHtml from '../payments.html?raw';
import accountDetailsHtml from '../account-details.html?raw';

const PAGE_HTML = {
  overview: overviewHtml,
  payments: paymentsHtml,
  'account-details': accountDetailsHtml,
};

const PAGE_SCRIPTS = {
  overview: [
    'document-ready.js',
    'analytics.js',
    'dialog-focus.js',
    'form-field-sheet.js',
    'payment-exit-confirm.js',
    'payment-state.js',
    'data-render.js',
    'scroll-edge-chrome.js',
    'payment-overlay.js',
    'iat-overlay.js',
    'app-mp.js',
  ],
  payments: [
    'document-ready.js',
    'analytics.js',
    'dialog-focus.js',
    'form-field-sheet.js',
    'payment-exit-confirm.js',
    'payment-state.js',
    'data-render.js',
    'scroll-edge-chrome.js',
    'payment-overlay.js',
    'iat-overlay.js',
    'app-mp.js',
  ],
  'account-details': [
    'document-ready.js',
    'analytics.js',
    'dialog-focus.js',
    'form-field-sheet.js',
    'payment-exit-confirm.js',
    'payment-state.js',
    'data-render.js',
    'scroll-edge-chrome.js',
    'payment-overlay.js',
    'app-mp.js',
    'account-information.js',
    'share-information.js',
    'payment-details.js',
    'iat-overlay.js',
  ],
};

const loadedScripts = new Set();

function extractBodyMarkup(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const frag = document.createDocumentFragment();
  Array.from(doc.body.childNodes).forEach((node) => {
    if (node.nodeName === 'SCRIPT') return;
    frag.appendChild(node.cloneNode(true));
  });
  const wrap = document.createElement('div');
  wrap.appendChild(frag);
  return wrap.innerHTML;
}

function loadScriptOnce(src) {
  if (loadedScripts.has(src)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    el.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(el);
  });
}

/**
 * @param {object} options
 * @param {'overview'|'payments'|'account-details'} options.page
 * @param {HTMLElement} options.canvas — Storybook story root (canvasElement)
 */
export async function mountLivePage({ page, canvas }) {
  const scripts = PAGE_SCRIPTS[page];
  const html = PAGE_HTML[page];
  if (!scripts || !html) throw new Error('Unknown live page: ' + page);
  if (!canvas) throw new Error('Live page canvas element is missing');

  document.body.classList.add('body');
  document.body.setAttribute('data-screen', page);
  document.body.setAttribute('data-page', page);

  canvas.innerHTML = extractBodyMarkup(html);

  for (const file of scripts) {
    await loadScriptOnce('/app/js/' + file);
  }

  if (window.UZBankPayState && typeof window.UZBankPayState.getState === 'function') {
    document.dispatchEvent(
      new CustomEvent('uzbank:state-changed', {
        detail: window.UZBankPayState.getState(),
      })
    );
  }

  if (window.UZBankAnalytics && typeof window.UZBankAnalytics.screen === 'function') {
    window.UZBankAnalytics.screen();
  }
}

export function livePageRender() {
  return () => '<div id="live-page-root" class="live-page-root" style="min-height:100vh;width:100%"></div>';
}

/**
 * @param {'overview'|'payments'|'account-details'} page
 * @param {HTMLElement} [canvasElement] — from Storybook play({ canvasElement })
 */
export async function livePagePlay(page, canvasElement) {
  const host = canvasElement || document.getElementById('storybook-root');
  const canvas =
    (host && host.querySelector && host.querySelector('#live-page-root')) ||
    (host && host.querySelector && host.querySelector('.live-page-root')) ||
    document.getElementById('live-page-root') ||
    host;
  if (!canvas) {
    throw new Error(
      'Live page mount point not found. Ensure the story render() includes #live-page-root.'
    );
  }
  await mountLivePage({ page, canvas });
}
