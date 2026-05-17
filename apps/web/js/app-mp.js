/**
 * E-Banking WebApp 11 — multi-page shell (no in-page view switching).
 * Theme toggle, carousel on account details, trivial toggles.
 * Payment UI lives in payment-overlay.js (modal + #pay/… hash / history).
 *
 * NOTE: theme storage key bumped 08 -> 09 to coexist with the colour
 * override key (uzBankWebApp11ColorOverride). The override stores only
 * { bg, fg } and every other --color-* role is derived from that pair (see
 * deriveTokens in contrast-checker.js).
 */
(function (global) {
  'use strict';

  var THEME_KEY = 'uzBankWebApp11Theme';
  var OVERRIDE_KEY = 'uzBankWebApp11ColorOverride';
  var APPEARANCE_KEY = 'uzBankWebApp11Appearance';

  /** Same BG/FG as tokens.css / contrast-checker CANONICAL. */
  var CANONICAL_PAIR = {
    light: { bg: '#ffffff', fg: '#00157e' },
    dark: { bg: '#00157e', fg: '#ffffff' }
  };

  function normalizeHex6(raw) {
    if (!raw || typeof raw !== 'string') return null;
    var hex = raw.replace(/^#/, '').trim();
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    return hex.length === 6 && /^[a-f\d]{6}$/i.test(hex) ? '#' + hex.toLowerCase() : null;
  }

  function rgbFromHex6(h) {
    return {
      r: parseInt(h.slice(1, 3), 16),
      g: parseInt(h.slice(3, 5), 16),
      b: parseInt(h.slice(5, 7), 16)
    };
  }

  /** WCAG relative luminance for #rrggbb (same rule as contrast-checker / derive). */
  function relLumFromHex(hex) {
    if (!hex || hex.length !== 7) return 0;
    var c = rgbFromHex6(hex);
    function l(x) {
      x /= 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * l(c.r) + 0.7152 * l(c.g) + 0.0722 * l(c.b);
  }

  function readOverridePair() {
    try {
      var raw = global.localStorage.getItem(OVERRIDE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      var bg = normalizeHex6(String(o.bg || ''));
      var fg = normalizeHex6(String(o.fg || ''));
      return bg && fg ? { bg: bg, fg: fg } : null;
    } catch (err) {
      return null;
    }
  }

  /** Current surface pair: saved override or computed --color-bg/--color-fg. */
  function readCurrentSurfacePair() {
    var saved = readOverridePair();
    if (saved) return saved;
    var cs = getComputedStyle(document.documentElement);
    var bg = normalizeHex6(cs.getPropertyValue('--color-bg').trim());
    var fg = normalizeHex6(cs.getPropertyValue('--color-fg').trim());
    return {
      bg: bg || CANONICAL_PAIR.dark.bg,
      fg: fg || CANONICAL_PAIR.dark.fg
    };
  }

  /**
   * Sidebar Light/Dark: keep the user's custom BG/FG (like Reverse colours),
   * only swap roles when needed so shell polarity matches the chosen theme,
   * then persist + derived tokens + data-theme + Profile picker sync.
   */
  function UZBankApplyThemeChoice(wantTheme) {
    if (wantTheme !== 'light' && wantTheme !== 'dark') return;
    var pair = readCurrentSurfacePair();
    var bg = pair.bg;
    var fg = pair.fg;
    var isDarkPolar = relLumFromHex(bg) < relLumFromHex(fg);
    var wantDark = wantTheme === 'dark';
    if (wantDark !== isDarkPolar) {
      var t = bg;
      bg = fg;
      fg = t;
    }
    try {
      global.localStorage.setItem(OVERRIDE_KEY, JSON.stringify({ bg: bg, fg: fg }));
    } catch (err) {}
    applyDerivedTokensFromPair(bg, fg);
    applyTheme(wantTheme);
    try {
      document.dispatchEvent(
        new CustomEvent('uzbank:picker-sync', {
          bubbles: true,
          detail: { bg: bg, fg: fg, theme: wantTheme }
        })
      );
    } catch (e2) {}
  }

  global.UZBankApplyThemeChoice = UZBankApplyThemeChoice;

  /**
   * Writes --color-* inline on <html> from a BG/FG hex pair (mirrors boot
   * script + deriveTokens in contrast-checker.js).
   */
  function applyDerivedTokensFromPair(bgHex, fgHex) {
    function rgb(h) {
      return {
        r: parseInt(h.slice(1, 3), 16),
        g: parseInt(h.slice(3, 5), 16),
        b: parseInt(h.slice(5, 7), 16)
      };
    }
    function hex(r, g, b) {
      function p(x) {
        return Math.round(x)
          .toString(16)
          .padStart(2, '0');
      }
      return '#' + p(r) + p(g) + p(b);
    }
    function lum(c) {
      function l(x) {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * l(c.r) + 0.7152 * l(c.g) + 0.0722 * l(c.b);
    }
    var bg = rgb(bgHex);
    var fg = rgb(fgHex);
    var isDark = lum(bg) < lum(fg);
    function mix(a, b, t) {
      return hex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
    }
    function fa(a) {
      return 'rgba(' + fg.r + ',' + fg.g + ',' + fg.b + ',' + a + ')';
    }
    function ba(a) {
      return 'rgba(0,0,0,' + a + ')';
    }
    var bgE = isDark ? 0.22 : 0.07;
    var fgE = isDark ? 0.06 : 0.22;
    var tokens = {
      'color-bg': bgHex,
      'color-bg-secondary': mix(bg, fg, bgE),
      'color-bg-sidebar': bgHex,
      'color-fg': fgHex,
      'color-fg-secondary': mix(fg, bg, fgE),
      'color-fg-label': fa(0.7),
      'color-fg-disabled': fa(0.4),
      'color-separator': fa(0.1),
      'color-show-all-bg': fa(0.1),
      'color-nav-item-active-bg': fa(0.1),
      'color-segmented-track-bg': fa(0.05),
      'color-input-stroke': fa(0.7),
      'color-input-stroke-focus': fgHex,
      'color-icon-circle-fill': fgHex,
      'color-btn-primary-bg': fgHex,
      'color-btn-primary-fg': bgHex,
      'color-btn-primary-hover': mix(fg, bg, fgE),
      'color-btn-primary-pressed': mix(fg, bg, Math.min(0.45, fgE * 1.75)),
      'color-btn-secondary-bg': 'transparent',
      'color-btn-secondary-border': fgHex,
      'color-btn-secondary-fg': fgHex,
      'color-btn-secondary-hover': fa(0.1),
      'color-btn-secondary-pressed': fa(0.2),
      'color-btn-tonal-bg': mix(bg, fg, isDark ? 0.28 : 0.08),
      'color-btn-tonal-border': mix(bg, fg, isDark ? 0.28 : 0.08),
      'color-btn-tonal-fg': fgHex,
      'color-btn-tonal-hover': mix(bg, fg, isDark ? 0.38 : 0.14),
      'color-btn-tonal-pressed': mix(bg, fg, isDark ? 0.48 : 0.22),
      'color-overlay-scrim': ba(isDark ? 0.62 : 0.45),
      'color-nav-elevated-shadow': ba(isDark ? 0.35 : 0.06),
      'color-modal-elevated-shadow': ba(isDark ? 0.45 : 0.12),
      'color-surface-state-hover': fa(0.1),
      'color-surface-state-pressed': fa(0.2),
      'color-action-circle-state-hover': isDark
        ? 'rgba(0, 21, 126, 0.1)'
        : 'rgba(255, 255, 255, 0.12)',
      'color-action-circle-state-pressed': isDark
        ? 'rgba(0, 21, 126, 0.2)'
        : 'rgba(255, 255, 255, 0.22)'
    };
    var s = document.documentElement.style;
    for (var k in tokens) s.setProperty('--' + k, tokens[k]);
  }

  /**
   * Persist canonical { bg, fg } and apply derived tokens (e.g. reset flows).
   * Sidebar Light/Dark uses UZBankApplyThemeChoice so custom colours stay
   * aligned with Reverse colours behaviour.
   */
  function applyCanonicalColors(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    var pair = CANONICAL_PAIR[theme];
    try {
      global.localStorage.setItem(OVERRIDE_KEY, JSON.stringify({ bg: pair.bg, fg: pair.fg }));
    } catch (err) {}
    applyDerivedTokensFromPair(pair.bg, pair.fg);
  }

  global.UZBankApplyCanonicalColors = applyCanonicalColors;

  /* ── App-wide appearance scale (Profile > Legibility / Persona) ─── */

  var APPEARANCE_PRESETS = {
    small: { size: 'small', fontScale: 0.9, spaceScale: 0.86, persona: 'max' },
    regular: { size: 'regular', fontScale: 1, spaceScale: 1, persona: 'custom' },
    large: { size: 'large', fontScale: 1.16, spaceScale: 1.14, persona: 'beatrice' }
  };

  var APPEARANCE_VAR_NAMES = [
    'space-1', 'space-2', 'space-3', 'space-4', 'space-5', 'space-6',
    'space-7', 'space-8', 'space-9', 'space-10', 'space-11', 'space-12',
    'fs-hero', 'fs-h1', 'fs-h2', 'fs-h3', 'fs-h4', 'fs-h5', 'fs-h6',
    'fs-text-lg', 'fs-text-md', 'fs-text-sm', 'fs-text-xs', 'fs-caption'
  ];

  function normalizeScale(raw, fallback, min, max) {
    var n = Number(raw);
    if (!isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function readAppearance() {
    try {
      var parsed = JSON.parse(global.localStorage.getItem(APPEARANCE_KEY) || '{}');
      return {
        size: parsed.size === 'small' || parsed.size === 'large' ? parsed.size : 'regular',
        fontScale: normalizeScale(parsed.fontScale, 1, 0.85, 1.25),
        spaceScale: normalizeScale(parsed.spaceScale, 1, 0.8, 1.25),
        persona: parsed.persona === 'beatrice' || parsed.persona === 'max' ? parsed.persona : 'custom'
      };
    } catch (err) {
      return { size: 'regular', fontScale: 1, spaceScale: 1, persona: 'custom' };
    }
  }

  function parseLength(value) {
    var raw = String(value || '').trim();
    var n = parseFloat(raw);
    if (!isFinite(n)) return null;
    if (raw.endsWith('px')) return n / 16;
    return n;
  }

  function rem(value) {
    return Number(value).toFixed(4).replace(/\.?0+$/, '') + 'rem';
  }

  function applyAppearance(next) {
    var current = readAppearance();
    var settings = Object.assign({}, current, next || {});
    settings.fontScale = normalizeScale(settings.fontScale, 1, 0.85, 1.25);
    settings.spaceScale = normalizeScale(settings.spaceScale, 1, 0.8, 1.25);
    if (settings.fontScale < 0.96 || settings.spaceScale < 0.94) settings.size = 'small';
    else if (settings.fontScale > 1.08 || settings.spaceScale > 1.08) settings.size = 'large';
    else settings.size = 'regular';

    var style = document.documentElement.style;
    APPEARANCE_VAR_NAMES.forEach(function (name) { style.removeProperty('--' + name); });
    var cs = getComputedStyle(document.documentElement);
    APPEARANCE_VAR_NAMES.forEach(function (name) {
      var base = parseLength(cs.getPropertyValue('--' + name));
      if (base == null) return;
      var factor = name.indexOf('fs-') === 0 ? settings.fontScale : settings.spaceScale;
      style.setProperty('--' + name, rem(base * factor));
    });
    style.setProperty('--appearance-font-scale', String(settings.fontScale));
    style.setProperty('--appearance-space-scale', String(settings.spaceScale));
    document.documentElement.setAttribute('data-legibility', settings.size);
    document.documentElement.setAttribute('data-persona', settings.persona || 'custom');

    try { global.localStorage.setItem(APPEARANCE_KEY, JSON.stringify(settings)); } catch (err2) {}
    try {
      document.dispatchEvent(new CustomEvent('uzbank:appearance-change', { bubbles: true, detail: settings }));
    } catch (err3) {}
    return settings;
  }

  function applyAppearancePreset(size, persona) {
    var preset = APPEARANCE_PRESETS[size] || APPEARANCE_PRESETS.regular;
    return applyAppearance(Object.assign({}, preset, persona ? { persona: persona } : {}));
  }

  global.UZBankAppearance = {
    key: APPEARANCE_KEY,
    presets: APPEARANCE_PRESETS,
    read: readAppearance,
    apply: applyAppearance,
    applyPreset: applyAppearancePreset
  };

  applyAppearance(readAppearance());

  /**
   * Persist Light/Dark, update <html data-theme>, sidebar segmented UI, and
   * meta color-scheme. Exposed for contrast-checker (Reverse colours sync).
   */
  function applyTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    try {
      global.localStorage.setItem(THEME_KEY, theme);
    } catch (err) {}
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.segmented--theme .segmented__option').forEach(function (btn) {
      var v = btn.getAttribute('data-set-theme');
      if (v === theme) btn.classList.add('segmented__option--active');
      else btn.classList.remove('segmented__option--active');
    });
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? 'light dark' : 'dark light');
  }

  global.UZBankApplyTheme = applyTheme;

  document.addEventListener('DOMContentLoaded', function () {
    function getTheme() {
      var t = document.documentElement.getAttribute('data-theme');
      return t === 'light' || t === 'dark' ? t : 'dark';
    }

    applyTheme(getTheme());

    var carouselSlides = document.querySelector('.carousel__slides');
    var carouselArrows = document.querySelectorAll('.carousel__arrow');
    var carouselDots = document.querySelectorAll('.carousel__dot');
    var currentSlide = 0;
    var touchStartX = 0;
    var touchDeltaX = 0;

    function getSlideCount() {
      if (!carouselSlides) return 0;
      return carouselSlides.children.length;
    }

    function updateCarousel() {
      if (!carouselSlides) return;
      carouselSlides.style.transform =
        'translateX(calc(-' + (currentSlide * 100) + '% - ' + currentSlide + 'rem))';

      carouselDots.forEach(function (dot, i) {
        if (i === currentSlide) {
          dot.classList.add('carousel__dot--active');
        } else {
          dot.classList.remove('carousel__dot--active');
        }
      });
    }

    if (carouselArrows.length >= 2) {
      carouselArrows[0].addEventListener('click', function () {
        if (currentSlide > 0) {
          currentSlide--;
          updateCarousel();
        }
      });

      carouselArrows[1].addEventListener('click', function () {
        if (currentSlide < getSlideCount() - 1) {
          currentSlide++;
          updateCarousel();
        }
      });
    }

    carouselDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        currentSlide = i;
        updateCarousel();
      });
    });

    if (carouselSlides) {
      carouselSlides.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
      }, { passive: true });

      carouselSlides.addEventListener('touchmove', function (e) {
        touchDeltaX = e.touches[0].clientX - touchStartX;
      }, { passive: true });

      carouselSlides.addEventListener('touchend', function () {
        if (Math.abs(touchDeltaX) >= 50) {
          if (touchDeltaX < 0 && currentSlide < getSlideCount() - 1) {
            currentSlide++;
          } else if (touchDeltaX > 0 && currentSlide > 0) {
            currentSlide--;
          }
          updateCarousel();
        }
        touchStartX = 0;
        touchDeltaX = 0;
      });
    }

    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('.toggle');
      if (toggle) {
        toggle.classList.toggle('toggle--active');
        var thumb = toggle.querySelector('.toggle__thumb');
        if (thumb) thumb.classList.toggle('toggle__thumb--active');
      }
    });

    document.addEventListener('click', function (e) {
      var option = e.target.closest('.segmented__option');
      if (!option) return;

      var parent = option.parentElement;
      if (!parent) return;

      if (parent.classList.contains('segmented--theme')) {
        var theme = option.getAttribute('data-set-theme');
        if (theme === 'light' || theme === 'dark') {
          UZBankApplyThemeChoice(theme);
        }
        return;
      }

      parent.querySelectorAll('.segmented__option').forEach(function (sib) {
        sib.classList.remove('segmented__option--active');
      });
      option.classList.add('segmented__option--active');
    });

    /* ── Demo data reset (Profile page) ─────────────────────────────
     * Clears saved bookings + restores the Household balance to its
     * initial value. Delegated so the handler works even if the button
     * is added/removed dynamically by future iterations of Profile. */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('#demoResetBtn');
      if (!btn) return;
      if (window.UZBankPayState && typeof window.UZBankPayState.reset === 'function') {
        window.UZBankPayState.reset();
        var prev = btn.textContent;
        btn.textContent = 'Reset ✓';
        btn.disabled = true;
        setTimeout(function () { btn.textContent = prev; btn.disabled = false; }, 1200);
      }
    });
  });
})(typeof window !== 'undefined' ? window : this);
