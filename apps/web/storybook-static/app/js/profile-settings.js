(function () {
  'use strict';

  var root = document.getElementById('profileSettings');
  var view = document.querySelector('.view--profile');
  if (!root || !view) return;

  var tabs = Array.prototype.slice.call(view.querySelectorAll('[data-profile-tab]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[data-profile-panel]'));
  var fontRange = document.getElementById('profileFontScale');
  var spaceRange = document.getElementById('profileSpaceScale');
  var fontValue = document.getElementById('profileFontScaleValue');
  var spaceValue = document.getElementById('profileSpaceScaleValue');

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

  document.addEventListener('uzbank:appearance-change', function (ev) {
    syncControls(ev.detail);
  });

  setActiveTab('theme');
  syncControls();
})();
