---
name: merge-dev-branch
description: Workflow command scaffold for merge-dev-branch in siyuan.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /merge-dev-branch

Use this workflow when working on **merge-dev-branch** in `siyuan`.

## Goal

Merge changes from the remote dev branch into the local dev branch, synchronizing all recently changed files.

## Common Files

- `various files changed since last merge (often includes app/package.json, kernel/go.mod, kernel/go.sum, and feature-specific files)`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Fetch latest changes from remote dev branch
- Merge changes into local dev branch
- Resolve any conflicts and commit merged files

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.