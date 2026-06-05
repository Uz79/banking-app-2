/**
 * Run a callback when the document is ready (DOMContentLoaded or already parsed).
 * Used by app scripts and Storybook live stories that inject HTML after load.
 */
(function (global) {
  'use strict';
  global.onDocumentReady = function (fn) {
    if (typeof fn !== 'function') return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };
})(typeof window !== 'undefined' ? window : this);
