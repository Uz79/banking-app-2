---
name: feature-spec
description: Start the next UZ Bank feature the spec-driven way. Finds the next item in the roadmap, interviews before writing anything.
---

# Feature spec

Turns the next roadmap item (or a requested change) into a reviewed spec on its own branch. The spec is the contract for everything after it, so it has to be shaped by the user, not guessed. That is why the interview comes before any file is written.

## 1. Gather context (read-only)

Read these before asking anything, so the questions are specific:

- `specs/roadmap.md`: the next item is the first one not marked done. If the user asked for a specific change, that is the item.
- `specs/mission.md` (principles, audience) and `specs/tech-spec.md` (stack, pages, the "Not using" list, the Decisions table).
- `AGENTS.md`, especially:
  - Protect the presentable state: `main` deploys on every push.
  - The Conventions (registering a page in five places, the character's isolation rule, generated files, colour tokens, no em dashes).
  - Git: this agent stages but does not commit unless asked; on a feature branch it commits per task group once implementation is approved.
- `specs/baseline/`: what exists, and the smoke test every branch must pass.
- `CHANGELOG.md`, the recent entries, for tone.
- The most recent `specs/<YYYY-MM-DD>-*/` folder if one exists. Match its structure and depth.
- The code the change will touch: read it, don't assume. For UI, also look at the page in the browser if you can.
- `git status` and the current branch.

Also check whether the most recent dated spec folder is still the natural home for this work: is it a small follow-up of a feature just finished? If so, don't start a new folder. Add a task group to its `plan.md` and new decisions (continuing the D-numbers) to its `requirements.md`. Say so, and confirm it in the interview.

If the item is ambiguous (a spec folder already exists for it, or the roadmap item groups several things), say so and ask. Don't pick one silently.

## 2. Create the feature branch

Create `feature/<feature-name>` from `main`, in kebab-case, the same name as the spec folder without the date.

Before branching:

- If you are on another branch with unmerged commits, stop and ask.
- If the index holds staged changes unrelated to this feature, tell the user and park them (`git stash`) or ask. Never stage `.idea/`, `.DS_Store`, `settings.local.json` or `packages/ui/.claude/`.

## 3. Interview before writing

Use AskUserQuestion. Ask what is actually being built: scope, constraints, and anything the roadmap entry left vague. Cover at least:

- Scope: what this branch includes, and what is explicitly out.
- The most consequential open decision (a new page, a new dependency, a new storage key, a change to a shared rule or component that other pages use).
- How it should look and move, if that isn't settled: a Figma node, a reference, or "match page X".
- The merge gate: which checks must pass (always `npm run build`, the feature's browser checks and the baseline smoke test; anything else).

Make each question's first option your recommendation and mark it "(Recommended)". Describe trade-offs neutrally. Don't guess at requirements the user hasn't confirmed. Write nothing to disk until you have the answers.

## 4. Write the spec

Folder: `specs/<today YYYY-MM-DD>-<feature-name>/` with three files.

Decide anything the interview didn't cover using the project's defaults, and record each choice in the Decisions table so it can be overruled at review.

### requirements.md

- **Branch** at the very top, e.g. `Branch: feature/<name>`.
- **Scope:** what is in, what is out. Tie it to the roadmap item and to `tech-spec.md`.
- **Decisions:** a numbered table with the columns `# | Decision | Why`, rows D1, D2, … so a `plan.md` task group or a later follow-up can cite a decision by number. Check each against `tech-spec.md`'s "Not using" list and Decisions table; flag any conflict rather than deviating.
- **Context:** only what a reader needs that isn't in the other specs (findings from reading the code, file and line references).
- **Open questions** to resolve during the build, if any.

Respect the standing rules: vanilla JS and CSS, no new runtime dependency without a recorded reason, colours only through `--color-*` tokens, a reduced-motion path for every animation, no em dashes in copy, every new page registered in all five places, new storage keys listed in `apps/web/README.md`.

### plan.md

Task groups with `- [ ]` checkboxes, naming the files to touch. Each group ends with something visible in the browser, so it can be reviewed on its own. End with a wrap-up group: `npm run build`, the validation pass, the baseline smoke test, and the docs (mark the roadmap item done, `CHANGELOG.md` under `Unreleased`, `tech-spec.md` if pages, systems or decisions changed, `apps/web/README.md` if storage keys or files changed).

### validation.md

A `- [ ]` checklist: the build gate, then manual browser checks grouped by area. Name specific cases: empty states, the first visit (nothing in `localStorage`), Light and Dark, a Multi-color theme, desktop and phone width (390px), keyboard, reduced motion, the admin guard if it is a design system page. End with a section that copies the baseline smoke test from `specs/baseline/validation.md`.

End the file with a dated line recording when and how it was actually checked, e.g. `Checked on <date> against <branch>, <browser>, <viewports>. Not checked: …`. A checklist with nothing saying it was ever run doesn't count as validation. Fill the line in when the checks are run, not before.

### Also update

`specs/roadmap.md`: link the new spec folder against the item, and fix anything stale you found.

## 5. Hand back

Once the spec files are written, stage them (only the files you created or edited) and stop. Don't commit, push, or begin any implementation until the user explicitly says to proceed. The user reviews the spec first, and that review is the point.

Report briefly: the branch name, the spec folder, the scope chosen, the decisions most worth a second look, and anything you corrected in the roadmap. Then ask whether to commit the spec, and how to proceed:

- Start task group 1 and pause after each group for review, or
- Implement every remaining task group through to validation without stopping in between.

Once the user says go, implementation follows `AGENTS.md`: on the feature branch, commit each task group yourself with a clear, atomic message, without asking per group. Merging into `main` still needs an explicit ask, because `main` deploys.
