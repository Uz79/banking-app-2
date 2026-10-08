"use strict";
var __dsPreview = (() => {
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
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
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

  // ds-raw:__ds_raw__
  var require_ds_raw = __commonJS({
    "ds-raw:__ds_raw__"(exports, module) {
      init_define_import_meta_env();
      module.exports = window.BankingAppUI;
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
      function jsx2(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx2;
      module.exports.jsxs = jsxs;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs : jsx2)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // .design-sync/previews/Card.tsx
  var Card_exports = {};
  __export(Card_exports, {
    CardAccountsInvestment: () => CardAccountsInvestment,
    CardHeaderTitleOnly: () => CardHeaderTitleOnly,
    CardHeaderWithTotal: () => CardHeaderWithTotal,
    CardOffers: () => CardOffers,
    ConfigurableProductItem: () => ConfigurableProductItem,
    ConfigurableSectionCard: () => ConfigurableSectionCard,
    ListItemGroupAccount: () => ListItemGroupAccount,
    ListItemWithChevron: () => ListItemWithChevron,
    ProductItemSingle: () => ProductItemSingle,
    SectionCardOtherProducts: () => SectionCardOtherProducts
  });
  init_define_import_meta_env();

  // ds-shim:ds
  var ds_exports = {};
  __export(ds_exports, {
    default: () => ds_default
  });
  init_define_import_meta_env();
  __reExport(ds_exports, __toESM(require_ds_raw()));
  var g = window.BankingAppUI;
  var ds_default = "default" in g ? g.default : g;

  // .design-sync/previews/Card.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var previewFrameStyle = { padding: "1rem", maxWidth: "28rem" };
  function PreviewFrame({ children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: previewFrameStyle, children });
  }
  function ConfigurableProductItem() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "home", title: "Household", subtitle: "CH35 0900 0000 2470 2920 1", currency: "CHF", value: "10'570.00", ariaLabel: "Household" }) });
  }
  function ConfigurableSectionCard() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Card, { title: "Accounts & investment", headerEnd: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.CardAmount, { currency: "CHF", value: "65'570.00" }), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "home", title: "Household", subtitle: "CH35 0900 0000 2470 2920 1", currency: "CHF", value: "10'570.00", ariaLabel: "Household" }) }) });
  }
  function CardAccountsInvestment() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ds_exports.Card, { title: "Accounts & investment", headerEnd: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.CardAmount, { currency: "CHF", value: "65'570.00" }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "home", title: "Household", subtitle: "CH35 0900 0000 2470 2920 1", currency: "CHF", value: "10'570.00", ariaLabel: "Household" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "shield", title: "Savings account", subtitle: "CH35 0900 0000 2470 2920 2", currency: "CHF", value: "25'000.00", ariaLabel: "Savings account" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "clock", title: "Custody account", subtitle: "123.456.78", currency: "CHF", value: "20'000.00", ariaLabel: "Custody account" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "trending-up", title: "Retirement savings 3a", subtitle: "7740205-08", currency: "CHF", value: "10'000.00", ariaLabel: "Retirement savings 3a" })
    ] }) });
  }
  function ProductItemSingle() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "home", title: "Household", subtitle: "CH35 0900 0000 2470 2920 1", currency: "CHF", value: "10'570.00", ariaLabel: "Household" }) });
  }
  function SectionCardOtherProducts() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Card, { title: "Other products", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.ListItem, { icon: "credit-card", title: "VISA Gold", subtitle: "available CHF 4'700.00" }) }) });
  }
  function ListItemGroupAccount() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.GroupAccountListItem, { icon: "anchor", title: "Savings account", subtitle: "CH35 0900 0000 2470 2920 2", currency: "CHF", value: "25'000.00", static: true, ariaLabel: "Savings account" }) });
  }
  function ListItemWithChevron() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.ListItem, { icon: "shield", title: "Accounts", subtitle: "Private & saving accounts", chevron: true }) });
  }
  function CardOffers() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ds_exports.Card, { title: "Offers", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.ListItem, { icon: "shield", title: "Accounts", subtitle: "Private & saving accounts", chevron: true }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.ListItem, { icon: "credit-card", title: "Cards", subtitle: "Order new cards, monitor", chevron: true }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.ListItem, { icon: "trending-up", title: "Investment", subtitle: "Funds, trading, asset management", chevron: true })
    ] }) });
  }
  function CardHeaderWithTotal() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Card, { title: "Accounts & investment", headerEnd: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.CardAmount, { currency: "CHF", value: "65'570.00" }), children: null }) });
  }
  function CardHeaderTitleOnly() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Card, { title: "Other products", children: null }) });
  }
  return __toCommonJS(Card_exports);
})();
