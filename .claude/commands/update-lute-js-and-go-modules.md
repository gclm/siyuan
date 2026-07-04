---
name: update-lute-js-and-go-modules
description: Workflow command scaffold for update-lute-js-and-go-modules in siyuan.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-lute-js-and-go-modules

Use this workflow when working on **update-lute-js-and-go-modules** in `siyuan`.

## Goal

Update the Lute JavaScript library and synchronize Go module files, typically as part of improving or fixing HTML clipping, selection, or related features.

## Common Files

- `app/stage/protyle/js/lute/lute.min.js`
- `kernel/go.mod`
- `kernel/go.sum`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update app/stage/protyle/js/lute/lute.min.js
- Update kernel/go.mod and kernel/go.sum to synchronize Go dependencies

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.