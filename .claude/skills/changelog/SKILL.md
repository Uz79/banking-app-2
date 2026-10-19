---
name: changelog
description: Adds commits not yet recorded to the Unreleased section of CHANGELOG.md using git history. Use when the user invokes /changelog, asks to "update the changelog", or wants to record what changed before validating and merging a feature branch.
---

# Changelog Skill

Run once per feature branch, right before validating and merging it. It is not meant to run continuously. It turns the branch's commits into bullets under `## Unreleased` in `CHANGELOG.md`, so the changelog stays a readable record of what shipped.

## Workflow

1. Run the script from the project root (the directory containing `.git/`):

```bash
python3 <skill-dir>/scripts/changelog.py
```

`<skill-dir>` is the directory containing this skill. Add `--dry-run` to print what would be added without writing the file.

2. The script finds the commits not yet reflected in `CHANGELOG.md` and writes one bullet per commit (merge commits are skipped). It puts them at the top of a `### Commits` subsection inside `## Unreleased`, creating that subsection if needed. Existing Added / Changed / Decided entries are left alone.

3. Review the output and tidy the wording by hand. Raw commit subjects aren't always reader-friendly. Move a bullet into Added / Changed / Decided if it fits better there.

4. Stage `CHANGELOG.md` and stop. Don't commit it. It rides along in whatever commit or merge closes out the feature.

## How "not yet recorded" works

`CHANGELOG.md` uses `## Unreleased` and dated release sections, not a heading per date. So the script keeps a marker comment directly under the Unreleased heading:

```markdown
## Unreleased
<!-- changelog: last-commit 808149e... -->
```

- Each run adds the commits after that SHA and moves the marker to `HEAD`.
- With no marker (the first run), it assumes everything up to the last commit that touched `CHANGELOG.md` is already recorded.
- Re-running with nothing new prints a message and leaves the file unchanged.
- Leave the marker in place. When moving Unreleased into a dated release section, move the entries and keep the marker under the new `## Unreleased`.

## Notes

- Run from the project root.
- The marker is an HTML comment, so it doesn't show in rendered Markdown.
- If the marker's commit is gone (for example after a rebase), the script falls back to the first-run rule.
- **Cutting a release moves the marker too.** When `## Unreleased` is cut into a dated release section, the `<!-- changelog: last-commit <sha> -->` marker must move to the new, empty `## Unreleased` section. If it stays inside the dated release, the script no longer sees it under Unreleased and falls back to the first-run assumption (everything up to the last commit that touched `CHANGELOG.md` is already recorded). That fallback can silently skip commits made since the marker, or re-list ones already recorded.
