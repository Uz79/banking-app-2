import path from "node:path";
import {
  CORE_FILES,
  collectPathsFromFiles,
  diffTokenSets,
  hasToken,
  isUnresolvedRef,
  loadTokenSet,
  manifest,
  printSection,
  repoRoot,
  resolveInputDir,
  resolveTokenString,
  tokensDir,
  validateTokenFiles,
} from "./token-lib.mjs";

function main() {
  const inputArg = process.argv[2];
  const inputDir = resolveInputDir(inputArg);

  if (!inputDir) {
    console.error("Usage: npm run tokens:validate -- <folder>\n");
    console.error("  <folder>  Name under designs/tokens/_NEW/ (e.g. 260609_tokens)");
    console.error("            or an absolute path to a token export folder.\n");
    process.exit(1);
  }

  console.log("tokens:validate");
  console.log(`  input:   ${path.relative(repoRoot, inputDir)}`);
  console.log(`  live:    ${path.relative(repoRoot, tokensDir)}`);
  console.log(`  manifest: designs/tokens/required-manifest.json`);

  const { files: nextFiles, missing } = loadTokenSet(inputDir);
  const { files: liveFiles } = loadTokenSet(tokensDir);

  let failed = false;

  printSection("Required files");
  if (missing.length) {
    failed = true;
    for (const file of missing) console.log(`  ✗ missing ${file}`);
  } else {
    for (const file of CORE_FILES) console.log(`  ✓ ${file}`);
  }

  const brand = nextFiles["brand.json"];
  const alias = nextFiles["alias.json"];

  printSection("Required-token manifest (brand)");
  for (const item of manifest.brand) {
    const ok = hasToken(brand, item.path);
    if (!ok) {
      failed = true;
      console.log(`  ✗ ${item.path}`);
      console.log(`      ${item.reason}`);
    } else {
      console.log(`  ✓ ${item.path}`);
    }
  }

  printSection("Required-token manifest (alias)");
  for (const item of manifest.alias) {
    const ok = hasToken(alias, item.path);
    if (!ok) {
      failed = true;
      console.log(`  ✗ ${item.path}`);
      console.log(`      ${item.reason}`);
    } else {
      console.log(`  ✓ ${item.path}`);
    }
  }

  if (brand && alias) {
    printSection("Generator reference resolution");
    for (const item of manifest.generatorRefs) {
      const resolved = resolveTokenString(item.ref, brand, alias);
      const ok = !isUnresolvedRef(resolved);
      if (!ok) {
        failed = true;
        console.log(`  ✗ ${item.ref} → unresolved`);
        console.log(`      ${item.reason}`);
      } else {
        console.log(`  ✓ ${item.ref} → ${resolved}`);
      }
    }
  }

  if (nextFiles["brand.json"] && nextFiles["alias.json"] && nextFiles["responsive/mobile.json"]) {
    printSection("Typography pipeline (same checks as tokens:build)");
    const validation = validateTokenFiles(nextFiles);
    if (!validation.ok) {
      failed = true;
      for (const msg of validation.errors) {
        if (
          msg.startsWith("Missing ") ||
          msg.startsWith("Unresolved ") ||
          msg.includes("font-metrics") ||
          msg.includes("Leading trim") ||
          msg.includes("paragraph.md")
        ) {
          console.log(`  ✗ ${msg}`);
        }
      }
    } else {
      console.log("  ✓ font-metrics, leading trim, and paragraph.md (16px mobile)");
    }
  }

  printSection("Diff vs live tokens");
  const { added, removed, changed } = diffTokenSets(
    collectPathsFromFiles(liveFiles),
    collectPathsFromFiles(nextFiles)
  );
  console.log(`  added:   ${added.length}`);
  console.log(`  removed: ${removed.length}`);
  console.log(`  changed: ${changed.length}`);

  const showLimit = 12;
  if (removed.length) {
    console.log("\n  Removed paths (first entries):");
    for (const row of removed.slice(0, showLimit)) {
      console.log(`    - ${row.path}`);
    }
    if (removed.length > showLimit) console.log(`    … and ${removed.length - showLimit} more`);
  }
  if (changed.length) {
    console.log("\n  Changed values (first entries):");
    for (const row of changed.slice(0, showLimit)) {
      console.log(`    ~ ${row.path}`);
      console.log(`        ${row.from} → ${row.to}`);
    }
    if (changed.length > showLimit) console.log(`    … and ${changed.length - showLimit} more`);
  }
  if (added.length) {
    console.log("\n  Added paths (first entries):");
    for (const row of added.slice(0, showLimit)) {
      console.log(`    + ${row.path}`);
    }
    if (added.length > showLimit) console.log(`    … and ${added.length - showLimit} more`);
  }

  printSection("Result");
  if (failed) {
    console.log("  ✗ BLOCKED — fix missing tokens or run tokens:promote to merge from live.");
    console.log("  See designs/tokens/required-manifest.json for engineering tokens Figma may omit.\n");
    process.exit(1);
  }

  console.log("  ✓ PASS — safe to promote this export to designs/tokens/ and run tokens:build.\n");
}

main();
