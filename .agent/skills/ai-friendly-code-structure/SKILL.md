---
name: ai-friendly-code-structure
description: Defines AI-friendly code organization, refactoring boundaries, and navigation metadata conventions for Antigravity projects. Use when creating or refactoring code, especially when files are large, features are growing, or agents need faster task-to-file discovery without scanning unrelated files.
---

# AI-Friendly Code Structure

Follow this skill to keep code easy for AI agents and humans to navigate, modify, and review.

## When to use this skill

- Use this when creating new features or modules.
- Use this when refactoring oversized files or mixed-responsibility code.
- Use this when improving discoverability so agents can find the right files quickly.
- Use this when adding architecture or repository navigation documentation.

## How to use it

Execute the workflow below in order.

### 1) Apply pre-edit decision tree

Organize code so an agent can:

- find the correct files quickly,
- make small, safe edits,
- avoid scanning unrelated large files,
- preserve architecture decisions.

Use this before editing:

1. Is the target file over 500 lines?
- Yes: split by responsibility before adding new logic.
- No: continue.

2. Is new logic feature-specific?
- Yes: place under that feature folder.
- No: place in shared only if reused by at least 2 features.

3. Is the task discoverable from navigation docs?
- No: update `AI_INDEX.md` and `AI_FILE_MAP.yaml` in the same change.
- Yes: continue.

4. Does the change touch sensitive paths?
- Yes: verify `critical_paths` in `AI_FILE_MAP.yaml` and keep edits minimal.
- No: continue.

### 2) Enforce structure conventions

- Prefer feature-first organization.
- Keep one primary responsibility per file.
- Use predictable names over clever names.
- Keep side effects at boundaries (API/IO/framework edges).
- Keep domain logic pure where possible.
- Avoid circular imports.

Suggested layout:

```text
src/
  features/
    <feature>/
      api/
      domain/
      ui/
      tests/
      README.md
  shared/
```

### 3) Enforce file and function size limits

- Target file size: 300 lines or less.
- Warning threshold: over 500 lines, refactor required unless justified.
- Target function size: 60 lines or less.
- Warning threshold: over 100 lines, split into helpers.

### 4) Maintain required navigation files

Maintain these at repository root:

1. `AI_INDEX.md`
- Human/agent navigation map.
- Include: project purpose, entry points, feature map, common tasks -> files, test commands, sensitive files.

2. `AI_FILE_MAP.yaml`
- Machine-readable task-to-file map.
- Include sections:
  - `tasks`
  - `features`
  - `critical_paths`
  - `glossary`

Maintain feature-level guide:

3. `src/features/<feature>/README.md`
- Include ownership, key files, data flow, and common edit paths.

Maintain architecture history:

4. `DECISIONS.md` (or ADRs)
- Record non-obvious architecture constraints.

### 5) Reject anti-patterns

- God files mixing unrelated concerns.
- Oversized `utils` files with business logic from many domains.
- Cross-feature imports that bypass feature boundaries.
- Hidden behavior in barrel `index` files.
- Duplicate business rules in multiple modules.

### 6) Apply refactor and PR rules

- If touching a file over 500 lines, include a split in the same change or provide a short justification.
- If adding a feature, update navigation files in the same change:
  - `AI_INDEX.md`
  - `AI_FILE_MAP.yaml`
  - `src/features/<feature>/README.md`
- Preserve behavior with tests whenever refactoring.

### 7) Use scripts as black boxes

If this skill includes scripts in `scripts/`, run script help first:

```bash
./scripts/<script-name> --help
```

Treat scripts as black boxes unless modification is required.

## Output checklist

Before finishing, verify:

- New or changed code is in the correct feature/shared location.
- No new large mixed-responsibility files were introduced.
- Navigation docs match actual file locations.
- Architecture constraints remain respected.
