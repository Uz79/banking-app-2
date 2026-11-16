/**
 * Profile > User Type — persona sliders (Figma: banking-app_main-view-profile_setting-persona).
 *
 * Three sliders (financial knowledge, banking products, digital affinity) set a
 * persona profile: novice, standard or power user. The average of the three picks
 * the profile (title, story, UI preview, legibility preset); each slider also owns
 * part of the 3D character so the figure changes while the user drags:
 *   financial knowledge → headwear (the head is always the Rogue's)
 *   banking products    → outfit + back (more gear = more products)
 *   digital affinity    → animation loop (idle → walk → run)
 *
 * The character itself is rendered by js/profile-persona-character.js, which listens
 * for `uzbank:persona-change`. Slider values persist in localStorage
 * (`uzBankWebPersonaProfile`); the legibility preset goes through UZBankAppearance.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'uzBankWebPersonaProfile';
  var SLIDERS = ['knowledge', 'products', 'digital'];

  var PROFILES = {
    novice: {
      title: 'Newbie',
      name: 'Beat',
      legibility: 'large',
      storyTitle: 'This is a story about Beat',
      story: 'Beat opened his first account last spring. He checks his balance, pays a few bills and likes it when the app shows only what he needs today. Everything else can wait until he asks for it.',
      previewText: 'As a novice type of user, we think a lower density UI would fit your needs better.',
      preview: 'assets/images/persona/ui-preview-novice.png'
    },
    standard: {
      title: 'All-rounder',
      name: 'Lena',
      legibility: 'regular',
      storyTitle: 'This is a story about Lena',
      story: 'Lena runs a household account, a savings account and her pillar 3a. She pays most bills from her phone and likes to see account numbers and offers at a glance, as long as the screen stays calm.',
      previewText: 'As a standard type of user, you get account details and offers in a balanced layout.',
      preview: 'assets/images/persona/ui-preview-standard.png'
    },
    power: {
      title: 'Power user',
      name: 'Max',
      legibility: 'small',
      storyTitle: 'This is a story about Max',
      story: 'Max manages several accounts and an investment deposit. He follows performance over time, compares periods and wants charts, figures and shortcuts on the first screen. Density does not scare him, searching does.',
      previewText: 'As a power user, you get the densest UI: charts, details and offers right on the first screen.',
      preview: 'assets/images/persona/ui-preview-power.png'
    }
  };

  /* Slider tiers: 0–33 low, 34–66 medium, 67–100 high. */
  var PARTS = {
    knowledge: { headwear: ['none', 'helmet', 'hat'] },
    products: { outfit: ['barbarian', 'ranger', 'knight'], back: ['none', 'quiver', 'cape'] },
    digital: { loop: ['Idle_A', 'Walking_A', 'Running_A'] }
  };
  var TIER_WORDS = {
    knowledge: ['low', 'medium', 'high'],
    products: ['few', 'some', 'many'],
    digital: ['low', 'medium', 'high']
  };

  /* Three anchors per slider; the thumb snaps to the nearest one. */
  var ANCHORS = [0, 50, 100];
  var MAGNET = 7;           /* while dragging, pull onto an anchor within ±7 */
  var SNAP_MS = 220;        /* release: glide to the nearest anchor */
  var DEFAULTS = { knowledge: 0, products: 0, digital: 0 };

  function nearestAnchor(v) {
    return ANCHORS.reduce(function (best, a) { return Math.abs(a - v) < Math.abs(best - v) ? a : best; }, ANCHORS[0]);
  }

  function clamp(n) {
    n = Number(n);
    return isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null;
  }

  function tier(v) {
    return v < 34 ? 0 : v < 67 ? 1 : 2;
  }

  function profileFor(values) {
    var avg = (values.knowledge + values.products + values.digital) / 3;
    return avg < 34 ? 'novice' : avg < 67 ? 'standard' : 'power';
  }

  function recipeFor(values) {
    var r = { head: 'rogue' }; /* one face for every profile; the headwear carries the change */
    SLIDERS.forEach(function (key) {
      var t = tier(values[key]);
      Object.keys(PARTS[key]).forEach(function (slot) { r[slot] = PARTS[key][slot][t]; });
    });
    return r;
  }

  function read() {
    var values = Object.assign({}, DEFAULTS);
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (parsed) SLIDERS.forEach(function (k) { var v = clamp(parsed[k]); if (v != null) values[k] = nearestAnchor(v); });
      else {
        /* First visit after the two-card version: seed from the old persona choice. */
        var legacy = window.UZBankAppearance && window.UZBankAppearance.read && window.UZBankAppearance.read().persona;
        var seed = legacy === 'power' ? 100 : legacy === 'standard' ? 50 : null;
        if (seed != null) SLIDERS.forEach(function (k) { values[k] = seed; });
      }
    } catch (err) {}
    return values;
  }

  function write(values) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); } catch (err) {}
  }

  function snapshot(values) {
    var profile = profileFor(values);
    return { values: values, profile: profile, name: PROFILES[profile].name, recipe: recipeFor(values) };
  }

  window.UZBankPersona = {
    key: STORAGE_KEY,
    profiles: PROFILES,
    read: function () { return snapshot(read()); }
  };

  /* ── Panel UI ─────────────────────────────────────────────────────────── */

  var panel = document.getElementById('profilePanelPersona');
  if (!panel) return;

  var inputs = {};
  SLIDERS.forEach(function (k) { inputs[k] = panel.querySelector('[data-persona-slider="' + k + '"]'); });
  var titleEl = panel.querySelector('[data-persona-title]');
  var storyTitleEl = panel.querySelector('[data-persona-story-title]');
  var storyEl = panel.querySelector('[data-persona-story]');
  var previewTextEl = panel.querySelector('[data-persona-preview-text]');
  var previewEl = panel.querySelector('[data-persona-preview]');
  var nameEl = panel.querySelector('[data-persona-name]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var values = read();
  var currentProfile = null;

  function updateProgress(input) {
    if (!input) return;
    input.style.setProperty('--cc-progress', ((Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100 + '%');
  }

  function render(emit) {
    SLIDERS.forEach(function (k) {
      var input = inputs[k];
      if (!input) return;
      input.value = values[k];
      input.setAttribute('aria-valuetext', TIER_WORDS[k][tier(values[k])]);
      updateProgress(input);
    });

    var snap = snapshot(values);
    var p = PROFILES[snap.profile];
    if (snap.profile !== currentProfile) {
      currentProfile = snap.profile;
      panel.setAttribute('data-persona-profile', snap.profile);
      if (titleEl) titleEl.textContent = p.title;
      if (storyTitleEl) storyTitleEl.textContent = p.storyTitle;
      if (storyEl) storyEl.textContent = p.story;
      if (previewTextEl) previewTextEl.textContent = p.previewText;
      if (nameEl) nameEl.textContent = p.name;
      showPreview(snap.profile);
    }
    if (emit) {
      try { document.dispatchEvent(new CustomEvent('uzbank:persona-change', { detail: snap })); } catch (err) {}
    }
  }

  /* ── UI preview: Figma renders recoloured into the live theme ─────────── */
  /* The renders use exactly three app colours (bg #FFFFFF, bg-secondary #F1F2F8,
     fg #00157E). Each pixel's luminance is mapped piecewise onto the current
     --color-bg / --color-bg-secondary / --color-fg, so the preview follows Light,
     Dark and custom colour overrides. */

  var previewImages = {};
  var previewToken = 0;
  var SRC = { bg: [255, 255, 255], bg2: [241, 242, 248], fg: [0, 21, 126] };

  function lum(rgb) { return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; }

  function cssColor(name) {
    var probe = document.createElement('span');
    probe.style.color = 'var(' + name + ')';
    probe.style.display = 'none';
    document.body.appendChild(probe);
    var s = getComputedStyle(probe).color;
    probe.remove();
    var m = s.replace(/^color\(srgb/, '').match(/[\d.]+/g) || [0, 0, 0];
    var k = s.indexOf('color(srgb') === 0 ? 255 : 1; /* color-mix() resolves to color(srgb 0–1 …) */
    return [Number(m[0]) * k, Number(m[1]) * k, Number(m[2]) * k];
  }

  function themeColors() {
    return { bg: cssColor('--color-bg'), bg2: cssColor('--color-bg-secondary'), fg: cssColor('--color-fg') };
  }

  function loadImage(src) {
    if (previewImages[src]) return previewImages[src];
    previewImages[src] = new Promise(function (resolve, reject) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
    return previewImages[src];
  }

  function recolor(img, colors) {
    var c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    var ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, c.width, c.height);
    var d = data.data;
    var yBg = lum(SRC.bg), yBg2 = lum(SRC.bg2), yFg = lum(SRC.fg);
    for (var i = 0; i < d.length; i += 4) {
      var y = lum([d[i], d[i + 1], d[i + 2]]);
      var a, b, t;
      if (y >= yBg2) { a = colors.bg2; b = colors.bg; t = (y - yBg2) / (yBg - yBg2); }
      else { a = colors.fg; b = colors.bg2; t = (y - yFg) / (yBg2 - yFg); }
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      d[i] = a[0] + (b[0] - a[0]) * t;
      d[i + 1] = a[1] + (b[1] - a[1]) * t;
      d[i + 2] = a[2] + (b[2] - a[2]) * t;
    }
    ctx.putImageData(data, 0, 0);
    c.className = 'profile-persona-preview__image';
    c.setAttribute('aria-hidden', 'true');
    return c;
  }

  function showPreview(profile) {
    if (!previewEl) return;
    var token = ++previewToken;
    var src = PROFILES[profile].preview;
    previewEl.setAttribute('aria-label', 'UI preview: overview screen for the ' + PROFILES[profile].title.toLowerCase() + ' profile');
    loadImage(src).then(function (img) {
      if (token !== previewToken) return;
      var next = recolor(img, themeColors());
      /* Fast slider drags can switch twice within one fade: every image already
         in the preview leaves, only the newest stays in the flow. */
      var prevs = Array.prototype.slice.call(previewEl.querySelectorAll('.profile-persona-preview__image'));
      if (prevs.length && !reduceMotion.matches) {
        prevs.forEach(function (prev) {
          prev.classList.remove('profile-persona-preview__image--entering');
          prev.classList.add('profile-persona-preview__image--leaving');
          setTimeout(function () { prev.remove(); }, 300);
        });
        next.classList.add('profile-persona-preview__image--entering');
        previewEl.appendChild(next);
        previewEl.scrollTop = 0;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { next.classList.remove('profile-persona-preview__image--entering'); });
        });
      } else {
        prevs.forEach(function (prev) { prev.remove(); });
        previewEl.appendChild(next);
        previewEl.scrollTop = 0;
      }
    }).catch(function () {});
  }

  /* Re-tint the preview when the theme or a colour override changes. */
  var lastColors = '';
  function retintIfThemeChanged() {
    var key = JSON.stringify(themeColors());
    if (key === lastColors) return;
    var first = !lastColors;
    lastColors = key;
    if (!first && currentProfile) {
      loadImage(PROFILES[currentProfile].preview).then(function (img) {
        if (!previewEl) return;
        var next = recolor(img, themeColors());
        previewEl.querySelectorAll('.profile-persona-preview__image').forEach(function (prev) { prev.remove(); });
        previewEl.appendChild(next);
      }).catch(function () {});
    }
  }
  new MutationObserver(function () { requestAnimationFrame(retintIfThemeChanged); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });

  /* ── Events ───────────────────────────────────────────────────────────── */

  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  function commit(k) {
    write(values);
    applyLegibility();
    render(true);
  }

  /* Glide the thumb to an anchor, then commit. */
  function snapTo(k, target) {
    var input = inputs[k];
    var from = Number(input.value);
    if (from === target || reduceMotion.matches) {
      values[k] = target;
      render(true);
      commit(k);
      return;
    }
    var t0 = performance.now();
    input._snapToken = (input._snapToken || 0) + 1;
    var token = input._snapToken;
    (function step(now) {
      if (token !== input._snapToken) return;
      var t = Math.min(1, (now - t0) / SNAP_MS);
      values[k] = Math.round(from + (target - from) * easeOut(t));
      render(t >= 1);
      if (t < 1) requestAnimationFrame(step);
      else { values[k] = target; commit(k); }
    })(t0);
  }

  SLIDERS.forEach(function (k) {
    var input = inputs[k];
    if (!input) return;
    /* While dragging: magnetic pull near an anchor; character, title and preview follow live. */
    input.addEventListener('input', function () {
      input._snapToken = (input._snapToken || 0) + 1;
      var v = clamp(input.value);
      var a = nearestAnchor(v);
      values[k] = Math.abs(a - v) <= MAGNET ? a : v;
      render(true);
    });
    /* On release: glide to the nearest anchor, persist and apply the profile's legibility
       preset. Applying it on `input` would resize the page under the user's finger. */
    input.addEventListener('change', function () {
      snapTo(k, nearestAnchor(clamp(input.value)));
    });
    /* Keyboard moves anchor to anchor instead of 1 % steps. */
    input.addEventListener('keydown', function (e) {
      var i = ANCHORS.indexOf(nearestAnchor(values[k]));
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageUp') next = ANCHORS[Math.min(ANCHORS.length - 1, i + 1)];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'PageDown') next = ANCHORS[Math.max(0, i - 1)];
      else if (e.key === 'Home') next = ANCHORS[0];
      else if (e.key === 'End') next = ANCHORS[ANCHORS.length - 1];
      if (next == null) return;
      e.preventDefault();
      snapTo(k, next);
    });
  });

  function applyLegibility() {
    if (!window.UZBankAppearance) return;
    var profile = profileFor(values);
    var current = window.UZBankAppearance.read();
    if (current.persona === profile && current.size === PROFILES[profile].legibility) return;
    window.UZBankAppearance.applyPreset(PROFILES[profile].legibility, profile);
  }

  render(true);
  lastColors = JSON.stringify(themeColors());
})();
