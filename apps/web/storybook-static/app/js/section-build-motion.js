/**
 * Tectonics · Page transitions — the carousel
 * Spec: Figma "Des-Sys-Test-IV" › Animations Transitions › design-system_animation-spec_tectonics_…
 *       (node 347:8976): mobile frames 01–07 and "Desktop transition – Overall sections movements".
 *
 * Pages sit side by side like a carousel: dashboards (Overview, Payments, Profile) on the left,
 * each deeper level further right. Between pages, sections travel as a small stack just outside
 * the screen edge. Every section has two layers: the container (moves, scales) and its content
 * (leaves first, arrives last).
 *
 *   Deeper (Overview → Custody account):
 *     old page  1 · its content fades (no movement yet)
 *               2 · the empty cards drift left, then shrink into a stack off the LEFT edge,
 *                   fading out on the way — one continuous curve                           (in-between 1–3)
 *     new page  3 · its sections come out of a stack off the RIGHT edge — overlapping 2    (in-between 2–3)
 *               4 · then their content comes in                                            (end frame)
 *   Back: the exact mirror (old page → right, previous page comes in from the left).
 *   Between dashboards: quick fade out, sections come out of the left stack (dashboard case).
 *
 * How the overlap works across two HTML pages (works in every browser): the old page plays
 * step 1, saves the outline of its cards (position, size, surface) and navigates. The browser
 * keeps showing it until the new page paints — and the new page's first paint draws the same
 * empty cards in the same places (js/section-build-boot.js). Those stand-ins play step 2 while
 * the real sections play steps 3–4. Timings: --tectonic-* custom properties in css/styles.css.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var PENDING = 'section-build-pending';
  var RUNNING = 'section-build-running';
  var LEAVING = 'section-build-leaving';
  var GHOSTS_KEY = 'uzShellGhosts';

  /* Wrappers that only group sections (no container of their own) — their children are the sections. */
  var GROUP_CLASSES = ['overview__primary'];
  /* Wrappers inside a section whose children are the content items. */
  var CONTENT_WRAPPER = /(^|\s)[\w-]+__(body|list)(\s|$)/;
  var MAX_STAGGERED_SECTIONS = 6;
  var MAX_STAGGERED_ITEMS = 6;

  var leaveAnims = [];

  function token(name, fallback) {
    var raw = getComputedStyle(root).getPropertyValue(name).trim();
    return raw || fallback;
  }

  function ms(name, fallback) {
    var raw = token(name, '');
    if (!raw) return fallback;
    var n = parseFloat(raw);
    if (isNaN(n)) return fallback;
    return /ms$/.test(raw) ? n : /s$/.test(raw) ? n * 1000 : n;
  }

  function isVisible(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.getClientRects().length === 0) return false;
    var cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'contents';
  }

  function ownSurface(el) {
    var cs = getComputedStyle(el);
    var bg = cs.backgroundColor;
    var transparentBg = !bg || bg === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(bg);
    return !transparentBg || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0;
  }

  /* The element that paints a card. Usually the card itself; some cards keep their background
     on a single inner layer that fills them (e.g. Position details: .section-card > .section-card__body). */
  function surfaceEl(el) {
    if (ownSurface(el)) return el;
    var kids = Array.prototype.filter.call(el.children, isVisible);
    if (kids.length !== 1 || !ownSurface(kids[0])) return null;
    var a = el.getBoundingClientRect(), b = kids[0].getBoundingClientRect();
    return b.width * b.height >= 0.9 * a.width * a.height ? kids[0] : null;
  }

  function hasSurface(el) {
    return !!surfaceEl(el);
  }

  /* A tall wrapper without a surface that holds cards (e.g. a page grid's left column). */
  function isLayoutWrapper(el) {
    if (hasSurface(el) || el.getBoundingClientRect().height < 120) return false;
    return Array.prototype.some.call(el.children, function (k) { return isVisible(k) && hasSurface(k); });
  }

  /* A layout wrapper (no surface of its own) whose children are cards or card columns →
     its children are the sections. */
  function isGroup(el) {
    if (GROUP_CLASSES.some(function (c) { return el.classList.contains(c); })) return true;
    if (hasSurface(el)) return false;
    var kids = Array.prototype.filter.call(el.children, isVisible);
    return kids.length > 0 && kids.some(function (k) { return hasSurface(k) || isLayoutWrapper(k); });
  }

  function collectSections(view) {
    var sections = [];
    function add(el, depth) {
      if (!isVisible(el)) return;
      if (depth < 3 && isGroup(el)) {
        Array.prototype.forEach.call(el.children, function (c) { add(c, depth + 1); });
        return;
      }
      sections.push(el);
    }
    view.querySelectorAll(':scope > .view__main, :scope > .view__sidebar').forEach(function (col) {
      Array.prototype.forEach.call(col.children, function (c) { add(c, 0); });
    });
    /* Top-down as the eye reads, whatever the column layout. */
    var pos = new Map();
    sections.forEach(function (s) { pos.set(s, s.getBoundingClientRect()); });
    sections.sort(function (a, b) {
      var ra = pos.get(a), rb = pos.get(b);
      return Math.round(ra.top - rb.top) || Math.round(ra.left - rb.left);
    });
    return sections;
  }

  function collectContent(section) {
    var visible = Array.prototype.filter.call(section.children, isVisible);
    /* A single wrapper child (e.g. the active profile panel) — its children are the content. */
    if (visible.length === 1 && visible[0].children.length > 1) {
      visible = Array.prototype.filter.call(visible[0].children, isVisible);
    }
    var items = [];
    visible.forEach(function (child) {
      if (CONTENT_WRAPPER.test(child.className) && child.children.length > 1) {
        Array.prototype.forEach.call(child.children, function (c) {
          if (isVisible(c)) items.push(c);
        });
      } else {
        items.push(child);
      }
    });
    return items;
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
  }

  function px(n) { return Math.round(n * 10) / 10 + 'px'; }

  /* Where the content area starts/ends on screen (sections pass under the sidebar and tab bar). */
  function stageClip() {
    var vh = window.innerHeight;
    var main = document.querySelector('.main-content');
    var left = main ? Math.max(0, main.getBoundingClientRect().left) : 0;
    var bottom = 0;
    var tab = document.querySelector('.tab-bar');
    if (tab && getComputedStyle(tab).display !== 'none') {
      bottom = Math.max(0, vh - tab.getBoundingClientRect().top);
    }
    return { left: left, bottom: bottom };
  }

  /**
   * The stack: rects become a narrow column just outside the left or right screen edge,
   * vertically centred, in their top-down order. Returns per-rect { dx, dy, s } from the rect
   * (centre) to its place in the stack.
   */
  function stackTransforms(rects, side, clip) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    if (!rects.length) return [];
    var maxW = Math.max.apply(null, rects.map(function (r) { return r.width; }));
    var ratio = parseFloat(token('--tectonic-stack-width', '0.08')) || 0.08;
    var s = Math.min(0.2, Math.max(0.06, (vw * ratio) / Math.max(1, maxW)));
    var gap = 3;
    var order = rects.map(function (r, i) { return i; }).sort(function (a, b) {
      return rects[a].top - rects[b].top || rects[a].left - rects[b].left;
    });
    var total = order.reduce(function (sum, i) { return sum + rects[i].height * s; }, 0) + gap * (rects.length - 1);
    var y = (vh - clip.bottom) / 2 - total / 2;
    var stackW = maxW * s;
    var cx = side === 'left' ? clip.left - 16 - stackW / 2 : vw + 16 + stackW / 2;
    var out = [];
    order.forEach(function (i) {
      var r = rects[i];
      var h = r.height * s;
      out[i] = {
        dx: cx - (r.left + r.width / 2),
        dy: (y + h / 2) - (r.top + r.height / 2),
        s: s
      };
      y += h + gap;
    });
    return out;
  }

  function stackFrame(t) {
    return 'translate(' + px(t.dx) + ', ' + px(t.dy) + ') scale(' + t.s.toFixed(3) + ')';
  }

  /* Leading column first: the sections nearest to the edge they travel to/from move first. */
  function leadingOrder(rects, side) {
    return rects.map(function (r, i) { return i; }).sort(function (a, b) {
      var ra = rects[a], rb = rects[b];
      var ka = side === 'left' ? ra.left : -ra.right;
      var kb = side === 'left' ? rb.left : -rb.right;
      return Math.round(ka - kb) || ra.top - rb.top;
    });
  }

  /* ── arriving: sections come out of the stack ───────── */

  function run() {
    var view = document.querySelector('.view.view--active');
    if (!view || typeof view.animate !== 'function') {
      root.classList.remove(PENDING);
      removeGhostLayer();
      return;
    }

    var fromSide = root.classList.contains('section-build--from-right') ? 'right' : 'left';
    var carousel = root.classList.contains('section-build--carousel');
    var clip = stageClip();

    /* Deeper / back: arrivals are timed from the moment the old cards started leaving (shared
       clock set by section-build-boot.js), so the overlap is the same however long loading took. */
    var since = typeof window.__uzHandoverStart === 'number' ? performance.now() - window.__uzHandoverStart : 0;
    var c = carousel
      ? { delay: Math.max(0, ms('--tectonic-arrive-delay', 260) - since), duration: ms('--tectonic-arrive-duration', 400),
          stagger: ms('--tectonic-arrive-stagger', 40), easing: token('--tectonic-arrive-ease', 'cubic-bezier(0.33, 1, 0.68, 1)') }
      : { delay: 0, duration: ms('--tectonic-container-duration', 320),
          stagger: ms('--tectonic-container-stagger', 50), easing: token('--tectonic-container-ease', 'cubic-bezier(0.22, 1, 0.36, 1)') };
    var t = {
      duration: carousel ? ms('--tectonic-content-duration', 200) : ms('--tectonic-content-duration-dashboard', 220),
      stagger: ms('--tectonic-content-stagger', 30),
      easing: token('--tectonic-content-ease', 'cubic-bezier(0.22, 1, 0.36, 1)'),
      fromX: (fromSide === 'left' ? '-' : '') + token('--tectonic-content-from-x', '12px').replace(/^-/, ''),
      handoff: parseFloat(token('--tectonic-content-handoff', '0.7')) || 0.7
    };

    var main = document.querySelector('.main-content');
    var anims = [];

    var all = collectSections(view);
    var inView = all.filter(inViewport);
    var rects = inView.map(function (el) { return el.getBoundingClientRect(); });
    var stack = stackTransforms(rects, fromSide, clip);
    var lastStart = c.delay;

    leadingOrder(rects, fromSide).forEach(function (idx, i) {
      var section = inView[idx];
      var start = c.delay + Math.min(i, MAX_STAGGERED_SECTIONS) * c.stagger;
      lastStart = Math.max(lastStart, start);

      /* Container: out of the stack, growing into place; the panel fades in over the first half */
      anims.push(section.animate(
        [
          { opacity: 0, transform: stackFrame(stack[idx]), offset: 0 },
          { opacity: 1, offset: 0.5 },
          { opacity: 1, transform: 'none', offset: 1 }
        ],
        { duration: c.duration, delay: start, easing: c.easing, fill: 'backwards' }
      ));

      /* Content: once the container is ~70 % in place */
      var contentStart = start + c.duration * t.handoff;
      collectContent(section).forEach(function (item, j) {
        anims.push(item.animate(
          [
            { opacity: 0, transform: 'translateX(' + t.fromX + ')' },
            { opacity: 1, transform: 'none' }
          ],
          { duration: t.duration, delay: contentStart + Math.min(j, MAX_STAGGERED_ITEMS) * t.stagger,
            easing: t.easing, fill: 'backwards' }
        ));
      });
    });

    /* Sections below the fold simply appear with the last one. */
    all.filter(function (s) { return inView.indexOf(s) === -1; }).forEach(function (s) {
      anims.push(s.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: c.duration * 0.5, delay: lastStart + c.duration * 0.5, fill: 'backwards' }));
    });

    /* The old page's stand-in cards are already leaving (started at first paint by
       js/section-build-boot.js); they're removed when this build-up is done. */

    /* Animations are in place (fill: backwards hides them) — reveal the view in the same frame. */
    if (main) main.classList.add('main-content--page-transition');
    root.classList.add(RUNNING);
    root.classList.remove(PENDING, 'section-build--from-left', 'section-build--from-right', 'section-build--carousel');

    /* Interruption: any press or key jumps straight to the end state. */
    function finishAll() {
      anims.forEach(function (a) { try { a.finish(); } catch (err) { /* ignore */ } });
    }
    document.addEventListener('pointerdown', finishAll, { capture: true, once: true });
    document.addEventListener('keydown', finishAll, { capture: true, once: true });

    Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); })).then(function () {
      document.removeEventListener('pointerdown', finishAll, { capture: true });
      document.removeEventListener('keydown', finishAll, { capture: true });
      removeGhostLayer();
      if (main) main.classList.remove('main-content--page-transition');
      root.classList.remove(RUNNING);
      try { window.dispatchEvent(new CustomEvent('uz:sections-built')); } catch (err) { /* ignore */ }
    });
  }

  /* ── the old page's cards, drawn on the new page by section-build-boot.js ── */

  function ghostLayer() { return document.getElementById('uz-ghost-layer'); }

  function removeGhostLayer() {
    var layer = ghostLayer();
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
  }

  /* ── leaving: step 1 on the old page, then hand over ── */

  function surfaceOf(el) {
    var cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      radius: cs.borderRadius,
      border: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
      shadow: cs.boxShadow
    };
  }

  /**
   * leave('forward' | 'back', targetPath) → Promise
   * Only the content fades here — no movement before the hand-over (moving, pausing while the
   * next page loads and moving again reads as a stutter). Then the outline of every card in
   * view is saved; the next page draws them and runs the whole movement in one go.
   */
  function leave(direction, targetPath) {
    var view = document.querySelector('.view.view--active');
    if (!view || typeof view.animate !== 'function') return Promise.resolve();
    reset();

    /* Build-ups still running (a quick tap) — land them first. */
    if (document.getAnimations) {
      document.getAnimations().forEach(function (a) {
        try { if (a.effect && a.effect.getComputedTiming().fill === 'backwards') a.finish(); } catch (e) { /* ignore */ }
      });
    }

    var d = ms('--tectonic-handover-fade', 120);

    var main = document.querySelector('.main-content');
    if (main) main.classList.add('main-content--page-transition');
    root.classList.add(LEAVING);

    var sections = collectSections(view).filter(inViewport);
    var anims = [];
    sections.forEach(function (section) {
      collectContent(section).forEach(function (item) {
        anims.push(item.animate([{ opacity: 1 }, { opacity: 0 }], { duration: d, easing: 'linear', fill: 'forwards' }));
      });
    });
    /* Anything else in view (outside the sections) goes with the content. */
    collectSections(view).filter(function (s) { return !inViewport(s); }).forEach(function (s) {
      anims.push(s.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: 'forwards' }));
    });
    leaveAnims = anims;

    return Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); })).then(function () {
      var clip = stageClip();
      var items = sections.map(function (el) {
        var paint = surfaceEl(el) || el;   /* outline + colours of what actually paints the card */
        var r = paint.getBoundingClientRect();
        var sf = surfaceOf(paint);
        return { x: r.left, y: r.top, w: r.width, h: r.height, bg: sf.bg, radius: sf.radius, border: sf.border, shadow: sf.shadow };
      }).filter(function (it) { return it.w > 0 && it.h > 0; });
      try {
        sessionStorage.setItem(GHOSTS_KEY, JSON.stringify({
          to: targetPath, dir: direction, t: Date.now(),
          vw: window.innerWidth, vh: window.innerHeight,
          clipLeft: clip.left, clipBottom: clip.bottom, items: items
        }));
      } catch (e) { /* ignore */ }
    });
  }

  /* Undo a leave — e.g. the page comes back from the browser's back/forward cache. */
  function reset() {
    leaveAnims.forEach(function (a) { try { a.cancel(); } catch (e) { /* ignore */ } });
    leaveAnims = [];
    root.classList.remove(LEAVING);
    var main = document.querySelector('.main-content');
    if (main && !root.classList.contains(RUNNING)) main.classList.remove('main-content--page-transition');
  }

  window.UZSectionBuild = { leave: leave, reset: reset };

  function start() {
    if (!root.classList.contains(PENDING)) {
      removeGhostLayer();
      return;
    }
    /* Two frames: let the other DOMContentLoaded renderers (bookings, profile panels) lay out first. */
    requestAnimationFrame(function () { requestAnimationFrame(run); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
