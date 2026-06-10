import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, "../../..");
export const tokensDir = path.join(repoRoot, "designs/tokens");
export const manifestPath = path.join(tokensDir, "required-manifest.json");
export const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
export const CORE_FILES = manifest.requiredFiles;

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function get(obj, p) {
  return p.split(".").reduce((acc, k) => acc?.[k], obj);
}

export function setTokenAtPath(root, tokenPath, node) {
  const parts = tokenPath.split(".");
  let cur = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (!cur[key] || typeof cur[key] !== "object") cur[key] = {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = structuredClone(node);
}

export function tokenValue(t) {
  return t?.value;
}

export function hasToken(root, tokenPath) {
  const node = get(root, tokenPath);
  return node != null && tokenValue(node) != null && tokenValue(node) !== "";
}

export function isTokenLeaf(node) {
  return (
    node &&
    typeof node === "object" &&
    !Array.isArray(node) &&
    Object.prototype.hasOwnProperty.call(node, "value")
  );
}

export function flattenTokens(obj, prefix = "") {
  const paths = {};
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return paths;

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    const nextPath = prefix ? `${prefix}.${key}` : key;
    if (isTokenLeaf(value)) {
      paths[nextPath] = value.value;
    } else if (value && typeof value === "object") {
      Object.assign(paths, flattenTokens(value, nextPath));
    }
  }
  return paths;
}

export function resolveTokenString(value, brand, alias) {
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

export function isUnresolvedRef(value) {
  return typeof value === "string" && /^\{.+}$/.test(value);
}

export function loadTokenSet(dir) {
  const files = {};
  const missing = [];

  for (const rel of CORE_FILES) {
    const abs = path.join(dir, rel);
    if (!fs.existsSync(abs)) {
      missing.push(rel);
      continue;
    }
    files[rel] = readJson(abs);
  }

  for (const optional of manifest.optionalFiles ?? []) {
    const candidates = [optional.name, ...(optional.altNames ?? [])];
    const found = candidates.find((name) => fs.existsSync(path.join(dir, name)));
    if (found) files[optional.name] = readJson(path.join(dir, found));
  }

  return { files, missing };
}

function fontMetrics(brand, alias) {
  const m = get(brand, "font-metrics.profile-pro");
  return {
    unitsPerEm: Number(resolveTokenString(tokenValue(m?.["units-per-em"]), brand, alias)),
    capHeight: Number(resolveTokenString(tokenValue(m?.["cap-height"]), brand, alias)),
    typoAscender: Number(
      resolveTokenString(tokenValue(m?.["typo-ascender"]), brand, alias)
    ),
    typoDescender: Number(
      resolveTokenString(tokenValue(m?.["typo-descender"]), brand, alias)
    ),
  };
}

function leadingTrimPx(fontSize, lineHeight, metrics) {
  const fsPx = Number(fontSize);
  const lh = Number(lineHeight);
  if (!metrics.unitsPerEm || !fsPx || !lh) {
    return { trimTop: 0, trimBottom: 0 };
  }
  const scale = fsPx / metrics.unitsPerEm;
  const capPx = metrics.capHeight * scale;
  const ascPx = metrics.typoAscender * scale;
  const descPx = metrics.typoDescender * scale;
  const lineBox = fsPx * lh;
  const halfLeading = (lineBox - fsPx) / 2;
  return {
    trimTop: halfLeading + (ascPx - capPx),
    trimBottom: halfLeading + descPx,
  };
}

function styleTypography(node, metrics, brand, alias) {
  const fsPx = node.fontSize.value;
  const lh = node.lineHeight.value;
  const { trimTop, trimBottom } = leadingTrimPx(fsPx, lh, metrics);
  return { fontSize: fsPx, trimTop, trimBottom };
}

export function assertTypographyPipeline(brand, alias, mobile) {
  const errors = [];
  const metrics = fontMetrics(brand, alias);
  const { unitsPerEm, capHeight, typoAscender, typoDescender } = metrics;

  if (!unitsPerEm || !capHeight || !typoAscender || !typoDescender) {
    errors.push(
      "brand.font-metrics.profile-pro is missing or incomplete — need units-per-em, cap-height, typo-ascender, typo-descender."
    );
  }

  const t = mobile.typography;
  for (const [label, node] of [
    ["text-sm", t.paragraph.sm],
    ["text-xs", t.paragraph["x-sm"]],
  ]) {
    const style = styleTypography(node, metrics, brand, alias);
    if (!style.trimTop || !style.trimBottom) {
      errors.push(
        `Leading trim for ${label} computed to 0 — font-metrics or responsive typography may be broken.`
      );
    }
  }

  const textMd = styleTypography(t.paragraph.md, metrics, brand, alias);
  if (Number(textMd.fontSize) !== 16) {
    errors.push(
      `paragraph.md must be 16px on mobile (got ${textMd.fontSize}px) — accessibility base size.`
    );
  }

  return errors;
}

export function diffTokenSets(currentPaths, nextPaths) {
  const added = [];
  const removed = [];
  const changed = [];

  const all = new Set([...Object.keys(currentPaths), ...Object.keys(nextPaths)]);
  for (const p of [...all].sort()) {
    const cur = currentPaths[p];
    const next = nextPaths[p];
    if (cur === undefined) added.push({ path: p, value: next });
    else if (next === undefined) removed.push({ path: p, value: cur });
    else if (cur !== next) changed.push({ path: p, from: cur, to: next });
  }

  return { added, removed, changed };
}

export function resolveInputDir(arg) {
  if (!arg) return null;
  const direct = path.resolve(arg);
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) return direct;
  const fromNew = path.join(tokensDir, "_NEW", arg);
  if (fs.existsSync(fromNew) && fs.statSync(fromNew).isDirectory()) return fromNew;
  return null;
}

export function mergeEngineeringTokens(nextFiles, liveFiles) {
  const merged = [];
  const brand = nextFiles["brand.json"];
  const alias = nextFiles["alias.json"];
  const liveBrand = liveFiles["brand.json"];
  const liveAlias = liveFiles["alias.json"];

  for (const item of manifest.brand) {
    if (!hasToken(brand, item.path) && hasToken(liveBrand, item.path)) {
      setTokenAtPath(brand, item.path, get(liveBrand, item.path));
      merged.push(`brand.${item.path}`);
    }
  }

  for (const item of manifest.alias) {
    if (!hasToken(alias, item.path) && hasToken(liveAlias, item.path)) {
      setTokenAtPath(alias, item.path, get(liveAlias, item.path));
      merged.push(`alias.${item.path}`);
    }
  }

  return merged;
}

export function collectPathsFromFiles(files) {
  const paths = {};
  for (const file of CORE_FILES) {
    if (files[file]) {
      Object.assign(paths, flattenTokens(files[file], file.replace(/\.json$/, "")));
    }
  }
  return paths;
}

export function validateTokenFiles(files) {
  const errors = [];
  const missing = CORE_FILES.filter((file) => !files[file]);
  if (missing.length) {
    errors.push(`Missing required files: ${missing.join(", ")}`);
    return { ok: false, errors };
  }

  const brand = files["brand.json"];
  const alias = files["alias.json"];
  const mobile = files["responsive/mobile.json"];

  for (const item of manifest.brand) {
    if (!hasToken(brand, item.path)) {
      errors.push(`Missing brand token: ${item.path} — ${item.reason}`);
    }
  }

  for (const item of manifest.alias) {
    if (!hasToken(alias, item.path)) {
      errors.push(`Missing alias token: ${item.path} — ${item.reason}`);
    }
  }

  for (const item of manifest.generatorRefs) {
    const resolved = resolveTokenString(item.ref, brand, alias);
    if (isUnresolvedRef(resolved)) {
      errors.push(`Unresolved generator ref: ${item.ref} — ${item.reason}`);
    }
  }

  errors.push(...assertTypographyPipeline(brand, alias, mobile));

  return { ok: errors.length === 0, errors };
}

export function printSection(title) {
  console.log(`\n${title}`);
  console.log("─".repeat(title.length));
}
