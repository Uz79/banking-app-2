var UZBankThemeEngine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // scripts/theme-engine/banking.ts
  var banking_exports = {};
  __export(banking_exports, {
    BANKING_NEUTRAL_SEED: () => BANKING_NEUTRAL_SEED,
    BUILTIN_THEMES_SEED_KEY: () => BUILTIN_THEMES_SEED_KEY,
    CANONICAL: () => CANONICAL,
    CANONICAL_BODY_FG: () => CANONICAL_BODY_FG,
    DARK_BG_DEFAULT_INDEX: () => DARK_BG_DEFAULT_INDEX,
    DARK_BG_DEFAULT_STEP: () => DARK_BG_DEFAULT_STEP,
    DEFAULT_BUILTIN_THEME_ID: () => DEFAULT_BUILTIN_THEME_ID,
    DEFAULT_NEUTRAL_SEED: () => DEFAULT_NEUTRAL_SEED,
    DEFAULT_PRIMARY_SEED: () => DEFAULT_PRIMARY_SEED,
    FINETUNE_BG_STEPS: () => FINETUNE_BG_STEPS,
    FINETUNE_BG_STEP_LABELS: () => FINETUNE_BG_STEP_LABELS,
    FINETUNE_FG_STEPS: () => FINETUNE_FG_STEPS,
    FINETUNE_FG_STEP_LABELS: () => FINETUNE_FG_STEP_LABELS,
    FINETUNE_STEPS: () => FINETUNE_STEPS,
    FINETUNE_STEP_LABELS: () => FINETUNE_STEP_LABELS,
    NEUTRAL_300_STEP_INDEX: () => NEUTRAL_300_STEP_INDEX,
    NEUTRAL_STEP_LABELS: () => NEUTRAL_STEP_LABELS,
    OVERRIDE_KEY: () => OVERRIDE_KEY,
    PREFER_BANK_KEY: () => PREFER_BANK_KEY,
    SEQUENCE_STEPS: () => SEQUENCE_STEPS,
    THEMES_KEY: () => THEMES_KEY,
    TOKEN_CACHE_KEY: () => TOKEN_CACHE_KEY,
    UZBANK_THEME_ID: () => UZBANK_THEME_ID,
    applyCachedShell: () => applyCachedShell,
    applyDerivedTokens: () => applyDerivedTokens,
    applyThemeChoice: () => applyThemeChoice,
    applyTokenMap: () => applyTokenMap,
    bankingTokens: () => bankingTokens,
    bootColorOverride: () => bootColorOverride,
    buildBackgroundSequence: () => buildBackgroundSequence,
    buildColorSequence: () => buildColorSequence,
    buildForegroundSequence: () => buildForegroundSequence,
    buildMonochromeSequences: () => buildMonochromeSequences,
    buildNeutralSequence: () => buildNeutralSequence,
    buildPrimaryAccessibilityReport: () => buildPrimaryAccessibilityReport,
    buildPrimarySequence: () => buildPrimarySequence,
    buildSeedRamp: () => buildSeedRamp,
    canonicalNeutralIndices: () => canonicalNeutralIndices,
    canonicalThemeSettings: () => canonicalThemeSettings,
    clampSequenceIndex: () => clampSequenceIndex,
    clearDerivedTokens: () => clearDerivedTokens,
    clearSavedOverride: () => clearSavedOverride,
    clearToBankDefault: () => clearToBankDefault,
    contrastOnSwatch: () => contrastOnSwatch,
    contrastRatio: () => contrastRatio,
    currentShell: () => currentShell,
    deriveTokens: () => deriveTokens,
    ensureAccessiblePrimaryIndex: () => ensureAccessiblePrimaryIndex,
    ensureBuiltinThemes: () => ensureBuiltinThemes,
    findClosestSequenceIndex: () => findClosestSequenceIndex,
    findPrimarySeedIndex: () => findPrimarySeedIndex,
    findSeedIndexInSequence: () => findSeedIndexInSequence,
    formatNeutralTokenLabel: () => formatNeutralTokenLabel,
    formatPrimaryTokenLabel: () => formatPrimaryTokenLabel,
    getPrimarySeedBlockMessage: () => getPrimarySeedBlockMessage,
    getSystemTheme: () => getSystemTheme,
    hexAlpha: () => hexAlpha,
    hexToRgb: () => hexToRgb,
    hslToRgb: () => hslToRgb,
    hsvToRgb: () => hsvToRgb,
    inkOnPrimaryControl: () => inkOnPrimaryControl,
    isBankDefault: () => isBankDefault,
    makeThemeId: () => makeThemeId,
    mapBackgroundIndexAcrossShells: () => mapBackgroundIndexAcrossShells,
    mapContrastIndexAcrossShells: () => mapContrastIndexAcrossShells,
    mapIndexByRelativePosition: () => mapIndexByRelativePosition,
    mapPrimaryIndexAcrossShells: () => mapPrimaryIndexAcrossShells,
    mixHex: () => mixHex,
    nextThemeName: () => nextThemeName,
    normalizeHex: () => normalizeHex,
    pairFromSettings: () => pairFromSettings,
    persistPair: () => persistPair,
    pickInvertedInk: () => pickInvertedInk,
    readCanonicalFromTheme: () => readCanonicalFromTheme,
    readSavedOverride: () => readSavedOverride,
    readSavedThemes: () => readSavedThemes,
    relLuminance: () => relLuminance,
    resolveThemeChoice: () => resolveThemeChoice,
    rgbToHex: () => rgbToHex,
    rgbToHsl: () => rgbToHsl,
    rgbToHsv: () => rgbToHsv,
    saveOverride: () => saveOverride,
    settingsFromPair: () => settingsFromPair,
    shellThemeFromPair: () => shellThemeFromPair,
    themeKindFromPair: () => themeKindFromPair,
    wcagFromRatio: () => wcagFromRatio,
    withShellContrast: () => withShellContrast,
    withShellThemeState: () => withShellThemeState,
    writeSavedThemes: () => writeSavedThemes
  });

  // scripts/theme-engine/data/builtinThemes.json
  var builtinThemes_default = [
    {
      id: "uzbank-default",
      name: "UZ Bank",
      bg: "#ffffff",
      fg: "#00157e",
      neutral: "#00157e",
      kind: "monochrome",
      neutralSeed: "#00157e",
      primarySeed: "#00157e",
      createdAt: 0
    },
    {
      id: "t_da0fdc6c4b056_1a122a822ab",
      name: "Custom 10",
      bg: "#ffffff",
      fg: "#6b7e63",
      neutral: "#414e4d",
      kind: "multicolor",
      neutralSeed: "#465453",
      primarySeed: "#a5b39f",
      bgIndex: 0,
      fgIndex: 9,
      primaryIndex: 7,
      contrastByShell: {
        light: {
          bgIndex: 0,
          fgIndex: 9
        },
        dark: {
          bgIndex: 3,
          fgIndex: 4
        }
      },
      primaryByShell: {
        light: 7,
        dark: 6
      },
      createdAt: 1791582806699
    },
    {
      id: "t_60e4b9e0a998e_1a0afd66790",
      name: "Custom 01",
      bg: "#ffffff",
      fg: "#7f9376",
      neutral: "#546463",
      kind: "multicolor",
      neutralSeed: "#465453",
      primarySeed: "#a5b39f",
      bgIndex: 0,
      fgIndex: 8,
      primaryIndex: 6,
      contrastByShell: {
        light: {
          bgIndex: 0,
          fgIndex: 8
        },
        dark: {
          bgIndex: 3,
          fgIndex: 4
        }
      },
      primaryByShell: {
        light: 6,
        dark: 6
      },
      createdAt: 1789656459152
    },
    {
      id: "t_c4de60932fc248_1a0afd844bf",
      name: "Custom 11",
      bg: "#232e31",
      fg: "#0022b8",
      neutral: "#cbd7d7",
      kind: "multicolor",
      neutralSeed: "#3f5252",
      primarySeed: "#0022b8",
      bgIndex: 3,
      fgIndex: 12,
      createdAt: 1789656581311
    },
    {
      id: "t_6b38e5511977c8_1a0afb48600",
      name: "Custom 09",
      bg: "#ffffff",
      fg: "#0022b8",
      neutral: "#506868",
      kind: "multicolor",
      neutralSeed: "#374747",
      primarySeed: "#0022b8",
      bgIndex: 0,
      fgIndex: 8,
      createdAt: 1789654238720
    },
    {
      id: "t_fbe12a96cd592_1a05dd32d06",
      name: "Custom 06",
      bg: "#ffffff",
      fg: "#e06900",
      neutral: "#373781",
      kind: "multicolor",
      neutralSeed: "#2b2b64",
      primarySeed: "#f07000",
      bgIndex: 0,
      fgIndex: 8,
      createdAt: 1788280515846
    },
    {
      id: "t_632e3a6d427ac_1a05cb1a65d",
      name: "Custom 05",
      bg: "#ffffff",
      fg: "#51907f",
      neutral: "#36363a",
      kind: "multicolor",
      neutralSeed: "#f2f2f3",
      primarySeed: "#4c8777",
      bgIndex: 0,
      fgIndex: 10,
      createdAt: 1788261541469
    },
    {
      id: "t_bbfd6914cceb98_1a05cb16eab",
      name: "Custom 04",
      bg: "#ffffff",
      fg: "#51907f",
      neutral: "#58585f",
      kind: "multicolor",
      neutralSeed: "#f2f2f3",
      primarySeed: "#4c8777",
      bgIndex: 0,
      fgIndex: 8,
      createdAt: 1788261527211
    },
    {
      id: "t_01cdd482bbb028_1a059cef0d1",
      name: "Custom 08",
      bg: "#ffffff",
      fg: "#97208e",
      neutral: "#58585f",
      kind: "multicolor",
      neutralSeed: "#f2f2f3",
      primarySeed: "#8f1e85",
      bgIndex: 0,
      fgIndex: 8,
      createdAt: 1788213129425
    },
    {
      id: "t_68eb2a09662aa_1a059c18735",
      name: "Custom 07",
      bg: "#ffffff",
      fg: "#368136",
      neutral: "#45454a",
      kind: "multicolor",
      neutralSeed: "#f2f2f3",
      primarySeed: "#7dc97d",
      bgIndex: 0,
      fgIndex: 9,
      createdAt: 1788212250421
    },
    {
      id: "t_349fe12e9da8e_1a059830ec6",
      name: "Custom 03",
      bg: "#1c1e23",
      fg: "#f9f643",
      neutral: "#ececed",
      kind: "multicolor",
      neutralSeed: "#f2f2f3",
      primarySeed: "#fcfb9a",
      bgIndex: 4,
      fgIndex: 4,
      createdAt: 1788208156359
    },
    {
      id: "t_22474473b39ce8_1a04a777154",
      name: "Custom 02",
      bg: "#f2f5f5",
      fg: "#e05e00",
      neutral: "#647d7a",
      kind: "multicolor",
      neutralSeed: "#344140",
      primarySeed: "#eb6200",
      bgIndex: 3,
      fgIndex: 7,
      createdAt: 1787955736916
    }
  ];

  // scripts/theme-engine/data/builtinThemes.ts
  var BUILTIN_THEMES = builtinThemes_default;
  var DEFAULT_BUILTIN_THEME_ID = "t_da0fdc6c4b056_1a122a822ab";
  function getDefaultBuiltinTheme() {
    var _a;
    return (_a = BUILTIN_THEMES.find((t) => t.id === DEFAULT_BUILTIN_THEME_ID)) != null ? _a : BUILTIN_THEMES[0];
  }

  // scripts/theme-engine/lib/themeColors.ts
  var SEQUENCE_STEPS = 13;
  var FINETUNE_BG_STEPS = 7;
  var FINETUNE_FG_STEPS = SEQUENCE_STEPS;
  var FINETUNE_STEPS = FINETUNE_BG_STEPS;
  var FINETUNE_BG_STEP_LABELS = [0, 50, 100, 150, 200, 250, 300];
  var DARK_BG_DEFAULT_STEP = 150;
  var DARK_BG_DEFAULT_INDEX = FINETUNE_BG_STEP_LABELS.indexOf(DARK_BG_DEFAULT_STEP);
  var FINETUNE_FG_STEP_LABELS = [
    0,
    50,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1e3,
    1200
  ];
  var FINETUNE_STEP_LABELS = FINETUNE_BG_STEP_LABELS;
  var NEUTRAL_STEP_LABELS = [
    50,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1e3,
    1100,
    1200
  ];
  var NEUTRAL_300_STEP_INDEX = NEUTRAL_STEP_LABELS.indexOf(300);
  var LEGACY_FINETUNE_LEN = 13;
  var DEFAULT_NEUTRAL_SEED = "#3b3d42";
  var DEFAULT_PRIMARY_SEED = "#00157e";
  var OVERRIDE_KEY = "uzBankWebColorOverride_v2";
  var THEMES_KEY = "uzBankWebSavedColorThemes_v2";
  var BUILTIN_THEMES_SEED_KEY = "uzBankWebBuiltinThemesSeeded_v1";
  var CANONICAL = {
    light: {
      bg: "#ffffff",
      fg: "#00157e",
      kind: "monochrome",
      primarySeed: "#00157e"
    },
    dark: {
      bg: "#00157e",
      fg: "#ffffff",
      kind: "monochrome",
      primarySeed: "#00157e"
    }
  };
  var BANKING_NEUTRAL_SEED = "#00157e";
  var CANONICAL_BODY_FG = {
    light: "#3a3d42",
    dark: "#f2f2f3"
  };
  var WCAG = { AA_LARGE: 3, AAA_LARGE: 4.5, AA_NORMAL: 4.5, AAA_NORMAL: 7 };
  var DERIVED_NAMES = [
    /* Legacy --color-* aliases (app shell + theme flow) */
    "color-bg",
    "color-bg-secondary",
    "color-bg-sidebar",
    "color-fg",
    "color-fg-interactive",
    "color-fg-secondary",
    "color-fg-label",
    "color-fg-disabled",
    "color-separator",
    "color-show-all-bg",
    "color-nav-item-active-bg",
    "color-segmented-track-bg",
    "color-input-stroke",
    "color-input-stroke-focus",
    "color-input-surface",
    "color-icon-circle-fill",
    "color-btn-primary-bg",
    "color-btn-primary-fg",
    "color-btn-primary-hover",
    "color-btn-primary-pressed",
    "color-btn-secondary-bg",
    "color-btn-secondary-border",
    "color-btn-secondary-fg",
    "color-btn-secondary-hover",
    "color-btn-secondary-pressed",
    "color-btn-tonal-bg",
    "color-btn-tonal-border",
    "color-btn-tonal-fg",
    "color-btn-tonal-hover",
    "color-btn-tonal-pressed",
    "color-overlay-tint",
    "color-nav-elevated-shadow",
    "color-modal-elevated-shadow",
    "color-surface-state-hover",
    "color-surface-state-pressed",
    "color-action-circle-state-hover",
    "color-action-circle-state-pressed",
    /* v4 semantic tokens consumed by @cartography-lab/ui buttons, segmented, chips */
    "background-background",
    "background-background-brand",
    "foreground-foreground",
    "foreground-foreground-interactive",
    "foreground-foreground-link",
    "border-border-focus",
    "button-primary-background",
    "button-primary-border",
    "button-primary-foreground",
    "button-primary-state-hover",
    "button-primary-state-pressed",
    "button-primary-state-focus",
    "button-secondary-border",
    "button-secondary-background",
    "button-secondary-foreground",
    "button-secondary-state-hover",
    "button-secondary-state-pressed",
    "button-tonal-background",
    "button-tonal-border",
    "button-tonal-foreground",
    "button-tonal-state-hover",
    "button-tonal-state-pressed",
    "segmented-background",
    "segmented-background-selected",
    "segmented-foreground",
    "segmented-foreground-selected",
    "chip-background",
    "chip-background-selected",
    "chip-border",
    "chip-border-selected",
    "chip-foreground",
    "chip-foreground-selected",
    "chip-state-hover",
    "chip-state-hover-selected",
    "chip-state-pressed",
    "chip-state-pressed-selected",
    "chip-foreground-disabled",
    "nav-item-background-selected",
    "nav-item-foreground",
    "nav-item-foreground-selected",
    "field-border-focus",
    "field-border-hover",
    "field-border",
    "field-background",
    "field-foreground",
    "slider-thumb",
    "slider-thumb-border",
    "slider-track",
    "slider-track-active",
    "slider-track-disabled",
    "panel-border",
    "panel-background",
    "button-tonal-state-focus",
    "button-tonal-background-disabled",
    "button-tonal-border-disabled",
    "button-tonal-foreground-disabled",
    "button-icon-only-background-tonal",
    "button-icon-only-foreground",
    "button-icon-only-state-hover",
    "button-icon-only-state-pressed",
    "toggle-switch-background",
    "toggle-switch-background-active",
    "toggle-switch-border",
    "toggle-switch-label",
    "toggle-switch-thumb",
    "toggle-switch-thumb-inactive",
    /* Panel + field copy — Neutral ink (not Primary) */
    "panel-foreground",
    "panel-foreground-secondary",
    "field-label",
    "field-label-secondary",
    "foreground-foreground-secondary",
    /* Map surfaces — Neutral seed tints land / “true to size” */
    "map-background",
    "map-graticule",
    "map-label",
    "map-land-0-background",
    "map-land-0-border",
    "map-land-0-state-hover",
    "map-land-0-state-pressed",
    "map-distortion-by-region-distortion-1",
    "map-distortion-by-region-distortion-2",
    "map-distortion-by-region-distortion-3",
    "map-distortion-by-region-distortion-4",
    "map-distortion-by-region-distortion-5"
  ];
  var MAP_BG_CANONICAL = { light: "#f2f2f3", dark: "#17191f" };
  var MAP_LAND_MIX_LIGHT = 0.1;
  var MAP_LAND_MIX_DARK = 0.14;
  function pickRampByLuminance(ramp, targetHex) {
    var _a;
    const target = hexToRgb(targetHex);
    if (!target || ramp.length === 0) return (_a = ramp[0]) != null ? _a : targetHex;
    const targetL = relLuminance(target);
    let best = ramp[0];
    let bestDist = Infinity;
    for (const step of ramp) {
      const rgb = hexToRgb(step);
      if (!rgb) continue;
      const dist = Math.abs(relLuminance(rgb) - targetL);
      if (dist < bestDist) {
        bestDist = dist;
        best = step;
      }
    }
    return best;
  }
  function subtleMapLandFromBg(bgHex, neutralFgHex, isDark, mixFn) {
    const bg = hexToRgb(bgHex);
    const ink = hexToRgb(neutralFgHex);
    if (!bg) return bgHex;
    if (!ink || hexesEqual(bgHex, neutralFgHex)) {
      const fallback = isDark ? { r: 255, g: 255, b: 255 } : { r: 8, g: 10, b: 16 };
      return mixFn(bg, fallback, isDark ? MAP_LAND_MIX_DARK : MAP_LAND_MIX_LIGHT);
    }
    return mixFn(bg, ink, isDark ? MAP_LAND_MIX_DARK : MAP_LAND_MIX_LIGHT);
  }
  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
  }
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        default:
          h = ((r - g) / d + 4) / 6;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        default:
          h = ((r - g) / d + 4) / 6;
      }
    }
    const s = max === 0 ? 0 : d / max;
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(max * 100)
    };
  }
  function hsvToRgb(h, s, v) {
    h = (h % 360 + 360) % 360;
    s = Math.min(100, Math.max(0, s)) / 100;
    v = Math.min(100, Math.max(0, v)) / 100;
    const c = v * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    let rp = 0;
    let gp = 0;
    let bp = 0;
    if (h < 60) {
      rp = c;
      gp = x;
    } else if (h < 120) {
      rp = x;
      gp = c;
    } else if (h < 180) {
      gp = c;
      bp = x;
    } else if (h < 240) {
      gp = x;
      bp = c;
    } else if (h < 300) {
      rp = x;
      bp = c;
    } else {
      rp = c;
      bp = x;
    }
    return {
      r: Math.round((rp + m) * 255),
      g: Math.round((gp + m) * 255),
      b: Math.round((bp + m) * 255)
    };
  }
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    if (s === 0) {
      const v = Math.round(l * 255);
      return { r: v, g: v, b: v };
    }
    const hue2rgb = (p2, q2, t) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p2 + (q2 - p2) * 6 * tt;
      if (tt < 1 / 2) return q2;
      if (tt < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - tt) * 6;
      return p2;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    };
  }
  function relLuminance(rgb) {
    const lin = (c) => {
      const x = c / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
  }
  function contrastRatio(hex1, hex2) {
    const a = hexToRgb(hex1);
    const b = hexToRgb(hex2);
    if (!a || !b) return 1;
    const L1 = relLuminance(a);
    const L2 = relLuminance(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
  function hexesEqual(a, b) {
    const na = normalizeHex(a);
    const nb = normalizeHex(b);
    return na != null && nb != null && na === nb;
  }
  function pickInvertedInk(fillHex, preferredBackgroundHex, fallbacks = []) {
    var _a;
    const fill = normalizeHex(fillHex);
    const preferred = normalizeHex(preferredBackgroundHex);
    if (!fill) return (_a = preferred != null ? preferred : fallbacks[0]) != null ? _a : "#ffffff";
    if (preferred && !hexesEqual(fill, preferred)) {
      return preferred;
    }
    for (const candidate of fallbacks) {
      const normalized = normalizeHex(candidate);
      if (normalized && !hexesEqual(fill, normalized)) {
        return normalized;
      }
    }
    return contrastOnSwatch(fillHex).ink;
  }
  function normalizeHex(raw) {
    let hex = raw.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return hex.length === 6 && /^[a-f\d]{6}$/i.test(hex) ? `#${hex.toLowerCase()}` : null;
  }
  function hexAlpha(hex, alpha) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, "0");
    return `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g.toString(16).padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}${a}`;
  }
  var TONAL_FILL_ALPHA = 0.05;
  function shellThemeFromPair(bgHex, fgHex, neutralHex) {
    var _a;
    const bg = hexToRgb(bgHex);
    const ink = (_a = hexToRgb(neutralHex || "")) != null ? _a : hexToRgb(fgHex);
    if (!bg || !ink) return "dark";
    return relLuminance(bg) < relLuminance(ink) ? "dark" : "light";
  }
  function getSystemTheme() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function wcagFromRatio(ratio) {
    return {
      aaLarge: ratio >= WCAG.AA_LARGE,
      aaaLarge: ratio >= WCAG.AAA_LARGE,
      aaNormal: ratio >= WCAG.AA_NORMAL,
      aaaNormal: ratio >= WCAG.AAA_NORMAL
    };
  }
  var SEED_RAMP_LIGHTNESS = [98, 96, 90, 82, 72, 62, 52, 44, 36, 28, 22, 14, 6];
  function buildSeedRamp(hex, steps = SEQUENCE_STEPS) {
    const rgb = hexToRgb(hex);
    if (!rgb) return Array.from({ length: steps }, () => "#cccccc");
    const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const lights = SEED_RAMP_LIGHTNESS;
    return lights.slice(0, steps).map((l) => {
      const out = hslToRgb(h, Math.min(100, s), l);
      return rgbToHex(out.r, out.g, out.b);
    });
  }
  function findPrimarySeedIndex(seedHex, sequence) {
    var _a, _b;
    const rgb = hexToRgb(seedHex);
    if (!rgb) return 0;
    const { l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const lights = SEED_RAMP_LIGHTNESS;
    const len = (_a = sequence == null ? void 0 : sequence.length) != null ? _a : lights.length;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < len; i += 1) {
      const targetL = (_b = lights[i]) != null ? _b : lights[lights.length - 1];
      const dist = Math.abs(targetL - l);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return Math.max(0, Math.min(len - 1, best));
  }
  function mixRgb(a, b, t) {
    return {
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    };
  }
  function mixHex(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    if (!a || !b) return hexA;
    const mixed = mixRgb(a, b, t);
    return rgbToHex(mixed.r, mixed.g, mixed.b);
  }
  function buildForegroundSequence(neutralSeed) {
    return buildSeedRamp(neutralSeed, FINETUNE_FG_STEPS);
  }
  function darkForegroundLabelIndex(chipIndex) {
    if (FINETUNE_FG_STEPS <= 1) return 0;
    return Math.round(chipIndex / (FINETUNE_FG_STEPS - 1) * NEUTRAL_300_STEP_INDEX);
  }
  function migrateFinetuneBgIndex(index, fromLen = LEGACY_FINETUNE_LEN) {
    if (fromLen <= 1) return clampSequenceIndex(index, FINETUNE_BG_STEPS);
    const t = index / (fromLen - 1);
    return clampSequenceIndex(Math.round(t * (FINETUNE_BG_STEPS - 1)), FINETUNE_BG_STEPS);
  }
  function migrateFinetuneFgIndexFromShortRamp(index, shortLen = FINETUNE_BG_STEPS) {
    if (shortLen <= 1) return clampSequenceIndex(index, FINETUNE_FG_STEPS);
    const t = index / (shortLen - 1);
    return clampSequenceIndex(Math.round(t * (FINETUNE_FG_STEPS - 1)), FINETUNE_FG_STEPS);
  }
  function migrateFinetunePair(pair, opts) {
    let changed = false;
    let bgIndex = pair.bgIndex;
    let fgIndex = pair.fgIndex;
    if (bgIndex != null && bgIndex >= FINETUNE_BG_STEPS) {
      bgIndex = migrateFinetuneBgIndex(bgIndex);
      changed = true;
    }
    if ((opts == null ? void 0 : opts.expandForegroundFrom7) && fgIndex != null && fgIndex <= FINETUNE_BG_STEPS - 1) {
      fgIndex = migrateFinetuneFgIndexFromShortRamp(fgIndex);
      changed = true;
    }
    let contrastByShell = pair.contrastByShell;
    if (contrastByShell) {
      const next = {};
      for (const shell of ["light", "dark"]) {
        const stored = contrastByShell[shell];
        if (!stored) continue;
        const nextBg = stored.bgIndex >= FINETUNE_BG_STEPS ? migrateFinetuneBgIndex(stored.bgIndex) : stored.bgIndex;
        let nextFg = stored.fgIndex;
        if ((opts == null ? void 0 : opts.expandForegroundFrom7) && nextFg <= FINETUNE_BG_STEPS - 1) {
          nextFg = migrateFinetuneFgIndexFromShortRamp(nextFg);
        }
        if (nextBg !== stored.bgIndex || nextFg !== stored.fgIndex) changed = true;
        next[shell] = {
          bgIndex: clampSequenceIndex(nextBg, FINETUNE_BG_STEPS),
          fgIndex: clampSequenceIndex(nextFg, FINETUNE_FG_STEPS)
        };
      }
      contrastByShell = next;
    }
    if (!changed) return pair;
    return {
      ...pair,
      ...bgIndex != null ? { bgIndex: clampSequenceIndex(bgIndex, FINETUNE_BG_STEPS) } : {},
      ...fgIndex != null ? { fgIndex: clampSequenceIndex(fgIndex, FINETUNE_FG_STEPS) } : {},
      ...contrastByShell ? { contrastByShell } : {}
    };
  }
  var CANVAS_FLOOR_DARK = "#080a10";
  function buildBackgroundSequence(foregroundSequence) {
    var _a, _b;
    const cap = (_b = (_a = foregroundSequence[NEUTRAL_300_STEP_INDEX]) != null ? _a : foregroundSequence[foregroundSequence.length - 1]) != null ? _b : "#cbccce";
    const white = "#ffffff";
    const steps = FINETUNE_BG_STEPS;
    return Array.from({ length: steps }, (_, i) => {
      const t = steps <= 1 ? 0 : i / (steps - 1);
      return mixHex(white, cap, t);
    });
  }
  function buildDarkBackgroundSequence(fullRamp) {
    var _a, _b;
    const cap = (_b = (_a = fullRamp[9]) != null ? _a : fullRamp[fullRamp.length - 2]) != null ? _b : "#505257";
    const steps = FINETUNE_BG_STEPS;
    return Array.from({ length: steps }, (_, i) => {
      const t = steps <= 1 ? 0 : i / (steps - 1);
      return mixHex(CANVAS_FLOOR_DARK, cap, t);
    });
  }
  function buildDarkForegroundSequence(fullRamp) {
    var _a, _b, _c;
    const light = (_a = fullRamp[0]) != null ? _a : "#f2f2f3";
    const cap = (_c = (_b = fullRamp[NEUTRAL_300_STEP_INDEX]) != null ? _b : fullRamp[3]) != null ? _c : light;
    const steps = FINETUNE_FG_STEPS;
    return Array.from({ length: steps }, (_, i) => {
      const t = steps <= 1 ? 0 : i / (steps - 1);
      return mixHex(light, cap, t);
    });
  }
  function canonicalNeutralIndices(shell) {
    if (shell === "dark") {
      return { bgIndex: DARK_BG_DEFAULT_INDEX, fgIndex: NEUTRAL_300_STEP_INDEX };
    }
    return { bgIndex: 0, fgIndex: 9 };
  }
  function formatNeutralTokenLabel(index, row, shell = "light") {
    if (row === "foreground") {
      if (shell === "dark") {
        const step3 = NEUTRAL_STEP_LABELS[darkForegroundLabelIndex(index)];
        return step3 != null ? `neutral-${step3}` : `neutral-${index}`;
      }
      const clamped2 = clampSequenceIndex(index, FINETUNE_FG_STEP_LABELS.length);
      const step2 = FINETUNE_FG_STEP_LABELS[clamped2];
      return `neutral-${step2}`;
    }
    const clamped = clampSequenceIndex(index, FINETUNE_BG_STEP_LABELS.length);
    const step = FINETUNE_BG_STEP_LABELS[clamped];
    if (shell === "light" && step === 0) {
      return "neutral-0 (white)";
    }
    return `neutral-${step}`;
  }
  function buildMonochromeSequences(neutralSeed, shell = "light") {
    const fullRamp = buildForegroundSequence(neutralSeed);
    if (shell === "dark") {
      return {
        foreground: buildDarkForegroundSequence(fullRamp),
        background: buildDarkBackgroundSequence(fullRamp)
      };
    }
    return {
      foreground: fullRamp,
      background: buildBackgroundSequence(fullRamp)
    };
  }
  function buildNeutralSequence(neutralSeed) {
    return buildForegroundSequence(neutralSeed);
  }
  function buildPrimarySequence(primarySeed) {
    return buildSeedRamp(primarySeed, SEQUENCE_STEPS);
  }
  function formatPrimaryTokenLabel(index) {
    const step = NEUTRAL_STEP_LABELS[index];
    return step != null ? `primary-${step}` : `primary-${index}`;
  }
  function clampSequenceIndex(index, length) {
    if (length <= 0) return 0;
    return Math.max(0, Math.min(length - 1, Math.round(index)));
  }
  function colorFromPaletteStep(ramp, stepLabel) {
    var _a;
    const idx = NEUTRAL_STEP_LABELS.indexOf(stepLabel);
    if (idx >= 0 && ramp[idx]) return ramp[idx];
    const t = stepLabel / 1200;
    return (_a = ramp[clampSequenceIndex(Math.round(t * (ramp.length - 1)), ramp.length)]) != null ? _a : ramp[0];
  }
  var DISTORTION_BIPOLAR_ARMS = {
    light: {
      small: [
        { step: 700, hue: -32, mix: 0.36 },
        { step: 500, hue: -16, mix: 0.22 }
      ],
      big: [
        { step: 500, hue: 16, mix: 0.22 },
        { step: 700, hue: 32, mix: 0.36 }
      ]
    },
    dark: {
      small: [
        { step: 800, hue: -32, mix: 0.36 },
        { step: 600, hue: -16, mix: 0.22 }
      ],
      big: [
        { step: 600, hue: 16, mix: 0.22 },
        { step: 800, hue: 32, mix: 0.36 }
      ]
    }
  };
  var DISTORTION_NEUTRAL_ARMS = {
    light: {
      small: [
        { step: 700, mix: 0.36 },
        { step: 500, mix: 0.22 }
      ],
      big: [
        { step: 300, mix: 0.22 },
        { step: 200, mix: 0.36 }
      ]
    },
    dark: {
      small: [
        { step: 800, mix: 0.36 },
        { step: 600, mix: 0.22 }
      ],
      big: [
        { step: 1100, mix: 0.22 },
        { step: 1200, mix: 0.36 }
      ]
    }
  };
  var DISTORTION_CONTRAST_CAP = 1.35;
  var DISTORTION_SAT_SCALE = 0.68;
  function shiftHueHex(hex, degrees, satScale = DISTORTION_SAT_SCALE) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const shifted = hslToRgb(
      (h + degrees + 360) % 360,
      Math.max(0, Math.min(100, s * satScale)),
      l
    );
    return rgbToHex(shifted.r, shifted.g, shifted.b);
  }
  function clampDistortionArmToLandContrast(armHex, land0Hex, bgHex) {
    const landRatio = contrastRatio(land0Hex, bgHex);
    const maxRatio = Math.max(landRatio * DISTORTION_CONTRAST_CAP, landRatio + 0.06);
    if (contrastRatio(armHex, bgHex) <= maxRatio) return armHex;
    let lo = 0;
    let hi = 1;
    let best = land0Hex;
    for (let i = 0; i < 10; i += 1) {
      const mid = (lo + hi) / 2;
      const mixed = mixHex(land0Hex, armHex, mid);
      if (contrastRatio(mixed, bgHex) <= maxRatio) {
        best = mixed;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return best;
  }
  function buildDistortionByRegionTokens(paletteRamp, trueToSizeHex, shell, bipolarHueFromPrimary, pageBgHex) {
    const pickStep = (step) => colorFromPaletteStep(paletteRamp, step);
    const finish = (armHex) => clampDistortionArmToLandContrast(armHex, trueToSizeHex, pageBgHex);
    if (!bipolarHueFromPrimary) {
      const { small: small2, big: big2 } = DISTORTION_NEUTRAL_ARMS[shell];
      return {
        "map-distortion-by-region-distortion-1": finish(
          mixHex(trueToSizeHex, pickStep(small2[0].step), small2[0].mix)
        ),
        "map-distortion-by-region-distortion-2": finish(
          mixHex(trueToSizeHex, pickStep(small2[1].step), small2[1].mix)
        ),
        "map-distortion-by-region-distortion-3": trueToSizeHex,
        "map-distortion-by-region-distortion-4": finish(
          mixHex(trueToSizeHex, pickStep(big2[0].step), big2[0].mix)
        ),
        "map-distortion-by-region-distortion-5": finish(
          mixHex(trueToSizeHex, pickStep(big2[1].step), big2[1].mix)
        )
      };
    }
    const { small, big } = DISTORTION_BIPOLAR_ARMS[shell];
    const pickArm = (step, hue, mixAmt) => {
      const tinted = shiftHueHex(pickStep(step), hue);
      return finish(mixHex(trueToSizeHex, tinted, mixAmt));
    };
    return {
      "map-distortion-by-region-distortion-1": pickArm(small[0].step, small[0].hue, small[0].mix),
      "map-distortion-by-region-distortion-2": pickArm(small[1].step, small[1].hue, small[1].mix),
      "map-distortion-by-region-distortion-3": trueToSizeHex,
      "map-distortion-by-region-distortion-4": pickArm(big[0].step, big[0].hue, big[0].mix),
      "map-distortion-by-region-distortion-5": pickArm(big[1].step, big[1].hue, big[1].mix)
    };
  }
  var MIN_RAMP_CONTRAST = 3;
  var PRIMARY_INK_ON_LIGHT = "#ffffff";
  function mapContrastIndexAcrossShells(fromIndex, fromLen, toLen, fromShell, toShell) {
    if (toLen <= 1) return 0;
    if (fromLen <= 1) return clampSequenceIndex(fromIndex, toLen);
    if (fromShell === toShell) return clampSequenceIndex(fromIndex, toLen);
    const t = fromIndex / (fromLen - 1);
    return clampSequenceIndex(Math.round((1 - t) * (toLen - 1)), toLen);
  }
  function mapBackgroundIndexAcrossShells(fromIndex, fromLen, toLen, fromShell, toShell) {
    if (fromShell === "light" && toShell === "dark" && fromIndex === 0) {
      return clampSequenceIndex(DARK_BG_DEFAULT_INDEX, toLen);
    }
    if (fromShell === "dark" && toShell === "light" && fromIndex === DARK_BG_DEFAULT_INDEX) {
      return 0;
    }
    return mapContrastIndexAcrossShells(fromIndex, fromLen, toLen, fromShell, toShell);
  }
  function mapIndexByRelativePosition(fromIndex, fromLen, toLen) {
    if (toLen <= 1) return 0;
    if (fromLen <= 1) return clampSequenceIndex(fromIndex, toLen);
    const t = fromIndex / (fromLen - 1);
    return clampSequenceIndex(Math.round(t * (toLen - 1)), toLen);
  }
  function ensureReadableShellContrast(bgIndex, fgIndex, sequences, shell) {
    const bg = sequences.background[bgIndex];
    const fg = sequences.foreground[fgIndex];
    if (bg && fg && contrastRatio(bg, fg) >= MIN_RAMP_CONTRAST) {
      return { bgIndex, fgIndex };
    }
    const defaults = canonicalNeutralIndices(shell);
    return {
      bgIndex: clampSequenceIndex(defaults.bgIndex, sequences.background.length),
      fgIndex: clampSequenceIndex(defaults.fgIndex, sequences.foreground.length)
    };
  }
  function inkOnPrimaryFill(fillHex, pageBgHex, neutralFgHex) {
    if (contrastRatio(fillHex, PRIMARY_INK_ON_LIGHT) >= MIN_RAMP_CONTRAST) {
      return PRIMARY_INK_ON_LIGHT;
    }
    if (contrastRatio(fillHex, neutralFgHex) >= MIN_RAMP_CONTRAST) {
      return neutralFgHex;
    }
    if (contrastRatio(fillHex, pageBgHex) >= MIN_RAMP_CONTRAST) {
      return pageBgHex;
    }
    return contrastOnSwatch(fillHex).ink;
  }
  function inkOnPrimaryControl(fillHex, pageBgHex, neutralFgHex, _shell) {
    return inkOnPrimaryFill(fillHex, pageBgHex, neutralFgHex);
  }
  function mapPrimaryIndexAcrossShells(fromIndex, _fromLen, toLen, _fromShell, _toShell) {
    return clampSequenceIndex(fromIndex, toLen);
  }
  function primaryControlInkForReport(fillHex, _shell, pageBgHex, neutralFgHex) {
    return inkOnPrimaryFill(fillHex, pageBgHex, neutralFgHex);
  }
  function primaryStepContrastStrict(index, primarySequence, pageBgHex, neutralFgHex, shell) {
    const fill = primarySequence[index];
    if (!fill) return 0;
    const ink = primaryControlInkForReport(fill, shell, pageBgHex, neutralFgHex);
    return contrastRatio(fill, ink);
  }
  function recommendPrimaryIndex(requestedIndex, primarySequence, pageBgHex, neutralFgHex, shell) {
    if (primarySequence.length === 0) return 0;
    const score = (idx) => primaryStepContrastStrict(idx, primarySequence, pageBgHex, neutralFgHex, shell);
    const preferred = clampSequenceIndex(requestedIndex, primarySequence.length);
    if (score(preferred) >= MIN_RAMP_CONTRAST) return preferred;
    if (shell === "light") {
      for (let i = primarySequence.length - 1; i >= 0; i -= 1) {
        if (score(i) >= MIN_RAMP_CONTRAST) return i;
      }
    } else {
      for (let i = 0; i < primarySequence.length; i += 1) {
        if (score(i) >= MIN_RAMP_CONTRAST) return i;
      }
    }
    let maxIdx = 0;
    let maxScore = 0;
    for (let i = 0; i < primarySequence.length; i += 1) {
      const s = score(i);
      if (s > maxScore) {
        maxScore = s;
        maxIdx = i;
      }
    }
    return maxIdx;
  }
  function ensureAccessiblePrimaryIndex(primaryIndex, primarySequence, pageBgHex, neutralFgHex, kind = "multicolor", shell = "light") {
    if (kind !== "multicolor" || primarySequence.length === 0) {
      return clampSequenceIndex(primaryIndex, primarySequence.length);
    }
    const score = (idx) => {
      const fill = primarySequence[idx];
      if (!fill) return 0;
      return primaryStepContrastStrict(idx, primarySequence, pageBgHex, neutralFgHex, shell);
    };
    let preferred = clampSequenceIndex(primaryIndex, primarySequence.length);
    if (score(preferred) >= MIN_RAMP_CONTRAST) return preferred;
    if (shell === "light") {
      for (let i = primarySequence.length - 1; i >= 0; i -= 1) {
        if (score(i) >= MIN_RAMP_CONTRAST) return i;
      }
    } else {
      for (let i = 0; i < primarySequence.length; i += 1) {
        if (score(i) >= MIN_RAMP_CONTRAST) return i;
      }
      for (let i = primarySequence.length - 1; i >= 0; i -= 1) {
        if (score(i) >= MIN_RAMP_CONTRAST) return i;
      }
    }
    let maxIdx = 0;
    let maxScore = 0;
    for (let i = 0; i < primarySequence.length; i += 1) {
      const s = score(i);
      if (s > maxScore) {
        maxScore = s;
        maxIdx = i;
      }
    }
    return maxIdx;
  }
  function shellHasAccessiblePrimaryStep(primarySequence, pageBgHex, neutralFgHex, shell) {
    for (let i = 0; i < primarySequence.length; i += 1) {
      if (primaryStepContrastStrict(i, primarySequence, pageBgHex, neutralFgHex, shell) >= MIN_RAMP_CONTRAST) {
        return true;
      }
    }
    return false;
  }
  function shellContrastForReport(shell, activeShell, settings, stored) {
    var _a;
    const sequences = buildMonochromeSequences(settings.neutralSeed, shell);
    const storedContrast = (_a = stored == null ? void 0 : stored.contrastByShell) == null ? void 0 : _a[shell];
    if (storedContrast) {
      return {
        bgIndex: clampSequenceIndex(storedContrast.bgIndex, sequences.background.length),
        fgIndex: clampSequenceIndex(storedContrast.fgIndex, sequences.foreground.length)
      };
    }
    if (shell === activeShell) {
      return {
        bgIndex: clampSequenceIndex(settings.bgIndex, sequences.background.length),
        fgIndex: clampSequenceIndex(settings.fgIndex, sequences.foreground.length)
      };
    }
    const defaults = canonicalNeutralIndices(shell);
    return {
      bgIndex: clampSequenceIndex(defaults.bgIndex, sequences.background.length),
      fgIndex: clampSequenceIndex(defaults.fgIndex, sequences.foreground.length)
    };
  }
  function resolveRequestedPrimaryIndex(shell, activeShell, settings, primarySequence, stored) {
    var _a, _b, _c;
    const storedIndex = (_a = stored == null ? void 0 : stored.primaryByShell) == null ? void 0 : _a[shell];
    if (storedIndex != null) {
      return clampSequenceIndex(storedIndex, primarySequence.length);
    }
    if (shell === activeShell) {
      return clampSequenceIndex(settings.primaryIndex, primarySequence.length);
    }
    const inherited = (_c = (_b = stored == null ? void 0 : stored.primaryByShell) == null ? void 0 : _b[activeShell]) != null ? _c : settings.primaryIndex;
    return clampSequenceIndex(inherited, primarySequence.length);
  }
  function primaryShellHint(shell, status, requestedLabel, effectiveLabel, isActiveShell) {
    const shellName = shell === "light" ? "Light" : "Dark";
    switch (status) {
      case "ok":
        return "Labels readable on primary controls";
      case "adapted":
        return `${shellName} uses ${effectiveLabel} \u2014 step adjusted when switching themes`;
      case "warn":
        if (isActiveShell) {
          return `Too light for labels in ${shellName} \u2014 try ${effectiveLabel} or darker`;
        }
        return `${shellName} may need ${effectiveLabel} for readable labels when you switch`;
      case "blocked":
        return `Can't meet contrast in ${shellName} \u2014 try a different primary`;
      default:
        return "";
    }
  }
  function evaluatePrimaryShellReport(shell, activeShell, settings, stored) {
    var _a, _b;
    const primarySequence = buildPrimarySequence(settings.primarySeed);
    const sequences = buildMonochromeSequences(settings.neutralSeed, shell);
    const { bgIndex, fgIndex } = shellContrastForReport(shell, activeShell, settings, stored);
    const pageBgHex = (_a = sequences.background[bgIndex]) != null ? _a : "#ffffff";
    const neutralFgHex = (_b = sequences.foreground[fgIndex]) != null ? _b : "#3a3d42";
    const requestedIndex = resolveRequestedPrimaryIndex(
      shell,
      activeShell,
      settings,
      primarySequence,
      stored
    );
    const accessible = shellHasAccessiblePrimaryStep(
      primarySequence,
      pageBgHex,
      neutralFgHex,
      shell
    );
    const effectiveIndex = accessible ? recommendPrimaryIndex(
      requestedIndex,
      primarySequence,
      pageBgHex,
      neutralFgHex,
      shell
    ) : requestedIndex;
    const contrast = primaryStepContrastStrict(
      requestedIndex,
      primarySequence,
      pageBgHex,
      neutralFgHex,
      shell
    );
    const requestedLabel = formatPrimaryTokenLabel(requestedIndex);
    const effectiveLabel = formatPrimaryTokenLabel(effectiveIndex);
    const requestedPasses = contrast >= MIN_RAMP_CONTRAST;
    let status = "ok";
    if (!accessible) {
      status = "blocked";
    } else if (!requestedPasses) {
      status = "warn";
    }
    return {
      shell,
      status,
      requestedIndex,
      effectiveIndex,
      contrastRatio: contrast,
      requestedLabel,
      effectiveLabel,
      hint: primaryShellHint(shell, status, requestedLabel, effectiveLabel, shell === activeShell)
    };
  }
  function buildPrimaryAccessibilityReport(settings, activeShell, stored) {
    if (settings.kind !== "multicolor") return null;
    const light = evaluatePrimaryShellReport("light", activeShell, settings, stored);
    const dark = evaluatePrimaryShellReport("dark", activeShell, settings, stored);
    const blockedShell = [light, dark].find((r) => r.status === "blocked");
    return {
      light,
      dark,
      seedBlocked: Boolean(blockedShell),
      blockMessage: blockedShell ? blockedShell.hint : null
    };
  }
  function getPrimarySeedBlockMessage(primarySeed, settings, activeShell, stored) {
    var _a, _b;
    if (settings.kind !== "multicolor") return null;
    const draft = { ...settings, primarySeed };
    for (const shell of ["light", "dark"]) {
      const primarySequence = buildPrimarySequence(primarySeed);
      const sequences = buildMonochromeSequences(settings.neutralSeed, shell);
      const { bgIndex, fgIndex } = shellContrastForReport(shell, activeShell, draft, stored);
      const pageBgHex = (_a = sequences.background[bgIndex]) != null ? _a : "#ffffff";
      const neutralFgHex = (_b = sequences.foreground[fgIndex]) != null ? _b : "#3a3d42";
      if (!shellHasAccessiblePrimaryStep(primarySequence, pageBgHex, neutralFgHex, shell)) {
        return shell === "light" ? "This hue can't meet contrast in Light; try a different primary." : "This hue can't meet contrast in Dark; try a different primary.";
      }
    }
    return null;
  }
  function withShellThemeState(pair, shell, state) {
    const next = {
      ...withShellContrast(pair, shell, state.bgIndex, state.fgIndex),
      ...state.primaryIndex != null ? { primaryIndex: state.primaryIndex } : {}
    };
    if (state.primaryIndex != null) {
      next.primaryByShell = {
        ...pair.primaryByShell,
        [shell]: state.primaryIndex
      };
    }
    return next;
  }
  function withShellContrast(pair, shell, bgIndex, fgIndex) {
    return {
      ...pair,
      bgIndex,
      fgIndex,
      contrastByShell: {
        ...pair.contrastByShell,
        [shell]: { bgIndex, fgIndex }
      }
    };
  }
  function readShellPrimaryIndex(pair, shell, primarySequence) {
    return readShellPrimaryIndexRaw(pair, shell, primarySequence);
  }
  function readShellPrimaryIndexRaw(pair, shell, primarySequence) {
    var _a;
    const stored = (_a = pair.primaryByShell) == null ? void 0 : _a[shell];
    if (stored != null) return clampSequenceIndex(stored, primarySequence.length);
    if (pair.primaryIndex != null) {
      return clampSequenceIndex(pair.primaryIndex, primarySequence.length);
    }
    return findClosestSequenceIndex(primarySequence, pair.fg);
  }
  function parsePrimaryByShell(raw, fallbackShell, fallback) {
    if (!raw || typeof raw !== "object") {
      return fallback != null ? { [fallbackShell]: fallback } : void 0;
    }
    const out = {};
    for (const shell of ["light", "dark"]) {
      const value = raw[shell];
      if (Number.isFinite(value)) out[shell] = Number(value);
    }
    if (Object.keys(out).length === 0) {
      return fallback != null ? { [fallbackShell]: fallback } : void 0;
    }
    if (fallback != null && out[fallbackShell] == null) {
      out[fallbackShell] = fallback;
    }
    return out;
  }
  function contrastIndicesFromStored(stored, sequences, shell, pair) {
    var _a, _b, _c;
    let bgIndex = clampSequenceIndex(stored.bgIndex, sequences.background.length);
    const fgIndex = clampSequenceIndex(stored.fgIndex, sequences.foreground.length);
    if (shell === "dark" && bgIndex === sequences.background.length - 1 && (((_b = (_a = pair == null ? void 0 : pair.contrastByShell) == null ? void 0 : _a.light) == null ? void 0 : _b.bgIndex) === 0 || (pair == null ? void 0 : pair.bgIndex) === 0 && ((_c = pair == null ? void 0 : pair.contrastByShell) == null ? void 0 : _c.light) == null || ((pair == null ? void 0 : pair.bg) ? isLightPageBgHex(pair.bg) : false))) {
      bgIndex = clampSequenceIndex(DARK_BG_DEFAULT_INDEX, sequences.background.length);
    }
    return ensureReadableShellContrast(bgIndex, fgIndex, sequences, shell);
  }
  function isLightPageBgHex(hex) {
    const rgb = hexToRgb(hex);
    return Boolean(rgb && relLuminance(rgb) > 0.72);
  }
  function resolveBackgroundIndexForShell(pair, shell, sequences) {
    var _a, _b, _c, _d;
    const defaults = canonicalNeutralIndices(shell);
    let bgIndex = (_a = pair.bgIndex) != null ? _a : defaults.bgIndex;
    if (shell === "dark") {
      const fromLightWhiteHex = Boolean(pair.bg && isLightPageBgHex(pair.bg));
      const fromLightShellMap = ((_b = pair.contrastByShell) == null ? void 0 : _b.dark) == null && ((_d = (_c = pair.contrastByShell) == null ? void 0 : _c.light) == null ? void 0 : _d.bgIndex) === 0;
      if (fromLightWhiteHex || fromLightShellMap) {
        return clampSequenceIndex(DARK_BG_DEFAULT_INDEX, sequences.background.length);
      }
    }
    if (pair.bg) {
      bgIndex = findClosestSequenceIndex(sequences.background, pair.bg);
    }
    return clampSequenceIndex(bgIndex, sequences.background.length);
  }
  function contrastIndicesForAppliedPair(pair, shell, sequences) {
    var _a;
    const defaults = canonicalNeutralIndices(shell);
    const bgIndex = resolveBackgroundIndexForShell(pair, shell, sequences);
    let fgIndex = (_a = pair.fgIndex) != null ? _a : defaults.fgIndex;
    if (pair.neutral) {
      fgIndex = findClosestSequenceIndex(sequences.foreground, pair.neutral);
    }
    return ensureReadableShellContrast(
      bgIndex,
      clampSequenceIndex(fgIndex, sequences.foreground.length),
      sequences,
      shell
    );
  }
  function readShellContrastIndices(pair, shell, sequences) {
    var _a;
    const stored = (_a = pair.contrastByShell) == null ? void 0 : _a[shell];
    if (stored) {
      return contrastIndicesFromStored(stored, sequences, shell, pair);
    }
    return contrastIndicesForAppliedPair(pair, shell, sequences);
  }
  function readLeavingShellContrast(pair, fromShell, sequences) {
    var _a;
    const stored = (_a = pair.contrastByShell) == null ? void 0 : _a[fromShell];
    if (stored) {
      return contrastIndicesFromStored(stored, sequences, fromShell, pair);
    }
    return contrastIndicesForAppliedPair(pair, fromShell, sequences);
  }
  function parseContrastByShell(raw, fallbackShell, fallback) {
    if (!raw || typeof raw !== "object") {
      return fallback ? { [fallbackShell]: fallback } : void 0;
    }
    const out = {};
    for (const shell of ["light", "dark"]) {
      const item = raw[shell];
      if (!item || typeof item !== "object") continue;
      const bgIndex = Number(item.bgIndex);
      const fgIndex = Number(item.fgIndex);
      if (Number.isFinite(bgIndex) && Number.isFinite(fgIndex)) {
        out[shell] = { bgIndex, fgIndex };
      }
    }
    if (Object.keys(out).length === 0) {
      return fallback ? { [fallbackShell]: fallback } : void 0;
    }
    if (fallback && !out[fallbackShell]) {
      out[fallbackShell] = fallback;
    }
    return out;
  }
  function buildColorSequence(settings) {
    var _a;
    const neutral = buildNeutralSequence(settings.neutralSeed);
    if (settings.kind === "multicolor") {
      const primary = (_a = normalizeHex(settings.primarySeed)) != null ? _a : DEFAULT_PRIMARY_SEED;
      return [primary, ...neutral];
    }
    return neutral;
  }
  function findClosestSequenceIndex(sequence, targetHex) {
    const target = hexToRgb(targetHex);
    if (!target || sequence.length === 0) return 0;
    let best = 0;
    let bestDist = Infinity;
    sequence.forEach((step, i) => {
      const rgb = hexToRgb(step);
      if (!rgb) return;
      const dist = Math.abs(rgb.r - target.r) + Math.abs(rgb.g - target.g) + Math.abs(rgb.b - target.b);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }
  function findSeedIndexInSequence(sequence, seedHex) {
    const normalized = normalizeHex(seedHex);
    if (!normalized) return -1;
    const exact = sequence.findIndex((c) => c.toLowerCase() === normalized);
    if (exact >= 0) return exact;
    return findClosestSequenceIndex(sequence, normalized);
  }
  function inferMulticolorPair(pair) {
    const accent = hexToRgb(pair.fg);
    const neutral = hexToRgb(pair.neutral || pair.fg);
    if (!accent || !neutral) return false;
    if (hexesEqual(pair.fg, pair.neutral || pair.fg)) return false;
    const ah = rgbToHsl(accent.r, accent.g, accent.b);
    const nh = rgbToHsl(neutral.r, neutral.g, neutral.b);
    if (ah.s < 12 && nh.s < 12) return false;
    if (ah.s >= 25 && nh.s < 20) return true;
    if (ah.l >= 92 && nh.l >= 88 && nh.s < 15 && ah.l - nh.l >= 3) return true;
    const hueDiff = Math.min(Math.abs(ah.h - nh.h), 360 - Math.abs(ah.h - nh.h));
    return hueDiff > 20 && ah.s > 15;
  }
  function themeKindFromPair(pair) {
    if (inferMulticolorPair(pair)) return "multicolor";
    if (pair.kind === "multicolor" || pair.kind === "monochrome") return pair.kind;
    return "monochrome";
  }
  function settingsFromPair(pair, shell) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const fromNeutral = normalizeHex(pair.neutral || "");
    const fromNeutralRgb = fromNeutral ? hexToRgb(fromNeutral) : null;
    const neutralAsSeed = fromNeutralRgb && relLuminance(fromNeutralRgb) < 0.55 ? fromNeutral : null;
    const rawSeed = (_b = (_a = normalizeHex(pair.neutralSeed || "")) != null ? _a : neutralAsSeed) != null ? _b : DEFAULT_NEUTRAL_SEED;
    const rawSeedRgb = hexToRgb(rawSeed);
    const neutralSeed = rawSeedRgb && relLuminance(rawSeedRgb) > 0.72 ? DEFAULT_NEUTRAL_SEED : rawSeed;
    const primarySeed = (_d = (_c = normalizeHex(pair.primarySeed || "")) != null ? _c : normalizeHex(pair.fg)) != null ? _d : DEFAULT_PRIMARY_SEED;
    const kind = themeKindFromPair(pair);
    const primarySequence = buildPrimarySequence(primarySeed);
    const sequences = buildMonochromeSequences(neutralSeed, shell);
    const { bgIndex, fgIndex } = readShellContrastIndices(pair, shell, sequences);
    const primaryIndex = readShellPrimaryIndex(pair, shell, primarySequence);
    if (pair.neutralSeed || ((_e = pair.contrastByShell) == null ? void 0 : _e[shell])) {
      return {
        kind,
        neutralSeed: (_f = normalizeHex(pair.neutralSeed || "")) != null ? _f : neutralSeed,
        primarySeed,
        bgIndex,
        fgIndex,
        primaryIndex
      };
    }
    if (kind === "monochrome") {
      return {
        kind,
        neutralSeed,
        primarySeed,
        bgIndex: findClosestSequenceIndex(sequences.background, pair.bg),
        fgIndex: findClosestSequenceIndex(sequences.foreground, (_g = pair.neutral) != null ? _g : pair.fg),
        primaryIndex: findClosestSequenceIndex(primarySequence, primarySeed)
      };
    }
    return {
      kind,
      neutralSeed,
      primarySeed,
      bgIndex: findClosestSequenceIndex(sequences.background, pair.bg),
      fgIndex: findClosestSequenceIndex(sequences.foreground, (_h = pair.neutral) != null ? _h : pair.fg),
      primaryIndex: findClosestSequenceIndex(primarySequence, pair.fg)
    };
  }
  function canonicalThemeSettings(mode) {
    return settingsFromPair(readCanonicalFromTheme(mode), mode);
  }
  function pairFromSettings(settings, shell) {
    var _a, _b, _c;
    const neutralSeed = (_a = normalizeHex(settings.neutralSeed)) != null ? _a : DEFAULT_NEUTRAL_SEED;
    const primarySeed = (_b = normalizeHex(settings.primarySeed)) != null ? _b : DEFAULT_PRIMARY_SEED;
    if (settings.kind === "monochrome") {
      const { foreground: foreground2, background: background2 } = buildMonochromeSequences(neutralSeed, shell);
      const bgIndex2 = clampSequenceIndex(settings.bgIndex, background2.length);
      const fgIndex2 = clampSequenceIndex(settings.fgIndex, foreground2.length);
      const bg2 = background2[bgIndex2];
      const fgStep2 = foreground2[fgIndex2];
      return {
        bg: bg2,
        fg: fgStep2,
        neutral: fgStep2,
        kind: settings.kind,
        neutralSeed,
        primarySeed,
        bgIndex: bgIndex2,
        fgIndex: fgIndex2,
        primaryIndex: clampSequenceIndex(
          settings.primaryIndex,
          buildPrimarySequence(primarySeed).length
        )
      };
    }
    const { foreground, background } = buildMonochromeSequences(neutralSeed, shell);
    const primarySequence = buildPrimarySequence(primarySeed);
    const bgIndex = clampSequenceIndex(settings.bgIndex, background.length);
    const fgIndex = clampSequenceIndex(settings.fgIndex, foreground.length);
    const primaryIndex = clampSequenceIndex(settings.primaryIndex, primarySequence.length);
    const bg = background[bgIndex];
    const fgStep = foreground[fgIndex];
    const fg = (_c = primarySequence[primaryIndex]) != null ? _c : primarySeed;
    return {
      bg,
      fg,
      neutral: fgStep,
      kind: settings.kind,
      neutralSeed,
      primarySeed,
      bgIndex,
      fgIndex,
      primaryIndex
    };
  }
  function contrastOnSwatch(fillHex) {
    const white = "#ffffff";
    const black = "#080a10";
    const rWhite = contrastRatio(fillHex, white);
    const rBlack = contrastRatio(fillHex, black);
    const useWhite = rWhite >= rBlack;
    const ratio = useWhite ? rWhite : rBlack;
    return { ratio, ink: useWhite ? white : black, checks: wcagFromRatio(ratio) };
  }
  function deriveTokens(bgHex, fgHex, neutralHex, kind = "monochrome", seeds) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const bg = hexToRgb(bgHex);
    const fg = hexToRgb(fgHex);
    if (!bg || !fg) return {};
    const isMulticolor = kind === "multicolor";
    const inkForShell = (_d = (_c = hexToRgb((_a = normalizeHex(neutralHex || "")) != null ? _a : "")) != null ? _c : hexToRgb((_b = normalizeHex((seeds == null ? void 0 : seeds.neutralSeed) || "")) != null ? _b : "")) != null ? _d : fg;
    const isDark = relLuminance(bg) < relLuminance(inkForShell);
    const mix = (a, b, t) => rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
    const fgAlpha = (a) => `rgba(${fg.r}, ${fg.g}, ${fg.b}, ${a})`;
    const blackAlpha = (a) => `rgba(0, 0, 0, ${a})`;
    const white = { r: 255, g: 255, b: 255 };
    const bgElev = isDark ? 0.22 : 0.07;
    const fgElev = isDark ? 0.06 : 0.22;
    const accentHex = fgHex;
    const accent = fg;
    const fallbackNeutral = isDark ? CANONICAL_BODY_FG.dark : CANONICAL_BODY_FG.light;
    const neutralSeedHex = (_f = (_e = normalizeHex((seeds == null ? void 0 : seeds.neutralSeed) || "")) != null ? _e : normalizeHex(neutralHex || "")) != null ? _f : fallbackNeutral;
    const primarySeedHex = (_g = normalizeHex((seeds == null ? void 0 : seeds.primarySeed) || "")) != null ? _g : accentHex;
    const neutralRgb = (_h = hexToRgb(neutralSeedHex)) != null ? _h : hexToRgb(fallbackNeutral);
    const neutralRamp = buildSeedRamp(neutralSeedHex);
    const primaryRamp = buildSeedRamp(primarySeedHex);
    const neutralFgHex = isDark ? pickRampByLuminance(neutralRamp, CANONICAL_BODY_FG.dark) : relLuminance(neutralRgb) > 0.55 ? pickRampByLuminance(neutralRamp, CANONICAL_BODY_FG.light) : neutralSeedHex;
    const selectedForegroundHex = (_i = normalizeHex(neutralHex || "")) != null ? _i : neutralFgHex;
    const primaryFillHex = isMulticolor ? accentHex : isDark ? "#ffffff" : accentHex;
    const primaryFillRgb = (_j = hexToRgb(primaryFillHex)) != null ? _j : accent;
    const primaryFillIsDark = relLuminance(primaryFillRgb) < 0.45;
    const invertedControlInk = (fillHex) => pickInvertedInk(fillHex, bgHex, [bgHex, neutralFgHex, accentHex]);
    const primaryControlInk = (fillHex) => {
      if (!isMulticolor) return invertedControlInk(fillHex);
      const shell2 = isDark ? "dark" : "light";
      return inkOnPrimaryControl(fillHex, bgHex, selectedForegroundHex, shell2);
    };
    const btnPrimaryFg = primaryControlInk(primaryFillHex);
    const invertedSelectedFillHex = isMulticolor ? accentHex : isDark ? "#ffffff" : accentHex;
    const primaryStateHover = primaryFillIsDark ? hexAlpha("#ffffff", 0.1) : hexAlpha(accentHex, 0.1);
    const primaryStatePressed = primaryFillIsDark ? hexAlpha("#ffffff", 0.2) : hexAlpha(accentHex, 0.2);
    const neutralInk = selectedForegroundHex;
    const tonalBg = hexAlpha(neutralInk, TONAL_FILL_ALPHA);
    const neutralWash10 = hexAlpha(neutralInk, 0.1);
    const neutralWash20 = hexAlpha(neutralInk, 0.2);
    const tonalHover = neutralWash10;
    const tonalPressed = neutralWash20;
    const chipTonalBg = tonalBg;
    const separatorWash = hexAlpha(neutralInk, isDark ? 0.1 : 0.14);
    const neutralStroke70 = hexAlpha(neutralInk, 0.7);
    const modeKey = isDark ? "dark" : "light";
    const land0Hex = subtleMapLandFromBg(bgHex, selectedForegroundHex, isDark, mix);
    const mapBgHex = pickRampByLuminance(neutralRamp, MAP_BG_CANONICAL[modeKey]);
    const land0Border = isDark ? mix(bg, hexToRgb(land0Hex), 0.35) : "#ffffff";
    const land0Hover = hexAlpha(selectedForegroundHex, 0.1);
    const land0Pressed = hexAlpha(selectedForegroundHex, 0.2);
    const mapLabelHex = isDark ? mix(hexToRgb(selectedForegroundHex), white, 0.15) : mix(hexToRgb(selectedForegroundHex), bg, 0.15);
    const mapGraticule = hexAlpha(neutralSeedHex, isDark ? 0.18 : 0.1);
    const secondaryFgHex = hexAlpha(selectedForegroundHex, 0.7);
    const shell = isDark ? "dark" : "light";
    const distortionTokens = buildDistortionByRegionTokens(
      isMulticolor ? primaryRamp : neutralRamp,
      land0Hex,
      shell,
      isMulticolor,
      bgHex
    );
    return {
      "color-bg": bgHex,
      "color-bg-secondary": mix(bg, accent, bgElev),
      "color-bg-sidebar": bgHex,
      "color-fg": selectedForegroundHex,
      "color-fg-interactive": accentHex,
      "color-fg-secondary": secondaryFgHex,
      "color-fg-label": secondaryFgHex,
      "color-fg-disabled": isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(8, 10, 16, 0.4)",
      "color-separator": separatorWash,
      "color-show-all-bg": tonalBg,
      "color-nav-item-active-bg": tonalBg,
      "color-segmented-track-bg": tonalBg,
      "color-input-stroke": neutralStroke70,
      "color-input-stroke-focus": accentHex,
      "color-input-surface": bgHex,
      "color-icon-circle-fill": accentHex,
      "color-btn-primary-bg": primaryFillHex,
      "color-btn-primary-fg": btnPrimaryFg,
      "color-btn-primary-hover": mix(primaryFillRgb, bg, fgElev),
      "color-btn-primary-pressed": mix(primaryFillRgb, bg, Math.min(0.45, fgElev * 1.75)),
      "color-btn-secondary-bg": bgHex,
      "color-btn-secondary-border": neutralInk,
      "color-btn-secondary-fg": neutralInk,
      "color-btn-secondary-hover": neutralWash10,
      "color-btn-secondary-pressed": neutralWash20,
      "color-btn-tonal-bg": tonalBg,
      "color-btn-tonal-border": tonalBg,
      "color-btn-tonal-fg": neutralInk,
      "color-btn-tonal-hover": tonalHover,
      "color-btn-tonal-pressed": tonalPressed,
      "color-overlay-tint": neutralInk,
      "color-nav-elevated-shadow": blackAlpha(isDark ? 0.35 : 0.06),
      "color-modal-elevated-shadow": blackAlpha(isDark ? 0.45 : 0.12),
      "color-surface-state-hover": neutralWash10,
      "color-surface-state-pressed": neutralWash20,
      /* White wash on filled accent circles (accent@alpha is invisible on same fill). */
      "color-action-circle-state-hover": hexAlpha("#ffffff", 0.12),
      "color-action-circle-state-pressed": hexAlpha("#ffffff", 0.22),
      /* v4 tokens — buttons/segmented/chips read these directly from colors.css */
      "background-background": bgHex,
      "background-background-brand": accentHex,
      "foreground-foreground": selectedForegroundHex,
      "foreground-foreground-interactive": accentHex,
      "foreground-foreground-link": accentHex,
      "foreground-foreground-secondary": secondaryFgHex,
      "border-border-focus": accentHex,
      "button-primary-background": primaryFillHex,
      "button-primary-border": primaryFillHex,
      "button-primary-foreground": btnPrimaryFg,
      "button-primary-state-hover": primaryStateHover,
      "button-primary-state-pressed": primaryStatePressed,
      "button-primary-state-focus": primaryStateHover,
      "button-secondary-background": bgHex,
      "button-secondary-border": neutralInk,
      "button-secondary-foreground": neutralInk,
      "button-secondary-state-hover": neutralWash10,
      "button-secondary-state-pressed": neutralWash20,
      "button-tonal-background": tonalBg,
      "button-tonal-border": tonalBg,
      "button-tonal-foreground": neutralInk,
      "button-tonal-state-hover": tonalHover,
      "button-tonal-state-pressed": tonalPressed,
      "button-tonal-state-focus": neutralWash10,
      "button-tonal-background-disabled": hexAlpha(neutralInk, 0.05),
      "button-tonal-border-disabled": hexAlpha(neutralInk, 0),
      "button-tonal-foreground-disabled": hexAlpha(neutralInk, 0.4),
      "button-icon-only-background-tonal": tonalBg,
      "button-icon-only-foreground": neutralInk,
      "button-icon-only-state-hover": neutralWash10,
      "button-icon-only-state-pressed": neutralWash20,
      "segmented-background": tonalBg,
      "segmented-background-selected": invertedSelectedFillHex,
      "segmented-foreground": neutralInk,
      "segmented-foreground-selected": primaryControlInk(invertedSelectedFillHex),
      "chip-background": chipTonalBg,
      "chip-background-selected": invertedSelectedFillHex,
      "chip-border": hexAlpha(neutralInk, 0),
      "chip-border-selected": invertedSelectedFillHex,
      "chip-foreground": neutralInk,
      "chip-foreground-selected": primaryControlInk(invertedSelectedFillHex),
      "chip-state-hover": neutralWash10,
      "chip-state-hover-selected": hexAlpha(btnPrimaryFg, 0.1),
      "chip-state-pressed": neutralWash20,
      "chip-state-pressed-selected": hexAlpha(btnPrimaryFg, 0.2),
      "chip-foreground-disabled": hexAlpha(neutralInk, 0.4),
      "nav-item-background-selected": tonalBg,
      "nav-item-foreground": neutralInk,
      "nav-item-foreground-selected": neutralInk,
      "field-border-focus": accentHex,
      "field-border-hover": accentHex,
      "field-border": neutralStroke70,
      "field-background": bgHex,
      "field-foreground": neutralInk,
      "field-label": secondaryFgHex,
      "field-label-secondary": secondaryFgHex,
      "panel-foreground": selectedForegroundHex,
      "panel-foreground-secondary": secondaryFgHex,
      /* Light: selected fg @ 14% so frosted panels keep a readable rim on pale maps.
       * Dark: white @ 10% (ds4 panel/border). */
      "panel-border": hexAlpha(
        isDark ? "#ffffff" : selectedForegroundHex,
        isDark ? 0.1 : 0.14
      ),
      "panel-background": hexAlpha(bgHex, 0.7),
      "slider-thumb": accentHex,
      "slider-thumb-border": isDark ? accentHex : "#ffffff",
      "slider-track": isDark ? hexAlpha("#ffffff", 0.2) : hexAlpha(neutralInk, 0.2),
      "slider-track-active": accentHex,
      "slider-track-disabled": hexAlpha(neutralInk, 0.1),
      "toggle-switch-background": bgHex,
      "toggle-switch-background-active": accentHex,
      "toggle-switch-border": neutralStroke70,
      "toggle-switch-label": neutralInk,
      "toggle-switch-thumb": btnPrimaryFg,
      "toggle-switch-thumb-inactive": neutralInk,
      /* Map — Neutral palette (land fill + true-to-size step) */
      "map-background": mapBgHex,
      "map-graticule": mapGraticule,
      "map-label": mapLabelHex,
      "map-land-0-background": land0Hex,
      "map-land-0-border": land0Border,
      "map-land-0-state-hover": land0Hover,
      "map-land-0-state-pressed": land0Pressed,
      ...distortionTokens
    };
  }
  function applyDerivedTokens(bgHex, fgHex, neutralHex, kind, seeds) {
    const resolvedKind = kind != null ? kind : neutralHex ? themeKindFromPair({ bg: bgHex, fg: fgHex, neutral: neutralHex }) : "monochrome";
    const derived = deriveTokens(bgHex, fgHex, neutralHex, resolvedKind, seeds);
    const style = document.documentElement.style;
    for (const [name, value] of Object.entries(derived)) {
      style.setProperty(`--${name}`, value);
    }
  }
  function clearDerivedTokens() {
    const style = document.documentElement.style;
    for (const name of DERIVED_NAMES) {
      style.removeProperty(`--${name}`);
    }
  }
  function readSavedOverride() {
    try {
      const hasV11 = localStorage.getItem(OVERRIDE_KEY);
      const raw = hasV11;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const bg = normalizeHex(parsed.bg || "");
      const fg = normalizeHex(parsed.fg || "");
      const neutral = normalizeHex(parsed.neutral || "");
      const neutralSeed = normalizeHex(String(parsed.neutralSeed || ""));
      const primarySeed = normalizeHex(String(parsed.primarySeed || ""));
      const kind = parsed.kind === "multicolor" ? "multicolor" : parsed.kind === "monochrome" ? "monochrome" : void 0;
      const bgIndex = Number.isFinite(parsed.bgIndex) ? Number(parsed.bgIndex) : void 0;
      const fgIndex = Number.isFinite(parsed.fgIndex) ? Number(parsed.fgIndex) : void 0;
      const primaryIndex = Number.isFinite(parsed.primaryIndex) ? Number(parsed.primaryIndex) : void 0;
      if (!bg || !fg) return null;
      const inferredShell = shellThemeFromPair(bg, fg, neutral || void 0);
      const contrastByShell = parseContrastByShell(
        parsed.contrastByShell,
        inferredShell,
        bgIndex != null && fgIndex != null ? { bgIndex, fgIndex } : void 0
      );
      const primaryByShell = parsePrimaryByShell(
        parsed.primaryByShell,
        inferredShell,
        primaryIndex
      );
      const activeSavedThemeId = typeof parsed.activeSavedThemeId === "string" ? parsed.activeSavedThemeId : null;
      return migrateFinetunePair(
        {
          bg,
          fg,
          ...neutral ? { neutral } : {},
          ...kind ? { kind } : {},
          ...neutralSeed ? { neutralSeed } : {},
          ...primarySeed ? { primarySeed } : {},
          ...bgIndex != null ? { bgIndex } : {},
          ...fgIndex != null ? { fgIndex } : {},
          ...primaryIndex != null ? { primaryIndex } : {},
          ...contrastByShell ? { contrastByShell } : {},
          ...primaryByShell ? { primaryByShell } : {},
          ...activeSavedThemeId ? { activeSavedThemeId } : {}
        },
        { expandForegroundFrom7: !hasV11 }
      );
    } catch (e) {
      return null;
    }
  }
  function saveOverride(pair) {
    try {
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(pair));
      localStorage.removeItem("uzBankWebPreferBankDefault");
    } catch (e) {
    }
  }
  function clearSavedOverride() {
    try {
      localStorage.removeItem(OVERRIDE_KEY);
    } catch (e) {
    }
  }
  function readSavedThemes() {
    try {
      const raw = localStorage.getItem(THEMES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((t) => {
        const item = t;
        const bg = normalizeHex(String(item.bg || ""));
        const fg = normalizeHex(String(item.fg || ""));
        const neutral = normalizeHex(String(item.neutral || ""));
        const neutralSeed = normalizeHex(String(item.neutralSeed || ""));
        const primarySeed = normalizeHex(String(item.primarySeed || ""));
        const kind = item.kind === "multicolor" ? "multicolor" : item.kind === "monochrome" ? "monochrome" : void 0;
        const bgIndex = Number.isFinite(item.bgIndex) ? Number(item.bgIndex) : void 0;
        const fgIndex = Number.isFinite(item.fgIndex) ? Number(item.fgIndex) : void 0;
        const primaryIndex = Number.isFinite(item.primaryIndex) ? Number(item.primaryIndex) : void 0;
        if (!bg || !fg) return null;
        return {
          id: String(item.id || ""),
          name: String(item.name || "Custom"),
          bg,
          fg,
          ...neutral ? { neutral } : {},
          ...kind ? { kind } : {},
          ...neutralSeed ? { neutralSeed } : {},
          ...primarySeed ? { primarySeed } : {},
          ...bgIndex != null ? { bgIndex } : {},
          ...fgIndex != null ? { fgIndex } : {},
          ...primaryIndex != null ? { primaryIndex } : {},
          ...item.contrastByShell ? { contrastByShell: item.contrastByShell } : {},
          ...item.primaryByShell ? { primaryByShell: item.primaryByShell } : {},
          createdAt: Number(item.createdAt || Date.now())
        };
      }).filter((t) => Boolean(t));
    } catch (e) {
      return [];
    }
  }
  function ensureBuiltinThemes() {
    const existing = readSavedThemes();
    const builtinIds = new Set(BUILTIN_THEMES.map((t) => t.id));
    const builtinNames = new Set(BUILTIN_THEMES.map((t) => t.name));
    const merged = [
      ...BUILTIN_THEMES,
      ...existing.filter((t) => !builtinIds.has(t.id) && !builtinNames.has(t.name))
    ];
    const seeded = localStorage.getItem(BUILTIN_THEMES_SEED_KEY);
    const prev = JSON.stringify(existing);
    const next = JSON.stringify(merged);
    if (prev !== next || seeded !== "1") {
      writeSavedThemes(merged);
      try {
        localStorage.setItem(BUILTIN_THEMES_SEED_KEY, "1");
      } catch (e) {
      }
    }
    return merged;
  }
  function writeSavedThemes(list) {
    try {
      localStorage.setItem(THEMES_KEY, JSON.stringify(list));
    } catch (e) {
    }
  }
  function nextThemeName(existing) {
    const used = new Set(existing.map((t) => t.name));
    for (let i = 1; i < 100; i += 1) {
      const name = `Custom ${String(i).padStart(2, "0")}`;
      if (!used.has(name)) return name;
    }
    return "Custom";
  }
  function makeThemeId() {
    return `t_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  }
  function readCanonicalFromTheme(mode) {
    var _a;
    return {
      ...CANONICAL[mode],
      neutral: CANONICAL[mode].fg,
      /* BANKING: body ink is the canonical fg */
      /* Shared mid-tone seed for both shells — not the shell body ink. */
      neutralSeed: BANKING_NEUTRAL_SEED,
      primarySeed: (_a = CANONICAL[mode].primarySeed) != null ? _a : CANONICAL[mode].fg
    };
  }
  function applyThemeChoice(wantTheme, current, fromShell) {
    const pair = resolveThemeChoice(wantTheme, current, fromShell);
    saveOverride(pair);
    applyDerivedTokens(pair.bg, pair.fg, pair.neutral, pair.kind, {
      neutralSeed: pair.neutralSeed,
      primarySeed: pair.primarySeed
    });
    document.documentElement.dataset.theme = wantTheme;
    return pair;
  }
  function resolveThemeChoice(wantTheme, current, fromShell) {
    var _a, _b, _c, _d, _e, _f, _g;
    const settings = settingsFromPair(current, fromShell);
    const fromSequences = buildMonochromeSequences(settings.neutralSeed, fromShell);
    const fromContrast = readLeavingShellContrast(current, fromShell, fromSequences);
    const contrastByShell = {
      ...current.contrastByShell,
      [fromShell]: fromContrast
    };
    const { foreground, background } = buildMonochromeSequences(settings.neutralSeed, wantTheme);
    const hadStoredContrast = ((_a = current.contrastByShell) == null ? void 0 : _a[wantTheme]) != null;
    let bgIndex;
    let fgIndex;
    if (hadStoredContrast) {
      bgIndex = clampSequenceIndex(contrastByShell[wantTheme].bgIndex, background.length);
      fgIndex = clampSequenceIndex(contrastByShell[wantTheme].fgIndex, foreground.length);
      const lightBg = (_c = (_b = contrastByShell.light) == null ? void 0 : _b.bgIndex) != null ? _c : fromShell === "light" ? fromContrast.bgIndex : void 0;
      if (wantTheme === "dark" && lightBg === 0 && bgIndex === background.length - 1) {
        bgIndex = clampSequenceIndex(DARK_BG_DEFAULT_INDEX, background.length);
      }
    } else {
      bgIndex = mapBackgroundIndexAcrossShells(
        fromContrast.bgIndex,
        fromSequences.background.length,
        background.length,
        fromShell,
        wantTheme
      );
      fgIndex = mapContrastIndexAcrossShells(
        fromContrast.fgIndex,
        fromSequences.foreground.length,
        foreground.length,
        fromShell,
        wantTheme
      );
      ({ bgIndex, fgIndex } = ensureReadableShellContrast(
        bgIndex,
        fgIndex,
        { foreground, background },
        wantTheme
      ));
    }
    contrastByShell[wantTheme] = { bgIndex, fgIndex };
    let nextSettings = { ...settings, bgIndex, fgIndex };
    const primaryByShell = {
      ...current.primaryByShell
    };
    if (settings.kind === "multicolor") {
      const primarySequence = buildPrimarySequence(settings.primarySeed);
      const pageBgHex = (_d = background[bgIndex]) != null ? _d : current.bg;
      const neutralFgHex = (_f = (_e = foreground[fgIndex]) != null ? _e : current.neutral) != null ? _f : current.fg;
      const fromPrimary = readShellPrimaryIndexRaw(current, fromShell, primarySequence);
      primaryByShell[fromShell] = fromPrimary;
      const hadStoredPrimary = ((_g = current.primaryByShell) == null ? void 0 : _g[wantTheme]) != null;
      let primaryIndex;
      if (hadStoredPrimary) {
        primaryIndex = clampSequenceIndex(primaryByShell[wantTheme], primarySequence.length);
      } else {
        primaryIndex = clampSequenceIndex(fromPrimary, primarySequence.length);
        primaryIndex = ensureAccessiblePrimaryIndex(
          primaryIndex,
          primarySequence,
          pageBgHex,
          neutralFgHex,
          "multicolor",
          wantTheme
        );
      }
      primaryByShell[wantTheme] = primaryIndex;
      nextSettings = { ...nextSettings, primaryIndex };
    }
    const pair = {
      ...withShellThemeState(pairFromSettings(nextSettings, wantTheme), wantTheme, {
        bgIndex,
        fgIndex,
        ...settings.kind === "multicolor" ? { primaryIndex: nextSettings.primaryIndex } : {}
      }),
      contrastByShell,
      ...settings.kind === "multicolor" ? { primaryByShell } : {},
      ...current.activeSavedThemeId != null ? { activeSavedThemeId: current.activeSavedThemeId } : {}
    };
    return pair;
  }
  function bootColorOverride() {
    var _a, _b;
    let firstBuiltinSeed = true;
    try {
      firstBuiltinSeed = localStorage.getItem(BUILTIN_THEMES_SEED_KEY) !== "1";
      ensureBuiltinThemes();
    } catch (e) {
    }
    let preferBank = false;
    try {
      preferBank = localStorage.getItem("uzBankWebPreferBankDefault") === "1";
    } catch (e) {
    }
    let saved = readSavedOverride();
    if ((!saved || firstBuiltinSeed) && !preferBank) {
      const builtin = getDefaultBuiltinTheme();
      const shell = shellThemeFromPair(builtin.bg, builtin.fg, builtin.neutral);
      const settings = settingsFromPair(builtin, shell);
      const pair = {
        ...pairFromSettings(settings, shell),
        ...builtin.contrastByShell ? { contrastByShell: builtin.contrastByShell } : {},
        ...builtin.primaryByShell ? { primaryByShell: builtin.primaryByShell } : {},
        activeSavedThemeId: builtin.id || DEFAULT_BUILTIN_THEME_ID
      };
      saveOverride(pair);
      saved = pair;
    }
    if (!saved) return null;
    const pairShell = shellThemeFromPair(saved.bg, saved.fg, saved.neutral);
    const systemShell = getSystemTheme();
    if (pairShell !== systemShell) {
      return applyThemeChoice(systemShell, saved, pairShell);
    }
    const resolved = pairFromSettings(settingsFromPair(saved, pairShell), pairShell);
    applyDerivedTokens(resolved.bg, resolved.fg, resolved.neutral, resolved.kind, {
      neutralSeed: (_a = saved.neutralSeed) != null ? _a : resolved.neutralSeed,
      primarySeed: (_b = saved.primarySeed) != null ? _b : resolved.primarySeed
    });
    document.documentElement.dataset.theme = pairShell;
    return { ...saved, ...resolved };
  }

  // scripts/theme-engine/banking.ts
  var TOKEN_CACHE_KEY = "uzBankWebColorTokens";
  var UZBANK_THEME_ID = "uzbank-default";
  var PREFER_BANK_KEY = "uzBankWebPreferBankDefault";
  function bankingTokens(pair) {
    var _a;
    const all = deriveTokens(pair.bg, pair.fg, pair.neutral, (_a = pair.kind) != null ? _a : "monochrome", {
      neutralSeed: pair.neutralSeed,
      primarySeed: pair.primarySeed
    });
    const out = {};
    for (const k of Object.keys(all)) if (k.startsWith("color-")) out[k] = all[k];
    return out;
  }
  function currentShell() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function clearInlineColorTokens() {
    const style = document.documentElement.style;
    const names = [];
    for (let i = 0; i < style.length; i++) {
      const n = style[i];
      if (n.startsWith("--color-")) names.push(n);
    }
    names.forEach((n) => style.removeProperty(n));
  }
  function applyTokenMap(map) {
    clearInlineColorTokens();
    if (!map) return;
    const style = document.documentElement.style;
    for (const k of Object.keys(map)) style.setProperty(`--${k}`, map[k]);
  }
  function persistPair(pair, shell) {
    const other = shell === "light" ? "dark" : "light";
    const otherPair = resolveThemeChoice(other, pair, shell);
    const stored = {
      ...pair,
      ...otherPair.contrastByShell ? { contrastByShell: otherPair.contrastByShell } : {},
      ...otherPair.primaryByShell ? { primaryByShell: otherPair.primaryByShell } : {}
    };
    saveOverride(stored);
    const cache = {};
    cache[shell] = bankingTokens(pair);
    cache[other] = bankingTokens(otherPair);
    try {
      localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
    }
    applyTokenMap(cache[shell]);
    return stored;
  }
  function clearToBankDefault() {
    clearSavedOverride();
    try {
      localStorage.removeItem(TOKEN_CACHE_KEY);
      localStorage.setItem(PREFER_BANK_KEY, "1");
    } catch (e) {
    }
    clearInlineColorTokens();
  }
  function applyCachedShell(shell) {
    try {
      const raw = localStorage.getItem(TOKEN_CACHE_KEY);
      const all = raw ? JSON.parse(raw) : null;
      applyTokenMap(all && all[shell]);
    } catch (e) {
      applyTokenMap(null);
    }
  }
  function isBankDefault() {
    return readSavedOverride() == null;
  }
  return __toCommonJS(banking_exports);
})();
