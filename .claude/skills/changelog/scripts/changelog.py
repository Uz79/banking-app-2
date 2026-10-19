#!/usr/bin/env python3
"""Add commits not yet recorded to the '## Unreleased' section of CHANGELOG.md.

Progress is tracked with a marker comment right under the Unreleased heading:

    <!-- changelog: last-commit <sha> -->

New commit subjects go in as bullets at the top of an Unreleased "### Commits"
subsection, and the marker moves to HEAD. Re-running with nothing new changes
nothing. Use --dry-run to print the result without writing the file.
"""

import re
import subprocess
import sys
from pathlib import Path

CHANGELOG = Path("CHANGELOG.md")
UNRELEASED = "## Unreleased"
COMMITS_HEADING = "### Commits"
MARKER_RE = re.compile(r"^<!-- changelog: last-commit ([0-9a-f]{7,40}) -->\s*$")


def git(*args, check=True):
    return subprocess.run(["git", *args], capture_output=True, text=True, check=check)


def commit_exists(sha):
    return git("cat-file", "-e", f"{sha}^{{commit}}", check=False).returncode == 0


def baseline(lines):
    """The commit after which nothing is recorded yet."""
    for line in lines:
        m = MARKER_RE.match(line)
        if m and commit_exists(m.group(1)):
            return m.group(1)
    # No usable marker: assume everything up to the last commit that touched
    # CHANGELOG.md is already reflected in it.
    out = git("log", "-1", "--format=%H", "--", str(CHANGELOG)).stdout.strip()
    return out or None


def new_commits(since):
    rng = f"{since}..HEAD" if since else "HEAD"
    out = git("log", "--no-merges", "--format=%s", rng).stdout
    return [s.strip() for s in out.splitlines() if s.strip()]


def find_unreleased(lines):
    """Return (start, end) line indexes of the Unreleased section, or None."""
    for i, line in enumerate(lines):
        if line.strip() == UNRELEASED:
            end = next((j for j in range(i + 1, len(lines)) if lines[j].startswith("## ")), len(lines))
            return i, end
    return None


def update(lines, subjects, head):
    marker = f"<!-- changelog: last-commit {head} -->\n"
    bullets = [f"- {s}\n" for s in subjects]

    section = find_unreleased(lines)
    if section is None:
        # No Unreleased section yet: create one before the first '## ' heading.
        at = next((i for i, l in enumerate(lines) if l.startswith("## ")), len(lines))
        block = [f"{UNRELEASED}\n", marker, "\n", f"{COMMITS_HEADING}\n", *bullets, "\n"]
        return lines[:at] + block + lines[at:]

    start, end = section
    body = [l for l in lines[start + 1:end] if not MARKER_RE.match(l)]
    # Move the marker to HEAD: it sits directly under the heading.
    body = [marker] + body

    commits_at = next((i for i, l in enumerate(body) if l.strip() == COMMITS_HEADING), None)
    if commits_at is not None:
        body = body[:commits_at + 1] + bullets + body[commits_at + 1:]
    else:
        while body and body[-1].strip() == "":
            body.pop()
        body += ["\n", f"{COMMITS_HEADING}\n", *bullets, "\n"]
    if body and body[0] == marker and (len(body) < 2 or body[1].strip() != ""):
        body.insert(1, "\n")
    return lines[:start + 1] + body + lines[end:]


def main():
    dry_run = "--dry-run" in sys.argv[1:]

    if not Path(".git").exists():
        print("No .git directory found — run this from the project root.")
        sys.exit(1)
    if not CHANGELOG.exists():
        print("CHANGELOG.md not found — create it with a '## Unreleased' section first.")
        sys.exit(1)

    head = git("rev-parse", "HEAD").stdout.strip()
    lines = CHANGELOG.read_text().splitlines(keepends=True)
    since = baseline(lines)
    subjects = new_commits(since)

    if not subjects:
        print("No new commits since last entry — CHANGELOG.md is up to date.")
        return

    updated = "".join(update(lines, subjects, head))
    if dry_run:
        print(f"Would add {len(subjects)} entries (since {since[:7] if since else 'the beginning'}):")
        for s in subjects:
            print(f"- {s}")
        return
    CHANGELOG.write_text(updated)
    print(f"Added {len(subjects)} new entries to CHANGELOG.md under Unreleased.")


if __name__ == "__main__":
    main()
