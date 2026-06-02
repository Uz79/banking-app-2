import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '../../..');
const designsComponentsDir = path.join(repoRoot, 'designs', 'components');
const designsScreensDir = path.join(repoRoot, 'designs', 'screens');

const componentsOutputDir = path.join(repoRoot, 'apps', 'web', 'src', 'stories', 'components', 'design-export');
const pagesOutputDir = path.join(repoRoot, 'apps', 'web', 'src', 'stories', 'pages', 'design-export');
const legacyComponentsOutputDir = path.join(
  repoRoot,
  'apps',
  'web',
  'src',
  'stories',
  'generated',
  'components',
);
const legacyPagesOutputDir = path.join(repoRoot, 'apps', 'web', 'src', 'stories', 'generated', 'pages');
const legacyDesignExportsDir = path.join(
  repoRoot,
  'apps',
  'web',
  'src',
  'stories',
  'generated',
  'design-exports',
);
const legacyMonolith = path.join(
  repoRoot,
  'apps',
  'web',
  'src',
  'stories',
  'generated',
  'DesignExports.stories.mjs',
);

const SKIP_DIRS = new Set(['_archive', '_inbox', '_replaced', 'flows']);

/** Stable CSF export id for all generated design-export stories (avoids index collisions). */
const DESIGN_EXPORT_STORY_EXPORT = 'DesignExport';

const SCREEN_PREFIX_GROUPS = [
  ['payment-flow-', 'Payment Flow'],
  ['profile-', 'Profile'],
  ['dialog-', 'Dialog'],
];

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function titleCase(s) {
  return String(s)
    .split('-')
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(' ');
}

function storyTitleFromRelDir(relDir) {
  const segments = relDir.split('/').filter(Boolean);
  return ['Components', ...segments.map(titleCase)].join('/');
}

/** Storybook title path mirroring designs/screens/<slug> with logical grouping. */
function storyTitleFromScreenSlug(slug) {
  if (slug === 'flow-screens') return 'Pages/Flows/Flow Screens';
  if (slug === 'internal-account-transfer') return 'Pages/Flows/Internal Account Transfer';

  for (const [prefix, group] of SCREEN_PREFIX_GROUPS) {
    if (slug.startsWith(prefix)) {
      return `Pages/${group}/${titleCase(slug.slice(prefix.length))}`;
    }
  }

  return `Pages/${titleCase(slug)}`;
}

function collectComponentJsonFiles() {
  const out = [];
  const stack = [designsComponentsDir];
  while (stack.length) {
    const dir = stack.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (SKIP_DIRS.has(ent.name) || ent.name.startsWith('.')) continue;
        stack.push(full);
        continue;
      }
      if (!ent.isFile() || !ent.name.endsWith('.json')) continue;
      if (/\s\d+\.json$/.test(ent.name)) continue;
      const base = ent.name.replace(/\.json$/, '');
      if (base !== path.basename(path.dirname(full))) continue;
      out.push(full);
    }
  }
  return out;
}

function collectScreenJsonFiles() {
  const out = [];
  if (!isDir(designsScreensDir)) return out;

  for (const ent of fs.readdirSync(designsScreensDir, { withFileTypes: true })) {
    if (!ent.isDirectory() || SKIP_DIRS.has(ent.name) || ent.name.startsWith('.')) continue;
    const jsonPath = path.join(designsScreensDir, ent.name, `${ent.name}.json`);
    if (fs.existsSync(jsonPath)) out.push(jsonPath);
  }
  return out;
}

function buildVariantHtml(def, assetBasePath, { screen = false } = {}) {
  const name = def.name;
  const desc = def.description || '';
  const variants = (def.assets && def.assets.variants) || {};
  const imgClass = screen ? 'de-img de-img--screen' : 'de-img';
  const gridClass = screen ? 'de-grid de-grid--screen' : 'de-grid';

  const lines = [];
  if (desc) {
    lines.push(`<p class="de-desc">${escapeHtml(desc)}</p>`);
  }

  for (const [variantKey, states] of Object.entries(variants)) {
    const stateEntries = Object.entries(states || {});
    if (stateEntries.length === 0) continue;

    lines.push(`<h4 class="de-variant">${escapeHtml(variantKey)}</h4>`);
    lines.push(`<div class="${gridClass}">`);

    for (const [stateKey, relPath] of stateEntries) {
      const imgSrc = `/${assetBasePath}/${relPath}`.replace(/\\/g, '/');
      const label = escapeHtml(`${variantKey} / ${stateKey}`);
      lines.push(
        [
          '<figure class="de-item">',
          `  <img class="${imgClass}" src="${imgSrc}" alt="${label}" loading="lazy" />`,
          `  <figcaption class="de-cap">${label}</figcaption>`,
          '</figure>',
        ].join('\n'),
      );
    }

    lines.push('</div>');
  }

  if (lines.length === 0) {
    lines.push(`<p class="de-desc">No variant assets indexed for <code>${escapeHtml(name)}</code>.</p>`);
  }

  return lines.join('\n');
}

function writeDesignExportStory({
  def,
  assetBasePath,
  relDir,
  outputDir,
  title,
  idPrefix,
  sourceLabel,
  layout,
  screen = false,
}) {
  const inner = buildVariantHtml(def, assetBasePath, { screen });
  const relParts = relDir.split('/').filter(Boolean);
  const fileStem = relParts[relParts.length - 1] || def.name;
  const outFile = path.join(outputDir, ...relParts, `${fileStem}.stories.mjs`);
  const storyId = `${idPrefix}-${relDir.replace(/\//g, '-').replace(/[^a-zA-Z0-9-]/g, '')}-design-export`;

  const screenStyles = screen
    ? `
      .de-grid--screen { grid-template-columns: repeat(auto-fit, minmax(min(100%, 390px), 1fr)); }
      .de-img--screen { max-height: 85vh; object-fit: contain; object-position: top center; }`
    : '';

  const mjs = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated by: apps/web/scripts/generate-storybook-design-exports.mjs
// Source: ${sourceLabel}

export default {
  id: ${JSON.stringify(storyId)},
  title: ${JSON.stringify(title)},
  tags: ['!autodocs'],
  parameters: {
    layout: ${JSON.stringify(layout)},
    docs: { disable: true },
  },
};

export const ${DESIGN_EXPORT_STORY_EXPORT} = {
  name: 'Design export',
  render: () => \`
    <style>
      .de-wrap { padding: 1rem; }
      .de-desc { margin: 0 0 1rem; color: var(--color-fg-secondary); font-size: 0.875rem; }
      .de-variant { margin: 1rem 0 0.5rem; font-size: 0.95rem; }
      .de-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; align-items: start; }
      .de-item { margin: 0; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--color-separator); background: var(--color-bg); }
      .de-img { width: 100%; height: auto; display: block; }
      .de-cap { margin-top: 0.5rem; font-size: 0.875rem; color: var(--color-fg-secondary); }${screenStyles}
    </style>
    <div class="de-wrap">
      ${inner}
    </div>
  \`,
};
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, mjs, 'utf8');
  return outFile;
}

function rmDirRecursive(p) {
  if (!fs.existsSync(p)) return;
  for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, ent.name);
    if (ent.isDirectory()) rmDirRecursive(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(p);
}

function generateComponentStories() {
  if (!isDir(designsComponentsDir)) {
    throw new Error(`designs/components not found at ${designsComponentsDir}`);
  }

  rmDirRecursive(componentsOutputDir);
  fs.mkdirSync(componentsOutputDir, { recursive: true });

  const jsonFiles = collectComponentJsonFiles();
  const written = [];

  for (const p of jsonFiles) {
    const def = readJson(p);
    if (!def?.name) continue;
    const relDir = path.relative(designsComponentsDir, path.dirname(p)).replace(/\\/g, '/');
    if (!def.assets?.variants || Object.keys(def.assets.variants).length === 0) continue;

    const outFile = writeDesignExportStory({
      def,
      assetBasePath: `designs/components/${relDir}`,
      relDir,
      outputDir: componentsOutputDir,
      title: storyTitleFromRelDir(relDir),
      idPrefix: 'components',
      sourceLabel: `designs/components/${relDir}/${def.name}.json`,
      layout: 'padded',
      screen: false,
    });
    written.push(outFile);
  }

  return written;
}

function generatePageStories() {
  if (!isDir(designsScreensDir)) {
    console.warn(`designs/screens not found at ${designsScreensDir} — skipping page stories`);
    return [];
  }

  rmDirRecursive(pagesOutputDir);
  fs.mkdirSync(pagesOutputDir, { recursive: true });

  const jsonFiles = collectScreenJsonFiles();
  const written = [];

  for (const p of jsonFiles) {
    const def = readJson(p);
    if (!def?.name) continue;
    const slug = path.basename(path.dirname(p));
    if (!def.assets?.variants || Object.keys(def.assets.variants).length === 0) continue;

    const outFile = writeDesignExportStory({
      def,
      assetBasePath: `designs/screens/${slug}`,
      relDir: slug,
      outputDir: pagesOutputDir,
      title: storyTitleFromScreenSlug(slug),
      idPrefix: 'pages',
      sourceLabel: `designs/screens/${slug}/${def.name}.json`,
      layout: 'fullscreen',
      screen: true,
    });
    written.push(outFile);
  }

  return written;
}

function main() {
  rmDirRecursive(legacyDesignExportsDir);
  rmDirRecursive(legacyComponentsOutputDir);
  rmDirRecursive(legacyPagesOutputDir);
  if (fs.existsSync(legacyMonolith)) {
    fs.unlinkSync(legacyMonolith);
  }

  const componentStories = generateComponentStories();
  const pageStories = generatePageStories();

  componentStories.sort((a, b) => a.localeCompare(b));
  pageStories.sort((a, b) => a.localeCompare(b));

  console.log(
    `Wrote ${componentStories.length} component design stor(ies) under ${path.relative(repoRoot, componentsOutputDir)}/`,
  );
  console.log(
    `Wrote ${pageStories.length} page design stor(ies) under ${path.relative(repoRoot, pagesOutputDir)}/ (titles mirror designs/screens/)`,
  );
}

main();
