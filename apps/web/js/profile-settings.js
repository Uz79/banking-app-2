(function () {
  'use strict';

  var MERGE_LEAD_PX = 14;
  var MERGE_HYSTERESIS_PX = 10;
  var MERGE_OUT_MS = 100;

  var root = document.getElementById('profileSettings');
  var view = document.querySelector('.view--profile');
  if (!root || !view) return;

  var tabs = Array.prototype.slice.call(view.querySelectorAll('[data-profile-tab]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[data-profile-panel]'));
  var fontRange = document.getElementById('profileFontScale');
  var spaceRange = document.getElementById('profileSpaceScale');
  var fontValue = document.getElementById('profileFontScaleValue');
  var spaceValue = document.getElementById('profileSpaceScaleValue');
  var fontFamilySelect = document.getElementById('profileFontFamily');

  function setActiveTab(name) {
    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-profile-tab') === name;
      tab.classList.toggle('segmented__option--active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      var active = panel.getAttribute('data-profile-panel') === name;
      panel.classList.toggle('profile-panel--active', active);
      panel.hidden = !active;
    });
  }

  function percent(n) {
    return Math.round(Number(n) * 100) + '%';
  }

  function updateSliderProgress(input) {
    if (!input) return;
    var min = Number(input.min);
    var max = Number(input.max);
    var value = Number(input.value);
    input.style.setProperty('--cc-progress', (((value - min) / (max - min)) * 100) + '%');
  }

  function syncControls(settings) {
    settings = settings || (window.UZBankAppearance && window.UZBankAppearance.read && window.UZBankAppearance.read());
    if (!settings) return;
    if (fontRange) fontRange.value = settings.fontScale;
    if (spaceRange) spaceRange.value = settings.spaceScale;
    if (fontValue) fontValue.textContent = percent(settings.fontScale);
    if (spaceValue) spaceValue.textContent = percent(settings.spaceScale);
    if (fontFamilySelect && settings.fontFamily) {
      fontFamilySelect.value = settings.fontFamily;
      var selected = fontFamilySelect.options[fontFamilySelect.selectedIndex];
      var sample = selected && selected.getAttribute('data-font-family');
      if (sample) fontFamilySelect.style.fontFamily = sample;
    }
    updateSliderProgress(fontRange);
    updateSliderProgress(spaceRange);

    root.querySelectorAll('[data-legibility-preset]').forEach(function (btn) {
      btn.classList.toggle('profile-scale-card--active', btn.getAttribute('data-legibility-preset') === settings.size);
    });
    root.querySelectorAll('[data-persona]').forEach(function (btn) {
      var active = btn.getAttribute('data-persona') === settings.persona;
      btn.classList.toggle('profile-persona-card--active', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (tab.getAttribute('tabindex') === '-1') return;
      setActiveTab(tab.getAttribute('data-profile-tab'));
    });
  });

  root.querySelectorAll('[data-legibility-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!window.UZBankAppearance) return;
      var size = btn.getAttribute('data-legibility-preset');
      var settings = window.UZBankAppearance.applyPreset(size, 'custom');
      syncControls(settings);
    });
  });

  root.querySelectorAll('[data-persona]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!window.UZBankAppearance) return;
      var persona = btn.getAttribute('data-persona');
      var size = persona === 'beatrice' ? 'large' : 'small';
      var settings = window.UZBankAppearance.applyPreset(size, persona);
      syncControls(settings);
    });
  });

  [fontRange, spaceRange].forEach(function (input) {
    if (!input) return;
    input.addEventListener('input', function () {
      if (!window.UZBankAppearance) return;
      var patch = { persona: 'custom' };
      patch[input.getAttribute('data-appearance-range')] = Number(input.value);
      var settings = window.UZBankAppearance.apply(patch);
      syncControls(settings);
    });
  });

  if (fontFamilySelect) {
    fontFamilySelect.addEventListener('change', function () {
      if (!window.UZBankAppearance) return;
      var settings = window.UZBankAppearance.apply({
        fontFamily: fontFamilySelect.value,
        persona: 'custom'
      });
      syncControls(settings);
    });
  }

  document.addEventListener('uzbank:appearance-change', function (ev) {
    syncControls(ev.detail);
  });

  function syncDockA11y(merged) {
    var flowBar = view.querySelector('[data-profile-topic-bar]');
    var dock = view.querySelector('[data-profile-topic-dock]');
    var dockBar = dock ? dock.querySelector('.profile-topic-bar--docked') : null;
    if (!flowBar || !dock || !dockBar) return;

    dock.setAttribute('aria-hidden', merged ? 'false' : 'true');
    flowBar.setAttribute('aria-hidden', merged ? 'true' : 'false');

    flowBar.querySelectorAll('[data-profile-tab]').forEach(function (tab) {
      tab.tabIndex = merged ? -1 : 0;
    });
    dockBar.querySelectorAll('[data-profile-tab]').forEach(function (tab) {
      tab.tabIndex = merged ? 0 : -1;
    });
  }

  function bindTabsMerge() {
    var scrollEl = document.querySelector('.main-content');
    var navHeader = view.querySelector('[data-profile-sticky-header]');
    var topicBar = view.querySelector('[data-profile-topic-bar]');
    if (!scrollEl || !navHeader || !topicBar) return;

    var merged = false;
    var merging = false;
    var mergeTimer = null;

    function mergeGap() {
      var navRect = navHeader.getBoundingClientRect();
      var topicRect = topicBar.getBoundingClientRect();
      return topicRect.top - navRect.bottom;
    }

    function shouldMerge() {
      /* Profile tabs sit just under the nav — rest gap is ~16px. Always release at top. */
      if (scrollEl.scrollTop <= 1) return false;
      return mergeGap() <= MERGE_LEAD_PX;
    }

    function shouldUnmerge() {
      if (scrollEl.scrollTop <= 1) return true;
      return mergeGap() > MERGE_LEAD_PX + MERGE_HYSTERESIS_PX;
    }

    function setMerged(next) {
      if (merged === next) return;
      merged = next;
      document.body.classList.toggle('profile--tabs-merged', next);
      document.body.classList.toggle('profile--header-stuck', next);
      syncDockA11y(next);
    }

    function beginMerge() {
      if (merged || merging) return;
      merging = true;
      document.body.classList.add('profile--tabs-merging');
      clearTimeout(mergeTimer);
      mergeTimer = setTimeout(function () {
        merging = false;
        document.body.classList.remove('profile--tabs-merging');
        setMerged(true);
      }, MERGE_OUT_MS);
    }

    function cancelMerge() {
      clearTimeout(mergeTimer);
      merging = false;
      document.body.classList.remove('profile--tabs-merging');
      setMerged(false);
    }

    function onScroll() {
      if (shouldMerge()) {
        if (!merged && !merging) beginMerge();
      } else if (shouldUnmerge() && (merged || merging)) {
        cancelMerge();
      }
    }

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    /* Tab switches change content height / scroll metrics — re-evaluate merge. */
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        requestAnimationFrame(onScroll);
      });
    });
    onScroll();
  }

  function bindScrollEdge() {
    if (!window.UZBankScrollEdgeChrome) return;
    var app = document.querySelector('.app') || document.body;
    window.UZBankScrollEdgeChrome.bind(app, {
      nav: '[data-profile-sticky-header]',
      footer: '.tab-bar',
      getScrollEl: function () {
        return document.querySelector('.main-content');
      },
      isStickyAfterAtEdge: function () {
        return document.body.classList.contains('profile--tabs-merged');
      },
      onStickyAfterChange: function (stuck) {
        if (!document.body.classList.contains('profile--tabs-merged')) {
          document.body.classList.toggle('profile--header-stuck', stuck);
        }
      },
    });
  }

  setActiveTab('persona');
  syncControls();
  syncDockA11y(false);
  bindTabsMerge();
  bindScrollEdge();
})();
