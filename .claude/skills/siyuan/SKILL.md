```markdown
# siyuan Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides an in-depth guide to the development patterns, coding conventions, and common workflows used in the siyuan repository—a Go-based project with a modular structure and a focus on maintainable, collaborative development. It covers file organization, naming conventions, import/export styles, and step-by-step instructions for frequent repository tasks such as dependency updates, feature improvements, and style fixes.

## Coding Conventions

### File Naming
- **CamelCase** is used for file names, e.g.:
  - `MobileFiles.ts`
  - `Files.ts`
  - `index.ts`

### Import Style
- **Relative imports** are preferred:
  ```go
  import "../utils"
  ```
  ```typescript
  import { EmojiList } from './emojiList'
  ```

### Export Style
- **Named exports** are used:
  ```go
  // Go example
  func ExportedFunction() {}
  ```
  ```typescript
  // TypeScript example
  export function searchEmoji() { ... }
  ```

### Commit Messages
- **Freeform style**, average length ~65 characters.
- No strict prefixing, but messages are concise and descriptive.

## Workflows

### Update Lute JS and Go Modules
**Trigger:** When making changes to HTML parsing, selection, or table clipping features that require updates to the Lute library and Go dependencies.  
**Command:** `/update-lute-go`

1. Update `app/stage/protyle/js/lute/lute.min.js` with the latest Lute JS library.
2. Update `kernel/go.mod` and `kernel/go.sum` to synchronize Go dependencies.
3. Commit all updated files together.

**Example:**
```bash
cp /path/to/new/lute.min.js app/stage/protyle/js/lute/lute.min.js
go mod tidy
git add app/stage/protyle/js/lute/lute.min.js kernel/go.mod kernel/go.sum
git commit -m "Update Lute JS and Go modules for HTML selection improvements"
```

---

### Electron Version Upgrade
**Trigger:** When upgrading Electron to a new version.  
**Command:** `/upgrade-electron`

1. Update `app/package.json` with the new Electron version.
2. Update `app/pnpm-lock.yaml` to lock dependencies.
3. Update `.github/CONTRIBUTING.md` and `.github/CONTRIBUTING_zh_CN.md` for build instructions or compatibility notes.
4. Commit all related files together.

**Example:**
```bash
# Edit app/package.json to set new Electron version
pnpm install
git add app/package.json app/pnpm-lock.yaml .github/CONTRIBUTING.md .github/CONTRIBUTING_zh_CN.md
git commit -m "Upgrade Electron to vXX.YY.Z and update documentation"
```

---

### Merge Dev Branch
**Trigger:** When synchronizing the local dev branch with upstream changes.  
**Command:** `/merge-dev`

1. Fetch the latest changes from the remote `dev` branch.
2. Merge changes into the local `dev` branch.
3. Resolve any conflicts.
4. Commit the merged files.

**Example:**
```bash
git fetch origin dev
git checkout dev
git merge origin/dev
# Resolve conflicts if any
git add .
git commit -m "Merge remote dev branch"
```

---

### Fix or Improve Feature with Related Files
**Trigger:** When fixing a bug or improving a feature that spans multiple related files (e.g., emoji search, hint system, UI components).  
**Command:** `/fix-feature`

1. Identify all files related to the feature.
2. Update implementation, types, and tests as needed.
3. Commit all related files together.

**Example:**
```bash
# Edit files: app/src/emoji/index.ts, app/src/protyle/hint/index.ts, etc.
git add app/src/emoji/index.ts app/src/protyle/hint/index.ts app/src/types/index.d.ts
git commit -m "Improve emoji search and update hint system"
```

---

### SCSS Style Fix or Improvement
**Trigger:** When updating the appearance or fixing style bugs in UI components.  
**Command:** `/fix-style`

1. Identify affected SCSS files (e.g., `_list.scss`, `_menu.scss`, `base.scss`).
2. Update styles as needed.
3. Commit all related SCSS files together.

**Example:**
```bash
# Edit SCSS files: app/src/assets/scss/component/_list.scss, etc.
git add app/src/assets/scss/component/_list.scss app/src/assets/scss/component/_menu.scss
git commit -m "Fix menu and list component styles"
```

## Testing Patterns

- **Test Framework:** Unknown (not explicitly detected).
- **File Pattern:** Test files follow the `*.test.*` naming convention.
  - Example: `emoji.test.ts`, `hint.test.ts`
- **Test Placement:** Tests are placed alongside implementation files or in dedicated test directories.

**Example:**
```go
// Go test example: kernel/feature/feature_test.go
func TestFeatureFunction(t *testing.T) {
    // test logic
}
```
```typescript
// TypeScript test example: app/src/emoji/emoji.test.ts
import { searchEmoji } from './index'
test('searchEmoji returns correct results', () => {
  expect(searchEmoji('smile')).toContain('😊')
})
```

## Commands

| Command           | Purpose                                                      |
|-------------------|--------------------------------------------------------------|
| /update-lute-go   | Update Lute JS library and synchronize Go dependencies       |
| /upgrade-electron | Upgrade Electron version and update related documentation    |
| /merge-dev        | Merge changes from the remote dev branch                     |
| /fix-feature      | Fix or improve a feature across multiple related files       |
| /fix-style        | Fix or improve SCSS styles for UI components                 |
```
