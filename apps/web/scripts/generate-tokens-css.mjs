import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "../../..");
const tokensDir = path.join(repoRoot, "designs/tokens");
const outFile = path.join(repoRoot, "apps/web/css/tokens.css");

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

const brand = readJson(path.join(tokensDir, "brand.json"));
const alias = readJson(path.join(tokensDir, "alias.json"));
const light = readJson(path.join(tokensDir, "mapped/light.json"));
const dark = readJson(path.join(tokensDir, "mapped/dark.json"));
const mobile = readJson(path.join(tokensDir, "responsive/mobile.json"));
const desktop = readJson(path.join(tokensDir, "responsive/desktop.json"));

const pxToRem = (px) =>
  `${(Number(px) / 16)
    .toFixed(4)
    .replace(/\.0+$/, "")
    .replace(/0+$/, "")}rem`;

function get(obj, p) {
  return p.split(".").reduce((acc, k) => acc?.[k], obj);
}

function tokenValue(t) {
  return t?.value;
}

/** Follow {path.to.token} refs through brand → alias until a leaf value is reached. */
function resolveTokenString(value) {
  if (typeof value !== "string") return value;
  let v = value;
  for (let i = 0; i < 40; i += 1) {
    const m = v.match(/^\{(.+)\}$/);
    if (!m) return v;
    const ref = m[1];
    const next =
      tokenValue(get(brand, ref)) ?? tokenValue(get(alias, ref)) ?? null;
    if (next == null || next === v) return v;
    v = typeof next === "string" ? next : String(next);
  }
  return v;
}

function spaceRem(n) {
  const px = resolveTokenString(tokenValue(get(alias, `space.${n}`)));
  return pxToRem(px);
}

function radiusRem(key) {
  const px = resolveTokenString(tokenValue(get(alias, `radius.${key}`)));
  return pxToRem(px);
}

function fontFamily() {
  return tokenValue(get(brand, "font-family.grotesk")) || "system-ui";
}

function fontWeight(key) {
  const raw = resolveTokenString(tokenValue(get(brand, `font-weight.${key}`)));
  const r = String(raw || "").toLowerCase();
  if (r.includes("bold")) return 700;
  if (r.includes("medium")) return 500;
  return 400;
}

function typographyVars(src) {
  const t = src.typography;
  return {
    hero: t.hero.fontSize.value,
    h1: t.h1.fontSize.value,
    h2: t.h2.fontSize.value,
    h3: t.h3.fontSize.value,
    h4: t.h4.fontSize.value,
    h5: t.h5.fontSize.value,
    h6: t.h6.fontSize.value,
    textLg: t.paragraph.lg.fontSize.value,
    textMd: t.paragraph.md.fontSize.value,
    textSm: t.paragraph.sm.fontSize.value,
    textXs: t.paragraph["x-sm"].fontSize.value,
    caption: t.caption.fontSize.value,
    lhHero: t.hero.lineHeight.value,
    lhH1: t.h1.lineHeight.value,
    lhH2: t.h2.lineHeight.value,
    lhH3: t.h3.lineHeight.value,
    lhH4: t.h4.lineHeight.value,
    lhH5: t.h5.lineHeight.value,
    lhH6: t.h6.lineHeight.value,
    lhText: t.paragraph.md.lineHeight.value,
    lhCaption: t.caption.lineHeight.value,
  };
}

/** Read mapped color token by path e.g. 'background.background', 'border.border-secondary'. */
function mappedColor(map, dottedPath) {
  const keys = dottedPath.split(".");
  let node = map;
  for (const k of keys) node = node?.[k];
  return resolveTokenString(node?.value);
}

function themeBlock(map, mode) {
  const isLight = mode === "light";
  const bg = mappedColor(map, "background.background");
  const bgSecondary = mappedColor(map, "background.background-secondary");
  const fg = mappedColor(map, "foreground.foreground");
  const fgSecondary = mappedColor(map, "foreground.foreground-secondary");
  const fgLabel = mappedColor(map, "foreground.foreground-hover");
  const fgDisabled = mappedColor(map, "foreground.foreground-disabled");
  const separator = mappedColor(map, "foreground.foreground-separator");
  const borderSecondary = mappedColor(map, "border.border-secondary");
  const borderPrimary = mappedColor(map, "border.border");

  const btnPrimaryBg = mappedColor(map, "button.primary.background");
  const btnPrimaryFg = mappedColor(map, "button.primary.foreground");
  const btnPrimaryHover = mappedColor(map, "button.primary.background-hover");
  const btnPrimaryPressed = isLight
    ? resolveTokenString("{color.primary.800}")
    : resolveTokenString("{color.primary.100}");

  const btnSecondaryBg = mappedColor(map, "button.secondary.background");
  const btnSecondaryBorder = mappedColor(map, "button.secondary.border");
  const btnSecondaryFg = mappedColor(map, "button.secondary.foreground");
  const btnSecondaryHover = mappedColor(map, "button.secondary.background-hover");
  const btnSecondaryPressed = isLight
    ? resolveTokenString("{color.primary.900-20pc}")
    : resolveTokenString("{color.neutral.white-20pc}");

  const btnTonalBg = bgSecondary;
  const btnTonalBorder = bgSecondary;
  const btnTonalFg = fg;
  const btnTonalHover = isLight
    ? resolveTokenString("{color.primary.100}")
    : resolveTokenString("{color.primary.600}");
  const btnTonalPressed = isLight
    ? resolveTokenString("{color.primary.200}")
    : resolveTokenString("{color.primary.800}");

  const navItemActiveBg = isLight
    ? "var(--color-bg-secondary)"
    : resolveTokenString("{color.neutral.white-10pc}");
  const showAllBg = isLight
    ? separator
    : resolveTokenString("{color.neutral.white-10pc}");
  const iconCircleFill = isLight ? "var(--color-fg)" : resolveTokenString("{color.neutral.white}");

  const overlayScrim = isLight ? "rgba(0, 0, 0, 0.45)" : "rgba(0, 0, 0, 0.62)";
  const navElevatedShadow = isLight
    ? "rgba(0, 0, 0, 0.06)"
    : "rgba(0, 0, 0, 0.35)";
  const modalElevatedShadow = isLight
    ? "rgba(0, 0, 0, 0.12)"
    : "rgba(0, 0, 0, 0.45)";

  const actionCircleHover = isLight
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(0, 21, 126, 0.1)";
  const actionCirclePressed = isLight
    ? "rgba(255, 255, 255, 0.22)"
    : "rgba(0, 21, 126, 0.2)";

  const inputStrokeFocus = isLight ? "var(--color-fg)" : borderPrimary;

  const segmentedTrack = isLight
    ? 'rgba(0, 21, 126, 0.05)'
    : 'rgba(255, 255, 255, 0.08)';

  const bgSidebar = isLight ? bg : "var(--color-bg)";

  return `  color-scheme: ${isLight ? "light" : "dark"};

  --color-bg: ${bg};
  --color-bg-secondary: ${bgSecondary};
  --color-bg-sidebar: ${bgSidebar};
  --color-nav-item-active-bg: ${navItemActiveBg};
  --color-show-all-bg: ${showAllBg};
  --color-segmented-track-bg: ${segmentedTrack};
  --color-fg: ${fg};
  --color-fg-secondary: ${fgSecondary};
  --color-fg-label: ${fgLabel};
  --color-fg-disabled: ${fgDisabled};
  --color-separator: ${separator};

  --color-btn-primary-bg: ${btnPrimaryBg};
  --color-btn-primary-fg: ${btnPrimaryFg};
  --color-btn-primary-hover: ${btnPrimaryHover};
  --color-btn-primary-pressed: ${btnPrimaryPressed};

  --color-btn-secondary-bg: ${btnSecondaryBg};
  --color-btn-secondary-border: ${btnSecondaryBorder};
  --color-btn-secondary-fg: ${btnSecondaryFg};
  --color-btn-secondary-hover: ${btnSecondaryHover};
  --color-btn-secondary-pressed: ${btnSecondaryPressed};

  --color-btn-tonal-bg: ${btnTonalBg};
  --color-btn-tonal-border: ${btnTonalBorder};
  --color-btn-tonal-fg: ${btnTonalFg};
  --color-btn-tonal-hover: ${btnTonalHover};
  --color-btn-tonal-pressed: ${btnTonalPressed};

  --color-icon-circle-fill: ${iconCircleFill};
  --color-overlay-scrim: ${overlayScrim};
  --color-nav-elevated-shadow: ${navElevatedShadow};
  --color-modal-elevated-shadow: ${modalElevatedShadow};

  --color-surface-state-hover: var(--color-btn-secondary-hover);
  --color-surface-state-pressed: var(--color-btn-secondary-pressed);

  --color-action-circle-state-hover: ${actionCircleHover};
  --color-action-circle-state-pressed: ${actionCirclePressed};

  --color-input-surface: var(--color-bg);
  --color-input-stroke: ${borderSecondary};
  --color-input-stroke-focus: ${inputStrokeFocus};
`;
}

const mob = typographyVars(mobile);
const desk = typographyVars(desktop);

const css = `@font-face {
  font-family: 'Profile Pro';
  src: url('../assets/fonts/ProfilePro-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Profile Pro';
  src: url('../assets/fonts/ProfilePro-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Profile Pro';
  src: url('../assets/fonts/ProfilePro-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Generated from designs/tokens/* — theme: <html data-theme="light|dark"> */
:root {
  --modal-payment-max-width: 640px;
  --confirmation-dialog-max-width: 640px;

  --section-card-header-height: 1.5rem;
  --section-card-header-padding-x: var(--space-3);
  --section-card-header-gap-to-body: 0.25rem;

  --space-1: ${spaceRem(1)};
  --space-2: ${spaceRem(2)};
  --space-3: ${spaceRem(3)};
  --space-4: ${spaceRem(4)};
  --space-5: ${spaceRem(5)};
  --space-6: ${spaceRem(6)};
  --space-7: ${spaceRem(7)};
  --space-8: ${spaceRem(8)};
  --space-9: ${spaceRem(9)};
  --space-10: ${spaceRem(10)};
  --space-11: ${spaceRem(11)};
  --space-12: ${spaceRem(12)};

  --radius-small: ${radiusRem("small")};
  --radius-regular: ${radiusRem("regular")};
  --radius-pill: ${radiusRem("pill")};

  --font-family: '${fontFamily()}', sans-serif;
  --fw-regular: ${fontWeight("regular")};
  --fw-medium: ${fontWeight("medium")};
  --fw-bold: ${fontWeight("bold")};

  --fs-hero: ${pxToRem(mob.hero)};
  --fs-h1: ${pxToRem(mob.h1)};
  --fs-h2: ${pxToRem(mob.h2)};
  --fs-h3: ${pxToRem(mob.h3)};
  --fs-h4: ${pxToRem(mob.h4)};
  --fs-h5: ${pxToRem(mob.h5)};
  --fs-h6: ${pxToRem(mob.h6)};
  --fs-text-lg: ${pxToRem(mob.textLg)};
  --fs-text-md: ${pxToRem(mob.textMd)};
  --fs-text-sm: ${pxToRem(mob.textSm)};
  --fs-text-xs: ${pxToRem(mob.textXs)};
  --fs-caption: ${pxToRem(mob.caption)};

  --lh-hero: ${mob.lhHero};
  --lh-h1: ${mob.lhH1};
  --lh-h2: ${mob.lhH2};
  --lh-h3: ${mob.lhH3};
  --lh-h4: ${mob.lhH4};
  --lh-h5: ${mob.lhH5};
  --lh-h6: ${mob.lhH6};
  --lh-text: ${mob.lhText};
  --lh-caption: ${mob.lhCaption};

  --btn-pad-y-sm: 0;
  --btn-pad-x-sm: var(--space-2);
  --btn-pad-y-md: var(--space-2);
  --btn-pad-x-md: var(--space-3);
  --btn-pad-y-lg: var(--space-4);
  --btn-pad-x-lg: var(--space-5);
  --btn-height-sm: 2rem;

  --input-stroke-px: 1px;
  --input-stroke-focus-px: 2px;
  --input-stroke-width: 1px;
}

html[data-theme="light"] {
${themeBlock(light, "light")}
}

html[data-theme="dark"] {
${themeBlock(dark, "dark")}
}

@media (min-width: 1280px) {
  :root {
    --fs-hero: ${pxToRem(desk.hero)};
    --fs-h1: ${pxToRem(desk.h1)};
    --fs-h2: ${pxToRem(desk.h2)};
    --fs-h3: ${pxToRem(desk.h3)};
    --fs-h4: ${pxToRem(desk.h4)};
    --fs-h5: ${pxToRem(desk.h5)};
    --fs-h6: ${pxToRem(desk.h6)};
    --fs-text-lg: ${pxToRem(desk.textLg)};
  }
}
`;

fs.writeFileSync(outFile, css, "utf8");
console.log(`Wrote ${outFile}`);
