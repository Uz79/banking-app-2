/**
 * Early paint guard for shell page transitions — load in <head> before body.
 */
(function () {
  'use strict';
  try {
    var dir = sessionStorage.getItem('uzShellNavEnterDir');
    if (dir === 'forward' || dir === 'back') {
      document.documentElement.classList.add('shell-nav-pending', 'shell-nav-pending--' + dir);
    }
  } catch (err) {
    /* ignore */
  }
})();
