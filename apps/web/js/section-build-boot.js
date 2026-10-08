/**
 * Early paint guard for the tectonic page transitions (the carousel) — load in <head> on every
 * shell page. When we arrive from another app page it:
 *   · hides the active view before first paint,
 *   · tells js/section-build-motion.js from which side the sections come:
 *       deeper → from the RIGHT · back → from the LEFT · between dashboards → from the LEFT
 *   · and, going deeper or back, draws the previous page's empty cards exactly where they were
 *     (saved by the old page), so the old page seems to still be there and can leave while the
 *     new one arrives. The direction comes from js/shell-nav.js; for the browser's own
 *     back/forward buttons it is worked out from the page depths.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var NAV_DEPTH = {
    'overview.html': 0,
    'payments.html': 0,
    'profile.html': 0,
    'account-details.html': 1,
    'investment-product-details.html': 1,
    'all-bookings-and-payments.html': 2,
    'details-of-position.html': 2,
    'design-system.html': 0,      /* admin: a dashboard of its own (4th tab) */
    'motion-specimens.html': 1,
    'components.html': 1
  };

  function page(pathname) {
    var name = (String(pathname || '').split('/').pop() || '').split('?')[0].split('#')[0].toLowerCase();
    return /\.html$/.test(name) ? name : 'overview.html';
  }

  function depth(p) {
    return Object.prototype.hasOwnProperty.call(NAV_DEPTH, p) ? NAV_DEPTH[p] : 0;
  }

  function ms(name, fallback) {
    var raw = getComputedStyle(root).getPropertyValue(name).trim();
    var n = parseFloat(raw);
    if (isNaN(n)) return fallback;
    return /ms$/.test(raw) ? n : /s$/.test(raw) ? n * 1000 : n;
  }

  var dirExitSide = 'left';

  /* Step 2 starts right at first paint, so the old page keeps moving while the new one loads:
     the stand-ins shrink into a stack off the exit edge (same geometry as section-build-motion.js). */
  function leaveIntoStack(layer, g, side) {
    if (!layer.animate) return;
    var ghosts = Array.prototype.slice.call(layer.children);
    var vw = window.innerWidth, vh = window.innerHeight;
    var maxW = Math.max.apply(null, g.items.map(function (it) { return it.w; }));
    var ratio = parseFloat(getComputedStyle(root).getPropertyValue('--tectonic-stack-width')) || 0.08;
    var s = Math.min(0.2, Math.max(0.06, (vw * ratio) / Math.max(1, maxW)));
    var gap = 3;
    var byTop = g.items.map(function (it, i) { return i; }).sort(function (a, b) {
      return g.items[a].y - g.items[b].y || g.items[a].x - g.items[b].x;
    });
    var total = byTop.reduce(function (sum, i) { return sum + g.items[i].h * s; }, 0) + gap * (g.items.length - 1);
    var y = (vh - (g.clipBottom || 0)) / 2 - total / 2;
    var stackW = maxW * s;
    var cx = side === 'left' ? (g.clipLeft || 0) - 16 - stackW / 2 : vw + 16 + stackW / 2;
    var to = [];
    byTop.forEach(function (i) {
      var it = g.items[i], h = it.h * s;
      to[i] = 'translate(' + (cx - (it.x + it.w / 2)).toFixed(1) + 'px, ' +
              ((y + h / 2) - (it.y + it.h / 2)).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
      y += h + gap;
    });
    /* Leading column first: nearest to the exit edge */
    var lead = g.items.map(function (it, i) { return i; }).sort(function (a, b) {
      var A = g.items[a], B = g.items[b];
      var ka = side === 'left' ? A.x : -(A.x + A.w), kb = side === 'left' ? B.x : -(B.x + B.w);
      return Math.round(ka - kb) || A.y - B.y;
    });
    var d = ms('--tectonic-leave-duration', 400);
    var stagger = ms('--tectonic-leave-stagger', 30);
    var easing = getComputedStyle(root).getPropertyValue('--tectonic-leave-ease').trim() || 'cubic-bezier(0.45, 0, 0.55, 1)';
    var fadeEnd = parseFloat(getComputedStyle(root).getPropertyValue('--tectonic-leave-fade-end')) || 0.65;
    /* One continuous soft curve per card: a slow drift toward the exit, then shrinking toward
       the stack; the panel fades out by ~2/3 of the way (--tectonic-leave-fade-end). */
    lead.forEach(function (idx, k) {
      ghosts[idx].style.willChange = 'transform, opacity';
      ghosts[idx].animate(
        [
          { opacity: 1, transform: 'none', offset: 0 },
          { opacity: 1, offset: 0.1 },
          { opacity: 0, offset: fadeEnd },
          { opacity: 0, transform: to[idx], offset: 1 }
        ],
        { duration: d, delay: Math.min(k, 6) * stagger, easing: easing, fill: 'forwards' }
      );
    });
  }

  /* The old page's cards as fixed, empty stand-ins, clipped to the content area
     (so they pass under the sidebar / tab bar like the real sections). */
  function drawGhosts(g) {
    var layer = document.createElement('div');
    layer.id = 'uz-ghost-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.setAttribute('data-clip-left', g.clipLeft || 0);
    layer.setAttribute('data-clip-bottom', g.clipBottom || 0);
    layer.style.cssText = 'position:fixed;inset:0;z-index:5;pointer-events:none;' +
      'clip-path:inset(0 0 ' + (g.clipBottom || 0) + 'px ' + (g.clipLeft || 0) + 'px);';
    g.items.forEach(function (it) {
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;box-sizing:border-box;' +
        'left:' + it.x + 'px;top:' + it.y + 'px;width:' + it.w + 'px;height:' + it.h + 'px;' +
        'background-color:' + it.bg + ';border-radius:' + it.radius + ';border:' + it.border + ';' +
        'box-shadow:' + it.shadow + ';';
      layer.appendChild(d);
    });
    document.documentElement.appendChild(layer);
    /* Shared clock: the arriving sections are timed from this moment (section-build-motion.js) */
    window.__uzHandoverStart = (window.performance && performance.now()) || 0;
    leaveIntoStack(layer, g, dirExitSide);
    /* Fail-safe: never leave stand-ins on screen */
    window.setTimeout(function () {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 2500);
  }

  try {
    var stored = sessionStorage.getItem('uzShellNavEnterDir');
    sessionStorage.removeItem('uzShellNavEnterDir');
    var ghosts = null;
    try { ghosts = JSON.parse(sessionStorage.getItem('uzShellGhosts') || 'null'); } catch (e) { ghosts = null; }
    sessionStorage.removeItem('uzShellGhosts');

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var nav = window.performance && performance.getEntriesByType
      ? performance.getEntriesByType('navigation')[0]
      : null;
    if (nav && nav.type === 'reload') return;

    var prev = sessionStorage.getItem('uzShellNavPrevPath');
    var cur = page(window.location.pathname);
    if (!prev || page(prev) === cur) return;

    var dir = stored;
    if (dir !== 'forward' && dir !== 'back' && dir !== 'lateral') {
      var dPrev = depth(page(prev));
      var dCur = depth(cur);
      dir = dCur > dPrev ? 'forward' : dCur < dPrev ? 'back' : 'lateral';
    }

    root.classList.add('section-build-pending', dir === 'forward' ? 'section-build--from-right' : 'section-build--from-left');

    /* Carousel hand-over: only for the page the stand-ins were saved for, right after leaving it,
       in the same window size. */
    if ((dir === 'forward' || dir === 'back') && ghosts && ghosts.items && ghosts.items.length &&
        page(ghosts.to) === cur && Date.now() - ghosts.t < 4000 &&
        Math.abs(ghosts.vw - window.innerWidth) < 2 && Math.abs(ghosts.vh - window.innerHeight) < 2) {
      root.classList.add('section-build--carousel');
      dirExitSide = dir === 'forward' ? 'left' : 'right';
      drawGhosts(ghosts);
    } else if (dir === 'forward' || dir === 'back') {
      root.classList.add('section-build--carousel');
    }
    /* Fail-safe: never leave the view hidden if the motion script doesn't run. */
    window.setTimeout(function () {
      root.classList.remove('section-build-pending');
    }, 2000);
  } catch (err) {
    root.classList.remove('section-build-pending');
  }
})();
