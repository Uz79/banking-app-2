import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  CORE_FILES,
  collectPathsFromFiles,
  diffTokenSets,
  loadTokenSet,
  mergeEngineeringTokens,
  printSection,
  readJson,
  repoRoot,
  resolveInputDir,
  tokensDir,
  validateTokenFiles,
  writeJson,
} from "./token-lib.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function archiveLiveTokens(archiveDir) {
  fs.mkdirSync(archiveDir, { recursive: true });

  for (const rel of CORE_FILES) {
    const src = path.join(tokensDir, rel);
    if (fs.existsSync(src)) copyFile(src, path.join(archiveDir, rel));
  }

  for (const name of ["metadata.json", "themes.json"]) {
    const src = path.join(tokensDir, name);
    if (fs.existsSync(src)) copyFile(src, path.join(archiveDir, name));
  }
}

function restoreFromArchive(archiveDir) {
  printSection("Rollback");
  for (const rel of CORE_FILES) {
    const src = path.join(archiveDir, rel);
    if (fs.existsSync(src)) copyFile(src, path.join(tokensDir, rel));
  }
  for (const name of ["metadata.json", "themes.json"]) {
    const src = path.join(archiveDir, name);
    if (fs.existsSync(src)) copyFile(src, path.join(tokensDir, name));
  }
  console.log(`  ✓ Restored live tokens from ${path.relative(repoRoot, archiveDir)}`);
}

function writePromotedFiles(files, inputDir) {
  for (const rel of CORE_FILES) {
    writeJson(path.join(tokensDir, rel), files[rel]);
  }

  for (const name of ["metadata.json", "themes.json"]) {
    if (files[name]) {
      writeJson(path.join(tokensDir, name), files[name]);
      continue;
    }
    for (const alt of [`$${name}`]) {
      const src = path.join(inputDir, alt);
      if (fs.existsSync(src)) {
        writeJson(path.join(tokensDir, name), readJson(src));
        break;
      }
    }
  }
}

function runTokensBuild() {
  const result = spawnSync("node", ["scripts/generate-tokens-css.mjs"], {
    cwd: path.join(repoRoot, "apps/web"),
    stdio: "inherit",
    encoding: "utf8",
  });
  return result.status === 0;
}

function main() {
  const inputArg = process.argv[2];
  const inputDir = resolveInputDir(inputArg);

  if (!inputDir) {
    console.error("Usage: npm run tokens:promote -- <folder>\n");
    console.error("  <folder>  Name under designs/tokens/_NEW/ (e.g. 260609_tokens)");
    console.error("            or an absolute path to a token export folder.\n");
    process.exit(1);
  }

  const folderName = path.basename(inputDir);
  const archiveDir = path.join(tokensDir, "_archive", `${timestamp()}_before_${folderName}`);

  console.log("tokens:promote");
  console.log(`  input:   ${path.relative(repoRoot, inputDir)}`);
  console.log(`  live:    ${path.relative(repoRoot, tokensDir)}`);
  console.log(`  archive: ${path.relative(repoRoot, archiveDir)}`);

  const { files: nextFiles, missing } = loadTokenSet(inputDir);
  const { files: liveFiles } = loadTokenSet(tokensDir);

  if (missing.length) {
    console.error("\n✗ Cannot promote — export is missing required files:");
    for (const file of missing) console.error(`  • ${file}`);
    process.exit(1);
  }

  printSection("Diff vs live (before merge)");
  const { added, removed, changed } = diffTokenSets(
    collectPathsFromFiles(liveFiles),
    collectPathsFromFiles(nextFiles)
  );
  console.log(`  added:   ${added.length}`);
  console.log(`  removed: ${removed.length}`);
  console.log(`  changed: ${changed.length}`);
  if (changed.length) {
    console.log("\n  Design changes:");
    for (const row of changed.slice(0, 8)) {
      console.log(`    ~ ${row.path}`);
      console.log(`        ${row.from} → ${row.to}`);
    }
    if (changed.length > 8) console.log(`    … and ${changed.length - 8} more`);
  }

  const mergedPaths = mergeEngineeringTokens(nextFiles, liveFiles);

  printSection("Engineering token merge");
  if (mergedPaths.length) {
    for (const p of mergedPaths) console.log(`  + carried forward ${p} (from live)`);
  } else {
    console.log("  ✓ No engineering tokens needed from live");
  }

  const validation = validateTokenFiles(nextFiles);
  if (!validation.ok) {
    printSection("Pre-promote validation failed");
    for (const msg of validation.errors) console.log(`  ✗ ${msg}`);
    console.log("\n✗ BLOCKED — export cannot be promoted even after merge.\n");
    process.exit(1);
  }
  console.log("\n  ✓ Post-merge validation passed");

  printSection("Archive + promote");
  archiveLiveTokens(archiveDir);
  console.log(`  ✓ Archived live tokens`);

  try {
    writePromotedFiles(nextFiles, inputDir);
    console.log(`  ✓ Wrote ${CORE_FILES.length} core files to designs/tokens/`);

    printSection("tokens:build");
    if (!runTokensBuild()) {
      restoreFromArchive(archiveDir);
      console.error("\n✗ tokens:build failed — live tokens restored from archive.\n");
      process.exit(1);
    }
    console.log("  ✓ Generated tokens.css + typography.css");
  } catch (err) {
    restoreFromArchive(archiveDir);
    console.error(`\n✗ Promote failed — live tokens restored from archive.`);
    console.error(err);
    process.exit(1);
  }

  printSection("Spot-check checklist");
  console.log("  • Overview + account-details (sticky nav / content-indication)");
  console.log("  • Payment-details modal (scroll chrome)");
  console.log("  • One Storybook Live story");
  console.log("  • Mobile: no horizontal page drag");

  printSection("Result");
  console.log("  ✓ PROMOTED — commit designs/tokens/* and apps/web/css/tokens.css + typography.css\n");
}

main();
