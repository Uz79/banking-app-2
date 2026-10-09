/**
 * Profile > Theme: design-system colour theme flow.
 *
 * Vanilla port of cartography-lab-app ThemeContrastChecker.tsx + ThemeSetColorDialog.tsx.
 * Colour maths: js/theme-engine.js (global UZBankThemeEngine, built from
 * scripts/theme-engine/). This file only renders and wires events.
 *
 * Storage (all via the engine):
 *   uzBankWebColorOverride_v2      committed pair + per-shell contrast / primary
 *   uzBankWebSavedColorThemes_v2   saved theme cards
 *   uzBankWebColorTokens           finished --color-* tokens for light + dark
 *                                  (read by the boot script on every page)
 * "UZ Bank" (built-in card) and "Reset to theme" clear all of that, so the
 * untouched tokens.css look applies again.
 */
(function () {
  'use strict';

  var E = window.UZBankThemeEngine;
  var root = document.getElementById('themeFlow');
  if (!E || !root) return;

  var mount = root.querySelector('[data-theme-flow-body]');
  var BANK_ID = E.UZBANK_THEME_ID;

  /* ---------------------------------------------------------------- state */
  var state = {
    shell: E.currentShell(),
    settings: null,
    savedThemes: [],
    selectedId: null,
    dialog: null /* 'neutral' | 'primary' | null */
  };

  function livePair(shell) {
    return E.readSavedOverride() || E.readCanonicalFromTheme(shell);
  }

  function syncFromLive() {
    state.shell = E.currentShell();
    var saved = E.readSavedOverride();
    state.settings = E.settingsFromPair(livePair(state.shell), state.shell);
    state.selectedId = saved ? saved.activeSavedThemeId || null : BANK_ID;
    state.savedThemes = E.ensureBuiltinThemes();
  }

  /* --------------------------------------------------------------- helpers */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  var ICON_SLIDERS =
    '<svg class="tf-set-circle__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>';
  var ICON_PLUS =
    '<svg class="tf-theme-card__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>';
  var ICON_TRASH =
    '<svg class="tf-theme-card__trash-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6M5 7h14M8 7v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7M10 11v5M14 11v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_MINUS_SM =
    '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8h10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var ICON_PLUS_SM =
    '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* ---------------------------------------------------------------- commit */
  /**
   * Port of commitSettings(). opts.savedThemeId: string | null | undefined
   * (undefined keeps the current card), opts.shellMaps prefers those maps.
   */
  function commitSettings(next, opts) {
    opts = opts || {};
    var shell = state.shell;
    var mono = E.buildMonochromeSequences(next.neutralSeed, shell);
    var primaryLen = E.buildPrimarySequence(next.primarySeed).length;
    var clamped = Object.assign({}, next, {
      bgIndex: E.clampSequenceIndex(next.bgIndex, mono.background.length),
      fgIndex: E.clampSequenceIndex(next.fgIndex, mono.foreground.length),
      primaryIndex: E.clampSequenceIndex(next.primaryIndex, primaryLen)
    });

    var live = E.readSavedOverride();
    var nextSavedId = opts.savedThemeId !== undefined ? opts.savedThemeId : state.selectedId;
    if (nextSavedId === BANK_ID) nextSavedId = null;

    var contrastByShell, primaryByShell;
    if (opts.shellMaps) {
      contrastByShell = opts.shellMaps.contrastByShell;
      primaryByShell = opts.shellMaps.primaryByShell;
    } else if (live) {
      contrastByShell = live.contrastByShell;
      primaryByShell = live.primaryByShell;
    } else {
      /* First edit away from the UZ Bank look: remember the bank's contrast for
       * the other shell so flipping Light/Dark keeps it until edited there. */
      var other = shell === 'light' ? 'dark' : 'light';
      var os = E.settingsFromPair(E.readCanonicalFromTheme(other), other);
      contrastByShell = {};
      contrastByShell[other] = { bgIndex: os.bgIndex, fgIndex: os.fgIndex };
    }

    /* New primary seed: the other shell's remembered primary step belonged to
     * the old ramp, so let the engine map it again from the new seed. */
    if (opts.newPrimarySeed) primaryByShell = undefined;

    var base = Object.assign({}, E.pairFromSettings(clamped, shell));
    if (contrastByShell) base.contrastByShell = contrastByShell;
    if (primaryByShell) base.primaryByShell = primaryByShell;
    if (nextSavedId) base.activeSavedThemeId = nextSavedId;
    else delete base.activeSavedThemeId;

    var shellState = { bgIndex: clamped.bgIndex, fgIndex: clamped.fgIndex };
    if (clamped.kind === 'multicolor') shellState.primaryIndex = clamped.primaryIndex;
    var pair = E.withShellThemeState(base, shell, shellState);
    if (!nextSavedId) delete pair.activeSavedThemeId;

    E.persistPair(pair, shell);
    state.settings = clamped;
    if (opts.savedThemeId !== undefined) state.selectedId = opts.savedThemeId;

    /* Polarity flipped (e.g. a dark background picked in Light)? Follow it. */
    var polarity = E.shellThemeFromPair(pair.bg, pair.fg, pair.neutral);
    if (polarity !== shell && typeof window.UZBankApplyThemeChoice === 'function') {
      window.UZBankApplyThemeChoice(polarity); /* fires uzbank:picker-sync */
      return;
    }
    render();
  }

  function reverseColor() {
    var next = state.shell === 'light' ? 'dark' : 'light';
    if (typeof window.UZBankApplyThemeChoice === 'function') {
      window.UZBankApplyThemeChoice(next);
    }
  }

  function selectBankDefault() {
    E.clearToBankDefault();
    state.selectedId = BANK_ID;
    state.settings = E.settingsFromPair(E.readCanonicalFromTheme(state.shell), state.shell);
    render();
  }

  function setKind(kind) {
    if (kind === state.settings.kind) return;
    commitSettings(Object.assign({}, state.settings, { kind: kind }), { savedThemeId: null });
  }

  function findTheme(id) {
    for (var i = 0; i < state.savedThemes.length; i++) if (state.savedThemes[i].id === id) return state.savedThemes[i];
    return null;
  }

  function applySaved(t) {
    if (t.id === BANK_ID) { selectBankDefault(); return; }
    var next = E.settingsFromPair(t, state.shell);
    var contrastByShell = t.contrastByShell;
    if (!contrastByShell) {
      contrastByShell = {};
      contrastByShell[state.shell] = { bgIndex: next.bgIndex, fgIndex: next.fgIndex };
    }
    var primaryByShell = t.primaryByShell;
    if (!primaryByShell && next.kind === 'multicolor') {
      primaryByShell = {};
      primaryByShell[state.shell] = next.primaryIndex;
    }
    commitSettings(next, {
      shellMaps: { contrastByShell: contrastByShell, primaryByShell: primaryByShell },
      savedThemeId: t.id
    });
  }

  function addTheme() {
    var list = E.readSavedThemes();
    var derived = E.pairFromSettings(state.settings, state.shell);
    var live = E.readSavedOverride();
    var card = Object.assign({ id: E.makeThemeId(), name: E.nextThemeName(list) }, derived);
    if (live && live.contrastByShell) card.contrastByShell = live.contrastByShell;
    if (live && live.primaryByShell) card.primaryByShell = live.primaryByShell;
    card.createdAt = Date.now();
    var next = [card].concat(list);
    E.writeSavedThemes(next);
    state.savedThemes = next;
    if (live) {
      state.selectedId = card.id;
      E.saveOverride(Object.assign({}, live, { activeSavedThemeId: card.id }));
    } else {
      /* Saving the bank look as a card: keep "UZ Bank" active, no override. */
      state.selectedId = BANK_ID;
    }
    render();
  }

  function deleteSaved(id) {
    if (id === BANK_ID) return;
    var next = E.readSavedThemes().filter(function (t) { return t.id !== id; });
    E.writeSavedThemes(next);
    state.savedThemes = next;
    if (state.selectedId === id) {
      state.selectedId = null;
      var live = E.readSavedOverride();
      if (live && live.activeSavedThemeId === id) {
        var rest = Object.assign({}, live);
        delete rest.activeSavedThemeId;
        E.saveOverride(rest);
      }
    }
    render();
  }

  /* ---------------------------------------------------------------- render */
  function sequenceRow(label, sequence, selectedIndex, seedIndex, tokenRow, action) {
    var fmt = function (i) {
      return tokenRow === 'primary'
        ? E.formatPrimaryTokenLabel(i)
        : E.formatNeutralTokenLabel(i, tokenRow, state.shell);
    };
    var cells = sequence.map(function (color, i) {
      var selected = i === selectedIndex;
      var dot = selected
        ? '<span class="tf-sequence-chip__dot" aria-hidden="true"></span>'
        : i === seedIndex ? '<span class="tf-sequence-chip__seed" aria-hidden="true"></span>' : '';
      return (
        '<div class="tf-sequence-chip-cell" role="listitem">' +
          '<div class="tf-sequence-chip-track" style="grid-column:' + (i + 1) + ';grid-row:1">' +
            '<button type="button" class="tf-sequence-chip' + (selected ? ' tf-sequence-chip--selected' : '') + '"' +
            ' style="background:' + color + '" aria-label="' + esc(label + ' ' + fmt(i)) + '"' +
            ' aria-pressed="' + selected + '" data-action="' + action + '" data-index="' + i + '"' +
            ' data-focus="' + action + '-' + i + '"></button>' +
          '</div>' +
          '<div class="tf-sequence-dot-slot" style="grid-column:' + (i + 1) + ';grid-row:2">' + dot + '</div>' +
        '</div>'
      );
    }).join('');
    return (
      '<div class="tf-sequence-row">' +
        '<p class="tf-sequence-row__label' + (tokenRow === 'primary' ? ' tf-sequence-row__label--field' : '') + '">' + esc(label) + '</p>' +
        '<div class="tf-sequence-row__grid" style="--cc-chip-count:' + sequence.length + ';--cc-selected-index:' + selectedIndex + '" role="list" aria-label="' + esc(label) + '">' +
          cells +
          '<p class="tf-sequence-row__token">' + esc(fmt(selectedIndex)) + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function setCircle(target, fill, ink, label) {
    return (
      '<button type="button" class="tf-set-circle" data-action="open-' + target + '" data-focus="open-' + target + '" aria-label="' + label + '">' +
        '<span class="tf-set-circle__disc" style="background-color:' + fill + ';color:' + ink + '">' +
          ICON_SLIDERS + '<span class="tf-set-circle__label">Click &amp; set</span>' +
        '</span>' +
      '</button>'
    );
  }

  function a11yRow(report, editing) {
    var badge = report.status === 'ok' ? '✓' : report.status === 'blocked' ? '✕' : report.status === 'adapted' ? '↦' : '⚠';
    return (
      '<div class="tf-primary-a11y__row' + (editing ? ' tf-primary-a11y__row--editing' : '') + '" role="listitem">' +
        '<span class="tf-primary-a11y__badge tf-primary-a11y__badge--' + report.status + '" aria-hidden="true">' + badge + '</span>' +
        '<span class="tf-primary-a11y__shell">' + (report.shell === 'light' ? 'Light' : 'Dark') + '</span>' +
        '<span class="tf-primary-a11y__hint">' + esc(report.hint) + '</span>' +
      '</div>'
    );
  }

  function storedThemeState() {
    var saved = E.readSavedOverride();
    return saved ? { contrastByShell: saved.contrastByShell, primaryByShell: saved.primaryByShell } : undefined;
  }

  function themeCard(t) {
    var isBank = t.id === BANK_ID;
    var pair = isBank ? E.readCanonicalFromTheme(state.shell) : E.pairFromSettings(E.settingsFromPair(t, state.shell), state.shell);
    var kind = isBank ? 'monochrome' : E.settingsFromPair(t, state.shell).kind;
    var selected = t.id === state.selectedId;
    return (
      '<div class="tf-theme-card' + (selected ? ' tf-theme-card--selected' : '') + '" role="listitem" tabindex="0"' +
      ' aria-pressed="' + selected + '" data-action="apply" data-id="' + esc(t.id) + '" data-focus="card-' + esc(t.id) + '">' +
        '<span class="tf-theme-card__header">' +
          '<span class="tf-theme-card__title">' + esc(t.name) + '</span>' +
          '<span class="tf-theme-card__actions">' +
            (isBank ? '' :
              '<button type="button" class="tf-theme-card__trash" aria-label="Delete ' + esc(t.name) + '" data-action="delete" data-id="' + esc(t.id) + '">' + ICON_TRASH + '</button>') +
          '</span>' +
        '</span>' +
        '<span class="tf-theme-card__row"><span class="tf-theme-card__swatch" style="background:' + pair.bg + '" aria-hidden="true"></span><span class="tf-theme-card__row-label">Background</span></span>' +
        '<span class="tf-theme-card__row"><span class="tf-theme-card__swatch" style="background:' + (pair.neutral || pair.fg) + '" aria-hidden="true"></span><span class="tf-theme-card__row-label">Foreground</span></span>' +
        (kind === 'multicolor'
          ? '<span class="tf-theme-card__row"><span class="tf-theme-card__swatch" style="background:' + pair.fg + '" aria-hidden="true"></span><span class="tf-theme-card__row-label">Primary</span></span>'
          : '') +
      '</div>'
    );
  }

  function render() {
    var s = state.settings;
    var shell = state.shell;
    var mono = E.buildMonochromeSequences(s.neutralSeed, shell);
    var fgSeq = mono.foreground;
    var bgSeq = mono.background;
    var neutralSeedIndex = E.findSeedIndexInSequence(fgSeq, s.neutralSeed);
    var primarySeq = E.buildPrimarySequence(s.primarySeed);
    var primarySeedIndex = E.findSeedIndexInSequence(primarySeq, s.primarySeed);

    var neutralFill = fgSeq[s.fgIndex] || s.neutralSeed;
    var primaryFill = primarySeq[s.primaryIndex] || s.primarySeed;
    var bgSel = bgSeq[s.bgIndex] || s.neutralSeed;
    var neutralInk = E.pickInvertedInk(neutralFill, bgSel, [neutralFill, primaryFill, '#ffffff', '#080a10']);
    var primaryInk = s.kind === 'multicolor'
      ? E.inkOnPrimaryControl(primaryFill, bgSel, neutralFill, shell)
      : E.pickInvertedInk(primaryFill, bgSel, [neutralFill, primaryFill]);

    var html = '';

    /* Neutral */
    html +=
      '<section class="tf-section tf-neutral-frame" aria-labelledby="tfNeutralTitle">' +
        '<header class="tf-neutral-frame__header">' +
          '<h3 class="tf-section__heading" id="tfNeutralTitle">Neutral color</h3>' +
          '<p class="tf-neutral-frame__subtitle">Set contrast of main frame</p>' +
        '</header>' +
        '<div class="tf-neutral-frame__body">' +
          setCircle('neutral', neutralFill, neutralInk, 'Set neutral base color') +
          '<div class="tf-neutral-frame__sequences">' +
            sequenceRow('Foreground', fgSeq, s.fgIndex, neutralSeedIndex >= 0 ? neutralSeedIndex : -1, 'foreground', 'fg') +
            sequenceRow('Background', bgSeq, s.bgIndex, -1, 'background', 'bg') +
          '</div>' +
        '</div>' +
      '</section>';

    /* Kind */
    html +=
      '<section class="tf-section" aria-labelledby="tfKindTitle">' +
        '<h3 class="tf-section__heading tf-section__heading--field" id="tfKindTitle">Theme</h3>' +
        '<div class="segmented segmented--sm tf-kind" role="group" aria-label="Theme type">' +
          ['monochrome', 'multicolor'].map(function (k) {
            var on = s.kind === k;
            return '<button type="button" class="segmented__option' + (on ? ' segmented__option--active' : '') + '" aria-pressed="' + on + '" data-action="kind" data-kind="' + k + '" data-focus="kind-' + k + '">' + (k === 'monochrome' ? 'Monochrome' : 'Multi-color') + '</button>';
          }).join('') +
        '</div>' +
      '</section>';

    /* Primary (multi-color only) */
    if (s.kind === 'multicolor') {
      var report = E.buildPrimaryAccessibilityReport(s, shell, storedThemeState());
      html +=
        '<section class="tf-section tf-neutral-frame" aria-labelledby="tfPrimaryTitle">' +
          '<header class="tf-neutral-frame__header">' +
            '<h3 class="tf-section__heading" id="tfPrimaryTitle">Primary color</h3>' +
            '<p class="tf-neutral-frame__subtitle">Set accent</p>' +
          '</header>' +
          '<div class="tf-neutral-frame__body">' +
            setCircle('primary', primaryFill, primaryInk, 'Set primary base color') +
            '<div class="tf-neutral-frame__sequences">' +
              sequenceRow('Primary color', primarySeq, s.primaryIndex, primarySeedIndex >= 0 ? primarySeedIndex : -1, 'primary', 'primary') +
              (report
                ? '<div class="tf-primary-a11y" aria-live="polite">' +
                    '<p class="tf-primary-a11y__editing">Editing primary for: <strong>' + (shell === 'light' ? 'Light' : 'Dark') + '</strong></p>' +
                    (report.seedBlocked && report.blockMessage ? '<p class="tf-primary-a11y__block" role="alert">' + esc(report.blockMessage) + '</p>' : '') +
                    '<div class="tf-primary-a11y__list" role="list" aria-label="Primary contrast by theme">' +
                      a11yRow(report.light, shell === 'light') + a11yRow(report.dark, shell === 'dark') +
                    '</div>' +
                  '</div>'
                : '') +
            '</div>' +
          '</div>' +
        '</section>';
    }

    /* Reverse + reset — design-system secondary, hug content (not fill) */
    html +=
      '<section class="tf-section tf-section--action">' +
        '<button type="button" class="uz-btn uz-btn--secondary uz-btn--md" data-action="reverse" data-focus="reverse">Reverse color</button>' +
        '<button type="button" class="uz-btn uz-btn--secondary uz-btn--md" data-action="reset" data-focus="reset">Reset to theme</button>' +
      '</section>';

    /* Live preview with real banking components */
    html +=
      '<section class="tf-section tf-section--live" aria-labelledby="tfLiveTitle">' +
        '<h3 class="tf-section__heading" id="tfLiveTitle">Live preview with real components</h3>' +
        '<div class="tf-live">' +
          '<div class="tf-live__card">' +
            '<div class="tf-live__chrome">' +
              '<span class="tf-live__dash" aria-hidden="true">−</span>' +
              '<span class="tf-live__title">Title</span>' +
              '<span class="tf-live__info" aria-hidden="true">i</span>' +
            '</div>' +
            '<div class="form-field">' +
              '<label class="form-field__label" for="tfLiveSelect">Select-Field</label>' +
              '<div class="form-field__select-wrap">' +
                '<select class="form-field__select" id="tfLiveSelect"><option>Choose an option</option><option>Option B</option></select>' +
                '<span class="form-field__select-icon" aria-hidden="true"><svg class="form-field__select-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg></span>' +
              '</div>' +
            '</div>' +
            '<p class="tf-live__copy">This is a paragraph of explanatory text that describes a specific feature of the UI.</p>' +
            '<div class="tf-live__actions">' +
              '<button type="button" class="uz-btn uz-btn--secondary uz-btn--sm">Secondary action</button>' +
              '<button type="button" class="uz-btn uz-btn--primary uz-btn--sm">Primary action</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    /* Saved themes */
    html +=
      '<section class="tf-section tf-section--saved" aria-labelledby="tfSavedTitle">' +
        '<header class="tf-saved__header">' +
          '<h3 class="tf-saved__title" id="tfSavedTitle">Saved themes</h3>' +
          '<p class="tf-saved__subtitle">Save multiple themes and switch between them.</p>' +
        '</header>' +
        '<div class="tf-saved__grid" role="list" aria-label="Saved themes list">' +
          '<button type="button" class="tf-theme-card tf-theme-card--add" role="listitem" data-action="add" data-focus="add">' +
            '<span class="tf-theme-card__plus" aria-hidden="true">' + ICON_PLUS + '</span>' +
            '<span class="tf-theme-card__label">Add Theme</span>' +
          '</button>' +
          state.savedThemes.map(themeCard).join('') +
        '</div>' +
      '</section>';

    var focusKey = document.activeElement && mount.contains(document.activeElement)
      ? document.activeElement.getAttribute('data-focus') : null;
    mount.innerHTML = html;
    if (focusKey) {
      var el = mount.querySelector('[data-focus="' + focusKey + '"]');
      if (el) el.focus({ preventScroll: true });
    }
    if (state.dialog) dialogRender();
  }

  /* ---------------------------------------------------------- body events */
  mount.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || !mount.contains(el)) return;
    var a = el.getAttribute('data-action');
    var s = state.settings;
    var i = Number(el.getAttribute('data-index'));
    if (a === 'fg') commitSettings(Object.assign({}, s, { fgIndex: i }), { savedThemeId: null });
    else if (a === 'bg') commitSettings(Object.assign({}, s, { bgIndex: i }), { savedThemeId: null });
    else if (a === 'primary') commitSettings(Object.assign({}, s, { primaryIndex: i }), { savedThemeId: null });
    else if (a === 'kind') setKind(el.getAttribute('data-kind'));
    else if (a === 'reverse') reverseColor();
    else if (a === 'reset') selectBankDefault();
    else if (a === 'add') addTheme();
    else if (a === 'delete') { e.stopPropagation(); deleteSaved(el.getAttribute('data-id')); }
    else if (a === 'apply') { var t = findTheme(el.getAttribute('data-id')); if (t) applySaved(t); }
    else if (a === 'open-neutral') dialogOpen('neutral');
    else if (a === 'open-primary') dialogOpen('primary');
  });
  mount.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target;
    if (!el.classList || !el.classList.contains('tf-theme-card') || el.tagName === 'BUTTON') return;
    e.preventDefault();
    var t = findTheme(el.getAttribute('data-id'));
    if (t) applySaved(t);
  });

  /* ---------------------------------------------------------------- dialog */
  var dlg = root.querySelector('.tf-set-color-dialog');
  var D = {
    title: dlg.querySelector('.tf-set-color-dialog__title'),
    swatch: dlg.querySelector('.tf-aa-swatch--dialog'),
    ratio: dlg.querySelector('.tf-contrast-ratio'),
    badges: dlg.querySelector('.tf-badge-stack'),
    block: dlg.querySelector('.tf-set-color-dialog__block'),
    hexInput: dlg.querySelector('[data-hex]'),
    hexClear: dlg.querySelector('[data-hex-clear]'),
    pad: dlg.querySelector('.tf-sv-pad'),
    thumb: dlg.querySelector('.tf-sv-pad__thumb'),
    hue: dlg.querySelector('.tf-hue-slider'),
    rgb: {},
    rampLabel: dlg.querySelector('.tf-ramp__label'),
    ramp: dlg.querySelector('.tf-ramp__swatches')
  };
  ['r', 'g', 'b'].forEach(function (ch) {
    D.rgb[ch] = {
      input: dlg.querySelector('[data-spin-input="' + ch + '"]'),
      slider: dlg.querySelector('[data-spin-slider="' + ch + '"]')
    };
  });
  var picker = { h: 0, s: 0, v: 0 };
  var hexDraft = '';

  function dialogHex() {
    return state.dialog === 'primary' ? state.settings.primarySeed : state.settings.neutralSeed;
  }
  function dialogTitle() {
    return state.dialog === 'primary' ? 'Set primary color' : 'Set neutral color';
  }
  function currentRgb() {
    return E.hexToRgb(dialogHex()) || { r: 58, g: 61, b: 66 };
  }
  function setBlock(msg) {
    D.block.hidden = !msg;
    D.block.textContent = msg || '';
  }
  function validate(hex) {
    if (state.dialog !== 'primary') return null;
    return E.getPrimarySeedBlockMessage(hex, state.settings, state.shell, storedThemeState());
  }

  /* Port of the dialog onChange in ThemeContrastChecker. */
  function applyHex(hex) {
    var block = validate(hex);
    if (block) { setBlock(block); return false; }
    setBlock(null);
    var s = state.settings;
    if (state.dialog === 'primary') {
      var seq = E.buildPrimarySequence(hex);
      commitSettings(Object.assign({}, s, { primarySeed: hex, primaryIndex: E.findPrimarySeedIndex(hex, seq) }), { savedThemeId: null, newPrimarySeed: true });
    } else {
      var fg = E.buildMonochromeSequences(hex, state.shell).foreground;
      var idx = E.findSeedIndexInSequence(fg, hex);
      commitSettings(Object.assign({}, s, { neutralSeed: hex, fgIndex: idx >= 0 ? idx : s.fgIndex }), { savedThemeId: null });
    }
    return true;
  }

  function syncPickerFromHex() {
    var rgb = currentRgb();
    picker = E.rgbToHsv(rgb.r, rgb.g, rgb.b);
  }

  function dialogRender() {
    var hex = dialogHex();
    var rgb = currentRgb();
    var sw = E.contrastOnSwatch(hex);
    D.title.textContent = dialogTitle();
    D.title.style.color = hex;
    D.swatch.style.background = hex;
    D.swatch.style.color = sw.ink;
    D.ratio.textContent = sw.ratio.toFixed(2);
    var checks = [['AA Large', sw.checks.aaLarge], ['AAA Large', sw.checks.aaaLarge], ['AA Normal', sw.checks.aaNormal], ['AAA Normal', sw.checks.aaaNormal]];
    D.badges.innerHTML = checks.map(function (c) {
      return '<div class="tf-badge-labeled"><span class="tf-badge ' + (c[1] ? 'tf-badge--pass' : 'tf-badge--fail') + '"><span class="tf-badge-text">' + (c[1] ? 'Pass' : 'Fail') + '</span><span class="tf-badge-arrow" aria-hidden="true">→</span></span><span class="tf-badge-label">' + c[0] + '</span></div>';
    }).join('');
    if (document.activeElement !== D.hexInput) D.hexInput.value = hexDraft;
    D.hexInput.setAttribute('aria-label', dialogTitle() + ' hex');
    D.hexClear.classList.toggle('form-field__clear--hidden', !D.hexInput.value);

    D.pad.style.background = 'hsl(' + picker.h + ' 100% 50%)';
    D.pad.setAttribute('aria-valuetext', 'Saturation ' + picker.s + '%, brightness ' + picker.v + '%');
    D.thumb.style.left = picker.s + '%';
    D.thumb.style.top = (100 - picker.v) + '%';
    if (document.activeElement !== D.hue) D.hue.value = picker.h;

    ['r', 'g', 'b'].forEach(function (ch) {
      var v = rgb[ch];
      if (document.activeElement !== D.rgb[ch].input) D.rgb[ch].input.value = v;
      D.rgb[ch].slider.value = v;
      D.rgb[ch].slider.style.setProperty('--cc-progress', (v / 255) * 100 + '%');
    });

    D.rampLabel.textContent = state.dialog === 'primary' ? 'Primary seed' : 'Neutral seed';
    D.ramp.innerHTML = E.buildSeedRamp(hex).map(function (c) {
      var on = c.toLowerCase() === hex.toLowerCase();
      return '<button type="button" class="tf-ramp__chip' + (on ? ' tf-ramp__chip--active' : '') + '" style="background:' + c + '" aria-label="Use ' + c + '" role="listitem" data-ramp="' + c + '"></button>';
    }).join('');
  }

  function dialogOpen(target) {
    state.dialog = target;
    hexDraft = dialogHex();
    setBlock(null);
    syncPickerFromHex();
    dialogRender();
    if (!dlg.open) dlg.showModal();
  }
  function dialogClose() {
    state.dialog = null;
    setBlock(null);
    if (dlg.open) dlg.close();
  }

  function applyPicker(partial) {
    var next = Object.assign({}, picker, partial);
    if (partial.h != null && next.s < 4) next.s = 8;
    picker = next;
    var out = E.hsvToRgb(next.h, next.s, next.v);
    var hex = E.rgbToHex(out.r, out.g, out.b);
    if (applyHex(hex)) hexDraft = hex;
    dialogRender();
  }

  function setRgb(ch, value) {
    var base = currentRgb();
    base[ch] = clamp(value, 0, 255);
    var hex = E.rgbToHex(base.r, base.g, base.b);
    if (applyHex(hex)) { hexDraft = hex; syncPickerFromHex(); }
    dialogRender();
  }

  function commitHexDraft(raw) {
    var n = E.normalizeHex(raw);
    if (!n) { hexDraft = dialogHex(); D.hexInput.value = hexDraft; dialogRender(); return; }
    if (applyHex(n)) { hexDraft = n; syncPickerFromHex(); }
    dialogRender();
  }

  dlg.addEventListener('cancel', function (e) { e.preventDefault(); dialogClose(); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) { dialogClose(); return; }
    var t = e.target.closest('button');
    if (!t) return;
    if (t.hasAttribute('data-close')) dialogClose();
    else if (t.hasAttribute('data-confirm')) {
      var out = E.hsvToRgb(picker.h, picker.s, picker.v);
      commitHexDraft(E.normalizeHex(hexDraft) || E.rgbToHex(out.r, out.g, out.b));
      dialogClose();
    } else if (t.hasAttribute('data-hex-clear')) {
      D.hexInput.value = ''; hexDraft = ''; D.hexClear.classList.add('form-field__clear--hidden'); D.hexInput.focus();
    } else if (t.hasAttribute('data-ramp')) {
      var c = t.getAttribute('data-ramp');
      if (applyHex(c)) { hexDraft = c; syncPickerFromHex(); }
      dialogRender();
    } else if (t.hasAttribute('data-spin')) {
      var ch = t.getAttribute('data-spin');
      setRgb(ch, currentRgb()[ch] + Number(t.getAttribute('data-step')));
    }
  });

  D.hexInput.addEventListener('input', function () {
    hexDraft = D.hexInput.value;
    D.hexClear.classList.toggle('form-field__clear--hidden', !hexDraft);
    var n = E.normalizeHex(hexDraft);
    if (!n) return;
    if (applyHex(n)) syncPickerFromHex();
    dialogRender();
  });
  D.hexInput.addEventListener('blur', function () { commitHexDraft(hexDraft); });
  D.hexInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); commitHexDraft(hexDraft); } });

  D.hue.addEventListener('input', function () { applyPicker({ h: Number(D.hue.value) }); });

  ['r', 'g', 'b'].forEach(function (ch) {
    D.rgb[ch].slider.addEventListener('input', function () { setRgb(ch, Number(D.rgb[ch].slider.value)); });
    D.rgb[ch].input.addEventListener('change', function () { setRgb(ch, Number(D.rgb[ch].input.value) || 0); });
  });

  (function wirePad() {
    var dragging = false;
    function fromPointer(x, y) {
      var r = D.pad.getBoundingClientRect();
      var px = clamp((x - r.left) / r.width, 0, 1);
      var py = clamp((y - r.top) / r.height, 0, 1);
      applyPicker({ s: Math.round(px * 100), v: Math.round((1 - py) * 100) });
    }
    D.pad.addEventListener('pointerdown', function (e) {
      dragging = true;
      D.pad.setPointerCapture(e.pointerId);
      fromPointer(e.clientX, e.clientY);
    });
    D.pad.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e.clientX, e.clientY); });
    D.pad.addEventListener('pointerup', function () { dragging = false; });
    D.pad.addEventListener('pointercancel', function () { dragging = false; });
    D.pad.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 1;
      var map = { ArrowLeft: ['s', -step], ArrowRight: ['s', step], ArrowUp: ['v', step], ArrowDown: ['v', -step] };
      var m = map[e.key];
      if (!m) return;
      e.preventDefault();
      var p = {}; p[m[0]] = clamp(picker[m[0]] + m[1], 0, 100);
      applyPicker(p);
    });
  })();

  /* ----------------------------------------------------- shell changes */
  /* Sidebar Light/Dark: app-mp.js has already applied the cached tokens for
   * the new shell; we only re-read settings so the panel shows that shell. */
  document.addEventListener('uzbank:picker-sync', function () {
    syncFromLive();
    if (state.dialog) { hexDraft = dialogHex(); syncPickerFromHex(); }
    render();
  });

  syncFromLive();
  render();
})();
