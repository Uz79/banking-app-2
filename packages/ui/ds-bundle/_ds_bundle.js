/* @ds-bundle: {"namespace":"BankingAppUI","components":[{"name":"ActionBar","sourcePath":"components/general/ActionBar/ActionBar.jsx"},{"name":"Button","sourcePath":"components/general/Button/Button.jsx"},{"name":"Card","sourcePath":"components/general/Card/Card.jsx"},{"name":"CardAmount","sourcePath":"components/general/CardAmount/CardAmount.jsx"},{"name":"Carousel","sourcePath":"components/general/Carousel/Carousel.jsx"},{"name":"Chip","sourcePath":"components/general/Chip/Chip.jsx"},{"name":"Dialog","sourcePath":"components/general/Dialog/Dialog.jsx"},{"name":"Expander","sourcePath":"components/general/Expander/Expander.jsx"},{"name":"GroupAccountListItem","sourcePath":"components/general/GroupAccountListItem/GroupAccountListItem.jsx"},{"name":"IconButton","sourcePath":"components/general/IconButton/IconButton.jsx"},{"name":"ListItem","sourcePath":"components/general/ListItem/ListItem.jsx"},{"name":"NavBar","sourcePath":"components/general/NavBar/NavBar.jsx"},{"name":"SegmentedControl","sourcePath":"components/general/SegmentedControl/SegmentedControl.jsx"},{"name":"SelectField","sourcePath":"components/general/SelectField/SelectField.jsx"},{"name":"TabControl","sourcePath":"components/general/TabControl/TabControl.jsx"},{"name":"TextField","sourcePath":"components/general/TextField/TextField.jsx"}],"sourceHashes":{"components/general/ActionBar/ActionBar.jsx":"887a198cad32","components/general/ActionBar/ActionBar.d.ts":"2af6ee9fd870","components/general/ActionBar/ActionBar.prompt.md":"0c19e1db38f2","components/general/Button/Button.jsx":"4459e14456d7","components/general/Button/Button.d.ts":"5985c5e053a8","components/general/Button/Button.prompt.md":"5fa9190e648b","components/general/Card/Card.jsx":"f8458308f441","components/general/Card/Card.d.ts":"993ab60cf6d6","components/general/Card/Card.prompt.md":"6334431a5699","components/general/CardAmount/CardAmount.jsx":"7af979fffbfb","components/general/CardAmount/CardAmount.d.ts":"d4f1b485f1af","components/general/CardAmount/CardAmount.prompt.md":"e89e84973754","components/general/Carousel/Carousel.jsx":"c16028917f5e","components/general/Carousel/Carousel.d.ts":"ee3916702bbd","components/general/Carousel/Carousel.prompt.md":"4ace783a1a21","components/general/Chip/Chip.jsx":"4a298eed2792","components/general/Chip/Chip.d.ts":"5395c8530f07","components/general/Chip/Chip.prompt.md":"51002db05cc7","components/general/Dialog/Dialog.jsx":"994728ec0db0","components/general/Dialog/Dialog.d.ts":"bf6fccab651b","components/general/Dialog/Dialog.prompt.md":"a23aa9b59433","components/general/Expander/Expander.jsx":"a28e241ba485","components/general/Expander/Expander.d.ts":"d9f08ba79432","components/general/Expander/Expander.prompt.md":"cd3b873b41e8","components/general/GroupAccountListItem/GroupAccountListItem.jsx":"9f060f26b287","components/general/GroupAccountListItem/GroupAccountListItem.d.ts":"f67be04d98ad","components/general/GroupAccountListItem/GroupAccountListItem.prompt.md":"004640339ead","components/general/IconButton/IconButton.jsx":"ea0663c2aee2","components/general/IconButton/IconButton.d.ts":"26d2e8b9e699","components/general/IconButton/IconButton.prompt.md":"cc7710c71049","components/general/ListItem/ListItem.jsx":"9a3c675d8e7d","components/general/ListItem/ListItem.d.ts":"df27a3c550ca","components/general/ListItem/ListItem.prompt.md":"954c92838d15","components/general/NavBar/NavBar.jsx":"e469467b01de","components/general/NavBar/NavBar.d.ts":"2b8e36b2bc4b","components/general/NavBar/NavBar.prompt.md":"ccddc583c2de","components/general/SegmentedControl/SegmentedControl.jsx":"f238b3285555","components/general/SegmentedControl/SegmentedControl.d.ts":"c963b680b4f9","components/general/SegmentedControl/SegmentedControl.prompt.md":"0151a66eac95","components/general/SelectField/SelectField.jsx":"aab26d73bf0f","components/general/SelectField/SelectField.d.ts":"43e48d45b9b9","components/general/SelectField/SelectField.prompt.md":"f4d7ee90694e","components/general/TabControl/TabControl.jsx":"e6cde6d63d19","components/general/TabControl/TabControl.d.ts":"ff3885f060a2","components/general/TabControl/TabControl.prompt.md":"ea940d12fa6e","components/general/TextField/TextField.jsx":"3036feeff14f","components/general/TextField/TextField.d.ts":"31fac387984b","components/general/TextField/TextField.prompt.md":"99f32ffede10"},"inlinedExternals":[],"builtBy":"cc-design-sync"} */
"use strict";
var BankingAppUI = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx13(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs12(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx13;
      module.exports.jsxs = jsxs12;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs12 : jsx13)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // ds-bundle/.bundle-entry.mjs
  var bundle_entry_exports = {};
  __export(bundle_entry_exports, {
    ActionBar: () => ActionBar,
    Button: () => Button,
    Card: () => Card,
    CardAmount: () => CardAmount,
    Carousel: () => Carousel,
    Chip: () => Chip,
    Dialog: () => Dialog,
    Expander: () => Expander,
    GroupAccountListItem: () => GroupAccountListItem,
    IconButton: () => IconButton,
    ListItem: () => ListItem,
    NavBar: () => NavBar,
    SegmentedControl: () => SegmentedControl,
    SelectField: () => SelectField,
    TabControl: () => TabControl,
    TextField: () => TextField,
    ThemeRoot: () => ThemeRoot,
    __dsMainNs: () => dist_exports
  });
  init_define_import_meta_env();

  // .design-sync/theme-root.jsx
  init_define_import_meta_env();
  var import_react = __toESM(require_react_shim(), 1);
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var ICON_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0" style="position:absolute;overflow:hidden;pointer-events:none">
<symbol id="i-anchor" viewBox="0 0 24 24">
<path d="M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 22V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12H2C2 14.6522 3.05357 17.1957 4.92893 19.0711C6.8043 20.9464 9.34784 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-arrow-left" viewBox="0 0 24 24">
<path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-arrow-right" viewBox="0 0 24 24">
<path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-calendar" viewBox="0 0 24 24">
<path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-camera" viewBox="0 0 24 24">
<path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-chevron-down" viewBox="0 0 24 24">
<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-chevron-left" viewBox="0 0 24 24">
<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-chevron-right" viewBox="0 0 24 24">
<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-clock" viewBox="0 0 24 24">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-copy" viewBox="0 0 24 24">
<rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-corner-up-right" viewBox="0 0 24 24">
<path d="M15 14L20 9L15 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 20V13C4 11.9391 4.42143 10.9217 5.17157 10.1716C5.92172 9.42143 6.93913 9 8 9H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-coffee" viewBox="0 0 24 24">
<path d="M18 8h1a4 4 0 010 8h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 1v3M10 1v3M14 1v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-credit-card" viewBox="0 0 24 24">
<path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 10H23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-dollar-sign" viewBox="0 0 24 24">
<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-download" viewBox="0 0 24 24">
<path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 22 19 22H5C4.46957 22 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-edit-2" viewBox="0 0 24 24">
<path d="M16 3L21 8L8 21H3V16L16 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-eye" viewBox="0 0 24 24">
<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
</symbol>
<symbol id="i-gitlab" viewBox="0 0 24 24">
<g clip-path="url(#i-gitlab-clip0_207_82042)">
<path d="M22.65 14.39L12 22.13L1.35002 14.39C1.20725 14.285 1.10134 14.1375 1.04746 13.9687C0.993572 13.7998 0.99447 13.6183 1.05002 13.45L2.27002 9.66996L4.71002 2.15996C4.73369 2.09877 4.77136 2.04397 4.82002 1.99996C4.89926 1.92758 5.0027 1.88745 5.11002 1.88745C5.21734 1.88745 5.32078 1.92758 5.40002 1.99996C5.45141 2.04963 5.48927 2.11158 5.51002 2.17996L7.95002 9.66996H16.05L18.49 2.15996C18.5137 2.09877 18.5514 2.04397 18.6 1.99996C18.6793 1.92758 18.7827 1.88745 18.89 1.88745C18.9973 1.88745 19.1008 1.92758 19.18 1.99996C19.2314 2.04963 19.2693 2.11158 19.29 2.17996L21.73 9.68996L23 13.45C23.0505 13.6234 23.0438 13.8086 22.9807 13.9779C22.9177 14.1473 22.8017 14.2918 22.65 14.39Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="i-gitlab-clip0_207_82042">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</symbol>
<symbol id="i-home" viewBox="0 0 24 24">
<path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-life-buoy" viewBox="0 0 24 24">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.92999 4.93005L9.16999 9.17005" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.83 14.83L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.83 9.17005L19.07 4.93005" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.83 9.17001L18.36 5.64001" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.92999 19.07L9.16999 14.83" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-minus" viewBox="0 0 24 24">
<path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-more-horizontal" viewBox="0 0 24 24">
<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-payments" viewBox="0 0 24 24">
<path d="M7 22L2 17M2 17L7 12M2 17H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 12L22 7M22 7L17 2M22 7H10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-plus" viewBox="0 0 24 24">
<path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-repeat" viewBox="0 0 24 24">
<path d="M17 1L21 5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 23L3 19L7 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-rotate-ccw" viewBox="0 0 24 24">
<path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.51 15C4.15839 16.8404 5.38734 18.4202 7.01166 19.5014C8.63598 20.5826 10.5677 21.1066 12.5157 20.9945C14.4637 20.8824 16.3226 20.1402 17.8121 18.8798C19.3017 17.6194 20.3413 15.909 20.7742 14.0064C21.2072 12.1038 21.0101 10.112 20.2126 8.33111C19.4152 6.55025 18.0605 5.0768 16.3528 4.13277C14.6451 3.18874 12.6769 2.82527 10.7447 3.09713C8.81245 3.36898 7.02091 4.26143 5.64 5.64001L1 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-search" viewBox="0 0 24 24">
<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
<path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</symbol>
<symbol id="i-shield" viewBox="0 0 24 24">
<path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-sunrise-logo" viewBox="0 0 24 24">
<path d="M12.001 1C9.82526 0.999814 7.69841 1.64482 5.88932 2.85344C4.08024 4.06207 2.67019 5.78002 1.83752 7.79005C1.00484 9.80009 0.786918 12.0119 1.21131 14.1458C1.63573 16.2797 2.6834 18.2397 4.22184 19.7782C5.76025 21.3166 7.72037 22.3643 9.85423 22.7887C11.9881 23.2131 14.1999 22.9952 16.2099 22.1625C18.22 21.3298 19.9379 19.9198 21.1466 18.1107C22.3552 16.3016 23.0002 14.1747 23 11.9991C22.997 9.08282 21.8372 6.28694 19.7752 4.22485C17.7131 2.16278 14.9172 1.00299 12.001 1ZM12.001 3.25853C13.4685 3.25777 14.9126 3.62674 16.2 4.3314C17.4873 5.03604 18.5764 6.05367 19.3666 7.2903C20.1569 8.52692 20.6229 9.94272 20.7215 11.407C20.8202 12.8712 20.5484 14.3368 19.9312 15.6683H4.06973C3.45251 14.3367 3.18068 12.8711 3.27942 11.4067C3.37813 9.94241 3.8442 8.52658 4.63454 7.28992C5.42493 6.05325 6.51413 5.03566 7.8016 4.33106C9.08904 3.62647 10.5333 3.25761 12.001 3.25853Z" fill="currentColor"/>
</symbol>
<symbol id="i-trending-up" viewBox="0 0 24 24">
<path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 6H23V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-trending-down" viewBox="0 0 24 24">
<path d="M23 18L13.5 8.5L8.5 13.5L1 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 18H23V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-trash" viewBox="0 0 24 24">
<path d="M3 6H5H21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 11V17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 11V17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-trash-2" viewBox="0 0 24 24">
<path d="M3 6H5H21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 11V17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 11V17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-user" viewBox="0 0 24 24">
<path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-x-circle" viewBox="0 0 24 24">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="i-x" viewBox="0 0 24 24">
<path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
</svg>`;
  function ThemeRoot({ children }) {
    (0, import_react.useLayoutEffect)(() => {
      document.documentElement.dataset.theme = "light";
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "none" }, dangerouslySetInnerHTML: { __html: ICON_SPRITE } }),
      children
    ] });
  }

  // dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    ActionBar: () => ActionBar,
    Button: () => Button,
    Card: () => Card,
    CardAmount: () => CardAmount,
    Carousel: () => Carousel,
    Chip: () => Chip,
    Dialog: () => Dialog,
    Expander: () => Expander,
    GroupAccountListItem: () => GroupAccountListItem,
    IconButton: () => IconButton,
    ListItem: () => ListItem,
    NavBar: () => NavBar,
    SegmentedControl: () => SegmentedControl,
    SelectField: () => SelectField,
    TabControl: () => TabControl,
    TextField: () => TextField
  });
  init_define_import_meta_env();
  var import_jsx_runtime2 = __toESM(require_react_shim(), 1);
  var import_react2 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime3 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime4 = __toESM(require_react_shim(), 1);
  var import_react3 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime5 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime6 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime7 = __toESM(require_react_shim(), 1);
  var import_react4 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime8 = __toESM(require_react_shim(), 1);
  var import_react5 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime9 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime10 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime11 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime12 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime13 = __toESM(require_react_shim(), 1);
  function ActionBar({ items, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: ["action-buttons", className].filter(Boolean).join(" "), children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "action-button", onClick: item.onClick, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "action-button__circle", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { className: "action-button__icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("use", { href: `#i-${item.icon}` }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "action-button__label", children: item.label })
    ] }, item.key)) });
  }
  function buttonClassName({
    variant = "primary",
    size = "md",
    block,
    pressed,
    className
  }) {
    return [
      "uz-btn",
      `uz-btn--${variant}`,
      `uz-btn--${size}`,
      block && "uz-btn--block",
      pressed && "uz-btn--pressed",
      className
    ].filter(Boolean).join(" ");
  }
  function ButtonIcon({ icon }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { className: "uz-btn__icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("use", { href: `#i-${icon}` }) });
  }
  var Button = (0, import_react2.forwardRef)(
    function Button2(props, ref) {
      const { variant, size, block, pressed, icon, iconPosition = "leading", children, className, as, ...rest } = props;
      const cls = buttonClassName({ variant, size, block, pressed, className });
      const iconEl = icon ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ButtonIcon, { icon }) : null;
      const content = /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        iconPosition === "leading" && iconEl,
        children,
        iconPosition === "trailing" && iconEl
      ] });
      if (as === "a") {
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "a",
          {
            ref,
            className: cls,
            ...rest,
            children: content
          }
        );
      }
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          ref,
          type: "button",
          className: cls,
          ...rest,
          children: content
        }
      );
    }
  );
  var ICON_ONLY_VARIANT_CLASS = {
    secondary: "uz-btn--icon-only-secondary",
    tonal: "uz-btn--icon-only-filledtonal",
    plain: "uz-btn--icon-only"
  };
  var IconButton = (0, import_react2.forwardRef)(function IconButton2({ icon, variant = "plain", size = "sm", className, ...rest }, ref) {
    const cls = ["uz-btn", ICON_ONLY_VARIANT_CLASS[variant], size === "sm" && "uz-btn--sm", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { ref, type: "button", className: cls, ...rest, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ButtonIcon, { icon }) });
  });
  function Card({ title, headerEnd, children, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: ["section-card", className].filter(Boolean).join(" "), children: [
      (title || headerEnd) && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "section-card__header", children: [
        title && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "section-card__title", children: title }),
        headerEnd
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "section-card__body", children })
    ] });
  }
  function CardAmount({ currency, value }) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "section-card__amount", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "section-card__currency", children: currency }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "section-card__value", children: value })
    ] });
  }
  function Carousel({ children, index: indexProp, onIndexChange, prevLabel = "Previous", nextLabel = "Next", className }) {
    const [indexState, setIndexState] = (0, import_react3.useState)(0);
    const index = indexProp ?? indexState;
    const count = children.length;
    function setIndex(next) {
      const clamped = Math.max(0, Math.min(count - 1, next));
      if (indexProp === void 0) setIndexState(clamped);
      onIndexChange?.(clamped);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: ["carousel", className].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "carousel__track", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "carousel__slides", style: { transform: `translateX(-${index * 100}%)` }, children: children.map((child, i) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "carousel__slide", onClick: () => i !== index && setIndex(i), children: child }, i)) }) }),
      count > 1 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "carousel__pagination", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "carousel__arrow", "aria-label": prevLabel, onClick: () => setIndex(index - 1), disabled: index === 0, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { className: "carousel__arrow-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("use", { href: "#i-chevron-left" }) }) }),
        children.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "span",
          {
            className: ["carousel__dot", i === index && "carousel__dot--active"].filter(Boolean).join(" "),
            onClick: () => setIndex(i)
          },
          i
        )),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            type: "button",
            className: "carousel__arrow",
            "aria-label": nextLabel,
            onClick: () => setIndex(index + 1),
            disabled: index === count - 1,
            children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { className: "carousel__arrow-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("use", { href: "#i-chevron-right" }) })
          }
        )
      ] })
    ] });
  }
  function Chip({ size = "md", icon, children, onDismiss, dismissLabel = "Remove", className }) {
    const cls = ["chip", `chip--${size}`, className].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: cls, children: [
      icon && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { className: "chip__icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("use", { href: `#i-${icon}` }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "chip__label", children }),
      onDismiss && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ChipDismiss, { onClick: onDismiss, "aria-label": dismissLabel })
    ] });
  }
  function ChipDismiss(props) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "chip__dismiss", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { "aria-hidden": "true", focusable: "false", width: "12", height: "12", viewBox: "0 0 12 12", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("use", { href: "#i-close" }) }) });
  }
  function Dialog({ open, title, onClose, onBack, closeLabel = "Close", backLabel = "Back", children, footer, className }) {
    if (!open) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "modal-overlay modal-overlay--active", role: "presentation", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "modal-shell", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        className: ["modal", className].filter(Boolean).join(" "),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": typeof title === "string" ? title : void 0,
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "modal__nav", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "button",
              {
                type: "button",
                className: ["modal__back", !onBack && "modal__back--hidden"].filter(Boolean).join(" "),
                "aria-label": backLabel,
                onClick: onBack,
                disabled: !onBack,
                children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { className: "modal__back-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("use", { href: "#i-arrow-left" }) })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "modal__title", children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", className: "modal__close", "aria-label": closeLabel, onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { className: "modal__close-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("use", { href: "#i-x" }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "modal__body", children }),
          footer && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "modal__footer", children: footer })
        ]
      }
    ) }) });
  }
  function Expander({
    title,
    subtitle,
    leadingIcon,
    children,
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    className
  }) {
    const [openState, setOpenState] = (0, import_react4.useState)(defaultOpen);
    const open = openProp ?? openState;
    function toggle() {
      const next = !open;
      if (openProp === void 0) setOpenState(next);
      onOpenChange?.(next);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: "expander", type: "button", "aria-expanded": open, onClick: toggle, children: [
        leadingIcon && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "expander__leading", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("svg", { className: "expander__leading-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("use", { href: `#i-${leadingIcon}` }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "expander__content", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "expander__title", children: title }),
          subtitle && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "expander__subtitle", children: subtitle })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("svg", { className: "expander__chevron", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("use", { href: "#i-chevron-down" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { hidden: !open, children })
    ] });
  }
  function FormFieldShell({ label, htmlFor, error, children, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: ["form-field", className].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { className: "form-field__label", htmlFor, children: label }),
      children,
      error && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "form-field__error-row", role: "alert", children: error })
    ] });
  }
  function TextField({ label, id, error, clearable, clearLabel, value, defaultValue, onChange, ...rest }) {
    const autoId = (0, import_react5.useId)();
    const fieldId = id ?? autoId;
    const isControlled = value !== void 0;
    const [uncontrolledValue, setUncontrolledValue] = (0, import_react5.useState)(defaultValue ?? "");
    const currentValue = isControlled ? value : uncontrolledValue;
    const hasValue = String(currentValue ?? "").trim().length > 0;
    function handleChange(e) {
      if (!isControlled) setUncontrolledValue(e.target.value);
      onChange?.(e);
    }
    function handleClear() {
      if (!isControlled) setUncontrolledValue("");
    }
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(FormFieldShell, { label, htmlFor: fieldId, error, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "form-field__text-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          className: "form-field__input",
          id: fieldId,
          type: "text",
          value: isControlled ? value : uncontrolledValue,
          onChange: handleChange,
          ...rest
        }
      ),
      clearable && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          type: "button",
          className: ["form-field__clear", !hasValue && "form-field__clear--hidden"].filter(Boolean).join(" "),
          "aria-label": clearLabel ?? `Clear ${typeof label === "string" ? label : "field"}`,
          onClick: handleClear,
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", { className: "form-field__clear-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("use", { href: "#i-x-circle" }) })
        }
      )
    ] }) });
  }
  function SelectField({ label, id, error, children, ...rest }) {
    const autoId = (0, import_react5.useId)();
    const fieldId = id ?? autoId;
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(FormFieldShell, { label, htmlFor: fieldId, error, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "form-field__select-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("select", { className: "form-field__select", id: fieldId, ...rest, children }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "form-field__select-icon", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", { className: "form-field__select-chevron", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("use", { href: "#i-chevron-down" }) }) })
    ] }) });
  }
  function ListItem({ icon, title, subtitle, chevron, static: isStatic, onClick, className }) {
    const cls = ["list-item", isStatic && "list-item--static", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cls, onClick, role: onClick ? "button" : void 0, children: [
      icon && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("svg", { className: "list-item__icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("use", { href: `#i-${icon}` }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "list-item__content type-stack-tight", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "list-item__title type-sm type-trim", children: title }),
        subtitle && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "list-item__subtitle type-xs type-trim", children: subtitle })
      ] }),
      chevron && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("svg", { className: "list-item__chevron", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("use", { href: "#i-chevron-right" }) })
    ] });
  }
  function GroupAccountListItem({
    icon,
    title,
    subtitle,
    currency,
    value,
    static: isStatic,
    ariaLabel,
    onClick,
    className
  }) {
    const cls = ["list-item", "list-item--group-account", isStatic && "list-item--static", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("article", { className: cls, "aria-label": ariaLabel, onClick, children: [
      icon && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "list-item__media", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("svg", { className: "list-item__icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("use", { href: `#i-${icon}` }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "list-item__body type-stack-tight", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "list-item__title type-sm type-trim", children: title }),
        subtitle && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "list-item__subtitle type-xs type-trim", children: subtitle })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "list-item__end", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "list-item__currency type-xs", children: currency }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "list-item__value type-sm type-bold", children: value })
      ] })
    ] });
  }
  function NavBar({ title, onBack, backLabel = "Back", trailingIcon, onTrailing, trailingLabel, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("header", { className: ["view__nav", className].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "button",
        {
          type: "button",
          className: ["view__nav-btn", "view__nav-btn--leading", !onBack && "view__nav-btn--hidden"].filter(Boolean).join(" "),
          "aria-label": backLabel,
          onClick: onBack,
          disabled: !onBack,
          children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { className: "view__nav-btn-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("use", { href: "#i-arrow-left" }) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h1", { className: "page-title view__nav-title", children: title }),
      trailingIcon && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "button",
        {
          type: "button",
          className: "view__nav-btn view__nav-btn--trailing",
          "aria-label": trailingLabel,
          onClick: onTrailing,
          children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { className: "view__nav-btn-icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("use", { href: `#i-${trailingIcon}` }) })
        }
      )
    ] });
  }
  function SegmentedControl({
    options,
    value,
    onChange,
    size = "regular",
    block,
    className,
    ...rest
  }) {
    const cls = [
      "segmented",
      size === "sm" ? "segmented--sm" : "segmented--regular",
      block && "segmented--theme",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: cls, role: "group", ...rest, children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "button",
      {
        type: "button",
        className: [
          "segmented__option",
          option.value === value && "segmented__option--active"
        ].filter(Boolean).join(" "),
        onClick: () => onChange(option.value),
        children: option.label
      },
      option.value
    )) });
  }
  function TabControl({ items, activeKey, onSelect, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("nav", { className: ["tab-bar", className].filter(Boolean).join(" "), children: items.map((item) => {
      const active = item.key === activeKey;
      const content = /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: ["tab-bar__icon-wrap", active && "tab-bar__icon-wrap--active"].filter(Boolean).join(" "), children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("svg", { className: "tab-bar__icon", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("use", { href: `#i-${item.icon}` }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "tab-bar__label", children: item.label })
      ] });
      return item.href ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        "a",
        {
          className: "tab-bar__item",
          href: item.href,
          "aria-current": active ? "page" : void 0,
          onClick: () => onSelect?.(item.key),
          children: content
        },
        item.key
      ) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        "button",
        {
          type: "button",
          className: "tab-bar__item",
          "aria-current": active ? "page" : void 0,
          onClick: () => onSelect?.(item.key),
          children: content
        },
        item.key
      );
    }) });
  }
  return __toCommonJS(bundle_entry_exports);
})();
window.BankingAppUI=BankingAppUI.__dsMainNs?Object.assign({},BankingAppUI,BankingAppUI.__dsMainNs,{__dsMainNs:undefined}):BankingAppUI;
