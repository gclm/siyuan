---
name: electron-version-upgrade
description: Workflow command scaffold for electron-version-upgrade in siyuan.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /electron-version-upgrade

Use this workflow when working on **electron-version-upgrade** in `siyuan`.

## Goal

Upgrade the Electron version used in the app, updating package and lock files as well as documentation.

## Common Files

- `app/package.json`
- `app/pnpm-lock.yaml`
- `.github/CONTRIBUTING.md`
- `.github/CONTRIBUTING_zh_CN.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update app/package.json with new Electron version
- Update app/pnpm-lock.yaml
- Update .github/CONTRIBUTING.md and .github/CONTRIBUTING_zh_CN.md for build instructions or compatibility

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.