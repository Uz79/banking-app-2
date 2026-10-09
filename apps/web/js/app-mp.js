/**
 * UZ Bank Web — multi-page shell (no in-page view switching).
 * Theme toggle, carousel on account details, trivial toggles.
 * Payment UI lives in payment-overlay.js (modal + #pay/… hash / history).
 *
 * Colours: Profile > Theme (js/theme-engine.js) stores the finished --color-*
 * tokens for both shells in uzBankWebColorTokens. Here we only apply them (on
 * load and on the sidebar Light/Dark switch). No entry = tokens.css (UZ Bank).
 * Legacy WebApp_* keys are migrated in storage-migrate.js.
 */
(function (global) {
  'use strict';

  var THEME_KEY = 'uzBankWebTheme';
  var TOKEN_CACHE_KEY = 'uzBankWebColorTokens';
  var THEME_OVERRIDE_KEY = 'uzBankWebColorOverride_v2';
  var APPEARANCE_KEY = 'uzBankWebAppearance';

  /* The old { bg, fg } override is no longer read anywhere. */
  try { global.localStorage.removeItem('uzBankWebColorOverride'); } catch (err0) {}

  /**
   * Copy the cached --color-* tokens for a shell onto <html>, replacing any
   * previous inline colour tokens. No cache = tokens.css (UZ Bank look).
   */
  function applyColorTokens(shell) {
    var style = document.documentElement.style;
    var names = [];
    for (var i = 0; i < style.length; i++) {
      if (style[i].indexOf('--color-') === 0) names.push(style[i]);
    }
    names.forEach(function (n) { style.removeProperty(n); });
    try {
      var raw = global.localStorage.getItem(TOKEN_CACHE_KEY);
      if (!raw) return;
      var all = JSON.parse(raw);
      var map = all && all[shell];
      if (!map) return;
      for (var k in map) style.setProperty('--' + k, map[k]);
    } catch (err) {}
  }
  global.UZBankApplyColorTokens = applyColorTokens;

  /**
   * Sidebar Light/Dark: each saved theme remembers its own Light and Dark
   * contrast (precomputed when it was saved), so switching only applies the
   * other shell's cached tokens. Profile > Theme re-syncs via uzbank:picker-sync.
   */
  function UZBankApplyThemeChoice(wantTheme) {
    if (wantTheme !== 'light' && wantTheme !== 'dark') return;
    applyColorTokens(wantTheme);
    applyTheme(wantTheme);
    try {
      document.dispatchEvent(
        new CustomEvent('uzbank:picker-sync', { bubbles: true, detail: { theme: wantTheme } })
      );
    } catch (e2) {}
  }

  global.UZBankApplyThemeChoice = UZBankApplyThemeChoice;

  /** Back to the UZ Bank look (tokens.css): drop the custom theme. */
  function applyCanonicalColors(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    try {
      global.localStorage.removeItem(THEME_OVERRIDE_KEY);
      global.localStorage.removeItem(TOKEN_CACHE_KEY);
      global.localStorage.setItem('uzBankWebPreferBankDefault', '1');
    } catch (err) {}
    applyColorTokens(theme);
  }
  global.UZBankApplyCanonicalColors = applyCanonicalColors;

  /* ── App-wide appearance scale (Profile > Legibility / Persona) ─── */

  var APPEARANCE_PRESETS = {
    small: { size: 'small', fontScale: 0.9, spaceScale: 0.86, persona: 'power' },
    regular: { size: 'regular', fontScale: 1, spaceScale: 1, persona: 'standard' },
    large: { size: 'large', fontScale: 1.16, spaceScale: 1.14, persona: 'novice' }
  };

  var FONT_FAMILIES = {
    'profile-pro': "'Profile Pro', sans-serif",
    'dm-sans': "'DM Sans', sans-serif",
    inter: "'Inter', sans-serif",
    'space-grotesk': "'Space Grotesk', sans-serif",
    'source-serif-4': "'Source Serif 4', serif",
    georgia: "Georgia, 'Times New Roman', serif"
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

  /* Persona profile from Profile > User Type. 'beatrice' / 'max' are the two-card
     version's values; keep reading them so stored settings carry over. */
  var PERSONA_ALIASES = { beatrice: 'novice', max: 'power', novice: 'novice', standard: 'standard', power: 'power' };

  function normalizePersona(raw) {
    return PERSONA_ALIASES[raw] || 'custom';
  }

  function normalizeFontFamily(raw) {
    var key = String(raw || '').trim();
    return FONT_FAMILIES[key] ? key : 'profile-pro';
  }

  function readAppearance() {
    try {
      var parsed = JSON.parse(global.localStorage.getItem(APPEARANCE_KEY) || '{}');
      return {
        size: parsed.size === 'small' || parsed.size === 'large' ? parsed.size : 'regular',
        fontScale: normalizeScale(parsed.fontScale, 1, 0.85, 1.25),
        spaceScale: normalizeScale(parsed.spaceScale, 1, 0.8, 1.25),
        persona: normalizePersona(parsed.persona),
        fontFamily: normalizeFontFamily(parsed.fontFamily)
      };
    } catch (err) {
      return { size: 'regular', fontScale: 1, spaceScale: 1, persona: 'custom', fontFamily: 'profile-pro' };
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
    settings.fontFamily = normalizeFontFamily(settings.fontFamily);
    settings.persona = normalizePersona(settings.persona);
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
    style.setProperty('--font-family', FONT_FAMILIES[settings.fontFamily]);
    document.documentElement.setAttribute('data-legibility', settings.size);
    document.documentElement.setAttribute('data-persona', settings.persona || 'custom');
    document.documentElement.setAttribute('data-font-family', settings.fontFamily);

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
    fonts: FONT_FAMILIES,
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

  function onDocumentReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onDocumentReady(function () {
    function getTheme() {
      var t = document.documentElement.getAttribute('data-theme');
      return t === 'light' || t === 'dark' ? t : 'dark';
    }

    applyColorTokens(getTheme());

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

    var SLIDE_ACCOUNTS = carouselSlides
      ? Array.prototype.map
          .call(carouselSlides.children, function (slide) {
            return slide.getAttribute('data-account-key');
          })
          .filter(Boolean)
      : [];
    if (!SLIDE_ACCOUNTS.length) SLIDE_ACCOUNTS = ['household', 'savings'];
    window.__UZ_ACTIVE_ACCOUNT__ = SLIDE_ACCOUNTS[0];

    // On overview: store which account was tapped before navigating away
    document.querySelectorAll('.product-item[data-account]').forEach(function (el) {
      el.addEventListener('click', function () {
        sessionStorage.setItem('uz_target_account', el.getAttribute('data-account'));
      });
    });

    // On account-details: jump to the correct slide based on stored account
    var targetAccount = sessionStorage.getItem('uz_target_account');
    if (targetAccount) {
      sessionStorage.removeItem('uz_target_account');
      var idx = SLIDE_ACCOUNTS.indexOf(targetAccount);
      if (idx > 0) currentSlide = idx;
    }

    function updateCarousel() {
      if (!carouselSlides) return;
      var totalSlides = carouselSlides.children.length;
      var isMid = currentSlide > 0 && currentSlide < totalSlides - 1;

      // Toggle .carousel--mid so CSS sets the correct slide width
      var carouselEl = carouselSlides.closest('.carousel');
      if (carouselEl) carouselEl.classList.toggle('carousel--mid', isMid);

      // Compute slide dimensions from known CSS values (not getBoundingClientRect, which
      // returns mid-transition values and would give wrong translate targets)
      var trackEl = carouselSlides.parentElement; // .carousel__track
      var trackWidth = trackEl ? trackEl.getBoundingClientRect().width : 0;
      var gapPx = parseFloat(getComputedStyle(carouselSlides).columnGap) || 0;
      var isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      var peekPx = isDesktop ? 5 * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : 0;
      // target slide width matches the CSS rule that will be applied after class toggle
      var slideWidth = isDesktop
        ? (isMid ? trackWidth - 2 * peekPx - 2 * gapPx : trackWidth - peekPx)
        : trackWidth;

      var totalFlexWidth = totalSlides * slideWidth + (totalSlides - 1) * gapPx;

      var translatePx;
      if (currentSlide === 0) {
        // First: flush left; right peek appears from slide being narrower than track
        translatePx = 0;
      } else if (currentSlide === totalSlides - 1) {
        // Last: flush right so slide fills to the right edge, left peek appears naturally
        translatePx = Math.max(0, totalFlexWidth - trackWidth);
      } else {
        // Mid: on desktop show peekPx of each neighbour; on mobile full-width (no peek)
        if (peekPx > 0) {
          // Desktop: offset so prev slide shows peekPx on the left
          var prevSlideEnd = (currentSlide - 1) * (slideWidth + gapPx) + slideWidth;
          translatePx = prevSlideEnd - peekPx;
        } else {
          // Mobile: natural position — current slide fills the full track
          translatePx = currentSlide * (slideWidth + gapPx);
        }
      }

      carouselSlides.style.transform = 'translateX(-' + translatePx + 'px)';

      carouselDots.forEach(function (dot, i) {
        if (i === currentSlide) {
          dot.classList.add('carousel__dot--active');
        } else {
          dot.classList.remove('carousel__dot--active');
        }
      });

      // Swap which account's bookings are visible
      var activeAccount = SLIDE_ACCOUNTS[currentSlide] || SLIDE_ACCOUNTS[0];
      document.querySelectorAll('[data-account-bookings]').forEach(function (el) {
        el.hidden = el.getAttribute('data-account-bookings') !== activeAccount;
      });
      window.__UZ_ACTIVE_ACCOUNT__ = activeAccount;

      // Sync section header account type from slide data attributes
      var slides = carouselSlides ? carouselSlides.children : [];
      var activeSlide = slides[currentSlide];
      if (activeSlide) {
        var accountTypeLabel = document.querySelector('.section-card__account-type-label');
        var accountTypeCurrency = document.querySelector('.section-card__account-type-currency');
        if (accountTypeLabel) accountTypeLabel.textContent = activeSlide.getAttribute('data-account-type') || '';
        if (accountTypeCurrency) accountTypeCurrency.textContent = activeSlide.getAttribute('data-account-currency') || 'CHF';
      }
    }

    // Clicking a clipped neighbouring slide navigates to it
    if (carouselSlides) {
      carouselSlides.addEventListener('click', function (e) {
        var clickedSlide = e.target.closest('.carousel__slide');
        if (!clickedSlide) return;
        var slides = Array.prototype.slice.call(carouselSlides.children);
        var clickedIndex = slides.indexOf(clickedSlide);
        if (clickedIndex !== -1 && clickedIndex !== currentSlide) {
          currentSlide = clickedIndex;
          updateCarousel();
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

    // Sync carousel position and bookings on initial load
    updateCarousel();

    // Recalculate pixel-based translate on resize
    window.addEventListener('resize', updateCarousel);

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

    document.addEventListener('click', function (e) {
      var bookingsBtn = e.target.closest('[data-action="show-all-bookings"]');
      if (!bookingsBtn) return;
      document.dispatchEvent(
        new CustomEvent('uz:more-functions-action', {
          bubbles: true,
          detail: { action: 'show-all-bookings' }
        })
      );
    });

    document.addEventListener('uz:more-functions-action', function (e) {
      var d = e.detail || {};
      var action = d.action;
      if (!action) return;
      var prefix = '';
      try {
        if ((window.location.pathname || '').replace(/\\/g, '/').indexOf('/payment/') !== -1) {
          prefix = '../';
        }
      } catch (err1) {}
      function go(page) {
        /* Through the shell so the page transition plays (js/shell-nav.js) */
        if (window.UZShellNav) window.UZShellNav.go(prefix + page);
        else window.location.href = prefix + page;
      }
      if (action === 'show-all-bookings') {
        var accountKey = window.__UZ_ACTIVE_ACCOUNT__ || 'savings';
        go('all-bookings-and-payments.html?account=' + encodeURIComponent(accountKey));
        return;
      }
      if (action === 'change-category') {
        go('overview.html');
        return;
      }
      if (action === 'show-account-information') {
        if (typeof window.UZBankOpenAccountInformationOverlay === 'function') {
          if (window.UZBankOpenAccountInformationOverlay()) return;
        }
        go('account-details.html#account-information');
        return;
      }
    });

    function bindMainScrollChrome() {
      var screen = document.body.getAttribute('data-screen');
      if (
        screen !== 'overview' &&
        screen !== 'payments' &&
        screen !== 'account-details' &&
        screen !== 'investment-product-details' &&
        screen !== 'details-of-position' &&
        screen !== 'design-system' &&
        screen !== 'motion-specimens' &&
        screen !== 'components' &&
        screen !== 'character-kit'
      ) {
        return;
      }

      var mainContent = document.querySelector('.main-content');
      var app = document.querySelector('.app');
      var view = document.querySelector('.view--active');
      if (!mainContent || !app || !view || !window.UZBankScrollEdgeChrome) return;
      if (!view.querySelector('[data-scroll-edge-nav]')) return;

      var bindOptions = {
        nav: '[data-scroll-edge-nav]',
        footer: '.tab-bar',
        getScrollEl: function () {
          return mainContent;
        }
      };

      window.UZBankScrollEdgeChrome.bind(app, bindOptions);
    }

    bindMainScrollChrome();
  });
})(typeof window !== 'undefined' ? window : this);
